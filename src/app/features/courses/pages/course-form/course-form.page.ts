import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LucideArrowLeft, LucideSave, LucidePlus, LucideDynamicIcon } from '@lucide/angular';
import { CourseStateService } from '@core/services/course-state.service';
import { NotificationService } from '@core/services/notification.service';
import { CourseService } from '@core/services/course.service';
import { CategoryService } from '@core/services/category.service';
import { Category } from '@core/models/category.model';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AppInputComponent } from '@shared/components/app-input/app-input.component';
import { AppToggleComponent } from '@shared/components/app-toggle/app-toggle.component';
import { AppButtonComponent } from '@shared/components/app-button/app-button.component';

@Component({
  selector: 'app-course-form',
  imports: [
    ReactiveFormsModule,
    LucideArrowLeft,
    LucideDynamicIcon,
    PageHeaderComponent,
    AppInputComponent,
    AppToggleComponent,
    AppButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './course-form.page.html',
  styleUrl: './course-form.page.css',
})
export class CourseFormPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly courseService = inject(CourseService);
  private readonly categoryService = inject(CategoryService);
  private readonly courseState = inject(CourseStateService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly LucideSave = LucideSave;
  protected readonly LucidePlus = LucidePlus;

  readonly id = input<string | undefined>(undefined);

  protected readonly isEditMode = computed(() => this.id() !== undefined);
  protected readonly pageTitle = computed(() => (this.isEditMode() ? 'Edit Course' : 'New Course'));
  protected readonly pageSubtitle = computed(() =>
    this.isEditMode()
      ? 'Update the course details below.'
      : 'Fill in the details to create a new course.',
  );
  protected readonly submitLabel = computed(() =>
    this.isEditMode() ? 'Save changes' : 'Create course',
  );
  protected readonly saving = signal(false);
  protected readonly categories = signal<Category[]>([]);

  protected readonly categoryOptions = computed(() =>
    this.categories().map((c) => ({ value: c.name, label: c.name })),
  );

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    description: ['', Validators.required],
    category: ['', Validators.required],
    instructor: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    duration: [1, [Validators.required, Validators.min(1)]],
    thumbnail: ['', Validators.required],
    status: [false],
  });

  private _initialFormValue = this.form.getRawValue();
  private readonly titleValue = toSignal(this.form.get('title')!.valueChanges);
  private _slugManuallyEdited = false;

  public hasUnsavedChanges(): boolean {
    return JSON.stringify(this.form.getRawValue()) !== JSON.stringify(this._initialFormValue);
  }

  constructor() {
    // Auto-generate slug from title unless user manually edited it
    effect(() => {
      const title = this.titleValue();
      if (title && !this._slugManuallyEdited) {
        this.form.get('slug')!.setValue(this.slugify(title), { emitEvent: false });
      }
    });

    // Load selected course when editing
    effect(() => {
      const id = this.id();
      if (id) {
        this.courseState.selectCourse(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
      }
    });

    // Patch form when selected course is loaded
    effect(() => {
      const course = this.courseState.selectedCourse();
      if (course && this.isEditMode()) {
        this._slugManuallyEdited = true;
        this.form.patchValue({
          title: course.title,
          slug: course.slug,
          description: course.description,
          category: course.category,
          instructor: course.instructor,
          price: course.price,
          duration: course.duration,
          thumbnail: course.thumbnail,
          status: course.status,
        });
        this.form.markAsPristine(); // ✅ تنظيف الـ dirty state بعد التحميل
        this._initialFormValue = this.form.getRawValue();
      }
    });
  }

  ngOnInit(): void {
    this.categoryService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cats) => this.categories.set(cats));

    // Detect manual slug edits
    this.form
      .get('slug')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._slugManuallyEdited = true;
      });
  }

  protected getError(field: string): string {
    const ctrl: AbstractControl | null = this.form.get(field);
    if (!ctrl || !ctrl.touched || !ctrl.errors) return '';
    if (ctrl.errors['required'])
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
    if (ctrl.errors['minlength'])
      return `Must be at least ${ctrl.errors['minlength'].requiredLength} characters.`;
    if (ctrl.errors['min']) return `Must be at least ${ctrl.errors['min'].min}.`;
    if (ctrl.errors['pattern']) return 'Only lowercase letters, numbers, and hyphens allowed.';
    return '';
  }

  protected goBack(): void {
    this.router.navigate(['/courses']);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const dto = this.form.getRawValue() as {
      title: string;
      slug: string;
      description: string;
      category: string;
      instructor: string;
      price: number;
      duration: number;
      thumbnail: string;
      status: boolean;
    };

    const obs$ = this.isEditMode()
      ? this.courseService.update(this.id()!, dto)
      : this.courseService.create(dto);

    obs$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.form.markAsPristine(); // ✅ تنظيف الـ dirty state
        this._initialFormValue = this.form.getRawValue();
        this.notificationService.success(
          this.isEditMode() ? 'Course updated successfully.' : 'Course created successfully.',
        );
        this.courseState
          .loadCourses()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.router.navigate(['/courses']));
      },
      error: (err: Error) => {
        this.saving.set(false);
        this.notificationService.error(err.message);
      },
    });
  }
  slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

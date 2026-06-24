import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideArrowLeft,
  LucidePencil,
  LucideUsers,
  LucideStar,
  LucideClock,
  LucideDollarSign,
  LucideBookOpen,
} from '@lucide/angular';
import { CourseStateService } from '@core/services/course-state.service';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AppBadgeComponent } from '@shared/components/app-badge/app-badge.component';
import { AppToggleComponent } from '@shared/components/app-toggle/app-toggle.component';
import { EmptyErrorStateComponent } from '@shared/components/empty-error-state/empty-error-state.component';

type Tab = 'curriculum' | 'students' | 'reviews';

@Component({
  selector: 'app-course-details',
  imports: [
    FormsModule,
    LucideArrowLeft,
    LucidePencil,
    LucideUsers,
    LucideStar,
    LucideClock,
    LucideDollarSign,
    LucideBookOpen,
    PageHeaderComponent,
    AppBadgeComponent,
    AppToggleComponent,
    EmptyErrorStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './course-details.page.html',
  styleUrl: './course-details.page.css',
})
export class CourseDetailsPage {
  protected readonly courseState = inject(CourseStateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly id = input<string | null>(null);

  protected readonly activeTab = signal<Tab>('curriculum');

  protected readonly tabs: { key: Tab; label: string; icon: unknown }[] = [
    { key: 'curriculum', label: 'Curriculum', icon: LucideBookOpen },
    { key: 'students', label: 'Students', icon: LucideUsers },
    { key: 'reviews', label: 'Reviews', icon: LucideStar },
  ];

  protected readonly pageTitle = computed(
    () => this.courseState.selectedCourse()?.title ?? 'Course Details',
  );

  constructor() {
    effect(() => {
      const id = this.id();
      if (id) {
        this.courseState.selectCourse(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
      }
    });
  }

  protected goBack(): void {
    this.router.navigate(['/courses']);
  }

  protected goToEdit(): void {
    const id = this.courseState.selectedCourse()?.id;
    if (id) this.router.navigate(['/courses', id, 'edit']);
  }

  protected reload(): void {
    const id = this.id();
    if (id) {
      this.courseState.selectCourse(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
  }
}

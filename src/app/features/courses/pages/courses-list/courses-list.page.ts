import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import {
  LucidePlus,
  LucideSearch,
  LucideBookOpen,
  LucideCheckCircle,
  LucideXCircle,
  LucideTrendingUp,
} from '@lucide/angular';
import { CourseStateService } from '@core/services/course-state.service';
import { ConfirmationDialogService } from '@core/services/confirmation-dialog.service';
import { TableService } from '@core/services/table.service';
import { Course } from '@core/models/course.model';
import { TableColumn } from '@core/models/table-column.model';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TableBuilderComponent } from '@shared/components/table-builder/table-builder.component';
import {
  CourseStatsRowComponent,
  StatCard,
} from '@features/courses/components/course-stats-row/course-stats-row.component';

@Component({
  selector: 'app-courses-list',
  imports: [
    LucidePlus,
    LucideSearch,
    PageHeaderComponent,
    TableBuilderComponent,
    CourseStatsRowComponent,
  ],
  templateUrl: './courses-list.page.html',
  styleUrl: './courses-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesListPage implements OnInit {
  protected readonly courseState = inject(CourseStateService);
  protected readonly tableService = inject(TableService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(ConfirmationDialogService);
  private readonly searchSubject = new Subject<string>();

  readonly columns: TableColumn<Course>[] = [
    { key: 'title', label: 'Title', sortable: true, renderAs: 'truncate', width: '220px' },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'instructor', label: 'Instructor', sortable: true },
    { key: 'price', label: 'Price', sortable: true, renderAs: 'currency' },
    { key: 'studentsCount', label: 'Students', sortable: true },
    { key: 'status', label: 'Status', renderAs: 'toggle', width: '160px' },
    { key: 'actions', label: 'Actions', renderAs: 'actions', width: '120px' },
  ];

  protected readonly filteredCourses = this.tableService.filteredData(() =>
    this.courseState.courses(),
  );

  protected readonly filteredCount = this.tableService.filteredCount(() =>
    this.courseState.courses(),
  );

  protected readonly totalPages = computed(() =>
    Math.ceil(this.filteredCount() / this.tableService.pageSize()),
  );

  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );

  protected readonly statsCards = computed<StatCard[]>(() => [
    {
      label: 'Total Courses',
      value: this.courseState.courses().length,
      icon: LucideBookOpen,
      colorClass: 'stat-primary',
    },
    {
      label: 'Published',
      value: this.courseState.publishedCount(),
      icon: LucideCheckCircle,
      colorClass: 'stat-success',
    },
    {
      label: 'Unpublished',
      value: this.courseState.unpublishedCount(),
      icon: LucideXCircle,
      colorClass: 'stat-gray',
    },
    {
      label: 'Avg. Rating',
      value: this.avgRating(),
      icon: LucideTrendingUp,
      colorClass: 'stat-warning',
    },
  ]);

  protected readonly avgRating = computed(() => {
    const list = this.courseState.courses();
    if (!list.length) return 0;
    const sum = list.reduce((a, c) => a + c.rating, 0);
    return Math.round(sum / list.length);
  });

  protected readonly statusFilterValue = computed(() => {
    const f = this.tableService.statusFilter();
    if (f === null) return 'all';
    return String(f);
  });

  ngOnInit(): void {
    this.courseState.loadCourses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();

    this.tableService.reset();

    this.searchSubject
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((q) => this.tableService.setSearch(q));
  }

  protected retryLoad(): void {
    this.courseState.loadCourses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  protected onSearch(event: Event): void {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  protected onStatusFilter(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    if (val === 'all') this.tableService.setStatusFilter(null);
    else this.tableService.setStatusFilter(val === 'true');
  }

  protected onSort(key: string | keyof Course): void {
    this.tableService.setSort(key as keyof Course);
  }

  protected onView(course: Course): void {
    this.router.navigate(['/courses', course.id]);
  }

  protected onEdit(course: Course): void {
    this.router.navigate(['/courses', course.id, 'edit']);
  }

  protected onDeleteRequest(course: Course): void {
    this.dialogService
      .confirm({
        title: 'Delete course?',
        message: `Are you sure you want to delete "${course.title}"? This action cannot be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        variant: 'danger',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.courseState
            .deleteCourse(course.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        }
      });
  }

  protected onToggleStatus(event: { id: string; status: boolean }): void {
    this.courseState
      .toggleStatus(event.id, event.status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected prevPage(): void {
    this.tableService.currentPage.update((p) => Math.max(1, p - 1));
  }

  protected nextPage(): void {
    this.tableService.currentPage.update((p) => Math.min(this.totalPages(), p + 1));
  }

  protected goToNew(): void {
    this.router.navigate(['/courses', 'new']);
  }
}

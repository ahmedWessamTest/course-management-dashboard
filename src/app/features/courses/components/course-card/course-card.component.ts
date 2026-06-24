import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucidePencil, LucideStar, LucideUsers, LucideClock } from '@lucide/angular';
import { Course } from '@core/models/course.model';
import { AppBadgeComponent } from '@shared/components/app-badge/app-badge.component';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css',
  imports: [LucidePencil, LucideStar, LucideUsers, LucideClock, AppBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent {
  readonly course = input.required<Course>();
  readonly edit = output<Course>();
}

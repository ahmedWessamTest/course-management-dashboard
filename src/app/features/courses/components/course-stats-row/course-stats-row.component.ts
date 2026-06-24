import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideDynamicIcon, LucideIconData } from '@lucide/angular';

export interface StatCard {
  label: string;
  value: number;
  icon: any;
  colorClass: string;
}

@Component({
  selector: 'app-course-stats-row',
  templateUrl: './course-stats-row.component.html',
  styleUrl: './course-stats-row.component.css',
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseStatsRowComponent {
  readonly stats = input.required<StatCard[]>();
}

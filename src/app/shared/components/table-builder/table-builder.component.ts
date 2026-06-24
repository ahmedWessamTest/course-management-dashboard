import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
} from '@angular/core';
import {
  LucideEye, LucidePencil, LucideTrash2,
  LucideChevronUp, LucideChevronDown, LucideChevronsUpDown,
} from '@lucide/angular';
import { FormsModule } from '@angular/forms';
import { TableColumn } from '@core/models/table-column.model';
import { Course } from '@core/models/course.model';
import { AppBadgeComponent } from '@shared/components/app-badge/app-badge.component';
import { AppToggleComponent } from '@shared/components/app-toggle/app-toggle.component';
import { EmptyErrorStateComponent } from '@shared/components/empty-error-state/empty-error-state.component';
import { TruncatePipe } from '@shared/pipes/truncate.pipe';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    FormsModule,
    LucideEye, LucidePencil, LucideTrash2, LucideChevronUp, LucideChevronDown, LucideChevronsUpDown,
    AppBadgeComponent,
    AppToggleComponent,
    EmptyErrorStateComponent,
    TruncatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-builder.component.html',
  styleUrl: './table-builder.component.css',
})
export class TableBuilderComponent {

  readonly tableData = input.required<Course[]>();
  constructor() {
    effect(() => {
      console.log(this.tableData());

    })
  }
  readonly columns = input.required<TableColumn<Course>[]>();
  readonly loading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly sortColumn = input<string | null>(null);
  readonly sortDir = input<'asc' | 'desc' | null>(null);

  readonly view = output<Course>();
  readonly edit = output<Course>();
  readonly delete = output<Course>();
  readonly sort = output<string | keyof Course>();
  readonly toggleStatus = output<{ id: string; status: boolean }>();
  readonly retry = output<void>();

  protected getCellValue(row: Course, key: string | keyof Course): any {
    return row[key as keyof Course];
  }

  protected getSortDir(key: string | keyof Course): 'ascending' | 'descending' | 'none' {
    if (this.sortColumn() !== key) return 'none';
    return this.sortDir() === 'asc' ? 'ascending' : 'descending';
  }
}

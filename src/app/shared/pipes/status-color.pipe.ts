import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusColor' })
export class StatusColorPipe implements PipeTransform {
  transform(status: boolean): string {
    return status ? 'status--published' : 'status--unpublished';
  }
}

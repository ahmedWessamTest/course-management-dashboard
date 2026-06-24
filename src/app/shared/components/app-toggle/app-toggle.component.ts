import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-toggle',
  templateUrl: './app-toggle.component.html',
  styleUrl: './app-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppToggleComponent),
      multi: true,
    },
  ],
})
export class AppToggleComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly onLabel = input<string>('Published');
  readonly offLabel = input<string>('Unpublished');
  readonly toggleId = input<string>(`toggle-${Math.random().toString(36).slice(2)}`);

  protected readonly checked = signal<boolean>(false);
  protected readonly isDisabled = signal<boolean>(false);

  private onChange: (v: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(val: boolean): void {
    this.checked.set(!!val);
  }

  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  protected toggle(): void {
    if (this.isDisabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
  }
}

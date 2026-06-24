import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './app-input.component.html',
  styleUrl: './app-input.component.css',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true,
    },
  ],
})
export class AppInputComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<'text' | 'number' | 'textarea' | 'select' | 'url'>('text');
  readonly errorMessage = input<string>('');
  readonly inputId = input<string>(`input-${Math.random().toString(36).slice(2)}`);
  readonly options = input<{ value: string; label: string }[]>([]);

  protected readonly value = signal<string>('');
  protected readonly isDisabled = signal<boolean>(false);

  protected onTouched: () => void = () => { };
  private onChange: (v: unknown) => void = () => { };

  writeValue(val: unknown): void {
    this.value.set(val != null ? String(val) : '');
  }

  registerOnChange(fn: (v: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }
}

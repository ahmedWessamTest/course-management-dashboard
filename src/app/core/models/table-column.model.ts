export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  renderAs?: 'text' | 'badge' | 'toggle' | 'actions' | 'currency' | 'date' | 'truncate';
}

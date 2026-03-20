export type FieldType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'time'
  | 'number'
  | 'select'
  | 'tel'
  | 'email'
  | 'table';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  columns?: string[];
  defaultValue?: string;
  helpText?: string;
}

export type MessageGroupType = 'weekly' | 'operational' | 'leadership' | 'general';

export interface MessageTemplate {
  id: string;
  type: string;
  group: MessageGroupType;
  title: string;
  description?: string;
  icon: string;
  fields: FormField[];
  generateSubject: (data: FormData) => string;
  generateBody: (data: FormData) => string;
}

export interface FormData {
  [key: string]: string | string[] | Record<string, string>[];
}

export interface GeneratedMessage {
  subject: string;
  body: string;
  signature: string;
  fullText: string;
  createdAt: Date;
}

export interface MessageGroupInfo {
  id: MessageGroupType;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'gold';
}

export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ExcelImportResult {
  success: boolean;
  data: Record<string, string>[];
  errors: string[];
  rowCount: number;
}

export interface AppConfig {
  universityName: string;
  departmentName: string;
  defaultSignature: string;
  contactEmail: string;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  ariaLabel?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
}

export interface InputProps {
  id: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export interface TextareaProps {
  id: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export interface SelectProps {
  id: string;
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export interface TableProps {
  columns: string[];
  data: Record<string, string>[];
  onRowAdd?: () => void;
  onRowDelete?: (index: number) => void;
  onCellChange?: (rowIndex: number, colIndex: number, value: string) => void;
  readOnly?: boolean;
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gold';
  size?: 'sm' | 'md';
  className?: string;
}

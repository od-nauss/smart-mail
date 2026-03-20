import { Badge } from '@/components/ui/Badge';
import { MessageTemplate } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  template: MessageTemplate;
  onClick: () => void;
  variant?: 'grid' | 'list';
}

export function MessageTypeCard({ template, onClick, variant = 'grid' }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-2xl border border-naif-gold/20 bg-white/80 p-4 text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
        variant === 'list' ? 'flex items-center justify-between gap-4' : 'min-h-[150px] flex flex-col justify-between'
      )}
    >
      <div className={cn(variant === 'list' ? 'flex-1' : '')}>
        <h3 className="mb-2 text-sm sm:text-base font-bold text-naif-primary">{template.title}</h3>
        <p className="text-xs sm:text-sm leading-6 text-gray-500">{template.description}</p>
      </div>
      <div className={cn('mt-3', variant === 'list' && 'mt-0')}>
        <Badge variant={template.group === 'operational' || template.group === 'general' ? 'gold' : 'primary'} size="sm">
          {template.fields.length} حقول
        </Badge>
      </div>
    </button>
  );
}

import { MessageTemplate } from '@/lib/types';

interface Props {
  template: MessageTemplate;
  onClick: () => void;
  variant?: 'grid' | 'list';
}

export function MessageTypeCard({ template, onClick, variant = 'grid' }: Props) {
  const fieldsCount = Array.isArray(template.fields) ? template.fields.length : 0;
  const isList = variant === 'list';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full rounded-xl border border-[#ece4d7] bg-[#fcfbf8] text-right transition
        hover:border-[#d0b284] hover:bg-white
        ${isList ? 'px-4 py-4' : 'px-4 py-5'}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-lg font-medium leading-7 text-[#016564]">
            {template.title}
          </h4>

          {template.description ? (
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {template.description}
            </p>
          ) : null}
        </div>

        <span className="shrink-0 rounded-full bg-[#f3eee4] px-2.5 py-1 text-xs text-[#b89a5e]">
          {fieldsCount} حقول
        </span>
      </div>
    </button>
  );
}
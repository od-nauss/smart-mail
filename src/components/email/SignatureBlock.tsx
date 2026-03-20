import { APP_CONFIG } from '@/core/config';

export default function SignatureBlock() {
  return (
    <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4 text-sm text-slate-700">
      <p className="font-bold">فريق عمل {APP_CONFIG.organization.department}</p>
      <p>{APP_CONFIG.organization.training}</p>
      <p>{APP_CONFIG.organization.name}</p>
    </div>
  );
}

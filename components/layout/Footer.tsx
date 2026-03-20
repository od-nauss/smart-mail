import { APP_CONFIG } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-naif-dark border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-400 sm:text-right">
          جميع الحقوق محفوظة © {currentYear} - {APP_CONFIG.universityName}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>الإصدار 1.0.0</span>
          <span className="h-1 w-1 rounded-full bg-gray-600" />
          <a href={`mailto:${APP_CONFIG.contactEmail}`} className="transition-colors hover:text-naif-gold">
            {APP_CONFIG.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}

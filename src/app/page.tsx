import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { departmentList } from '@/core/config';

const features = [
  'توليد بريد أسبوعي لعدة جهات من بيانات موحدة',
  'مكتبة سيناريوهات تشغيلية واعتمادية وتنسيقية',
  'دعم الاستيراد من Excel وتقليل الإدخال اليدوي',
  'معاينة احترافية ونسخ سريع للنص النهائي',
];

export default function HomePage() {
  return (
    <AppShell>
      <section className="hero-gradient border-b border-sand-200">
        <div className="container-app py-10 sm:py-14 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div className="fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 ring-1 ring-primary-200">
                منصة مؤسسية عربية ذكية
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                منصة المراسلات الذكية
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
                بيئة احترافية لصياغة المراسلات الرسمية والتشغيلية لإدارة عمليات التدريب، بتجربة عربية راقية ومتجاوبة مع الجوال والتابلت وسطح المكتب.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/weekly"><Button>ابدأ بالبيانات الأسبوعية</Button></Link>
                <Link href="/scenarios"><Button variant="secondary">مكتبة السيناريوهات</Button></Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {features.map((item) => (
                  <div key={item} className="glass-panel rounded-2xl px-4 py-3 text-sm text-slate-700">
                    ✦ {item}
                  </div>
                ))}
              </div>
            </div>
            <Card className="overflow-hidden rounded-[2rem] border-sand-200 bg-white p-0 shadow-elevated">
              <div className="bg-primary-500 p-6 text-white">
                <h2 className="text-xl font-bold">الوحدات الرئيسية</h2>
                <p className="mt-2 text-sm text-primary-50">مصممة برؤية مؤسسية متوافقة مع هوية جامعة نايف.</p>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <Link href="/weekly" className="rounded-2xl border border-sand-200 p-4 hover:border-primary-300 hover:bg-primary-50/40">
                  <div className="text-2xl">📅</div>
                  <h3 className="mt-2 font-bold">البيانات الأسبوعية</h3>
                  <p className="mt-1 text-sm text-slate-600">إدخال موحد للدورات مع دعم Excel</p>
                </Link>
                <Link href="/weekly/emails" className="rounded-2xl border border-sand-200 p-4 hover:border-primary-300 hover:bg-primary-50/40">
                  <div className="text-2xl">✉️</div>
                  <h3 className="mt-2 font-bold">البريد الأسبوعي</h3>
                  <p className="mt-1 text-sm text-slate-600">توليد مخصص لكل جهة</p>
                </Link>
                <Link href="/scenarios" className="rounded-2xl border border-sand-200 p-4 hover:border-primary-300 hover:bg-primary-50/40">
                  <div className="text-2xl">🧠</div>
                  <h3 className="mt-2 font-bold">السيناريوهات</h3>
                  <p className="mt-1 text-sm text-slate-600">طلبات تشغيلية واعتمادية جاهزة</p>
                </Link>
                <Link href="/about" className="rounded-2xl border border-sand-200 p-4 hover:border-primary-300 hover:bg-primary-50/40">
                  <div className="text-2xl">ℹ️</div>
                  <h3 className="mt-2 font-bold">حول المنصة</h3>
                  <p className="mt-1 text-sm text-slate-600">إرشادات الاستخدام والتطوير</p>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <div className="container-app py-12">
        <PageHeader title="الجهات المستهدفة" subtitle="المنصة تولد مخرجات مختلفة من نفس البيانات حسب طبيعة الجهة." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {departmentList.map((d) => (
            <Card key={d.id} className="rounded-2xl border-sand-200">
              <div className="flex items-start gap-4">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${d.color}`}>{d.icon}</div>
                <div>
                  <h3 className="font-bold text-slate-900">{d.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{d.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

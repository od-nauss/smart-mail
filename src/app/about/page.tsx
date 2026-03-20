import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <AppShell>
      <div className="container-app py-8">
        <PageHeader title="حول المنصة" subtitle="دليل مختصر لاستخدام منصة المراسلات الذكية." />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h3 className="text-lg font-bold">كيف تعمل المنصة؟</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>1. أدخل بيانات الأسبوع يدويًا أو استوردها من Excel.</li>
              <li>2. اختر الجهة المستهدفة من صفحة البريد الأسبوعي.</li>
              <li>3. عاين البريد النهائي وانسخه أو طوّره.</li>
              <li>4. استخدم مكتبة السيناريوهات للطلبات التشغيلية والاعتمادية.</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-bold">التوافق والاستجابة</h3>
            <p className="mt-3 text-sm text-slate-600">
              صممت المنصة لتعمل بكفاءة على الجوال والتابلت والمتصفح المكتبي مع واجهة عربية RTL ومساحات متوازنة لسهولة القراءة والإدخال.
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

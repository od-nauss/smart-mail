'use client';

import { useCallback, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Modal } from '@/components/ui/Modal';
import { DynamicForm } from '@/components/forms/DynamicForm';
import { MessagePreview } from '@/components/message/MessagePreview';
import { MessageGroup } from '@/components/message/MessageGroup';
import { MessageTypeCard } from '@/components/message/MessageTypeCard';
import { MESSAGE_GROUPS, DEFAULT_SIGNATURE } from '@/lib/constants';
import { allTemplates, getTemplatesByGroup } from '@/lib/templates';
import { FormData, GeneratedMessage, MessageTemplate } from '@/lib/types';
import { useModal } from '@/hooks/useModal';
import { replaceTableTokens } from '@/lib/utils';

const featureCards = [
  {
    title: 'صياغة عربية احترافية',
    description: 'رسائل رسمية مصاغة بنبرة إدارية رصينة ومناسبة لبيئة الجامعة.',
  },
  {
    title: 'اختصار الوقت',
    description: 'اختيار القالب ثم تعبئة البيانات ثم نسخ الرسالة مباشرة دون تعقيد.',
  },
  {
    title: 'جاهزية تشغيلية',
    description: 'واجهة سريعة وواضحة تدعم الجوال والتابلت وسطح المكتب بكفاءة عالية.',
  },
];

const flowSteps = [
  { id: '01', title: 'اختر نوع المراسلة', description: 'من المجموعات الرئيسية المعروضة أمامك.' },
  { id: '02', title: 'أدخل البيانات المطلوبة', description: 'النموذج يتكيّف تلقائيًا مع نوع الرسالة.' },
  { id: '03', title: 'انسخ الرسالة الجاهزة', description: 'معاينة فورية ثم استخدام مباشر في البريد.' },
];

export default function HomePage() {
  const { isOpen, open: openModal, close: closeModal } = useModal();
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<GeneratedMessage | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const templatesByGroup = useMemo(
    () => ({
      weekly: getTemplatesByGroup('weekly'),
      operational: getTemplatesByGroup('operational'),
      leadership: getTemplatesByGroup('leadership'),
      general: getTemplatesByGroup('general'),
    }),
    []
  );

  const handleTemplateSelect = useCallback(
    (template: MessageTemplate) => {
      setSelectedTemplate(template);
      setGeneratedMessage(null);
      setShowPreview(false);
      openModal();
    },
    [openModal]
  );

  const handleFormSubmit = useCallback(
    (data: FormData) => {
      if (!selectedTemplate) return;

      const subject = replaceTableTokens(selectedTemplate.generateSubject(data), data);
      const body = replaceTableTokens(selectedTemplate.generateBody(data), data);

      const message: GeneratedMessage = {
        subject,
        body,
        signature: DEFAULT_SIGNATURE,
        fullText: `الموضوع: ${subject}\n\n${body}\n\n${DEFAULT_SIGNATURE}`,
        createdAt: new Date(),
      };

      setGeneratedMessage(message);
      setShowPreview(true);
    },
    [selectedTemplate]
  );

  const handleEdit = useCallback(() => setShowPreview(false), []);

  const handleNew = useCallback(() => {
    setGeneratedMessage(null);
    setShowPreview(false);
    setSelectedTemplate(null);
    closeModal();
  }, [closeModal]);

  const handleModalClose = useCallback(() => {
    closeModal();
    window.setTimeout(() => {
      setSelectedTemplate(null);
      setGeneratedMessage(null);
      setShowPreview(false);
    }, 150);
  }, [closeModal]);

  return (
    <>
      <Header />

      <main id="main-content" className="pattern-bg flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <section className="hero-mesh relative overflow-hidden rounded-[2rem] border border-naif-gold/25 bg-white/70 px-5 py-6 shadow-[0_24px_70px_-35px_rgba(1,101,100,0.35)] backdrop-blur-xl sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="fade-in">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-naif-gold/30 bg-white/80 px-4 py-2 text-xs font-bold text-naif-primary shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-naif-gold pulse-ring" />
                  منصة تنفيذية لمراسلات إدارة عمليات التدريب
                </div>

                <h1 className="mb-4 max-w-3xl text-3xl font-extrabold leading-[1.35] text-naif-primary sm:text-4xl lg:text-5xl">
                  أنشئ مراسلاتك الرسمية
                  <span className="highlight mx-2 text-naif-goldDark">بشكل أسرع</span>
                  وبمظهر مؤسسي يليق بجامعة نايف
                </h1>

                <p className="max-w-2xl text-sm leading-8 text-gray-600 sm:text-base lg:text-lg">
                  واجهة موحّدة تساعدك على اختيار القالب المناسب، تعبئة البيانات المطلوبة، ثم استخراج رسالة جاهزة
                  بصياغة عربية احترافية دون تشتيت أو تعقيد.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleTemplateSelect(allTemplates[0])}
                    className="btn-primary rounded-2xl px-5 py-3 text-sm font-bold text-white sm:px-6"
                  >
                    ابدأ بأول قالب
                  </button>
                  <a
                    href="#message-groups"
                    className="rounded-2xl border border-naif-gold/35 bg-white/80 px-5 py-3 text-sm font-bold text-naif-primary transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    تصفح جميع المراسلات
                  </a>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/70 bg-white/75 p-4 text-center shadow-sm">
                    <div className="text-2xl font-extrabold text-naif-primary sm:text-3xl">{allTemplates.length}</div>
                    <div className="mt-1 text-xs text-gray-500 sm:text-sm">نوع مراسلة</div>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/75 p-4 text-center shadow-sm">
                    <div className="text-2xl font-extrabold text-naif-goldDark sm:text-3xl">4</div>
                    <div className="mt-1 text-xs text-gray-500 sm:text-sm">مجموعات رئيسية</div>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/75 p-4 text-center shadow-sm">
                    <div className="text-2xl font-extrabold text-naif-primary sm:text-3xl">1</div>
                    <div className="mt-1 text-xs text-gray-500 sm:text-sm">دقيقة للإنجاز</div>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/75 p-4 text-center shadow-sm">
                    <div className="text-2xl font-extrabold text-naif-goldDark sm:text-3xl">RTL</div>
                    <div className="mt-1 text-xs text-gray-500 sm:text-sm">واجهة عربية كاملة</div>
                  </div>
                </div>
              </div>

              <div className="slide-up">
                <div className="glass-card rounded-[2rem] p-4 sm:p-5">
                  <div className="rounded-[1.5rem] bg-gradient-to-br from-naif-primary via-naif-dark to-[#033635] p-5 text-white shadow-[0_24px_55px_-28px_rgba(1,101,100,0.6)]">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/70">لوحة سريعة</p>
                        <h2 className="text-lg font-extrabold sm:text-xl">مؤشرات الاستخدام</h2>
                      </div>
                      <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-naif-goldLight">
                        جاهز للتشغيل
                      </div>
                    </div>

                    <div className="space-y-3">
                      {MESSAGE_GROUPS.map((group, index) => {
                        const count =
                          index === 0
                            ? templatesByGroup.weekly.length
                            : index === 1
                              ? templatesByGroup.operational.length
                              : index === 2
                                ? templatesByGroup.leadership.length
                                : templatesByGroup.general.length;

                        return (
                          <div
                            key={group.id}
                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
                          >
                            <div>
                              <p className="text-sm font-bold text-white">{group.title}</p>
                              <p className="text-xs text-white/70">{group.description}</p>
                            </div>
                            <div className="rounded-xl bg-white px-3 py-2 text-sm font-extrabold text-naif-primary">
                              {count}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4">
                      <p className="text-xs text-white/70">المحصلة</p>
                      <p className="mt-1 text-base font-bold text-naif-goldLight">
                        صياغة أسرع، مظهر أفضل، وتجربة استخدام أوضح.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {featureCards.map((item, index) => (
              <div
                key={item.title}
                className={`glass-card card-hover rounded-[1.75rem] p-5 fade-in stagger-${index + 1}`}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-naif-primary/15 to-naif-gold/25 text-lg font-extrabold text-naif-primary">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-naif-primary">{item.title}</h3>
                <p className="text-sm leading-7 text-gray-600">{item.description}</p>
              </div>
            ))}
          </section>

          <section className="mt-10">
            <div className="glass-card rounded-[2rem] p-5 sm:p-6">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-naif-goldDark">آلية العمل</p>
                  <h2 className="text-2xl font-extrabold text-naif-primary">ثلاث خطوات فقط</h2>
                </div>
                <p className="text-sm text-gray-500">بنية بسيطة وتجربة استخدام مباشرة دون تشتت</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {flowSteps.map((step) => (
                  <div key={step.id} className="rounded-[1.5rem] border border-naif-gold/18 bg-white/80 p-5 shadow-sm">
                    <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-naif-primary to-naif-light px-3 py-2 text-sm font-extrabold text-white">
                      {step.id}
                    </div>
                    <h3 className="mb-2 text-lg font-extrabold text-naif-primary">{step.title}</h3>
                    <p className="text-sm leading-7 text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="message-groups" className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <MessageGroup group={MESSAGE_GROUPS[0]} className="stagger-1">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {templatesByGroup.weekly.map((template) => (
                  <MessageTypeCard
                    key={template.id}
                    template={template}
                    onClick={() => handleTemplateSelect(template)}
                    variant="grid"
                  />
                ))}
              </div>
            </MessageGroup>

            <MessageGroup group={MESSAGE_GROUPS[1]} className="stagger-2">
              <div className="space-y-3">
                {templatesByGroup.operational.map((template) => (
                  <MessageTypeCard
                    key={template.id}
                    template={template}
                    onClick={() => handleTemplateSelect(template)}
                    variant="list"
                  />
                ))}
              </div>
            </MessageGroup>

            <MessageGroup group={MESSAGE_GROUPS[2]} className="stagger-3">
              <div className="space-y-3">
                {templatesByGroup.leadership.map((template) => (
                  <MessageTypeCard
                    key={template.id}
                    template={template}
                    onClick={() => handleTemplateSelect(template)}
                    variant="list"
                  />
                ))}
              </div>
            </MessageGroup>

            <MessageGroup group={MESSAGE_GROUPS[3]} className="stagger-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {templatesByGroup.general.map((template) => (
                  <MessageTypeCard
                    key={template.id}
                    template={template}
                    onClick={() => handleTemplateSelect(template)}
                    variant="grid"
                  />
                ))}
              </div>
            </MessageGroup>
          </section>
        </div>
      </main>

      <Footer />

      <Modal isOpen={isOpen} onClose={handleModalClose} title={selectedTemplate?.title || ''} size="lg">
        {selectedTemplate && !showPreview ? (
          <DynamicForm template={selectedTemplate} onSubmit={handleFormSubmit} />
        ) : null}

        {showPreview && generatedMessage ? (
          <MessagePreview message={generatedMessage} onEdit={handleEdit} onNew={handleNew} />
        ) : null}
      </Modal>
    </>
  );
}
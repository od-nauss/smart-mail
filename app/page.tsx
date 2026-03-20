'use client';

import { useState, useCallback, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Modal } from '@/components/ui/Modal';
import { DynamicForm } from '@/components/forms/DynamicForm';
import { MessagePreview } from '@/components/message/MessagePreview';
import { MessageGroup } from '@/components/message/MessageGroup';
import { MessageTypeCard } from '@/components/message/MessageTypeCard';
import { MESSAGE_GROUPS, DEFAULT_SIGNATURE } from '@/lib/constants';
import { getTemplatesByGroup } from '@/lib/templates';
import { MessageTemplate, GeneratedMessage, FormData } from '@/lib/types';
import { useModal } from '@/hooks/useModal';

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

  const handleTemplateSelect = useCallback((template: MessageTemplate) => {
    setSelectedTemplate(template);
    setGeneratedMessage(null);
    setShowPreview(false);
    openModal();
  }, [openModal]);

  const handleFormSubmit = useCallback((data: FormData) => {
    if (!selectedTemplate) return;

    const subject = selectedTemplate.generateSubject(data);
    const body = selectedTemplate.generateBody(data);

    const message: GeneratedMessage = {
      subject,
      body,
      signature: DEFAULT_SIGNATURE,
      fullText: `الموضوع: ${subject}\n\n${body}\n\n${DEFAULT_SIGNATURE}`,
      createdAt: new Date(),
    };

    setGeneratedMessage(message);
    setShowPreview(true);
  }, [selectedTemplate]);

  const handleEdit = useCallback(() => setShowPreview(false), []);

  const handleNew = useCallback(() => {
    setGeneratedMessage(null);
    setShowPreview(false);
    setSelectedTemplate(null);
    closeModal();
  }, [closeModal]);

  const handleModalClose = useCallback(() => {
    closeModal();
    setTimeout(() => {
      setSelectedTemplate(null);
      setGeneratedMessage(null);
      setShowPreview(false);
    }, 200);
  }, [closeModal]);

  return (
    <div className="page-shell min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="hero-panel mb-5 rounded-[28px] px-5 py-6 text-white sm:px-7 sm:py-7">
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">
                  منصة مراسلات تنفيذية
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
                  اختر نوع المراسلة مباشرة، عبّئ النموذج، ثم انسخ الرسالة بصياغة عربية رسمية مرتبة وجاهزة.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:min-w-[280px]">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-center">
                  <div className="text-lg font-semibold">4</div>
                  <div className="text-xs text-white/80">مجموعات</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-center">
                  <div className="text-lg font-semibold">جاهز</div>
                  <div className="text-xs text-white/80">للاستخدام</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-center">
                  <div className="text-lg font-semibold">RTL</div>
                  <div className="text-xs text-white/80">واجهة عربية</div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <MessageGroup group={MESSAGE_GROUPS[0]} className="fade-in">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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

            <MessageGroup group={MESSAGE_GROUPS[1]} className="fade-in">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {templatesByGroup.operational.map((template) => (
                  <MessageTypeCard
                    key={template.id}
                    template={template}
                    onClick={() => handleTemplateSelect(template)}
                    variant="grid"
                  />
                ))}
              </div>
            </MessageGroup>

            <MessageGroup group={MESSAGE_GROUPS[2]} className="fade-in">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {templatesByGroup.leadership.map((template) => (
                  <MessageTypeCard
                    key={template.id}
                    template={template}
                    onClick={() => handleTemplateSelect(template)}
                    variant="grid"
                  />
                ))}
              </div>
            </MessageGroup>

            <MessageGroup group={MESSAGE_GROUPS[3]} className="fade-in">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
          </div>
        </div>
      </main>

      <Footer />

      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title={selectedTemplate?.title || ''}
        size="lg"
      >
        {selectedTemplate && !showPreview && (
          <DynamicForm template={selectedTemplate} onSubmit={handleFormSubmit} />
        )}

        {showPreview && generatedMessage && (
          <MessagePreview
            message={generatedMessage}
            onEdit={handleEdit}
            onNew={handleNew}
          />
        )}
      </Modal>
    </div>
  );
}
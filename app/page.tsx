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
          <section className="fade-in mb-8 text-center sm:mb-12">
            <h1 className="mb-3 text-2xl font-bold text-naif-primary sm:text-3xl lg:text-4xl">إدارة عمليات التدريب</h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-naif-gray sm:text-base lg:text-lg">
              اختر نوع المراسلة المطلوبة لإنشاء رسالتك الرسمية خلال دقيقة واحدة
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
            <MessageGroup group={MESSAGE_GROUPS[0]} className="stagger-1">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {templatesByGroup.weekly.map((template) => (
                  <MessageTypeCard key={template.id} template={template} onClick={() => handleTemplateSelect(template)} variant="grid" />
                ))}
              </div>
            </MessageGroup>

            <MessageGroup group={MESSAGE_GROUPS[1]} className="stagger-2">
              <div className="space-y-2 sm:space-y-3">
                {templatesByGroup.operational.map((template) => (
                  <MessageTypeCard key={template.id} template={template} onClick={() => handleTemplateSelect(template)} variant="list" />
                ))}
              </div>
            </MessageGroup>

            <MessageGroup group={MESSAGE_GROUPS[2]} className="stagger-3">
              <div className="space-y-2 sm:space-y-3">
                {templatesByGroup.leadership.map((template) => (
                  <MessageTypeCard key={template.id} template={template} onClick={() => handleTemplateSelect(template)} variant="list" />
                ))}
              </div>
            </MessageGroup>

            <MessageGroup group={MESSAGE_GROUPS[3]} className="stagger-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {templatesByGroup.general.map((template) => (
                  <MessageTypeCard key={template.id} template={template} onClick={() => handleTemplateSelect(template)} variant="grid" />
                ))}
              </div>
            </MessageGroup>
          </section>

          <section className="fade-in mt-10 sm:mt-16">
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
                <div className="text-center">
                  <div className="mb-1 text-3xl font-bold text-naif-primary sm:text-4xl">{allTemplates.length}</div>
                  <div className="text-sm text-gray-500">نوع مراسلة</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-3xl font-bold text-naif-goldDark sm:text-4xl">4</div>
                  <div className="text-sm text-gray-500">مجموعات رئيسية</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-3xl font-bold text-naif-primary sm:text-4xl">1</div>
                  <div className="text-sm text-gray-500">دقيقة للإنجاز</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-3xl font-bold text-naif-goldDark sm:text-4xl">100%</div>
                  <div className="text-sm text-gray-500">باللغة العربية</div>
                </div>
              </div>
            </div>
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

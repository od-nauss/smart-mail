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

  const handleEdit = useCallback(() => {
    setShowPreview(false);
  }, []);

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

      <main id="main-content" className="flex-1 bg-[#f8f6f1]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <section className="mb-6 rounded-2xl border border-[#e8e0d3] bg-white px-5 py-5 sm:px-6 sm:py-6">
            <h2 className="text-xl font-medium text-[#016564] sm:text-2xl">
              اختر نوع المراسلة
            </h2>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              اختر القالب المناسب ثم عبّئ البيانات أو استوردها من Excel.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <MessageGroup group={MESSAGE_GROUPS[0]}>
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

            <MessageGroup group={MESSAGE_GROUPS[1]}>
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

            <MessageGroup group={MESSAGE_GROUPS[2]}>
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

            <MessageGroup group={MESSAGE_GROUPS[3]}>
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

      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title={selectedTemplate?.title || ''}
        size="lg"
      >
        {selectedTemplate && !showPreview ? (
          <DynamicForm template={selectedTemplate} onSubmit={handleFormSubmit} />
        ) : null}

        {showPreview && generatedMessage ? (
          <MessagePreview
            message={generatedMessage}
            onEdit={handleEdit}
            onNew={handleNew}
          />
        ) : null}
      </Modal>
    </>
  );
}
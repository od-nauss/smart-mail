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
    }, 120);
  }, [closeModal]);

  return (
    <>
      <Header />

      <main id="main-content" className="flex-1 bg-[#f8f6f1]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <section className="mb-5 rounded-2xl border border-[#e8dfd1] bg-white px-5 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-medium text-[#016564] sm:text-2xl">
                  اختر القالب مباشرة
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  اضغط على نوع المراسلة ثم عبّئ النموذج أو استورد البيانات من Excel.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a href="#weekly" className="rounded-lg border border-[#d9c7a7] px-3 py-2 text-sm text-[#016564]">
                  الأسبوعية
                </a>
                <a href="#operational" className="rounded-lg border border-[#d9c7a7] px-3 py-2 text-sm text-[#016564]">
                  التشغيلية
                </a>
                <a href="#leadership" className="rounded-lg border border-[#d9c7a7] px-3 py-2 text-sm text-[#016564]">
                  القيادية
                </a>
                <a href="#general" className="rounded-lg border border-[#d9c7a7] px-3 py-2 text-sm text-[#016564]">
                  العامة
                </a>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div id="weekly">
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
            </div>

            <div id="operational">
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
            </div>

            <div id="leadership">
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
            </div>

            <div id="general">
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
            </div>
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
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

  const templatesByGroup = useMemo(() => ({
    weekly: getTemplatesByGroup('weekly'),
    operational: getTemplatesByGroup('operational'),
    leadership: getTemplatesByGroup('leadership'),
    general: getTemplatesByGroup('general'),
  }), []);

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
      if (!isOpen) {
        setSelectedTemplate(null);
        setGeneratedMessage(null);
        setShowPreview(false);
      }
    }, 300);
  }, [closeModal, isOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* عنوان مختصر */}
          <div className="text-center mb-4 sm:mb-6 fade-in">
            <h2 className="text-lg sm:text-xl font-semibold text-naif-primary mb-1">
              إدارة عمليات التدريب
            </h2>
            <p className="text-sm text-naif-blueGray">
              اختر نوع المراسلة لإنشاء الرسالة مباشرة
            </p>
          </div>

          {/* شبكة المجموعات الأربع - مرئية بالكامل */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            
            <MessageGroup group={MESSAGE_GROUPS[0]} className="fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
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
          <DynamicForm
            template={selectedTemplate}
            onSubmit={handleFormSubmit}
          />
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
import { generateEmailSignature } from '@/engine/email';

export function buildSignature() {
  return generateEmailSignature();
}

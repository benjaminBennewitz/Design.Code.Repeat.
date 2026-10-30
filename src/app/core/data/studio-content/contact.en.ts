/* src/app/core/data/studio-content/contact.en.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Englische Inhalte für Kontaktseite und Formulartexte.
 */
export const EN_CONTACT_CONTENT: Pick<StudioContent, 'contactPage' | 'contactForm'> = {
  contactPage: {
    seo: {
      title: 'Contact | Design. Code. Repeat.',
      description: 'Project inquiry for web development, software development, UI/UX, maintenance or managed hosting.',
      keywords: ['web developer contact', 'software development inquiry', 'managed hosting contact'],
    },
    heading: {
      eyebrow: 'contact.request',
      title: 'What should work better?',
      text: '',
    },
    directTitle: 'Prefer direct email?',
    directText: 'No problem. Please do not send sensitive documents unencrypted in the first contact.',
    emailLabel: 'Send email',
    email: 'kontakt@design-code-repeat.de',
  },
  contactForm: {
    nameLabel: 'Name',
    emailLabel: 'Email',
    companyLabel: 'Company / organization (optional)',
    topicLabel: 'What is it about?',
    messageLabel: 'Short description',
    privacyLabel: 'Confirm privacy notice',
    submitLabel: 'Send inquiry',
    sendingLabel: 'Sending …',
    retryAfterLabel: 'You can send again in {seconds} seconds.',
    requiredHint: 'Fields marked with * are required.',
    privacyTextBefore: 'I have read the ',
    privacyLinkLabel: 'privacy notice',
    privacyTextAfter: ' regarding the processing of my information for handling this inquiry.',
    privacyAriaLabel: 'Confirm privacy notice',
    topics: [
      { value: 'website', label: 'Website / web presence' },
      { value: 'software', label: 'Software / internal tool' },
      { value: 'design', label: 'UI / UX / design' },
      { value: 'maintenance', label: 'Maintenance / improvements' },
      { value: 'hosting', label: 'Managed hosting / email' },
      { value: 'other', label: 'Other' },
    ],
    errors: {
      required: 'This field is required.',
      nameLength: 'Please enter between 2 and 80 characters.',
      email: 'Please enter a valid email address.',
      companyLength: 'Please use no more than 120 characters.',
      messageLength: 'Please describe your request with at least 20 characters.',
      messageMaxLength: 'The message may contain at most 4000 characters.',
      privacy: 'You must confirm the privacy notice.',
      validation: 'The request contains invalid information. Please check the form and try again.',
      csrf: 'The security check could not be completed. Please reload the page and try again.',
      payloadTooLarge: 'The request is too large. Please shorten your message and try again.',
      rateLimit: 'Too many requests were sent. Please wait a moment and try again later.',
      unavailable:
        'The contact service is temporarily unavailable. Please try again later or use the direct email address.',
      network: 'The contact service cannot be reached right now. Please check your connection or try again later.',
      server: 'The request could not be sent right now. Please try again later or use the direct email address.',
      timeout: 'The request timed out. Your inquiry may already have been received. Please do not send it again immediately.',
      tooFast: 'The form was submitted unusually quickly. Please check your information and try again.',
    },
  },
};

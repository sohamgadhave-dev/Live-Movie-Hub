import DOMPurify from 'dompurify';

/**
 * Sanitize user input to prevent XSS attacks.
 * Uses DOMPurify to strip malicious HTML/JS.
 */
export const sanitize = (dirty) => {
  if (typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [], // Strip all attributes
  });
};

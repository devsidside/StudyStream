import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a DOMPurify instance for server-side use
const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

/**
 * Sanitizes user-generated content to prevent XSS attacks
 * @param content - The content to sanitize
 * @returns Sanitized content safe for display
 */
export function sanitizeContent(content: string): string {
  if (!content) return '';
  
  // Configure DOMPurify to allow safe HTML elements but strip dangerous ones
  const cleanContent = purify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a'],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onfocus', 'onblur', 'style'],
  });
  
  return cleanContent;
}

/**
 * Sanitizes plain text content (for comments, reviews, etc.)
 * @param content - The plain text content to sanitize
 * @returns Sanitized plain text
 */
export function sanitizePlainText(content: string): string {
  if (!content) return '';
  
  // Strip all HTML tags and return plain text
  return purify.sanitize(content, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Validates that content doesn't contain potentially dangerous patterns
 * @param content - The content to validate
 * @returns true if content is safe, false otherwise
 */
export function validateContentSafety(content: string): boolean {
  if (!content) return true;
  
  // Check for dangerous patterns
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /expression\s*\(/gi,
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(content));
}
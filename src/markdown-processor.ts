import { MarkdownProcessResult } from './types';
import logger from './logger';

/**
 * Process markdown content to add spaces after # in headers
 * Transforms: #Title -> # Title
 */
export function processMarkdownHeaders(
  content: string,
  itemType: string,
  itemId: number
): MarkdownProcessResult {
  if (!content) {
    return { content, changed: false, changeCount: 0 };
  }

  // Regex to find headers without spaces: # followed by non-space, non-# character
  const headerRegex = /^(#{1,6})([^\s#])/gm;
  let changeCount = 0;

  const newContent = content.replace(headerRegex, (match, hashes, text) => {
    changeCount++;
    logger.debug(`Fixed header in ${itemType} ${itemId}: "${hashes}${text}" -> "${hashes} ${text}"`);
    return `${hashes} ${text}`;
  });

  if (changeCount > 0) {
    logger.info(`Fixed ${changeCount} headers in ${itemType} ${itemId}`);
  }

  return {
    content: newContent,
    changed: changeCount > 0,
    changeCount
  };
}

/**
 * Check if content contains markdown headers without spaces
 */
export function hasMarkdownHeadersWithoutSpaces(content: string): boolean {
  if (!content) return false;
  const headerRegex = /^(#{1,6})([^\s#])/gm;
  return headerRegex.test(content);
}

// src/lib/language-detection.ts

/**
 * Vietnamese-specific Unicode characters:
 * tonal diacritics (acute, grave, hook, tilde, dot-below),
 * vowels with circumflex/breve, and the letter đ/Đ.
 *
 * These characters do not appear in any other Latin-script language,
 * making this regex a reliable zero-dependency Vietnamese detector.
 */
const VIETNAMESE_CHARS_REGEX =
  /[àáảãạăắằẳẵặâấầẩẫậđèéẹẻẽêếềệểễìíịỉĩòóọỏõôốồổỗộơớờởỡợùúụủũưứừửữựỳýỵỷỹ]/i;

export type DetectedLanguage = "en" | "vi";

/**
 * Detects whether the input text contains Vietnamese.
 *
 * Rules:
 *  - Any Vietnamese diacritic present  →  "vi"  (routes to Viterbox)
 *  - No Vietnamese diacritics          →  "en"  (routes to Chatterbox Turbo)
 *
 * Mixed Vietnamese-English text returns "vi" because Viterbox handles
 * code-switching natively: English words are read with a natural
 * Vietnamese-accented pronunciation.
 */
export function detectLanguage(text: string): DetectedLanguage {
  return VIETNAMESE_CHARS_REGEX.test(text) ? "vi" : "en";
}

/**
 * Returns true when the text contains a mix of Vietnamese diacritics
 * and plain ASCII words — useful for logging/analytics only.
 */
export function isMixedLanguage(text: string): boolean {
  if (!VIETNAMESE_CHARS_REGEX.test(text)) return false;
  // ASCII word = sequence of a-z letters (no diacritics)
  const hasAsciiWords = /\b[a-z]{2,}\b/i.test(
    text.replace(VIETNAMESE_CHARS_REGEX, ""),
  );
  return hasAsciiWords;
}

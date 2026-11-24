import type { Recipient } from '@/types/admin';

/**
 * Hands selected people from a table to the Messages page. Kept in
 * sessionStorage (this tab only) rather than the URL, so long selections
 * and email addresses don't end up in browser history.
 */
const KEY = 'admin:message-recipients';

export const stashRecipients = (people: Recipient[]) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(people));
  } catch {
    /* storage unavailable: the Messages page starts empty */
  }
};

export const takeRecipients = (): Recipient[] => {
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return raw ? (JSON.parse(raw) as Recipient[]) : [];
  } catch {
    return [];
  }
};

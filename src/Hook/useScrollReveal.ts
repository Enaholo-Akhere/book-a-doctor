import { useEffect } from 'react';

const SHOWN = 'data-aos-shown';

/**
 * Reveals `[data-aos]` elements as they scroll into view (styles in index.css, under
 * "Scroll reveal"). Replaces the AOS library, of which only `fade-up` was used, along
 * with its 26 KB render-blocking stylesheet.
 *
 * Shown elements get a data attribute rather than a class: React leaves attributes it
 * doesn't manage alone on re-render, but would reset a class added from outside.
 * A MutationObserver picks up elements rendered later (e.g. once data loads, or after
 * client-side navigation).
 */
export const useScrollReveal = () => {
  useEffect(() => {
    const show = (el: Element) => el.setAttribute(SHOWN, '');

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-aos]').forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          io.unobserve(entry.target);
        }
      },
      // Like AOS's 100px offset: start once the element is 100px inside the viewport.
      { rootMargin: '0px 0px -100px 0px' }
    );

    const observeWithin = (root: ParentNode) =>
      root.querySelectorAll(`[data-aos]:not([${SHOWN}])`).forEach((el) => io.observe(el));

    observeWithin(document);

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(`[data-aos]:not([${SHOWN}])`)) io.observe(node);
          observeWithin(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
};

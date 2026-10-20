/* ==========================================================================
   Section « À propos » : JavaScript vanilla, sans dépendance.
   Ajoute .apropos-js (ce qui active l'animation définie en CSS) puis .is-in
   quand la section entre dans l'écran, une seule fois. À charger avec defer.
   ========================================================================== */

(() => {
  'use strict';

  const root = document.querySelector('[data-apropos]');
  if (!root) return;

  // Animations refusées ou navigateur trop ancien : tout reste dans son état final (CSS par défaut)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  root.classList.add('apropos-js');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        // Un frame d'avance pour garantir que le navigateur applique bien l'état de départ avant la transition
        requestAnimationFrame(() => entry.target.classList.add('is-in'));
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(root);
})();

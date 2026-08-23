# Marc-Onel Volcimus — Portfolio

Site vitrine d’un développeur full stack freelance : sites vitrines, landing pages et applications mobiles pour indépendants et TPE.

**En ligne :** [marco-ops-code.github.io](https://marco-ops-code.github.io/)

## Contenu

- `index.html` — page unique (à propos, travaux, offre, contact)
- `style.css` / `script.js` — design et interactions (roue de compétences, formulaire, lightbox)
- `assets/` — portrait, logo, captures de projets, icônes
- `contact.php` — secours local si Formspree n’est pas utilisé

## Lancer en local

Avec PHP :

```bash
php -S localhost:8000
```

Puis ouvrir [http://localhost:8000](http://localhost:8000). Un simple serveur statique (Live Server, `npx serve`) suffit aussi pour tout sauf `contact.php`.

## Contact

Le formulaire public passe par Formspree. Réponse sous 24 h, devis sous 48 h après le brief.

## Lighthouse (Sprint 4)

Objectifs : Performance ≥ 90, Accessibilité ≥ 95, SEO ≥ 95. Mesurer en navigation privée, mobile, après un hard refresh.

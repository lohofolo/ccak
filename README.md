# Reproduction du site officiel du Conseil du Coton et de l'Anacarde (CCA)

> **Site officiel de référence** : [https://conseilcotonanacarde.ci/](https://conseilcotonanacarde.ci/)  
> **Organisme** : Conseil de Régulation, de Suivi et de Développement des filières Coton, Anacarde et Karité (République de Côte d'Ivoire).

Cette reproduction intégrale, fidèle et modernisée a été conçue en rétro-ingénierie à partir de l'application Angular officielle et des ressources multimédias officielles extraites de `https://conseilcotonanacarde.ci/`.

---

## 🌟 Points Forts & Fonctionnalités

1. **100% Autonome et Local** :
   - Tous les logos officiels HD (`assets/logo/cca-logo.png`), icônes vectorielles SVG (`cote-ivoire.svg`, `work-icon.svg`, etc.), motifs de marque (`actualite_pattern.png`, `pattern_about.png`, `flash-title.png`) et photos officielles sont intégrés localement.
   - La bibliothèque cartographique Leaflet (`leaflet.js`, `leaflet.css`) fonctionne en local sans dépendance externe cassable.

2. **Carte Interactive des 12 Délégations Régionales** :
   - Carte interactive centrée sur la Côte d'Ivoire avec épingle officielle `marker.png` pour les 12 délégations :
     - **Korhogo, Bouaké, Bondoukou, Boundiali, Ferkessédougou, Odienné, Bouna, Séguéla, Mankono, Katiola, Zuénoula, Dimbokro**.
   - Panneau latéral interactif : cliquer sur une délégation zoome et centre la carte tout en ouvrant le popup avec les coordonnées, le numéro de téléphone direct et l'adresse.

3. **Bandeau Défilant Flash Info & Réseaux Sociaux** :
   - Ticker dynamique reproduisant le design officiel avec logo Flash Info, annonce défilante fluide et liens sociaux (Facebook, LinkedIn, X/Twitter, YouTube).

4. **Hero Banner Slider Interactif** :
   - Carrousel grand format avec défilement automatique toutes les 5 secondes, pause au survol, flèches de navigation, puces indicatrices et prise en charge du balayage tactile sur mobile.

5. **Support Bilingue Temps Réel (Français / Anglais)** :
   - Sélecteur `FR` / `EN` actif dans l'en-tête, traduisant instantanément l'interface et conservant la préférence dans le `localStorage`.

6. **Validation Stricte des Formulaires aux Normes Ivoiriennes** :
   - Validation conforme du numéro de téléphone ivoirien (10 chiffres commençant obligatoirement par les indicatifs `01`, `05` ou `07`).
   - Notifications Toast interactives lors de l'envoi de messages, souscription à la newsletter ou téléchargement de documents.

7. **Structure Complète des Pages** :
   - `index.html` : Accueil officiel, chiffres clés, À propos, Actualités, Filière Anacarde & Coton, Carte des 12 délégations, Partenaires, Newsletter et Footer.
   - `a-propos.html` : Le mot du DG, le mot du PCA, Création (Ordonnance N° 2013-681), Objectifs & Missions, Organisation, Guichets et La Réforme.
   - `filieres.html` : Filière Coton (savanes), Filière Anacarde (1er mondial), Filière Karité (nouvelle filière), Projet PPCA (Banque Mondiale) et Usine-École CITA de Yamoussoukro.
   - `investir.html` : Guide et opportunités d'investissement, avantages du Code des investissements (subvention de 400 FCFA/kg, exonérations fiscales et douanières), les 4 zones agro-industrielles (Korhogo, Bouaké, Bondoukou, Séguéla).
   - `actualites.html` : Fil d'actualités avec recherche en temps réel, filtres par catégorie (Anacarde, Coton, Karité, Régulation) et modal de lecture d'article.
   - `evenements.html` : Salons officiels : le **SIETTA** (Salon International des Équipements de l'Anacarde), la **JNPCA** (Journée Nationale du Producteur) et calendrier des campagnes.
   - `medias.html` : Galerie photos avec visionneuse plein écran (Lightbox), vidéos reportages et espace de téléchargement des documents officiels.
   - `contact.html` : Coordonnées du Siège (Immeuble Caistab 15ème étage - Abidjan Plateau), formulaire de contact interactif et annuaire des 12 délégations.
   - `connexion.html` : Portail de connexion sécurisé pour les opérateurs agréés (Acheteurs, Exportateurs, Transformateurs, OPA).

---

## 🚀 Lancement & Visualisation

### Option 1 : Via le serveur Node.js inclus (Recommandé)
Dans le terminal du projet :
```bash
node server.js
```
Puis ouvrez votre navigateur sur : **[http://localhost:3000](http://localhost:3000)**

### Option 2 : Ouverture directe dans le navigateur
Vous pouvez double-cliquer directement sur `index.html` (ou n'importe quel autre fichier HTML) dans Google Chrome, Microsoft Edge, Firefox ou Safari.

---

## 📁 Architecture des Fichiers

```
CCA-WEBSITE/
├── index.html                      # Page d'accueil officielle CCA
├── a-propos.html                   # À propos, DG, PCA, Missions, Réforme
├── filieres.html                   # Filières Coton, Anacarde, Karité, PPCA, CITA
├── investir.html                   # Guide d'investissement & Zones agro-industrielles
├── actualites.html                 # Centre de presse & Modal de lecture
├── article.html                    # Page dédiée de lecture d'article pleine page
├── evenements.html                 # SIETTA, JNPCA & Calendrier officiel
├── medias.html                     # Photothèque (Lightbox), Vidéos & Documents officiels
├── contact.html                    # Formulaire & Annuaire des 12 délégations
├── connexion.html                  # Portail sécurisé des opérateurs agréés
├── 404.html                        # Page d'erreur 404 personnalisée
├── server.js                       # Serveur local Node.js sécurisé
├── README.md                       # Documentation officielle du projet
├── sitemap.xml                     # Plan du site XML pour le référencement
├── robots.txt                      # Directives d'indexation des moteurs de recherche
├── css/
│   ├── style.css                   # Styles officiels, charte graphique (#F77F00, #019E60)
│   ├── responsive.css              # Adaptation Mobile, Tablette et Desktop
│   └── leaflet.css                 # Feuille de style de la carte interactive
├── js/
│   ├── main.js                     # Sliders, tiroir mobile, formulaires, lightbox, toasts
│   ├── map.js                      # Coordonnées et initialisation de la carte Leaflet
│   ├── articles-data.js            # Corpus complet des articles officiels
│   ├── translations.js             # Dictionnaire bilingue FR / EN
│   └── leaflet.js                  # Bibliothèque Leaflet locale
└── assets/
    ├── logo/                       # Logos officiels haute résolution (WEBP/PNG)
    ├── images/                     # Motifs officiels et visuels des filières
    └── icons/                      # Icônes vectorielles SVG officielles
```

---

## 🛠️ Améliorations d'octobre 2026

- **Contenu officiel** : numéros réels des 12 délégations, réseaux sociaux officiels, bandeau Flash Info à jour (SIETTA 2026, JNPCA 2027), vidéo YouTube officielle.
- **Formulaires honnêtes** : plus de faux message « envoyé ». Contact et newsletter envoient vraiment (via `contactEndpoint` / `newsletterEndpoint`) ou ouvrent la messagerie du visiteur avec le message pré-rempli. La page Connexion n'accepte plus de mot de passe tant que `portalUrl` n'est pas renseigné.
- **Performance** : images converties en WebP (≈ 3 Mo → 0,2 Mo), favicon 200 Ko → 7 Ko, chargement différé des images, vidéos YouTube chargées au clic.
- **Mobile** : contenu n'est plus masqué sous l'en-tête, chiffres clés en 2 × 2, grilles qui ne débordent plus, tiroir avec boutons Espace Opérateurs / Contact.
- **Accessibilité** : lien « Aller au contenu », focus clavier visible, menus au clavier, Échap ferme menu et fenêtres, libellés reliés aux champs, animations réduites si demandé.
- **Référencement** : description, Open Graph et URL canonique sur chaque page, données structurées, `sitemap.xml`, `robots.txt`, page 404.
- **Serveur** : faille de lecture hors du dossier corrigée, cache navigateur, vraie page 404.

### ⚙️ À configurer avant la mise en ligne (`js/main.js`, en haut du fichier)

```js
const CCA_CONFIG = {
  contactEmail: 'info@conseilcotonanacarde.ci',
  contactEndpoint: '',     // ex. https://formspree.io/f/xxxx
  newsletterEndpoint: '',
  portalUrl: ''            // URL du vrai portail des opérateurs
};
```

Vidéos : renseigner l'identifiant YouTube dans `data-video-id` (page `medias.html`).

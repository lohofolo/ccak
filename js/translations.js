/**
 * Dictionnaire bilingue Français / Anglais pour le site du Conseil du Coton et de l'Anacarde
 */

const translations = {
  fr: {
    // Topbar
    officialPortal: "Portail Officiel de la République de Côte d'Ivoire",
    searchPlaceholder: "Rechercher une information, un texte...",
    
    // Navigation
    home: "Accueil",
    about: "À propos",
    wordDg: "Le mot du DG",
    wordPca: "Le mot du PCA",
    creation: "Création",
    missions: "Objectifs & Missions",
    organization: "Organisation",
    delegations: "Guichets & Délégations",
    reform: "La Réforme",
    sectors: "Filières",
    cottonSector: "Filière Coton",
    cashewSector: "Filière Anacarde",
    sheaSector: "Filière Karité",
    transformation: "Transformation",
    units: "Unités de transformation (CITA)",
    invest: "Investir",
    news: "Actualités",
    events: "Événements",
    media: "Médias",
    photos: "Photos",
    videos: "Vidéos",
    documents: "Documents",
    portal: "Espace Opérateurs",
    contactUs: "Contactez-nous",
    moreInfo: "En savoir plus",
    plusDetails: "Plus d'infos",

    // Flash info
    flashTitle: "FLASH INFO",
    flashText: "SIETTA 2026 : 5ᵉ édition du 12 au 14 novembre 2026 au Palais de la Culture d'Abidjan • Prix bord champ garantis : Anacarde 400 FCFA/kg, Coton 310 FCFA/kg, Karité 250 FCFA/kg • Campagne 2026-2027 : agréments d'achat et d'exportation disponibles sur le portail",

    // Sections
    aboutTitle: "À propos",
    aboutSubtitle: "Organe de régulation, de suivi et de développement des filières coton, anacarde et karité",
    newsTitle: "Actualités",
    cashewTitle: "Filière Anacarde",
    cottonTitle: "Filière Coton",
    statsTitle: "Chiffres Clés",
    partnersTitle: "Nos Partenaires Institutionnels",
    mapTitle: "Plan d'Accès & 12 Délégations Régionales",
    mapSubtitle: "Le Conseil du Coton et de l'Anacarde au plus près des producteurs et acteurs sur l'ensemble du territoire",

    // Newsletter
    newsletterTitle: "INSCRIVEZ-VOUS À NOTRE NEWSLETTER",
    newsletterDesc: "Recevez les prix bord champ, les circulaires officielles et les bilans de campagne directement par email.",
    subscribe: "Souscrire",
    emailPlaceholder: "Votre adresse e-mail",

    // Footer
    headquarters: "Siège Social",
    addressCaistab: "Immeuble Caistab, 15ème étage - Abidjan Plateau",
    standardTel: "Standard : (+225) 27 20 20 70 30",
    quickLinks: "Liens Utiles",
    usefulDocs: "Textes & Règlements",
    allRightsReserved: "Tous droits réservés."
  },
  en: {
    // Topbar
    officialPortal: "Official Portal of the Republic of Côte d'Ivoire",
    searchPlaceholder: "Search information, official documents...",

    // Navigation
    home: "Home",
    about: "About Us",
    wordDg: "Message from the DG",
    wordPca: "Message from the PCA",
    creation: "Creation",
    missions: "Objectives & Missions",
    organization: "Organization",
    delegations: "Offices & Delegations",
    reform: "The Reform",
    sectors: "Sectors",
    cottonSector: "Cotton Sector",
    cashewSector: "Cashew Sector",
    sheaSector: "Shea Sector",
    transformation: "Processing & Value Addition",
    units: "Processing Units (CITA)",
    invest: "Invest",
    news: "News",
    events: "Events",
    media: "Media",
    photos: "Photos",
    videos: "Videos",
    documents: "Documents",
    portal: "Operators Portal",
    contactUs: "Contact Us",
    moreInfo: "Read More",
    plusDetails: "More details",

    // Flash info
    flashTitle: "BREAKING NEWS",
    flashText: "SIETTA 2026: 5th edition, 12–14 November 2026, Palais de la Culture, Abidjan • Official farmgate prices: Cashew 400 FCFA/kg, Cotton 310 FCFA/kg, Shea 250 FCFA/kg • 2026-2027 season: licences available on the operators portal",

    // Sections
    aboutTitle: "About Us",
    aboutSubtitle: "Regulatory, monitoring, and development body for cotton, cashew, and shea sectors",
    newsTitle: "Latest News",
    cashewTitle: "Cashew Sector",
    cottonTitle: "Cotton Sector",
    statsTitle: "Key Statistics",
    partnersTitle: "Our Institutional Partners",
    mapTitle: "Locations & 12 Regional Delegations",
    mapSubtitle: "The Cotton and Cashew Council operating close to producers and actors across Côte d'Ivoire",

    // Newsletter
    newsletterTitle: "SUBSCRIBE TO OUR NEWSLETTER",
    newsletterDesc: "Receive farmgate prices, official circulars, and campaign reports directly by email.",
    subscribe: "Subscribe",
    emailPlaceholder: "Your email address",

    // Footer
    headquarters: "Headquarters",
    addressCaistab: "Caistab Building, 15th Floor - Abidjan Plateau",
    standardTel: "Switchboard: (+225) 27 20 20 70 30",
    quickLinks: "Quick Links",
    usefulDocs: "Regulations & Laws",
    allRightsReserved: "All rights reserved."
  }
};

let currentLang = 'fr';
try {
  currentLang = (typeof localStorage !== 'undefined' && localStorage.getItem('cca_lang')) || 'fr';
} catch (e) {
  currentLang = 'fr';
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cca_lang', lang);
    }
  } catch (e) {}

  // Update active buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Update translatable elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
        el.setAttribute('placeholder', translations[lang][key]);
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  document.documentElement.lang = lang;
}

if (typeof window !== 'undefined') {
  window.translations = translations;
  window.setLanguage = setLanguage;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { translations, setLanguage };
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
      });
    });
  });
}

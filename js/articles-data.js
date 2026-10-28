/**
 * Données complètes et officielles des actualités du Conseil du Coton et de l'Anacarde (CCA)
 * Utilisées à la fois par actualites.html (modale de lecture) et par article.html (page pleine)
 */

const CCA_ARTICLES = {
  1: {
    id: 1,
    tag: "Filière Anacarde",
    tagClass: "",
    title: "Ouverture officielle de la commercialisation de la noix brute de cajou",
    date: "Campagne 2024-2025 • Abidjan Plateau",
    author: "Direction Générale du CCA",
    readTime: "3 min de lecture",
    img: "assets/images/filiere-bg.webp",
    imgCaption: "Contrôle qualité et calibrage des sacs de noix de cajou certifiées avant agrément à l'exportation.",
    chapeau: "Le Conseil du Coton et de l'Anacarde a procédé au lancement officiel de la campagne de commercialisation de la noix brute de cajou. À cette occasion, la Direction Générale a réaffirmé la sanctuarisation du prix plancher obligatoire garanti bord champ et rappelé les sanctions prévues contre toute exportation clandestine par voie terrestre.",
    bodyHtml: `
      <p>Le Conseil du Coton et de l'Anacarde a réuni ce matin à l'immeuble Caistab l'ensemble des acteurs de la chaîne de valeur du cajou : associations de producteurs, coopératives agricoles, acheteurs agréés, exportateurs et industriels de la transformation locale.</p>
      
      <h2>Un prix bord champ garanti et intangible pour protéger le planteur</h2>
      <p>Le Directeur Général a solennellement rappelé que le prix plancher obligatoire garanti bord champ est intangible et doit être intégralement reversé aux producteurs sans aucune réfraction injustifiée. Tout acheteur ou intermédiaire pris en flagrant délit de paiement en-deçà du tarif réglementaire verra son agrément immédiatement suspendu et s'exposera aux poursuites pénales prévues par la loi régissant les filières coton et anacarde.</p>
      
      <blockquote>
        « Le revenu de nos paysans est sacré. Chaque kilogramme de noix de cajou récolté à la sueur de leur front doit être payé au juste prix garanti par l'État de Côte d'Ivoire. »
        <br><strong>— Direction Générale du Conseil du Coton et de l'Anacarde</strong>
      </blockquote>

      <h2>Sécurisation des frontières terrestres et circuits officiels</h2>
      <p>Afin d'endiguer toute fuite frauduleuse vers les pays limitrophes, des brigades mixtes de contrôle composées d'agents assermentés du CCA, de la Gendarmerie nationale, des Douanes ivoiriennes et des Eaux et Forêts ont été déployées le long des corridors sensibles dans le Bounkani, le Folon, le Poro et la Bagoué.</p>
      <p>Les exportations de noix brutes de cajou se feront exclusivement par voie maritime via les ports autonomes d'Abidjan et de San Pedro. Des certificats d'origine électronique et des balises GPS sur les camions de collecte permettent un suivi en temps réel de chaque lot jusqu'aux terminaux portuaires.</p>

      <h2>Priorité absolue à l'approvisionnement des transformateurs nationaux</h2>
      <p>La Côte d'Ivoire, premier producteur mondial d'anacarde, accélère sa politique d'industrialisation locale. À cet effet, un quota de réserve obligatoire est réservé en priorité aux usines de décorticage implantées sur le territoire national, notamment dans les nouvelles zones agro-industrielles de Bouaké, Korhogo et Bondoukou.</p>
    `,
    highlights: [
      "Respect strict et sans concession du prix plancher garanti bord champ fixé par le Gouvernement.",
      "Déploiement des brigades mixtes de surveillance le long de toutes les frontières terrestres.",
      "Exportation autorisée uniquement par les ports autonomes d'Abidjan et de San Pedro.",
      "Droit de préemption accordé aux unités industrielles locales pour sécuriser l'emploi national."
    ]
  },
  2: {
    id: 2,
    tag: "Filière Coton",
    tagClass: "green",
    title: "Filière Cotonnière : Rebond historique de la production avec 347 922 tonnes",
    date: "Bilan Officiel • Korhogo",
    author: "Direction des Productions Agricoles",
    readTime: "4 min de lecture",
    img: "assets/images/coton_img.webp",
    imgCaption: "Récolte manuelle de coton graine de premier choix dans le département de Korhogo.",
    chapeau: "Après les graves perturbations causées par les invasions d'insectes ravageurs lors des saisons antérieures, la filière coton ivoirienne a opéré un spectaculaire rétablissement, atteignant une récolte globale de 347 922 tonnes de coton graine sur l'ensemble du bassin cotonnier.",
    bodyHtml: `
      <p>Le bilan de la campagne cotonnière, présenté à Korhogo en présence des représentants de l'INTERCOTON et des sociétés d'égrenage, consacre la réussite exemplaire du plan de sauvetage et de relance initié par le Chef de l'État et coordonné par le Conseil du Coton et de l'Anacarde.</p>
      
      <h2>Un plan de riposte agronomique efficace contre les jassides</h2>
      <p>La saison précédente avait été lourdement impactée par la prolifération inédite de cicadelles (jassides) venues d'autres régions du continent. Face à cette menace vitale, le CCA a mobilisé la communauté scientifique nationale (CNRA, universités) et les partenaires internationaux pour tester et homologuer en urgence de nouvelles molécules phytosanitaires ciblées respectueuses de l'écosystème.</p>

      <blockquote>
        « Grâce à la synergie entre la recherche agronomique, l'encadrement de proximité et la résilience remarquable de nos cotonculteurs, nous avons relevé le défi et ramené la Côte d'Ivoire dans le peloton de tête des producteurs africains. »
      </blockquote>

      <h2>Une subvention massive sur les engrais et les semences certifiées</h2>
      <p>L'État ivoirien a consenti un effort budgétaire exceptionnel de plus de 28 milliards de Francs CFA pour subventionner les intrants agricoles essentiels (engrais NPK, urée et semences certifiées à fort taux de germination). Cet appui financier direct a permis aux producteurs de labourer et d'ensemencer plus de 320 000 hectares dans d'excellentes conditions d'humidité.</p>

      <h2>Des perspectives ambitieuses pour la campagne 2026-2027</h2>
      <p>Forte de cette résilience, la filière cotonnière ivoirienne vise désormais l'objectif de 420 000 tonnes pour les prochaines récoltes. Le CCA intensifie le déploiement de semoirs de précision, de kits de pulvérisation à batterie solaire et d'une couverture d'assurance indicielle agricole contre les aléas pluviométriques.</p>
    `,
    highlights: [
      "Production consolidée de 347 922 tonnes de coton graine, en nette hausse par rapport aux campagnes sinistrées.",
      "Homologation de protocoles de traitement phytosanitaire efficaces contre les jassides par le CNRA.",
      "Subvention gouvernementale de 28 milliards FCFA sur les intrants agricoles pour préserver le pouvoir d'achat des paysans.",
      "Cap fixé à plus de 400 000 tonnes pour consolider la position de la Côte d'Ivoire dans le top 3 africain."
    ]
  },
  3: {
    id: 3,
    tag: "Transformation",
    tagClass: "",
    title: "CITA : Une nouvelle vague de techniciens certifiés pour les usines ivoiriennes",
    date: "Formation Professionnelle • Yamoussoukro",
    author: "Direction de l'Industrialisation & du CITA",
    readTime: "3 min de lecture",
    img: "assets/images/media-001.webp",
    imgCaption: "Travaux pratiques des étudiants sur les machines de décorticage et de tri optique du CITA.",
    chapeau: "L'usine-école du Centre d'Innovations et de Technologies de l'Anacarde (CITA) de Yamoussoukro a célébré la remise de diplômes à 180 techniciens et opératrices spécialisés dans les procédés industriels d'usinage et de conditionnement de la noix de cajou.",
    bodyHtml: `
      <p>Inauguré pour accélérer la transition de la Côte d'Ivoire d'exportateur de matière brute vers un hub de transformation agro-industrielle à haute valeur ajoutée, le CITA de Yamoussoukro remplit pleinement sa vocation d'incubateur de talents techniques nationaux.</p>

      <h2>Des compétences opérationnelles immédiates</h2>
      <p>Durant 6 mois de cursus intensif alliant théorie scientifique et pratique en conditions réelles d'usine, les lauréats ont maîtrisé les phases critiques de la ligne de fabrication :</p>
      <ul>
        <li><strong>Calibrage et nettoyage automatisé :</strong> Séparation par calibre pour optimiser le rendement au décorticage ;</li>
        <li><strong>Fragilisation thermique et cuisson à vapeur :</strong> Maîtrise des courbes de température pour éviter les brisures d'amandes ;</li>
        <li><strong>Décorticage mécanique automatisé :</strong> Réglage de précision des couteaux de coupe ;</li>
        <li><strong>Dépelliculage thermique et triage optique :</strong> Détection par caméras haute définition des défauts de couleur ;</li>
        <li><strong>Conditionnement sous vide :</strong> Respect des normes internationales d'hygiène HACCP et ISO 22000.</li>
      </ul>

      <h2>Insertion garantie à 100 % dans les nouvelles usines</h2>
      <p>La totalité des diplômés de cette promotion a déjà signé des contrats de travail auprès des unités privées installées dans les parcs agro-industriels de Bouaké, Korhogo et Bondoukou, répondant à une demande pressante des industriels en ouvriers qualifiés.</p>
    `,
    highlights: [
      "180 nouveaux techniciens et conducteurs de lignes formés aux standards internationaux.",
      "Taux d'insertion professionnelle de 100 % dès la sortie de l'usine-école du CITA.",
      "Modules intégrant la maintenance électromécanique et la valorisation écologique des coques en biomasse.",
      "Contribution directe à l'objectif de 50 % de transformation locale de la production nationale d'anacarde."
    ]
  },
  4: {
    id: 4,
    tag: "Karité",
    tagClass: "brown",
    title: "Structuration du karité : Ateliers de formation pour 50 coopératives de femmes",
    date: "Autonomisation Féminine • Bouna & Tchologo",
    author: "Coordination Filière Karité",
    readTime: "3 min de lecture",
    img: "assets/images/media-002.webp",
    imgCaption: "Membres d'une coopérative de Bouna lors d'un atelier sur les techniques de dépulpage et séchage propre.",
    chapeau: "Dans le cadre de l'extension de ses missions de régulation à la filière karité, le CCA a déployé un vaste programme d'encadrement technique et d'équipements au bénéfice de plus de 300 représentantes de groupements féminins dans le Grand Nord.",
    bodyHtml: `
      <p>Le karité représente une richesse naturelle exceptionnelle pour la Côte d'Ivoire et le socle de l'autonomie financière de dizaines de milliers de ménages ruraux, en particulier des femmes qui assurent traditionnellement l'intégralité de la collecte et de la première transformation.</p>

      <h2>Adoption des Bonnes Pratiques Agricoles et de Collecte (BPAC)</h2>
      <p>Les ateliers pratiques ont permis d'enseigner des méthodes modernes de traitement post-récolte indispensables pour préserver la qualité de la matière grasse végétale :</p>
      <p>Ramassage uniquement des fruits tombés à maturité, dépulpage dans les 48 heures pour éviter la prolifération de moisissures, cuisson brève à l'eau bouillante et séchage exclusif sur des claies surélevées à l'abri du sol et des poussières.</p>

      <blockquote>
        « En passant d'un beurre traditionnel artisanal à un beurre de karité de grade cosmétique supérieur certifié biologique, les coopératives multiplient par trois leur marge nette à la vente. »
      </blockquote>

      <h2>Distribution de matériel moderne et durable</h2>
      <p>À l'issue de ces sessions, le Conseil du Coton et de l'Anacarde a distribué 2 500 kits de protection individuelle (gants, bottes renforcées contre les piqûres d'insectes et serpents), 150 séchoirs solaires mobiles et des foyers améliorés économes en bois de chauffe pour préserver le couvert forestier de la savane.</p>
    `,
    highlights: [
      "Formation de 300 leaders de coopératives regroupant plus de 6 000 femmes rurales.",
      "Réduction drastique du taux d'acidité libre des amandes pour viser le grade cosmétique A.",
      "Fourniture de kits d'équipements de sécurité et de foyers améliorés écologiques.",
      "Mise en place d'un mécanisme de contractualisation directe avec les acheteurs pour garantir un prix rémunérateur."
    ]
  },
  5: {
    id: 5,
    tag: "Régulation",
    tagClass: "",
    title: "Agréments de commercialisation : Lancement des inscriptions en ligne",
    date: "Circulaire Réglementaire • Plateau, Abidjan",
    author: "Direction de la Régulation & du Contrôle",
    readTime: "2 min de lecture",
    img: "assets/images/actualite_pattern.webp",
    imgCaption: "Portail officiel des opérateurs du Conseil du Coton et de l'Anacarde.",
    chapeau: "Le Conseil du Coton et de l'Anacarde informe l'ensemble des opérateurs économiques (acheteurs, exportateurs et transformateurs) que les demandes d'agrément pour la campagne 2026-2027 sont ouvertes exclusivement sur le portail numérique officiel.",
    bodyHtml: `
      <p>Dans le cadre de la modernisation et de la digitalisation intégrale des services publics ivoiriens, le CCA franchit une étape décisive en supprimant le dépôt physique des dossiers d'agrément au siège de la Caistab au profit de la plateforme numérique sécurisée.</p>

      <h2>Une procédure 100 % dématérialisée, rapide et transparente</h2>
      <p>Désormais, chaque opérateur peut soumettre ses pièces justificatives, suivre en temps réel l'état d'instruction de son dossier par la Commission d'Agrément et régler les frais statutaires par paiement électronique sécurisé.</p>
      
      <h2>Rappel des critères d'éligibilité obligatoires</h2>
      <p>Pour être admis à la commercialisation intérieure ou à l'exportation, les postulants doivent attester de :</p>
      <ul>
        <li>La constitution d'une caution bancaire de bonne fin d'exécution délivrée par un établissement financier agréé en Côte d'Ivoire ;</li>
        <li>La disposition de magasins de stockage salubres, aérés et certifiés conformes par les délégations régionales du CCA ;</li>
        <li>Une attestation de régularité fiscale (DGI) et de mise à jour des cotisations sociales (CNPS) ;</li>
        <li>L'engagement formel de respecter les prix bord champ et le cahier des charges de la traçabilité.</li>
      </ul>

      <p>Tout contrevenant exerçant une activité d'achat ou d'exportation sans badge ni agrément en cours de validité s'expose aux sanctions de saisie immédiate des stocks et de poursuites judiciaires.</p>
    `,
    highlights: [
      "Inscriptions ouvertes exclusivement via le portail officiel portal.conseilcotonanacarde.ci.",
      "Zéro papier : traitement accéléré et accusé de réception électronique instantané.",
      "Vérification rigoureuse des cautions bancaires et de l'état des entrepôts de stockage.",
      "Numéro vert d'assistance disponible pour accompagner les coopératives et PME."
    ]
  },
  6: {
    id: 6,
    tag: "Coopération",
    tagClass: "",
    title: "Mission conjointe CCA - Banque Mondiale sur les zones industrielles",
    date: "Partenariat PPCA • Bouaké & Korhogo",
    author: "Direction Générale du CCA & Mission PPCA",
    readTime: "4 min de lecture",
    img: "assets/images/mot-du-dg.webp",
    imgCaption: "Inspection des infrastructures routières et des réseaux d'énergie de la zone agro-industrielle de Bouaké.",
    chapeau: "Une délégation conjointe du Conseil du Coton et de l'Anacarde et de la Banque Mondiale a mené une mission de terrain d'envergure sur les parcs agro-industriels dédiés à l'anacarde à Bouaké et Korhogo pour constater l'achèvement des aménagements structurants.",
    bodyHtml: `
      <p>Financé avec l'appui financier et technique de la Banque Mondiale à travers le Projet de Promotion de la Compétitivité de la chaîne de valeur de l'Anacarde (PPCA), le déploiement des plateformes industrielles dédiées franchit une étape majeure avec la mise sous tension des réseaux et l'arrivée des premiers industriels.</p>

      <h2>Des infrastructures modernes aux standards internationaux</h2>
      <p>Les experts ont inspecté les composantes clés des parcs aménagés :</p>
      <ul>
        <li>Postes de transformation électrique moyenne et haute tension garantissant une alimentation continue sans coupure ;</li>
        <li>Réseaux d'adduction en eau potable industrielle et stations d'épuration des effluents conformes aux normes environnementales de l'ANDE ;</li>
        <li>Voiries lourdes asphaltées reliées directement aux corridors routiers nationaux et aux voies ferrées de la SITARAIL ;</li>
        <li>Bâtiments administratifs regroupant un guichet unique CCA, un poste de douane et un laboratoire d'analyses microbiologiques.</li>
      </ul>

      <h2>Plus de 12 000 emplois durables en vue pour les jeunes et les femmes</h2>
      <p>Déjà plus de 15 opérateurs privés ivoiriens et internationaux ont réservé des parcelles pour ériger des usines modernes de décorticage et de raffinage d'huile de coque (CNSL). À plein régime, ces deux zones industrielles traiteront plus de 250 000 tonnes de noix brutes par an et généreront plus de 12 000 emplois directs stables.</p>
    `,
    highlights: [
      "Finalisation des travaux de viabilisation sur les parcs industriels de Bouaké et Korhogo.",
      "Partenariat exemplaire État de Côte d'Ivoire - Banque Mondiale via le PPCA.",
      "Réservation confirmée de 15 lots par des transformateurs locaux et investisseurs étrangers.",
      "Création de plus de 12 000 emplois industriels directs d'ici 2027 dans les régions du centre et du nord."
    ]
  }
};

if (typeof globalThis !== 'undefined') {
  globalThis.CCA_ARTICLES = CCA_ARTICLES;
}
if (typeof window !== 'undefined') {
  window.CCA_ARTICLES = CCA_ARTICLES;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CCA_ARTICLES;
}



/**
 * Carte interactive des 12 Délégations Régionales du Conseil du Coton et de l'Anacarde (CCA)
 * Basée sur Leaflet.js avec filtres par filière, recherche instantanée et popups enrichis
 */

const CCA_DELEGATIONS = [
  {
    name: "Korhogo",
    coordinates: [9.45, -5.63],
    zone: "Zone Nord / Savanes",
    address: "Quartier 14, Korhogo",
    tel: "+225 05 05 71 56 06",
    email: "delegation.korhogo@conseilcotonanacarde.ci",
    filieres: ["Coton", "Anacarde", "Karité"],
    badge: "Pôle Majeur"
  },
  {
    name: "Bouaké",
    coordinates: [7.69, -5.03],
    zone: "Zone Centre / Gbêkê",
    address: "Quartier Commerce, Bouaké",
    tel: "+225 05 05 87 55 10",
    email: "delegation.bouake@conseilcotonanacarde.ci",
    filieres: ["Coton", "Anacarde"],
    badge: "Zone Industrielle"
  },
  {
    name: "Bondoukou",
    coordinates: [8.04, -2.8],
    zone: "Zone Est / Gontougo & Bounkani",
    address: "Quartier Résidentiel, Bondoukou",
    tel: "+225 05 06 50 15 29",
    email: "delegation.bondoukou@conseilcotonanacarde.ci",
    filieres: ["Anacarde"],
    badge: "1er Bassin Cajou"
  },
  {
    name: "Boundiali",
    coordinates: [9.52, -6.49],
    zone: "Zone Nord-Ouest / Bagoué",
    address: "Centre-ville, Boundiali",
    tel: "+225 05 66 45 81 13",
    email: "delegation.boundiali@conseilcotonanacarde.ci",
    filieres: ["Coton", "Anacarde", "Karité"],
    badge: "Coton & Karité"
  },
  {
    name: "Ferkessédougou",
    coordinates: [9.6, -5.2],
    zone: "Zone Grand Nord / Tchologo",
    address: "Quartier Résidentiel, Ferkessédougou",
    tel: "+225 05 75 92 66 05",
    email: "delegation.ferke@conseilcotonanacarde.ci",
    filieres: ["Coton", "Anacarde"],
    badge: "Frontière & Hub"
  },
  {
    name: "Odienné",
    coordinates: [9.51, -7.56],
    zone: "Zone Nord-Ouest / Kabadougou",
    address: "Quartier Administratif, Odienné",
    tel: "+225 05 05 46 19 34",
    email: "delegation.odienne@conseilcotonanacarde.ci",
    filieres: ["Coton", "Anacarde", "Karité"],
    badge: "Denguélé"
  },
  {
    name: "Bouna",
    coordinates: [9.27, -2.99],
    zone: "Zone Nord-Est / Bounkani",
    address: "Quartier Commerce, Bouna",
    tel: "+225 05 05 58 65 54",
    email: "delegation.bouna@conseilcotonanacarde.ci",
    filieres: ["Anacarde", "Karité"],
    badge: "Est Septentrional"
  },
  {
    name: "Séguéla",
    coordinates: [7.96, -6.67],
    zone: "Zone Centre-Ouest / Worodougou",
    address: "Quartier Résidentiel, Séguéla",
    tel: "+225 05 04 88 66 97",
    email: "delegation.seguela@conseilcotonanacarde.ci",
    filieres: ["Anacarde", "Coton"],
    badge: "Parc Industriel"
  },
  {
    name: "Mankono",
    coordinates: [8.06, -6.19],
    zone: "Zone Béré",
    address: "Centre administratif, Mankono",
    tel: "+225 05 06 10 47 49",
    email: "delegation.mankono@conseilcotonanacarde.ci",
    filieres: ["Coton", "Anacarde"],
    badge: "Béré Coton"
  },
  {
    name: "Katiola",
    coordinates: [8.14, -5.1],
    zone: "Zone Vallée du Bandama / Hambol",
    address: "Quartier Château, Katiola",
    tel: "+225 05 45 21 44 21",
    email: "delegation.katiola@conseilcotonanacarde.ci",
    filieres: ["Anacarde", "Coton"],
    badge: "Hambol"
  },
  {
    name: "Zuénoula",
    coordinates: [7.43, -6.05],
    zone: "Zone Marahoué",
    address: "Quartier Municipal, Zuénoula",
    tel: "+225 05 46 75 17 43",
    email: "delegation.zuenoula@conseilcotonanacarde.ci",
    filieres: ["Coton", "Anacarde"],
    badge: "Marahoué"
  },
  {
    name: "Dimbokro",
    coordinates: [6.65, -4.71],
    zone: "Zone N'Zi",
    address: "Quartier Commerce, Dimbokro",
    tel: "+225 05 46 49 24 06",
    email: "delegation.dimbokro@conseilcotonanacarde.ci",
    filieres: ["Anacarde"],
    badge: "Bassin Sud N'Zi"
  }
];

let mapInstance = null;
const markersMap = {};
let activeFiliereFilter = 'all';
let searchQuery = '';

function initCcaMap() {
  const mapContainer = document.getElementById('cca-map');
  if (!mapContainer || typeof L === 'undefined') return;

  // Création de la carte centrée sur la Côte d'Ivoire
  mapInstance = L.map('cca-map', {
    center: [7.75, -5.35],
    zoom: 7,
    minZoom: 6,
    maxZoom: 14,
    scrollWheelZoom: false
  });

  // Fond de carte OpenStreetMap avec tuiles claires
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | CCA Côte d\'Ivoire',
    maxZoom: 18
  }).addTo(mapInstance);

  // Icône personnalisée officielle CCA
  const createCcaIcon = (isActive = false) => {
    return L.divIcon({
      className: 'cca-custom-marker-wrapper',
      html: `
        <div class="cca-marker-pin ${isActive ? 'active' : ''}">
          <div class="pin-ring"></div>
          <div class="pin-dot"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -20]
    });
  };

  // Rendu des popups enrichis
  const buildPopupHtml = (d) => {
    const badgesHtml = d.filieres.map(f => {
      const cls = f.toLowerCase().includes('coton') ? 'green' : f.toLowerCase().includes('karit') ? 'brown' : 'orange';
      return `<span class="filiere-pill ${cls}">${f}</span>`;
    }).join('');

    return `
      <div class="cca-popup-card">
        <div class="cca-popup-header">
          <div>
            <h4 class="popup-title">${d.name}</h4>
            <span class="popup-zone">${d.zone}</span>
          </div>
          <span class="popup-badge">${d.badge}</span>
        </div>
        <div class="cca-popup-body">
          <div class="popup-filieres">${badgesHtml}</div>
          <p class="popup-info"><strong>📍 Adresse :</strong> ${d.address}</p>
          <p class="popup-info"><strong>✉️ Email :</strong> <a href="mailto:${d.email}">${d.email}</a></p>
          <div class="popup-actions">
            <a href="tel:${d.tel.replace(/\s+/g, '')}" class="popup-btn call-btn">
              <span>📞</span> Appeler ${d.tel}
            </a>
          </div>
        </div>
      </div>
    `;
  };

  // Instanciation des marqueurs
  CCA_DELEGATIONS.forEach((d) => {
    const marker = L.marker(d.coordinates, { icon: createCcaIcon(false) }).addTo(mapInstance);
    marker.bindPopup(buildPopupHtml(d), { maxWidth: 300, className: 'cca-leaflet-popup' });
    markersMap[d.name] = marker;

    marker.on('click', () => {
      highlightDelegation(d.name);
    });
  });

  renderDelegationsList();
  setupMapSearchAndFilters();
}

function renderDelegationsList() {
  const listContainer = document.getElementById('delegations-list');
  if (!listContainer) return;

  listContainer.innerHTML = '';

  const filtered = CCA_DELEGATIONS.filter(d => {
    const matchFiliere = activeFiliereFilter === 'all' ||
      d.filieres.some(f => f.toLowerCase().includes(activeFiliereFilter));
    const matchSearch = !searchQuery ||
      d.name.toLowerCase().includes(searchQuery) ||
      d.zone.toLowerCase().includes(searchQuery) ||
      d.address.toLowerCase().includes(searchQuery);

    return matchFiliere && matchSearch;
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <li style="padding: 1.5rem 1rem; text-align: center; color: #64748b; font-size: 0.875rem;">
        Aucune délégation ne correspond à votre recherche.
      </li>
    `;
    return;
  }

  filtered.forEach(d => {
    const li = document.createElement('li');
    li.className = 'delegation-item';
    li.id = `delegation-${d.name.toLowerCase().replace(/\s+/g, '-')}`;

    const tags = d.filieres.map(f => {
      const cls = f.toLowerCase().includes('coton') ? 'green' : f.toLowerCase().includes('karit') ? 'brown' : 'orange';
      return `<span class="tag-micro ${cls}">${f}</span>`;
    }).join('');

    li.innerHTML = `
      <div class="delegation-meta">
        <div class="delegation-name-wrap">
          <strong class="delegation-name">${d.name}</strong>
          <span class="delegation-badge">${d.badge}</span>
        </div>
        <div class="delegation-coords">${d.zone}</div>
        <div class="delegation-tags">${tags}</div>
      </div>
      <div class="delegation-arrow">➔</div>
    `;

    li.addEventListener('click', () => {
      highlightDelegation(d.name);
      mapInstance.flyTo(d.coordinates, 10, { duration: 1.1 });
      setTimeout(() => {
        markersMap[d.name]?.openPopup();
      }, 1150);
    });

    listContainer.appendChild(li);
  });
}

function highlightDelegation(name) {
  document.querySelectorAll('.delegation-item').forEach(el => el.classList.remove('active'));
  const targetItem = document.getElementById(`delegation-${name.toLowerCase().replace(/\s+/g, '-')}`);
  if (targetItem) {
    targetItem.classList.add('active');
    targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function setupMapSearchAndFilters() {
  const panel = document.querySelector('.delegations-panel');
  if (!panel || panel.querySelector('.map-search-bar')) return;

  // Création dynamique de la barre de recherche dans le panneau des délégations
  const searchWrap = document.createElement('div');
  searchWrap.className = 'map-search-bar';
  searchWrap.innerHTML = `
    <div class="map-input-wrap">
      <input type="text" id="delegation-search-input" placeholder="Rechercher une délégation, ville..." aria-label="Rechercher une délégation">
    </div>
  `;

  panel.insertBefore(searchWrap, panel.querySelector('.delegations-list'));

  const input = document.getElementById('delegation-search-input');
  if (input) {
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderDelegationsList();
    });
  }
}

document.addEventListener('DOMContentLoaded', initCcaMap);

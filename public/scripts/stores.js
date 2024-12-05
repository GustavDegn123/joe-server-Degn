// Initialiserer kortet og henter Mapbox adgangstoken dynamisk
async function initializeMap() {
    try {
        // Henter Mapbox adgangstoken fra backend
        const response = await fetch('/api/mapbox-token');
        if (!response.ok) throw new Error("Kunne ikke hente Mapbox adgangstoken");

        const data = await response.json();
        if (!data.accessToken) throw new Error("Adgangstoken mangler i svaret");

        // Sætter Mapbox adgangstoken
        mapboxgl.accessToken = data.accessToken;

        // Initialiserer kortet med standardcenter og zoomniveau
        const map = new mapboxgl.Map({
            container: 'map', // ID'et på HTML-elementet, hvor kortet skal vises
            style: 'mapbox://styles/mapbox/streets-v11', // Kortets stil
            center: [12.5755, 55.6811], // Standardkoordinater (København)
            zoom: 13.5, // Zoomniveau
        });

        // Henter og viser butikker på kortet
        fetchStores(map);
    } catch (error) {
        console.error("Fejl ved initialisering af kort:", error);
    }
}

// Henter butikker fra backend og viser dem på kortet
async function fetchStores(map) {
    try {
        const response = await fetch('/api/stores');
        if (!response.ok) throw new Error("Kunne ikke hente butikdata");

        const stores = await response.json();
        displayStores(stores, map); // Viser butikker på kortet og i UI

        // Tilføjer eventlistener til søgefeltet for at filtrere butikker
        document.querySelector('.store-search').addEventListener('input', (e) => {
            searchStores(e.target.value, stores, map);
        });
    } catch (error) {
        console.error('Fejl ved hentning af butikker:', error);
    }
}

// Viser butikker på kortet og i brugergrænsefladen
function displayStores(stores, map) {
    const storesContainer = document.getElementById('stores-container');
    storesContainer.innerHTML = ''; // Rydder tidligere butikker fra UI

    stores.forEach(store => {
        // Opretter en markør på kortet for hver butik
        const marker = new mapboxgl.Marker()
            .setLngLat([store.Longitude, store.Latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${store.Titel}</h3><p>${store.Adresse}</p>`)) // Popup med butikoplysninger
            .addTo(map);

        // Opretter en HTML-element for butikken i UI
        const storeElement = document.createElement('div');
        storeElement.classList.add('store-item');
        storeElement.innerHTML = `
            <h3>${store.Titel}</h3>
            <p><strong>Adresse:</strong> ${store.Adresse}</p>
            <p><strong>Åbningstider:</strong> ${store.Åbningstidspunkt}</p>
            <a href="#" class="order-now-btn" data-store-name="${store.Titel}" data-store-address="${store.Adresse}" data-store-hours="${store.Åbningstidspunkt}">ORDER NOW</a>
        `;
        storesContainer.appendChild(storeElement);

        // Tilføjer eventlistener til "Order Now"-knappen
        storeElement.querySelector('.order-now-btn').addEventListener('click', (event) => {
            event.preventDefault();
            const store = {
                name: event.target.dataset.storeName,
                address: event.target.dataset.storeAddress,
                hours: event.target.dataset.storeHours,
            };
            setCookie("selectedStore", JSON.stringify(store), 1); // Gemmer butiksinfo i en cookie i 1 dag
            window.location.href = "/orderNow"; // Redirecter til ordre-side
        });
    });
}

// Filtrerer butikker baseret på søgeforespørgsler
async function searchStores(query, stores, map) {
    if (!query) {
        displayStores(stores, map); // Viser alle butikker, hvis søgefeltet er tomt
        return;
    }

    try {
        // Henter geografisk data for søgeforespørgslen
        const geocodeResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`);
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.features && geocodeData.features.length > 0) {
            const { center } = geocodeData.features[0];
            const searchLng = center[0];
            const searchLat = center[1];

            // Beregner afstand fra søgningens koordinater til hver butik
            const storesWithDistance = stores.map(store => {
                const distance = calculateDistance(searchLat, searchLng, store.Latitude, store.Longitude);
                return { ...store, distance };
            });

            // Sorterer butikker efter afstand og viser de nærmeste
            const closestStores = storesWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 4);
            displayStores(closestStores, map);
        }
    } catch (error) {
        console.error('Fejl ved hentning af lokation:', error);
    }
}

// Haversine-formlen til at beregne afstanden mellem to geografiske punkter
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Jordens radius i kilometer
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Sætter en cookie med navn, værdi og varighed
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
    console.log(`Cookie sat: ${name} = ${value}`);
}

// Initialiserer kortet ved indlæsning
initializeMap();
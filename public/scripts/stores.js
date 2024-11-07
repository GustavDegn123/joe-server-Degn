mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VzYXR2MTUwOTIwMDMiLCJhIjoiY20zNXowMGlrMGZrazJuc2ZtNjdrend5byJ9.j4woOBatLukqYYsRWJJZiw';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [12.5755, 55.6811],
    zoom: 13.5
});

async function fetchStores() {
    try {
        const response = await fetch('/api/stores');
        if (!response.ok) throw new Error("Failed to fetch stores data");
        
        const stores = await response.json();
        displayStores(stores);

        document.querySelector('.store-search').addEventListener('input', (e) => {
            searchStores(e.target.value, stores);
        });
    } catch (error) {
        console.error('Error fetching stores:', error);
    }
}

function displayStores(stores) {
    const storesContainer = document.getElementById('stores-container');
    storesContainer.innerHTML = '';
    
    stores.forEach(store => {
        // Tilføj markør på kortet
        const marker = new mapboxgl.Marker()
            .setLngLat([store.Longitude, store.Latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${store.Titel}</h3><p>${store.Adresse}</p>`))
            .addTo(map);

        // Tilføj butik til listen i HTML
        const storeElement = document.createElement('div');
        storeElement.classList.add('store-item');
        storeElement.innerHTML = `
            <h3>${store.Titel}</h3>
            <p><strong>Adresse:</strong> ${store.Adresse}</p>
            <p><strong>Åbningstider:</strong> ${store.Åbningstidspunkt}</p>
            <a href="#" class="order-now-btn">ORDER NOW</a>a
        `;
        storesContainer.appendChild(storeElement);
    });
}

async function searchStores(query, stores) {
    if (!query) {
        displayStores(stores); // Vis alle butikker, hvis søgefeltet er tomt
        return;
    }

    try {
        const geocodeResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`);
        const geocodeData = await geocodeResponse.json();
        
        if (geocodeData.features && geocodeData.features.length > 0) {
            const { center } = geocodeData.features[0]; // Hent longitude og latitude for søgeadressen
            const searchLng = center[0];
            const searchLat = center[1];
            
            // Beregn afstand til hver butik
            const storesWithDistance = stores.map(store => {
                const distance = calculateDistance(searchLat, searchLng, store.Latitude, store.Longitude);
                return { ...store, distance };
            });

            // Sortér butikkerne efter afstand og vis de fire nærmeste
            const closestStores = storesWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 4);
            displayStores(closestStores);
        }
    } catch (error) {
        console.error('Error fetching location:', error);
    }
}

// Beregn afstand mellem to sæt koordinater ved hjælp af Haversine-formlen
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius af jorden i kilometer
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Afstand i kilometer
}

fetchStores();
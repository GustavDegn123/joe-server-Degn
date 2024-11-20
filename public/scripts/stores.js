// Initialize the map and fetch Mapbox access token dynamically
async function initializeMap() {
    try {
        // Fetch the Mapbox access token from the backend
        const response = await fetch('/api/mapbox-token');
        if (!response.ok) throw new Error("Failed to fetch Mapbox access token");

        const data = await response.json();
        if (!data.accessToken) throw new Error("Access token is missing in response");

        // Set the Mapbox access token
        mapboxgl.accessToken = data.accessToken;

        // Initialize the map
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [12.5755, 55.6811],
            zoom: 13.5,
        });

        // Fetch and display stores on the map
        fetchStores(map);
    } catch (error) {
        console.error("Error initializing map:", error);
    }
}

// Fetch and display stores on the map
async function fetchStores(map) {
    try {
        const response = await fetch('/api/stores');
        if (!response.ok) throw new Error("Failed to fetch stores data");

        const stores = await response.json();
        displayStores(stores, map);

        document.querySelector('.store-search').addEventListener('input', (e) => {
            searchStores(e.target.value, stores, map);
        });
    } catch (error) {
        console.error('Error fetching stores:', error);
    }
}

// Display stores on the map
function displayStores(stores, map) {
    const storesContainer = document.getElementById('stores-container');
    storesContainer.innerHTML = '';

    stores.forEach(store => {
        const marker = new mapboxgl.Marker()
            .setLngLat([store.Longitude, store.Latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${store.Titel}</h3><p>${store.Adresse}</p>`))
            .addTo(map);

        const storeElement = document.createElement('div');
        storeElement.classList.add('store-item');
        storeElement.innerHTML = `
            <h3>${store.Titel}</h3>
            <p><strong>Adresse:</strong> ${store.Adresse}</p>
            <p><strong>Åbningstider:</strong> ${store.Åbningstidspunkt}</p>
            <a href="#" class="order-now-btn" data-store-name="${store.Titel}" data-store-address="${store.Adresse}" data-store-hours="${store.Åbningstidspunkt}">ORDER NOW</a>
        `;
        storesContainer.appendChild(storeElement);

        storeElement.querySelector('.order-now-btn').addEventListener('click', (event) => {
            event.preventDefault();
            const store = {
                name: event.target.dataset.storeName,
                address: event.target.dataset.storeAddress,
                hours: event.target.dataset.storeHours,
            };
            setCookie("selectedStore", JSON.stringify(store), 1); // Save store info for 1 day
            window.location.href = "/orderNow"; // Redirect to Menu page
        });
    });
}

// Fetch stores and filter based on the search query
async function searchStores(query, stores, map) {
    if (!query) {
        displayStores(stores, map); // Show all stores if search field is empty
        return;
    }

    try {
        const geocodeResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`);
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.features && geocodeData.features.length > 0) {
            const { center } = geocodeData.features[0];
            const searchLng = center[0];
            const searchLat = center[1];

            const storesWithDistance = stores.map(store => {
                const distance = calculateDistance(searchLat, searchLng, store.Latitude, store.Longitude);
                return { ...store, distance };
            });

            const closestStores = storesWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 4);
            displayStores(closestStores, map);
        }
    } catch (error) {
        console.error('Error fetching location:', error);
    }
}

// Haversine formula to calculate the distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
    console.log(`Cookie set: ${name} = ${value}`);
}

// Initialize the map
initializeMap();

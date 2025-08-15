// Get the map container element and parse the JSON data
const mapElement = document.getElementById('map');
if (mapElement) {
    const locations = JSON.parse(mapElement.dataset.locations);

    // Initialize the map and set its initial view
    const map = L.map('map', {
        zoomControl: false, // You can choose to enable this later
        scrollWheelZoom: false // Prevents zooming with the mouse wheel
    });

    // Add the tile layer (OpenStreetMap is a good free choice)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create an array to hold all marker coordinates
    const points = [];
    locations.forEach(loc => {
        // Leaflet requires coordinates in [latitude, longitude] format
        const coords = [loc.coordinates[1], loc.coordinates[0]];
        points.push(coords);

        // Add a marker for each location
        L.marker(coords)
            .addTo(map)
            .bindPopup(`Day ${loc.day}: ${loc.description}`, { autoClose: false })
            .openPopup();
    });

    // Create a bounds object to fit the map view to all markers
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, {
        padding: [80, 80] // Add some padding around the markers
    });
}
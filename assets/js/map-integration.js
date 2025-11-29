/**
 * MapLibre GL JS Map Integration for Tailor Locations
 * Uses OpenStreetMap vector tiles via Protomaps (free, no API key required)
 * Modern GPU-accelerated maps with smooth animations
 */

// Initialize map instances storage
const mapInstances = {};

// MapLibre map style (using OSM vector tiles)
const MAP_STYLE = {
    "version": 8,
    "sources": {
        "osm": {
            "type": "raster",
            "tiles": ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            "tileSize": 256,
            "attribution": "&copy; OpenStreetMap Contributors",
            "maxzoom": 19
        }
    },
    "layers": [
        {
            "id": "osm",
            "type": "raster",
            "source": "osm",
            "minzoom": 0,
            "maxzoom": 22
        }
    ]
};

/**
 * Show location on map modal (for customers viewing tailor location)
 */
function showLocationModal(tailorId, tailorName, latitude, longitude) {
    if (!latitude || !longitude) {
        alert('Location not available for this tailor');
        return;
    }

    const modalHTML = `
        <div id="locationModal" class="modal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; align-items: center; justify-content: center; padding: 2rem;">
            <div class="modal-content" style="max-width: 700px; width: 95%; background: white; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
                <div class="modal-header" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;"><i class="fas fa-map-marker-alt"></i> ${tailorName}'s Location</h3>
                    <button onclick="closeLocationModal()" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 1.5rem; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">&times;</button>
                </div>
                <div id="viewMapContainer" style="width: 100%; height: 450px;"></div>
                <div style="padding: 1rem; background: #f9fafb; display: flex; gap: 1rem; align-items: center;">
                    <div style="flex: 1;">
                        <strong>📍 Coordinates:</strong> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
                    </div>
                    <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 0.875rem; white-space: nowrap;">
                        <i class="fas fa-external-link-alt"></i> Google Maps
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Initialize MapLibre GL map after a short delay
    setTimeout(() => {
        const map = new maplibregl.Map({
            container: 'viewMapContainer',
            style: MAP_STYLE,
            center: [longitude, latitude], // MapLibre uses [lng, lat]
            zoom: 15,
            pitch: 45, // 3D tilt
            bearing: 0,
            antialias: true
        });

        // Add navigation controls (zoom buttons)
        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        // Add fullscreen control
        map.addControl(new maplibregl.FullscreenControl(), 'top-right');

        // Create custom marker with popup
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iIzEwYjk4MSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iOCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=)';
        el.style.backgroundSize = 'contain';
        el.style.cursor = 'pointer';

        // Add pulsing animation
        el.style.animation = 'pulse 2s infinite';

        // Add CSS animation if not exists
        if (!document.getElementById('markerAnimation')) {
            const style = document.createElement('style');
            style.id = 'markerAnimation';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
            `;
            document.head.appendChild(style);
        }

        const marker = new maplibregl.Marker({ element: el })
            .setLngLat([longitude, latitude])
            .setPopup(
                new maplibregl.Popup({ offset: 25 })
                    .setHTML(`<h4 style="margin:0 0 0.5rem 0;">${tailorName}</h4><p style="margin:0;">Shop Location</p>`)
            )
            .addTo(map);

        // Open popup automatically
        marker.togglePopup();

        // Store map instance
        mapInstances['viewMap'] = map;
    }, 100);
}

/**
 * Close location viewing modal
 */
function closeLocationModal() {
    // Destroy map instance
    if (mapInstances['viewMap']) {
        mapInstances['viewMap'].remove();
        delete mapInstances['viewMap'];
    }

    const modal = document.getElementById('locationModal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Show location setter modal (for tailors to set their location)
 */
function showLocationSetterModal() {
    const modalHTML = `
        <div id="locationSetterModal" class="modal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; align-items: center; justify-content: center; padding: 2rem;">
            <div class="modal-content" style="max-width: 700px; width: 95%; background: white; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 1.5rem; position: sticky; top: 0; z-index: 10;">
                    <h3 style="margin: 0;"><i class="fas fa-map-pin"></i> Set Your Shop Location</h3>
                    <button onclick="closeLocationSetterModal()" style="position: absolute; right: 1.5rem; top: 1.5rem; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 1.5rem; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">&times;</button>
                </div>
                <div style="padding: 1.5rem;">
                    <div style="background: #e0e7ff; border-left: 4px solid #6366f1; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
                        <strong>📍 How to set location:</strong><br>
                        1. Use search box to find your city/area<br>
                        2. Click "Get My Location" to use your current position (may be inaccurate on localhost)<br>
                        3. Or zoom and click anywhere on the map to manually set location<br>
                        4. Drag the marker to fine-tune position<br>
                        5. Click "Save Location" to confirm
                    </div>
                    
                    <!-- Location Search Box -->
                    <div style="margin-bottom: 1rem;">
                        <div style="position: relative;">
                            <input type="text" id="locationSearch" placeholder="Search city, colony, landmark... (e.g., Civil Lines, Satna)" 
                                   style="width: 100%; padding: 0.75rem 2.5rem 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.9rem;"
                                   onkeypress="if(event.key === 'Enter') searchLocation();">
                            <button onclick="searchLocation()" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: #8b5cf6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                        <div id="searchResults" style="display: none; margin-top: 0.5rem; background: white; border: 2px solid #e5e7eb; border-radius: 8px; max-height: 350px; overflow-y: auto;"></div>
                    </div>
                    
                    <!-- OR Divider -->
                    <div style="text-align: center; margin: 1rem 0; color: #6b7280; font-weight: 500;">
                        <span style="background: white; padding: 0 10px; position: relative; z-index: 1;">OR</span>
                        <hr style="border: none; border-top: 2px solid #e5e7eb; margin-top: -12px;">
                    </div>
                    
                    <!-- Google Maps Manual Option -->
                    <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.75rem;">
                            <i class="fab fa-google" style="font-size: 24px; color: #4285f4;"></i>
                            <div style="flex: 1;">
                                <strong style="color: #065f46;">Use Google Maps (Recommended)</strong>
                                <div style="font-size: 12px; color: #059669;">Find any location, even unmapped colonies</div>
                            </div>
                        </div>
                        <button onclick="window.open('https://www.google.com/maps/@24.6,80.8,13z', '_blank')" style="width: 100%; padding: 0.75rem; background: #4285f4; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; margin-bottom: 0.75rem;">
                            <i class="fas fa-external-link-alt"></i> Open Google Maps
                        </button>
                        <div style="background: white; padding: 0.75rem; border-radius: 6px; font-size: 13px; color: #374151;">
                            <strong>How to get coordinates:</strong>
                            <ol style="margin: 8px 0 0 0; padding-left: 20px; line-height: 1.6;">
                                <li>Click button above to open Google Maps</li>
                                <li>Search for your location (e.g., "Civil Lines, Satna")</li>
                                <li><strong>Right-click</strong> on your exact shop location</li>
                                <li>Click the coordinates at the top (e.g., "24.623, 80.834")</li>
                                <li>Paste below and click "Use Location"</li>
                            </ol>
                        </div>
                        <div style="margin-top: 0.75rem;">
                            <input type="text" id="manualCoords" placeholder="Paste coordinates here: 24.623, 80.834" 
                                   style="width: 100%; padding: 0.75rem; border: 2px solid #d1d5db; border-radius: 6px; font-size: 14px; margin-bottom: 0.5rem;">
                            <button onclick="parseAndSetCoordinates()" style="width: 100%; padding: 0.75rem; background: #10b981; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                                <i class="fas fa-check"></i> Use This Location
                            </button>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <button onclick="getCurrentLocation()" style="flex: 1; padding: 0.75rem; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            <i class="fas fa-crosshairs"></i> Get My Location
                        </button>
                        <button onclick="saveCurrentLocation()" id="saveLocationBtn" disabled style="flex: 1; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; opacity: 0.5;">
                            <i class="fas fa-save"></i> Save Location
                        </button>
                    </div>
                    <div id="setMapContainer" style="width: 100%; height: 400px; border: 2px solid #e5e7eb; border-radius: 8px;"></div>
                    <div id="coordinatesDisplay" style="margin-top: 1rem; padding: 0.75rem; background: #f9fafb; border-radius: 6px; font-size: 0.875rem; color: #6b7280; text-align: center;">
                        Click on map or use "Get My Location" to set coordinates
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Initialize MapLibre GL map (centered on India by default)
    setTimeout(() => {
        const map = new maplibregl.Map({
            container: 'setMapContainer',
            style: MAP_STYLE,
            center: [78.9629, 20.5937], // [lng, lat] - Center of India
            zoom: 4,
            pitch: 0,
            antialias: true
        });

        // Store reference globally
        window.locationSetterMap = map;

        // Wait for map to fully load
        map.on('load', function () {
            console.log('✅ Map loaded successfully!');
            // Enable the "Use This Location" button
            const coordInput = document.getElementById('manualCoords');
            if (coordInput) {
                coordInput.placeholder = '✅ Ready! Paste coordinates here: 24.623, 80.834';
            }
        });

        // Add navigation controls
        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        // Add geolocate control for easy current location
        map.addControl(
            new maplibregl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: false,
                showUserHeading: true
            }),
            'top-right'
        );

        let marker = null;

        // Allow clicking on map to set location
        map.on('click', function (e) {
            const lat = e.lngLat.lat;
            const lng = e.lngLat.lng;

            // Remove existing marker
            if (marker) {
                marker.remove();
            }

            // Create custom marker element
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.width = '40px';
            el.style.height = '40px';
            el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iIzhiNWNmNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iOCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=)';
            el.style.backgroundSize = 'contain';
            el.style.cursor = 'pointer';
            el.style.animation = 'pulse 2s infinite';

            // Add new marker
            marker = new maplibregl.Marker({ element: el, draggable: true })
                .setLngLat([lng, lat])
                .setPopup(new maplibregl.Popup().setHTML('<strong>Your Shop Location</strong>'))
                .addTo(map);

            marker.togglePopup();

            // Update on drag
            marker.on('dragend', function () {
                const lngLat = marker.getLngLat();
                window.selectedLocation = { latitude: lngLat.lat, longitude: lngLat.lng };
                document.getElementById('coordinatesDisplay').innerHTML = `
                    <strong>📍 Selected Location:</strong> ${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}
                `;
            });

            // Store coordinates
            window.selectedLocation = { latitude: lat, longitude: lng };

            // Update display
            document.getElementById('coordinatesDisplay').innerHTML = `
                <strong>📍 Selected Location:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
            `;

            // Enable save button
            document.getElementById('saveLocationBtn').disabled = false;
            document.getElementById('saveLocationBtn').style.opacity = '1';
        });

        // Store map instance
        mapInstances['setMap'] = { map, marker: null };

        // Function to get current location
        window.getCurrentLocation = function () {
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser');
                return;
            }

            document.getElementById('coordinatesDisplay').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting your location...';

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    // Remove existing marker
                    if (mapInstances['setMap'].marker) {
                        mapInstances['setMap'].marker.remove();
                    }

                    // Center map and add marker
                    map.flyTo({ center: [lng, lat], zoom: 15, duration: 2000 });

                    const el = document.createElement('div');
                    el.className = 'custom-marker';
                    el.style.width = '40px';
                    el.style.height = '40px';
                    el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iIzEwYjk4MSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iOCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=)';
                    el.style.backgroundSize = 'contain';
                    el.style.animation = 'pulse 2s infinite';

                    mapInstances['setMap'].marker = new maplibregl.Marker({ element: el, draggable: true })
                        .setLngLat([lng, lat])
                        .setPopup(new maplibregl.Popup().setHTML('<strong>📍 Your Current Location</strong>'))
                        .addTo(map);

                    mapInstances['setMap'].marker.togglePopup();

                    // Update on drag
                    mapInstances['setMap'].marker.on('dragend', function () {
                        const lngLat = mapInstances['setMap'].marker.getLngLat();
                        window.selectedLocation = { latitude: lngLat.lat, longitude: lngLat.lng };
                        document.getElementById('coordinatesDisplay').innerHTML = `
                            <strong>📍 Current Location:</strong> ${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}
                        `;
                    });

                    // Store coordinates
                    window.selectedLocation = { latitude: lat, longitude: lng };

                    // Update display
                    document.getElementById('coordinatesDisplay').innerHTML = `
                        <strong>📍 Current Location:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                    `;

                    // Enable save button
                    document.getElementById('saveLocationBtn').disabled = false;
                    document.getElementById('saveLocationBtn').style.opacity = '1';
                },
                function (error) {
                    let errorMsg = 'Unable to get location. ';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMsg += 'Please allow location access.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMsg += 'Location information unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMsg += 'Request timed out.';
                            break;
                    }
                    document.getElementById('coordinatesDisplay').innerHTML = `
                        <span style="color: #ef4444;"><i class="fas fa-exclamation-triangle"></i> ${errorMsg}</span>
                    `;
                    alert(errorMsg + ' You can still click on the map to set location manually.');
                }
            );
        };

        // Function to search location using Nominatim (OpenStreetMap Geocoding via PHP proxy)
        window.searchLocation = function () {
            const query = document.getElementById('locationSearch').value.trim();
            if (!query) {
                alert('Please enter a city or location name');
                return;
            }

            const resultsDiv = document.getElementById('searchResults');
            resultsDiv.innerHTML = '<div style="padding: 10px; text-align: center;"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
            resultsDiv.style.display = 'block';

            // Use PHP proxy to avoid CORS issues
            const searchUrl = `../api/tailors/search_location.php?q=${encodeURIComponent(query)}`;

            fetch(searchUrl)
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        resultsDiv.innerHTML = `
                            <div style="padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; text-align: left;">
                                <div style="color: #856404; margin-bottom: 10px; font-weight: 500;">
                                    <i class="fas fa-exclamation-triangle"></i> Location not found in map database
                                </div>
                                <div style="font-size: 13px; color: #856404; margin-bottom: 12px;">
                                    "${query}" is not available in OpenStreetMap.
                                </div>
                                <div style="font-size: 12px; color: #666; background: white; padding: 10px; border-radius: 6px;">
                                    <strong>Try these alternatives:</strong>
                                    <ul style="margin: 8px 0; padding-left: 20px;">
                                        <li>Search for main city: <button onclick="document.getElementById('locationSearch').value='Satna'; searchLocation();" style="color: #8b5cf6; border: none; background: none; cursor: pointer; text-decoration: underline;">Satna</button></li>
                                        <li>Search for landmark: <button onclick="document.getElementById('locationSearch').value='Railway Station Satna'; searchLocation();" style="color: #8b5cf6; border: none; background: none; cursor: pointer; text-decoration: underline;">Railway Station</button></li>
                                        <li>Or <strong>zoom the map manually</strong> and click your location</li>
                                    </ul>
                                </div>
                            </div>
                        `;
                        return;
                    }

                    const results = data.results;

                    if (results.length === 0) {
                        resultsDiv.innerHTML = `
                            <div style="padding: 15px; color: #e74c3c; text-align: center;">
                                <i class="fas fa-exclamation-circle" style="font-size: 24px; margin-bottom: 10px;"></i>
                                <div style="margin-bottom: 10px;">No results found</div>
                                <div style="font-size: 12px; color: #666;">
                                    Try searching for:
                                    <ul style="list-style: none; padding: 5px 0; margin: 5px 0;">
                                        <li>• City name: "Satna"</li>
                                        <li>• Colony: "Civil Lines, Satna"</li>
                                        <li>• Landmark: "Railway Station, Satna"</li>
                                        <li>• Area: "Rewa Road, Satna"</li>
                                    </ul>
                                </div>
                            </div>
                        `;
                        return;
                    }

                    // Function to get icon and color based on place type
                    const getPlaceIcon = (result) => {
                        const type = result.type || '';
                        const placeClass = result.class || '';
                        const addressType = result.addresstype || '';

                        // Determine icon based on place type
                        if (type.includes('city') || placeClass === 'place' || addressType === 'city') {
                            return { icon: 'fa-city', color: '#3498db', label: 'City' };
                        } else if (type.includes('town') || type.includes('village') || addressType === 'town') {
                            return { icon: 'fa-home', color: '#9b59b6', label: 'Town' };
                        } else if (type.includes('suburb') || type.includes('neighbourhood') || type.includes('quarter') || addressType === 'suburb') {
                            return { icon: 'fa-building', color: '#e67e22', label: 'Colony/Area' };
                        } else if (placeClass === 'railway' || type.includes('station')) {
                            return { icon: 'fa-train', color: '#16a085', label: 'Railway' };
                        } else if (placeClass === 'amenity' || type.includes('school') || type.includes('hospital') || type.includes('temple')) {
                            return { icon: 'fa-landmark', color: '#c0392b', label: 'Landmark' };
                        } else if (placeClass === 'highway' || type.includes('road') || addressType === 'road') {
                            return { icon: 'fa-road', color: '#7f8c8d', label: 'Road' };
                        } else if (placeClass === 'shop' || placeClass === 'building') {
                            return { icon: 'fa-store', color: '#f39c12', label: 'Shop/Building' };
                        } else {
                            return { icon: 'fa-map-marker-alt', color: '#e74c3c', label: 'Place' };
                        }
                    };

                    // Display search results with icons and categories
                    let html = '<div style="max-height: 300px; overflow-y: auto;">';
                    results.forEach((result, index) => {
                        const displayName = result.display_name;
                        const lat = parseFloat(result.lat);
                        const lon = parseFloat(result.lon);
                        const placeInfo = getPlaceIcon(result);

                        html += `
                            <div onclick="selectSearchResult(${lat}, ${lon}, '${displayName.replace(/'/g, "\\'")}')" style="
                                padding: 12px;
                                border-bottom: 1px solid #eee;
                                cursor: pointer;
                                transition: all 0.2s;
                                display: flex;
                                align-items: flex-start;
                                gap: 12px;
                            " onmouseover="this.style.backgroundColor='#f8f9fa'; this.style.paddingLeft='16px';" onmouseout="this.style.backgroundColor='white'; this.style.paddingLeft='12px';">
                                <div style="flex-shrink: 0; width: 36px; height: 36px; background-color: ${placeInfo.color}15; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas ${placeInfo.icon}" style="color: ${placeInfo.color}; font-size: 16px;"></i>
                                </div>
                                <div style="flex: 1; min-width: 0;">
                                    <div style="font-size: 13px; font-weight: 500; color: #2c3e50; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${displayName.split(',')[0]}</div>
                                    <div style="font-size: 11px; color: #7f8c8d; margin-bottom: 2px;">
                                        <span style="background-color: ${placeInfo.color}; color: white; padding: 2px 6px; border-radius: 3px; margin-right: 6px; font-size: 10px;">${placeInfo.label}</span>
                                        ${displayName.split(',').slice(1).join(',').trim()}
                                    </div>
                                </div>
                                <div style="flex-shrink: 0; color: #bdc3c7;">
                                    <i class="fas fa-chevron-right" style="font-size: 12px;"></i>
                                </div>
                            </div>
                        `;
                    });
                    html += '</div>';
                    resultsDiv.innerHTML = html;
                })
                .catch(error => {
                    console.error('Search error:', error);
                    resultsDiv.innerHTML = '<div style="padding: 10px; color: #e74c3c;">Search failed. Please check your internet connection and try again.</div>';
                });
        };

        // Function to select a search result
        window.selectSearchResult = function (lat, lon, displayName) {
            // Hide search results
            document.getElementById('searchResults').style.display = 'none';
            document.getElementById('locationSearch').value = '';

            // Fly to selected location
            locationSetterMap.flyTo({
                center: [lon, lat],
                zoom: 15,
                pitch: 45,
                bearing: 0,
                duration: 2000,
                essential: true
            });

            // Update selected location
            window.selectedLocation = { latitude: lat, longitude: lon };

            // Update marker position
            if (window.locationMarker) {
                window.locationMarker.setLngLat([lon, lat]);
            } else {
                // Create marker if it doesn't exist
                const el = document.createElement('div');
                el.className = 'maplibre-marker-draggable';
                el.innerHTML = '<i class="fas fa-map-marker-alt" style="color: #e74c3c; font-size: 36px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></i>';

                window.locationMarker = new maplibregl.Marker({
                    element: el,
                    draggable: true
                })
                    .setLngLat([lon, lat])
                    .addTo(locationSetterMap);

                // Update location when marker is dragged
                window.locationMarker.on('dragend', function () {
                    const lngLat = window.locationMarker.getLngLat();
                    window.selectedLocation = {
                        latitude: lngLat.lat,
                        longitude: lngLat.lng
                    };
                });
            }

            alert('📍 Location selected! You can drag the marker to fine-tune the position, then click "Save Location".');
        };

        // Function to parse and set coordinates from Google Maps
        window.parseAndSetCoordinates = function () {
            console.log('parseAndSetCoordinates called');

            const input = document.getElementById('manualCoords');

            if (!input) {
                alert('❌ Input field not found. Please refresh the page.');
                console.error('manualCoords input not found');
                return;
            }

            const value = input.value.trim();
            console.log('Input value:', value);

            if (!value) {
                alert('❌ Please paste coordinates from Google Maps');
                return;
            }

            // Try to parse various formats:
            // "24.623, 80.834" or "24.623,80.834" or "24.623 80.834"
            let lat, lon;

            // Remove any extra characters
            const cleaned = value.replace(/[^\d.,-\s]/g, '');
            console.log('Cleaned value:', cleaned);

            // Split by comma, space, or both
            const parts = cleaned.split(/[,\s]+/).filter(p => p);
            console.log('Parsed parts:', parts);

            if (parts.length >= 2) {
                lat = parseFloat(parts[0]);
                lon = parseFloat(parts[1]);
            } else {
                alert('❌ Invalid format. Please use: 24.623, 80.834');
                return;
            }

            console.log('Parsed coordinates:', lat, lon);

            // Validate
            if (isNaN(lat) || isNaN(lon)) {
                alert('❌ Invalid coordinates. Please enter valid numbers.');
                return;
            }

            if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                alert('❌ Coordinates out of range. Check the values.');
                return;
            }

            // Check if map exists
            if (typeof locationSetterMap === 'undefined' || !locationSetterMap) {
                alert('⏳ Map is still loading. Please wait 3 seconds and try again.\n\nTip: Wait until you see the world map appear below.');
                console.error('locationSetterMap not found');
                return;
            }

            console.log('Calling setLocationFromGoogleMaps...');

            // Set the location
            setLocationFromGoogleMaps(lat, lon);

            // Clear input
            input.value = '';
        };

        // Function to set location from Google Maps coordinates
        window.setLocationFromGoogleMaps = function (lat, lon) {
            // Fly to selected location
            locationSetterMap.flyTo({
                center: [lon, lat],
                zoom: 17,
                pitch: 45,
                bearing: 0,
                duration: 2000,
                essential: true
            });

            // Update selected location
            window.selectedLocation = { latitude: lat, longitude: lon };

            // Update or create marker
            if (window.locationMarker) {
                window.locationMarker.setLngLat([lon, lat]);
            } else {
                const el = document.createElement('div');
                el.className = 'maplibre-marker-draggable';
                el.innerHTML = '<i class="fas fa-map-marker-alt" style="color: #e74c3c; font-size: 36px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></i>';

                window.locationMarker = new maplibregl.Marker({
                    element: el,
                    draggable: true
                })
                    .setLngLat([lon, lat])
                    .addTo(locationSetterMap);

                window.locationMarker.on('dragend', function () {
                    const lngLat = window.locationMarker.getLngLat();
                    window.selectedLocation = {
                        latitude: lngLat.lat,
                        longitude: lngLat.lng
                    };
                });
            }

            // Enable save button
            const saveBtn = document.getElementById('saveLocationBtn');
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.style.opacity = '1';
            }

            alert('📍 Location from Google Maps set! You can drag the marker to adjust, then click "Save Location".');
        };

        // Function to save location
        window.saveCurrentLocation = function () {
            if (!window.selectedLocation) {
                alert('Please select a location first');
                return;
            }

            const btn = document.getElementById('saveLocationBtn');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

            fetch('../api/tailors/save_location.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(window.selectedLocation)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('✅ Location saved successfully!');
                        closeLocationSetterModal();
                        // Reload page to show updated location
                        window.location.reload();
                    } else {
                        throw new Error(data.message || 'Failed to save location');
                    }
                })
                .catch(error => {
                    alert('❌ Error: ' + error.message);
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-save"></i> Save Location';
                });
        };
    }, 100);
}

/**
 * Close location setter modal
 */
function closeLocationSetterModal() {
    // Destroy map instance
    if (mapInstances['setMap']) {
        mapInstances['setMap'].map.remove();
        delete mapInstances['setMap'];
    }

    const modal = document.getElementById('locationSetterModal');
    if (modal) {
        modal.remove();
    }

    // Clean up global variables
    delete window.selectedLocation;
    delete window.getCurrentLocation;
    delete window.saveCurrentLocation;
}

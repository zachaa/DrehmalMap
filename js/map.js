
export function createMap(config, mapLayers, mapEntityLayers) {
    const crs = L.extend({}, L.CRS.Simple, {
        transformation: new L.Transformation(1, 0, 1, 0)
    });

    let baseTiles = L.tileLayer(config.url, {
        errorTileUrl: "drehmal_images/maps/null_tile.webp",
        attribution: '&copy; Drehmal map creators, uNmINeD, Mojang',
        minZoom: config.zoomMin,
        maxZoom: 6,
        maxNativeZoom: 2,  // Last tile zoom level
        noWrap: true,
        maxBounds: config.bounds
    });

    let map = L.map("map", {
        center: [0, 0],
        zoom: 0,
        layers: [baseTiles, mapLayers["Locations"]],
        crs: crs,
        drawControl: true // Leaflet Draw to create geoJSON polygons
    });

    /* Draw with leaflet geoman */
    map.pm.addControls({
        position: 'topleft',
        drawMarker: false,
        drawCircleMarker: false,
        drawText: false,
        drawRectangle: false,
        drawPolygon: true,
        editMode: true,
        dragMode: false,
        rotateMode: false,
        cutPolygon: true,
        removalMode: true,
    });
    map.pm.setGlobalOptions({snappable: true, snapDistance: 10, tooltips: false});

    L.control.layers(
        null,
        mapLayers,
        {collapsed: false}
    ).addTo(map);

    // Entity control is separate overlay section
    L.control.layers(
        null,
        mapEntityLayers,
        {collapsed: false}
    ).addTo(map);

    // Edit geoJSON --------------- Enable only when needed -------------------
    // fetch('data_raw/geojson/mountains_SE.geojson')  // Path to geoJSON file with at least 1 feature
    // .then(response => response.json())
    // .then(data => {
    //     // Change index to select different feature
    //     const featureToEdit = data.features[0];
    //     console.log("Attempting to load and edit feature");
    //
    //     // Add the feature to the map and enable editing for it
    //     const editableLayer = L.geoJSON(featureToEdit).addTo(map);
    //     editableLayer.pm.enable();
    //
    //     // Save the feature when button clicked
    //     document.getElementById('save-edits').onclick = function () {
    //         var editedData = editableLayer.toGeoJSON();
    //         var convertedEditData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(editedData));
    //
    //         var a = document.createElement('a');
    //         a.href = 'data:' + convertedEditData;
    //         a.download = 'edited_data.geojson';
    //         a.innerHTML = 'Export Edited GeoJSON';
    //
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);
    //     }
    // });
    // ------------------------------------------------------------------------

    let drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Listen for when a polygon is created and add it to drawnItems
    map.on('pm:create', function(e) {
        let layer = e.layer;
        drawnItems.addLayer(layer);
    });

    // Save the draw layer to geoJSON
    document.getElementById('export').onclick = function () {
        let data = drawnItems.toGeoJSON();
        let convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

        let a = document.createElement('a');
        a.href = 'data:' + convertedData;
        a.download = 'data.geojson';
        a.innerHTML = 'Export GeoJSON';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Display mouse position
    L.control.mousePosition({
        separator: ' z: ',
        lngFirst: true,
        numDigits: 0,
        prefix: "x:"
    }).addTo(map);

    // Set the map view to the center and zoom level
    map.setView(config.startCenter, 0);

    console.log("Map created")
}
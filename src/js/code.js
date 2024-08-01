const mapConfig = {
    overworld: {
        bounds: [[-5120, -5632], [7167, 7679]],
        url: 'images/maps/overworld/tiles/zoom.{z}/tile.{x}.{y}.png',
        zoomMin: -6,
    },
    end: {
        bounds: [[-512, -512], [511, 511]],
        url: 'images/maps/end/tiles/zoom.{z}/tile.{x}.{y}.png',
        zoomMin: -3,
    },
    true_end: {
        bounds: [[-512, 0], [10751, 10239]], // y, x
        url: 'images/maps/true_end/tiles/zoom.{z}/tile.{x}.{y}.png',
        zoomMin: -6,
    },
    lodahr: {
        bounds: [[-3072, -2560], [2559, 27647]],
        url: 'images/maps/lodahr/tiles/zoom.{z}/tile.{x}.{y}.png',
        zoomMin: -6,
    },
    space: {
        bounds: [[-512, -512], [511, 511]],
        url: 'images/maps/space/tiles/zoom.{z}/tile.{x}.{y}.png',
        zoomMin: -3,
    }
};

async function readAndDimensionFilter(dimension, filepath) {
    let data = await d3.json(filepath);
    return data.filter(d => d.dimension === dimension);
};

function createMarker(element, customIcon) {
    let detail_text = element.detail ? element.detail : "";
    return L.marker([element.z, element.x], {icon: customIcon})
        .bindPopup(`<span class=popup_title>${element.name}</span><hr>
                  <span class=popup_xyz>${element.x}, ${element.y}, ${element.z}</span><br>
                  ${detail_text}`);
}

function layerTowers(towerData) {
    let towerLayer = L.layerGroup();
    towerData.forEach(element => {
        let marker = createMarker(element, TowerIcon);
        towerLayer.addLayer(marker);
    });
    return towerLayer;
}

function layerPortals(portalData) {
    let portalLayer = L.layerGroup();
    portalData.forEach(element => {
        let marker = createMarker(element, LodahrPortalIcon);
        portalLayer.addLayer(marker);
    });
    return portalLayer;
}

function layerLocations(locationData, renderer) {
    let locationLayer = L.layerGroup();
    locationData.forEach(element => {
        let marker = createLocationCircleMarker(renderer, element);
        locationLayer.addLayer(marker);
    });
    return locationLayer;
}

async function createOverlays(dimension, renderer) {
    overlayLayers = {};

    let towers = await readAndDimensionFilter(dimension, "data/towers.json");
    console.log(`Towers: ${towers.length}`);
    if (towers.length > 0) {
        overlayLayers["Towers"] = layerTowers(towers);
    }

    let portals = await readAndDimensionFilter(dimension, "data/lodahr_portals.json");
    console.log(`Portals: ${portals.length}`);
    if (portals.length > 0) {
        overlayLayers["Portals"] = layerPortals(portals)
    }

    let locations = await readAndDimensionFilter(dimension, "data/locations.json");
    console.log(`Locations: ${locations.length}`);
    if (locations.length > 0) {
        overlayLayers["Locations"] = layerLocations(locations, renderer);
    }

    // mythics = readAndDimensionFilter(dimension, "data/mythics.json");
    // legendaries
    // devotion = readAndDimensionFilter(dimension, ".data/devotion.json");
    // items
    // lore (books, paper)
    // entities?
    return overlayLayers;
};

async function start() {
    const mapElement = document.getElementById('map');
    const mapDimension = mapElement.getAttribute('data-map');
    const config = mapConfig[mapDimension];
    if (!config) {
        console.error(`No configuration found for map type: ${mapDimension}`);
        return;
    }

    const crs = L.extend({}, L.CRS.Simple, {
        transformation: new L.Transformation(1, 0, 1, 0)
    });

    let baseTiles = L.tileLayer(config.url, {
        errorTileUrl: "images/maps/null_tile.png",
        attribution: '&copy; Drehmal map creators, Unmined',
        minZoom: config.zoomMin,
        maxZoom: 4,
        maxNativeZoom: 2,  // Last tile zoom level
        noWrap: true,
        maxBounds: config.bounds
    });

    let canvasRenderer = L.canvas({ padding: 0.1 });

    // Overlays
    const overlays = await createOverlays(mapDimension, canvasRenderer);

    // Check if overlays are empty
    const mapLayers = overlays && Object.keys(overlays).length > 0 ? overlays : {};

    let map = L.map("map", {
        center: [0, 0],
        zoom: 0,
        layers: [baseTiles],
        crs: crs
    });

    L.control.layers(
        null,
        mapLayers,
        {collapsed: false}
    ).addTo(map);
    
    L.control.mousePosition({
        separator: ' z: ',
        lngFirst: true,
        numDigits: 0,
        prefix: "x:"
    }).addTo(map);

    // Set the map view to the center and zoom level
    map.setView([0, 0], 0);

    console.log("Start complete")
};


function createLocationCircleMarker(renderer, locationData) {
    let circleMarker = L.circleMarker(
        [locationData.z, locationData.x], {
        fillColor: colorMarker(locationData.type),
        fillOpacity: 0.8,
        radius: 10,
        stroke: true,
        color: "#000",
        weight: 2,
        renderer: renderer
    }).bindPopup(`<span class=popup_title>${locationData.name}</span>
                  <hr>
                  <span class=popup_xyz>${locationData.x}, ${locationData.y}, ${locationData.z}</span><br>
                  ${locationData.type}<br>
                  ${locationData.detail}`)

    // Store the type for use with filtering
    circleMarker.options.type = locationData.type;
    
    return circleMarker;
};

function colorMarker(value) {
    switch (value) {
        case "town":
            return "#FFEE00";
        case "small_town":
            return "#FFB700";
        case "abandoned_town":
            return "#814C0F";
        case "avsohm_facility":
            return "#9C01E9";
        case "building":
            return "#00B8E1";
        case "boss":
            return "#D00000";
        case "other_location":
            return "#E803DC";
        default:
            return "#aaaaaa";
    }
};


start();

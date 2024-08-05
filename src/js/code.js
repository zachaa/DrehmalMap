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
    return data.filter(d => d.dim === dimension);
};

function createMarker(element, customIcon) {
    let detail_text = element.detail ? element.detail : "";
    return L.marker([element.z+0.5, element.x+0.5], {icon: customIcon})
        .bindPopup(`<span class=popup_title>${element.name}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${detail_text}`);
}

// ====================================================================================================================
// Overlay Layers (not Entities)

function createLocationCircleMarker(renderer, locationData) {
    let circleMarker = L.circleMarker(
        [locationData.z+0.5, locationData.x+0.5], {
        fillColor: colorMarker(locationData.type),
        fillOpacity: 0.8,
        radius: 10,
        stroke: true,
        color: "#000",
        weight: 2,
        renderer: renderer
    }).bindPopup(`<span class=popup_title>${locationData.name}</span>
                  <hr>
                  <span class=popup_xyz>${locationData.x} ${locationData.y} ${locationData.z}</span><br>
                  ${locationData.type}<br>
                  ${locationData.detail}`)

    // Store the type for use with filtering
    circleMarker.options.type = locationData.type;
    
    return circleMarker;
};

function createDevotionMarker(element) {
    let detail_text = element.detail ? element.detail : "";
    let devotion_icon = new IconDevotion({iconUrl: element.icon});
    return L.marker([element.z+0.5, element.x+0.5], {icon: devotion_icon})
        .bindPopup(`<span class=popup_title>Devotion: ${element.name}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${detail_text}`);
}

function createMythicalMarker(element) {
    let mythical_icon = new IconMythic({iconUrl: element.icon});
    return L.marker([element.z+0.5, element.x+0.5], {icon: mythical_icon})
        .bindPopup(`<span class=popup_title>${element.name}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${element.lore}`);
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

function layerDevotion(devotionData) {
    let devotionLayer = L.layerGroup();
    devotionData.forEach(element => {
        let marker = createDevotionMarker(element);
        devotionLayer.addLayer(marker);
    });
    return devotionLayer;
}

function layerMythical(mythicalData) {
    let mythicalLayer = L.layerGroup();
    mythicalData.forEach(element => {
        let marker = createMythicalMarker(element);
        mythicalLayer.addLayer(marker);
    });
    return mythicalLayer;
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

    let devotion = await readAndDimensionFilter(dimension, "data/devotion.json");
    console.log(`Devotion: ${devotion.length}`);
    if (devotion.length > 0) {
        overlayLayers["Devotion"] = layerDevotion(devotion);
    }

    let mythical = await readAndDimensionFilter(dimension, "data/mythical.json");
    console.log(`Mythical: ${mythical.length}`);
    if (mythical.length > 0) {
        overlayLayers["Mythical"] = layerMythical(mythical);
    }

    // legendaries
    // items
    // lore (books, paper)
    // entities?
    return overlayLayers;
};

// ====================================================================================================================
// Entity Overlays

function storageHtml(items) {
    // put all items into an unordered list with bullet point replaced by image
    const itemList = document.createElement('ul');
    itemList.classList.add('storageList');

    items.forEach(item => {
        const li = document.createElement('li');
        
        // // Set the custom bullet point using the image
        // li.style.setProperty('--bullet-url', `url(images/icons/${item.name}.png)`);
        // li.style.backgroundImage = `var(--bullet-url)`;
        
        // Create an img element for the custom bullet
        const bulletImage = document.createElement('img');
        bulletImage.src = `images/icons/${item.name}.png`;
        bulletImage.style.width = '16px';
        bulletImage.style.height = '16px';
        bulletImage.style.verticalAlign = 'middle';

        li.appendChild(bulletImage);

        // Main line of text
        li.innerHTML += `${item.count}× <span class="${item.enchanted ? 'enchanted' : ''}">${item.displayName}</span>`;

        // If the item has lore, add it below the main text
        if (item.lore) {
            const loreText = document.createElement('div');
            loreText.classList.add('lore_text');
            loreText.innerHTML = item.lore.replace(/\n/g, '<br>');
            li.appendChild(loreText);
        }
        console.log(li)
        // Add to ul
        itemList.appendChild(li);
    });
    return itemList;
}

function createStorageMarker(element) {
    let icon = new Icon32({iconUrl: `images/icons/${element.name}.png`});
    let items_html = storageHtml(element.items).outerHTML;
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${items_html}`);
}

function layerEntStorage(storageData) {
    let storageLayer = L.layerGroup();
    storageData.forEach(element => {
        let marker = createStorageMarker(element);
        storageLayer.addLayer(marker);
    });
    return storageLayer;
}

function groupFilter(group, entity_array) {
    return entity_array.filter(d => d.group === group);
};

async function createEntityOverlays(dimension) {
    let tiles_and_entities = await readAndDimensionFilter(dimension, "data/all_entity_data.json");
    console.log(`Tiles and Entities: ${tiles_and_entities.length}`);

    // Options:
    // "storage", "lectern", "item_frame", "trader", "armor_stand", "entity", "tile_entity"

    let entityLayers = {};

    let storage_ent = groupFilter("storage", tiles_and_entities);
    console.log(`Storage Entities: ${storage_ent.length}`);
    if (storage_ent.length > 0) {
        entityLayers["Storage"] = layerEntStorage(storage_ent);
    }
    // let lectern_ent = groupFilter("lectern", tiles_and_entities);
    // if (lectern_ent.length > 0) {
    //     entityLayers["Lecterns"] = layerStorage(lectern_ent);
    // }
    // let itemFrame_ent = groupFilter("item_frame", tiles_and_entities);
    // if (itemFrame_ent.length > 0) {
    //     entityLayers["Item Frames"] = layerStorage(itemFrame_ent);
    // }
    // let traders_ent = groupFilter("trader", tiles_and_entities);
    // if (traders_ent.length > 0) {
    //     entityLayers["Named Traders"] = layerStorage(traders_ent);
    // }
    // let armorStand_ent = groupFilter("armor_stand", tiles_and_entities);
    // if (armorStand_ent.length > 0) {
    //     entityLayers["Armor Stands"] = layerStorage(armorStand_ent);
    // }
    // let entity_ent = groupFilter("entity", tiles_and_entities);
    // if (entity_ent.length > 0) {
    //     entityLayers["Other Entities"] = layerStorage(entity_ent);
    // }
    // let tileEntity_ent = groupFilter("tile_entity", tiles_and_entities);
    // if (tileEntity_ent.length > 0) {
    //     entityLayers["Other Tile Entities"] = layerStorage(tileEntity_ent);
    // }

    return entityLayers;
};

// ====================================================================================================================
// Main Function

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
        attribution: '&copy; Drehmal map creators, uNmINeD, M',
        minZoom: config.zoomMin,
        maxZoom: 4,
        maxNativeZoom: 2,  // Last tile zoom level
        noWrap: true,
        maxBounds: config.bounds
    });

    let canvasRenderer = L.canvas({ padding: 0.1 });

    // Overlays
    const overlays = await createOverlays(mapDimension, canvasRenderer);
    const overlaysEntity = await createEntityOverlays(mapDimension)

    // Check if overlays are empty
    const mapLayers = overlays && Object.keys(overlays).length > 0 ? overlays : {};
    const mapEntityLayers = overlaysEntity && Object.keys(overlaysEntity).length > 0 ? overlaysEntity : {};

    let map = L.map("map", {
        center: [0, 0],
        zoom: 0,
        layers: [baseTiles, mapLayers["Locations"]],
        crs: crs
    });

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
        case "meta":
            return "#00FF00"
        default:
            return "#aaaaaa";
    }
};


start();

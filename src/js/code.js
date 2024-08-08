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

/**
 * Load and filter a json file to a given dimension.
 * @param {String} dimension name of dimension to filter to
 * @param {String} filepath path to JSON file
 * @returns Array of objects
 */
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

/**
 * Create a list of overlay layers to use with Leaflet
 * @param {String} dimension current dimension
 * @param {*} renderer canvasRenderer for markers
 * @returns Array of overlay layers
 */
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

function imgSmallElement(icon_name) {
    const itemImage = document.createElement('img');
    itemImage.src = `images/icons/${icon_name}.png`;
    itemImage.style.width = '16px';
    itemImage.style.height = '16px';
    itemImage.style.verticalAlign = 'middle';
    return itemImage;
}

/**
 * Create HTML for use with Leaflet popup of Minecraft items
 * @param {Array} items array of MCItems with counts, optional lore
 * @returns unordered list HTML
 */
function storageHtml(items) {
    // put all items into an unordered list with bullet point replaced by image
    const itemList = document.createElement('ul');
    itemList.classList.add('storageList');

    items.forEach(item => {
        const li = document.createElement('li');
        
        // Create an img element to act like a custom bullet point
        const bulletImage = imgSmallElement(item.name)

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
        // Add to ul
        itemList.appendChild(li);
    });
    return itemList;
}

function tradeHtml(trades) {
    // put all items into an unordered list with bullet point replaced by image
    const itemList = document.createElement('ul');
    itemList.classList.add('tradeList');

    trades.forEach(trade => {
        const li = document.createElement('li');
        
        const buyImage = imgSmallElement(trade.buy.name)
        li.appendChild(buyImage);
        li.innerHTML += `${trade.buy.count}× <span class="${trade.buy.enchanted ? 'enchanted' : ''}">${trade.buy.displayName}</span>`;

        if (trade.buyB) {
            li.innerHTML += " <strong>+</strong> "

            const buyBImage = imgSmallElement(trade.buyB.name)
            li.appendChild(buyBImage);
            li.innerHTML += `${trade.buyB.count}× <span class="${trade.buyB.enchanted ? 'enchanted' : ''}">${trade.buyB.displayName}</span>`;
        }

        li.innerHTML += " <strong>→</strong> "

        const sellImage = imgSmallElement(trade.sell.name)
        li.appendChild(sellImage);
        li.innerHTML += `${trade.sell.count}× <span class="${trade.sell.enchanted ? 'enchanted' : ''}">${trade.sell.displayName}</span>`;

        // If the sold item has lore, add it below the main text
        if (trade.sell.lore) {
            const loreText = document.createElement('div');
            loreText.classList.add('lore_text');
            loreText.innerHTML = trade.sell.lore.replace(/\n/g, '<br>');
            li.appendChild(loreText);
        }
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

function createTraderMarker(element) {
    let icon = new IconTrader({iconUrl: `images/icons/entity/${element.name}.png`});
    let trade_html = tradeHtml(element.trades).outerHTML;
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${trade_html}`, {'maxWidth':'500','maxHeight':'500'});
}

function createEntityMarker(element) {
    let icon = new IconEntity({iconUrl: `images/icons/entity/${element.name}.png`});
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span>`);
}

function createTileEntityMarker(element) {
    let icon = new Icon32({iconUrl: `images/icons/${element.name}.png`});
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span>`);
}

function layerEntStorage(storageData) {
    let storageLayer = L.layerGroup();
    storageData.forEach(element => {
        let marker = createStorageMarker(element);
        storageLayer.addLayer(marker);
    });
    return storageLayer;
}

function layerEntTrader(traderData) {
    let traderLayer = L.layerGroup();
    traderData.forEach(element => {
        let marker = createTraderMarker(element);
        traderLayer.addLayer(marker);
    });
    return traderLayer;
}

function layerEntity(entityData) {
    let entityLayer = L.layerGroup();
    entityData.forEach(element => {
        let marker = createEntityMarker(element);
        entityLayer.addLayer(marker);
    });
    return entityLayer;
}

function layerTileEntity(tileEntityData) {
    let tileEntityLayer = L.layerGroup();
    tileEntityData.forEach(element => {
        let marker = createTileEntityMarker(element);
        tileEntityLayer.addLayer(marker);
    });
    return tileEntityLayer;
}

function groupFilter(group, entity_array) {
    return entity_array.filter(d => d.group === group);
};

/**
 * Create a list of overlay layers to use with Leaflet from entity data (may contain storage/trades)
 * @param {String} dimension current dimension
 * @returns Array of overlay layers
 */
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
    let lectern_ent = groupFilter("lectern", tiles_and_entities);
    console.log(`Lecterns with Book: ${lectern_ent.length}`);
    if (lectern_ent.length > 0) {
        entityLayers["Lecterns"] = layerEntStorage(lectern_ent);
    }
    let itemFrame_ent = groupFilter("item_frame", tiles_and_entities);
    console.log(`Item Frames: ${itemFrame_ent.length}`);
    if (itemFrame_ent.length > 0) {
        entityLayers["Item Frames"] = layerEntStorage(itemFrame_ent);
    }
    let traders_ent = groupFilter("trader", tiles_and_entities);
    console.log(`Named Traders: ${traders_ent.length}`);
    if (traders_ent.length > 0) {
        entityLayers["Named Traders"] = layerEntTrader(traders_ent);
    }
    let armorStand_ent = groupFilter("armor_stand", tiles_and_entities);
    console.log(`Armor Stands with Items: ${armorStand_ent.length}`);
    if (armorStand_ent.length > 0) {
        entityLayers["Armor Stands"] = layerEntStorage(armorStand_ent);
    }
    let entity_ent = groupFilter("entity", tiles_and_entities);
    console.log(`Named Entities: ${entity_ent.length}`);
    if (entity_ent.length > 0) {
        entityLayers["Other Entities"] = layerEntity(entity_ent);
    }
    let tileEntity_ent = groupFilter("tile_entity", tiles_and_entities);
    console.log(`Tile Entities: ${tileEntity_ent.length}`);
    if (tileEntity_ent.length > 0) {
        entityLayers["Other Tile Entities"] = layerTileEntity(tileEntity_ent);
    }

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
    map.pm.setGlobalOptions({snappable: true , snapDistance: 10, tooltips: false});

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
    

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Listen for when a polygon is created and add it to drawnItems
    map.on('pm:create', function(e) {
        var layer = e.layer;
        drawnItems.addLayer(layer);
    });

    // Display mouse position
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

const mapConfig = {
    overworld: {
        bounds: [[-5120, -5632], [7167, 7679]],  // y, x
        startCenter: [690, 778],
        url: "drehmal_images/maps/overworld/tiles/zoom.{z}/tile.{x}.{y}.png",
        zoomMin: -6,
    },
    end: {
        bounds: [[-512, -512], [511, 511]],
        startCenter: [0, 0],
        url: "drehmal_images/maps/end/tiles/zoom.{z}/tile.{x}.{y}.png",
        zoomMin: -2,
    },
    true_end: {
        bounds: [[-512, 0], [10751, 10239]],
        startCenter: [690, 778],
        url: "drehmal_images/maps/true_end/tiles/zoom.{z}/tile.{x}.{y}.png",
        zoomMin: -6,
    },
    lodahr: {
        bounds: [[-3072, -2560], [2559, 27647]],
        startCenter: [-718, -64],
        url: "drehmal_images/maps/lodahr/tiles/zoom.{z}/tile.{x}.{y}.png",
        zoomMin: -6,
    },
    space: {
        bounds: [[-512, -512], [511, 511]],
        startCenter: [122, -130],
        url: "drehmal_images/maps/space/tiles/zoom.{z}/tile.{x}.{y}.png",
        zoomMin: -2,
    }
};

// ====================================================================================================================
async function createGeoJsonLayer(filepath) {
    let geoJsonData = await d3.json(filepath);
    let geoJsonLayer = L.geoJSON(geoJsonData, {
        style: function(feature) {
            return {color: feature.properties.color,
                fillOpacity: 0.8
            }
        },
        onEachFeature: function onEachFeature(feature, layer) {
            layer.bindPopup(`<span class=popup_title>${feature.properties.name}</span>`)
        }
    });
    return geoJsonLayer;
};

/**
 * Load and filter a json file to a given dimension.
 * @param {String} dimension name of dimension to filter to
 * @param {String} filepath path to JSON file
 * @returns {Promise<Array.<object>} Array of objects
 */
async function readAndDimensionFilter(dimension, filepath) {
    let data = await d3.json(filepath);
    return data.filter(d => d.dim === dimension);
};

/**
 * Create a simple marker with popup information and a custom icon.
 * @param {Object} element Item data for the marker including x, y, z coordinates
 * @param {L.Icon} customIcon Icon to use for all items in the layer
 * @returns {L.marker} marker with popup data
 */
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

function devotionItems(offerings) {
    const devotionItems = document.createElement('ol');
    devotionItems.classList.add("devotionList");

    for (const [deity, item_list] of Object.entries(offerings)){
        const li = document.createElement('li');
        item_list.forEach(item => {
            const itemImage = document.createElement('img');
            itemImage.src = `drehmal_images/icons/${item}.png`;
            itemImage.alt = item;
            itemImage.title = item;
            itemImage.classList.add("devotionItemImage");
            itemImage.style.width = '32px';
            itemImage.style.height = '32px';
            li.appendChild(itemImage);
        });
        devotionItems.appendChild(li);
    }
    return devotionItems;
}

function createDevotionMarker(element, offerings) {
    let detail_text = element.detail ? element.detail : "";
    let devotion_icon = new IconDevotion({iconUrl: element.icon});
    const devotionList = devotionItems(offerings).outerHTML;
    return L.marker([element.z+0.5, element.x+0.5], {icon: devotion_icon})
        .bindPopup(`<span class=popup_title>Devotion: ${element.name}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${detail_text}<br>
                  ${devotionList}`, {'maxWidth':'600','maxHeight':'500'});
}

function createMythicalMarker(element) {
    let mythical_icon = new IconMythic({iconUrl: element.icon});

    const loreText = document.createElement('div');
    loreText.classList.add('lore_text');
    loreText.innerHTML = element.lore.replace(/\n/g, '<br>')

    return L.marker([element.z+0.5, element.x+0.5], {icon: mythical_icon})
        .bindPopup(`<span class=popup_title>${element.name}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${loreText.outerHTML}`);
}

function createLegendaryMarker(element) {
    let legendary_icon = new IconLegendary({iconUrl: element.icon});

    const loreText = document.createElement('div');
    loreText.classList.add('lore_text');
    loreText.innerHTML = element.lore.replace(/\n/g, '<br>')

    return L.marker([element.z+0.5, element.x+0.5], {icon: legendary_icon})
        .bindPopup(`<span class=popup_title>${element.name.replace(/\n/g, '<br>')}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${loreText.outerHTML}`);
}

function layerLocations(locationData, renderer) {
    let locationLayer = L.layerGroup();
    locationData.forEach(element => {
        let marker = createLocationCircleMarker(renderer, element);
        locationLayer.addLayer(marker);
    });
    return locationLayer;
}

function layerDevotion(devotionData, devotionOfferings) {
    let devotionLayer = L.layerGroup();
    devotionData.forEach(element => {
        let marker = createDevotionMarker(element, devotionOfferings[element.name]);
        devotionLayer.addLayer(marker);
    });
    return devotionLayer;
}

/**
 * Create a layer group for the given data.
 * Uses markerFunction to give different markers depending on content,
 *  or use layerIcon if all markers will have the same icon.
 * @param {object[]} data Array of object for each marker
 * @param {Function|null} markerFunction function to create a marker or null to use createMarker
 * @param {L.Icon=} layerIcon Icon to use in createMarker or null
 * @returns {L.LayerGroup} layerGroup for the given data
 */
function createLayer(data, markerFunction, layerIcon) {
    lGroup = L.layerGroup();
    data.forEach(element => {
        let marker
        if (markerFunction) {
            marker = markerFunction(element);
        } else {
            // Every item in layer has the same marker
            marker = createMarker(element, layerIcon)
        }
        lGroup.addLayer(marker);
    });
    return lGroup;
}

/**
 * Create an icon with a number overlay for grouped markers.
 * @param {L.MarkerCluster} cluster Marker Cluster
 * @param {String} iconImage path to image file to use as group icon
 * @returns {L.Icon} Icon for a cluster
 */
function createClusterIcon(cluster, iconImage) {
    return L.divIcon({
        className: "mc-cluster-icon",  // Need this to get rid of divIcon white square
        html: `<div class="cluster-image-container">
                   <img src="${iconImage}">
                   <div class="mc-cluster-icon-count">${cluster.getChildCount()}</div>
               </div>`,
        iconAnchor: [16, 16]
    })
}

/**
 * Create a layer group that will cluster very close markers.
 * The cluster icon is customizable and will show the number of items in the cluster.
 * @param {object[]} data Array of objects for each marker
 * @param {Function} markerFunction function to create a marker for the individual items
 * @param {String} iconImage path to image file to use as group icon
 * @returns {L.MarkerClusterGroup} cluster Layer Group for the given data
 */
function createClusterLayer(data, markerFunction, iconImage) {
    clusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 10,
        spiderLegPolylineOptions: { weight: 2, color: '#000000', opacity: 1 },
        iconCreateFunction: (cluster) => createClusterIcon(cluster, iconImage)
    });
    data.forEach(element => {
        let marker = markerFunction(element);
        clusterGroup.addLayer(marker);
    });
    return clusterGroup;
}

/**
 * Create a list of overlay layers to use with Leaflet
 * @param {String} dimension current dimension
 * @param {L.canvas} renderer canvasRenderer for markers
 * @returns {Promise<Object.<string, L.LayerGroup>>} Array of overlay layers
 */
async function createOverlays(dimension, renderer) {
    overlayLayers = {};

    if (dimension === "overworld") {
        overlayLayers["Regions"] = await createGeoJsonLayer("data/regions.geojson");
    }

    // if (dimension === "lodahr") {
    //     overlayLayers["Domains"] = createGeoJsonLayer("data/domains.geojson");
    // }

    let towers = await readAndDimensionFilter(dimension, "data/towers.json");
    console.log(`Towers: ${towers.length}`);
    if (towers.length > 0) {
        overlayLayers["Towers"] = createLayer(towers, null, TowerIcon);
    }

    let portals = await readAndDimensionFilter(dimension, "data/lodahr_portals.json");
    console.log(`Portals: ${portals.length}`);
    if (portals.length > 0) {
        overlayLayers["Portals"] = createLayer(portals, null, LodahrPortalIcon);
    }

    let locations = await readAndDimensionFilter(dimension, "data/locations.json");
    console.log(`Locations: ${locations.length}`);
    if (locations.length > 0) {
        overlayLayers["Locations"] = layerLocations(locations, renderer);
    }

    let devotion = await readAndDimensionFilter(dimension, "data/devotion.json");
    let devotionOfferings = await d3.json("data/devotion_offerings.json");
    console.log(`Devotion: ${devotion.length}`);
    if (devotion.length > 0) {
        overlayLayers["Devotion"] = layerDevotion(devotion, devotionOfferings);
    }

    let mythical = await readAndDimensionFilter(dimension, "data/mythical.json");
    console.log(`Mythical: ${mythical.length}`);
    if (mythical.length > 0) {
        overlayLayers["Mythical"] = createLayer(mythical, createMythicalMarker);
    }

    let legendary = await readAndDimensionFilter(dimension, "data/legendary.json");
    console.log(`Legendary: ${legendary.length}`);
    if (legendary.length > 0) {
        overlayLayers["Legendary"] = createLayer(legendary, createLegendaryMarker);
    }

    // lore (books, paper)
    // entities?
    // signs?
    return overlayLayers;
};

// ====================================================================================================================
// Entity Overlays

function imgSmallElement(icon_name) {
    const itemImage = document.createElement('img');
    itemImage.src = `drehmal_images/icons/${icon_name}.png`;
    itemImage.style.width = '16px';
    itemImage.style.height = '16px';
    itemImage.style.verticalAlign = 'middle';
    return itemImage;
}

/**
 * Create HTML for use with Leaflet popup of Minecraft items
 * @param {Array.<object>} items array of MCItems with counts, optional lore
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
    let icon = new Icon32({iconUrl: `drehmal_images/icons/${element.name}.png`});
    let items_html = storageHtml(element.items).outerHTML;
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${items_html}`, {'maxWidth':'600','maxHeight':'400'});
}

function createTraderMarker(element) {
    let icon = new IconTrader({iconUrl: `drehmal_images/icons/entity/${element.name}.png`});
    let trade_html = tradeHtml(element.trades).outerHTML;
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${trade_html}`, {'maxWidth':'600','maxHeight':'400'});
}

function createEntityMarker(element) {
    let icon = new IconEntity({iconUrl: `drehmal_images/icons/entity/${element.name}.png`});
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span>`);
}

function createTileEntityMarker(element) {
    let icon = new Icon32({iconUrl: `drehmal_images/icons/${element.name}.png`});
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span>`);
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
        // entityLayers["Storage"] = createLayer(storage_ent, createStorageMarker);
        entityLayers["Storage"] = createClusterLayer(storage_ent, createStorageMarker, "drehmal_images/icons/chest.png");
    }
    let lectern_ent = groupFilter("lectern", tiles_and_entities);
    console.log(`Lecterns with Book: ${lectern_ent.length}`);
    if (lectern_ent.length > 0) {
        entityLayers["Lecterns"] = createLayer(lectern_ent, createStorageMarker);
    }
    let itemFrame_ent = groupFilter("item_frame", tiles_and_entities);
    console.log(`Item Frames: ${itemFrame_ent.length}`);
    if (itemFrame_ent.length > 0) {
        // entityLayers["Item Frames"] = createLayer(itemFrame_ent, createStorageMarker);
        entityLayers["Item Frames"] = createClusterLayer(itemFrame_ent, createStorageMarker, "drehmal_images/icons/item_frame.png");
    }
    let traders_ent = groupFilter("trader", tiles_and_entities);
    console.log(`Named Traders: ${traders_ent.length}`);
    if (traders_ent.length > 0) {
        entityLayers["Named Trader"] = createLayer(traders_ent, createTraderMarker);
    }
    let armorStand_ent = groupFilter("armor_stand", tiles_and_entities);
    console.log(`Armor Stands with Items: ${armorStand_ent.length}`);
    if (armorStand_ent.length > 0) {
        // entityLayers["Armor Stands"] = createLayer(armorStand_ent, createStorageMarker);
        entityLayers["Armor Stands"] = createClusterLayer(armorStand_ent, createStorageMarker, "drehmal_images/icons/armor_stand.png");
    }
    let entity_ent = groupFilter("entity", tiles_and_entities);
    console.log(`Named Entities: ${entity_ent.length}`);
    if (entity_ent.length > 0) {
        entityLayers["Other Entities"] = createLayer(entity_ent, createEntityMarker);
    }
    let tileEntity_ent = groupFilter("tile_entity", tiles_and_entities);
    console.log(`Tile Entities: ${tileEntity_ent.length}`);
    if (tileEntity_ent.length > 0) {
        entityLayers["Other Tile Entities"] = createLayer(tileEntity_ent, createTileEntityMarker);
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
        errorTileUrl: "drehmal_images/maps/null_tile.webp",
        attribution: '&copy; Drehmal map creators, uNmINeD, Mojang',
        minZoom: config.zoomMin,
        maxZoom: 6,
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
    map.setView(config.startCenter, 0);

    // Save the draw layer to geoJSON
    document.getElementById('export').onclick = function () {
        var data = drawnItems.toGeoJSON();
        var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
        
        var a = document.createElement('a');
        a.href = 'data:' + convertedData;
        a.download = 'data.geojson';
        a.innerHTML = 'Export GeoJSON';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    console.log("Start complete")
};

/**
 * Gives a color string based on `value`.
 * @param {String} value type of marker string
 * @returns hex color code
 */
function colorMarker(value) {
    switch (value) {
        case "town":
            return "#F6DD00";
        case "small_town":
            return "#FFB700";
        case "abandoned_town":
            return "#814C0F";
        case "avsohm_facility":
            return "#9C01E9";
        case "building":
            return "#00B8E1";
        case "campsite":
            return "#CCE320";
        case "boss":
            return "#D00000";
        case "trial":
            return "#000DC3";
        case "other_location":
            return "#F95AF1";
        case "meta":
            return "#00FF00"
        default:
            return "#aaaaaa";
    }
};


start();

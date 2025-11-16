import {LodahrPortalIcon, TowerIcon} from "./icons.js";
import {
    createCelestialMarker,
    createDevotionMarker,
    createEntityMarker,
    createLegendaryMarker,
    createLocationCircleMarker,
    createMarker,
    createMythicalMarker,
    createSignMarker,
    createSolettaStoneMarker,
    createStorageMarker,
    createTileEntityMarker,
    createTraderMarker
} from "./markers.js";

/**
 * Load and filter a json file to a given dimension.
 * @param {String} dimension name of dimension to filter to
 * @param {String} filepath path to JSON file
 * @returns {Promise<Array.<object>>} Array of objects
 */
async function readAndDimensionFilter(dimension, filepath) {
    try {
        let data = await d3.json(filepath);
        return data.filter(d => d.dim === dimension);
    } catch (error) {
        console.log(`Failed to load/filter data from ${filepath}`, error);
        return [];
    }
}

async function createGeoJsonLayer(filepath) {
    try {
        let geoJsonData = await d3.json(filepath);
        return L.geoJSON(geoJsonData, {
            style: function (feature) {
                return {
                    color: feature.properties.color,
                    fillOpacity: 0.8
                }
            },
            onEachFeature: function onEachFeature(feature, layer) {
                layer.bindPopup(`<span class=popup_title>${feature.properties.name}</span>`)
            }
        });
    } catch (error) {
        console.log(`Failed to create geoJson layer from ${filepath}`, error);
        return L.layerGroup();
    }
}

async function createGeoJsonPathLayer(filepath) {
    try {
        let geoJSONData = await d3.json(filepath);
        return L.geoJSON(geoJSONData, {
            style: {
                color: "#000000",
                weight: 3,
                opacity: 1.0
            }
        });
    } catch (error) {
        console.log(`Failed to create geoJson layer from ${filepath}`, error);
        return L.layerGroup();
    }
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
    let lGroup = L.layerGroup();
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
    let clusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 10,
        spiderLegPolylineOptions: {weight: 2, color: '#000000', opacity: 1},
        iconCreateFunction: (cluster) => createClusterIcon(cluster, iconImage)
    });
    data.forEach(element => {
        let marker = markerFunction(element);
        clusterGroup.addLayer(marker);
    });
    return clusterGroup;
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
 * Create a list of overlay layers to use with Leaflet
 * @param {String} dimension current dimension
 * @param {L.Canvas} renderer canvasRenderer for markers
 * @returns {Promise<Object.<string, L.LayerGroup>>} Array of overlay layers
 */
export async function createOverlays(dimension, renderer) {
    let overlayLayers = {};

    if (dimension === "overworld") {
        overlayLayers["Regions"] = await createGeoJsonLayer("data/regions.geojson");
        overlayLayers["Paths"] = await createGeoJsonPathLayer("data/paths.geojson");
    }

    if (dimension === "lodahr") {
        overlayLayers["Domains"] = await createGeoJsonLayer("data/domains.geojson");
    }

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

    let celestial = await readAndDimensionFilter(dimension, "data/celestial.json");
    console.log(`Celestial Material: ${celestial.length}`);
    if (celestial.length > 0) {
        overlayLayers["Celestial"] = createClusterLayer(celestial, createCelestialMarker, "drehmal_images/icons/white_shulker_box.png");
    }

    let solettaStones = await readAndDimensionFilter(dimension, "data/fervor_stones.json");
    console.log(`Fervor Stones: ${solettaStones.length}`);
    if (solettaStones.length > 0) {
        overlayLayers["Fervor Stones"] = createLayer(solettaStones, createSolettaStoneMarker);
    }

    let legendary = await readAndDimensionFilter(dimension, "data/legendary.json");
    console.log(`Legendary: ${legendary.length}`);
    if (legendary.length > 0) {
        overlayLayers["Legendary"] = createLayer(legendary, createLegendaryMarker);
    }

    let mythical = await readAndDimensionFilter(dimension, "data/mythical.json");
    console.log(`Mythical: ${mythical.length}`);
    if (mythical.length > 0) {
        overlayLayers["Mythical"] = createLayer(mythical, createMythicalMarker);
    }

    return overlayLayers;
}

function groupFilter(group, entity_array) {
    return entity_array.filter(d => d.group === group);
}

/**
 * Create a list of overlay layers to use with Leaflet from entity data (may contain storage/trades)
 * @param {String} dimension current dimension
 * @returns Array of overlay layers
 */
export async function createEntityOverlays(dimension) {
    let tiles_and_entities = await readAndDimensionFilter(dimension, "data/all_entity_data.json");
    console.log(`Tiles and Entities: ${tiles_and_entities.length}`);

    // Options:
    // "storage", "lectern", "item_frame", "sign", "trader", "armor_stand", "entity", "tile_entity"

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
    let sign_ent = groupFilter("sign", tiles_and_entities);
    if (sign_ent.length > 0) {
        entityLayers["Signs"] = createClusterLayer(sign_ent, createSignMarker, "drehmal_images/icons/oak_sign.png")
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
}


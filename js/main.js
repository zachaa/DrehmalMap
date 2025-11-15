import {mapConfig} from './config.js';
import {createEntityOverlays, createOverlays} from './layers.js';
import {createMap} from './map.js';

async function main() {
    const mapElement = document.getElementById('map');
    const mapDimension = mapElement.getAttribute('data-map');
    const config = mapConfig[mapDimension];

    if (!config) {
        console.error(`No configuration found for map type: ${mapDimension}`);
        return;
    }

    let canvasRenderer = L.canvas({ padding: 0.1 });

    // Overlays
    const [overlays, overlaysEntity] = await Promise.all([
        createOverlays(mapDimension, canvasRenderer),
        createEntityOverlays(mapDimension)
    ]);

    // Check if overlays are empty
    const mapLayers = overlays && Object.keys(overlays).length > 0 ? overlays : {};
    const mapEntityLayers = overlaysEntity && Object.keys(overlaysEntity).length > 0 ? overlaysEntity : {};

    createMap(config, mapLayers, mapEntityLayers);
}

main();

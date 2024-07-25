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
    // lohdar: {
    //     bounds: ,
    //     url: ,
    // },
    // space: {
    //     bounds: ,
    //     url: ,
    // }
}

async function start() {
    const mapElement = document.getElementById('map');
    const mapType = mapElement.getAttribute('data-map');
    const config = mapConfig[mapType];
    if (!config) {
        console.error(`No configuration found for map type: ${mapType}`);
        return;
    }

    const crs = L.extend({}, L.CRS.Simple, {
        transformation: new L.Transformation(1, 0, 1, 0)
    });

    let layer_tiles = L.tileLayer(config.url, {
        errorTileUrl: "images/maps/null_tile.png",
        attribution: '&copy; Drehmal map creators, Unmined',
        minZoom: config.zoomMin,
        maxZoom: 4,
        maxNativeZoom: 2,  // Last tile zoom level
        noWrap: true,
        maxBounds: config.bounds
    });

    let map = L.map("map", {
        center: [0, 0],
        zoom: 0,
        layers: [layer_tiles],
        crs: crs
    });

    L.marker(L.latLng([1, 1])).addTo(map);
    L.marker(L.latLng([256, 128])).addTo(map);
    L.marker(L.latLng([-64, -64])).addTo(map);

    // Set the map view to the center and zoom level
    map.setView([0, 0], 0);

    console.log("Start complete")
}

start();

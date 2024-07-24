async function start() {
    let crs = L.extend({}, L.CRS.Simple, {
        transformation: new L.Transformation(1 / 256, 5632 / 256, -1 / 256, 5120 / 256)
    });

    let mapBounds = [[-5120, -5632], [7679, 7679]];

    let layer_overworld = L.tileLayer('images/maps/overworld/tiles/zoom.{z}/tile.{x}.{y}.png', {
        errorTileUrl: "images/maps/null_tile.png",
        attribution: '&copy; Drehmal map creators, Unmined',
        minZoom: -6,
        maxZoom: 2,
        maxNativeZoom: 0,  // Last tile zoom level
        noWrap: true,
        maxBounds: mapBounds
    });

    let overworld_map = L.map("map", {
        center: [0, 0],
        zoom: 0,
        layers: [layer_overworld],
        crs: crs
    })

    // Set the map view to the center and zoom level
    overworld_map.setView([0, 0], 0);

    console.log("Start complete")
}

start();

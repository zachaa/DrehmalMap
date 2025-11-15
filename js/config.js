const locationColorMap = {
    "town": "#F6DD00",
    "small_town": "#FFB700",
    "abandoned_town": "#814C0F",
    "avsohm_facility": "#9C01E9",
    "building": "#00B8E1",
    "abandoned_building": "#387D8E",
    "large_statue": "#32A55E",
    "campsite": "#CCE320",
    "boss": "#D00000",
    "trial": "#000DC3",
    "other_location": "#F95AF1",
    "meta": "#00FF00"
};

const defaultColor = "#aaaaaa";

/**
 * Gives a color string based on `value`or a default color.
 * @param {String} value type of marker string
 * @returns hex color code
 */
export function colorMarker(value) {
    return locationColorMap[value] || defaultColor;
}

export const mapConfig = {
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
        zoomMin: -4,
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
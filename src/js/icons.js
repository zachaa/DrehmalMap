var Icon64 = L.Icon.extend({
    options: {
        iconSize:     [64, 64],
        iconAnchor:   [32, 32],
        popupAnchor:  [0, -32],
        className: "mc-icon"
    }
});

var Icon32 = L.Icon.extend({
    options: {
        iconSize:     [32, 32],
        iconAnchor:   [16, 16],
        popupAnchor:  [0, -16],
        className: "mc-icon"
    }
});

var Icon16 = L.Icon.extend({
    options: {
        iconSize:     [16, 16],
        iconAnchor:   [8, 8],
        popupAnchor:  [0, -8],
        className: "mc-icon"
    }
});

var IconDevotion = L.Icon.extend({
    options: {
        iconSize:     [32, 32],
        iconAnchor:   [16, 16],
        popupAnchor:  [0, -16],
        className: "mc-icon-glow"
    }
});

var IconMythic = L.Icon.extend({
    options: {
        iconSize:     [32, 32],
        iconAnchor:   [16, 16],
        popupAnchor:  [0, -16],
        className: "mc-icon-mythic"
    }
});

var IconLegendary = L.Icon.extend({
    options: {
        iconSize:     [32, 32],
        iconAnchor:   [16, 16],
        popupAnchor:  [0, -16],
        className: "mc-icon-legendary"
    }
});

let TowerIcon = new L.Icon({
        iconUrl: "images/icons/custom/Tower.png",
        iconSize:     [16, 16],
        iconAnchor:   [8, 8],
        popupAnchor:  [0, -8],
        className: "mc-icon"
});

let LodahrPortalIcon = new L.Icon({
        iconUrl: "images/icons/purpur_pillar_top.png",
        iconSize:     [16, 16],
        iconAnchor:   [8, 8],
        popupAnchor:  [0, -8],
        className: "mc-icon"
});
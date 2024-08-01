var Icon64 = L.Icon.extend({
    options: {
        iconSize:     [64, 64],
        iconAnchor:   [32, 32],
        popupAnchor:  [32, -1]
    }
});

var Icon32 = L.Icon.extend({
    options: {
        iconSize:     [32, 32],
        iconAnchor:   [16, 16],
        popupAnchor:  [16, -1]
    }
});

var Icon16 = L.Icon.extend({
    options: {
        iconSize:     [16, 16],
        iconAnchor:   [8, 8],
        popupAnchor:  [8, -1]
    }
});

let TowerIcon = new L.Icon({
        iconUrl: "images/icons/custom/Tower.png",
        iconSize:     [16, 16],
        iconAnchor:   [8, 8],
        popupAnchor:  [8, -1]
});

let LodahrPortalIcon = new L.Icon({
        iconUrl: "images/icons/custom/purpur_pillar_top.png",
        iconSize:     [16, 16],
        iconAnchor:   [8, 8],
        popupAnchor:  [8, -1]
});
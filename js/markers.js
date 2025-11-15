import {Icon32, IconDevotion, IconEntity, IconLegendary, IconMythic, IconTrader} from "./icons.js";
import {devotionItems, signHtml, storageHtml, tradeHtml} from "./popups.js";
import {colorMarker} from './config.js';

/**
 * Create a simple marker with popup information and a custom icon.
 * @param {Object} element Item data for the marker including x, y, z coordinates
 * @param {L.Icon} customIcon Icon to use for all items in the layer
 * @returns {L.marker} marker with popup data
 */
export function createMarker(element, customIcon) {
    let detail_text = element.detail ? element.detail : "";
    return L.marker([element.z+0.5, element.x+0.5], {icon: customIcon})
        .bindPopup(`<span class=popup_title>${element.name}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${detail_text}`);
}

export function createLocationCircleMarker(renderer, locationData) {
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
}

export function createDevotionMarker(element, offerings) {
    let detail_text = element.detail ? element.detail : "";
    let devotion_icon = new IconDevotion({iconUrl: element.icon});
    const devotionList = devotionItems(offerings).outerHTML;
    return L.marker([element.z+0.5, element.x+0.5], {icon: devotion_icon})
        .bindPopup(`<span class=popup_title>Devotion: ${element.name}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${detail_text}<br>
                  ${devotionList}`, {'maxWidth':'600','maxHeight':'500'});
}

export function createCelestialMarker(element) {
    let celestial_icon = new Icon32({iconUrl: element.icon});

    const storageText = element.detail === "" ? "Mineable Block" : element.detail;

    return L.marker([element.z+0.5, element.x+0.5], {icon: celestial_icon})
        .bindPopup(`<span class=popup_title>${element.count}× ${element.name}</span><hr>
            <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
            ${storageText}`
        );
}

export function createSolettaStoneMarker(element) {
    let stone_icon = new IconDevotion({iconUrl: `drehmal_images/icons/${element.icon}.png`});

    return L.marker([element.z+0.5, element.x+0.5], {icon: stone_icon})
        .bindPopup(`<span class=popup_title>${element.name}</span><hr>
            <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
            ${element.detail}`
        );
}

export function createMythicalMarker(element) {
    let mythical_icon = new IconMythic({iconUrl: element.icon});

    const loreText = document.createElement('div');
    loreText.classList.add('lore_text');
    loreText.innerHTML = element.lore.replace(/\n/g, '<br>')

    return L.marker([element.z+0.5, element.x+0.5], {icon: mythical_icon})
        .bindPopup(`<span class=popup_title>${element.name}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${loreText.outerHTML}`);
}

export function createLegendaryMarker(element) {
    let legendary_icon = new IconLegendary({iconUrl: element.icon});

    const loreText = document.createElement('div');
    loreText.classList.add('lore_text');
    loreText.innerHTML = element.lore.replace(/\n/g, '<br>')

    return L.marker([element.z+0.5, element.x+0.5], {icon: legendary_icon})
        .bindPopup(`<span class=popup_title>${element.name.replace(/\n/g, '<br>')}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${loreText.outerHTML}`);
}

export function createStorageMarker(element) {
    let icon = new Icon32({iconUrl: `drehmal_images/icons/${element.name}.png`});
    let items_html = storageHtml(element.items).outerHTML;
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                  ${items_html}`, {'maxWidth':'600','maxHeight':'400'});
}

export function createSignMarker(element) {
    let icon = new Icon32({iconUrl: "drehmal_images/icons/oak_sign.png"});
    let sign_html = signHtml(element.sign).outerHTML;
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                   <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                   ${sign_html}`, {'maxWidth':'600','maxHeight':'400'});
}

export function createTraderMarker(element) {
    let icon = new IconTrader({iconUrl: `drehmal_images/icons/entity/${element.name}.png`});
    let trade_html = tradeHtml(element.trades).outerHTML;
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                   <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span><br>
                   ${trade_html}`, {'maxWidth':'600', 'maxHeight':'400'});
}

export function createEntityMarker(element) {
    let icon = new IconEntity({iconUrl: `drehmal_images/icons/entity/${element.name}.png`});
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span>`);
}

export function createTileEntityMarker(element) {
    let icon = new Icon32({iconUrl: `drehmal_images/icons/${element.name}.png`});
    return L.marker([element.z+0.5, element.x+0.5], {icon: icon})
        .bindPopup(`<span class=popup_title>${element.displayName}</span><hr>
                  <span class=popup_xyz>${element.x} ${element.y} ${element.z}</span>`);
}
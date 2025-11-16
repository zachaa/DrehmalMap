function imgSmallElement(icon_name) {
    const itemImage = document.createElement('img');
    itemImage.classList.add("mc-item-icon-small");
    itemImage.src = `drehmal_images/icons/${icon_name}.png`;
    return itemImage;
}

export function devotionItems(offerings) {
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
            li.appendChild(itemImage);
        });
        devotionItems.appendChild(li);
    }
    return devotionItems;
}

/**
 * Create HTML for use with Leaflet popup of Minecraft items
 * @param {Array.<object>} items array of MCItems with counts, optional lore
 * @returns unordered list HTML
 */
export function storageHtml(items) {
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

/**
 * Create HTML for use with a Leaflet popup of Minecraft Signs.
 * Colors text according to the sign and give back of the sign text if it exists.
 * @param {Object} signData
 * @returns HTML for a sign, font and back if they exist
 */
export function signHtml(signData) {
    const signDivTop = document.createElement('div');
    signDivTop.classList.add('sign_side_container');

    // Create a div for each side or null if there is no text data
    function createSignSide(side, textColor, textArray) {
        if (textArray && Array.isArray(textArray)) {
            const sideDiv = document.createElement('div');
            const header = document.createElement('h4');
            header.classList.add('sign_header_text');
            header.textContent = side;
            sideDiv.appendChild(header);

            const textContainer = document.createElement('div');
            textContainer.classList.add('sign_text');
            textContainer.style.color = textColor;

            // All lines should be added, even if they are blank
            textArray.forEach(line => {
                const lineDiv = document.createElement('div');
                lineDiv.textContent = line;
                textContainer.appendChild(lineDiv);
            });

            sideDiv.appendChild(textContainer);
            return sideDiv;
        }
        return null;
    }

    const frontDiv = createSignSide("Front", signData.color_front, signData.text_front);
    if (frontDiv) {
        signDivTop.appendChild(frontDiv);
    }

    const backDiv = createSignSide("Back", signData.color_back, signData.text_back);
    if (backDiv) {
        signDivTop.appendChild(backDiv);
    }

    return signDivTop;
}

export function tradeHtml(trades) {
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

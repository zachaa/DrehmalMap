# Drehmal Map
Leaflet map for Drehmal 2.2.2 (Minecraft 1.20.1)

Shows maps of all dimensions and display locations of interesting items, signs, and places.

---
### Link: **[Drehmal Maps](https://zachaa.github.io/DrehmalMap/)**
---

Includes:
- Towers
- Lo'Dahr Portals
- Devotion Sites
    - Click to see offerings by value
- Location Markers
    - Towns, Villages, Settlements
    - Abandoned Towns and Villages
    - Interesting buildings, campsites, and structures
    - Bosses/mini-bosses
    - Lo'Dahr Trial sites
    - Other structures
- Drehmal Region Shading
- Lo'Dahr Domain Shading
- Paths, roads, and trail lines (Drehmal only)
- Celestial crafting materials (Separate from when they are in chests)
    - Debris, Chondrule, Alloy
- Fervor Stones
    - Agony, Luxury, Worry (and Soletta Forge)
- Legendary Items (Separate from when they are in chests)
- Mythical Weapons

- All storage items if they have contents
    - Chests, shulker boxes, item frames, armor stands, brewing stands, ect.
    - Click to show contents
- Signs
    - Only signs with text.
    - All signs appear as oak sign icons.
- All traders
    - Click to show trades
- All _named_ entities
- Ender Chests

All lore items include their full text except books which instead show page count.

All items have their Drehmal texture or icon if it is different than the base Minecraft version. Items with custom textures/models have those shown as well.

All items have their Drehmal name if it is different than the base Minecraft name. (EX: Emerald→Scale, Netherite→Celestial)

---
See a problem? Submit an issue or send me a message.

---

Potential Future updates, Nice things to have:
- Soletta Stones as their own layer
- Enchantments on items or in books? ('A dumb sword would' cause problems)
- Lore books as separate web page?
    - Include drops from bosses ('Letter of Thanks' drop from Abbot Balthysar: see `hi_drehmal\data\entities\loot_tables\mob\virmari.json`)
- Entity icons for custom mobs
    - Potentially difficult
- Player Heads with textures
    - Very difficult
    - Need to extract: `minecraft:player_head`
        - then `tag` -> `Properties` -> `textures[0]` -> `value`
        - then base64 decode
        - then `textures` -> `SKIN` -> `url` -> then get PNG from url

Issues/Todo:
- Uses base Minecraft entity pictures
- Spelling might be wrong in some places
- Location descriptions might be wrong, they are just my best guess for nearby lore items and assumptions.
- End Chests are no longer in block entities
- Some signs in overworld have a true blank front, need to check for that as well
- Soul soil map color is different for drehmal, I already have the correct block image, map tiles need update


## Updating Map Tiles
To update map tiles:
1. Use uNmINeD to export the tiles for all needed dimensions.
    - See `README.md` in the `drehmal_images` submodule for details.
    - Make sure correct settings for block colors are used. See: [Unmined_Settings.md](Unmined_Settings.md)
2. Run [flatten_unmined_tile_folders.py](extract/flatten_unmined_tile_folders.py)
    - Make sure to compress the PNGs with `oxipng`. This saves significant space.
3. Cut/Paste these into the **external** git repo `drehmal_images` in the `/maps` directory.
4. Add 256x256 gray `null_tile.webp` to `/maps` directory.
5. Update the repo **externally** as described in the `drehmal_images` README.md file.
6. Update the submodule in **this** repo:
    ```cmd
    git submodule update --init --recursive
    cd drehmal_images
    git fetch origin
    git reset --hard origin/main
    git gc --prune=now
    ```
7. Commit with a message and push the changes.

---
[Leaflet](https://leafletjs.com/)

[Leaflet Marker Cluster](https://github.com/Leaflet/Leaflet.markercluster)

[Leaflet Mouse Position](https://github.com/ardhi/Leaflet.MousePosition)

[Leaflet Zoom Display](https://github.com/azavea/Leaflet.zoomdisplay)

[Leaflet Geoman](https://geoman.io/docs)<br>
drawing polygons to export to GeoJSON

[minecraft-data](https://github.com/PrismarineJS/minecraft-data)<br>
For the raw json file of 1.20.1 names and displayNames

[1.21 inventory images](https://www.okamisquadron.com/downloads/1-21-images)<br>
resized to 32x32 for non existing inventory images<br>
Remake: Shulker Box, Trapped Chest, Netherite Scrap, Block of Netherite, End Portal Frame, Emerald and Purpur blocks

---
Drehmal: APOTHEOSIS by Keeko100, Rift and team. [https://www.drehmal.net/](https://www.drehmal.net/)

Map Tiles generated with **[uNmINeD](https://unmined.net/)**

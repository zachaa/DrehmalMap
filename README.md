# Drehmal Map
Leaflet map for Drehmal 2.2 (Minecraft 1.17)

Intended to show all dimensions and display locations of interesting items and places.

---
### Link: **[Drehmal Maps](https://zachaa.github.io/DrehmalMap/)**
---

Includes:
- Towers
- Lo'Dahr Portals
- Devotion Sites
    - Click to see offerings by value
- Locations
    - Towns and Villages
    - Abandoned Towns and Villages
    - Interesting buildings and sites
    - Bosses/mini-bosses
    - Lo'Dahr Trial sites
    - Other structures
- Region Shading
- Mythical Weapons (Mythbreaker only in Av'Sal but full version because lazy)
- Legendary Items (Separate from when they are in chests)
- All storage items if they have contents
    - Chests, shulker boxes, item frames, armor stands, brewing stands, ect.
    - Click to show contents
- All traders
    - Click to show trades
- All named entities
- Ender Chests

All lore items include their full text except books.

Nice to Have:
- Stones as their own layer
- Signs, but only if cluster/grouping
- Enchantments on items or in books
- Lore books as separate web page
    - Include drops from bosses (Letter of Thanks drop from Abbot Balthysar: see `hi_drehmal\data\entities\loot_tables\mob\virmari.json`)
- Update to 1.20 (new traders and trades, some blocks updated)
- Entity icons for custom mobs
- Player Heads with textures
    - Need to extract: `minecraft:player_head`
        - then `tag` -> `Properties` -> `textures[0]` -> `value`
        - then base64 decode
        - then `textures` -> `SKIN` -> `url` -> then get PNG from url

Issues/Todo:
- Uses base Minecraft names for items (ex: Emerald->Scale, Netherite->Celestial)
- Uses base Minecraft entity pictures
- Spelling might be wrong in some places
- Location descriptions might be wrong, they are just my best guess for nearby lore items and assumptions.
- Don't include invisible armor stands (named Invisible)

---
[Leaflet](https://leafletjs.com/)

[Leaflet Marker Cluster](https://github.com/Leaflet/Leaflet.markercluster)

[Leaflet Mouse Position](https://github.com/ardhi/Leaflet.MousePosition)

[Leaflet Zoom Display](https://github.com/azavea/Leaflet.zoomdisplay)

[Leaflet Geoman](https://geoman.io/docs)<br>
drawing polygons to export to GeoJSON

[minecraft-data](https://github.com/PrismarineJS/minecraft-data)<br>
For the raw json file of 1.17 names and displayNames

[1.21 inventory images](https://www.okamisquadron.com/downloads/1-21-images)<br>
resized to 32x32 for non existing inventory images<br>
Remake: Shulker Box, Trapped Chest, Netherite Scrap, Block of Netherite, End Portal Frame, Emerald and Purpur blocks

---
Drehmal: APOTHEOSIS by Keeko100, Rift and team. [https://www.drehmal.net/](https://www.drehmal.net/)

Map Tiles generated with **[uNmINeD](https://unmined.net/)**

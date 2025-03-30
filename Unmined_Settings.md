# uNmINeD Settings
Custom Settings to display blocks better.

The defaults in Unmined are not suitable for this map. We want colors to be consistent to what is seen in game most of the time and we need to hide certain technical blocks.

## Settings
Setting can be saved to a json file located in AppData at `C:\Users\UserName\AppData\Local\uNmINeD\mapsettings`. Save the settings once so it is faster to change them when switching to different dimensions.

The settings used for all Drehmal maps are:
1. Block Filter on
    - Technical (barrier, command, ect)
    - Individual Block filter:
        - minecraft:tripwire
2. Stylesheet Settings
    - Disable Classic Biome styling
    - Disable "Cartographic elevation gradient"
    - Disable "Different underground style"
    - All others Enabled

## Block Colors
By default, many crafted blocks (cut stone/sandstone variants, brick, others) have an almost white appearance. This causes a loss of information and is fixed by setting the color for many block by hand. The following values should be added to `custom.blockstyles.txt` in the `\config` directory of the main program location.

These settings automatically apply to all maps and dimensions in Unmined.

Some of these colors are the same as the minecraft map, some are average colors of the block, and others are picked to make them stand out a bit from similar blocks (Ex: polished vs regular granite or deepslate tiles vs bricks).

dirt_path = #977e43
obsidian = #11003b
granite = #946452
granite_slab, granite_stairs, granite_wall = #946452
polished_granite = #9b6855
polished_granite_slab, polished_granite_stairs = #9b6855
bricks = #985442
brick_slab, brick_stairs, brick_wall = #985442
nether_bricks = #37181d
nether_brick_slab, nether_brick_stairs = #37181d
nether_brick_fence, nether_brick_wall = #37181d
cracked_nether_bricks = #37181d
chiseled_deepslate = #2b2b2b
cobbled_deepslate = #4c4c4c
cobbled_deepslate_slab, cobbled_deepslate_stairs = #4c4c4c
cobbled_deepslate_wall, cracked_deepslate_bricks = #4c4c4c
cracked_deepslate_tiles = #2b2b2b
deepslate_bricks = #4c4c4c
deepslate_brick_slab, deepslate_brick_stairs, deepslate_brick_wall = #4c4c4c
deepslate_tiles = #2b2b2b
deepslate_tile_slab, deepslate_tile_stairs, deepslate_tile_wall = #2b2b2b
polished_deepslate = #4c4c4c
polished_deepslate_slab, polished_deepslate_stairs, polished_deepslate_wall = #4c4c4c
nether_wart = #993333
bee_nest = #f7d974
beehive = #b5925e
bell = #faee4d
bookshelf = #8f7748
pumpkin, carved_pumpkin, jack_o_lantern = #d87f33
sandstone_slab, sandstone_stairs, sandstone_wall = #e6dbb3
smooth_sandstone = #e6dbb3
smooth_sandstone_slab, smooth_sandstone_stairs = #e6dbb3
chiseled_sandstone = #e6dbb3
cut_sandstone, cut_sandstone_slab = #e6dbb3
chiseled_red_sandstone = #de9659
cut_red_sandstone, cut_red_sandstone_slab = #de9659
red_sandstone_slab, red_sandstone_stairs, red_sandstone_wall = #de9659
smooth_red_sandstone = #de9659
smooth_red_sandstone_slab, smooth_red_sandstone_stairs = #de9659
hay_block = #deca4e
amethyst_block = #dfa7ff
budding_amethyst, amethyst_cluster = #dfa7ff
large_amethyst_bud, medium_amethyst_bud, small_amethyst_bud = #dfa7ff
coal_block = #262626
diamond_block = #69fafa
emerald_block = #73ff73
gold_block = #faee4d
iron_block = #f1f1f1
lapis_block = #4a80ff
redstone_block = #ff0000
slime_block = #aaff50
honey_block = #ffcd33
honeycomb_block = #f7a91c
chiseled_quartz_block = #fffcf5
quartz_block = #fffcf5
quartz_bricks, quartz_pillar, quartz_slab, quartz_stairs = #fffcf5
smooth_quartz, smooth_quartz_slab, smooth_quartz_stairs = #fffcf5
sea_lantern = #bfded6
smooth_stone, smooth_stone_slab = #cccccc
polished_diorite = #dedede
polished_diorite_slab, polished_diorite_stairs = #dedede
polished_andesite = #a3a3a3
polished_andesite_slab, polished_andesite_stairs = #a3a3a3
white_terracotta = #cfb19f
light_gray_terracotta = #846960
gray_terracotta = #382923
black_terracotta = #23160f
brown_terracotta = #4b3222
red_terracotta = #923c31
orange_terracotta = #a25527
yellow_terracotta = #ba8424
lime_terracotta = #657333
green_terracotta = #4a5129
cyan_terracotta = #565a5a
light_blue_terracotta = #6f6b87
blue_terracotta = #483858
purple_terracotta = #734454
magenta_terracotta = #93556c
pink_terracotta = #9c4b4c
purpur_block, purpur_slab, purpur_stairs, purpur_pillar = #ad82ad
crimson_nylium = #7e0202
warped_nylium = #119b84
white_glazed_terracotta = #f6fcfb
light_gray_glazed_terracotta = #c9cdd1
gray_glazed_terracotta = #596b70
black_glazed_terracotta = #2a2a31
brown_glazed_terracotta = #a9794e
red_glazed_terracotta = #e8564f
orange_glazed_terracotta = #f67e1d
yellow_glazed_terracotta = #ffe885
lime_glazed_terracotta = #8bd231
green_glazed_terracotta = #7aaa27
cyan_glazed_terracotta = #15778a
light_blue_glazed_terracotta = #4cb6dc
blue_glazed_terracotta = #3a42a8
purple_glazed_terracotta = #642399
magenta_glazed_terracotta = #c651bf
pink_glazed_terracotta = #f093b0
soul_fire, soul_lantern, soul_wall_torch = #32feff
redstone_wall_torch = #d82626
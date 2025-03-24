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

minecraft:dirt_path = #977e43
minecraft:obsidian = #11003b
minecraft:granite = #946452
minecraft:granite_slab = #946452
minecraft:granite_stairs = #946452
minecraft:granite_wall = #946452
minecraft:polished_granite = #9b6855
minecraft:polished_granite_slab = #9b6855
minecraft:polished_granite_stairs = #9b6855
minecraft:bricks = #985442
minecraft:brick_stairs = #985442
minecraft:brick_wall = #985442
minecraft:brick_slab = #985442
minecraft:nether_bricks = #37181d
minecraft:nether_brick_fence = #37181d
minecraft:nether_brick_slab = #37181d
minecraft:nether_brick_stairs = #37181d
minecraft:nether_brick_wall = #37181d
minecraft:cracked_nether_bricks = #37181d
minecraft:chiseled_deepslate = #2b2b2b
minecraft:cobbled_deepslate = #4c4c4c
minecraft:cobbled_deepslate_slab = #4c4c4c
minecraft:cobbled_deepslate_stairs = #4c4c4c
minecraft:cobbled_deepslate_wall = #4c4c4c
minecraft:cracked_deepslate_bricks = #4c4c4c
minecraft:cracked_deepslate_tiles = #2b2b2b
minecraft:deepslate_brick_slab = #4c4c4c
minecraft:deepslate_brick_stairs = #4c4c4c
minecraft:deepslate_brick_wall = #4c4c4c
minecraft:deepslate_bricks = #4c4c4c
minecraft:deepslate_tiles = #2b2b2b
minecraft:deepslate_tile_slab = #2b2b2b
minecraft:deepslate_tile_stairs = #2b2b2b
minecraft:deepslate_tile_wall = #2b2b2b
minecraft:polished_deepslate = #4c4c4c
minecraft:polished_deepslate_slab = #4c4c4c
minecraft:polished_deepslate_stairs = #4c4c4c
minecraft:polished_deepslate_wall = #4c4c4c
minecraft:nether_wart = #993333
minecraft:bee_nest = #f7d974
minecraft:beehive = #b5925e
// yellow
minecraft:bell = #faee4d
// wood color
minecraft:bookshelf: = #8f7748
// ornange
minecraft:carved_pumpkin = #d87f33
minecraft:pumpkin = #d87f33
minecraft:jack_o_lantern = #d87f33
// lighter tan
minecraft:sandstone_slab = #e6dbb3
minecraft:sandstone_stairs = #e6dbb3
minecraft:sandstone_wall = #e6dbb3
minecraft:smooth_sandstone = #e6dbb3
minecraft:smooth_sandstone_slab = #e6dbb3
minecraft:smooth_sandstone_stairs = #e6dbb3
minecraft:chiseled_sandstone = #e6dbb3
minecraft:cut_sandstone = #e6dbb3
minecraft:cut_sandstone_slab = #e6dbb3
// lighter orange
minecraft:chiseled_red_sandstone = #de9659
minecraft:cut_red_sandstone = #de9659
minecraft:cut_red_sandstone_slab = #de9659
minecraft:red_sandstone_slab = #de9659
minecraft:red_sandstone_stairs = #de9659
minecraft:red_sandstone_wall = #de9659
minecraft:smooth_red_sandstone = #de9659
minecraft:smooth_red_sandstone_slab = #de9659
minecraft:smooth_red_sandstone_stairs = #de9659
minecraft:hay_block = #deca4e
minecraft:amethyst_block = #dfa7ff
minecraft:budding_amethyst = #dfa7ff
minecraft:amethyst_cluster = #dfa7ff
minecraft:large_amethyst_bud = #dfa7ff
minecraft:medium_amethyst_bud = #dfa7ff
minecraft:small_amethyst_bud = #dfa7ff
minecraft:coal_block = #262626
minecraft:diamond_block = #69fafa
minecraft:emerald_block = #73ff73
minecraft:gold_block = #faee4d
minecraft:iron_block = #f1f1f1
minecraft:lapis_block = #4a80ff
minecraft:redstone_block = #ff0000
minecraft:slime_block = #aaff50
minecraft:honey_block = #ffcd33
minecraft:honeycomb_block = #f7a91c
// almost white
minecraft:chiseled_quartz_block = #fffcf5
minecraft:quartz_block = #fffcf5
minecraft:quartz_bricks = #fffcf5
minecraft:quartz_pillar = #fffcf5
minecraft:quartz_slab = #fffcf5
minecraft:quartz_stairs = #fffcf5
minecraft:smooth_quartz = #fffcf5
minecraft:smooth_quartz_slab = #fffcf5
minecraft:smooth_quartz_stairs = #fffcf5
minecraft:sea_lantern = #bfded6
minecraft:smooth_stone = #cccccc
minecraft:smooth_stone_slab = #cccccc
minecraft:polished_diorite = #dedede
minecraft:polished_diorite_slab = #dedede
minecraft:polished_diorite_stairs = #dedede
minecraft:polished_andesite = #a3a3a3
minecraft:polished_andesite_slab = #a3a3a3
minecraft:polished_andesite_stairs = #a3a3a3
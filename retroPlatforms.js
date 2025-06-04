import * as THREE from 'three';

export const retroPlatforms = [
  {
    name: "Atari ST (Low Resolution)",
    resolution: new THREE.Vector2(320, 200),
    colorPalette: [
      new THREE.Color(0xbfe4dd),
      new THREE.Color(0x52473e),
      new THREE.Color(0x1f1d1d),
      new THREE.Color(0x312d2b),
      new THREE.Color(0x3b3e3e),
      new THREE.Color(0x734f42),
      new THREE.Color(0xaf7d73),
      new THREE.Color(0xf1ddce),
      new THREE.Color(0x6f6f62),
      new THREE.Color(0x9b5d51),
      new THREE.Color(0xb9afa4),
      new THREE.Color(0xec8985),
      new THREE.Color(0x789e90),
      new THREE.Color(0x9A6E33),
      new THREE.Color(0xF6C37A),
      new THREE.Color(0xffffff),
    ],
  },
  {
    name: "Atari ST (Medium Resolution)",
    resolution: new THREE.Vector2(640, 200),
    colorPalette: [
      new THREE.Color(0x514C4A),
      new THREE.Color(0xFFFFFF),
      new THREE.Color(0xCF3734),
      new THREE.Color(0xC2E3DB)
    ],
  },
  {
    name: "Atari ST (High Resolution)",
    resolution: new THREE.Vector2(640, 400),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0xFFFFFF), // White
    ],
  },
  {
    name: "CGA (Low Resolution)",
    resolution: new THREE.Vector2(320, 200),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0x00CCCC), // Cyan
      new THREE.Color(0xCC00CC), // Magenta
      new THREE.Color(0xFFFFFF), // White
    ],
  },
  {
    name: "CGA (High Resolution)",
    resolution: new THREE.Vector2(640, 200),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0xFFFFFF), // White
    ],
  },
  {
    name: "EGA",
    resolution: new THREE.Vector2(640, 350),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0x0000AA), // Blue
      new THREE.Color(0x00AA00), // Green
      new THREE.Color(0x00AAAA), // Cyan
      new THREE.Color(0xAA0000), // Red
      new THREE.Color(0xAA00AA), // Magenta
      new THREE.Color(0xAA5500), // Brown
      new THREE.Color(0xAAAAAA), // Light Gray
      new THREE.Color(0x555555), // Dark Gray
      new THREE.Color(0x5555FF), // Light Blue
      new THREE.Color(0x55FF55), // Light Green
      new THREE.Color(0x55FFFF), // Light Cyan
      new THREE.Color(0xFF5555), // Light Red
      new THREE.Color(0xFF55FF), // Light Magenta
      new THREE.Color(0xFFFF55), // Yellow
      new THREE.Color(0xFFFFFF), // White
    ],
  },
  {
    name: "VGA (16-color)",
    resolution: new THREE.Vector2(640, 480),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0x0000AA), // Blue
      new THREE.Color(0x00AA00), // Green
      new THREE.Color(0x00AAAA), // Cyan
      new THREE.Color(0xAA0000), // Red
      new THREE.Color(0xAA00AA), // Magenta
      new THREE.Color(0xAA5500), // Brown
      new THREE.Color(0xAAAAAA), // Light Gray
      new THREE.Color(0x555555), // Dark Gray
      new THREE.Color(0x5555FF), // Light Blue
      new THREE.Color(0x55FF55), // Light Green
      new THREE.Color(0x55FFFF), // Light Cyan
      new THREE.Color(0xFF5555), // Light Red
      new THREE.Color(0xFF55FF), // Light Magenta
      new THREE.Color(0xFFFF55), // Yellow
      new THREE.Color(0xFFFFFF), // White
    ],
  },
  {
    name: "Commodore 64",
    resolution: new THREE.Vector2(320, 200),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0xFFFFFF), // White
      new THREE.Color(0x880000), // Red
      new THREE.Color(0xAAFFEE), // Cyan
      new THREE.Color(0xCC44CC), // Purple
      new THREE.Color(0x00CC55), // Green
      new THREE.Color(0x0000AA), // Blue
      new THREE.Color(0xEEEE77), // Yellow
      new THREE.Color(0xDD8855), // Orange
      new THREE.Color(0x664400), // Brown
      new THREE.Color(0xFF7777), // Light Red
      new THREE.Color(0x333333), // Dark Gray
      new THREE.Color(0x777777), // Medium Gray
      new THREE.Color(0xAAFF66), // Light Green
      new THREE.Color(0x0088FF), // Light Blue
      new THREE.Color(0xBBBBBB), // Light Gray
    ],
  },
  {
    name: "ZX Spectrum",
    resolution: new THREE.Vector2(256, 192),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0x0000FF), // Blue
      new THREE.Color(0xFF0000), // Red
      new THREE.Color(0xFF00FF), // Magenta
      new THREE.Color(0x00FF00), // Green
      new THREE.Color(0x00FFFF), // Cyan
      new THREE.Color(0xFFFF00), // Yellow
      new THREE.Color(0xFFFFFF), // White
      new THREE.Color(0x000080), // Bright Blue
      new THREE.Color(0x800000), // Bright Red
      new THREE.Color(0x800080), // Bright Magenta
      new THREE.Color(0x008000), // Bright Green
      new THREE.Color(0x008080), // Bright Cyan
      new THREE.Color(0x808000), // Bright Yellow
      new THREE.Color(0xC0C0C0), // Bright White (Silver)
    ],
  },
  {
    name: "NES",
    resolution: new THREE.Vector2(256, 240),
    colorPalette: [
      new THREE.Color(0x7C7C7C), // Gray
      new THREE.Color(0x0000FC), // Blue
      new THREE.Color(0x0000BC), // Dark Blue
      new THREE.Color(0x4428BC), // Purple
      new THREE.Color(0x940084), // Magenta
      new THREE.Color(0xA80020), // Red
      new THREE.Color(0xA81000), // Dark Red
      new THREE.Color(0x881400), // Brown
      new THREE.Color(0x503000), // Dark Brown
      new THREE.Color(0x007800), // Green
      new THREE.Color(0x006800), // Dark Green
      new THREE.Color(0x005800), // Darker Green
      new THREE.Color(0x004058), // Teal
      new THREE.Color(0x000000), // Black
      new THREE.Color(0xBCBCBC), // Light Gray
      new THREE.Color(0x0078F8), // Light Blue
      new THREE.Color(0x0058F8), // Medium Blue
      new THREE.Color(0x6844FC), // Light Purple
      new THREE.Color(0xD800CC), // Light Magenta
      new THREE.Color(0xE40058), // Light Red
      new THREE.Color(0xF83800), // Orange
      new THREE.Color(0xE45C10), // Light Brown
      new THREE.Color(0xAC7C00), // Olive
      new THREE.Color(0x00B800), // Bright Green
      new THREE.Color(0x00A800), // Medium Green
      new THREE.Color(0x00A844), // Cyan
      new THREE.Color(0x008888), // Dark Cyan
      new THREE.Color(0xF8F8F8), // White
      new THREE.Color(0x3CBCFC), // Sky Blue
      new THREE.Color(0x6888FC), // Periwinkle
      new THREE.Color(0x9878F8), // Lavender
      new THREE.Color(0xF878F8), // Pink
      new THREE.Color(0xF85898), // Coral
      new THREE.Color(0xF87858), // Light Orange
      new THREE.Color(0xFCA044), // Peach
      new THREE.Color(0xE4B800), // Yellow
      new THREE.Color(0x88D800), // Lime
      new THREE.Color(0x78C850), // Light Green
      new THREE.Color(0x58B878), // Sea Green
      new THREE.Color(0x48A0A0), // Light Teal
      new THREE.Color(0x000000), // Black (duplicate)
      new THREE.Color(0xFCFCFC), // Near White
      new THREE.Color(0xA4E4FC), // Pale Blue
      new THREE.Color(0xB8B8F8), // Pale Purple
      new THREE.Color(0xD8B8F8), // Pale Pink
      new THREE.Color(0xF8B8F8), // Pale Magenta
      new THREE.Color(0xF8A4C0), // Pale Coral
      new THREE.Color(0xF0D0B0), // Pale Peach
      new THREE.Color(0xFCE0A8), // Pale Yellow
      new THREE.Color(0xD8F0D8), // Pale Green
      new THREE.Color(0xB8F0D8), // Pale Cyan
      new THREE.Color(0xB8F8F8), // Pale Teal
      new THREE.Color(0xB8F8D8), // Pale Sea Green
    ],
  },
  {
    name: "Sega Master System",
    resolution: new THREE.Vector2(256, 192),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0x555555), // Dark Gray
      new THREE.Color(0xAAAAAA), // Light Gray
      new THREE.Color(0xFFFFFF), // White
      new THREE.Color(0xFF0000), // Red
      new THREE.Color(0xAA0000), // Dark Red
      new THREE.Color(0xFF5555), // Light Red
      new THREE.Color(0x550000), // Darker Red
      new THREE.Color(0x00FF00), // Green
      new THREE.Color(0x00AA00), // Dark Green
      new THREE.Color(0x55FF55), // Light Green
      new THREE.Color(0x005500), // Darker Green
      new THREE.Color(0x0000FF), // Blue
      new THREE.Color(0x0000AA), // Dark Blue
      new THREE.Color(0x5555FF), // Light Blue
      new THREE.Color(0x000055), // Darker Blue
      new THREE.Color(0xFFFF00), // Yellow
      new THREE.Color(0xAAAA00), // Dark Yellow
      new THREE.Color(0xFFFF55), // Light Yellow
      new THREE.Color(0x555500), // Darker Yellow
      new THREE.Color(0xFF00FF), // Magenta
      new THREE.Color(0xAA00AA), // Dark Magenta
      new THREE.Color(0xFF55FF), // Light Magenta
      new THREE.Color(0x550055), // Darker Magenta
      new THREE.Color(0x00FFFF), // Cyan
      new THREE.Color(0x00AAAA), // Dark Cyan
      new THREE.Color(0x55FFFF), // Light Cyan
      new THREE.Color(0x005555), // Darker Cyan
      new THREE.Color(0xFFAA00), // Orange
      new THREE.Color(0xAA5500), // Dark Orange
      new THREE.Color(0xFFAA55), // Light Orange
      new THREE.Color(0x552800), // Darker Orange
      new THREE.Color(0xAAFF00), // Lime
      new THREE.Color(0x55AA00), // Dark Lime
      new THREE.Color(0xAAFF55), // Light Lime
      new THREE.Color(0x285500), // Darker Lime
      new THREE.Color(0x00FFAA), // Sea Green
      new THREE.Color(0x00AA55), // Dark Sea Green
      new THREE.Color(0x55FFAA), // Light Sea Green
      new THREE.Color(0x005528), // Darker Sea Green
      new THREE.Color(0xAA00FF), // Purple
      new THREE.Color(0x5500AA), // Dark Purple
      new THREE.Color(0xAA55FF), // Light Purple
      new THREE.Color(0x280055), // Darker Purple
      new THREE.Color(0xFF00AA), // Pink
      new THREE.Color(0xAA0055), // Dark Pink
      new THREE.Color(0xFF55AA), // Light Pink
      new THREE.Color(0x550028), // Darker Pink
      new THREE.Color(0x333333), // Very Dark Gray
      new THREE.Color(0x666666), // Medium Gray
      new THREE.Color(0xCCCCCC), // Very Light Gray
      new THREE.Color(0x808080), // Gray
      new THREE.Color(0x800000), // Maroon
      new THREE.Color(0x008000), // Olive Green
      new THREE.Color(0x000080), // Navy
      new THREE.Color(0x800080), // Deep Purple
      new THREE.Color(0x008080), // Teal
      new THREE.Color(0xC0C0C0), // Silver
      new THREE.Color(0xFFD700), // Gold
      new THREE.Color(0xFF4500), // Red-Orange
      new THREE.Color(0xDA70D6), // Orchid
      new THREE.Color(0xEEE8AA), // Pale Goldenrod
      new THREE.Color(0x98FB98), // Pale Green
      new THREE.Color(0xAFEEEE), // Pale Turquoise
    ],
  },
  {
    name: "Sega Genesis/Mega Drive",
    resolution: new THREE.Vector2(320, 224),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0x555555), // Dark Gray
      new THREE.Color(0xAAAAAA), // Light Gray
      new THREE.Color(0xFFFFFF), // White
      new THREE.Color(0xFF0000), // Red
      new THREE.Color(0xAA0000), // Dark Red
      new THREE.Color(0xFF5555), // Light Red
      new THREE.Color(0x550000), // Darker Red
      new THREE.Color(0x00FF00), // Green
      new THREE.Color(0x00AA00), // Dark Green
      new THREE.Color(0x55FF55), // Light Green
      new THREE.Color(0x005500), // Darker Green
      new THREE.Color(0x0000FF), // Blue
      new THREE.Color(0x0000AA), // Dark Blue
      new THREE.Color(0x5555FF), // Light Blue
      new THREE.Color(0x000055), // Darker Blue
      new THREE.Color(0xFFFF00), // Yellow
      new THREE.Color(0xAAAA00), // Dark Yellow
      new THREE.Color(0xFFFF55), // Light Yellow
      new THREE.Color(0x555500), // Darker Yellow
      new THREE.Color(0xFF00FF), // Magenta
      new THREE.Color(0xAA00AA), // Dark Magenta
      new THREE.Color(0xFF55FF), // Light Magenta
      new THREE.Color(0x550055), // Darker Magenta
      new THREE.Color(0x00FFFF), // Cyan
      new THREE.Color(0x00AAAA), // Dark Cyan
      new THREE.Color(0x55FFFF), // Light Cyan
      new THREE.Color(0x005555), // Darker Cyan
      new THREE.Color(0xFFAA00), // Orange
      new THREE.Color(0xAA5500), // Dark Orange
      new THREE.Color(0xFFAA55), // Light Orange
      new THREE.Color(0x552800), // Darker Orange
      new THREE.Color(0xAAFF00), // Lime
      new THREE.Color(0x55AA00), // Dark Lime
      new THREE.Color(0xAAFF55), // Light Lime
      new THREE.Color(0x285500), // Darker Lime
      new THREE.Color(0x00FFAA), // Sea Green
      new THREE.Color(0x00AA55), // Dark Sea Green
      new THREE.Color(0x55FFAA), // Light Sea Green
      new THREE.Color(0x005528), // Darker Sea Green
      new THREE.Color(0xAA00FF), // Purple
      new THREE.Color(0x5500AA), // Dark Purple
      new THREE.Color(0xAA55FF), // Light Purple
      new THREE.Color(0x280055), // Darker Purple
      new THREE.Color(0xFF00AA), // Pink
      new THREE.Color(0xAA0055), // Dark Pink
      new THREE.Color(0xFF55AA), // Light Pink
      new THREE.Color(0x550028), // Darker Pink
      new THREE.Color(0x333333), // Very Dark Gray
      new THREE.Color(0x666666), // Medium Gray
      new THREE.Color(0xCCCCCC), // Very Light Gray
      new THREE.Color(0x808080), // Gray
      new THREE.Color(0x800000), // Maroon
      new THREE.Color(0x008000), // Olive Green
      new THREE.Color(0x000080), // Navy
      new THREE.Color(0x800080), // Deep Purple
      new THREE.Color(0x008080), // Teal
      new THREE.Color(0xFFD700), // Gold
      new THREE.Color(0xFF4500), // Red-Orange
      new THREE.Color(0xDA70D6), // Orchid
      new THREE.Color(0xEEE8AA), // Pale Goldenrod
    ],
  },
  {
    name: "SNES",
    resolution: new THREE.Vector2(256, 224),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0xFFFFFF), // White
      new THREE.Color(0xFF0000), // Red
      new THREE.Color(0xAA0000), // Dark Red
      new THREE.Color(0xFF5555), // Light Red
      new THREE.Color(0x550000), // Darker Red
      new THREE.Color(0x00FF00), // Green
      new THREE.Color(0x00AA00), // Dark Green
      new THREE.Color(0x55FF55), // Light Green
      new THREE.Color(0x005500), // Darker Green
      new THREE.Color(0x0000FF), // Blue
      new THREE.Color(0x0000AA), // Dark Blue
      new THREE.Color(0x5555FF), // Light Blue
      new THREE.Color(0x000055), // Darker Blue
      new THREE.Color(0xFFFF00), // Yellow
      new THREE.Color(0xAAAA00), // Dark Yellow
      new THREE.Color(0xFFFF55), // Light Yellow
      new THREE.Color(0x555500), // Darker Yellow
      new THREE.Color(0xFF00FF), // Magenta
      new THREE.Color(0xAA00AA), // Dark Magenta
      new THREE.Color(0xFF55FF), // Light Magenta
      new THREE.Color(0x550055), // Darker Magenta
      new THREE.Color(0x00FFFF), // Cyan
      new THREE.Color(0x00AAAA), // Dark Cyan
      new THREE.Color(0x55FFFF), // Light Cyan
      new THREE.Color(0x005555), // Darker Cyan
      new THREE.Color(0xFFAA00), // Orange
      new THREE.Color(0xAA5500), // Dark Orange
      new THREE.Color(0xFFAA55), // Light Orange
      new THREE.Color(0x552800), // Darker Orange
      new THREE.Color(0xAAFF00), // Lime
      new THREE.Color(0x55AA00), // Dark Lime
      new THREE.Color(0xAAFF55), // Light Lime
      new THREE.Color(0x285500), // Darker Lime
      new THREE.Color(0x00FFAA), // Sea Green
      new THREE.Color(0x00AA55), // Dark Sea Green
      new THREE.Color(0x55FFAA), // Light Sea Green
      new THREE.Color(0x005528), // Darker Sea Green
      new THREE.Color(0xAA00FF), // Purple
      new THREE.Color(0x5500AA), // Dark Purple
      new THREE.Color(0xAA55FF), // Light Purple
      new THREE.Color(0x280055), // Darker Purple
      new THREE.Color(0xFF00AA), // Pink
      new THREE.Color(0xAA0055), // Dark Pink
      new THREE.Color(0xFF55AA), // Light Pink
      new THREE.Color(0x550028), // Darker Pink
      new THREE.Color(0x333333), // Very Dark Gray
      new THREE.Color(0x666666), // Medium Gray
      new THREE.Color(0xCCCCCC), // Very Light Gray
      new THREE.Color(0x808080), // Gray
      new THREE.Color(0x800000), // Maroon
      new THREE.Color(0x008000), // Olive Green
      new THREE.Color(0x000080), // Navy
      new THREE.Color(0x800080), // Deep Purple
      new THREE.Color(0x008080), // Teal
      new THREE.Color(0xC0C0C0), // Silver
      new THREE.Color(0xFFD700), // Gold
      new THREE.Color(0xFF4500), // Red-Orange
      new THREE.Color(0xDA70D6), // Orchid
      new THREE.Color(0xEEE8AA), // Pale Goldenrod
      new THREE.Color(0x98FB98), // Pale Green
      new THREE.Color(0xAFEEEE), // Pale Turquoise
      new THREE.Color(0xDB7093), // Pale Violet Red
      new THREE.Color(0xFFE4C4), // Bisque
      new THREE.Color(0xFFDAB9), // Peach Puff
      new THREE.Color(0xCD853F), // Peru
      new THREE.Color(0xFFC0CB), // Pink
      new THREE.Color(0xDDA0DD), // Plum
      new THREE.Color(0xB0E0E6), // Powder Blue
      new THREE.Color(0xBC8F8F), // Rosy Brown
      new THREE.Color(0x4169E1), // Royal Blue
      new THREE.Color(0x8B4513), // Saddle Brown
      new THREE.Color(0xFA8072), // Salmon
      new THREE.Color(0xF4A460), // Sandy Brown
      new THREE.Color(0x2E8B57), // Sea Green
      new THREE.Color(0xA0522D), // Sienna
      new THREE.Color(0x87CEEB), // Sky Blue
      new THREE.Color(0x6A5ACD), // Slate Blue
      new THREE.Color(0x708090), // Slate Gray
      new THREE.Color(0xFFF5EE), // Seashell
      new THREE.Color(0x4682B4), // Steel Blue
      new THREE.Color(0xD2B48C), // Tan
      new THREE.Color(0xD8BFD8), // Thistle
      new THREE.Color(0xFF6347), // Tomato
      new THREE.Color(0x40E0D0), // Turquoise
      new THREE.Color(0xEE82EE), // Violet
      new THREE.Color(0xF5DEB3), // Wheat
      new THREE.Color(0xF5F5F5), // White Smoke
      new THREE.Color(0x9ACD32), // Yellow Green
      new THREE.Color(0x663399), // Rebecca Purple
      new THREE.Color(0x191970), // Midnight Blue
      new THREE.Color(0xF0F8FF), // Alice Blue
      new THREE.Color(0xF0FFFF), // Azure
      new THREE.Color(0xF5F5DC), // Beige
      new THREE.Color(0xFFE4E1), // Misty Rose
      new THREE.Color(0x228B22), // Forest Green
      new THREE.Color(0xDCDCDC), // Gainsboro
      new THREE.Color(0xF8F8FF), // Ghost White
      new THREE.Color(0xDAA520), // Goldenrod
      new THREE.Color(0xADFF2F), // Green Yellow
      new THREE.Color(0xF0FFF0), // Honeydew
      new THREE.Color(0xFF69B4), // Hot Pink
      new THREE.Color(0xCD5C5C), // Indian Red
      new THREE.Color(0x4B0082), // Indigo
      new THREE.Color(0xFFFFF0), // Ivory
      new THREE.Color(0xF0E68C), // Khaki
      new THREE.Color(0xE6E6FA), // Lavender
      new THREE.Color(0xFFF0F5), // Lavender Blush
      new THREE.Color(0x7CFC00), // Lawn Green
      new THREE.Color(0xFFFACD), // Lemon Chiffon
      new THREE.Color(0xADD8E6), // Light Blue
      new THREE.Color(0xF08080), // Light Coral
      new THREE.Color(0xE0FFFF), // Light Cyan
      new THREE.Color(0xFAFAD2), // Light Goldenrod Yellow
      new THREE.Color(0xD3D3D3), // Light Gray
      new THREE.Color(0x90EE90), // Light Green
      new THREE.Color(0xFFB6C1), // Light Pink
      new THREE.Color(0xFFA07A), // Light Salmon
      new THREE.Color(0x20B2AA), // Light Sea Green
      new THREE.Color(0x87CEFA), // Light Sky Blue
      new THREE.Color(0x778899), // Light Slate Gray
      new THREE.Color(0xB0C4DE), // Light Steel Blue
      new THREE.Color(0xFFFFE0), // Light Yellow
      new THREE.Color(0x32CD32), // Lime Green
      new THREE.Color(0xFAF0E6), // Linen
      new THREE.Color(0x66CDAA), // Medium Aquamarine
      new THREE.Color(0x0000CD), // Medium Blue
      new THREE.Color(0xBA55D3), // Medium Orchid
      new THREE.Color(0x9370DB), // Medium Purple
      new THREE.Color(0x3CB371), // Medium Sea Green
      new THREE.Color(0x7B68EE), // Medium Slate Blue
      new THREE.Color(0x00FA9A), // Medium Spring Green
      new THREE.Color(0x48D1CC), // Medium Turquoise
      new THREE.Color(0xC71585), // Medium Violet Red
      new THREE.Color(0xF5FFFA), // Mint Cream
      new THREE.Color(0xFFE4B5), // Moccasin
      new THREE.Color(0xFFDEAD), // Navajo White
      new THREE.Color(0xFDF5E6), // Old Lace
      new THREE.Color(0x6B8E23), // Olive Drab
      new THREE.Color(0xFFA500), // Orange
      new THREE.Color(0xFFEFD5), // Papaya Whip
      new THREE.Color(0xB22222), // Firebrick
      new THREE.Color(0xFFEBCD), // Blanched Almond
      new THREE.Color(0xA52A2A), // Brown
      new THREE.Color(0xDEB887), // Burly Wood
      new THREE.Color(0x5F9EA0), // Cadet Blue
      new THREE.Color(0x7FFF00), // Chartreuse
      new THREE.Color(0xD2691E), // Chocolate
      new THREE.Color(0xFF7F50), // Coral
      new THREE.Color(0x6495ED), // Cornflower Blue
      new THREE.Color(0xFFF8DC), // Cornsilk
      new THREE.Color(0xDC143C), // Crimson
      new THREE.Color(0x008B8B), // Dark Cyan
      new THREE.Color(0xB8860B), // Dark Goldenrod
      new THREE.Color(0xA9A9A9), // Dark Gray
      new THREE.Color(0x006400), // Dark Green
      new THREE.Color(0xBDB76B), // Dark Khaki
      new THREE.Color(0x8B008B), // Dark Magenta
      new THREE.Color(0x556B2F), // Dark Olive Green
      new THREE.Color(0xFF8C00), // Dark Orange
      new THREE.Color(0x9932CC), // Dark Orchid
      new THREE.Color(0x8B0000), // Dark Red
      new THREE.Color(0xE9967A), // Dark Salmon
      new THREE.Color(0x8FBC8F), // Dark Sea Green
      new THREE.Color(0x483D8B), // Dark Slate Blue
      new THREE.Color(0x2F4F4F), // Dark Slate Gray
      new THREE.Color(0x00CED1), // Dark Turquoise
      new THREE.Color(0x9400D3), // Dark Violet
      new THREE.Color(0xFF1493), // Deep Pink
      new THREE.Color(0x00B7EB), // Deep Sky Blue
      new THREE.Color(0x696969), // Dim Gray
      new THREE.Color(0x1E90FF), // Dodger Blue
      new THREE.Color(0xFFFAF0), // Floral White
      new THREE.Color(0xFF00FF), // Fuchsia
      new THREE.Color(0x008000), // Green
      new THREE.Color(0xCD5C5C), // Indian Red
      new THREE.Color(0x4B0082), // Indigo
      new THREE.Color(0xFFFFF0), // Ivory
      new THREE.Color(0xE6E6FA), // Lavender
      new THREE.Color(0xFFF0F5), // Lavender Blush
      new THREE.Color(0x7CFC00), // Lawn Green
      new THREE.Color(0xADD8E6), // Light Blue
      new THREE.Color(0xF08080), // Light Coral
      new THREE.Color(0xE0FFFF), // Light Cyan
      new THREE.Color(0xFAFAD2), // Light Goldenrod Yellow
      new THREE.Color(0xD3D3D3), // Light Gray
      new THREE.Color(0x90EE90), // Light Green
      new THREE.Color(0xFFB6C1), // Light Pink
      new THREE.Color(0xFFA07A), // Light Salmon
      new THREE.Color(0x20B2AA), // Light Sea Green
      new THREE.Color(0x87CEFA), // Light Sky Blue
      new THREE.Color(0x778899), // Light Slate Gray
      new THREE.Color(0xB0C4DE), // Light Steel Blue
      new THREE.Color(0xFFFFE0), // Light Yellow
      new THREE.Color(0x00FF00), // Lime
      new THREE.Color(0xFF00FF), // Magenta
      new THREE.Color(0x800000), // Maroon
      new THREE.Color(0x0000CD), // Medium Blue
      new THREE.Color(0xBA55D3), // Medium Orchid
      new THREE.Color(0x9370DB), // Medium Purple
      new THREE.Color(0x3CB371), // Medium Sea Green
      new THREE.Color(0x7B68EE), // Medium Slate Blue
      new THREE.Color(0x00FA9A), // Medium Spring Green
      new THREE.Color(0x48D1CC), // Medium Turquoise
      new THREE.Color(0xC71585), // Medium Violet Red
      new THREE.Color(0x191970), // Midnight Blue
      new THREE.Color(0x000080), // Navy
      new THREE.Color(0x808000), // Olive
      new THREE.Color(0xFF4500), // Orange Red
      new THREE.Color(0x800080), // Purple
      new THREE.Color(0xFF0000), // Red
      new THREE.Color(0xFFFAFA), // Snow
      new THREE.Color(0x00FF7F), // Spring Green
      new THREE.Color(0x008080), // Teal
      new THREE.Color(0xF5F5F5), // White Smoke
      new THREE.Color(0xFFFF00), // Yellow
    ],
  },
  {
    name: "Game Boy",
    resolution: new THREE.Vector2(160, 144),
    colorPalette: [
      new THREE.Color(0x0F380F), // Darkest Green
      new THREE.Color(0x306230), // Dark Green
      new THREE.Color(0x8BAC0F), // Light Green
      new THREE.Color(0x9BBC0F), // Lightest Green
    ],
  },
  {
    name: "Amstrad CPC",
    resolution: new THREE.Vector2(320, 200),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0x0000FF), // Blue
      new THREE.Color(0xFF0000), // Red
      new THREE.Color(0xFF00FF), // Magenta
      new THREE.Color(0x00FF00), // Green
      new THREE.Color(0x00FFFF), // Cyan
      new THREE.Color(0xFFFF00), // Yellow
      new THREE.Color(0xFFFFFF), // White
      new THREE.Color(0x800000), // Dark Red
      new THREE.Color(0x008000), // Dark Green
      new THREE.Color(0x000080), // Dark Blue
      new THREE.Color(0x808000), // Olive
      new THREE.Color(0x800080), // Purple
      new THREE.Color(0x008080), // Teal
      new THREE.Color(0xC0C0C0), // Silver
      new THREE.Color(0x808080), // Gray
    ],
  },
  {
    name: "MSX",
    resolution: new THREE.Vector2(256, 192),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0x0000FF), // Blue
      new THREE.Color(0xFF0000), // Red
      new THREE.Color(0xFF00FF), // Magenta
      new THREE.Color(0x00FF00), // Green
      new THREE.Color(0x00FFFF), // Cyan
      new THREE.Color(0xFFFF00), // Yellow
      new THREE.Color(0xFFFFFF), // White
      new THREE.Color(0x800000), // Dark Red
      new THREE.Color(0x008000), // Dark Green
      new THREE.Color(0x000080), // Dark Blue
      new THREE.Color(0x808000), // Olive
      new THREE.Color(0x800080), // Purple
      new THREE.Color(0x008080), // Teal
      new THREE.Color(0xC0C0C0), // Silver
      new THREE.Color(0x808080), // Gray
    ],
  },
  {
    name: "PC-88",
    resolution: new THREE.Vector2(640, 200),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0xFF0000), // Red
      new THREE.Color(0x00FF00), // Green
      new THREE.Color(0x0000FF), // Blue
      new THREE.Color(0xFFFF00), // Yellow
      new THREE.Color(0xFF00FF), // Magenta
      new THREE.Color(0x00FFFF), // Cyan
      new THREE.Color(0xFFFFFF), // White
    ],
  },
  {
    name: "Apple II",
    resolution: new THREE.Vector2(280, 192),
    colorPalette: [
      new THREE.Color(0x000000), // Black
      new THREE.Color(0xFF0000), // Red
      new THREE.Color(0x00FF00), // Green
      new THREE.Color(0x0000FF), // Blue
      new THREE.Color(0xFFFF00), // Yellow
      new THREE.Color(0xFF00FF), // Magenta
      new THREE.Color(0x00FFFF), // Cyan
      new THREE.Color(0xFFFFFF), // White
      new THREE.Color(0x800000), // Dark Red
      new THREE.Color(0x008000), // Dark Green
      new THREE.Color(0x000080), // Dark Blue
      new THREE.Color(0x808000), // Olive
      new THREE.Color(0x800080), // Purple
      new THREE.Color(0x008080), // Teal
      new THREE.Color(0xC0C0C0), // Silver
      new THREE.Color(0x808080), // Gray
    ],
  },
];
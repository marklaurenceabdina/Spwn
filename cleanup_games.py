from pathlib import Path

path = Path(r'C:\Users\markl\Desktop\d\d\app\Spwn\src\app\data\games.ts')
text = path.read_text(encoding='utf-8')

# Find the positions
start_marker = 'export const GAMES: Game[] = ['
end_marker = '\n\nexport const SEED_REVIEWS:'

start_idx = text.find(start_marker)
end_idx = text.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Markers not found")
    exit(1)

# Keep only the last 5 games: path-of-exile-2, portal-2, bioshock-infinite, dishonored-2, half-life-alyx
new_games_array = '''export const GAMES: Game[] = [
  {
    id: "path-of-exile-2", title: "Path of Exile 2", developer: "Grinding Gear Games", publisher: "Grinding Gear Games",
    year: 2024, genres: ["Action RPG", "Hack and Slash", "Multiplayer"],
    description: "A new dark continent, a new story, and a completely rebuilt engine — PoE2 sets a new standard for the action RPG genre.",
    longDescription: "Path of Exile 2 is a complete reimagining of the action RPG genre that expands on its predecessor with an entirely new campaign across Wraeclast's dark continents. Featuring 12 character classes, a reimagined skill gem system, and endgame depth that rivals or exceeds the genre's best, PoE2 is a colossal achievement in free-to-play game design.",
    image: IMG.dark, rating: 9.1, reviewCount: 8200,
    tags: ["ARPG", "Hack and Slash", "Free-to-Play", "Deep", "Co-op"],
    platform: ["PC", "PlayStation 5", "Xbox Series X/S"],
    minSpecs: HIGH, recSpecs: HIGH_R, trailerVideoId: "iqysmS4lxwQ", popularity: 87,
  },
  {
    id: "portal-2", title: "Portal 2", developer: "Valve", publisher: "Valve",
    year: 2011, genres: ["Puzzle", "FPS", "Co-op"],
    description: "Wield the Aperture Science Handheld Portal Device in increasingly devious test chambers alongside the sardonic AI GLaDOS in this beloved puzzle masterpiece.",
    longDescription: "Portal 2 is widely regarded as the perfect puzzle game. Its escalating challenges introduce new mechanics — gels, aerial faith plates, light bridges — with meticulous pacing, while its writing is among gaming's finest. The two-player co-op campaign, featuring robots Atlas and P-Body, adds an entirely separate and equally brilliant puzzle experience.",
    image: IMG.tech, rating: 9.8, reviewCount: 13600,
    tags: ["Puzzle", "Comedy", "Co-op", "Valve", "Classic"],
    platform: ["PC", "PlayStation 3", "Xbox 360"],
    minSpecs: LOW, recSpecs: LOW_R, trailerVideoId: "iqysmS4lxwQ", popularity: 95,
  },
  {
    id: "bioshock-infinite", title: "BioShock Infinite", developer: "Irrational Games", publisher: "2K Games",
    year: 2013, genres: ["FPS", "Action", "Sci-Fi"],
    description: "Escort Elizabeth through the floating city of Columbia while battling the ideological fanaticism of its founders in this genre-defining FPS.",
    longDescription: "BioShock Infinite offers one of gaming's most ambitious narratives — a story about American exceptionalism, racism, and alternate realities wrapped in a spectacular first-person shooter. Elizabeth's companion AI is a technical and design marvel, while the city of Columbia remains one of the medium's most detailed and lovingly crafted environments.",
    image: IMG.city, rating: 9.0, reviewCount: 8900,
    tags: ["FPS", "Story Rich", "Alternate History", "Companion", "Atmospheric"],
    platform: ["PC", "PlayStation 3/4", "Xbox 360/One"],
    minSpecs: LOW, recSpecs: MID, trailerVideoId: "iqysmS4lxwQ", popularity: 86,
  },
  {
    id: "dishonored-2", title: "Dishonored 2", developer: "Arkane Studios", publisher: "Bethesda Softworks",
    year: 2016, genres: ["Action", "Stealth", "Immersive Sim"],
    description: "Emily Kaldwin or Corvo Attano must reclaim the throne from a ruthless usurper in this masterpiece of player freedom and environmental storytelling.",
    longDescription: "Dishonored 2 refines everything that made its predecessor great while expanding it considerably with two fully distinct playstyles and some of gaming's most inventive level design. The Clockwork Mansion and A Crack in the Slab are particularly extraordinary levels that use the game's time-manipulation and environmental mechanics in breathtaking ways.",
    image: IMG.citynight, rating: 9.0, reviewCount: 5700,
    tags: ["Stealth", "Immersive Sim", "Powers", "Victorian", "Creative"],
    platform: ["PC", "PlayStation 4", "Xbox One"],
    minSpecs: MID, recSpecs: MID_R, trailerVideoId: "iqysmS4lxwQ", popularity: 82,
  },
  {
    id: "half-life-alyx", title: "Half-Life: Alyx", developer: "Valve", publisher: "Valve",
    year: 2020, genres: ["VR", "FPS", "Sci-Fi"],
    description: "The flagship VR game that sets the standard for immersive first-person experiences — Alyx Vance fights the Combine to save her father in pre-Half-Life 2 City 17.",
    longDescription: "Half-Life: Alyx is the most compelling argument for virtual reality gaming ever made. Valve's meticulous design attention — the physics interactions, enemy AI, puzzle design, and environmental storytelling — make it feel like the next leap in interactive entertainment. Even for those without VR, watching it played is breathtaking.",
    image: IMG.tech, rating: 9.7, reviewCount: 7200,
    tags: ["VR", "FPS", "Sci-Fi", "Valve", "Immersive"],
    platform: ["PC (VR Required)"],
    minSpecs: HIGH, recSpecs: HIGH_R, trailerVideoId: "iqysmS4lxwQ", popularity: 88,
  },
];'''

new_text = text[:start_idx] + new_games_array + text[end_idx:]
path.write_text(new_text, encoding='utf-8')
print('Reduced to 5 games')

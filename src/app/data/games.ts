export interface GameSpec {
  os: string;
  cpu: string;
  ram: string;
  gpu: string;
  storage: string;
}

export interface Game {
  id: string;
  title: string;
  developer: string;
  publisher: string;
  year: number;
  genres: string[];
  description: string;
  longDescription: string;
  image: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  platform: string[];
  minSpecs: GameSpec;
  recSpecs: GameSpec;
  trailerVideoId: string;
  popularity: number;
}

const LOW: GameSpec = { os: "Windows 10 64-bit", cpu: "Intel Core i5-4460 / AMD FX-6300", ram: "8 GB", gpu: "NVIDIA GTX 960 / AMD RX 570", storage: "30 GB" };
const LOW_R: GameSpec = { os: "Windows 10 64-bit", cpu: "Intel Core i7-6700 / AMD Ryzen 5 1600", ram: "16 GB", gpu: "NVIDIA GTX 1060 / AMD RX 580", storage: "30 GB SSD" };
const MID: GameSpec = { os: "Windows 10 64-bit", cpu: "Intel Core i5-8600K / AMD Ryzen 5 3600", ram: "12 GB", gpu: "NVIDIA GTX 1070 / AMD RX 5700", storage: "60 GB SSD" };
const MID_R: GameSpec = { os: "Windows 10 64-bit", cpu: "Intel Core i7-8700K / AMD Ryzen 7 3700X", ram: "16 GB", gpu: "NVIDIA RTX 2060 / AMD RX 5700 XT", storage: "60 GB NVMe SSD" };
const HIGH: GameSpec = { os: "Windows 10/11 64-bit", cpu: "Intel Core i7-10700K / AMD Ryzen 7 5800X", ram: "16 GB", gpu: "NVIDIA RTX 3070 / AMD RX 6800", storage: "100 GB NVMe SSD" };
const HIGH_R: GameSpec = { os: "Windows 11 64-bit", cpu: "Intel Core i9-12900K / AMD Ryzen 9 5900X", ram: "32 GB", gpu: "NVIDIA RTX 3080 / AMD RX 6900 XT", storage: "100 GB NVMe SSD" };
const ULTRA: GameSpec = { os: "Windows 11 64-bit", cpu: "Intel Core i9-13900K / AMD Ryzen 9 7900X", ram: "32 GB", gpu: "NVIDIA RTX 4070 / AMD RX 7800 XT", storage: "150 GB NVMe SSD" };
const ULTRA_R: GameSpec = { os: "Windows 11 64-bit", cpu: "Intel Core i9-14900K / AMD Ryzen 9 7950X", ram: "32 GB", gpu: "NVIDIA RTX 4090 / AMD RX 7900 XTX", storage: "150 GB NVMe SSD" };

const IMG = {
  dark: "https://images.unsplash.com/photo-1607336652415-008df45f08a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  fantasy: "https://images.unsplash.com/photo-1588342698151-9616728f21c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  dungeon: "https://images.unsplash.com/photo-1652126630804-0968197a3b5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  japan: "https://images.unsplash.com/photo-1635517006593-cd753762f253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  horror: "https://images.unsplash.com/photo-1699291534298-100b5c805542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  neon: "https://images.unsplash.com/photo-1758404196311-70c62a445e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  tactical: "https://images.unsplash.com/photo-1639069422496-03416b5daa28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  space: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  forest: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  snow: "https://images.unsplash.com/photo-1478359844494-1092259d93e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  city: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  retro: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  fire: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  ocean: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  sunset: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  citynight: "https://images.unsplash.com/photo-1498049794561-7780e7231661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  atmo: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  gothic: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  desert: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  abstract: "https://images.unsplash.com/photo-1563453392212-326f5e854473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  cyberpunk2: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  ruins: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
};

export const GAMES: Game[] = [
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
];

export const SEED_REVIEWS: {
  id: string;
  gameId: string;
  username: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
}[] = [
    { id: "r1", gameId: "elden-ring", username: "TarnishedLord", rating: 5, text: "An absolute masterpiece. FromSoftware has outdone themselves — the open world exploration combined with punishing but fair combat creates the most rewarding experience I've had in gaming.", date: "2024-03-12", helpful: 245 },
    { id: "r2", gameId: "elden-ring", username: "SoulsCrusher", rating: 5, text: "Radahn's boss fight alone is worth the price of admission. The sense of scale, the lore, the build diversity — unmatched. My 2022 GOTY without question.", date: "2024-02-28", helpful: 189 },
    { id: "r3", gameId: "elden-ring", username: "CasualRPGer", rating: 4, text: "Brutally difficult at first but once it clicks, it's deeply satisfying. Story delivery could be clearer for newcomers.", date: "2024-01-15", helpful: 97 },
    { id: "r4", gameId: "witcher-3", username: "GeraltFan99", rating: 5, text: "Still the gold standard for open-world RPGs nearly a decade later. The Bloody Baron quest alone is better storytelling than most entire games.", date: "2024-04-01", helpful: 412 },
    { id: "r5", gameId: "witcher-3", username: "LoreHunter", rating: 5, text: "The sheer depth of the world-building, the humanity of the side quests, the nuanced characters — there's nothing like it. Essential gaming.", date: "2024-03-20", helpful: 308 },
    { id: "r6", gameId: "baldurs-gate-3", username: "DiceMaster", rating: 5, text: "Larian has redefined the RPG genre. My co-op playthrough with friends is the most fun I've had in gaming in years. Every decision feels meaningful.", date: "2024-04-08", helpful: 367 },
    { id: "r7", gameId: "baldurs-gate-3", username: "TabletopTurns", rating: 5, text: "As a D&D player, this is a dream come true. The fidelity to the 5e ruleset combined with cinematic storytelling is jaw-dropping.", date: "2024-03-30", helpful: 201 },
    { id: "r8", gameId: "ghost-of-tsushima", username: "SamuraiPath", rating: 5, text: "The most beautiful open world I've ever seen. Sucker Punch's passion for the subject matter shows in every pixel. The wind mechanic is genius.", date: "2024-02-10", helpful: 183 },
    { id: "r9", gameId: "resident-evil-3", username: "ZombieSlayer", rating: 4, text: "Nemesis is genuinely terrifying. Great action pacing but feels shorter than RE2 Remake. Still a very solid horror experience.", date: "2024-01-22", helpful: 74 },
    { id: "r10", gameId: "cyberpunk-city", username: "NightRunner", rating: 4, text: "The city feels alive in a way few games achieve. Some technical issues at launch but the story and atmosphere are genuinely incredible.", date: "2024-04-15", helpful: 128 },
    { id: "r11", gameId: "tactical-ops", username: "ProSniper", rating: 4, text: "The gunplay is the tightest I've felt in years. Ranked mode is extremely competitive. Needs more maps but the foundation is rock solid.", date: "2024-04-02", helpful: 89 },
  ];

from pathlib import Path

path = Path(r'C:\Users\markl\Desktop\d\d\app\Spwn\src\app\data\games.ts')
text = path.read_text(encoding='utf-8')
start = 'export const GAMES: Game[] = ['
end = '\n\nexport const SEED_REVIEWS:'
idx = text.find(start)
if idx == -1:
    raise RuntimeError('start marker not found')
jdx = text.find(end, idx)
if jdx == -1:
    raise RuntimeError('end marker not found')
new_array = '''export const GAMES: Game[] = [
  {
    id: "witcher-3",
    title: "The Witcher 3: Wild Hunt",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    year: 2015,
    genres: ["RPG", "Action", "Open World"],
    description: "As Geralt of Rivia, a monster slayer for hire, embark on a quest to find the Child of Prophecy across a breathtaking open world.",
    longDescription: "The Witcher 3: Wild Hunt is a story-driven open-world RPG set in a dark fantasy universe. You play as Geralt of Rivia, a monster hunter known as a Witcher, tasked with finding a child of prophecy — Ciri — while also searching for her in a world ravaged by war. The game features hundreds of hours of content across a massive landscape with living ecosystems, dynamic weather, and a deeply branching narrative with meaningful choices.",
    image: IMG.dark,
    rating: 9.8,
    reviewCount: 12840,
    tags: ["Open World", "Story Rich", "Dark Fantasy", "Mature", "Choices Matter"],
    platform: ["PC", "PlayStation 4/5", "Xbox One/Series", "Nintendo Switch"],
    minSpecs: { os: "Windows 7/8/10 64-bit", cpu: "Intel Core i5-2500K 3.3 GHz", ram: "6 GB", gpu: "NVIDIA GTX 660 / AMD Radeon HD 7870", storage: "35 GB" },
    recSpecs: { os: "Windows 10 64-bit", cpu: "Intel Core i7-3770 3.4 GHz", ram: "8 GB", gpu: "NVIDIA GTX 770 / AMD Radeon RX 480", storage: "35 GB SSD" },
    trailerVideoId: "c0i88t0Kacs",
    popularity: 97,
  },
];'''

path.write_text(text[:idx] + new_array + text[jdx:], encoding='utf-8')
print('done')

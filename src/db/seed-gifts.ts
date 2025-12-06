import { db } from './index';
import { giftInventory } from './schema';

// Curated Unsplash image URLs by category and gift type
const giftImages: Record<string, Record<string, string>> = {
  educational: {
    'World Map Puzzle': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&h=400&fit=crop',
    'Microscope Kit': 'https://images.unsplash.com/photo-1516571748831-5d81767b788d?w=400&h=400&fit=crop',
    'Math Flash Cards': 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=400&fit=crop',
    'Solar System Model Kit': 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=400&fit=crop',
    'Coding Robot': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop',
    'Chemistry Set': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop',
    'History Timeline Cards': 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400&h=400&fit=crop',
    'Language Learning Game': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
    'Anatomy Model': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=400&fit=crop',
    'Electricity Kit': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
  },
  creative: {
    'Deluxe Art Set': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    'Pottery Wheel Kit': 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop',
    'Jewelry Making Set': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    'Origami Paper Pack': 'https://images.unsplash.com/photo-1574246604907-db69e30ddb97?w=400&h=400&fit=crop',
    'Tie-Dye Kit': 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=400&h=400&fit=crop',
    'Sketchbook Collection': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
    'Candle Making Kit': 'https://images.unsplash.com/photo-1602607135909-7b6c5a5c8ec8?w=400&h=400&fit=crop',
    'Sewing Machine for Kids': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    'Calligraphy Set': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop',
    'Play-Doh Mega Pack': 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
  },
  outdoor: {
    'Kids Camping Set': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=400&fit=crop',
    'Binoculars': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
    'Gardening Kit': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    'Kite': 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=400&h=400&fit=crop',
    'Bug Catching Kit': 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=400&h=400&fit=crop',
    'Water Balloon Launcher': 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=400&h=400&fit=crop',
    'Frisbee Set': 'https://images.unsplash.com/photo-1594495894542-a46cc73e081a?w=400&h=400&fit=crop',
    'Nature Explorer Backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    'Sandbox Toys Set': 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=400&h=400&fit=crop',
    'Trampoline': 'https://images.unsplash.com/photo-1626775238053-4315516eedc9?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=400&fit=crop',
  },
  tech: {
    'Kids Tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    'Digital Camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
    'Walkie Talkies': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    'Kids Smartwatch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'Drone for Beginners': 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&h=400&fit=crop',
    'VR Headset': 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=400&h=400&fit=crop',
    'Bluetooth Speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    'LED Strip Lights': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    'Karaoke Machine': 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
    'Game Controller': 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },
  books: {
    'Fairy Tales Collection': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
    'Adventure Novel Series': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
    'Science Encyclopedia': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop',
    'Comic Book Collection': 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop',
    'Joke Book': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    'Diary with Lock': 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop',
    'Cookbook for Kids': 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=400&fit=crop',
    'Animal Encyclopedia': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=400&fit=crop',
    'Poetry Collection': 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=400&fit=crop',
    'Board Books Set': 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
  },
  games: {
    'Strategy Board Game': 'https://images.unsplash.com/photo-1611891487122-207579d67d98?w=400&h=400&fit=crop',
    'Card Game Collection': 'https://images.unsplash.com/photo-1529480780361-0b69927ccb89?w=400&h=400&fit=crop',
    'Puzzle Box Set': 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=400&h=400&fit=crop',
    'Trivia Game': 'https://images.unsplash.com/photo-1606503153255-59d7d2f6c3e4?w=400&h=400&fit=crop',
    'Marble Run Set': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop',
    'Memory Matching Game': 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=400&fit=crop',
    'Cooperative Adventure Game': 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=400&fit=crop',
    'Word Game': 'https://images.unsplash.com/photo-1585504256554-5c3a54e6d21c?w=400&h=400&fit=crop',
    'Video Game (Age Appropriate)': 'https://images.unsplash.com/photo-1493711662062-fa541f7f2f60?w=400&h=400&fit=crop',
    'Dice Games Set': 'https://images.unsplash.com/photo-1522069213448-443a614da9b6?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1611891487122-207579d67d98?w=400&h=400&fit=crop',
  },
  sports: {
    'Soccer Ball': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop',
    'Basketball Hoop': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop',
    'Tennis Racket Set': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop',
    'Skateboard': 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=400&h=400&fit=crop',
    'Roller Skates': 'https://images.unsplash.com/photo-1593786324420-7fded31c20db?w=400&h=400&fit=crop',
    'Baseball Glove and Ball': 'https://images.unsplash.com/photo-1527234988531-40868c1e5f5f?w=400&h=400&fit=crop',
    'Jump Rope': 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=400&fit=crop',
    'Golf Set for Kids': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=400&fit=crop',
    'Scooter': 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=400&fit=crop',
    'Swimming Goggles and Cap': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop',
  },
  music: {
    'Acoustic Guitar': 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop',
    'Keyboard Piano': 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop',
    'Drum Set': 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=400&fit=crop',
    'Ukulele': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    'Recorder': 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=400&h=400&fit=crop',
    'Xylophone': 'https://images.unsplash.com/photo-1514119412350-e174d90d280e?w=400&h=400&fit=crop',
    'Harmonica': 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&h=400&fit=crop',
    'Music Box Collection': 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop',
    'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    'DJ Mixer Toy': 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
  },
  building: {
    'LEGO Classic Set': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
    'Magnetic Tiles': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
    'Wooden Blocks Set': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop',
    "K'NEX Set": 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
    'Model Car Kit': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=400&fit=crop',
    'Train Set': 'https://images.unsplash.com/photo-1527259191233-c59e19c26fe3?w=400&h=400&fit=crop',
    'Marble Maze Builder': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop',
    'Architecture Set': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=400&fit=crop',
    'Gears and Motors Kit': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    'Fort Building Kit': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
  },
  dolls: {
    'Fashion Doll': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
    'Baby Doll Set': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop',
    'Dollhouse': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
    'Action Figure Set': 'https://images.unsplash.com/photo-1608278047522-58806a6fd7bd?w=400&h=400&fit=crop',
    'Stuffed Animal': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
    'Puppet Set': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
    'Paper Dolls': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
    'Character Plush': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
    'Doll Clothes Set': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
    'Collectible Figures': 'https://images.unsplash.com/photo-1608278047522-58806a6fd7bd?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
  },
  vehicles: {
    'Remote Control Car': 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop',
    'Toy Train Set': 'https://images.unsplash.com/photo-1527259191233-c59e19c26fe3?w=400&h=400&fit=crop',
    'Monster Truck': 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop',
    'Airplane Model': 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400&h=400&fit=crop',
    'Fire Truck': 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?w=400&h=400&fit=crop',
    'Construction Vehicles Set': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=400&fit=crop',
    'Race Track Set': 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop',
    'Boat Toy': 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=400&h=400&fit=crop',
    'Helicopter': 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop',
    'Hot Wheels Collection': 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop',
  },
  animals: {
    'Pet Care Play Set': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=400&fit=crop',
    'Dinosaur Figures': 'https://images.unsplash.com/photo-1519174639603-8b39c65ea36c?w=400&h=400&fit=crop',
    'Ocean Animals Set': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
    'Farm Animals Set': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=400&fit=crop',
    'Safari Animals': 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=400&fit=crop',
    'Butterfly Garden Kit': 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400&h=400&fit=crop',
    'Ant Farm': 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=400&h=400&fit=crop',
    'Bird Feeder Kit': 'https://images.unsplash.com/photo-1520087619250-584c0cbd35e8?w=400&h=400&fit=crop',
    'Horse Stable Set': 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=400&fit=crop',
    'Interactive Pet Toy': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=400&fit=crop',
  },
  science: {
    'Volcano Kit': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop',
    'Telescope': 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&h=400&fit=crop',
    'Crystal Growing Kit': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop',
    'Robot Building Kit': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop',
    'Weather Station': 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=400&h=400&fit=crop',
    'Fossil Dig Kit': 'https://images.unsplash.com/photo-1589825743681-e04f128dfee3?w=400&h=400&fit=crop',
    'Slime Lab': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop',
    'Magnet Experiment Set': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop',
    'DNA Model Kit': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=400&fit=crop',
    'Solar Panel Kit': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop',
  },
  art: {
    'Watercolor Paint Set': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop',
    'Canvas and Easel': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    'Clay Modeling Kit': 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop',
    'Pastel Chalk Set': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    'Scratch Art Paper': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    'Acrylic Paint Set': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop',
    'Drawing Mannequin': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    'Stencil Collection': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    'Rock Painting Kit': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    'Spray Paint Art Set': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
  },
};

// Helper function to get image URL for a gift
function getGiftImageUrl(category: string, giftName: string): string {
  const categoryImages = giftImages[category];
  if (!categoryImages) {
    return 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop';
  }

  // Try to find exact match first
  for (const [name, url] of Object.entries(categoryImages)) {
    if (giftName.includes(name) || name.includes(giftName.replace(/^(Deluxe |Mini |Pro |Ultimate |Basic |Premium )/, ''))) {
      return url;
    }
  }

  // Fall back to category default
  return categoryImages.default || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop';
}

// Gift templates by category
const giftTemplates: Record<
  string,
  Array<{
    name: string;
    description: string;
    basePrice: number;
    tags: string[];
    ageGroups: string[];
  }>
> = {
  educational: [
    { name: 'World Map Puzzle', description: 'Learn geography with this beautiful 500-piece world map puzzle', basePrice: 24.99, tags: ['puzzle', 'geography', 'learning'], ageGroups: ['early_school', 'tween'] },
    { name: 'Microscope Kit', description: 'Explore the microscopic world with this beginner-friendly microscope set', basePrice: 49.99, tags: ['science', 'discovery', 'stem'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Math Flash Cards', description: 'Fun flash cards to practice addition, subtraction, and multiplication', basePrice: 12.99, tags: ['math', 'practice', 'learning'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Solar System Model Kit', description: 'Build and paint your own solar system mobile', basePrice: 29.99, tags: ['space', 'crafts', 'science'], ageGroups: ['early_school', 'tween'] },
    { name: 'Coding Robot', description: 'Learn programming basics with this interactive coding robot', basePrice: 79.99, tags: ['coding', 'stem', 'technology'], ageGroups: ['early_school', 'tween'] },
    { name: 'Chemistry Set', description: 'Safe chemistry experiments for young scientists', basePrice: 39.99, tags: ['science', 'experiments', 'stem'], ageGroups: ['tween', 'teen'] },
    { name: 'History Timeline Cards', description: 'Learn about historical events through illustrated cards', basePrice: 18.99, tags: ['history', 'learning', 'cards'], ageGroups: ['early_school', 'tween'] },
    { name: 'Language Learning Game', description: 'Fun board game to learn Spanish, French, or German', basePrice: 34.99, tags: ['language', 'game', 'learning'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Anatomy Model', description: 'Build a human body model and learn about organs', basePrice: 44.99, tags: ['science', 'biology', 'model'], ageGroups: ['tween', 'teen'] },
    { name: 'Electricity Kit', description: 'Build circuits and learn about electricity safely', basePrice: 54.99, tags: ['science', 'electronics', 'stem'], ageGroups: ['early_school', 'tween'] },
  ],
  creative: [
    { name: 'Deluxe Art Set', description: 'Complete art set with colored pencils, markers, paints, and brushes', basePrice: 45.99, tags: ['art', 'drawing', 'painting'], ageGroups: ['preschool', 'early_school', 'tween', 'teen'] },
    { name: 'Pottery Wheel Kit', description: 'Create your own pottery with this electric pottery wheel', basePrice: 59.99, tags: ['pottery', 'crafts', 'clay'], ageGroups: ['tween', 'teen'] },
    { name: 'Jewelry Making Set', description: 'Make beautiful bracelets and necklaces with beads and charms', basePrice: 24.99, tags: ['jewelry', 'crafts', 'beads'], ageGroups: ['early_school', 'tween'] },
    { name: 'Origami Paper Pack', description: 'Colorful origami paper with instruction book for 100 designs', basePrice: 15.99, tags: ['origami', 'paper', 'folding'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Tie-Dye Kit', description: 'Create colorful tie-dye shirts and accessories', basePrice: 19.99, tags: ['tie-dye', 'fabric', 'crafts'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Sketchbook Collection', description: 'Set of premium sketchbooks for drawing and doodling', basePrice: 22.99, tags: ['drawing', 'sketching', 'art'], ageGroups: ['tween', 'teen'] },
    { name: 'Candle Making Kit', description: 'Make scented candles with natural wax and essential oils', basePrice: 34.99, tags: ['candles', 'crafts', 'diy'], ageGroups: ['tween', 'teen'] },
    { name: 'Sewing Machine for Kids', description: 'Real working sewing machine designed for beginners', basePrice: 69.99, tags: ['sewing', 'fabric', 'crafts'], ageGroups: ['tween', 'teen'] },
    { name: 'Calligraphy Set', description: 'Learn beautiful handwriting with pens and practice sheets', basePrice: 28.99, tags: ['calligraphy', 'writing', 'art'], ageGroups: ['tween', 'teen'] },
    { name: 'Play-Doh Mega Pack', description: '36 colors of non-toxic modeling compound', basePrice: 19.99, tags: ['playdoh', 'sculpting', 'sensory'], ageGroups: ['toddler', 'preschool', 'early_school'] },
  ],
  outdoor: [
    { name: 'Kids Camping Set', description: 'Complete camping kit with tent, sleeping bag, and flashlight', basePrice: 89.99, tags: ['camping', 'adventure', 'nature'], ageGroups: ['early_school', 'tween'] },
    { name: 'Binoculars', description: 'Kid-friendly binoculars for bird watching and exploration', basePrice: 29.99, tags: ['nature', 'birds', 'exploration'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Gardening Kit', description: 'Tools and seeds to start your own garden', basePrice: 24.99, tags: ['gardening', 'plants', 'nature'], ageGroups: ['preschool', 'early_school', 'tween'] },
    { name: 'Kite', description: 'Colorful easy-to-fly delta kite for windy days', basePrice: 18.99, tags: ['kite', 'flying', 'wind'], ageGroups: ['preschool', 'early_school', 'tween'] },
    { name: 'Bug Catching Kit', description: 'Catch and observe insects with magnifying container', basePrice: 16.99, tags: ['bugs', 'insects', 'nature'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Water Balloon Launcher', description: 'Launch water balloons up to 100 feet', basePrice: 24.99, tags: ['water', 'summer', 'games'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Frisbee Set', description: 'Set of 3 flying discs for outdoor fun', basePrice: 14.99, tags: ['frisbee', 'throwing', 'games'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Nature Explorer Backpack', description: 'Backpack with compass, magnifying glass, and field guide', basePrice: 39.99, tags: ['nature', 'hiking', 'exploration'], ageGroups: ['early_school', 'tween'] },
    { name: 'Sandbox Toys Set', description: 'Buckets, shovels, and molds for sandbox play', basePrice: 22.99, tags: ['sand', 'beach', 'digging'], ageGroups: ['toddler', 'preschool'] },
    { name: 'Trampoline', description: 'Mini indoor/outdoor trampoline with safety handle', basePrice: 79.99, tags: ['jumping', 'exercise', 'active'], ageGroups: ['preschool', 'early_school'] },
  ],
  tech: [
    { name: 'Kids Tablet', description: 'Educational tablet with parental controls and learning apps', basePrice: 129.99, tags: ['tablet', 'digital', 'learning'], ageGroups: ['preschool', 'early_school', 'tween'] },
    { name: 'Digital Camera', description: 'Durable digital camera designed for kids', basePrice: 49.99, tags: ['camera', 'photography', 'digital'], ageGroups: ['early_school', 'tween'] },
    { name: 'Walkie Talkies', description: 'Two-way radios with 2-mile range', basePrice: 29.99, tags: ['communication', 'adventure', 'play'], ageGroups: ['early_school', 'tween'] },
    { name: 'Kids Smartwatch', description: 'GPS-enabled smartwatch with games and fitness tracking', basePrice: 89.99, tags: ['watch', 'smart', 'wearable'], ageGroups: ['early_school', 'tween'] },
    { name: 'Drone for Beginners', description: 'Easy-to-fly mini drone with camera', basePrice: 69.99, tags: ['drone', 'flying', 'camera'], ageGroups: ['tween', 'teen'] },
    { name: 'VR Headset', description: 'Kid-friendly virtual reality headset with educational content', basePrice: 149.99, tags: ['vr', 'virtual', 'immersive'], ageGroups: ['tween', 'teen'] },
    { name: 'Bluetooth Speaker', description: 'Waterproof portable speaker with fun design', basePrice: 34.99, tags: ['speaker', 'music', 'portable'], ageGroups: ['tween', 'teen'] },
    { name: 'LED Strip Lights', description: 'Color-changing LED lights for bedroom decoration', basePrice: 24.99, tags: ['lights', 'room', 'decoration'], ageGroups: ['tween', 'teen'] },
    { name: 'Karaoke Machine', description: 'Portable karaoke system with microphone and Bluetooth', basePrice: 59.99, tags: ['karaoke', 'singing', 'music'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Game Controller', description: 'Wireless gaming controller compatible with multiple platforms', basePrice: 44.99, tags: ['gaming', 'controller', 'video games'], ageGroups: ['early_school', 'tween', 'teen'] },
  ],
  books: [
    { name: 'Fairy Tales Collection', description: 'Beautifully illustrated collection of classic fairy tales', basePrice: 24.99, tags: ['stories', 'classics', 'reading'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Adventure Novel Series', description: 'Exciting adventure series for young readers', basePrice: 34.99, tags: ['adventure', 'fiction', 'series'], ageGroups: ['early_school', 'tween'] },
    { name: 'Science Encyclopedia', description: 'Comprehensive science reference book with stunning photos', basePrice: 29.99, tags: ['science', 'reference', 'learning'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Comic Book Collection', description: 'Age-appropriate graphic novels and comics', basePrice: 19.99, tags: ['comics', 'graphic novel', 'illustrated'], ageGroups: ['early_school', 'tween'] },
    { name: 'Joke Book', description: 'Hundreds of kid-friendly jokes and riddles', basePrice: 9.99, tags: ['jokes', 'humor', 'funny'], ageGroups: ['early_school', 'tween'] },
    { name: 'Diary with Lock', description: 'Personal diary with lock and key', basePrice: 14.99, tags: ['diary', 'writing', 'personal'], ageGroups: ['tween', 'teen'] },
    { name: 'Cookbook for Kids', description: 'Easy recipes kids can make with adult supervision', basePrice: 18.99, tags: ['cooking', 'recipes', 'food'], ageGroups: ['early_school', 'tween'] },
    { name: 'Animal Encyclopedia', description: 'Learn about animals from around the world', basePrice: 27.99, tags: ['animals', 'nature', 'reference'], ageGroups: ['preschool', 'early_school', 'tween'] },
    { name: 'Poetry Collection', description: 'Classic and contemporary poems for young readers', basePrice: 16.99, tags: ['poetry', 'literature', 'reading'], ageGroups: ['tween', 'teen'] },
    { name: 'Board Books Set', description: 'Durable board books for little hands', basePrice: 22.99, tags: ['baby', 'board books', 'first books'], ageGroups: ['toddler', 'preschool'] },
  ],
  games: [
    { name: 'Strategy Board Game', description: 'Family-friendly strategy game for 2-4 players', basePrice: 39.99, tags: ['strategy', 'family', 'board game'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Card Game Collection', description: 'Classic card games like Uno, Go Fish, and more', basePrice: 14.99, tags: ['cards', 'classic', 'family'], ageGroups: ['preschool', 'early_school', 'tween'] },
    { name: 'Puzzle Box Set', description: 'Collection of brain-teasing puzzles and challenges', basePrice: 24.99, tags: ['puzzles', 'brain', 'challenge'], ageGroups: ['tween', 'teen'] },
    { name: 'Trivia Game', description: 'Fun trivia game with questions for all ages', basePrice: 29.99, tags: ['trivia', 'knowledge', 'family'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Marble Run Set', description: 'Build amazing marble tracks and watch them race', basePrice: 34.99, tags: ['marble', 'building', 'physics'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Memory Matching Game', description: 'Classic memory game with beautiful illustrations', basePrice: 12.99, tags: ['memory', 'matching', 'cognitive'], ageGroups: ['toddler', 'preschool', 'early_school'] },
    { name: 'Cooperative Adventure Game', description: 'Work together to complete quests and challenges', basePrice: 44.99, tags: ['cooperative', 'adventure', 'teamwork'], ageGroups: ['early_school', 'tween'] },
    { name: 'Word Game', description: 'Build words and score points in this classic word game', basePrice: 19.99, tags: ['words', 'spelling', 'vocabulary'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Video Game (Age Appropriate)', description: 'Popular video game suitable for the age group', basePrice: 49.99, tags: ['video game', 'digital', 'entertainment'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Dice Games Set', description: 'Collection of fun dice games for the whole family', basePrice: 16.99, tags: ['dice', 'luck', 'family'], ageGroups: ['preschool', 'early_school', 'tween'] },
  ],
  sports: [
    { name: 'Soccer Ball', description: 'Official size soccer ball for outdoor play', basePrice: 24.99, tags: ['soccer', 'ball', 'team sports'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Basketball Hoop', description: 'Adjustable height basketball hoop for driveway', basePrice: 89.99, tags: ['basketball', 'hoop', 'shooting'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Tennis Racket Set', description: 'Two rackets and balls for tennis or badminton', basePrice: 34.99, tags: ['tennis', 'racket', 'outdoor'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Skateboard', description: 'Beginner-friendly skateboard with safety gear', basePrice: 59.99, tags: ['skateboard', 'balance', 'tricks'], ageGroups: ['tween', 'teen'] },
    { name: 'Roller Skates', description: 'Adjustable roller skates that grow with your child', basePrice: 49.99, tags: ['skating', 'wheels', 'balance'], ageGroups: ['early_school', 'tween'] },
    { name: 'Baseball Glove and Ball', description: 'Quality leather glove with baseball', basePrice: 39.99, tags: ['baseball', 'catching', 'sports'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Jump Rope', description: 'Light-up jump rope with counter', basePrice: 14.99, tags: ['jump rope', 'cardio', 'exercise'], ageGroups: ['preschool', 'early_school', 'tween'] },
    { name: 'Golf Set for Kids', description: 'Sized-down golf clubs and practice balls', basePrice: 44.99, tags: ['golf', 'clubs', 'outdoor'], ageGroups: ['early_school', 'tween'] },
    { name: 'Scooter', description: 'Foldable kick scooter with light-up wheels', basePrice: 54.99, tags: ['scooter', 'riding', 'balance'], ageGroups: ['preschool', 'early_school', 'tween'] },
    { name: 'Swimming Goggles and Cap', description: 'Professional-quality swim gear for kids', basePrice: 19.99, tags: ['swimming', 'pool', 'water'], ageGroups: ['preschool', 'early_school', 'tween', 'teen'] },
  ],
  music: [
    { name: 'Acoustic Guitar', description: 'Half-size acoustic guitar perfect for beginners', basePrice: 79.99, tags: ['guitar', 'strings', 'acoustic'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Keyboard Piano', description: '61-key electronic keyboard with learning mode', basePrice: 99.99, tags: ['piano', 'keyboard', 'keys'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Drum Set', description: 'Junior drum set with sticks and practice pad', basePrice: 129.99, tags: ['drums', 'percussion', 'rhythm'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Ukulele', description: 'Colorful ukulele with songbook and picks', basePrice: 34.99, tags: ['ukulele', 'strings', 'hawaiian'], ageGroups: ['early_school', 'tween'] },
    { name: 'Recorder', description: 'Classic recorder instrument with learning book', basePrice: 12.99, tags: ['recorder', 'wind', 'beginner'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Xylophone', description: 'Colorful wooden xylophone with mallets', basePrice: 24.99, tags: ['xylophone', 'percussion', 'melody'], ageGroups: ['toddler', 'preschool'] },
    { name: 'Harmonica', description: 'Professional-quality harmonica with case', basePrice: 19.99, tags: ['harmonica', 'blues', 'portable'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Music Box Collection', description: 'Beautiful mechanical music boxes', basePrice: 29.99, tags: ['music box', 'collectible', 'melody'], ageGroups: ['preschool', 'early_school', 'tween'] },
    { name: 'Headphones', description: 'Volume-limiting headphones safe for kids', basePrice: 29.99, tags: ['headphones', 'listening', 'audio'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'DJ Mixer Toy', description: 'Electronic DJ mixer with sound effects', basePrice: 44.99, tags: ['dj', 'mixing', 'electronic'], ageGroups: ['tween', 'teen'] },
  ],
  building: [
    { name: 'LEGO Classic Set', description: 'Hundreds of colorful LEGO bricks for creative building', basePrice: 49.99, tags: ['lego', 'bricks', 'classic'], ageGroups: ['preschool', 'early_school', 'tween'] },
    { name: 'Magnetic Tiles', description: 'Magnetic building tiles for 3D constructions', basePrice: 59.99, tags: ['magnetic', 'tiles', 'stem'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Wooden Blocks Set', description: 'Classic wooden building blocks in various shapes', basePrice: 34.99, tags: ['wood', 'blocks', 'classic'], ageGroups: ['toddler', 'preschool'] },
    { name: 'K\'NEX Set', description: 'Build motorized models with rods and connectors', basePrice: 44.99, tags: ['knex', 'engineering', 'motors'], ageGroups: ['early_school', 'tween'] },
    { name: 'Model Car Kit', description: 'Detailed model car to assemble and display', basePrice: 29.99, tags: ['model', 'car', 'detailed'], ageGroups: ['tween', 'teen'] },
    { name: 'Train Set', description: 'Electric train set with track and accessories', basePrice: 79.99, tags: ['train', 'tracks', 'electric'], ageGroups: ['preschool', 'early_school', 'tween'] },
    { name: 'Marble Maze Builder', description: 'Build custom marble mazes and runs', basePrice: 39.99, tags: ['marble', 'maze', 'building'], ageGroups: ['early_school', 'tween'] },
    { name: 'Architecture Set', description: 'Build famous landmarks from around the world', basePrice: 54.99, tags: ['architecture', 'landmarks', 'detailed'], ageGroups: ['tween', 'teen'] },
    { name: 'Gears and Motors Kit', description: 'Learn engineering with gears and motors', basePrice: 49.99, tags: ['gears', 'motors', 'stem'], ageGroups: ['early_school', 'tween'] },
    { name: 'Fort Building Kit', description: 'Build indoor forts and hideouts', basePrice: 44.99, tags: ['fort', 'indoor', 'imagination'], ageGroups: ['preschool', 'early_school'] },
  ],
  dolls: [
    { name: 'Fashion Doll', description: 'Stylish doll with multiple outfit changes', basePrice: 24.99, tags: ['fashion', 'dress-up', 'style'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Baby Doll Set', description: 'Realistic baby doll with accessories', basePrice: 34.99, tags: ['baby', 'nurturing', 'pretend'], ageGroups: ['toddler', 'preschool', 'early_school'] },
    { name: 'Dollhouse', description: 'Wooden dollhouse with furniture and figures', basePrice: 89.99, tags: ['dollhouse', 'furniture', 'pretend'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Action Figure Set', description: 'Collectible action figures with accessories', basePrice: 29.99, tags: ['action', 'figures', 'collectible'], ageGroups: ['early_school', 'tween'] },
    { name: 'Stuffed Animal', description: 'Soft and cuddly stuffed animal friend', basePrice: 19.99, tags: ['plush', 'cuddly', 'comfort'], ageGroups: ['toddler', 'preschool', 'early_school'] },
    { name: 'Puppet Set', description: 'Hand puppets for storytelling and play', basePrice: 24.99, tags: ['puppets', 'storytelling', 'theater'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Paper Dolls', description: 'Vintage-style paper dolls with outfits', basePrice: 12.99, tags: ['paper', 'dress-up', 'vintage'], ageGroups: ['early_school', 'tween'] },
    { name: 'Character Plush', description: 'Plush toy of popular cartoon character', basePrice: 22.99, tags: ['character', 'plush', 'collectible'], ageGroups: ['toddler', 'preschool', 'early_school'] },
    { name: 'Doll Clothes Set', description: 'Extra outfits for fashion dolls', basePrice: 16.99, tags: ['clothes', 'accessories', 'fashion'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Collectible Figures', description: 'Blind box collectible mini figures', basePrice: 9.99, tags: ['collectible', 'surprise', 'mini'], ageGroups: ['early_school', 'tween'] },
  ],
  vehicles: [
    { name: 'Remote Control Car', description: 'Fast RC car with rechargeable battery', basePrice: 49.99, tags: ['rc', 'car', 'remote'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Toy Train Set', description: 'Classic toy train with tracks and station', basePrice: 39.99, tags: ['train', 'tracks', 'classic'], ageGroups: ['toddler', 'preschool', 'early_school'] },
    { name: 'Monster Truck', description: 'Big wheels monster truck with suspension', basePrice: 24.99, tags: ['truck', 'monster', 'big wheels'], ageGroups: ['toddler', 'preschool', 'early_school'] },
    { name: 'Airplane Model', description: 'Die-cast airplane with moving parts', basePrice: 19.99, tags: ['airplane', 'flying', 'model'], ageGroups: ['early_school', 'tween'] },
    { name: 'Fire Truck', description: 'Realistic fire truck with lights and sounds', basePrice: 34.99, tags: ['fire', 'emergency', 'lights'], ageGroups: ['toddler', 'preschool'] },
    { name: 'Construction Vehicles Set', description: 'Excavator, dump truck, and crane set', basePrice: 44.99, tags: ['construction', 'digging', 'building'], ageGroups: ['toddler', 'preschool', 'early_school'] },
    { name: 'Race Track Set', description: 'Electric race track with two cars', basePrice: 59.99, tags: ['racing', 'track', 'speed'], ageGroups: ['early_school', 'tween'] },
    { name: 'Boat Toy', description: 'Battery-powered boat for pool or tub', basePrice: 22.99, tags: ['boat', 'water', 'floating'], ageGroups: ['toddler', 'preschool', 'early_school'] },
    { name: 'Helicopter', description: 'RC helicopter with stable flight control', basePrice: 44.99, tags: ['helicopter', 'flying', 'rc'], ageGroups: ['tween', 'teen'] },
    { name: 'Hot Wheels Collection', description: 'Set of collectible die-cast cars', basePrice: 19.99, tags: ['cars', 'collectible', 'die-cast'], ageGroups: ['preschool', 'early_school', 'tween'] },
  ],
  animals: [
    { name: 'Pet Care Play Set', description: 'Pretend veterinarian kit with stuffed animals', basePrice: 34.99, tags: ['vet', 'pets', 'pretend'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Dinosaur Figures', description: 'Realistic dinosaur figures set', basePrice: 29.99, tags: ['dinosaurs', 'prehistoric', 'figures'], ageGroups: ['preschool', 'early_school', 'tween'] },
    { name: 'Ocean Animals Set', description: 'Sea creatures for bath or play', basePrice: 22.99, tags: ['ocean', 'sea', 'animals'], ageGroups: ['toddler', 'preschool', 'early_school'] },
    { name: 'Farm Animals Set', description: 'Barn and farm animals playset', basePrice: 39.99, tags: ['farm', 'barn', 'animals'], ageGroups: ['toddler', 'preschool'] },
    { name: 'Safari Animals', description: 'African safari animal figures', basePrice: 27.99, tags: ['safari', 'wild', 'africa'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Butterfly Garden Kit', description: 'Grow and release real butterflies', basePrice: 29.99, tags: ['butterflies', 'nature', 'growing'], ageGroups: ['early_school', 'tween'] },
    { name: 'Ant Farm', description: 'Watch ants build tunnels in this habitat', basePrice: 24.99, tags: ['ants', 'insects', 'observation'], ageGroups: ['early_school', 'tween'] },
    { name: 'Bird Feeder Kit', description: 'Build and decorate your own bird feeder', basePrice: 19.99, tags: ['birds', 'nature', 'crafts'], ageGroups: ['early_school', 'tween'] },
    { name: 'Horse Stable Set', description: 'Toy horses with stable and accessories', basePrice: 44.99, tags: ['horses', 'stable', 'pretend'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Interactive Pet Toy', description: 'Electronic pet that responds to touch', basePrice: 54.99, tags: ['electronic', 'pet', 'interactive'], ageGroups: ['preschool', 'early_school', 'tween'] },
  ],
  science: [
    { name: 'Volcano Kit', description: 'Build an erupting volcano with safe chemicals', basePrice: 19.99, tags: ['volcano', 'experiment', 'geology'], ageGroups: ['early_school', 'tween'] },
    { name: 'Telescope', description: 'Beginner telescope for stargazing', basePrice: 69.99, tags: ['telescope', 'stars', 'astronomy'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Crystal Growing Kit', description: 'Grow your own colorful crystals', basePrice: 16.99, tags: ['crystals', 'growing', 'science'], ageGroups: ['early_school', 'tween'] },
    { name: 'Robot Building Kit', description: 'Build and program your own robot', basePrice: 89.99, tags: ['robot', 'coding', 'engineering'], ageGroups: ['tween', 'teen'] },
    { name: 'Weather Station', description: 'Track weather with thermometer and rain gauge', basePrice: 34.99, tags: ['weather', 'meteorology', 'observation'], ageGroups: ['early_school', 'tween'] },
    { name: 'Fossil Dig Kit', description: 'Excavate real fossils from a plaster block', basePrice: 24.99, tags: ['fossils', 'digging', 'paleontology'], ageGroups: ['early_school', 'tween'] },
    { name: 'Slime Lab', description: 'Make different types of slime safely', basePrice: 22.99, tags: ['slime', 'sensory', 'chemistry'], ageGroups: ['early_school', 'tween'] },
    { name: 'Magnet Experiment Set', description: 'Learn about magnetism with fun experiments', basePrice: 27.99, tags: ['magnets', 'physics', 'experiments'], ageGroups: ['early_school', 'tween'] },
    { name: 'DNA Model Kit', description: 'Build a model of the DNA double helix', basePrice: 19.99, tags: ['dna', 'biology', 'model'], ageGroups: ['tween', 'teen'] },
    { name: 'Solar Panel Kit', description: 'Build solar-powered gadgets', basePrice: 44.99, tags: ['solar', 'renewable', 'engineering'], ageGroups: ['tween', 'teen'] },
  ],
  art: [
    { name: 'Watercolor Paint Set', description: 'Professional watercolor paints with brushes', basePrice: 29.99, tags: ['watercolor', 'painting', 'art'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Canvas and Easel', description: 'Tabletop easel with canvas set', basePrice: 39.99, tags: ['canvas', 'easel', 'painting'], ageGroups: ['early_school', 'tween', 'teen'] },
    { name: 'Clay Modeling Kit', description: 'Air-dry clay with tools and colors', basePrice: 24.99, tags: ['clay', 'sculpting', '3d'], ageGroups: ['preschool', 'early_school', 'tween'] },
    { name: 'Pastel Chalk Set', description: 'Soft pastels for drawing and blending', basePrice: 22.99, tags: ['pastels', 'chalk', 'drawing'], ageGroups: ['tween', 'teen'] },
    { name: 'Scratch Art Paper', description: 'Rainbow scratch art sheets with stylus', basePrice: 14.99, tags: ['scratch', 'colorful', 'easy'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Acrylic Paint Set', description: 'Vibrant acrylic paints for canvas or crafts', basePrice: 34.99, tags: ['acrylic', 'painting', 'vibrant'], ageGroups: ['tween', 'teen'] },
    { name: 'Drawing Mannequin', description: 'Wooden figure for drawing poses', basePrice: 16.99, tags: ['drawing', 'poses', 'figure'], ageGroups: ['tween', 'teen'] },
    { name: 'Stencil Collection', description: 'Various stencils for art projects', basePrice: 12.99, tags: ['stencils', 'tracing', 'shapes'], ageGroups: ['preschool', 'early_school'] },
    { name: 'Rock Painting Kit', description: 'Paint and decorate smooth rocks', basePrice: 18.99, tags: ['rocks', 'painting', 'outdoor'], ageGroups: ['early_school', 'tween'] },
    { name: 'Spray Paint Art Set', description: 'Safe spray paint markers for teens', basePrice: 44.99, tags: ['spray', 'street art', 'bold'], ageGroups: ['teen'] },
  ],
};

// Price adjustments by budget tier
const priceMultipliers = {
  budget: 0.6,
  moderate: 1.0,
  premium: 1.8,
};

// Generate variations of each gift
function generateGiftVariations() {
  const gifts: Array<{
    name: string;
    description: string;
    category: string;
    ageGroups: string[];
    priceRange: 'budget' | 'moderate' | 'premium';
    price: string;
    imageUrl: string;
    tags: string[];
  }> = [];

  const budgetTiers: Array<'budget' | 'moderate' | 'premium'> = ['budget', 'moderate', 'premium'];
  const variations = ['', 'Deluxe ', 'Mini ', 'Pro ', 'Ultimate '];

  for (const [category, templates] of Object.entries(giftTemplates)) {
    for (const template of templates) {
      // Create variations for each budget tier
      for (const tier of budgetTiers) {
        const variation = variations[Math.floor(Math.random() * variations.length)];
        const adjustedPrice = Number((template.basePrice * priceMultipliers[tier]).toFixed(2));

        // Filter age groups based on tier (premium tends to be for older kids)
        let ageGroups = template.ageGroups;
        if (tier === 'premium' && ageGroups.includes('toddler')) {
          ageGroups = ageGroups.filter(ag => ag !== 'toddler');
        }
        if (ageGroups.length === 0) ageGroups = template.ageGroups;

        const name = `${variation}${template.name}${tier === 'premium' ? ' Premium' : tier === 'budget' ? ' Basic' : ''}`.trim();

        gifts.push({
          name,
          description: template.description,
          category,
          ageGroups,
          priceRange: tier,
          price: adjustedPrice.toFixed(2),
          imageUrl: getGiftImageUrl(category, template.name),
          tags: [...template.tags, tier],
        });
      }
    }
  }

  // Add some extra unique items to reach ~500
  const extraItems = [
    { name: 'Rainbow Stacking Rings', category: 'educational', description: 'Classic stacking toy for developing motor skills', price: 14.99, ageGroups: ['toddler'], tags: ['stacking', 'colors', 'motor skills'] },
    { name: 'Shape Sorter', category: 'educational', description: 'Learn shapes and colors with this sorting cube', price: 19.99, ageGroups: ['toddler', 'preschool'], tags: ['shapes', 'sorting', 'learning'] },
    { name: 'Balance Bike', category: 'sports', description: 'Learn to balance before pedaling', price: 79.99, ageGroups: ['toddler', 'preschool'], tags: ['bike', 'balance', 'outdoor'] },
    { name: 'Finger Paints', category: 'art', description: 'Non-toxic washable finger paints', price: 12.99, ageGroups: ['toddler', 'preschool'], tags: ['paint', 'sensory', 'messy'] },
    { name: 'Musical Walker', category: 'music', description: 'Push walker with musical buttons', price: 44.99, ageGroups: ['toddler'], tags: ['walker', 'music', 'movement'] },
    { name: 'Coding Caterpillar', category: 'tech', description: 'Intro to coding for preschoolers', price: 49.99, ageGroups: ['preschool'], tags: ['coding', 'sequencing', 'stem'] },
    { name: 'Mega Blocks', category: 'building', description: 'Large building blocks for little hands', price: 29.99, ageGroups: ['toddler', 'preschool'], tags: ['blocks', 'big', 'building'] },
    { name: 'Touch and Feel Books', category: 'books', description: 'Sensory books with different textures', price: 9.99, ageGroups: ['toddler'], tags: ['sensory', 'textures', 'baby'] },
    { name: 'Ball Pit Balls', category: 'outdoor', description: 'Colorful plastic balls for ball pit', price: 24.99, ageGroups: ['toddler', 'preschool'], tags: ['balls', 'sensory', 'play'] },
    { name: 'Pop-Up Tunnel', category: 'outdoor', description: 'Crawl through play tunnel', price: 29.99, ageGroups: ['toddler', 'preschool'], tags: ['tunnel', 'crawling', 'active'] },
  ];

  // Add extra items in all budget tiers
  for (const item of extraItems) {
    for (const tier of budgetTiers) {
      const adjustedPrice = (item.price * priceMultipliers[tier]).toFixed(2);
      gifts.push({
        name: tier === 'premium' ? `${item.name} Deluxe` : tier === 'budget' ? `${item.name} Basic` : item.name,
        description: item.description,
        category: item.category,
        ageGroups: item.ageGroups,
        priceRange: tier,
        price: adjustedPrice,
        imageUrl: getGiftImageUrl(item.category, item.name),
        tags: [...item.tags, tier],
      });
    }
  }

  return gifts;
}

export async function seedGiftInventory() {
  console.log('Generating gift inventory...');
  const gifts = generateGiftVariations();
  console.log(`Generated ${gifts.length} gifts`);

  // Clear existing inventory
  console.log('Clearing existing inventory...');
  await db.delete(giftInventory);

  // Insert in batches
  const batchSize = 50;
  for (let i = 0; i < gifts.length; i += batchSize) {
    const batch = gifts.slice(i, i + batchSize);
    await db.insert(giftInventory).values(batch);
    console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(gifts.length / batchSize)}`);
  }

  console.log(`Successfully seeded ${gifts.length} gifts!`);
  return gifts.length;
}

// Run if called directly
if (require.main === module) {
  seedGiftInventory()
    .then((count) => {
      console.log(`Done! Seeded ${count} gifts.`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}

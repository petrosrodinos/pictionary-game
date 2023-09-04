export const PLAYERS_IN_ROOM = 2;
export const MAX_PLAYERS_IN_ROOM = 10;
export const MIN_PLAYERS_IN_ROOM = 2;
export const ROUND_TIME_IN_SECONDS = 20000;
export const MAX_ROUND_TIME_IN_SECONDS = 120000;
export const MIN_ROUND_TIME_IN_SECONDS = 30;
export const CHOOSING_WORD_TIME_IN_SECONDS = 10;
export const MAX_CHOOSING_WORD_TIME_IN_SECONDS = 30;
export const MIN_CHOOSING_WORD_TIME_IN_SECONDS = 5;

export const STARTING_TIME_IN_SECONDS = 2;

export const POINTS_PER_LEVEL = 100;

export const MAX_LEVEL = 99;

export const SELECTABLE_WORDS_LIST_LENGTH = 5;

export const Difficalty = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

export const PalletColors = [
  "#000",
  "#fff",
  "#f00",
  "#0f0",
  "#00f",
  "#ff0",
  "#0ff",
  "#c0c0c0",
  "#800000",
  "#008000",
  "#800080",
];

export const BrushSizes = [5, 7, 9, 11, 13];

export const WORD_LIST: any = {
  space: {
    easy: ["astronaut", "alien", "spaceship", "planet", "stars", "moon", "comet", "galaxy"],
    medium: ["satellite", "telescope", "meteor", "black hole", "solar system", "nebula"],

    hard: ["sun", "asteroid", "orbit", "gravity", "space station"],
  },
  animals: {
    easy: ["dog", "cat", "bird", "fish", "snake", "turtle", "rabbit", "hamster", "elephant"],
    medium: ["lion", "giraffe", "kangaroo", "hippopotamus", "cheetah", "whale", "octopus"],
    hard: ["zebra", "penguin", "frog", "crocodile"],
  },
  food: {
    easy: ["apple", "banana", "orange", "pear", "strawberry", "watermelon"],
    medium: ["pizza", "burger", "ice cream", "cake", "spaghetti", "chocolate", "bread", "cheese"],

    hard: ["chicken", "steak", "pancakes", "fries", "donut", "sushi"],
  },
  sports: {
    easy: [
      "basketball",
      "football",
      "soccer",
      "baseball",
      "tennis",
      "golf",
      "volleyball",
      "swimming",
    ],
    medium: ["boxing", "badminton", "hockey", "rugby", "cricket", "skiing"],
    hard: ["snowboarding", "table tennis", "archery", "cycling", "marathon", "gymnastics"],
  },
  transport: {
    easy: ["car", "bus", "train", "bicycle", "helicopter", "plane", "boat", "motorcycle", "truck"],
    medium: ["scooter", "tram", "ferry"],
    hard: ["tank", "jetski", "roller skates", "skateboard", "parachute"],
  },
  nature: {
    easy: [
      "tree",
      "flower",
      "river",
      "mountain",
      "forest",
      "beach",
      "lake",
      "desert",
      "rainbow",
      "waterfall",
    ],
    medium: ["cave", "volcano", "island", "cloud", "sunrise"],
    hard: ["sunset", "snowflake", "hurricane", "ocean"],
  },
  toys: {
    easy: ["teddy bear", "doll", "lego", "puzzle", "robot", "kite", "ball", "yo-yo"],
    medium: ["board game", "jigsaw", "trampoline", "frisbee"],
    hard: ["slime", "marbles", "dollhouse", "stuffed animal"],
  },
  jobs: {
    easy: [
      "teacher",
      "doctor",
      "firefighter",
      "police",
      "chef",
      "farmer",
      "dentist",
      "nurse",
      "pilot",
    ],
    medium: ["lawyer", "engineer", "singer", "actor", "mechanic", "scientist", "architect"],
    hard: ["writer", "plumber", "soldier"],
  },
  buildings: {
    easy: ["house", "school", "hospital", "museum", "library", "zoo", "stadium"],
    medium: ["skyscraper", "bridge", "castle", "church", "prison"],
    hard: ["factory", "farm", "lighthouse", "windmill", "tower", "market", "hotel", "temple"],
  },
  clothes: {
    easy: ["shirt", "pants", "hat", "dress", "shoes", "gloves"],
    medium: ["scarf", "jacket", "sunglasses", "socks", "sweater", "boots", "tie", "shorts"],
    hard: ["skirt", "belt", "jeans", "t-shirt", "swimsuit", "nightgown"],
  },
};

export const CATEGORIES = Object.keys(WORD_LIST);

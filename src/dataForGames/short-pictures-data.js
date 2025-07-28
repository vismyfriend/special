const shortPicturesData = {
  testQuicklyData: [
    // Изображение
    {
      taskPicture: new URL("../assets/images/testPic1.png", import.meta.url).href,
      eng: "horse",
      rus: "лошадь"
    },
    // Эмодзи
    {
      taskPicture: "🐱",
      eng: "cat",
      rus: "кот"
    },
    // Текст
    {
      taskPicture: "A baby dog",
      eng: "puppy",
      rus: "щенок"
    },
    // Квиз-вопрос
    {
      taskPicture: "What do you call a baby cat?",
      eng: "kitten",
      rus: "котёнок"
    },
    // мультивыбор
    {
      taskPicture: new URL("../assets/images/testPic1.png", import.meta.url).href,
      eng: null,
      rus: null,
      multipleChoice: "in, on, under*, above"
    },
    {
      taskPicture: new URL("../assets/images/testPic1.png", import.meta.url).href,
      eng: "kitten",
      rus: "котёнок",
      multipleChoice: "in, on, under*, above"
    },
    {
      taskPicture: "Where is the cat?", // или URL изображения
      eng: null,
      rus: null,
      multipleChoice: "in*, on*, under, above, nowhere"
    },
    {
      taskPicture: "Where is the cat?", // или URL изображения
      eng: "kitten",
      rus: "котёнок",
      multipleChoice: "in*, on*, under, above"
    }
  ],
  superJob1: [
    // Изображение
    {
      taskPicture: new URL("../assets/images/testPic1.png", import.meta.url).href,
      eng: "kitten",
      rus: "котёнок",
      multipleChoice: "A horse reads books, A horse doesn't read books, Does a horse read books?, Why does a horse read books?"
    },
    // Эмодзи
    {
      taskPicture: "🐱",
      eng: "cat",
      rus: "кот"
    },
    // Текст
    {
      taskPicture: "A baby dog",
      eng: "puppy",
      rus: "щенок"
    },
    // Квиз-вопрос
    {
      taskPicture: "What do you call a baby cat?",
      eng: "kitten",
      rus: "котёнок"
    },
    // мультивыбор
    {
      taskPicture: new URL("../assets/images/testPic1.png", import.meta.url).href,
      eng: null,
      rus: null,
      multipleChoice: "in, on, under*, above"
    },
    {
      taskPicture: new URL("../assets/images/testPic1.png", import.meta.url).href,
      eng: "kitten",
      rus: "котёнок",
      multipleChoice: "in, on, under*, above"
    },
    {
      taskPicture: "Where is the cat?", // или URL изображения
      eng: null,
      rus: null,
      multipleChoice: "in*, on*, under, above, nowhere"
    },
    {
      taskPicture: "Where is the cat?", // или URL изображения
      eng: "kitten",
      rus: "котёнок",
      multipleChoice: "in*, on*, under, above"
    }
  ],
  animalsEmoji: [
    // Домашние животные
    {
      taskPicture: "🐱",
      eng: "a cat",
      rus: "кошка"
    },
    {
      taskPicture: "🐶",
      eng: "a dog",
      rus: "собака"
    },
    {
      taskPicture: "🐭",
      eng: "a mouse",
      rus: "мышь"
    },
    {
      taskPicture: "🐹",
      eng: "a hamster",
      rus: "хомяк"
    },
    {
      taskPicture: "🐰",
      eng: "a rabbit",
      rus: "кролик"
    },
    {
      taskPicture: "🦊",
      eng: "a fox",
      rus: "лиса"
    },
    {
      taskPicture: "🐻",
      eng: "a bear",
      rus: "медведь"
    },
    {
      taskPicture: "🐼",
      eng: "a panda",
      rus: "панда"
    },
    {
      taskPicture: "🐨",
      eng: "a koala",
      rus: "коала"
    },

    // Дикие животные
    {
      taskPicture: "🦁",
      eng: "a lion",
      rus: "лев"
    },
    {
      taskPicture: "🐯",
      eng: "a tiger",
      rus: "тигр"
    },
    {
      taskPicture: "🐮",
      eng: "a cow",
      rus: "корова"
    },
    {
      taskPicture: "🐷",
      eng: "a pig",
      rus: "свинья"
    },
    {
      taskPicture: "🐸",
      eng: "a frog",
      rus: "лягушка"
    },
    {
      taskPicture: "🐵",
      eng: "a monkey",
      rus: "обезьяна"
    },
    {
      taskPicture: "🦍",
      eng: "a gorilla",
      rus: "горилла"
    },
    {
      taskPicture: "🐔",
      eng: "a chicken",
      rus: "курица"
    },
    {
      taskPicture: "🐣",
      eng: "a chick",
      rus: "цыплёнок"
    },
    {
      taskPicture: "🐥",
      eng: "a front-facing chick",
      rus: "цыплёнок (анфас)"
    },
    {
      taskPicture: "🐦",
      eng: "a bird",
      rus: "птица"
    },
    {
      taskPicture: "🐧",
      eng: "a penguin",
      rus: "пингвин"
    },
    {
      taskPicture: "🦅",
      eng: "an eagle",
      rus: "орёл"
    },
    {
      taskPicture: "🦉",
      eng: "an owl",
      rus: "сова"
    },
    {
      taskPicture: "🦇",
      eng: "a bat",
      rus: "летучая мышь"
    },
    {
      taskPicture: "🐺",
      eng: "a wolf",
      rus: "волк"
    },
    {
      taskPicture: "🐗",
      eng: "a boar",
      rus: "кабан"
    },
    {
      taskPicture: "🐴",
      eng: "a horse",
      rus: "лошадь"
    },
    {
      taskPicture: "🦄",
      eng: "a unicorn",
      rus: "единорог"
    },
    {
      taskPicture: "🐝",
      eng: "a bee",
      rus: "пчела"
    },
    {
      taskPicture: "🐛",
      eng: "a bug",
      rus: "жук"
    },
    {
      taskPicture: "🦋",
      eng: "a butterfly",
      rus: "бабочка"
    },
    {
      taskPicture: "🐌",
      eng: "a snail",
      rus: "улитка"
    },
    {
      taskPicture: "🐞",
      eng: "a ladybug",
      rus: "божья коровка"
    },
    {
      taskPicture: "🐜",
      eng: "an ant",
      rus: "муравей"
    },
    {
      taskPicture: "🦗",
      eng: "a cricket",
      rus: "сверчок"
    },
    {
      taskPicture: "🕷️",
      eng: "a spider",
      rus: "паук"
    },
    {
      taskPicture: "🦂",
      eng: "a scorpion",
      rus: "скорпион"
    },

    // Морские животные
    {
      taskPicture: "🐳",
      eng: "a whale",
      rus: "кит"
    },
    {
      taskPicture: "🐬",
      eng: "a dolphin",
      rus: "дельфин"
    },
    {
      taskPicture: "🦈",
      eng: "a shark",
      rus: "акула"
    },
    {
      taskPicture: "🐟",
      eng: "a fish",
      rus: "рыба"
    },
    {
      taskPicture: "🐠",
      eng: "a tropical fish",
      rus: "тропическая рыба"
    },
    {
      taskPicture: "🐡",
      eng: "a blowfish",
      rus: "рыба-шар"
    },
    {
      taskPicture: "🦀",
      eng: "a crab",
      rus: "краб"
    },
    {
      taskPicture: "🐙",
      eng: "an octopus",
      rus: "осьминог"
    },
    {
      taskPicture: "🦑",
      eng: "a squid",
      rus: "кальмар"
    },
    {
      taskPicture: "🦐",
      eng: "a shrimp",
      rus: "креветка"
    },
    {
      taskPicture: "🦞",
      eng: "a lobster",
      rus: "омар"
    },
    {
      taskPicture: "🦭",
      eng: "a seal",
      rus: "тюлень"
    },

    // Экзотические животные
    {
      taskPicture: "🐊",
      eng: "a crocodile",
      rus: "крокодил"
    },
    {
      taskPicture: "🐢",
      eng: "a turtle",
      rus: "черепаха"
    },
    {
      taskPicture: "🦎",
      eng: "a lizard",
      rus: "ящерица"
    },
    {
      taskPicture: "🐍",
      eng: "a snake",
      rus: "змея"
    },
    {
      taskPicture: "🦖",
      eng: "a T-Rex",
      rus: "тираннозавр"
    },
    {
      taskPicture: "🦕",
      eng: "a sauropod",
      rus: "зауропод"
    },
    {
      taskPicture: "🐘",
      eng: "an elephant",
      rus: "слон"
    },
    {
      taskPicture: "🦣",
      eng: "a mammoth",
      rus: "мамонт"
    },
    {
      taskPicture: "🦏",
      eng: "a rhinoceros",
      rus: "носорог"
    },
    {
      taskPicture: "🦛",
      eng: "a hippopotamus",
      rus: "бегемот"
    },
    {
      taskPicture: "🐪",
      eng: "a camel",
      rus: "верблюд"
    },
    {
      taskPicture: "🐫",
      eng: "a two-hump camel",
      rus: "двугорбый верблюд"
    },
    {
      taskPicture: "🦒",
      eng: "a giraffe",
      rus: "жираф"
    },
    {
      taskPicture: "🦘",
      eng: "a kangaroo",
      rus: "кенгуру"
    },
    {
      taskPicture: "🦥",
      eng: "a sloth",
      rus: "ленивец"
    },
    {
      taskPicture: "🦦",
      eng: "an otter",
      rus: "выдра"
    },
    {
      taskPicture: "🦨",
      eng: "a skunk",
      rus: "скунс"
    },
    {
      taskPicture: "🦡",
      eng: "a badger",
      rus: "барсук"
    },
    {
      taskPicture: "🐾",
      eng: "paw prints",
      rus: "следы лап"
    },

    // Другие животные
    {
      taskPicture: "🦃",
      eng: "a turkey",
      rus: "индейка"
    },
    {
      taskPicture: "🦚",
      eng: "a peacock",
      rus: "павлин"
    },
    {
      taskPicture: "🦜",
      eng: "a parrot",
      rus: "попугай"
    },
    {
      taskPicture: "🦩",
      eng: "a flamingo",
      rus: "фламинго"
    },
    {
      taskPicture: "🦢",
      eng: "a swan",
      rus: "лебедь"
    },
    {
      taskPicture: "🦤",
      eng: "a dodo",
      rus: "додо"
    },
    {
      taskPicture: "🪶",
      eng: "a feather",
      rus: "перо"
    },
    {
      taskPicture: "🦔",
      eng: "a hedgehog",
      rus: "ёж"
    },
    {
      taskPicture: "🐇",
      eng: "a rabbit",
      rus: "кролик"
    },
    {
      taskPicture: "🐿️",
      eng: "a chipmunk",
      rus: "бурундук"
    },
    {
      taskPicture: "🦝",
      eng: "a raccoon",
      rus: "енот"
    },
    {
      taskPicture: "🦙",
      eng: "a llama",
      rus: "лама"
    },
    {
      taskPicture: "🦌",
      eng: "a deer",
      rus: "олень"
    },
    {
      taskPicture: "🦬",
      eng: "a bison",
      rus: "бизон"
    },
    {
      taskPicture: "🐂",
      eng: "an ox",
      rus: "бык"
    },
    {
      taskPicture: "🐃",
      eng: "a water buffalo",
      rus: "буйвол"
    },
    {
      taskPicture: "🐄",
      eng: "a cow",
      rus: "корова"
    },
    {
      taskPicture: "🐖",
      eng: "a pig",
      rus: "свинья"
    },
    {
      taskPicture: "🐏",
      eng: "a ram",
      rus: "баран"
    },
    {
      taskPicture: "🐑",
      eng: "a ewe",
      rus: "овца"
    },
    {
      taskPicture: "🐐",
      eng: "a goat",
      rus: "коза"
    },
    {
      taskPicture: "🐕",
      eng: "a dog",
      rus: "собака"
    },
    {
      taskPicture: "🐩",
      eng: "a poodle",
      rus: "пудель"
    },
    {
      taskPicture: "🐕‍🦺",
      eng: "a service dog",
      rus: "служебная собака"
    },
    {
      taskPicture: "🐈",
      eng: "a cat",
      rus: "кошка"
    },
    {
      taskPicture: "🐈‍⬛",
      eng: "a black cat",
      rus: "чёрная кошка"
    }
  ],
}

export default shortPicturesData;

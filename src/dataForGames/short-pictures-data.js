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
  pronounsA0pics: [
    {
      taskPicture: new URL("../assets/images/testPic1 copy.png", import.meta.url).href,
      eng: "you",
      rus: "ты и вы"
    },
    {
      taskPicture: "🐈🐈‍⬛",
      eng: "they are cats",
      rus: "они кошки"
    },
    {
      taskPicture: "🐈‍⬛",
      eng: "it is a black cat",
      rus: "это черная кошка"
    },
    {
      taskPicture: "🐩🐶",
      eng: "they are dogs",
      rus: "они собаки"
    },
    {
      taskPicture: "🐈",
      eng: "it is a cat",
      rus: "это кошка"
    },
    {
      taskPicture: "💀",
      eng: "it is a skeleton",
      rus: "это скелет"
    },
    {
      taskPicture: "🦮🐕‍🦺🐩🐶",
      eng: "they are dogs",
      rus: "они собаки"
    },
    {
      taskPicture: "📚📖📕",
      eng: "they are books",
      rus: "книги = они"
    },
    {
      taskPicture: "📕",
      eng: "it is a red book",
      rus: "это красная книга"
    },
    {
      taskPicture: "👫👭👬",
      eng: "they are people",
      rus: "они люди"
    },
    {
      taskPicture: "📘",
      eng: "it is a blue book",
      rus: "это книга"
    },
    {
      taskPicture: "🍎",
      eng: "it is an apple",
      rus: "это яблоко"
    },

    {
      taskPicture: "👨",
      eng: "he is a man",
      rus: "он мужчина"
    },
    {
      taskPicture: "👨‍⚕️",
      eng: "he is a doctor",
      rus: "он врач"
    },
    {
      taskPicture: "👦",
      eng: "he is a boy",
      rus: "он мальчик"
    },
    {
      taskPicture: "👨‍🍳",
      eng: "he is a cook",
      rus: "это повар"
    },
    {
      taskPicture: "👩",
      eng: "she is a woman",
      rus: "она женщина"
    },
    {
      taskPicture: "👩‍⚕️",
      eng: "she is a doctor",
      rus: "она доктор"
    },
    {
      taskPicture: "👧",
      eng: "she is a girl",
      rus: "она девочка"
    },
    {
      taskPicture: "👩‍🍳",
      eng: "She is a cook",
      rus: "она повар"
    },
    {
      taskPicture: "👶",
      eng: "it is a baby",
      rus: "это младенец"
    },
    // Единственное число (he/she)
    {
      taskPicture: "👨‍⚕️",
      eng: "He is a doctor",
      rus: "Он доктор"
    },
    {
      taskPicture: "👩‍⚕️",
      eng: "She is a doctor",
      rus: "Она доктор"
    },
    {
      taskPicture: "👨‍🍳",
      eng: "He is a cook",
      rus: "Он повар"
    },
    {
      taskPicture: "👩‍🍳",
      eng: "She is a cook",
      rus: "Она повар"
    },
    {
      taskPicture: "👨‍🎓",
      eng: "He is a student",
      rus: "Он студент"
    },
    {
      taskPicture: "👩‍🎓",
      eng: "She is a student",
      rus: "Она студентка"
    },
    {
      taskPicture: "👨‍🏫",
      eng: "He is a teacher",
      rus: "Он учитель"
    },
    {
      taskPicture: "👩‍🏫",
      eng: "She is a teacher",
      rus: "Она учительница"
    },
    {
      taskPicture: "👨‍🎤",
      eng: "He is a singer",
      rus: "Он певец"
    },
    {
      taskPicture: "👩‍🎤",
      eng: "She is a singer",
      rus: "Она певица"
    },
    {
      taskPicture: "🕺",
      eng: "He is a dancer",
      rus: "Он танцор"
    },
    {
      taskPicture: "💃",
      eng: "She is a dancer",
      rus: "Она танцовщица"
    },

    // Множественное число (they)
    {
      taskPicture: "👨‍⚕️👩‍⚕️",
      eng: "They are doctors",
      rus: "Они доктора"
    },
    {
      taskPicture: "👨‍🍳👩‍🍳",
      eng: "They are cooks",
      rus: "Они повара"
    },
    {
      taskPicture: "👨‍🎓👩‍🎓",
      eng: "They are students",
      rus: "Они студенты"
    },
    {
      taskPicture: "👨‍🏫👩‍🏫",
      eng: "They are teachers",
      rus: "Они учителя"
    },
    {
      taskPicture: "🕺💃",
      eng: "They are dancers",
      rus: "Они танцоры"
    },
    {
      taskPicture: "👨‍🎤👩‍🎤",
      eng: "They are singers",
      rus: "Они певцы"
    },

    // Гендерно-нейтральные примеры (акцент на they)
    {
      taskPicture: "👨‍💻👩‍💻",
      eng: "They are programmers",
      rus: "Они программисты"
    },
    {
      taskPicture: "👨‍🔧👩‍🔧",
      eng: "They are mechanics",
      rus: "Они механики"
    },
    {
      taskPicture: "👨‍🚀👩‍🚀",
      eng: "They are astronauts",
      rus: "Они космонавты"
    },
    // Популярные животные (it/they)
    {
      taskPicture: "🐘",
      eng: "It is an elephant",
      rus: "Это слон"
    },
    {
      taskPicture: "🐘🐘",
      eng: "They are elephants",
      rus: "Это слоны"
    },
    {
      taskPicture: "🦒",
      eng: "It is a giraffe",
      rus: "Это жираф"
    },
    {
      taskPicture: "🐼",
      eng: "It is a panda",
      rus: "Это панда"
    },
    {
      taskPicture: "🦁",
      eng: "It is a lion",
      rus: "Это лев"
    },
    {
      taskPicture: "🐯",
      eng: "It is a tiger",
      rus: "Это тигр"
    },
    {
      taskPicture: "🐻",
      eng: "It is a bear",
      rus: "Это медведь"
    },
    {
      taskPicture: "🐰",
      eng: "It is a rabbit",
      rus: "Это кролик"
    },
    {
      taskPicture: "🐦",
      eng: "It is a bird",
      rus: "Это птица"
    },
    {
      taskPicture: "🐠",
      eng: "It is a fish",
      rus: "Это рыба"
    },

    // Еда (it/they)
    {
      taskPicture: "🍏🍎",
      eng: "They are apples",
      rus: "Это яблоки"
    },
    {
      taskPicture: "🍌",
      eng: "It is a banana",
      rus: "Это банан"
    },
    {
      taskPicture: "🍕",
      eng: "It is a pizza",
      rus: "Это пицца"
    },
    {
      taskPicture: "🍔",
      eng: "It is a burger",
      rus: "Это бургер"
    },
    {
      taskPicture: "🍟",
      eng: "They are fries",
      rus: "Это картошка фри"
    },
    {
      taskPicture: "🍩",
      eng: "It is a donut",
      rus: "Это пончик"
    },
    {
      taskPicture: "🍪",
      eng: "It is a cookie",
      rus: "Это печенье"
    },
    {
      taskPicture: "🍦",
      eng: "It is an ice cream",
      rus: "Это мороженое"
    },
    {
      taskPicture: "🍫",
      eng: "It is chocolate",
      rus: "Это шоколад"
    },
    {
      taskPicture: "🍓",
      eng: "It is a strawberry",
      rus: "Это клубника"
    },
  ],
  pronounsA0quiz1: [
    {
      taskPicture: "You and I",
      eng: "We = You + I",
      rus: "Мы = ты + я"
    },
    {
      taskPicture: "Он и она = ?",
      multipleChoice: "we, he, they*, it"
    },
  ],
  speaking1: [
    // Комбинированные эмодзи (they)
    {
      taskPicture: "🦮 + 🐈",
      eng: "The dog and cat are friends",
      rus: "Собака и кошка - друзья (они)"
    },
    {
      taskPicture: "👦 + 👧",
      eng: "The boy and girl are playing",
      rus: "Мальчик и девочка играют (они)"
    },
    {
      taskPicture: "👩 + 🐕",
      eng: "The woman and dog are walking",
      rus: "Женщина и собака гуляют (они)"
    },
    {
      taskPicture: "📚 + 🖊️",
      eng: "The book and pen are on the table",
      rus: "Книга и ручка на столе (они)"
    },

    // Сцены с людьми и животными (he/she + it/they)
    {
      taskPicture: "👨 + 🐈",
      eng: "He is playing with the cat",
      rus: "Он играет с кошкой"
    },
    {
      taskPicture: "👩 + 🦮",
      eng: "She is walking the dog",
      rus: "Она выгуливает собаку"
    },
    {
      taskPicture: "👵 + 🐦",
      eng: "She is feeding the bird",
      rus: "Она кормит птицу"
    },
    {
      taskPicture: "👴 + 🐕",
      eng: "He is petting the dog",
      rus: "Он гладит собаку"
    },

    // Забавные комбинации
    {
      taskPicture: "🐭 + 🧀",
      eng: "The mouse loves cheese",
      rus: "Мышка любит сыр"
    },
    {
      taskPicture: "🐶 + 🦴",
      eng: "The dog wants the bone",
      rus: "Собака хочет косточку"
    },
    {
      taskPicture: "🐈 + 🥛",
      eng: "The cat drinks milk",
      rus: "Кошка пьёт молоко"
    },
    {
      taskPicture: "🐻 + 🍯",
      eng: "The bear likes honey",
      rus: "Медведь любит мёд"
    },

    // Специальные примеры для обсуждения
    {
      taskPicture: "👩‍👦 + 🐕",
      eng: "The mother and son have a dog",
      rus: "Мама и сын имеют собаку"
    },
    {
      taskPicture: "👨‍👧 + 🐈",
      eng: "The father and daughter are watching the cat",
      rus: "Папа и дочь наблюдают за кошкой"
    },
    {
      taskPicture: "👫 + 🐕 + 🐈",
      eng: "They have a dog and a cat",
      rus: "У них есть собака и кошка"
    },
    {
      taskPicture: "👩‍🍳🍕",
      eng: "She is cooking pizza",
      rus: "Она готовит пиццу"
    },
    {
      taskPicture: "👨‍🍳🍔",
      eng: "He is making a burger",
      rus: "Он делает бургер"
    },
    {
      taskPicture: "👦🍦",
      eng: "He is eating ice cream",
      rus: "Он ест мороженое"
    },
    {
      taskPicture: "👧🍪",
      eng: "She wants a cookie",
      rus: "Она хочет печенье"
    },
    {
      taskPicture: "🦁🐯🐻",
      eng: "They are wild animals",
      rus: "Это дикие животные"
    },
    {
      taskPicture: "🐶🐱",
      eng: "They are pets",
      rus: "Это домашние животные"
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

const twoDecksData = {
  whereWereYou: {
    title: "Poker Face — Where were you?",
    decks: {
      questions: {
        name: "Where were you ... ?",
        icon: "❓",
        cards: [
          { id: 1, eng: "yesterday at 5 PM?", ru: "вчера в 17:00?", hint: "5pm = 17:00" },
          { id: 2, eng: "when I called you?", ru: "когда я позвонил", hint: "не колЕД, а колд" },
          { id: 3, eng: "on December 31?", ru: "31-го декабря", hint: "thirty first" },
        ]
      },
      answers: {
        name: "I was ...",
        icon: "📍",
        cards: [
          { id: 1, eng: "under my blanket.", ru: "под своим одеялом", hint: "blanket — одеяло" },
          { id: 2, eng: "at a rock concert.", ru: "на рок-концерте", hint: "concert — концерт" },
          { id: 3, eng: "on the toilet.", ru: "на унитазе", hint: "toilet — туалет и унитаз" },
        ]
      }
    }
  },
  foodSortingDev: {
    title: "Sorting Game — Овощи, Фрукты, Ягоды",
    decks: {
      vegetables: {
        name: "Овощи",
        icon: "🥕",
        cards: [
          { id: 1,  eng: "potato",        ru: "картофель",        hint: "потейтоу" },
          { id: 2,  eng: "carrot",        ru: "морковь",          hint: "кэррот" },
          { id: 3,  eng: "onion",         ru: "лук",              hint: "аньен" },
          { id: 4,  eng: "cucumber",      ru: "огурец",           hint: "кьюкамба" },
          { id: 5,  eng: "tomato",        ru: "помидор",          hint: "томэйтоу" },
          { id: 6,  eng: "cabbage",       ru: "капуста",          hint: "кэбидж" },
          { id: 7,  eng: "garlic",        ru: "чеснок",           hint: "галик" },
          { id: 8,  eng: "pepper",        ru: "перец",            hint: "пэпэр" },
          { id: 9,  eng: "beetroot",      ru: "свёкла",           hint: "битрут" },
          { id: 10, eng: "radish",        ru: "редис",            hint: "рэдиш" },
          { id: 11, eng: "pumpkin",       ru: "тыква",            hint: "пампкин" },
          { id: 12, eng: "zucchini",      ru: "кабачок",          hint: "зукини" },
          { id: 13, eng: "eggplant",      ru: "баклажан",         hint: "эгплэнт" },
          { id: 14, eng: "broccoli",      ru: "брокколи",         hint: "броколи" },
          { id: 15, eng: "cauliflower",   ru: "цветная капуста",  hint: "колифлауэр" },
          { id: 16, eng: "spinach",       ru: "шпинат",           hint: "спинич" },
          { id: 17, eng: "lettuce",       ru: "салат",            hint: "лэтис" },
          { id: 18, eng: "celery",        ru: "сельдерей",        hint: "сэлэри" },
          { id: 19, eng: "pea",           ru: "горох",            hint: "пии" },
          { id: 20, eng: "corn",          ru: "кукуруза",         hint: "корн" },
        ]
      },
      fruits: {
        name: "Фрукты",
        icon: "🍎",
        cards: [
          { id: 1,  eng: "apple",         ru: "яблоко",           hint: "эпл" },
          { id: 2,  eng: "banana",        ru: "банан",            hint: "бэнэна" },
          { id: 3,  eng: "orange",        ru: "апельсин",         hint: "орэндж" },
          { id: 4,  eng: "grape",         ru: "виноград",         hint: "грейп" },
          { id: 5,  eng: "pear",          ru: "груша",            hint: "пэа" },
          { id: 6,  eng: "peach",         ru: "персик",           hint: "пич" },
          { id: 7,  eng: "plum",          ru: "слива",            hint: "плам" },
          { id: 8,  eng: "cherry",        ru: "вишня",            hint: "чэри" },
          { id: 9,  eng: "apricot",       ru: "абрикос",          hint: "эйприкот" },
          { id: 10, eng: "pineapple",     ru: "ананас",           hint: "пайнэпл" },
          { id: 11, eng: "mango",         ru: "манго",            hint: "мэнгэу" },
          { id: 12, eng: "kiwi",          ru: "киви",             hint: "киви" },
          { id: 13, eng: "lemon",         ru: "лимон",            hint: "лэмон" },
          { id: 14, eng: "lime",          ru: "лайм",             hint: "лайм" },
          { id: 15, eng: "melon",         ru: "дыня",             hint: "мэлон" },
          { id: 16, eng: "watermelon",    ru: "арбуз",            hint: "уотэрмэлон" },
          { id: 17, eng: "pomegranate",   ru: "гранат",           hint: "помигрэнэйт" },
          { id: 18, eng: "persimmon",     ru: "хурма",            hint: "пэрсимон" },
          { id: 19, eng: "fig",           ru: "инжир",            hint: "фиг" },
          { id: 20, eng: "date",          ru: "финик",            hint: "дэйт" },
          { id: 21, eng: "coconut",       ru: "кокос",            hint: "коуконут" },
          { id: 22, eng: "papaya",        ru: "папайя",           hint: "папайя" },
          { id: 23, eng: "avocado",       ru: "авокадо",          hint: "авокадоу" },
          { id: 24, eng: "grapefruit",    ru: "грейпфрут",        hint: "грейпфрут" },
          { id: 25, eng: "nectarine",     ru: "нектарин",         hint: "нектэрин" },
          { id: 26, eng: "tangerine",     ru: "мандарин",         hint: "тэнджэрин" },
          { id: 27, eng: "quince",        ru: "айва",             hint: "куинс" },
          { id: 28, eng: "starfruit",     ru: "карамбола",        hint: "стафрут" },
          { id: 29, eng: "dragonfruit",   ru: "питахайя",         hint: "дрэгонфрут" },
          { id: 30, eng: "passionfruit",  ru: "маракуйя",         hint: "пэшэнфрут" },
        ]
      },
      berries: {
        name: "Ягоды",
        icon: "🍓",
        cards: [
          { id: 1,  eng: "strawberry",    ru: "клубника",         hint: "строубэрри" },
          { id: 2,  eng: "blueberry",     ru: "черника",          hint: "блубэрри" },
          { id: 3,  eng: "raspberry",     ru: "малина",           hint: "разбэрри" },
          { id: 4,  eng: "blackberry",    ru: "ежевика",          hint: "блэкбэрри" },
          { id: 5,  eng: "gooseberry",    ru: "крыжовник",        hint: "гусбэрри" },
          { id: 6,  eng: "currant",       ru: "смородина",        hint: "карэнт" },
          { id: 7,  eng: "cranberry",     ru: "клюква",           hint: "крэнбэрри" },
          { id: 8,  eng: "lingonberry",   ru: "брусника",         hint: "лингонбэрри" },
          { id: 9,  eng: "cherry",        ru: "черешня",          hint: "чэри" },
          { id: 10, eng: "mulberry",      ru: "шелковица",        hint: "малбэрри" },
        ]
      },
      // 60 несъедобных предметов — отдельной колодой «Предметы»
      nonFood: {
        name: "Несъедобные предметы",
        icon: "📦",
        cards: [
          { id: 1,  eng: "table",         ru: "стол",             hint: "тэйбл" },
          { id: 2,  eng: "chair",         ru: "стул",             hint: "чэа" },
          { id: 3,  eng: "sofa",          ru: "диван",            hint: "соуфа" },
          { id: 4,  eng: "bed",           ru: "кровать",          hint: "бэд" },
          { id: 5,  eng: "wardrobe",      ru: "шкаф",             hint: "уордроуб" },
          { id: 6,  eng: "lamp",          ru: "лампа",            hint: "лэмп" },
          { id: 7,  eng: "mirror",        ru: "зеркало",          hint: "мирэ" },
          { id: 8,  eng: "clock",         ru: "часы",             hint: "клок" },
          { id: 9,  eng: "phone",         ru: "телефон",          hint: "фоун" },
          { id: 10, eng: "computer",      ru: "компьютер",        hint: "компьютэ" },
          { id: 11, eng: "laptop",        ru: "ноутбук",          hint: "лэптоп" },
          { id: 12, eng: "keyboard",      ru: "клавиатура",       hint: "киборд" },
          { id: 13, eng: "mouse",         ru: "мышка",            hint: "маус" },
          { id: 14, eng: "printer",       ru: "принтер",          hint: "принтэ" },
          { id: 15, eng: "camera",        ru: "фотоаппарат",      hint: "кэмэра" },
          { id: 16, eng: "television",    ru: "телевизор",        hint: "тэлэвижэн" },
          { id: 17, eng: "radio",         ru: "радио",            hint: "рэйдиоу" },
          { id: 18, eng: "headphones",    ru: "наушники",         hint: "хэдфоунз" },
          { id: 19, eng: "speaker",       ru: "колонка",          hint: "спикэ" },
          { id: 20, eng: "book",          ru: "книга",            hint: "бук" },
          { id: 21, eng: "notebook",      ru: "тетрадь",          hint: "ноутбук" },
          { id: 22, eng: "pen",           ru: "ручка",            hint: "пэн" },
          { id: 23, eng: "pencil",        ru: "карандаш",         hint: "пэнсил" },
          { id: 24, eng: "eraser",        ru: "ластик",           hint: "ирэйзэ" },
          { id: 25, eng: "ruler",         ru: "линейка",          hint: "рулэ" },
          { id: 26, eng: "backpack",      ru: "рюкзак",           hint: "бэкпэк" },
          { id: 27, eng: "umbrella",      ru: "зонт",             hint: "амбрэла" },
          { id: 28, eng: "wallet",        ru: "кошелёк",          hint: "уолит" },
          { id: 29, eng: "keys",          ru: "ключи",            hint: "кииз" },
          { id: 30, eng: "glasses",       ru: "очки",             hint: "гласэз" },
          { id: 31, eng: "watch",         ru: "наручные часы",    hint: "уоч" },
          { id: 32, eng: "ring",          ru: "кольцо",           hint: "ринг" },
          { id: 33, eng: "bracelet",      ru: "браслет",          hint: "брэйслэт" },
          { id: 34, eng: "hat",           ru: "шляпа",            hint: "хэт" },
          { id: 35, eng: "scarf",         ru: "шарф",             hint: "скаф" },
          { id: 36, eng: "gloves",        ru: "перчатки",         hint: "главз" },
          { id: 37, eng: "shoes",         ru: "обувь",            hint: "шуз" },
          { id: 38, eng: "boots",         ru: "ботинки",          hint: "бутс" },
          { id: 39, eng: "socks",         ru: "носки",            hint: "сокс" },
          { id: 40, eng: "jacket",        ru: "куртка",           hint: "джэкит" },
          { id: 41, eng: "shirt",         ru: "рубашка",          hint: "шёт" },
          { id: 42, eng: "trousers",      ru: "брюки",            hint: "траузэз" },
          { id: 43, eng: "dress",         ru: "платье",           hint: "дрэс" },
          { id: 44, eng: "skirt",         ru: "юбка",             hint: "скёт" },
          { id: 45, eng: "sweater",       ru: "свитер",           hint: "суэтэ" },
          { id: 46, eng: "pillow",        ru: "подушка",          hint: "пилоу" },
          { id: 47, eng: "blanket",       ru: "одеяло",           hint: "блэнкит" },
          { id: 48, eng: "towel",         ru: "полотенце",        hint: "тауэл" },
          { id: 49, eng: "soap",          ru: "мыло",             hint: "соуп" },
          { id: 50, eng: "toothbrush",    ru: "зубная щётка",     hint: "тусбраш" },
          { id: 51, eng: "comb",          ru: "расчёска",         hint: "коум" },
          { id: 52, eng: "scissors",      ru: "ножницы",          hint: "сизэз" },
          { id: 53, eng: "hammer",        ru: "молоток",          hint: "хэмэ" },
          { id: 54, eng: "screwdriver",   ru: "отвёртка",         hint: "скрудрайвэ" },
          { id: 55, eng: "nail",          ru: "гвоздь",           hint: "нэйл" },
          { id: 56, eng: "rope",          ru: "верёвка",          hint: "роуп" },
          { id: 57, eng: "bucket",        ru: "ведро",            hint: "бакит" },
          { id: 58, eng: "broom",         ru: "метла",            hint: "брум" },
          { id: 59, eng: "battery",       ru: "батарейка",        hint: "бэтэри" },
          { id: 60, eng: "flashlight",    ru: "фонарик",          hint: "флэшлайт" },
        ]
      }
    }
  },
  foodSorting: {
    title: "Sorting Game — Овощи, Фрукты, Ягоды",
    decks: {
      vegetables: {
        name: "🥕 Овощи",
        icon: "🥕",
        cards: [
          { id: 1, eng: "potato", ru: "картофель", hint: "потейтоу" },
          { id: 2, eng: "carrot", ru: "морковь", hint: "кэррот" },
          { id: 3, eng: "onion", ru: "лук", hint: "аньен" },
          { id: 4, eng: "cucumber", ru: "огурец", hint: "кьюкамба" },
        ]
      },
      fruits: {
        name: "🍎 Фрукты",
        icon: "🍎",
        cards: [
          { id: 1, eng: "apple", ru: "яблоко", hint: "эпл" },
          { id: 2, eng: "banana", ru: "банан", hint: "бэнэна" },
          { id: 3, eng: "orange", ru: "апельсин", hint: "орэндж" },
          { id: 4, eng: "grape", ru: "виноград", hint: "грейп" },
        ]
      },
      berries: {
        name: "🍓 Ягоды",
        icon: "🍓",
        cards: [
          { id: 1, eng: "strawberry", ru: "клубника", hint: "строубэрри" },
          { id: 2, eng: "blueberry", ru: "черника", hint: "блубэрри" },
          { id: 3, eng: "raspberry", ru: "малина", hint: "разбэрри" },
          { id: 4, eng: "blackberry", ru: "ежевика", hint: "блэкбэрри" },
        ]
      }
    }
  },
  dev: {
    title: "Тренируем свой речевой аппарат! Составляем предллложения",
    decks: {
      subjects: {
        name: "Subjects",
        icon: "👤",
        cards: [
          // ─── 7 местоимений ───
          { id: 1,  eng: "I",             ru: "я",                  hint: "/ ай /" },
          { id: 2,  eng: "you",           ru: "ты / вы",            hint: "/ ю /" },
          { id: 3,  eng: "he",            ru: "он",                 hint: "/ хи /" },
          { id: 4,  eng: "she",           ru: "она",                hint: "/ ши /" },
          { id: 5,  eng: "it",            ru: "оно",                hint: "/ ит /" },
          { id: 6,  eng: "we",            ru: "мы",                 hint: "/ уи /" },
          { id: 7,  eng: "they",          ru: "они",                hint: "/ зэй /" },

          // ─── 43 персонажа ───
          { id: 8,  eng: "Shrek",                   ru: "Шрек",                    hint: "/ шрэк /" },
          { id: 9,  eng: "Rihanna",                 ru: "Рианна",                  hint: "/ рианна /" },
          { id: 10, eng: "Harry Potter",            ru: "Гарри Поттер",            hint: "/ хэрри поттэр /" },
          { id: 11, eng: "Dima Bilan",              ru: "Дима Билан",              hint: "/ дима билан /" },
          { id: 12, eng: "Snoop Dogg",              ru: "Снуп Догг",               hint: "/ снуп дог /" },
          { id: 13, eng: "Ugly monster",            ru: "страшный монстр",         hint: "/ агли монстэр /" },
          { id: 14, eng: "Spider-Man",              ru: "Человек-паук",            hint: "/ спайдэр-мэн /" },
          { id: 15, eng: "Batman",                  ru: "Бэтмен",                  hint: "/ бэтмэн /" },
          { id: 16, eng: "Superman",                ru: "Супермен",                hint: "/ супэрмэн /" },
          { id: 17, eng: "Wonder Woman",            ru: "Чудо-женщина",            hint: "/ уандэр уумэн /" },
          { id: 18, eng: "Iron Man",                ru: "Железный человек",        hint: "/ айрон мэн /" },
          { id: 19, eng: "Hulk",                    ru: "Халк",                    hint: "/ халк /" },
          { id: 20, eng: "Captain America",         ru: "Капитан Америка",         hint: "/ кэптэн амэрика /" },
          { id: 21, eng: "Thor",                    ru: "Тор",                     hint: "/ тор /" },
          { id: 22, eng: "Loki",                    ru: "Локи",                    hint: "/ лоуки /" },
          { id: 23, eng: "Black Widow",             ru: "Чёрная вдова",            hint: "/ блэк уидоу /" },
          { id: 24, eng: "Doctor Strange",          ru: "Доктор Стрэндж",          hint: "/ доктэр стрэйндж /" },
          { id: 25, eng: "Sherlock Holmes",         ru: "Шерлок Холмс",            hint: "/ шэрлок хоумз /" },
          { id: 26, eng: "Mickey Mouse",            ru: "Микки Маус",              hint: "/ мики маус /" },
          { id: 27, eng: "Donald Duck",             ru: "Дональд Дак",             hint: "/ доналд дак /" },
          { id: 28, eng: "SpongeBob",               ru: "Спанч Боб",               hint: "/ спанджбоб /" },
          { id: 29, eng: "Patrick Star",            ru: "Патрик Стар",             hint: "/ патрик стар /" },
          { id: 30, eng: "Homer Simpson",           ru: "Гомер Симпсон",           hint: "/ хоумэр симпсон /" },
          { id: 31, eng: "Bart Simpson",            ru: "Барт Симпсон",            hint: "/ барт симпсон /" },
          { id: 32, eng: "Elsa",                    ru: "Эльза",                   hint: "/ элза /" },
          { id: 33, eng: "Anna",                    ru: "Анна",                    hint: "/ анна /" },
          { id: 34, eng: "Cinderella",              ru: "Золушка",                 hint: "/ синдэрэлла /" },
          { id: 35, eng: "Snow White",              ru: "Белоснежка",              hint: "/ сноу уайт /" },
          { id: 36, eng: "Pinocchio",               ru: "Пиноккио",                hint: "/ пиноуккио /" },
          { id: 37, eng: "Aladdin",                 ru: "Аладдин",                 hint: "/ аладдин /" },
          { id: 38, eng: "Mulan",                   ru: "Мулан",                   hint: "/ мулан /" },
          { id: 39, eng: "Simba",                   ru: "Симба",                   hint: "/ симба /" },
          { id: 40, eng: "Nemo",                    ru: "Немо",                    hint: "/ нимоу /" },
          { id: 41, eng: "Woody",                   ru: "Вуди",                    hint: "/ вуди /" },
          { id: 42, eng: "Buzz Lightyear",          ru: "Базз Лайтер",             hint: "/ баз лайтйер /" },
          { id: 43, eng: "Gandalf",                 ru: "Гэндальф",                hint: "/ гэндалф /" },
          { id: 44, eng: "Frodo",                   ru: "Фродо",                   hint: "/ фроудоу /" },
          { id: 45, eng: "Darth Vader",             ru: "Дарт Вейдер",             hint: "/ дарс вэйдэр /" },
          { id: 46, eng: "Yoda",                    ru: "Йода",                    hint: "/ йоуда /" },
          { id: 47, eng: "Luke Skywalker",          ru: "Люк Скайуокер",           hint: "/ люк скайуокэр /" },
          { id: 48, eng: "Hermione Granger",        ru: "Гермиона Грейнджер",      hint: "/ хэрмайони грэйнджэр /" },
          { id: 49, eng: "Ron Weasley",             ru: "Рон Уизли",               hint: "/ рон уизли /" },
          { id: 50, eng: "Voldemort",               ru: "Волдеморт",               hint: "/ волдэморт /" },
        ],
      },

      verbs: {
        name: "Verbs",
        icon: "🏃",
        cards: [
          // ─── бытовая рутина ───
          { id: 1,  eng: "wash socks",           ru: "стирать носки",           hint: "/ уош сокс /" },
          { id: 2,  eng: "do the laundry",       ru: "стирать бельё",           hint: "/ ду зэ лон-дри /" },
          { id: 3,  eng: "iron clothes",         ru: "гладить одежду",          hint: "/ айрон клоуз /" },
          { id: 4,  eng: "make the bed",         ru: "заправлять кровать",      hint: "/ мэйк зэ бэд /" },
          { id: 5,  eng: "do the dishes",        ru: "мыть посуду",             hint: "/ ду зэ дишэз /" },
          { id: 6,  eng: "vacuum the floor",     ru: "пылесосить пол",          hint: "/ вакьюм зэ флор /" },
          { id: 7,  eng: "sweep the floor",      ru: "подметать пол",           hint: "/ свип зэ флор /" },
          { id: 8,  eng: "mop the floor",        ru: "мыть пол",                hint: "/ моп зэ флор /" },
          { id: 9,  eng: "clean the bathroom",   ru: "убирать ванную",          hint: "/ клин зэ баthрум /" },
          { id: 10, eng: "take out the trash",   ru: "выносить мусор",          hint: "/ тэйк аут зэ трэш /" },
          { id: 11, eng: "water the plants",     ru: "поливать растения",       hint: "/ вотэр зэ плэнтс /" },
          { id: 12, eng: "feed the cat",         ru: "кормить кота",            hint: "/ фид зэ кэт /" },
          { id: 13, eng: "walk the dog",         ru: "гулять с собакой",        hint: "/ вок зэ дог /" },
          { id: 14, eng: "cook dinner",          ru: "готовить ужин",           hint: "/ кук динэр /" },
          { id: 15, eng: "wash the car",         ru: "мыть машину",             hint: "/ вош зэ кар /" },
          { id: 16, eng: "go shopping",          ru: "ходить по магазинам",     hint: "/ гоу шопинг /" },

          // ─── работа / деньги / быт ───
          { id: 17, eng: "code",                 ru: "писать код",              hint: "/ коуд /" },
          { id: 18, eng: "transfer money",       ru: "переводить деньги",       hint: "/ трансфэр мани /" },
          { id: 19, eng: "pay the mortgage",     ru: "платить ипотеку",         hint: "/ пэй зэ моргидж /" },
          { id: 20, eng: "pay the bills",        ru: "оплачивать счета",        hint: "/ пэй зэ билз /" },
          { id: 21, eng: "check emails",         ru: "проверять почту",         hint: "/ чэк имэйлз /" },
          { id: 22, eng: "make a phone call",    ru: "звонить по телефону",     hint: "/ мэйк э фоун кол /" },
          { id: 23, eng: "write a report",       ru: "писать отчёт",            hint: "/ райт э рипорт /" },
          { id: 24, eng: "have a meeting",       ru: "проводить встречу",       hint: "/ хэв э митинг /" },
          { id: 25, eng: "take a day off",       ru: "брать выходной",          hint: "/ тэйк э дэй оф /" },

          // ─── спорт / хобби / досуг ───
          { id: 26, eng: "go to the gym",        ru: "ходить в спортзал",       hint: "/ гоу ту зэ джим /" },
          { id: 27, eng: "play football",        ru: "играть в футбол",         hint: "/ плэй футбол /" },
          { id: 28, eng: "ride a bike",          ru: "кататься на велосипеде",  hint: "/ райд э байк /" },
          { id: 29, eng: "swim in the pool",     ru: "плавать в бассейне",      hint: "/ суим ин зэ пул /" },
          { id: 30, eng: "read books",           ru: "читать книги",            hint: "/ рид букс /" },
          { id: 31, eng: "watch TV",             ru: "смотреть телевизор",      hint: "/ вотч ти-ви /" },
          { id: 32, eng: "listen to music",      ru: "слушать музыку",          hint: "/ лисэн ту мьюзик /" },
          { id: 33, eng: "play video games",     ru: "играть в видеоигры",      hint: "/ плэй видео геймз /" },
          { id: 34, eng: "draw pictures",        ru: "рисовать картинки",       hint: "/ дро пикчэрз /" },
          { id: 35, eng: "take photos",          ru: "фотографировать",         hint: "/ тэйк фоутоуз /" },

          // ─── общение / поездки ───
          { id: 36, eng: "meet my friends",      ru: "встречаться с друзьями",  hint: "/ мит май фрэндз /" },
          { id: 37, eng: "visit my grandma",     ru: "навещать бабушку",        hint: "/ визит май грэнма /" },
          { id: 38, eng: "go to the park",       ru: "ходить в парк",           hint: "/ гоу ту зэ парк /" },
          { id: 39, eng: "travel abroad",        ru: "путешествовать за границей", hint: "/ трэвэл эброд /" },
          { id: 40, eng: "book a hotel",         ru: "бронировать отель",       hint: "/ бук э хоутэл /" },

          // ─── учёба / саморазвитие ───
          { id: 41, eng: "study English",        ru: "учить английский",        hint: "/ стади инглиш /" },
          { id: 42, eng: "learn new words",      ru: "учить новые слова",       hint: "/ лёрн нью уордз /" },
          { id: 43, eng: "do homework",          ru: "делать домашнее задание", hint: "/ ду хоумворк /" },
          { id: 44, eng: "pass an exam",         ru: "сдавать экзамен",         hint: "/ пас эн игзам /" },

          // ─── прочее ───
          { id: 45, eng: "sleep late",           ru: "поздно вставать",         hint: "/ слип лэйт /" },
          { id: 46, eng: "take a shower",        ru: "принимать душ",           hint: "/ тэйк э шауэр /" },
          { id: 47, eng: "brush my teeth",       ru: "чистить зубы",            hint: "/ браш май тиth /" },
          { id: 48, eng: "eat out",              ru: "есть в кафе/ресторане",   hint: "/ ит аут /" },
          { id: 49, eng: "buy new clothes",      ru: "покупать новую одежду",   hint: "/ бай нью клоуз /" },
          { id: 50, eng: "plan a trip",          ru: "планировать поездку",     hint: "/ плэн э трип /" },
        ],
      },

      timeMarkers: {
        name: "Time markers",
        icon: "🕒",
        cards: [
          // ─── Present Simple (10) ───
          { id: 1,  eng: "every day",            ru: "каждый день",             hint: "/ эври дэй /" },
          { id: 2,  eng: "every morning",        ru: "каждое утро",             hint: "/ эври морнинг /" },
          { id: 3,  eng: "every evening",        ru: "каждый вечер",            hint: "/ эври ивнинг /" },
          { id: 4,  eng: "every week",           ru: "каждую неделю",           hint: "/ эври уик /" },
          { id: 5,  eng: "every month",          ru: "каждый месяц",            hint: "/ эври манth /" },
          { id: 6,  eng: "every year",           ru: "каждый год",              hint: "/ эври ер /" },
          { id: 7,  eng: "usually",              ru: "обычно",                  hint: "/ южуэли /" },
          { id: 8,  eng: "often",                ru: "часто",                   hint: "/ офтэн /" },
          { id: 9,  eng: "sometimes",            ru: "иногда",                  hint: "/ самтаймз /" },
          { id: 10, eng: "always",               ru: "всегда",                  hint: "/ олвэйз /" },

          // ─── Past Simple (10) ───
          { id: 11, eng: "yesterday",            ru: "вчера",                   hint: "/ йестэрдэй /" },
          { id: 12, eng: "yesterday morning",    ru: "вчера утром",             hint: "/ йестэрдэй морнинг /" },
          { id: 13, eng: "last week",            ru: "на прошлой неделе",       hint: "/ ласт уик /" },
          { id: 14, eng: "last month",           ru: "в прошлом месяце",        hint: "/ ласт манth /" },
          { id: 15, eng: "last year",            ru: "в прошлом году",          hint: "/ ласт ер /" },
          { id: 16, eng: "two days ago",         ru: "два дня назад",           hint: "/ ту дэйз эгоу /" },
          { id: 17, eng: "three hours ago",      ru: "три часа назад",          hint: "/ thри ауэрз эгоу /" },
          { id: 18, eng: "in 2020",              ru: "в 2020 году",             hint: "/ ин твэнти твэнти /" },
          { id: 19, eng: "when I was a child",   ru: "когда я был ребёнком",    hint: "/ уэн ай уоз э чайлд /" },
          { id: 20, eng: "on Monday",            ru: "в понедельник",           hint: "/ он мандэй /" },

          // ─── Future (10) ───
          { id: 21, eng: "tomorrow",             ru: "завтра",                  hint: "/ туморроу /" },
          { id: 22, eng: "tomorrow morning",     ru: "завтра утром",            hint: "/ туморроу морнинг /" },
          { id: 23, eng: "next week",            ru: "на следующей неделе",     hint: "/ нэкст уик /" },
          { id: 24, eng: "next month",           ru: "в следующем месяце",      hint: "/ нэкст манth /" },
          { id: 25, eng: "next year",            ru: "в следующем году",        hint: "/ нэкст ер /" },
          { id: 26, eng: "in two days",          ru: "через два дня",           hint: "/ ин ту дэйз /" },
          { id: 27, eng: "in three hours",       ru: "через три часа",          hint: "/ ин thри ауэрз /" },
          { id: 28, eng: "soon",                 ru: "скоро",                   hint: "/ сун /" },
          { id: 29, eng: "later",                ru: "позже",                   hint: "/ лэйтэр /" },
          { id: 30, eng: "in 2030",              ru: "в 2030 году",             hint: "/ ин твэнти thёрти /" },

          // ─── Past Continuous (10) ───
          { id: 31, eng: "at 5 o'clock yesterday",       ru: "вчера в 5 часов",              hint: "/ эт файв о-клок йестэрдэй /" },
          { id: 32, eng: "from 3 to 7 yesterday",        ru: "вчера с 3 до 7",               hint: "/ фром thри ту сэвэн йестэрдэй /" },
          { id: 33, eng: "all day yesterday",            ru: "весь вчерашний день",          hint: "/ ол дэй йестэрдэй /" },
          { id: 34, eng: "at 8 pm last night",           ru: "вчера в 8 вечера",             hint: "/ эт эйт пи-эм ласт найт /" },
          { id: 35, eng: "while I was cooking",          ru: "пока я готовил",               hint: "/ уайл ай уоз кукинг /" },
          { id: 36, eng: "when the phone rang",          ru: "когда зазвонил телефон",       hint: "/ уэн зэ фоун рэнг /" },
          { id: 37, eng: "from 5 to 7 in the evening",   ru: "с 5 до 7 вечера",              hint: "/ фром файв ту сэвэн ин зэ ивнинг /" },
          { id: 38, eng: "during the lesson",            ru: "во время урока",               hint: "/ дьюринг зэ лэсэн /" },
          { id: 39, eng: "at that moment",               ru: "в тот момент",                 hint: "/ эт зэт моумэнт /" },
          { id: 40, eng: "the whole morning",            ru: "всё утро",                     hint: "/ зэ хоул морнинг /" },
        ],
      },

      tasks: {
        name: "Tasks",
        icon: "📝",
        cards: [
          // ─── классические грамматические (1–10) ───
          { id: 1,  eng: "Make an affirmative sentence",      ru: "Составьте утвердительное предложение",        hint: "/ мэйк эн афёрмэтив сэнтэнс /" },
          { id: 2,  eng: "Make a negative sentence",          ru: "Составьте отрицательное предложение",           hint: "/ мэйк э нэгэтив сэнтэнс /" },
          { id: 3,  eng: "Ask a Yes/No question",             ru: "Задайте общий вопрос (Yes/No)",                 hint: "/ аск э йес-ноу куэсчэн /" },
          { id: 4,  eng: "Ask a question with Why",           ru: "Задайте вопрос с Why",                          hint: "/ аск э куэсчэн уиз уай /" },
          { id: 5,  eng: "Ask a question with When",          ru: "Задайте вопрос с When",                         hint: "/ аск э куэсчэн уиз уэн /" },
          { id: 6,  eng: "Ask a question with Where",         ru: "Задайте вопрос с Where",                        hint: "/ аск э куэсчэн уиз уэр /" },
          { id: 7,  eng: "Ask a question with How",           ru: "Задайте вопрос с How",                          hint: "/ аск э куэсчэн уиз хау /" },
          { id: 8,  eng: "Ask a question with What",          ru: "Задайте вопрос с What",                         hint: "/ аск э куэсчэн уиз уот /" },
          { id: 9,  eng: "Ask a question with Who",           ru: "Задайте вопрос с Who",                          hint: "/ аск э куэсчэн уиз ху /" },
          { id: 10, eng: "Ask a question with How often",     ru: "Задайте вопрос с How often",                    hint: "/ аск э куэсчэн уиз хау офтэн /" },

          // ─── «передай ход» (11–18) ───
          { id: 11, eng: "Ask another student to do it for you", ru: "Попроси другого ученика выполнить это за тебя", hint: "/ аск эназэр стъюдэнт ту ду ит фо ю /" },
          { id: 12, eng: "Pass the task to the student on your left", ru: "Передай задание ученику слева от тебя",   hint: "/ пас зэ таск ту зэ стъюдэнт он ёр лэфт /" },
          { id: 13, eng: "Pass the task to the student on your right", ru: "Передай задание ученику справа от тебя",  hint: "/ пас зэ таск ту зэ стъюдэнт он ёр райт /" },
          { id: 14, eng: "Swap your task with another player", ru: "Поменяйся заданием с другим игроком",           hint: "/ суоп ёр таск уиз эназэр плэйер /" },
          { id: 15, eng: "Let the teacher do it",             ru: "Пусть учитель выполнит это",                    hint: "/ лэт зэ тичэр ду ит /" },
          { id: 16, eng: "Choose who will answer",            ru: "Выбери, кто будет отвечать",                    hint: "/ чуз ху уил ансэр /" },
          { id: 17, eng: "Do it together with a partner",     ru: "Выполни это вместе с партнёром",                hint: "/ ду ит тугэзэр уиз э партнэр /" },
          { id: 18, eng: "Make it a team task",               ru: "Сделай это командным заданием",                 hint: "/ мэйк ит э тим таск /" },

          // ─── «пусть ИИ / техника» (19–26) ───
          { id: 19, eng: "Ask AI to draw this sentence",      ru: "Попроси ИИ нарисовать это предложение",         hint: "/ аск эй-ай ту дро зис сэнтэнс /" },
          { id: 20, eng: "Ask AI to write a story with this", ru: "Попроси ИИ написать историю с этим",            hint: "/ аск эй-ай ту райт э стори уиз зис /" },
          { id: 21, eng: "Ask AI to translate it into 3 languages", ru: "Попроси ИИ перевести это на 3 языка",      hint: "/ аск эй-ай ту трэнслэйт ит инту thри лэнгвиджиз /" },
          { id: 22, eng: "Ask AI to make it funny",           ru: "Попроси ИИ сделать это смешным",                hint: "/ аск эй-ай ту мэйк ит фани /" },
          { id: 23, eng: "Ask AI to explain the grammar",     ru: "Попроси ИИ объяснить грамматику",               hint: "/ аск эй-ай ту иксплэйн зэ грэмэр /" },
          { id: 24, eng: "Ask AI to sing it",                 ru: "Попроси ИИ спеть это",                          hint: "/ аск эй-ай ту синг ит /" },
          { id: 25, eng: "Ask AI to draw a comic with it",    ru: "Попроси ИИ нарисовать комикс с этим",           hint: "/ аск эй-ай ту дро э комик уиз ит /" },
          { id: 26, eng: "Ask AI to make a meme",             ru: "Попроси ИИ сделать мем",                        hint: "/ аск эй-ай ту мэйк э мим /" },

          // ─── «покажи / изобрази» (27–36) ───
          { id: 27, eng: "Act it out without words",          ru: "Покажи это без слов (пантомима)",               hint: "/ экт ит аут уизáут уордз /" },
          { id: 28, eng: "Draw it on the board",              ru: "Нарисуй это на доске",                          hint: "/ дро ит он зэ борд /" },
          { id: 29, eng: "Show it with emojis only",          ru: "Покажи это только эмодзи",                      hint: "/ шоу ит уиз имоуджиз онли /" },
          { id: 30, eng: "Sing your sentence",                ru: "Спой своё предложение",                         hint: "/ синг ёр сэнтэнс /" },
          { id: 31, eng: "Say it like a robot",               ru: "Скажи это как робот",                           hint: "/ сэй ит лайк э роубот /" },
          { id: 32, eng: "Say it like an angry villain",      ru: "Скажи это как злой злодей",                     hint: "/ сэй ит лайк эн энгри вилэн /" },
          { id: 33, eng: "Say it like a baby",                ru: "Скажи это как малыш",                           hint: "/ сэй ит лайк э бэйби /" },
          { id: 34, eng: "Say it very fast 3 times",          ru: "Скажи это очень быстро 3 раза",                 hint: "/ сэй ит вэри фаст thри таймз /" },
          { id: 35, eng: "Whisper it",                        ru: "Прошепчи это",                                  hint: "/ уиспэр ит /" },
          { id: 36, eng: "Shout it",                          ru: "Прокричи это",                                  hint: "/ шаут ит /" },

          // ─── «шуточные / нелепые» (37–46) ───
          { id: 37, eng: "Say it in a British accent",        ru: "Скажи это с британским акцентом",               hint: "/ сэй ит ин э бритish эксэнт /" },
          { id: 38, eng: "Say it while hopping on one leg",   ru: "Скажи это, прыгая на одной ноге",               hint: "/ сэй ит уайл хопинг он уан лэг /" },
          { id: 39, eng: "Say it with a mouth full of water", ru: "Скажи это с полным ртом воды (не глотай!)",     hint: "/ сэй ит уиз э маус фул оф уотэр /" },
          { id: 40, eng: "Say it as if you are late for a train", ru: "Скажи это, как будто опаздываешь на поезд",  hint: "/ сэй ит эз иф ю ар лэйт фо э трэйн /" },
          { id: 41, eng: "Say it as if you are a news anchor", ru: "Скажи это как ведущий новостей",                hint: "/ сэй ит эз иф ю ар э ньюз энкэр /" },
          { id: 42, eng: "Say it while doing 10 squats",      ru: "Скажи это, делая 10 приседаний",                hint: "/ сэй ит уайл дуинг тэн скуотс /" },
          { id: 43, eng: "Say it as a Shakespeare character", ru: "Скажи это как персонаж Шекспира",               hint: "/ сэй ит эз э шэйкспир кэрэктэр /" },
          { id: 44, eng: "Say it backwards (word order)",     ru: "Скажи это в обратном порядке слов",             hint: "/ сэй ит бэкуордз /" },
          { id: 45, eng: "Say it only with questions",        ru: "Скажи это только вопросами",                    hint: "/ сэй ит онли уиз куэсчэнз /" },
          { id: 46, eng: "Say it as a weather forecast",      ru: "Скажи это как прогноз погоды",                  hint: "/ сэй ит эз э уэзэр форкаст /" },

          // ─── «на реакцию / импровизация» (47–56) ───
          { id: 47, eng: "Add a random object to your sentence", ru: "Добавь в предложение случайный предмет",     hint: "/ эд э рэндом обджэкт ту ёр сэнтэнс /" },
          { id: 48, eng: "Add a random place to your sentence",  ru: "Добавь в предложение случайное место",        hint: "/ эд э рэндом плэйс ту ёр сэнтэнс /" },
          { id: 49, eng: "Add a random adjective to your sentence", ru: "Добавь в предложение случайное прилагательное", hint: "/ эд э рэндом эджэкти в ту ёр сэнтэнс /" },
          { id: 50, eng: "Make it a question to the teacher",    ru: "Преврати это в вопрос учителю",              hint: "/ мэйк ит э куэсчэн ту зэ тичэр /" },
          { id: 51, eng: "Make it a question to the class",      ru: "Преврати это в вопрос классу",               hint: "/ мэйк ит э куэсчэн ту зэ клас /" },
          { id: 52, eng: "Make it about your best friend",       ru: "Сделай это про лучшего друга",               hint: "/ мэйк ит эбаут ёр бэст фрэнд /" },
          { id: 53, eng: "Make it about your pet",               ru: "Сделай это про питомца",                     hint: "/ мэйк ит эбаут ёр пэт /" },
          { id: 54, eng: "Make it about your favourite food",    ru: "Сделай это про любимую еду",                 hint: "/ мэйк ит эбаут ёр фэйвэрит фуд /" },
          { id: 55, eng: "Say it like you are gossiping",        ru: "Скажи это типа ты сплетничаешь" },
          { id: 56, eng: "Make it a compliment to someone",      ru: "Сделай это комплиментом кому-то",            hint: "/ мэйк ит э комплимент ту сам уан /" },

          // ─── «перевод / объяснение» (57–66) ───
          { id: 57, eng: "Translate it into Russian",          ru: "Переведи это на русский",                       hint: "/ трэнслэйт ит инту рашэн /" },
          { id: 58, eng: "Translate it back into English",     ru: "Переведи это обратно на английский",            hint: "/ трэнслэйт ит бэк инту инглиш /" },
          { id: 59, eng: "Explain the sentence to a child",    ru: "Объясни предложение ребёнку",                   hint: "/ иксплэйн зэ сэнтэнс ту э чайлд /" },
          { id: 60, eng: "Explain the sentence to an alien",   ru: "Объясни предложение инопланетянину",            hint: "/ иксплэйн зэ сэнтэнс ту эн эйлиэн /" },
          { id: 61, eng: "Explain the sentence without words", ru: "Объясни предложение без слов",                  hint: "/ иксплэйн зэ сэнтэнс уизáут уордз /" },
          { id: 62, eng: "Find and fix the mistake",           ru: "Найди и исправь ошибку",                        hint: "/ файнд энд фикс зэ мистэйк /" },
          { id: 63, eng: "Change the subject",                 ru: "Замени подлежащее",                             hint: "/ чэйндж зэ сабджэкт /" },
          { id: 64, eng: "Change the verb",                    ru: "Замени глагол",                                 hint: "/ чэйндж зэ вёрб /" },
          { id: 65, eng: "Change the time marker",             ru: "Замени указатель времени",                      hint: "/ чэйндж зэ тайм маркэр /" },
          { id: 66, eng: "Change the tense",                   ru: "Смени время (например, на Past Simple)",        hint: "/ чэйндж зэ тэнс /" },
        ],
      },
    },
  },
  grammarDrill: {
    title: "Grammar — Make Sentences",
    decks: {
      affirmative: {
        name: "➕ Утверждение",
        icon: "➕",
        cards: [
          { id: 1, eng: "I play football", ru: "Я играю в футбол", hint: "play — играть" },
          { id: 2, eng: "She likes coffee", ru: "Она любит кофе", hint: "likes — любит" },
        ]
      },
      negative: {
        name: "➖ Отрицание",
        icon: "➖",
        cards: [
          { id: 1, eng: "I don't play football", ru: "Я не играю в футбол", hint: "don't = do not" },
          { id: 2, eng: "She doesn't like coffee", ru: "Она не любит кофе", hint: "doesn't = does not" },
        ]
      },
      question: {
        name: "❓ Вопрос",
        icon: "❓",
        cards: [
          { id: 1, eng: "Do you play football?", ru: "Ты играешь в футбол?", hint: "Do you...?" },
          { id: 2, eng: "Does she like coffee?", ru: "Она любит кофе?", hint: "Does she...?" },
        ]
      }
    }
  }
}

export default twoDecksData

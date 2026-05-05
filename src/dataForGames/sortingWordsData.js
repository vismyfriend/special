
const sortingWordsData = {


  pattern: {
    columns: [
      { id: 'fruit', title: 'fruits' },
      { id: 'vegetable', title: 'veggies' },
      { id: 'berry', title: 'berries' }
    ],
    items: [
      { id: 1, eng: '🍉 watermelon', ru: 'арбузик', correctColumn: 'berry' },
      { id: 2, eng: '🍈 melon', ru: 'дынька', correctColumn: 'fruit' },
      { id: 3, eng: '🍅 tomato', ru: 'помидорка', correctColumn: 'fruit' },
      { id: 4, eng: '🧅 onion', ru: 'лучок', correctColumn: 'vegetable' },
      { id: 5, eng: '🍐 pear', ru: 'груша', correctColumn: 'fruit' },
      { id: 6, eng: '🎃 pumpkin', ru: 'тыква', correctColumn: 'vegetable' },
      { id: 8, eng: '🥕 carrot', ru: 'морковка', correctColumn: 'vegetable' },
      { id: 9, eng: '🍌 banana', ru: 'банан', correctColumn: 'fruit' },
      { id: 11, eng: '🥒 cucumber', ru: 'огурчик', correctColumn: 'vegetable' },
      { id: 12, eng: '🍇 grapes', ru: 'виноград', correctColumn: 'berry' }
    ]
  },

  sortingArticlesTheAnA: {
    columns: [
      { id: 'a', title: '--- A --- говорим Э если 1-ый звук слова согласный ' },
      { id: 'an', title: '--- An --- говорим ЭН если 1-ый звук слова гласный ' },
      { id: 'the', title: '--- The --- говорим ДЭ перед всеми уникальными предметами' }
    ],
    items: [
      { id: 1, eng: '🌐 internet', ru: '`интернет', correctColumn: 'the' },
      { id: 2, eng: '🐘 elephant ', ru: '`элефант - слон', correctColumn: 'an' },
      { id: 3, eng: '🍊 orange', ru: '`ориндж - апельсин', correctColumn: 'an' },
      { id: 4, eng: '🧅 onion', ru: '`анион - лучок', correctColumn: 'an' },
      { id: 5, eng: '⏰ hour', ru: '`Аур - час', correctColumn: 'an' },
      { id: 6, eng: '🎃 pumpkin', ru: '`пАмпкин - тыква', correctColumn: 'a' },
      { id: 7, eng: '📱 iPhone', ru: '`Ай фоун', correctColumn: 'an' },
      { id: 8, eng: '🍌 banana', ru: 'бэ`нАнэ - банан', correctColumn: 'a' },
      { id: 9, eng: '🥒 cucumber', ru: '`кьЮкамбэ - огурчик', correctColumn: 'a' },
      { id: 10, eng: '🌙 Moon', ru: 'мун - луна', correctColumn: 'the' },
      { id: 11, eng: '💡 idea', ru: 'ай`дИа - идея', correctColumn: 'an' },
    ]
  },
  toBeAmIsAre00: {
    columns: [
      { id: 'am', title: 'I' },
      { id: 'is', title: 'He, She, It' },
      { id: 'are', title: 'You, We, They' }
    ],
    items: [
      { id: 1, eng: 'am not lazy', ru: 'я не ленивый', correctColumn: 'am' },
      { id: 2, eng: 'is your friend', ru: 'он ваш друг', correctColumn: 'is' },
      { id: 3, eng: 'are clever', ru: '`они умные', correctColumn: 'are' },
      { id: 4, eng: 'are my sisters', ru: 'они мои сёстры', correctColumn: 'are' },
      { id: 5, eng: 'am your friend', ru: 'я твой друг', correctColumn: 'am' },
      { id: 6, eng: "am clever", ru: 'я умный', correctColumn: 'am' },
      { id: 7, eng: "are your friends", ru: 'твои друзья', correctColumn: 'are' },
      { id: 8, eng: "is my teacher", ru: 'он мой учитель', correctColumn: 'is' },
      { id: 9, eng: "is not lazy", ru: 'она не ленивая', correctColumn: 'is' },
      { id: 10, eng: "are not lazy", ru: 'не ленивые', correctColumn: 'are' },
      { id: 11, eng: "am special", ru: 'особенный', correctColumn: 'am' },
      { id: 12, eng: "are special", ru: 'особенная', correctColumn: 'are' },
      { id: 13, eng: "is special", ru: 'особенные', correctColumn: 'is' },

    ]
  },


  sortingArticlesA: {
    columns: [
      { id: 'a', title: 'Когда предмет ОДИН перед ним произносим звук Э это артикль A' },
      { id: '-', title: 'Не говорим Э если предметов несколько. Не один значит не нужен А ' },
    ],
    items: [
      { id: 1, eng: '🚗 car', ru: 'машина', correctColumn: 'a' },
      { id: 2, eng: '🚗🚗 cars', ru: 'машины', correctColumn: '-' },
      { id: 3, eng: '🐶 dog', ru: 'собака', correctColumn: 'a' },
      { id: 4, eng: '🐶🐶🐶 dogs', ru: 'собаки', correctColumn: '-' },
      { id: 5, eng: '🏠 house', ru: 'дом', correctColumn: 'a' },
      { id: 6, eng: '📚 books', ru: 'книги', correctColumn: '-' },
      { id: 7, eng: '✏️ pencil', ru: 'карандаш', correctColumn: 'a' },
      { id: 8, eng: '🧒 people', ru: 'люди', correctColumn: '-' },
      { id: 9, eng: '🍎 red apple', ru: 'красное яблоко', correctColumn: 'a' }, // Важно: "red" начинается с согласного
      { id: 10, eng: '🍌 fruit', ru: 'фрукт', correctColumn: 'a' },
      { id: 11, eng: '🍌🍎 fruits', ru: 'фрукты', correctColumn: '-' },
      { id: 12, eng: '🎸 guitar', ru: 'гитара', correctColumn: 'a' },
      { id: 13, eng: '🐱 cats', ru: 'коты', correctColumn: '-' },
      { id: 14, eng: '🐱 cat', ru: 'кот', correctColumn: 'a' },
    ]
  },
  cards36: {
    instructions: 'перетяни карты в нужную колонку (черная или красная масть) произноси карты вслух на инглише',
    columns: [
      { id: 'b', title: 'Black suits' },
      { id: 'r', title: 'Red suits' },
    ],
    items: [
      // КРАСНЫЕ МАСТИ (Red suits) - ЧЕРВИ И БУБНЫ

      { id: 3, eng: 'eight of hearts', ru: 'восьмёрка черви', correctColumn: 'r' },
      { id: 4, eng: 'nine of hearts', ru: 'девятка черви', correctColumn: 'r' },
      { id: 5, eng: 'ten of hearts', ru: 'десятка черви', correctColumn: 'r' },
      { id: 6, eng: 'jack of hearts', ru: 'валет черви', correctColumn: 'r' },
      { id: 7, eng: 'queen of hearts', ru: 'дама черви', correctColumn: 'r' },
      { id: 8, eng: 'king of hearts', ru: 'король черви', correctColumn: 'r' },
      { id: 9, eng: 'ace of hearts', ru: 'туз черви', correctColumn: 'r' },


      { id: 12, eng: 'eight of diamonds', ru: 'восьмёрка буби', correctColumn: 'r' },
      { id: 13, eng: 'nine of diamonds', ru: 'девятка буби', correctColumn: 'r' },
      { id: 14, eng: 'ten of diamonds', ru: 'десятка буби', correctColumn: 'r' },
      { id: 15, eng: 'jack of diamonds', ru: 'валет буби', correctColumn: 'r' },
      { id: 16, eng: 'queen of diamonds', ru: 'дама буби', correctColumn: 'r' },
      { id: 17, eng: 'king of diamonds', ru: 'король буби', correctColumn: 'r' },
      { id: 18, eng: 'ace of diamonds', ru: 'туз буби', correctColumn: 'r' },

      // ЧЁРНЫЕ МАСТИ (Black suits) - ТРЕФЫ И ПИКИ

      { id: 21, eng: 'eight of clubs', ru: 'восьмёрка крести', correctColumn: 'b' },
      { id: 22, eng: 'nine of clubs', ru: 'девятка крести', correctColumn: 'b' },
      { id: 23, eng: 'ten of clubs', ru: 'десятка крести', correctColumn: 'b' },
      { id: 24, eng: 'jack of clubs', ru: 'валет крести', correctColumn: 'b' },
      { id: 25, eng: 'queen of clubs', ru: 'дама крести', correctColumn: 'b' },
      { id: 26, eng: 'king of clubs', ru: 'король крести', correctColumn: 'b' },
      { id: 27, eng: 'ace of clubs', ru: 'туз крести', correctColumn: 'b' },


      { id: 30, eng: 'eight of spades', ru: 'восьмёрка пики', correctColumn: 'b' },
      { id: 31, eng: 'nine of spades', ru: 'девятка пики', correctColumn: 'b' },
      { id: 32, eng: 'ten of spades', ru: 'десятка пики', correctColumn: 'b' },
      { id: 33, eng: 'jack of spades', ru: 'валет пики', correctColumn: 'b' },
      { id: 34, eng: 'queen of spades', ru: 'дама пики', correctColumn: 'b' },
      { id: 35, eng: 'king of spades', ru: 'король пики', correctColumn: 'b' },
      { id: 36, eng: 'ace of spades', ru: 'туз пики', correctColumn: 'b' },
    ]
  },
  sortingArticlesAn: {
    columns: [
      { id: 'an', title: 'An - говорим перед предметами если они с гласноо звука начинаются' },
      { id: '-', title: 'Не говорим ЭН если предметов несколько. Не один значит не нужен АN ' },
    ],
    items: [
      { id: 1, eng: '🚗 old car', ru: 'старая тачка', correctColumn: 'an' },
      { id: 2, eng: '🚗🚗 old cars', ru: 'старые машины', correctColumn: '-' },
      { id: 3, eng: '🐶 angry dog', ru: 'злая собака', correctColumn: 'an' },
      { id: 4, eng: '🐶🐶🐶 angry dogs', ru: 'злые собаки', correctColumn: '-' },
      { id: 5, eng: '🏠 apartment', ru: 'апартаменты, квартира', correctColumn: 'an' },
      { id: 6, eng: '📚 amazing book', ru: 'удивительная книга', correctColumn: 'an' },
      { id: 7, eng: '✏️✏️ pencils', ru: 'карандашы', correctColumn: '-' },
      { id: 8, eng: '🧒 ugly man', ru: 'уродливый мужик', correctColumn: 'an' },
      { id: 9, eng: '🍌🍌 yellow bananas', ru: 'желтые бананы', correctColumn: '-' },
      { id: 10, eng: '🍌🍎 fruits', ru: 'фрукты', correctColumn: '-' },




    ]
  },
  sortingArticlesThe: {
    columns: [
      { id: 'a', title: 'Когда предмет ОДИН перед ним произносим звук Э это артикль A' },
      { id: 'the', title: '--- The --- говорим ДЭ перед всеми уникальными предметами' }
    ],
    items: [
      { id: 1, eng: '🌐 internet', ru: '`интернет', correctColumn: 'the' },
      { id: 2, eng: '🐘 big elephant', ru: 'большой слон', correctColumn: 'a' },
      { id: 3, eng: '🍊 mandarin', ru: 'мандаринка', correctColumn: 'a' },
      { id: 4, eng: '🎃 pumpkin', ru: '`пАмпкин - тыква', correctColumn: 'a' },
      { id: 5, eng: '👑 Queen of England', ru: '`Дэ квин - королева', correctColumn: 'the' },
      { id: 6, eng: '🍌 banana', ru: 'банан', correctColumn: 'a' },
      { id: 7, eng: '⭐ best', ru: 'самый лучший', correctColumn: 'the' },
      { id: 8, eng: '🌙 Moon', ru: 'мун - луна', correctColumn: 'the' },
      { id: 9, eng: '💡 lamp', ru: 'лампочка', correctColumn: 'a' },
      { id: 10, eng: '🌎 Earth', ru: 'земля (уникальная)', correctColumn: 'the' },
      { id: 11, eng: '🌊 Pacific ocean', ru: 'тихий океан', correctColumn: 'the' },
      { id: 12, eng: '🏙️ city center', ru: 'центр города', correctColumn: 'the' },
      { id: 13, eng: '🧒 president of USA', ru: 'президент ов Ю ЭС ЭЙ', correctColumn: 'the' },

    ]
  },

  articlesAnNoA: {
    title: "Артикли A/An",
    instructions: "Перетащите слова в колонки с правильными артиклями",
    columns: [
      { id: 'articleA', title: 'A' },
      { id: 'articleAn', title: 'An' },
      { id: 'articleNo', title: 'no article' },
    ],
    items: [
      { id: 1, eng: 'apple', ru: 'яблоко', correctColumn: 'articleAn' },
      { id: 2, eng: 'banana', ru: 'банан',correctColumn: 'articleA' },
      { id: 3, eng: 'oranges', ru: 'апельсины', correctColumn: 'articleNo' },
      { id: 4, eng: 'people', ru: 'люди',correctColumn: 'articleNo' },
      { id: 5, eng: 'umbrella', ru: 'зонтик', correctColumn: 'articleAn' },
      { id: 6, eng: 'person', ru: 'человек',correctColumn: 'articleA' }
    ]
  },
  pronounsA00: {
    title: null,
    instructions: "Распределите животных по категориям",
    columns: [
      { id: 'articleA', title: 'A' },
      { id: 'articleAn', title: 'An' },
      { id: 'articleNo', title: 'no article' },
    ],
    items: [
      { id: 1, eng: 'apple', ru: 'яблоко', correctColumn: 'articleAn' },
      { id: 2, eng: 'banana', ru: 'банан',correctColumn: 'articleA' },
      { id: 3, eng: 'oranges', ru: 'апельсины', correctColumn: 'articleNo' },
      { id: 4, eng: 'people', ru: 'люди',correctColumn: 'articleNo' },
      { id: 5, eng: 'umbrella', ru: 'зонтик', correctColumn: 'articleAn' },
      { id: 6, eng: 'person', ru: 'человек',correctColumn: 'articleA' }
    ]
  },
  sortVerbs: {
    columns: [
      { id: 'v1', title: 'делаем обычно' },
      { id: 'v2', title: 'сделали вчера' },
      { id: 'v3', title: 'какие новости' }
    ],
    items: [
      { id: 1, eng: 'be', ru: 'быть', correctColumn: 'v1' },
      { id: 2, eng: 'am, is, are', ru: 'быть', correctColumn: 'v1' },
      { id: 3, eng: 'was, were', ru: 'был(и)', correctColumn: 'v2' },
      { id: 4, eng: 'been', ru: '(по)бывал', correctColumn: 'v3' },

      { id: 5, eng: 'become', ru: 'становиться, ставший', correctColumn: ['v1','v3'] },
      { id: 6, eng: 'became', ru: 'стал', correctColumn: 'v2' },
      { id: 7, eng: 'become', ru: 'становиться, ставший', correctColumn: ['v1','v3'] },

      { id: 8, eng: 'begin', ru: 'начинать', correctColumn: 'v1' },
      { id: 9, eng: 'began', ru: 'начал', correctColumn: 'v2' },
      { id: 10, eng: 'begun', ru: 'начавшийся', correctColumn: 'v3' },

      { id: 11, eng: 'bite', ru: 'кусать', correctColumn: 'v1' },
      { id: 12, eng: 'bit', ru: 'укусил', correctColumn: 'v2' },
      { id: 13, eng: 'bitten', ru: 'укушенный', correctColumn: 'v3' },

      { id: 14, eng: 'blow', ru: 'дуть', correctColumn: 'v1' },
      { id: 15, eng: 'blew', ru: 'дул', correctColumn: 'v2' },
      { id: 16, eng: 'blown', ru: 'надуый', correctColumn: 'v3' },

      { id: 17, eng: 'break', ru: 'ломать', correctColumn: 'v1' },
      { id: 18, eng: 'broke', ru: 'сломал', correctColumn: 'v2' },
      { id: 19, eng: 'broken', ru: 'сломанный', correctColumn: 'v3' },

      { id: 20, eng: 'bring', ru: 'приносить', correctColumn: 'v1' },
      { id: 21, eng: 'brought', ru: 'принес, принесенный', correctColumn: ['v2','v3']},
      { id: 22, eng: 'brought', ru: 'принес, принесенный', correctColumn: ['v2','v3']},

      { id: 23, eng: 'build', ru: 'строить', correctColumn: 'v1' },
      { id: 24, eng: 'built', ru: 'построил, построенный', correctColumn: ['v2','v3'] },
      { id: 25, eng: 'built', ru: 'построил, построенный', correctColumn: ['v2','v3'] },

      { id: 26, eng: 'buy', ru: 'покупать', correctColumn: 'v1' },
      { id: 27, eng: 'bought', ru: 'купил, купленный', correctColumn: ['v2','v3'] },
      { id: 28, eng: 'bought', ru: 'купил, купленный', correctColumn: ['v2','v3'] },

      { id: 29, eng: 'catch', ru: 'ловить', correctColumn: 'v1' },
      { id: 30, eng: 'caught', ru: 'поймал, пойманный', correctColumn: ['v2','v3'] },
      { id: 31, eng: 'caught', ru: 'поймал, пойманный', correctColumn: ['v2','v3'] },

      { id: 32, eng: 'choose', ru: 'выбирать', correctColumn: 'v1' },
      { id: 33, eng: 'chose', ru: 'выбрал', correctColumn: 'v2' },
      { id: 34, eng: 'chosen', ru: 'выбранный', correctColumn: 'v3' },

      { id: 35, eng: 'come', ru: 'приходить, пришедший', correctColumn: ['v1','v3'] },
      { id: 36, eng: 'came', ru: 'пришел', correctColumn: 'v2' },
      { id: 37, eng: 'come', ru: 'приходить, пришедший', correctColumn: ['v1','v3']},

      // cut - все три формы одинаковые
      { id: 38, eng: 'cut', ru: 'резать, резал, резанный', correctColumn: ['v1','v2','v3'] },
      { id: 39, eng: 'cut', ru: 'резать, резал, резанный', correctColumn: ['v1','v2','v3'] },
      { id: 40, eng: 'cut', ru: 'резать, резал, резанный', correctColumn: ['v1','v2','v3'] },

      { id: 41, eng: 'do', ru: 'делать', correctColumn: 'v1' },
      { id: 42, eng: 'did', ru: 'сделал', correctColumn: 'v2' },
      { id: 43, eng: 'done', ru: 'сделанный', correctColumn: 'v3' },

      { id: 44, eng: 'drink', ru: 'пить', correctColumn: 'v1' },
      { id: 45, eng: 'drank', ru: 'пил', correctColumn: 'v2' },
      { id: 46, eng: 'drunk', ru: 'выпитый', correctColumn: 'v3' },

      { id: 47, eng: 'drive', ru: 'водить', correctColumn: 'v1' },
      { id: 48, eng: 'drove', ru: 'вел', correctColumn: 'v2' },
      { id: 49, eng: 'driven', ru: 'веденный', correctColumn: 'v3' },

      { id: 50, eng: 'eat', ru: 'есть', correctColumn: 'v1' },
      { id: 51, eng: 'ate', ru: 'ел', correctColumn: 'v2' },
      { id: 52, eng: 'eaten', ru: 'съеденный', correctColumn: 'v3' },

      { id: 53, eng: 'fall', ru: 'падать', correctColumn: 'v1' },
      { id: 54, eng: 'fell', ru: 'упал', correctColumn: 'v2' },
      { id: 55, eng: 'fallen', ru: 'упавший', correctColumn: 'v3' },

      // feel - v2 и v3 одинаковые
      { id: 56, eng: 'feel', ru: 'чувствовать', correctColumn: 'v1' },
      { id: 57, eng: 'felt', ru: 'чувствовал, ощущаемый', correctColumn: ['v2','v3'] },
      { id: 58, eng: 'felt', ru: 'чувствовал, ощущаемый', correctColumn: ['v2','v3'] },

      // find - v2 и v3 одинаковые
      { id: 59, eng: 'find', ru: 'находить', correctColumn: 'v1' },
      { id: 60, eng: 'found', ru: 'нашел, найденный', correctColumn: ['v2','v3'] },
      { id: 61, eng: 'found', ru: 'нашел, найденный', correctColumn: ['v2','v3'] },

      { id: 62, eng: 'fly', ru: 'летать', correctColumn: 'v1' },
      { id: 63, eng: 'flew', ru: 'летал', correctColumn: 'v2' },
      { id: 64, eng: 'flown', ru: 'летавший', correctColumn: 'v3' },

      { id: 65, eng: 'forget', ru: 'забывать', correctColumn: 'v1' },
      { id: 66, eng: 'forgot', ru: 'забыл', correctColumn: 'v2' },
      { id: 67, eng: 'forgotten', ru: 'забытый', correctColumn: 'v3' },

      { id: 68, eng: 'freeze', ru: 'замораживать', correctColumn: 'v1' },
      { id: 69, eng: 'froze', ru: 'заморозил', correctColumn: 'v2' },
      { id: 70, eng: 'frozen', ru: 'замороженный', correctColumn: 'v3' },

      // get - v2 и v3 одинаковые
      { id: 71, eng: 'get', ru: 'получать', correctColumn: 'v1' },
      { id: 72, eng: 'got', ru: 'получил, полученный', correctColumn: ['v2','v3'] },
      { id: 73, eng: 'got', ru: 'получил, полученный', correctColumn: ['v2','v3'] },

      { id: 74, eng: 'give', ru: 'давать', correctColumn: 'v1' },
      { id: 75, eng: 'gave', ru: 'дал', correctColumn: 'v2' },
      { id: 76, eng: 'given', ru: 'данный', correctColumn: 'v3' },

      { id: 77, eng: 'go', ru: 'идти', correctColumn: 'v1' },
      { id: 78, eng: 'went', ru: 'шел', correctColumn: 'v2' },
      { id: 79, eng: 'gone', ru: 'ушедший', correctColumn: 'v3' },

      { id: 80, eng: 'grow', ru: 'расти', correctColumn: 'v1' },
      { id: 81, eng: 'grew', ru: 'рос', correctColumn: 'v2' },
      { id: 82, eng: 'grown', ru: 'выросший', correctColumn: 'v3' },

      // have - v2 и v3 одинаковые
      { id: 83, eng: 'have', ru: 'иметь', correctColumn: 'v1' },
      { id: 84, eng: 'had', ru: 'имел, имевший', correctColumn: ['v2','v3'] },
      { id: 85, eng: 'had', ru: 'имел, имевший', correctColumn: ['v2','v3'] },

      // hear - v2 и v3 одинаковые
      { id: 86, eng: 'hear', ru: 'слышать', correctColumn: 'v1' },
      { id: 87, eng: 'heard', ru: 'слышал, услышанный', correctColumn: ['v2','v3'] },
      { id: 88, eng: 'heard', ru: 'слышал, услышанный', correctColumn: ['v2','v3'] },

      // hit - все три формы одинаковые
      { id: 89, eng: 'hit', ru: 'ударять, ударил, ударенный', correctColumn: ['v1','v2','v3'] },
      { id: 90, eng: 'hit', ru: 'ударять, ударил, ударенный', correctColumn: ['v1','v2','v3'] },
      { id: 91, eng: 'hit', ru: 'ударять, ударил, ударенный', correctColumn: ['v1','v2','v3'] },

      // hold - v2 и v3 одинаковые
      { id: 92, eng: 'hold', ru: 'держать', correctColumn: 'v1' },
      { id: 93, eng: 'held', ru: 'держал, удерживаемый', correctColumn: ['v2','v3'] },
      { id: 94, eng: 'held', ru: 'держал, удерживаемый', correctColumn: ['v2','v3'] },

      // hurt - все три формы одинаковые
      { id: 95, eng: 'hurt', ru: 'причинять боль', correctColumn: ['v1','v2','v3'] },
      { id: 96, eng: 'hurt', ru: 'причинил боль', correctColumn: ['v1','v2','v3'] },
      { id: 97, eng: 'hurt', ru: 'раненый', correctColumn: ['v1','v2','v3'] },

      { id: 98, eng: 'know', ru: 'знать', correctColumn: 'v1' },
      { id: 99, eng: 'knew', ru: 'знал', correctColumn: 'v2' },
      { id: 100, eng: 'known', ru: 'известный', correctColumn: 'v3' }
    ]
  },
  sortVerbsIntro101: {
    columns: [
      { id: 'v1', title: 'делать (обычно) делаю ' },
      { id: 'v2', title: 'делал (прошлое) сделал ' },
      { id: 'v3', title: 'какой (новости) сделанный' }
    ],
    items: [
      { id: 17, eng: 'break - брЭЙк', ru: 'ломать', correctColumn: 'v1' },
      { id: 18, eng: 'broke - броУк', ru: 'сломал', correctColumn: 'v2' },
      { id: 19, eng: 'broken- броУкэн', ru: 'сломанный', correctColumn: 'v3' },

      { id: 32, eng: 'choose - чуз', ru: 'выбирать', correctColumn: 'v1' },
      { id: 33, eng: 'chose - чоУз', ru: 'выбрал', correctColumn: 'v2' },
      { id: 34, eng: 'chosen - чоузЭн', ru: 'выбранный', correctColumn: 'v3' },

      { id: 41, eng: 'do - ду', ru: 'делать', correctColumn: 'v1' },
      { id: 42, eng: 'did - дид', ru: 'сделал', correctColumn: 'v2' },
      { id: 43, eng: 'done - дан', ru: 'сделанный', correctColumn: 'v3' },

      { id: 50, eng: 'eat - ит', ru: 'есть', correctColumn: 'v1' },
      { id: 51, eng: 'ate - эЙт', ru: 'ел, съел', correctColumn: 'v2' },
      { id: 52, eng: 'eaten - Итэн', ru: 'съеденный', correctColumn: 'v3' },

      { id: 65, eng: 'forget - фогЕт', ru: 'забывать', correctColumn: 'v1' },
      { id: 66, eng: 'forgot - фогОт', ru: 'забыл', correctColumn: 'v2' },
      { id: 67, eng: 'forgotten - фогОтэн', ru: 'забытый', correctColumn: 'v3' },
    ]
  },
  sortVerbsIntro1012: {
    columns: [
      { id: 'v1', title: 'делать (обычно) делаю ' },
      { id: 'v2', title: 'делал (прошлое) сделал ' },
      { id: 'v3', title: 'какой (новости) сделанный' }
    ],
    items: [
      { id: 1, eng: 'I break my brain', ru: 'я ломаю свой мозг', correctColumn: 'v1' },
      { id: 2, eng: 'I broke my brain', ru: 'я сломал свой мозг', correctColumn: 'v2' },
      { id: 3, eng: 'he broke his brain', ru: 'он сломал свой мозг', correctColumn: 'v2' },
      { id: 18, eng: 'he breaks his brain', ru: 'он ломает свой мозг', correctColumn: 'v1' },
      { id: 19, eng: 'Brain is broken', ru: 'мозг сломан', correctColumn: 'v3' },

      { id: 32, eng: 'You choose it', ru: 'ты выбираешь это', correctColumn: 'v1' },
      { id: 33, eng: 'You chose it', ru: 'ты выбрал это', correctColumn: 'v2' },
      { id: 34, eng: 'You are chosen', ru: 'ты избранный', correctColumn: 'v3' },
      { id: 35, eng: 'It is chosen', ru: 'это выбрано', correctColumn: 'v3' },

      { id: 41, eng: 'We do homework', ru: 'мы делаем д/з', correctColumn: 'v1' },
      { id: 42, eng: 'We did homework', ru: 'мы сделали д/з', correctColumn: 'v2' },
      { id: 43, eng: 'Homework is done', ru: 'домашка сделана', correctColumn: 'v3' },
      { id: 44, eng: 'She does homework', ru: 'она делает домаху', correctColumn: 'v1' },

      { id: 50, eng: 'He eats', ru: 'он ест', correctColumn: 'v1' },
      { id: 51, eng: 'He ate - эЙт', ru: 'он поел', correctColumn: 'v2' },
      { id: 52, eng: 'He is eaten - Итэн', ru: 'ЕГО СЪЕЛИ!', correctColumn: 'v3' },

      { id: 65, eng: 'they forget - фогЕт', ru: 'они забывают', correctColumn: 'v1' },
      { id: 66, eng: 'they forgot - фогОт', ru: 'они забыли', correctColumn: 'v2' },
      { id: 67, eng: 'they are forgotten - фогОтэн', ru: 'о них забыли (они - забытые)', correctColumn: 'v3' },
    ]
  },
  sortVerbsIntro1: {
    columns: [
      { id: 'v1', title: 'делать (обычно) делаю ' },
      { id: 'v2', title: 'делал (прошлое) сделал ' },
      { id: 'v3', title: 'какой (новости) сделанный' }
    ],
    items: [
      { id: 11, eng: 'bite', ru: 'кусать', correctColumn: 'v1' },
      { id: 12, eng: 'bit', ru: 'укусил', correctColumn: 'v2' },
      { id: 13, eng: 'bitten', ru: 'укушенный', correctColumn: 'v3' },

      { id: 17, eng: 'break', ru: 'ломать', correctColumn: 'v1' },
      { id: 18, eng: 'broke', ru: 'сломал', correctColumn: 'v2' },
      { id: 19, eng: 'broken', ru: 'сломанный', correctColumn: 'v3' },

      { id: 32, eng: 'choose', ru: 'выбирать', correctColumn: 'v1' },
      { id: 33, eng: 'chose', ru: 'выбрал', correctColumn: 'v2' },
      { id: 34, eng: 'chosen', ru: 'выбранный', correctColumn: 'v3' },

      { id: 41, eng: 'do', ru: 'делать', correctColumn: 'v1' },
      { id: 42, eng: 'did', ru: 'сделал', correctColumn: 'v2' },
      { id: 43, eng: 'done', ru: 'сделанный', correctColumn: 'v3' },

      { id: 50, eng: 'eat', ru: 'есть', correctColumn: 'v1' },
      { id: 51, eng: 'ate', ru: 'ел', correctColumn: 'v2' },
      { id: 52, eng: 'eaten', ru: 'съеденный', correctColumn: 'v3' },

      { id: 53, eng: 'fall', ru: 'падать', correctColumn: 'v1' },
      { id: 54, eng: 'fell', ru: 'упал', correctColumn: 'v2' },
      { id: 55, eng: 'fallen', ru: 'упавший', correctColumn: 'v3' },

      { id: 65, eng: 'forget', ru: 'забывать', correctColumn: 'v1' },
      { id: 66, eng: 'forgot', ru: 'забыл', correctColumn: 'v2' },
      { id: 67, eng: 'forgotten', ru: 'забытый', correctColumn: 'v3' },

      { id: 68, eng: 'freeze', ru: 'замораживать', correctColumn: 'v1' },
      { id: 69, eng: 'froze', ru: 'заморозил', correctColumn: 'v2' },
      { id: 70, eng: 'frozen', ru: 'замороженный', correctColumn: 'v3' },

    ]
  },
  sortVerbsIntro2: {
    columns: [
      { id: 'v1', title: 'делать, делаю (обычно) иногда ' },
      { id: 'v2', title: 'делал, сделал (прошлое) когда-то ' },
      { id: 'v3', title: 'чего натворил! (новости) только что' }
    ],
    items: [

      { id: 17, eng: 'people break rules', ru: 'люди нарушают правила', correctColumn: 'v1' },
      { id: 18, eng: 'people broke rules', ru: 'люди нарушили правила', correctColumn: 'v2' },
      { id: 19, eng: 'people have broken rules', ru: 'ЛЮДИ НАРУШИЛИ ПРАВИЛА!!!', correctColumn: 'v3' },

      { id: 32, eng: 'they choose you', ru: 'они выбирают тебя', correctColumn: 'v1' },
      { id: 33, eng: 'they chose you', ru: 'они выбрали тебя', correctColumn: 'v2' },
      { id: 34, eng: 'they have chosen you', ru: 'ОНИ ВЫБРАЛИ ТЕБЯ!!!', correctColumn: 'v3' },

      { id: 41, eng: 'He does it', ru: 'он делает это', correctColumn: 'v1' },
      { id: 42, eng: 'He did it', ru: 'он сделал это', correctColumn: 'v2' },
      { id: 43, eng: 'He has done it', ru: 'ОН СДЕЛАЛ ЭТО!!!', correctColumn: 'v3' },

      { id: 50, eng: 'we eat veggies', ru: 'мы едим овощи', correctColumn: 'v1' },
      { id: 51, eng: 'we ate veggies', ru: 'мы поели овощи', correctColumn: 'v2' },
      { id: 52, eng: 'we have eaten', ru: 'МЫ ПОЕЛИ УЖЕ!!!', correctColumn: 'v3' },

      { id: 53, eng: 'I fall sometimes', ru: 'я иногда падаю', correctColumn: 'v1' },
      { id: 54, eng: 'I fell yesterday', ru: 'я вчера упал(а)', correctColumn: 'v2' },
      { id: 55, eng: 'I have fallen ', ru: 'Я УПААААЛ(А) !!!', correctColumn: 'v3' },

      { id: 65, eng: 'I forget words', ru: 'я забываю слова', correctColumn: 'v1' },
      { id: 66, eng: 'I forgot words', ru: 'забыл', correctColumn: 'v2' },
      { id: 67, eng: 'I`ve forgotten all words', ru: 'Я ЗАБЫЛ ВСЕ СЛОВА!!!', correctColumn: 'v3' },
    ]
  },
  sortVerbsForYou: {
    columns: [
      { id: 'v1', title: 'делать, делаю (обычно) иногда ' },
      { id: 'v2', title: 'делал, сделал (прошлое) когда-то ' },
      { id: 'v3', title: 'чего натворил! (новости) только что' }
    ],
    items: [

      { id: 17, eng: 'I do it for you', ru: 'делаю для тебя', correctColumn: 'v1' },
      { id: 18, eng: 'I did it for you', ru: 'сделал для тебя', correctColumn: 'v2' },
      { id: 19, eng: 'I have done it', ru: 'Я СДЕЛАЛ ЭТО!!!', correctColumn: 'v3' },

      { id: 32, eng: 'He does it for you', ru: 'он делает для тебя', correctColumn: 'v1' },
      { id: 33, eng: 'He did it for you', ru: 'он сделал для тебя', correctColumn: 'v2' },
      { id: 34, eng: 'He has done it', ru: 'ОН СДЕЛАЛ ЭТО!!!', correctColumn: 'v3' },

      { id: 41, eng: 'We buy food for you', ru: 'мы покупаем тебе еду', correctColumn: 'v1' },
      { id: 42, eng: 'We bought food for you', ru: 'мы купили тебе еды', correctColumn: 'v2' },
      { id: 43, eng: 'We have bought food for you', ru: 'МЫ КУПИЛИ ТЕБЕ ЕДЫ!!!', correctColumn: 'v3' },
      { id: 44, eng: 'Food is bought for you', ru: 'еда куплена для тебя', correctColumn: 'v3' },
      { id: 45, eng: 'It is done for you', ru: 'это сделано для тебя', correctColumn: 'v3' },

    ]
  },
  sortVerbsToBe3Forms: {
    columns: [
      { id: 'v1', title: 'настоящее (Present) являться, находиться, быть' },
      { id: 'v2', title: 'прошедшее (Past) время находился, находились, был, были' },
      { id: 'v3', title: 'обалденное (Perfect) уже бывал или только что побывал' }
    ],
    items: [
      { id: 1, eng: 'be', ru: '(am, is, are)', correctColumn: 'v1' },
      { id: 2, eng: 'am, is, are', ru: 'быть', correctColumn: 'v1' },
      { id: 3, eng: 'was, were', ru: 'был(и)', correctColumn: 'v2' },
      { id: 4, eng: 'was', ru: 'был, была, было', correctColumn: 'v2' },
      { id: 8, eng: 'were', ru: 'были', correctColumn: 'v2' },
      { id: 15, eng: 'been', ru: '(по)бывал!!!', correctColumn: 'v3' },

    ]
  },
  sortVerbsToBe3FormsExamples: {
    columns: [
      { id: 'v1', title: 'настоящее (Present) являться, находиться, быть' },
      { id: 'v2', title: 'прошедшее (Past) время находился, находились, был, были' },
      { id: 'v3', title: 'обалденное (Perfect) уже бывал или только что побывал' }
    ],
    items: [
      { id: 1, eng: 'be', ru: '(am, is, are)', correctColumn: 'v1' },
      { id: 2, eng: 'am, is, are', ru: 'быть', correctColumn: 'v1' },
      { id: 3, eng: 'was, were', ru: 'был(и)', correctColumn: 'v2' },
      { id: 4, eng: 'was', ru: 'был, была, было', correctColumn: 'v2' },
      { id: 5, eng: 'I was home', ru: 'я был дома', correctColumn: 'v2' },
      { id: 6, eng: 'It was ok', ru: 'это было норм', correctColumn: 'v2' },
      { id: 7, eng: 'Home was big', ru: 'дом был большой', correctColumn: 'v2' },
      { id: 8, eng: 'were', ru: 'были', correctColumn: 'v2' },
      { id: 9, eng: 'We were there', ru: 'мы были там', correctColumn: 'v2' },
      { id: 10, eng: 'They were there', ru: 'они были там', correctColumn: 'v2' },
      { id: 11, eng: 'You were there', ru: 'вы были там', correctColumn: 'v2' },
      { id: 12, eng: 'I am here', ru: 'я здесь', correctColumn: 'v1' },
      { id: 13, eng: 'She is here', ru: 'она здесь', correctColumn: 'v1' },
      { id: 14, eng: 'it`s there', ru: 'это там', correctColumn: 'v1' },
      { id: 15, eng: 'been', ru: '(по)бывал!!!', correctColumn: 'v3' },
      { id: 16, eng: 'I have been here', ru: 'я бывал здесь уже!', correctColumn: 'v3' },
      { id: 17, eng: 'He has been here', ru: 'он бывал здесь уже!', correctColumn: 'v3' },
      { id: 18, eng: 'She has been here', ru: 'ОНА ПОБЫВАЛА ЗДЕСЬ УЖЕ!!!', correctColumn: 'v3' },
      { id: 19, eng: 'it has been there', ru: 'ЭТО БЫЛО ТАМ!!!', correctColumn: 'v3' },
      { id: 20, eng: 'I was', ru: 'я был', correctColumn: 'v2' },
      { id: 21, eng: 'Ты был', ru: 'you were', correctColumn: 'v2' },
      { id: 22, eng: 'Вы были', ru: 'you were', correctColumn: 'v2' },
      { id: 23, eng: 'You were', ru: 'Ты = Вы', correctColumn: 'v2' },


    ]
  },

  sortVerbsNVS: {
    columns: [
      { id: 'v1', title: 'настоящее' },
      { id: 'v2', title: 'прошлое' },
      { id: 'v3', title: 'обалденное' }
    ],
    items: [

      { id: 101, eng: 'say СЭЙ', ru: 'сказать или произнести', correctColumn: 'v1'},
      { id: 102, eng: 'said СЭД', ru: 'сказал или произнес', correctColumn: ['v2','v3'] },
      { id: 103, eng: 'said СЭД', ru: 'сказал или произнес', correctColumn: ['v2','v3'] },

      { id: 98, eng: 'know НОУ', ru: 'знать', correctColumn: 'v1' },
      { id: 99, eng: 'knew НЮ', ru: 'знал', correctColumn: 'v2' },
      { id: 100, eng: 'known НОУН', ru: 'известный', correctColumn: 'v3' },

      { id: 4, eng: 'see СИ', ru: 'видеть', correctColumn: 'v1' },
      { id: 5, eng: 'saw СО', ru: 'видел', correctColumn: 'v2' },
      { id: 6, eng: 'seen СИН', ru: 'увидел', correctColumn: 'v3' },

      // sell - продал
      { id: 7, eng: 'sell', ru: 'продавать', correctColumn: 'v1' },
      { id: 8, eng: 'sold', ru: 'продал продано', correctColumn: ['v2','v3'] },
      { id: 9, eng: 'sold', ru: 'продал продано', correctColumn: ['v2','v3'] },

      // send - отправил
      { id: 10, eng: 'send Д', ru: 'отправлять', correctColumn: 'v1' },
      { id: 11, eng: 'sent Т', ru: 'отправил отправленный', correctColumn: ['v2','v3'] },
      { id: 12, eng: 'sent Т', ru: 'отправил отправленный', correctColumn: ['v2','v3'] },

      // shake - тряс
      { id: 13, eng: 'shake', ru: 'трясти', correctColumn: 'v1' },
      { id: 14, eng: 'shook', ru: 'тряс', correctColumn: 'v2' },
      { id: 15, eng: 'shaken', ru: 'встряхнутый', correctColumn: 'v3' },
    ]
  },


}
export default sortingWordsData

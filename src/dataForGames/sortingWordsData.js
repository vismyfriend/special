
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
      { id: 24, eng: 'built', ru: 'построил, построенный', correctColumn: 'v2' },
      { id: 25, eng: 'built', ru: 'построил, построенный', correctColumn: 'v3' },

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
  }

}
export default sortingWordsData

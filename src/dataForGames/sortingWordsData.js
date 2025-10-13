
const sortingWordsData = {


  pattern: {
    title: "Название задания",
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
  }

}
export default sortingWordsData

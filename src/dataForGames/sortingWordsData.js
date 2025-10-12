
const sortingWordsData = {


  pattern: {
    title: "Артикли A/An",
    instructions: "Перетащите слова в колонки с правильными артиклями",
    columns: [
      { id: 'articleA', title: 'Article A' },
      { id: 'articleAn', title: 'Article An' }
    ],
    items: [
      { id: 1, eng: 'apple', ru: 'яблоко', correctColumn: 'articleAn' },
      { id: 2, eng: 'banana', ru: 'банан',correctColumn: 'articleA' },
      { id: 3, eng: 'orange', ru: 'апельсин', correctColumn: 'articleAn' },
      { id: 4, eng: 'car', ru: 'машина',correctColumn: 'articleA' },
      { id: 5, eng: 'umbrella', ru: 'зонтик', correctColumn: 'articleAn' },
      { id: 6, eng: 'house', ru: 'дом',correctColumn: 'articleA' }
    ]
  },
  animals: {
    title: "Домашние и Дикие Животные",
    instructions: "Распределите животных по категориям",
    columns: [
      { id: 'domestic', title: '🐶 Домашние' },
      { id: 'wild', title: '🐯 Дикие' }
    ],
    items: [
      { id: 1, word: 'cat', correctColumn: 'domestic' },
      { id: 2, word: 'lion', correctColumn: 'wild' },
      { id: 3, word: 'dog', correctColumn: 'domestic' },
      { id: 4, word: 'elephant', correctColumn: 'wild' },
      { id: 5, word: 'parrot', correctColumn: 'domestic' }
    ]
  }

}
export default sortingWordsData

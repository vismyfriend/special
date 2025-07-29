export const dresserGameData = {
  testQuicklyData: {
    parts: {
      head: [
        new URL("../assets/images/dresserGameHead1.png", import.meta.url).href,
        new URL("../assets/images/dresserGameHead2.png", import.meta.url).href,
      ],
      body: [
        new URL("../assets/images/dresserGameCharacter1.png", import.meta.url).href,
        new URL("../assets/images/dresserGameCharacter2.png", import.meta.url).href,
      ],
      legs: [
        new URL("../assets/images/legs3.png", import.meta.url).href,
        new URL("../assets/images/legs3.png", import.meta.url).href,
      ],
      feet: [
        new URL("../assets/images/dresserGameShoes1.png", import.meta.url).href,
        new URL("../assets/images/dresserGameShoes2.png", import.meta.url).href,
      ],
      soil: [
        new URL("../assets/images/legs3.png", import.meta.url).href,
        new URL("../assets/images/legs3.png", import.meta.url).href,
      ],
      base: [
        new URL("../assets/images/casseyAndPolina.png", import.meta.url).href,
      ]
    },
    categories: [
      { name: 'head', label: 'Головной убор' },
      { name: 'body', label: 'Одежда' },
      { name: 'legs', label: 'Штаны' },
      { name: 'feet', label: 'Обувь' },
      { name: 'soil', label: 'подошва' }
    ]
  },
  animal: {
    // аналогичная структура для животных
  },
  alien: {
    // структура для пришельцев
  }
}

export default dresserGameData

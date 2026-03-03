// casinoData.js
export const dataGame4Sentences = {
  // Урок 1: Местоимения + глагол to be + прилагательные
  lesson1: {
    name: "Lesson 1: I am big, You are small",
    pronouns: [
      { word: "I", ru: "Я", type: "pronoun" },
      { word: "You", ru: "Ты/Вы", type: "pronoun" },
      { word: "We", ru: "Мы", type: "pronoun" },
      { word: "They", ru: "Они", type: "pronoun" }
    ],
    verbs: [
      { word: "am", ru: "есть (я)", type: "verb", onlyWith: ["I"] },
      { word: "are", ru: "есть (ты/мы/они)", type: "verb", onlyWith: ["You", "We", "They"] }
    ],
    adjectives: [
      { word: "big", ru: "большой", type: "adjective" },
      { word: "small", ru: "маленький", type: "adjective" },
      { word: "good", ru: "хороший", type: "adjective" }
    ]
  },

  // Урок 2: Добавляем остальные местоимения, is и новые прилагательные
  lesson2: {
    name: "Lesson 2: He is happy",
    pronouns: [
      { word: "He", ru: "Он", type: "pronoun" },
      { word: "She", ru: "Она", type: "pronoun" },
      { word: "It", ru: "Оно", type: "pronoun" }
    ],
    verbs: [
      { word: "is", ru: "есть (он/она/оно)", type: "verb", onlyWith: ["He", "She", "It"] }
    ],
    adjectives: [
      { word: "bad", ru: "плохой", type: "adjective" },
      { word: "happy", ru: "счастливый", type: "adjective" }
    ]
  },

  // Урок 3: Добавляем глагол have/has и существительные
  lesson3: {
    name: "Lesson 3: I have a car",
    verbs: [
      { word: "have", ru: "иметь", type: "verb", onlyWith: ["I", "You", "We", "They"] },
      { word: "has", ru: "имеет", type: "verb", onlyWith: ["He", "She", "It"] }
    ],
    nouns: [
      { word: "a car", ru: "машина", type: "noun" },
      { word: "a house", ru: "дом", type: "noun" },
      { word: "a dog", ru: "собака", type: "noun" }
    ]
  },

  // Урок 4: Добавляем новые глаголы и существительные
  lesson4: {
    name: "Lesson 4: I like coffee",
    verbs: [
      { word: "like", ru: "нравиться", type: "verb" },
      { word: "love", ru: "любить", type: "verb" },
      { word: "want", ru: "хотеть", type: "verb" }
    ],
    nouns: [
      { word: "coffee", ru: "кофе", type: "noun" },
      { word: "tea", ru: "чай", type: "noun" },
      { word: "a cat", ru: "кот", type: "noun" }
    ],
    adjectives: [
      { word: "hot", ru: "горячий", type: "adjective" },
      { word: "cold", ru: "холодный", type: "adjective" }
    ]
  },

  // Урок 5: Добавляем наречия
  lesson5: {
    name: "Lesson 5: I always drink coffee",
    verbs: [
      { word: "drink", ru: "пить", type: "verb" },
      { word: "eat", ru: "есть", type: "verb" }
    ],
    nouns: [
      { word: "bread", ru: "хлеб", type: "noun" },
      { word: "water", ru: "вода", type: "noun" },
      { word: "a book", ru: "книга", type: "noun" }
    ],
    adverbs: [
      { word: "always", ru: "всегда", type: "adverb" },
      { word: "never", ru: "никогда", type: "adverb" },
      { word: "often", ru: "часто", type: "adverb" }
    ]
  },// Урок про животных:
  lesAnimals: {
    name: "Module Animals: I love cats",
    verbs: [
      { word: "Tiger", ru: "тигр", type: "noun" },
      { word: "Lion", ru: "лев", type: "noun" }
    ],
    nouns: [
      { word: "milk", ru: "молоко", type: "noun" },
      { word: "meat", ru: "мясо", type: "noun" },
    ],
  }
};

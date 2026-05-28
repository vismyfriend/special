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

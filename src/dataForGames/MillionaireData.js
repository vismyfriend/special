
const MillionaireData = {


  pattern: [
    {
      text: "2 + 2 x 2 = ?",
      options: {
        A: "8",
        B: "12",
        C: "6",
        D: "14"
      },
      correctAnswer: "C",
    },
    {
      text: "My teacher's name is _______.",
      options: {
        A: "Winston",
        B: "Vinsent",
        C: "Wincent",
        D: "Vincent",
      },
      correctAnswer: "D",
    },
    {
      text: " Сколько дверей в предложении : Он стоял у ДВЕри ?",
      options: {
        A: "One door",
        B: "Two doors",
        C: "Many doors",
        D: "ДВЕри - doors",
      },
      correctAnswer: "A",
    },
  ],
  pronounsA01: [
    {
      text: "My friend ___ not study well.",
      options: {
        A: "do",
        B: "does",
        C: "is",
        D: "are"
      },
      correctAnswer: "B",
    },
    {
      text: "She ___ to school every day.",
      options: {
        A: "go",
        B: "goes",
        C: "going",
        D: "went"
      },
      correctAnswer: "B",
    },
    {
      text: "___ you like coffee?",
      options: {
        A: "Do",
        B: "Does",
        C: "Is",
        D: "Are"
      },
      correctAnswer: "A",
    },
    {
      text: "They ___ play football on weekends.",
      options: {
        A: "doesn't",
        B: "don't",
        C: "isn't",
        D: "aren't"
      },
      correctAnswer: "B",
    },
    {
      text: "He ___ his homework in the evening.",
      options: {
        A: "do",
        B: "does",
        C: "doing",
        D: "did"
      },
      correctAnswer: "B",
    },
    {
      text: "Where ___ she work?",
      options: {
        A: "do",
        B: "does",
        C: "is",
        D: "are"
      },
      correctAnswer: "B",
    },
    {
      text: "We ___ watching TV right now.",
      options: {
        A: "don't",
        B: "doesn't",
        C: "aren't",
        D: "isn't"
      },
      correctAnswer: "C",
    },
    {
      text: "I ___ breakfast at 8 AM every day.",
      options: {
        A: "have",
        B: "has",
        C: "having",
        D: "had"
      },
      correctAnswer: "A",
    },
    {
      text: "___ he speak English well?",
      options: {
        A: "Do",
        B: "Does",
        C: "Is",
        D: "Are"
      },
      correctAnswer: "B",
    },
    {
      text: "The children ___ to the park on Sundays.",
      options: {
        A: "go",
        B: "goes",
        C: "going",
        D: "went"
      },
      correctAnswer: "A",
    },
    {
      text: "What time ___ you usually wake up?",
      options: {
        A: "do",
        B: "does",
        C: "is",
        D: "are"
      },
      correctAnswer: "A",
    },
    {
      text: "It ___ rain much in this city.",
      options: {
        A: "don't",
        B: "doesn't",
        C: "isn't",
        D: "aren't"
      },
      correctAnswer: "B",
    },
    {
      text: "My parents ___ in London.",
      options: {
        A: "live",
        B: "lives",
        C: "living",
        D: "lived"
      },
      correctAnswer: "A",
    },
    {
      text: "___ they have a car?",
      options: {
        A: "Do",
        B: "Does",
        C: "Is",
        D: "Are"
      },
      correctAnswer: "A",
    },
    {
      text: "She ___ not understand the question.",
      options: {
        A: "do",
        B: "does",
        C: "is",
        D: "are"
      },
      correctAnswer: "B",
    }
  ],
  possessivePronounsA1: [
    {
      text: "What bird can't fly?",
      questionPicture: new URL("../assets/images/birds.jpg", import.meta.url).href,
      audio: new URL('../assets/audio/b1-test-30-1.mp3', import.meta.url).href,

      options: {
        A: "Ostrich фыв ыфв фыв фвы фы вфы вфы вфы вфы вфы в",
        B: "Eagle фыв фы вфы вфыв фы вфы в фыв фы вф ы в",
        C: "Seagul фыв ывфывфывфывфывфывфыв  ыфв фыв фы ",
        E: "Seagul фыв ывфывфывфывфывфывфыв  ыфв фыв фы ",
        F: "Seagul фыв ывфывфывфывфывфывфыв  ыфв фыв фы ",
        D: "Kiwi фыв фы вфы вф вфы фыв фыв "
      },
      correctAnswer: "A",
    },
    {
      text: "What bird can fly?",
      options: {
        A: "Ostrich",
        B: "Chicken",
        C: "Penguin",
        D: "Sparrow"
      },
      correctAnswer: "D",
    },
  ],

}

export default MillionaireData

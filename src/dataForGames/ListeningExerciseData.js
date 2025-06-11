export default {
  mainDescription: "Тренировка произношения",
  tasks: [
    {
      audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
      taskDescription: "Послушайте и ответьте True или False.",
      taskID: "true_false",
      questions: [
        {
          text: "He is going to the concert.",
          correctAnswer: "true"
        },
        {
          text: "His sister is going to the concert.",
          correctAnswer: "false"
        }
      ]
    },
    {
      audio: new URL('../assets/audio/Without Me Audio.m4a', import.meta.url).href,
      taskDescription: "Послушайте и выберите верный ответ.",
      taskID: "multiple_choice",
      questions: [
        {
          text: "Как человек доберется до концерта?",
          options: {
            A: "by car",
            B: "by bus",
            C: "by bike",
            D: "by plane"
          },
          correctAnswer: "A"
        },
        {
          text: "Какая погода?",
          options: {
            A: "good",
            B: "bad",
            C: "windy"
          },
          correctAnswer: "C"
        },
        {
          text: "Какая дела??",
          options: {
            A: "good",
            B: "bad",

          },
          correctAnswer: "A"
        }
      ]
    }
  ]
}

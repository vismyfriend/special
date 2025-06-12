export default {
  mainDescription: "B1 listening 1",
  tasks: [
    {
      audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
      taskDescription: "Послушайте и ответьте True или False.",
      taskID: "true_false",
      taskPicture: null,
      questions: [
        {
          text: "There is a big baseball game today.",
          correctAnswer: "false"
        },
        {
          text: "There is a traffic jam on the freeway.",
          correctAnswer: "true"
        },
        {
          text: "Taxis usually don’t come very quickly.",
          correctAnswer: "false"
        },
        {
          text: "Kevin lives close to Harry.",
          correctAnswer: "true"
        },
        {
          text: "The traffic is backing up because a traffic light is broken.",
          correctAnswer: "true"
        },
        {
          text: "The weather is not so good.",
          correctAnswer: "false"
        },
      ]
    },
    {
      audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
      taskDescription: "Послушайте и выберите верный ответ.",
      taskID: "multiple_choice",
      taskPicture: 'src/assets/images/listeningPicture1.jpg',
      questions: [
        {
          text: "Как мужчина доберется туда?",
          options: {
            A: "Vincent will drive him",
            B: "by car",
            C: "on foot",
            D: "by bicycle",
            E: "by bus"
          },
          correctAnswer: "A"
        },
        {
          text: "Каким способом добраться быстрее?",
          options: {
            A: "by subway",
            B: "by taxi",
            C: "on foot",
            D: "by bicycle",
          },
          correctAnswer: "A"
        },
        {
          text: "Как они доберутся?",
          options: {
            A: "Vincent will drive them",
            B: "by taxi",
            C: "on foot",
            D: "by electric scooters",

          },
          correctAnswer: "B"
        },
        {
          text: "Как он доберется до дома?",
          options: {
            A: "his friend will drive him",
            B: "his friend will give him a car",
            C: "he will ride a bike",
            D: "his friend will call a taxi",
          },
          correctAnswer: "A"
        },
        {
          text: "Какой самый быстрый способ сегодня?",
          options: {
            A: "by subway",
            B: "by taxi",
            C: "by bicycle",
            D: "on a horse",
          },
          correctAnswer: "A"
        },
        {
          text: "Как она доберется?",
          options: {
            A: "by bike",
            B: "by taxi",
            C: "on foot",
            D: "by an electric scooter",
          },
          correctAnswer: "A"
        },
      ]
    }
  ]
}

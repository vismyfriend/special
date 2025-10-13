
const pnqwData = {

  pattern: {
    mainDescription: "It's a very secret mission",
    tasks: [
      {
        usefulWords: null,
        taskDescription: "Нажми на слова в правильном порядке",
        taskID: "pnqw",
        taskPicture: new URL("../assets/images/vincentOnKayak.jpg", import.meta.url).href,
        questions: [
          {
            text: "У меня классная училка",
            positiveStatement: "I have a cool teacher",
            negativeStatement: 'I don`t have a cool teacher',
            questionStatement: 'Do I have a cool teacher?',
            openQuestionStatement: "Why do I have a cool teacher?",
          },
          {
            text: "Мои друзья из Австралии",
            positiveStatement: 'My friends are from Australia',
            negativeStatement: 'My friends are not from Australia',
            questionStatement: 'Are my friends from Australia?',
            openQuestionStatement: "Where are my friends from?",
          },
        ]
      },
    ]
  },
  testQuicklyData: {
    mainDescription: "It's a very secret mission",
    tasks: [
      {
        usefulWords: null,
        taskDescription: "Восстановите порядок слов",
        taskID: "pnqw",
        taskPicture: new URL("../assets/images/vincentOnKayak.jpg", import.meta.url).href,
        questions: [
          {
            text: "У меня классная училка",
            positiveStatement: "I have a cool teacher",
            negativeStatement: 'I don`t have a cool teacher',
            questionStatement: 'Do I have a cool teacher?',
            openQuestionStatement: "Why do I have a cool teacher?",
          },
          {
            text: "Мои друзья из Австралии",
            positiveStatement: 'My friends are from Australia',
            negativeStatement: 'My friends are not from Australia',
            questionStatement: 'Are my friends from Australia?',
            openQuestionStatement: "Where are my friends from?",
          },
        ]
      },
    ]
  },
}

export default pnqwData

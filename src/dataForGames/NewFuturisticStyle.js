
const NewFuturisticStyleData = {

  testQuicklyData: {
    mainDescription: "Another Super Task For Special Agents",
    tasks: [
      {
        usefulWords: null,
        taskDescription: "Впишите подходящий tag (уточняющий хвостик вопрос)",
        taskID: "tag-questions",
        taskPicture: null,
        questions: [
          {
            text: "Vincent is not a girl, ___?",
            correctAnswer: "is he?",
            explanation: 'Предложение отрицательное, значит хвостик вопрос должен быть положительный, ну и Винсент это мальчик = он! Да же?'

          },
          {
            text: "Phoebe /фИби/ is Vincent's wife, ___? (имя женское)" ,
            correctAnswer: "isn`t she?",
            explanation: 'предложение утвердительное, значит хвостик (tag) отрицательный, она его жена, не так ли?'

          },
          {
            text: "These questions are simple, ___?",
            correctAnswer: "aren`t they?",
            explanation: 'эти вопросы = они = they. Начало предложения утвердительное, значит хвостик отрицательный, разве нет?'

          },


        ]
      },
    ]
  },
  tagQuestionsA1: {
    mainDescription: "New Task For Special Agents",
    tasks: [
      {
        usefulWords: null,
        taskDescription: "Впишите подходящий tag",
        taskID: "tag-questions",
        taskPicture: new URL("../assets/images/vincentOnKayak.jpg", import.meta.url).href,
        questions: [
          {
            text: "Vincent isn`t in this picture, ___?",
            correctAnswer: "is he?",
            explanation: 'Vincent - это он - поэтому he - предложение отрицательное, значит хвостик (tag) положительный. Перевод : Винсента нет на этой фотографии, или же есть?'

          },
          {
            text: "Phoebe is Vincent's wife, ___?",
            correctAnswer: "isn`t she?",
            explanation: 'предложение утвердительное, значит хвостик (tag) отрицательный, она его жена, не так ли?'

          },
          {
            text: "These questions are simple, ___?",
            correctAnswer: "aren`t they?",
            explanation: 'эти вопросы = они = поэтому they = предложение утвердительное, значит хвостик (tag) отрицательный, не так ли?'

          },
          {
            text: "Anna is happy today, ___?",
            correctAnswer: "isn't she?",
            explanation: "Анна сегодня счастлива, разве нет? (утвердительное предложение, значит хвостик=уточнение отрицательный)"
          },
          {
            text: "They aren't at home, ___?",
            correctAnswer: "are they?",
            explanation: "Их нет дома, или дома они? (отрицательное начало 'aren't' → хвостик 'are they')"
          },
          {
            text: "Tom plays football, ___?",
            correctAnswer: "doesn't he?",
            explanation: "Том играет в футбол, да? (утвердительное с глаголом → хвостик 'doesn't')"
          },
          {
            text: "You don't like coffee, ___?",
            correctAnswer: "do you?",
            explanation: "Ты не любишь кофе, так? (отрицательное с 'don't' → хвостик 'do')"
          },
          {
            text: "She went to school, ___?",
            correctAnswer: "didn't she?",
            explanation: "Она ходила в школу, или не ходила? (утвердительное в прошлом → хвостик отрицательный)"
          },
          {
            text: "We studied Maths, ___?",
            correctAnswer: "didn't we?",
            explanation: "Мы изучали математику, или не изучали мы?)"
          },
          {
            text: "It's sunny today, ___?",
            correctAnswer: "isn't it?",
            explanation: "Сегодня солнечно, да? (утвердительное с 'is' → хвостик 'isn't')"
          },
          {
            text: "You aren't tired, ___?",
            correctAnswer: "are you?",
            explanation: "Ты сейчас не уставший, верно? (tired - прилагательное, а не глагол)"
          },
          {
            text: "Dogs love meat, ___?",
            correctAnswer: "don't they?",
            explanation: "Собаки любят мясо, да? (утвердительное с глаголом → хвостик 'don't')"
          },
          {
            text: "He doesn't speak French, ___?",
            correctAnswer: "does he?",
            explanation: "Он не говорит по-французски, так? (отрицательное с 'doesn't' → хвостик 'does')"
          },
          {
            text: "They visited Paris, ___?",
            correctAnswer: "didn't they?",
            explanation: "Они посетили Париж, да? (утвердительное в прошлом → хвостик 'didn't')"
          },
          {
            text: "I'm not your enemy, ___?",
            correctAnswer: "am I?",
            explanation: "Я тебе не враг, да?"
          },
          {
            text: "The bus stops here, ___?",
            correctAnswer: "doesn't it?",
            explanation: "Автобус останавливается здесь, да? (утвердительное с глаголом → хвостик 'doesn't')"
          },
          {
            text: "You were happy, ___?",
            correctAnswer: "weren't you?",
            explanation: "Ты был счастлив, да? (утвердительное с 'were' → хвостик 'weren't')"
          },
          {
            text: "She didn't call, ___?",
            correctAnswer: "did she?",
            explanation: "Она не звонила, верно? (отрицательное с 'didn't' → хвостик 'did')"
          },
          {
            text: "We're early, ___?",
            correctAnswer: "aren't we?",
            explanation: "Мы пришли рано, да? (утвердительное с 'are' → хвостик 'aren't')"
          },
          {
            text: "Coffee is hot, ___?",
            correctAnswer: "isn't it?",
            explanation: "Кофе горячий, или же нет? ( в английском кофе это оно = it)"
          }

        ]
      },
    ]
  },


}

export default NewFuturisticStyleData

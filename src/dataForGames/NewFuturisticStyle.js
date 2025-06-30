
const NewFuturisticStyleData = {

  testQuicklyData: {
    mainDescription: "New Task For Special Agents",
    tasks: [
      {
        usefulWords: 'is he? - isn`t he? , are they? - aren`t they?',
        taskDescription: "Впишите подходящий tag",
        taskID: "tag-questions",
        taskPicture: null,
        questions: [
          {
            text: "Vincent is not a very stupid teacherka, ___?",
            correctAnswer: "is he?",
            explanation: 'Vincent - это он - поэтому he - предложение отрицательное, значит хвостик (tag) положительный, или же он глуп?'

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
            text: "It is not correct tag, ___",
            correctAnswer: "is it?",
            explanation: 'предложение отрицательное, значит хвостик (tag) положительный, да же?'

          },
          {
            text: "I am smart ___",
            correctAnswer: "aren`t I?",
            explanation: 'это исключение тут нужно просто запомнить, что про себя и только про себя мы всегда спрашиваем - aren`t I? разве я нет?'

          },
          {
            text: "Everyone’s ready to go, ___",
            correctAnswer: "aren’t they?",
            explanation: "Everyone считается единственным, но tag ставим с 'they' и предложение положительное — значит отрицательный tag."
          },
          {
            text: "Let’s be reasonable, ___",
            correctAnswer: "shall we?",
            explanation: "После 'let’s' всегда используется tag 'shall we?'."
          },
          {
            text: "There’s no place like home, ___",
            correctAnswer: "is there?",
            explanation: "Это утвердительное предложение с 'there is', значит нужен отрицательный tag 'is there?'."
          },
          {
            text: "Alan never took his work seriously, ___",
            correctAnswer: "did he?",
            explanation: "Отрицательное предложение ('never'), значит tag должен быть положительным — 'did he?'."
          },
          {
            text: "Patricia hardly said a word, ___",
            correctAnswer: "did she?",
            explanation: "'Hardly' делает предложение отрицательным, значит tag будет положительным — 'did she?'."
          },
          {
            text: "Nobody has seen my wallet, ___",
            correctAnswer: "have they?",
            explanation: "'Nobody' — это отрицание, поэтому tag положительный и с 'they'."
          },
          {
            text: "Everyone has secrets, ___",
            correctAnswer: "don’t they?",
            explanation: "'Everyone' — единственное число, но tag идёт с 'they'. Положительное предложение — значит отрицательный tag."
          },
          {
            text: "That’s such a shame, ___",
            correctAnswer: "isn’t it?",
            explanation: "Положительное предложение — значит отрицательный tag 'isn’t it?'."
          },
          {
            text: "Nothing surprises you anymore, ___",
            correctAnswer: "does it?",
            explanation: "'Nothing' — отрицание, значит tag положительный — 'does it?'."
          },
          {
            text: "Nearly everyone came to the meeting, ___",
            correctAnswer: "didn’t they?",
            explanation: "Почти все — это положительное утверждение, значит tag будет отрицательным — 'didn’t they?'."
          },
          {
            text: "I’m being silly, ___",
            correctAnswer: "aren’t I?",
            explanation: "Исключение: к 'I am' мы используем 'aren’t I?' как tag."
          },
          {
            text: "Someone knocked at the door, ___",
            correctAnswer: "didn’t they?",
            explanation: "'Someone' считается как 'they' в tag'ах. Положительное предложение — отрицательный tag."
          },
          {
            text: "Let’s try again, ___",
            correctAnswer: "shall we?",
            explanation: "После 'let’s' всегда ставим 'shall we?'."
          },
          {
            text: "Everything is just perfect, ___",
            correctAnswer: "isn’t it?",
            explanation: "Положительное предложение, значит tag — отрицательный 'isn’t it?'."
          },
          {
            text: "It’s no use, ___",
            correctAnswer: "is it?",
            explanation: "Выражение с отрицанием ('no use') — значит tag положительный 'is it?'."
          },
          {
            text: "This was a total waste of time, ___",
            correctAnswer: "wasn’t it?",
            explanation: "Положительное предложение — значит tag будет отрицательным 'wasn’t it?'."
          },
          {
            text: "Don’t come home late, ___",
            correctAnswer: "will you?",
            explanation: "После повелительного наклонения с 'don’t' tag — 'will you?'."
          }

        ]
      },
    ]
  },
  tagQuestionsA1: {
    mainDescription: "New Task For Special Agents",
    tasks: [
      {
        usefulWords: 'is he? - isn`t he? , are they? - aren`t they?',
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

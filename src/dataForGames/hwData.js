// Данные для домашних заданий
export const homeworkData = {
  'patterns': {
    missionName: 'Примеры заданий :',
    description: 'Шаблоны заданий :',
    tasks: [
      {
        type: 'tableFill',
        title: 'Заполни таблицу',
        cols: 3,
        rows: 13,
        cells: {
          // === Заголовки ===
          a1: { text: 'кто', colspan: 1, rowspan: 2 },
          b1: { text: 'глагол', colspan: 1, rowspan: 2 },
          c1: { text: 'всё остальное', format: ['spoiler', 'strikethrough', 'bold'], colspan: 1, rowspan: 2 },

          // === Группа I ===
          a3: { text: 'I', rowspan: 2 },
          b3: { answers: ['am', "am not", "'m"], rowspan: 2 },
          c3: { text: 'here', rowspan: 2 },

          // строка 5 — пустая (разделитель), ничего не описываем

          a6: { text: 'he' },
          b6: { answers: ['is'], rowspan: 3 },
          c6: { text: 'here' },

          a7: { text: 'she' },
          c7: { text: 'here' },

          a8: { text: 'it' },
          c8: { text: 'here' },

          // строка 9 — пустая (разделитель)

          a10: { text: 'you' },
          b10: { answers: ['are'], rowspan: 3 },
          c10: { text: 'here' },

          a11: { text: 'we' },
          c11: { text: 'here' },

          a12: { text: 'they' },
          c12: { text: 'here' }
        }
      },
      {
        type: 'fillInTheBlank',
        title: 'fill in the blanks - заполнить пропуски',
        text: '1) You __ good people.',
        answers: [["are", "aren't"]]
      },
      {
        type: 'fillInTheBlank',
        text: '2) I _ a good person.',
        answers: [["am", "am not", "'m", "'m not"]]
      },
      {
        type: 'fillInTheBlank',
        text: '3) Vincent and I ___ friends.',
        answers: [["are", "aren't"]]   // ✅ один пропуск — один массив
      },
      {
        type: 'doTheMagic',
        title: 'Do the magic',

        question: 'Винсент мой друг',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ["Vincent is my friend", "Vincent is my best friend",],
          negative: ["Vincent is not my friend"],
          question: ['is V my friend?'],
          openQuestion: ['Who is my friend?', 'Who is Vincent?', 'Why is V my friend?'],
          answer: ['because he is the best teacher']
        },
      },
      {
        type: 'text',
        title: 'Напишите русский перевод',
        question: '1. - "Hi everybody"',
        answers: ['Привет всем','привет каждому','всем привет','привет все','привет каждое тело','привет каждому телу',],
        placeholder: 'нажмите чтобы писать...'
      },
      {
        type: 'text',
        title: 'Напишите инглиш перевод',

        question: '2. - "Это моя домашка"',
        hint1: '"it" и "this" одно и тоже',
        answers: ["It's my h/w",'It is my homework','This is my homework',],
        placeholder: 'нажмите чтобы писать...'
      },
      {
        type: 'textarea',
        title: 'Здесь можно ошибаться!',
        hint1: '"чтобы" по-английски - "to"',
        hint2: '/ ай стади инглиш ту трэвэл /',
        question: 'Напишите почему или зачем вы учите английский:',
        placeholder: 'нажмите и пишите...'
      },
      {
        type: 'tableFill',
        title: 'Irregular verbs',
        // размеры в клетках (1 клетка = 20px)
        cols: 4,        // a, b, c, d
        rows: 6,        // 1, 2, 3
        cells: {
          // заголовки занимают 1 и 2 строки
          a1: { text: 'past', rowspan: 2 },
          b1: { text: 'present', rowspan: 2 },
          c1: { text: 'perfect', rowspan: 2 },
          d1: { text: 'перевод', rowspan: 2 },

          // строка 3
          a3: { text: 'do' },
          b3: { answers: ['did'] },
          c3: { answers: ["done"] },
          d3: { text: 'делать' },

          // строка 4
          a4: { text: '/ ду / ' },
          b4: { text: '/ дид / ' },
          c4: { text: '/ дан / '  },

          // строка 4
          a5: { text: '/ гоу / ' },
          b5: { text: '/ уэнт / ' },
          c5: { text: '/ ган / '  },

          // строка 5
          a6: { answers: ['go', 'go, went, gone'] },
          b6: { answers: ['went'] },
          c6: { answers: ['gone'] },
          d6: { answers: ['идти', 'ехать','направляться','ходить','иди','иду'] }
        }
      },
      {
        taskDescription: 'Включить аудио и вписать слова пропущенные...',
        type: 'articleWordsInput',
        title: 'Listening',
        usefulWords: 'let me - позвольте мне, share with you - поделиться с вами',
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        taskAudio: new URL('../assets/audio/songs/hello_how_are_you.mp3', import.meta.url).href,
        articleScript: `Hello friends! Let me (share with you) a few words about my favorite card game! The first game is (anyIsOkay). But the second game (is) called 'Twenty One'.`
      }
    ]
  },
  'chain1': {
    missionName: 'Просто начни с начала',
    description: 'мои записи - my notes',
    chainOfTasks: true,   // <-- задания отображаются по мере выполнения
    tasks: [
      {
        title: 'Прочитай вслух :',
        type: 'articleWordsInput',
        articleScript: `
        [май нОУтс['bold']] - так правильно произносить и переводить [мои записи['bold']]

        [май нОУтс, май нОУтс, май нОУтс['spoiler']]


        А как это пишется английскими буквами? Напиши здесь -> (my notes) <- если не знаешь как, то подсказка в самой первой строчке этой электронной тетради, перепиши от туда) `

      },
      {
        title: 'верно! вы супер! you are super',
        type: 'tableFill',
        cols: 3,
        rows: 15,
        cells: {
          // === Заголовки ===
          a1: { text: 'кто ?', colspan: 1, rowspan: 2 },
          b1: { text: 'произношение', colspan: 1, rowspan: 2 },
          c1: { text: 'как пишется?', colspan: 1, rowspan: 2 },

          a3: { text: 'вы'},
          b3: { text: 'ю', format: ['bold'] },
          c3: { text: 'you'},

          a4: { text: 'они'},
          b4: { text: 'дэй', format: ['bold'] },
          c4: { text: 'they'},

          a5: { text: 'мы'},
          b5: { text: 'уи', format: ['bold'] },
          c5: { text: 'we'},

          a7: { text: 'я' },
          b7: { answers: ['ай'] },
          c7: { text: 'i' },

          a9: { text: 'это' },
          b9: { text: 'ит', format: ['bold']  },
          c9: { answers: ['it', 'this'] },

          a10: { answers: ['он'] },
          b10: { text: 'хи', format: ['bold']  },
          c10: { text: 'he' },

          a11: { answers: ['она'] },
          b11: { text: 'щи', format: ['bold'] },
          c11: { text: 'she' },

          a13: { text: 'пробуй заполнить пропуски в таблице', colspan: 3 },
          // a13: { text: 'посмотреть ответы :сдаюсь, не знаю, показать ответы ', colspan: 3 },
          a14: { text: 'или сдавайся и смотри ответы', colspan: 3 },
          a15: { text: 'снизу вверх (она, он, it, ай) ',format: ['spoiler'], colspan: 3 },

        }
      },
      {
        type: 'fillInTheBlank',
        title: 'Запиши к себе в тетрадь:',
        text: 'I, you, we, they, he, she, it - это все местоимения (в английском языке их всего _ (напиши цифру от 1 до 10))',
        answers: [["7", "семь","seven"]]
      },
      {
        type: 'text',
        title: 'нужно запомнить:',
        question: '" Ты " и " Вы " в английском языке одно и тоже слово "YOU". На английском невозможно обращаться к человеку неуважительно на ТЫ или уважтельно на ВЫ. это особенность русского языка, в английском такого нет, поэтому ты и вы одно слово и произносится коротко / Ю /. Напишите это местоимение еще раз чтобы потренироваться :',
        answers: ['you'],
        placeholder: 'нажмите здесь и напишите you'
      },
      {
        type: 'fillInTheBlank',
        title: 'заполнить пропуски',
        items: [
          { text: '1) I love __ - я люблю тебя.', answers: [["you", "u"]] },
          { text: '2) I love __ - я люблю вас.', answers: [["you", "u"]] },
          { text: '3) You __ English - ты любишь английский / ю лав инглиш /', answers: [["love", "like"]] },
          { text: '4) You __ English - вы любите английский / ю лав инглиш /', answers: [["love", "like"]] },
          { text: '5) Who are __ - ТЫ кто?', answers: [["you", "u"]] },
          { text: '6) Who are __ - кто вы?', answers: [["you", "u"]] },
          { text: '7) Who are __ - вы кто?', answers: [["you", "u"]] },
          { text: '8) /ху а ю/ так английском произносится вопрос who are you? напишите как переводится этот вопрос на русский ____', answers: [["кто ты", "кто вы", "вы кто", "ты кто", "кто вы такой", "кто вы такие", "кто вы и кто ты", "кто ты или кто вы"]] },

        ]
      },
      {
        type: 'tableFill',
        cols: 2,
        rows: 13,
        showGrid: false,
        cells: {
          // === Заголовки ===
          a2: { text: 'местоимения', rowspan: 1 },
          b2: { text: 'на инглише', rowspan: 1 },

          a4: { text: 'ты = вы'},
          b4: { text: 'you', format: ['bold'] },

          a5: { text: 'мы'},
          b5: { text: 'we', format: ['bold'] },

          a6: { text: 'они'},
          b6: { answers: ['they'] },

          a8: { text: 'я' },
          b8: { text: 'i', format: ['bold'] },

          a10: { text: 'он' },
          b10: { text: 'he', format: ['bold'] },

          a11: { text: 'она' },
          b11: { text: 'she', format: ['bold'] },

          a12: { text: 'оно = это'},
          b12: { answers: ['it', 'this'] },
        }
      },
      {
        type: 'hardcodedLink',
        path: '/see-all-sets-of-words/pronouns0/millionaire',
        title: 'Хватит писать, пора отдохнуть!',
        text: 'Отдохнуть можно кликнув вот по этой ссылке:',
        icon: '🍿',
        placeholder: 'Введи свой результат...'
      },
    ]
  },
  'chain': {
    missionName: 'A new task will appear after you do this task :',
    description: 'новое задание появится после выполнения прошлого задания :',
    chainOfTasks: true,   // <-- задания отображаются по мере выполнения
    tasks: [
      {
        type: 'articleWordsInput',
        articleScript: `Hello friends! Let me (share with you) a few [words['bold']] about my day. This is a [very important['spoiler']] lesson for everyone. Please [do not forget['strikethrough']] your homework! My favorite [card game['bold','spoiler','strikethrough']] is Twenty One. You can write [anything['bold']] here — it is (anyIsOkay).`      },
      {
        title: 'Заполни таблицу',
        type: 'tableFill',
        cols: 3,
        rows: 13,
        cells: {
          // === Заголовки ===
          a1: { text: 'кто', colspan: 1, rowspan: 2 },
          b1: { text: 'глагол', colspan: 1, rowspan: 2 },
          c1: { text: 'всё остальное', format: ['spoiler', 'strikethrough', 'bold'], colspan: 1, rowspan: 2 },

          // === Группа I ===
          a3: { text: 'I', rowspan: 2 },
          b3: { answers: ['am', "am not", "'m"], rowspan: 2 },
          c3: { text: 'here', rowspan: 2 },

          // строка 5 — пустая (разделитель), ничего не описываем

          a6: { text: 'he' },
          b6: { answers: ['is'], rowspan: 3 },
          c6: { text: 'here' },

          a7: { text: 'she' },
          c7: { text: 'here' },

          a8: { text: 'it' },
          c8: { text: 'here' },

          // строка 9 — пустая (разделитель)

          a10: { text: 'you' },
          b10: { answers: ['are'], rowspan: 3 },
          c10: { text: 'here' },

          a11: { text: 'we' },
          c11: { text: 'here' },

          a12: { text: 'they' },
          c12: { text: 'here' }
        }
      },
      {
        type: 'fillInTheBlank',
        title: 'fill in the blanks - заполнить пропуски',
        items: [
          { text: '1) You __ good people.',                          answers: [["are", "aren't"]] },
          { text: '2) I _ a good person.',                            answers: [["am", "am not", "'m", "'m not"]] },
          { text: '3) Vincent and I ___ friends.',                    answers: [["are", "aren't"]] },
          { text: '4) Vincent ___ a funny teacher.',                  answers: [["is", "isn't"]] },
          { text: '5) It ___ a beautiful day.',                       answers: [["is", "isn't"]] },
          { text: '6) We ___ ready for the lesson.',                  answers: [["are", "aren't"]] }
        ]
      },
      {
        type: 'fillInTheBlank',
        title: 'fill in the blanks - заполнить пропуски',
        text: '1) You __ good people.',
        answers: [["are", "aren't"]]
      },
      {
        type: 'fillInTheBlank',
        text: '2) I _ a good person.',
        answers: [["am", "am not", "'m", "'m not"]]
      },
      {
        type: 'fillInTheBlank',
        text: '3) Vincent and I ___ friends.',
        answers: [["are", "aren't"]]   // ✅ один пропуск — один массив
      },

      {
        type: 'fillInTheBlank',
        text: '4) Vincent ___ a funny teacher.',
        answers: [["is", "isn't"]]
      },
      {
        type: 'doTheMagic',
        title: 'Do the magic',

        question: 'Винсент мой друг',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ["Vincent is my friend", "Vincent is my best friend",],
          negative: ["Vincent is not my friend"],
          question: ['is V my friend?'],
          openQuestion: ['Who is my friend?', 'Who is Vincent?', 'Why is V my friend?'],
          answer: ['because he is the best teacher']
        },
      },
      {
        type: 'text',
        title: 'Напишите русский перевод',
        question: '1. - "Hi everybody"',
        answers: ['Привет всем','привет каждому','всем привет','привет все','привет каждое тело','привет каждому телу',],
        placeholder: 'нажмите чтобы писать...'
      },
      {
        type: 'text',
        title: 'Напишите инглиш перевод',

        question: '2. - "Это моя домашка"',
        hint1: '"it" и "this" одно и тоже',
        answers: ["It's my h/w",'It is my homework','This is my homework',],
        placeholder: 'нажмите чтобы писать...'
      },
      {
        type: 'doTheMagic',
        title: 'Do the magic',

        question: 'Винсент мой друг',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ["Vincent is my friend", "Vincent is my best friend",],
          negative: ["Vincent is not my friend"],
          question: ['is V my friend?'],
          openQuestion: ['Who is my friend?', 'Who is Vincent?', 'Why is V my friend?'],
          answer: ['because he is the best teacher']
        },
      },
      {
        type: 'doTheMagic',
        title: 'Do the magic',

        question: 'Винсент мой друг',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ["Vincent is my friend", "Vincent is my best friend",],
          negative: ["Vincent is not my friend"],
          question: ['is V my friend?'],
          openQuestion: ['Who is my friend?', 'Who is Vincent?', 'Why is V my friend?'],
          answer: ['because he is the best teacher']
        },
      },
      {
        type: 'doTheMagic',
        title: 'Do the magic',

        question: 'Винсент мой друг',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ["Vincent is my friend", "Vincent is my best friend",],
          negative: ["Vincent is not my friend"],
          question: ['is V my friend?'],
          openQuestion: ['Who is my friend?', 'Who is Vincent?', 'Why is V my friend?'],
          answer: ['because he is the best teacher']
        },
      },
      {
        type: 'doTheMagic',
        title: 'Do the magic',

        question: 'Винсент мой друг',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ["Vincent is my friend", "Vincent is my best friend",],
          negative: ["Vincent is not my friend"],
          question: ['is V my friend?'],
          openQuestion: ['Who is my friend?', 'Who is Vincent?', 'Why is V my friend?'],
          answer: ['because he is the best teacher']
        },
      },

      {
        type: 'textarea',
        title: 'Здесь можно ошибаться!',
        hint1: '"чтобы" по-английски - "to"',
        hint2: '/ ай стади инглиш ту трэвэл /',
        question: 'Напишите почему или зачем вы учите английский:',
        placeholder: 'нажмите и пишите...'
      },
      {
        type: 'tableFill',
        title: 'Irregular verbs',
        // размеры в клетках (1 клетка = 20px)
        cols: 4,        // a, b, c, d
        rows: 6,        // 1, 2, 3
        cells: {
          // заголовки занимают 1 и 2 строки
          a1: { text: 'past', rowspan: 2 },
          b1: { text: 'present', rowspan: 2 },
          c1: { text: 'perfect', rowspan: 2 },
          d1: { text: 'перевод', rowspan: 2 },

          // строка 3
          a3: { text: 'do' },
          b3: { answers: ['did'] },
          c3: { answers: ["done"] },
          d3: { text: 'делать' },

          // строка 4
          a4: { text: '/ ду / ' },
          b4: { text: '/ дид / ' },
          c4: { text: '/ дан / '  },

          // строка 4
          a5: { text: '/ гоу / ' },
          b5: { text: '/ уэнт / ' },
          c5: { text: '/ ган / '  },

          // строка 5
          a6: { answers: ['go', 'go, went, gone'] },
          b6: { answers: ['went'] },
          c6: { answers: ['gone'] },
          d6: { answers: ['идти', 'ехать','направляться','ходить','иди','иду'] }
        }
      },
      {
        taskDescription: 'Включить аудио и вписать слова пропущенные...',
        type: 'articleWordsInput',
        title: 'Listening',
        usefulWords: 'let me - позвольте мне, share with you - поделиться с вами',
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        taskAudio: new URL('../assets/audio/songs/hello_how_are_you.mp3', import.meta.url).href,
        articleScript: `Hello [friends[spoiler']]! Let me (share with you) a few [words['bold']] about my [favorite card game!['spoiler','strikethrough']] The first game is (anyIsOkay). But the second game (is) called 'Twenty One'.`
      }
    ]
  },
  'article-thinking-b2': {
    missionName: 'Thinking in English (B2)',
    description: 'Прочитай текст и впиши пропущенные слова:',
    tasks: [
      {
        type: 'articleWordsInput',
        // title: 'Reading & Vocabulary (B2)',
        taskDescription: 'Слушай аудио и вписывай пропущенные слова',
        usefulWords: [
          { eng: 'wondered why', ru: 'удивлялись почему' },
          { eng: 'be able to', ru: 'быть способным' },
          { eng: 'reason', ru: 'причина' },
          { eng: 'fluency', ru: 'беглость' },
          { eng: 'unnatural', ru: 'неестественный' },
          { eng: 'automatic', ru: 'автоматический' },
          { eng: 'surround', ru: 'окружать' },
          { eng: 'familiar', ru: 'знакомый' },
          { eng: 'rhythm', ru: 'ритм' },
          { eng: 'confident', ru: 'уверенный' },
          { eng: 'adjust', ru: 'приспосабливаться' }
        ],
        // можно добавить картинку, если есть
        // taskPicture: new URL('../assets/images/thinkingGirl.png', import.meta.url).href,
        // taskAudio: new URL('../assets/audio/songs/hello_how_are_you.mp3', import.meta.url).href,
        articleScript: `
        Have you ever (wondered why) thinking in English feels so hard? Even after learning so many words and grammar rules? You may (be able to) read English, write English, and understand others perfectly. But when you try to form your own thoughts in English, it suddenly feels like a wall is standing in your way.

        The (reason) is simple. Your brain is still translating your thoughts before producing English. Most learners practice reading, writing, listening, and speaking. The real secret to (fluency) is training your mind to think in English directly. And the best part? You don't need to start with complicated English. Start with very small thoughts.

        Start training your inner voice, the little voice inside your head that talks to you every day. For example, when you wake up, don't translate the thought. Simply tell yourself, "I need to brush my teeth".

        When you walk outside, describe what you see in simple English. At first, it may feel slow, strange, or even (unnatural). But the more you practice, the faster those thoughts become, become (automatic). Eventually, your brain starts producing English without stopping to translate.

        Another powerful trick is to (surround) yourself with English as much as possible. Think of your brain like a sponge. The more English you hear, the more (familiar) it becomes. Don't keep English trapped inside a short study session. Make it part of your daily life. Listen to English, even when you don't understand every single word. Your ears are learning the (rhythm), tone, and natural flow of English.

        But thinking in English isn't only about vocabulary. It's also about habits and ways of expressing ideas. English often feels easier when your thoughts are short, simple, and direct. If you build long, complicated thoughts in your first language and then translate them, your brain has much more work to do. Instead, imagine you're texting a friend. Keep your English natural and straight to the point.

        And here's something important: stop being afraid of mistakes. Your thoughts are private. Nobody can hear them. That makes your mind the perfect place to practice. Your goal isn't perfect grammar at first. Your goal is to keep your brain moving in English. I'm making breakfast. You can make this habit even stronger by speaking to yourself in English when you're alone. For example, while cooking, describe exactly what you're doing. I'm cutting the vegetables. I'm adding salt. It smells good. While walking, simply describe what you see and feel around you. These tiny sentences may seem simple, but they connect your real life directly to English.

        Visualization is another powerful tool. Don't connect a new English word only to its translation. Connect the English word directly to an image or meaning in your mind. This removes the translation step and makes your thinking faster. Immersion helps too. Create little situations where English becomes your default. Change your phone language to English. Write your shopping list in English. Send yourself short messages in English. Yes, it may feel strange at first. That's exactly how your brain begins adapting. Remember, thinking in English doesn't happen in one day. It's a skill, and skills grow with practice. And the reward is worth it. You'll speak faster, understand more clearly, and feel more (confident). You stop treating English like just another subject. It becomes something you actually use. So next time you catch yourself translating, pause. Try forming the thought directly in English. Start small, be patient, and keep practicing. Your brain will gradually (adjust). And one day, without even realizing it, you'll discover that English has become a natural part of the way you think.`
      }
    ]
  },
  'VVVincent': {
    missionName: 'Моя электронная тетрадь',
    description: 'My digital notebook',
    tasks: [
      {
        type: 'tableFill',
        title: 'Заполни таблицу - прошедшее время - PAST',
        cols: 3,
        rows: 13,
        cells: {
          // === Заголовки ===
          a1: { text: 'кто', colspan: 1, rowspan: 2 },
          b1: { text: 'глагол', colspan: 1, rowspan: 2 },
          c1: { text: 'всё остальное', format: ['spoiler', 'strikethrough', 'bold'], colspan: 1, rowspan: 2 },

          // === Группа I ===
          a3: { text: 'I', rowspan: 2 },
          b3: { answers: ['was',"wasn't"], rowspan: 2 },
          c3: { text: 'here', rowspan: 2 },

          // строка 5 — пустая (разделитель), ничего не описываем

          a6: { text: 'he' },
          b6: { answers: ['was',"wasn't"], rowspan: 3 },
          c6: { text: 'here' },

          a7: { text: 'she' },
          c7: { text: 'here' },


          a8: { text: 'it' },
          c8: { text: 'here' },

          // строка 9 — пустая (разделитель)

          a10: { text: 'you' },
          b10: { answers: ['were',"weren't"], rowspan: 3 },
          c10: { text: 'here' },

          a11: { text: 'we' },
          c11: { text: 'here' },

          a12: { text: 'they' },
          c12: { text: 'here' }
        }
      },
      {
        type: 'fillInTheBlank',
        title: 'fill in the blanks - заполнить пропуски',
        text: "1) I don't like __ in the blanks (мне не нравится заполнять пропуски)",
        answers: [["to fill", "filling"]]
      },
      {
        type: 'fillInTheBlank',
        text: '2) __ likes to fill in the blanks! (Никому не нравится заполнять пропуски!)',
        answers: [["nobody", "no one"]]
      },
      {
        type: 'fillInTheBlank',
        text: '3) Why _ Vincent create this task? (Зачем он создал это задание?)',
        answers: [["did"]]
      },
      {
        type: 'fillInTheBlank',
        text: '4) Where _ you yesterday? (Где ты был вчера?)',
        answers: [["were"]]
      },
      {
        type: 'fillInTheBlank',
        text: '5) You __ home !(Тебя не было дома!)',
        answers: [["weren't"]]
      },
      {
        type: 'doTheMagic',
        title: 'переведи письменно',

        question: 'Это было легко!',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ["it was easy", "this was easy", "this was simple", "it was simple", "this was light", "it was light",],
          negative: [
            "it was not easy",
            "this was not easy",
            "it was not simple",
            "this was not simple",
            "it was not light",
            "this was not light",
          ],
          question: [
            "was it easy?",
            "was this easy?",
            "was it simple?",
            "was this simple?",
            "was it light?",
            "was this light?"
          ],
          openQuestion: ['What was easy?', 'Who whom was it easy?', 'Who whom was this easy?'],
          answer: ['because Vincent is a cool teacher']
        },
      },
      {
        type: 'doTheMagic',
        title: 'Do the magic',

        question: 'Винсент и я были друзьями',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ["Vincent and I were friends", "We were friends",],
          negative: ["Vincent and I were not friends", "We were not friends",],
          question: ["Were Vincent and I friends?", "Were we friends",],
          openQuestion: ['Who were friends?', 'Who was my friend?'],
          answer: ['because we are cool people']
        },
      },
      {
        type: 'tableFill',
        title: 'Irregular verbs',
        // размеры в клетках (1 клетка = 20px)
        cols: 4,        // a, b, c, d
        rows: 8,        // 1, 2, 3
        cells: {
          // заголовки занимают 1 и 2 строки
          a1: { text: 'past', rowspan: 2 },
          b1: { text: 'present', rowspan: 2 },
          c1: { text: 'perfect', rowspan: 2 },
          d1: { text: 'перевод', rowspan: 2 },

          // строка 3
          a3: { text: 'do' },
          b3: { answers: ['did'] },
          c3: { answers: ["done"] },
          d3: { text: 'делать' },

          // строка 4
          a4: { text: '/ ду / ' },
          b4: { text: '/ дид / ' },
          c4: { text: '/ дан / '  },

          // строка 4
          a5: { text: '/ гоу / ' },
          b5: { text: '/ уэнт / ' },
          c5: { text: '/ ган / '  },


          // строка 5
          a6: { answers: ['go', 'go, went, gone'] },
          b6: { answers: ['went'] },
          c6: { text: 'gone' },
          d6: { answers: ['идти', 'ехать','направляться','ходить','иди','иду'] },

          // строка 6
          a7: { answers: ['catch'] },
          b7: { answers: ['caught'] },
          c7: { answers: ['caught'] },
          d7: { text: 'ловить'  },
          // строка 4
          a8: { text: '/ кэтч / ' },
          b8: { answers: ['кот'] },
          c8: { answers: ['/кот/'] },
        }
      },
      {
        type: 'textarea',
        title: 'Финалочка! Almost finish',
        hint1: '"чтобы" по-английски - "to"',
        hint2: '/ ай стади инглиш ту трэвэл /',
        question: 'Напишите на английском фидбэк ( отзыв) любые два-три предложения про эту электронную тетрадь. Например - Почему вам понравилось или почему не понравилось? Было ли это полезно? Твоя обратная связь is very important for Vincent)',
        placeholder: 'нажмите и пишите...'
      },

    ]
  },

  'irregular-table-test': {
    missionName: 'Irregular verbs table',
    description: 'Заполните таблицу:',
    tasks: [
      {
        type: 'tableFill',
        title: 'Irregular verbs',
        // размеры в клетках (1 клетка = 20px)
        cols: 4,        // a, b, c, d
        rows: 6,        // 1, 2, 3
        cells: {
          // заголовки занимают 1 и 2 строки
          a1: { text: 'past', rowspan: 2 },
          b1: { text: 'present', rowspan: 2 },
          c1: { text: 'perfect', rowspan: 2 },
          d1: { text: 'перевод', format: ['spoiler', 'strikethrough', 'bold'], rowspan: 2 },

          // строка 3
          a3: { text: 'do' },
          b3: { answers: ['did'] },
          c3: { answers: ["done"] },
          d3: { text: 'делать' },

          // строка 4
          a4: { text: '/ ду / ' },
          b4: { text: '/ дид / ' },
          c4: { text: '/ дан / '  },

          // строка 4
          a5: { text: '/ гоу / ' },
          b5: { text: '/ уэнт / ' },
          c5: { text: '/ ган / '  },

          // строка 5
          a6: { answers: ['go', 'go, went, gone'] },
          b6: { answers: ['went'] },
          c6: { answers: ['gone'] },
          d6: { answers: ['идти', 'ехать','направляться','ходить','иди','иду'] }
        }
      }
    ]
  },
  'doTheMagic': {
    missionName: 'Writing (variant 1)',
    description: 'Do the magic - мЭджик',
    tasks: [
      {
        type: 'doTheMagic',
        question: 'Мы хорошие студенты',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ["We are good students"],
          negative: ['We are not good students', "We aren't good students"],
          question: ['Are we good students?'],
          openQuestion: ['Who are good students?', 'What are we?'],
          answer: ['Yes, we are', 'No, we are not', "No, we aren't"]
        }
      },
      {
        type: 'doTheMagic',
        question: 'Он починит мой телефон завтра',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ['He will fix my phone tomorrow', "He'll fix my phone tomorrow"],
          negative: ['He will not fix my phone tomorrow', "He won't fix my phone tomorrow"],
          question: ['Will he fix my phone tomorrow?'],
          openQuestion: ['What will he fix tomorrow?', 'When will he fix my phone?'],
          answer: ['Yes, he will', "No, he won't"]
        }
      },
      {
        type: 'doTheMagic',
        question: 'Она купит айфон',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ['she will buy an iphone'],
          negative: ["she won't buy an iphone"],
          question: ['Will she buy an iphone?'],
          openQuestion: ['Who will buy an iphone?', 'What will she buy?', 'What phone will she buy?'],
          answer: ['because she likes iphones']
        }
      }
    ]
  },
  'doTheMagic2': {
    missionName: 'Порядок если в ноутбук то порядок и in your head тоже',
    description: 'Do the magic - мЭджик',
    tasks: [
      {
        type: 'doTheMagic',
        question: 'У меня хороший учитель',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ["I have a good teacher"],
          negative: ["I don't have a good teacher"],
          question: ['Do I have a good teacher?'],
          openQuestion: ['Who do I have?', 'What teacher do I have?'],
          answer: ["His name is Vincent"]
        }
      },
      {
        type: 'doTheMagic',
        question: 'У вас красивые руки',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ["You have beautiful arms", "You have beautiful hands"],
          negative: ["You don't have beautiful arms", "You don't have beautiful hands"],
          question: ['Do you have beautiful arms?', "Do you have beautiful hands?"],
          openQuestion: ['Why do you have beautiful arms?', "Why do you have beautiful hands?"],
          answer: ['because I like English!']
        }
      },
      {
        type: 'doTheMagic',
        question: 'Английский легкий',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ['English is easy'],
          negative: ["English is not easy"],
          question: ['is English easy?'],
          openQuestion: ['Why is English easy?'],
          answer: ['because I study it with Vincent']
        }
      }
    ]
  },
  'test': {
    missionName: 'Синигами:',
    agentName: 'Нажмите здесь и введите имя',
    title: 'Первое задание',
    description: 'Переведи письменно:',
    tasks: [
      {
        type: 'text',
        question: '1. - Привет всем',
        answers: ['Hello everybody','Hi everyone',],
        placeholder: 'нажмите чтобы писать...'
      },
      {
        type: 'text',

        question: '2. - Это моя домашка',
        answers: ['It is my homework','This is my homework',],
        placeholder: 'нажмите чтобы писать...'
      },
      {
        type: 'text',
        question: '3. - Всем пока',
        answers: ['Goodbye everybody','Bye everyone',],
        placeholder: 'нажмите чтобы писать...'
      },
    ],
  },
  'offline': {
    missionName: 'Off-line',
    description: 'Interview',
    tasks: [

      // ===== 1. ПЕРЕВОД КАРТ (6 предложений, без подсказок) =====
      {
        type: 'text',
        title: 'Переведите карты',
        question: '1. десятка черви',
        answers: ['a ten of hearts', 'the ten of hearts'],
        placeholder: 'нажмите чтобы писать...'
      },
      {
        type: 'text',
        question: '2. туз пики',
        answers: ['an ace of spades', 'the ace of spades'],
        placeholder: 'нажмите чтобы писать...'
      },
      {
        type: 'text',
        question: '3. дама крести',
        answers: ['a queen of clubs', 'the queen of clubs'],
        placeholder: 'нажмите чтобы писать...'
      },
      {
        type: 'text',
        question: '4. король буби',
        answers: ['a king of diamonds', 'the king of diamonds'],
        placeholder: 'нажмите чтобы писать...'
      },
      {
        type: 'text',
        question: '5. валет пики',
        answers: ['a jack of spades', 'the jack of spades'],
        placeholder: 'нажмите чтобы писать...'
      },
      {
        type: 'text',
        question: '6. пятёрка черви',
        answers: ['a five of hearts', 'the five of hearts'],
        placeholder: 'нажмите чтобы писать...'
      },

      // ===== 2. DO THE MAGIC (3 задания) =====
      {
        type: 'doTheMagic',
        title: 'Do the magic',
        question: 'У меня есть 1 домашнее животное',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ['I have a pet'],
          negative: ["I don't have a pet"],
          question: ['Do I have a pet?'],
          openQuestion: ['What do I have?', 'Who has a pet?', "What pet do I have?"],
          answer: ['Yes, I do', "No, I don't"]
        }
      },
      {
        type: 'doTheMagic',
        question: 'Я коллекционирую воспоминания / мЭмориз / memories)',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ['I collect memories'],
          negative: ["I don't collect memories", 'I do not collect memories'],
          question: ['Do I collect memories?'],
          openQuestion: ['What do I collect?', 'Who collects memories?'],
          answer: ['Yes, I do', "No, I don't"]
        }
      },
      {
        type: 'doTheMagic',
        question: 'У моего друга есть машина',
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        correct: {
          positive: ['My friend has a car', 'My friend has 1 car'],
          negative: ["My friend doesn't have a car", 'My friend does not have a car'],
          question: ['Does my friend have a car?'],
          openQuestion: ['What does my friend have?', 'Who has a car?'],
          answer: ['Yes, he does', "No, he doesn't"]
        }
      },

      // ===== 3. FILL IN THE BLANKS — WILL =====
      {
        type: 'fillInTheBlank',
        title: 'Вставьте will',
        text: "1) If I don't do homework, my teacher __ kick me.",
        answers: [['will',"won't"]]
      },
      {
        type: 'fillInTheBlank',
        text: '2) __ you help me?',
        answers: [['Will']]
      },
      {
        type: 'fillInTheBlank',
        text: '3) Wow, it is an awesome day, we __ sleep and relax all day!',
        answers: [['will',"won't"]]
      },

      // ===== 4. FREE WRITING =====
      {
        type: 'textarea',
        title: 'Free writing',
        question: 'Напишите 2 вещи, которые вы обещаете сделать завтра ( I promise I will ... , и 2 вещи, которые вы обещаете никогда не делать в жизни: I promise I ...',
        placeholder: 'нажмите и пишите...'
      },
    ]
  }
};

// Получить задание по имени миссии
export const getHomework = (missionName) => {
  return homeworkData[missionName] || null;
};

// Получить все доступные миссии
export const getAllMissions = () => {
  return Object.keys(homeworkData).map(key => ({
    id: key,
    ...homeworkData[key]
  }));
};

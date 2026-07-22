
const GameTestsSeedData = {

  testQuicklyData: {
    mainDescription: "Test Level A2",
    tasks: [
      {
        taskDescription: 'Read out loud, choose the best variant',
        audio: null,
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/listeningPicture1.jpg", import.meta.url).href,
        textScript: 'пояснения к этому заданию отсутствуют пока что, но Винсент работает над тем, чтобы они появились',
        questions: [
          {
            text: "Вопросы и ответы перемешаны каждый раз когда заходите в тест, чтобы труднее было списать или скопировать у друзей",
            options: {
              A: "answer 1",
              B: "answer 2",
              C: "answer 3",
              D: "answer 4",
              E: "answer 5",
            },
            correctAnswer: "D",
            explanation: 'давайте разберемся почему это правильный ответ'
          },
          {
            text: "Вопрос 2 + 2 = ?",
            options: {
              A: "1",
              B: "2",
              C: "3",
              D: "4",
              E: "5",
            },
            correctAnswer: "D",
            explanation: 'ну типа потому что калькулятор так посчитал и все'
          },
          {
            text: "What is your favorite color?",
            options: {
              A: "1",
            },
            correctAnswer: "A",
            explanation: 'какой твой любимый цвет?'
          },
        ]
      },

    ]
  },
  patternNEWCODEtest: {
    mainDescription: "V-IS-MY-DEBUGGER",
    tasks: [

      {
        taskID: "student_input",
        questions: [
          {
            text: "what were you doing yesterday? _",
            correctAnswer: "anyIsOk",
            almostCorrectAnswers: ["laibreri", "librery", "libreri"]
          },
          {
            text: "what were you doing yesterday? __",
            correctAnswer: "library",
            almostCorrectAnswers: ["laibreri", "librery", "libreri"]
          },
          {
            text: "what were you doing yesterday? ___",
            correctAnswer: "library",
            almostCorrectAnswers: ["laibreri", "librery", "libreri"]
          },
          {
            text: "what were you doing yesterday? ____",
            correctAnswer: "library",
            almostCorrectAnswers: ["laibreri", "librery", "libreri"]
          },
          {
            text: "what were you doing yesterday? ____",
            correctAnswer: "library",
            almostCorrectAnswers: ["laibreri", "librery", "libreri"]
          },
          {
            text: "B) Go straight on. Go past the traffic lights. You'll see a shop ___. Go past that and it’s on the right next to the shop.",
            correctAnswer: "on the right",
            almostCorrectAnswers: null
          },
          {
            text: 'C) ___ on. Go past the traffic lights and go straight on until you get to the roundabout. At the roundabout turn left. Go past the theatre. It’s the building next to the theatre, opposite the hospital',
            correctAnswer: "go straight",
            almostCorrectAnswers: ["go straight on"]
          },
          {
            text: 'D) Go straight on. Go past the traffic lights and ___ right on to King’s Road. Go past the bookshop. It’s the building next to the bookshop opposite the café.',

            correctAnswer: "take the second",
            almostCorrectAnswers: ["take"]
          },

        ]
      },

      {
        taskDescription: "Послушайте и ответьте",
        taskID: "true_false",
        usefulWords: 'useful - полезные , words - слова , special - /спэшл/ особенный',
        audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
        taskPicture: new URL("../assets/images/listeningPicture1.jpg", import.meta.url).href,
        textScript: 'текст к этому заданию отсутствует пока что, но Винсент работает над тем, чтобы он появился',
        questions: [
          {
            text: "1. Vincent is a nice teacherka",
            correctAnswer: "true"
          },
          {
            text: "2. This audio is about this photo",
            correctAnswer: "false"
          },
          {
            text: "3. This audio is about this photo",
            correctAnswer: "false"
          },
        ]
      },
      {
        taskDescription: "спэшл таск фор спэшл эйджэнст",
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/thinkAboutItTPNG.jpg", import.meta.url).href,
        questions: [
          {
            text: "1Как переводится слово -> special ?",
            options: {
              A: "я не знаю как",
              B: "особенный",
              C: "специальный",
              D: "специи",
              E: "скидка",
            },
            correctAnswer: ["B","C"],
            explanation: "спэшл - особенный, особый или специальный"

          },
          {
            text: "1Ответь себе честно - тебе лично нравится вообще английский?",
            options: {
              A: "ну так себе",
              B: "I likes",
              C: "I not like",
              D: "Не нравится, но надо",
              E: "Мне нравится",
              F: "причем здесь это вообще...",
              G: "Ой всё, до свидания",
            },
            correctAnswer: ["A","D","E"]
          },
          {
            text: "Как переводится слово -> special ?",
            options: {
              A: "я не знаю как",
              B: "1особенный",
              C: "специальный",
              D: "специи",
              E: "скидка",
            },
            correctAnswer: ["B","C"],
            explanation: "спэшл - особенный, особый или специальный"

          },
          {
            text: "Ответь себе честно - тебе лично нравится вообще английский?",
            options: {
              A: "1ну так себе",
              B: "I likes",
              C: "I not like",
              D: "Не нравится, но надо",
              E: "Мне нравится",
              F: "причем здесь это вообще...",
              G: "Ой всё, до свидания",
            },
            correctAnswer: ["A","D","E"]
          },
          {
            text: "Как переводится слово -> special ?",
            options: {
              A: "я не знаю как",
              B: "особенный",
              C: "специальный",
              D: "специи",
              E: "скидка",
            },
            correctAnswer: ["B","C"],
            explanation: "спэшл - особенный, особый или специальный"

          },
          {
            text: "Ответь себе честно - тебе лично нравится вообще английский?",
            options: {
              A: "ну так себе",
              B: "I likes",
              C: "I not like",
              D: "Не нравится, но надо",
              E: "Мне нравится",
              F: "причем здесь это вообще...",
              G: "Ой всё, до свидания",
            },
            correctAnswer: ["A","D","E"]
          },
        ]
      },
      {
        taskDescription: "Внимательность и произношение :",
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/thinkAboutItTPNG.jpg", import.meta.url).href,
        questions: [
          {
            text: "Как произносится -> special ?",
            options: {
              A: "СПЕЦИАЛ",
              B: "СПЕСИАЛ",
              C: "СПЕКАЛ",
              D: "СПЭШЛ",
              E: "я не знаю как",
            },
            correctAnswer: ["D",]
          },
        ]
      },


    ],
  },
  testPattern: {
    mainDescription: "Let's find out the weak spots",
    tasks: [
      {
        taskDescription: 'Read out loud, choose the best variant',
        audio: null,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: null,
        questions: [
          {
            text: "Вопрос",
            options: {
              A: "answer",
              B: "answer",
              C: "answer",
              D: "answer",
              E: "answer",
            },
            correctAnswer: "D",
            explanation: 'давайте разберемся почему это правильный ответ'
          },
        ]
      },

    ]
  },
  examVariant1: {
    mainDescription: "Let's find out the weak spots",
    tasks: [
      {
        taskDescription: 'Советик from Vincentik: читайте ответы вслух - если звучит хорошо, то возможно ответ верный... но это не точно =)',
        audio: null,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: null,
        questions: [
          {
            text: "What time ___?",
            options: {
              A: "has the lesson start",
              B: "the lesson start",
              C: "did the lesson start",
              D: "does the lesson start"
            },
            correctAnswer: "C",
            explanation: 'Правильный ответ "C" - Past Simple для вопросов о прошедшем времени'
          },
          {
            text: "Is he going to buy you a dog? Yes, he ___.",
            options: {
              A: "does",
              B: "do",
              C: "is",
              D: "going"
            },
            correctAnswer: "C",
            explanation: 'Краткий ответ требует глагола "to be" (is)'
          },
          {
            text: "He'll be here ___ Sunday.",
            options: {
              A: "in",
              B: "on",
              C: "at",
              D: "to"
            },
            correctAnswer: "B",
            explanation: 'Предлог "on" используется с днями недели'
          },
          {
            text: "Sam ___ her glasses!",
            options: {
              A: "always lose",
              B: "is always losing",
              C: "always is losing",
              D: "is losing"
            },
            correctAnswer: "B",
            explanation: 'Правильная конструкция Present Continuous + always для раздражения'
          },
          {
            text: "I enjoy ___ to music.",
            options: {
              A: "listen",
              B: "to listen",
              C: "listening",
              D: "am listening"
            },
            correctAnswer: "C",
            explanation: 'После глагола "enjoy" используется -ing форма'
          },
          {
            text: "___ TV.",
            options: {
              A: "I not often watch",
              B: "I don't watch often",
              C: "Often don't watch I",
              D: "I don't often watch"
            },
            correctAnswer: "D",
            explanation: 'Правильный порядок слов в отрицательном предложении'
          },
          {
            text: "I ___ tall.",
            options: {
              A: "amn't",
              B: "am not",
              C: "both are correct"
            },
            correctAnswer: "B",
            explanation: 'Правильная отрицательная форма глагола "to be"'
          },
          {
            text: "A: Have you seen Jenny? B: She's in the bedroom. She ___ a nap.",
            options: {
              A: "has",
              B: "is doing",
              C: "is making",
              D: "is having"
            },
            correctAnswer: "D",
            explanation: 'Правильное выражение "to have a nap"'
          },
          {
            text: "Can you look after the ___ dog while we are on holiday?",
            options: {
              A: "children's",
              B: "childrens'",
              C: "childrens's"
            },
            correctAnswer: "A",
            explanation: 'Правильная форма притяжательного падежа множественного числа'
          },
          {
            text: "Did you buy ___ good toys?",
            options: {
              A: "some",
              B: "any",
              C: "anything",
              D: "a"
            },
            correctAnswer: "B",
            explanation: '"Any" используется в вопросах'
          },
          {
            text: "I went to university in ___ morning.",
            options: {
              A: "a",
              B: "an",
              C: "the",
              D: "-"
            },
            correctAnswer: "C",
            explanation: 'Определенный артикль с временами дня'
          },
          {
            text: "My ___ daughter is two years old.",
            options: {
              A: "brothers",
              B: "brothers'",
              C: "brother's",
              D: "brother"
            },
            correctAnswer: "C",
            explanation: 'Притяжательный падеж единственного числа'
          },
          {
            text: "There ___ a dog and two cats in the room.",
            options: {
              A: "are",
              B: "is",
              C: "some"
            },
            correctAnswer: "B",
            explanation: 'Глагол согласуется с первым существительным (a dog)'
          },
          {
            text: "Where ___?",
            options: {
              A: "he goes",
              B: "does he goes",
              C: "does he go",
              D: "is he go"
            },
            correctAnswer: "C",
            explanation: 'Правильный порядок слов в вопросе Present Simple'
          },
          {
            text: "He ___ cleaning his room tonight.",
            options: {
              A: "is going to",
              B: "will",
              C: "is"
            },
            correctAnswer: "C",
            explanation: 'Present Continuous для запланированных действий'
          },
          {
            text: "I don't have ___ money after the weekend.",
            options: {
              A: "few",
              B: "a few",
              C: "much",
              D: "many"
            },
            correctAnswer: "C",
            explanation: '"Much" с неисчисляемыми существительными'
          },
          {
            text: "Jack ___ listens to music.",
            options: {
              A: "is never",
              B: "never",
              C: "doesn't",
              D: "doesn't never"
            },
            correctAnswer: "B",
            explanation: 'Наречие частотности перед основным глаголом'
          },
          {
            text: "He ___ it last Thursday.",
            options: {
              A: "did",
              B: "has done",
              C: "is doing",
              D: "has done"
            },
            correctAnswer: "A",
            explanation: 'Past Simple для завершенных действий в прошлом'
          },
          {
            text: "It ___ snows in Russia",
            options: {
              A: "will",
              B: "often",
              C: "was"
            },
            correctAnswer: "B",
            explanation: 'Наречие частотности для описания повторяющихся действий'
          },
          {
            text: "He ___ play football.",
            options: {
              A: "can't to",
              B: "can't",
              C: "doesn't can to",
              D: "doesn't can"
            },
            correctAnswer: "B",
            explanation: 'Модальный глагол "can" не требует частицы "to"'
          },
          {
            text: "I don't want ___ this film. It's horrible!",
            options: {
              A: "watch",
              B: "to watch",
              C: "to watching",
              D: "watching"
            },
            correctAnswer: "B",
            explanation: 'Глагол "want" требует инфинитива с "to"'
          },
          {
            text: "Were you happy? No, I ___.",
            options: {
              A: "didn't",
              B: "wasn't",
              C: "weren't",
              D: "am not"
            },
            correctAnswer: "B",
            explanation: 'Согласование времен в кратком ответе'
          },
          {
            text: "He ___ to a party next week.",
            options: {
              A: "goes",
              B: "will goes",
              C: "go",
              D: "is going"
            },
            correctAnswer: "D",
            explanation: 'Present Continuous для запланированных будущих действий'
          },
          {
            text: "You ___ drink alcohol when you are a teenager.",
            options: {
              A: "shouldn't",
              B: "don't must to",
              C: "haven't to",
              D: "are always"
            },
            correctAnswer: "A",
            explanation: 'Should not для выражения рекомендации/запрета. Остальные варианты неверны грамматически'
          },
          {
            text: "He is getting married ___.",
            options: {
              A: "yesterday",
              B: "in five days",
              C: "two hours ago",
              D: "last day"
            },
            correctAnswer: "B",
            explanation: 'Указание на будущее время с "in"'
          },
          {
            text: "What ___ do next summer?",
            options: {
              A: "you",
              B: "are you",
              C: "do you",
              D: "are you going to"
            },
            correctAnswer: "D",
            explanation: 'Конструкция "be going to" для планов'
          },
          {
            text: "I'll see you ___ 2.15 p.m.",
            options: {
              A: "in",
              B: "on",
              C: "at",
              D: "to"
            },
            correctAnswer: "C",
            explanation: 'Предлог "at" с точным временем'
          },
          {
            text: "He's ___ paid for it.",
            options: {
              A: "yet",
              B: "still",
              C: "already"
            },
            correctAnswer: "C",
            explanation: '"Already" для завершенных действий'
          },
          {
            text: "Her friends ___ climbed this mountain.",
            options: {
              A: "has",
              B: "have",
              C: "did",
              D: "were"
            },
            correctAnswer: "B",
            explanation: 'Present Perfect с подлежащим во множественном числе'
          },
          {
            text: "How many pets ___?",
            options: {
              A: "are you having",
              B: "do you have",
              C: "have you",
              D: "you have"
            },
            correctAnswer: "B",
            explanation: 'Present Simple для постоянных состояний'
          },
          {
            text: "She thinks she ___ do it",
            options: {
              A: "will",
              B: "going to",
              C: "have to",
              D: "am"
            },
            correctAnswer: "A",
            explanation: '"Will" для спонтанных решений'
          },
          {
            text: "I ___ when my family arrived.",
            options: {
              A: "were cooking",
              B: "cooking",
              C: "cooked",
              D: "was cooking"
            },
            correctAnswer: "D",
            explanation: 'Past Continuous для длительного действия в прошлом'
          },
          {
            text: "My brother __ very well.",
            options: {
              A: "cans drive",
              B: "can drive",
              C: "can drives",
              D: "cans drives"
            },
            correctAnswer: "B",
            explanation: 'Модальный глагол "can" не изменяется'
          },
          {
            text: "I ___ a car",
            options: {
              A: "haven't",
              B: "don't has",
              C: "don't have",
              D: "have not"
            },
            correctAnswer: "C",
            explanation: 'Правильное отрицание Present Simple'
          },
          {
            text: "The car ___ him when he was crossing the street.",
            options: {
              A: "was hitting",
              B: "were hitting",
              C: "hit",
              D: "hitted"
            },
            correctAnswer: "C",
            explanation: 'Past Simple для завершенного действия'
          },
          {
            text: "If you read this book, he ___ happy.",
            options: {
              A: "will be",
              B: "is",
              C: "will",
              D: "be"
            },
            correctAnswer: "A",
            explanation: 'Условное предложение 1 типа (If + Present, Future)'
          },
          {
            text: "I haven't sold my house ___.",
            options: {
              A: "just",
              B: "ever",
              C: "already",
              D: "yet"
            },
            correctAnswer: "D",
            explanation: '"Yet" в отрицательных предложениях'
          },
          {
            text: "There ___ some potatoes there yesterday.",
            options: {
              A: "was",
              B: "were",
              C: "are",
              D: "is"
            },
            correctAnswer: "B",
            explanation: 'Past Simple с подлежащим во множественном числе'
          },
          {
            text: "Where ___?",
            options: {
              A: "were she",
              B: "was she",
              C: "did she be"
            },
            correctAnswer: "B",
            explanation: 'Правильная форма глагола "to be" в Past Simple'
          },
          {
            text: "I studied there when I ___ in Berlin.",
            options: {
              A: "are",
              B: "was",
              C: "were",
              D: "live"
            },
            correctAnswer: "B",
            explanation: 'Согласование времен в Past Simple'
          },
          {
            text: "You ___ today.",
            options: {
              A: "illed",
              B: "are illing",
              C: "are ill",
              D: "ill"
            },
            correctAnswer: "C",
            explanation: 'Прилагательное "ill" с глаголом "to be"'
          },
          {
            text: "We're ___ young people.",
            options: {
              A: "a",
              B: "an",
              C: "the",
              D: "-"
            },
            correctAnswer: "D",
            explanation: 'Нулевой артикль с обобщающим значением'
          },
          {
            text: "If George ___, I will buy this dress.",
            options: {
              A: "don't come",
              B: "doesn't come",
              C: "willn't come",
              D: "won't come"
            },
            correctAnswer: "B",
            explanation: 'Условное предложение 1 типа (If + Present Simple)'
          },
          {
            text: "I ___ you now.",
            options: {
              A: "am understanding",
              B: "understanded",
              C: "understand"
            },
            correctAnswer: "C",
            explanation: 'Глагол "understand" не используется в Continuous'
          },
          {
            text: "Shhhhhh! Be quiet! Your dad ___.",
            options: {
              A: "sleeps",
              B: "is sleep",
              C: "is sleeping",
              D: "sleeping"
            },
            correctAnswer: "C",
            explanation: 'Present Continuous для действий в момент речи'
          }
        ]
      },

    ]
  },
  testForValery: {
    mainDescription: "Let's find out the weak spots",
    tasks: [
      {
        taskDescription: 'Советик from Vincentik: читайте ответы вслух - если звучит хорошо, то возможно ответ верный... но это не точно =)',
        audio: null,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: null,
        questions: [
          {
            text: "I go to work ____ train.",
            options: {
              A: "with",
              B: "by",
              C: "for",
              D: "buy",
              E: "in"
            },
            correctAnswer: ["B","D"],
            explanation: "Когда говоришь каким транспортом добираешься, то используй предлог 'by' Попробуй составить несколько своих примеров про родственников и друзей - кто как добирается до работы? Кто на такси? Кто на автобусе."
          },
          {
            text: "Are you going to the party? – Yes, I ____",
            options: {
              A: "do",
              B: "is",
              C: "am",
              D: "are"
            },
            correctAnswer: "C",
            explanation: "The correct short answer for 'I' is 'am'."
          },
          {
            text: "There aren't ____ here.",
            options: {
              A: "a restaurants",
              B: "any restaurants",
              C: "any restaurant",
              D: "a restaurant"
            },
            correctAnswer: "B",
            explanation: "The correct negative plural form is 'any restaurants'."
          },
          {
            text: "I'm from Paris. ____ is in France.",
            options: {
              A: "They",
              B: "It",
              C: "He",
              D: "She"
            },
            correctAnswer: "B",
            explanation: "The pronoun for a city is 'it'."
          },
          {
            text: "____ are my cups!",
            options: {
              A: "this",
              B: "that",
              C: "it",
              D: "these"
            },
            correctAnswer: "D",
            explanation: "The plural demonstrative pronoun is 'these'."
          },
          {
            text: "____? No, he isn't.",
            options: {
              A: "Are they teachers?",
              B: "Are you from Italy?",
              C: "Is Mr Banning a teacher?",
              D: "Is this your phone?"
            },
            correctAnswer: "C",
            explanation: "The question matches the answer about a male person."
          },
          {
            text: "What is ____?",
            options: {
              A: "job Mary",
              B: "Mary job",
              C: "Mary's job",
              D: "job's Mary"
            },
            correctAnswer: "C",
            explanation: "The correct possessive form is 'Mary's job'."
          },
          {
            text: "When do you play tennis? ____ Mondays.",
            options: {
              A: "On",
              B: "In",
              C: "At",
              D: "By"
            },
            correctAnswer: "A",
            explanation: "The preposition 'on' is used for days."
          },
          {
            text: "My name's Pete and this is Sylvia. ____ doctors from France.",
            options: {
              A: "I'm",
              B: "We're",
              C: "She's",
              D: "They're"
            },
            correctAnswer: "B",
            explanation: "The correct pronoun for 'Pete and Sylvia' is 'We'."
          },
          {
            text: "I don’t have ____ meat.",
            options: {
              A: "many",
              B: "much"
            },
            correctAnswer: "B",
            explanation: "'Meat' is uncountable, so 'much' is correct."
          },
          {
            text: "It's ____.",
            options: {
              A: "a hotel expensive",
              B: "expensive hotel",
              C: "expensive a hotel",
              D: "an expensive hotel"
            },
            correctAnswer: "D",
            explanation: "The correct adjective order is 'an expensive hotel'."
          },
          {
            text: "____ like tea or coffee?",
            options: {
              A: "You",
              B: "Would you",
              C: "You do"
            },
            correctAnswer: "B",
            explanation: "The polite question form is 'Would you like...?'."
          },
          {
            text: "This is my ____ family.",
            options: {
              A: "friend’s",
              B: "friends",
              C: "friend"
            },
            correctAnswer: "A",
            explanation: "The possessive form 'friend’s' is correct."
          },
          {
            text: "____ they live in London?",
            options: {
              A: "Are",
              B: "Is",
              C: "Do",
              D: "Does"
            },
            correctAnswer: "C",
            explanation: "The auxiliary verb for 'they' is 'do'."
          },
          {
            text: "How ____ carrots do they have?",
            options: {
              A: "many",
              B: "a lot of",
              C: "much",
              D: "lots of"
            },
            correctAnswer: "A",
            explanation: "'Carrots' are countable, so 'many' is correct."
          },
          {
            text: "Sorry, I ____ you at the moment.",
            options: {
              A: "can't help",
              B: "don't can help",
              C: "can't helping",
              D: "can't helps"
            },
            correctAnswer: "A",
            explanation: "The correct negative form is 'can't help'."
          },
          {
            text: "Welcome to your new room, and this is your ____.",
            options: {
              A: "new desk",
              B: "the new desk",
              C: "a new desk",
              D: "an new desk"
            },
            correctAnswer: "A",
            explanation: "есть принадлежность ВАШЕ рабочее место - с притяжательными местоимениями не нужны артикли."
          },

          {
            text: "What ____ do after school today?",
            options: {
              A: "are you going to",
              B: "are you",
              C: "do you",
              D: "you"
            },
            correctAnswer: "A",
            explanation: "Чем собираетесь заняться сегодня после школы? (что делаете после школы?) имеем ввиду не вообще каждый день а именно сегодня после школы какие планы?"
          },
          {
            text: "____ two airports in the city.",
            options: {
              A: "It is",
              B: "There is",
              C: "There are",
              D: "This is"
            },
            correctAnswer: "C",
            explanation: "The plural form 'There are' is correct."
          },
          {
            text: "Roy ____ in our company.",
            options: {
              A: "work",
              B: "works",
              C: "is work",
              D: "working"
            },
            correctAnswer: "B",
            explanation: "The correct present simple form is 'works'."
          },
          {
            text: "I have a lot of ____.",
            options: {
              A: "tooths",
              B: "tooth",
              C: "teeth",
              D: "toothes"
            },
            correctAnswer: "C",
            explanation: "The correct plural of 'tooth' is 'teeth'."
          },
          {
            text: "Where’s Steve? He ____ a shower.",
            options: {
              A: "has",
              B: "is having",
              C: "having",
              D: "is have"
            },
            correctAnswer: "B",
            explanation: "The present continuous form is 'is having'."
          },
          {
            text: "Her birthday is ____ 6th May 1979.",
            options: {
              A: "in",
              B: "at",
              C: "on",
              D: "from"
            },
            correctAnswer: "C",
            explanation: "The preposition 'on' is used for specific dates."
          },
          {
            text: "She ____ speaks on the phone.",
            options: {
              A: "never",
              B: "doesn’t",
              C: "isn’t",
              D: "doesn’t never"
            },
            correctAnswer: "A",
            explanation: "The correct adverb placement is 'never speaks'."
          },
          {
            text: "His friends are ____.",
            options: {
              A: "man",
              B: "men",
              C: "mans",
              D: "men’s"
            },
            correctAnswer: "B",
            explanation: "The plural of 'man' is 'men'."
          },
          {
            text: "Who are ____ people?",
            options: {
              A: "this",
              B: "those",
              C: "that",
              D: "a"
            },
            correctAnswer: "B",
            explanation: "The plural demonstrative pronoun is 'those'."
          },
          {
            text: "How many brothers and sisters ____?",
            options: {
              A: "are you having",
              B: "you have",
              C: "have you",
              D: "do you have"
            },
            correctAnswer: "D",
            explanation: "The correct question form is 'do you have'."
          },
          {
            text: "Mary is married to John. He's her ____.",
            options: {
              A: "son",
              B: "husband",
              C: "wife",
              D: "boyfriend"
            },
            correctAnswer: "B",
            explanation: "The correct term is 'husband'."
          },
          {
            text: "There ____ windows in my room.",
            options: {
              A: "are some",
              B: "is some",
              C: "aren’t some",
              D: "is any"
            },
            correctAnswer: "A",
            explanation: "The plural form 'are some' is correct."
          },
          {
            text: "My aunt is going ____ me on Sunday.",
            options: {
              A: "to visiting",
              B: "visit",
              C: "visiting",
              D: "to visit"
            },
            correctAnswer: "D",
            explanation: "The correct infinitive form is 'to visit'."
          },
          {
            text: "The film starts ____ 9 o’clock.",
            options: {
              A: "in",
              B: "at",
              C: "on",
              D: "from"
            },
            correctAnswer: "B",
            explanation: "The preposition 'at' is used for specific times."
          },
          {
            text: "We have ____ sugar in the kitchen.",
            options: {
              A: "a",
              B: "some",
              C: "any",
              D: "many"
            },
            correctAnswer: "B",
            explanation: "'Sugar' is uncountable, so 'some' is correct."
          },
          {
            text: "one potato - two ____.",
            options: {
              A: "potatoes",
              B: "potatos",
              C: "potato’s"
            },
            correctAnswer: "A",
            explanation: "The correct plural is 'potatoes'."
          },
          {
            text: "I don't have ____ milk.",
            options: {
              A: "a",
              B: "some",
              C: "any",
              D: "many"
            },
            correctAnswer: "C",
            explanation: "The negative form for uncountable nouns is 'any'."
          },
          {
            text: "Excuse me, ____ is the T-shirt? It's ₤25.99.",
            options: {
              A: "what expensive",
              B: "how much",
              C: "how many",
              D: "how price"
            },
            correctAnswer: "B",
            explanation: "The correct question for price is 'how much'."
          },
          {
            text: "____ leave early today.",
            options: {
              A: "I like",
              B: "I’d like to",
              C: "I like to"
            },
            correctAnswer: "B",
            explanation: "The polite form is 'I’d like to'."
          },
          {
            text: "We usually ____ shopping to a supermarket.",
            options: {
              A: "make",
              B: "do",
              C: "have",
              D: "go"
            },
            correctAnswer: "D",
            explanation: "The correct collocation is 'go shopping'."
          },
          {
            text: "I'd like ____ omelet, please.",
            options: {
              A: "a",
              B: "an",
              C: "two"
            },
            correctAnswer: "B",
            explanation: "The correct article before a vowel sound is 'an'."
          },
          {
            text: "Do you like French ____?",
            options: {
              A: "kitchen",
              B: "meal",
              C: "food",
              D: "cook"
            },
            correctAnswer: "C",
            explanation: "The correct term is 'French food'."
          },
          {
            text: "Your bag is ____ the table.",
            options: {
              A: "on",
              B: "to",
              C: "in",
              D: "of"
            },
            correctAnswer: "A",
            explanation: "если ответили in - то сумка значит ВНУТРИ стола. Но стол который я представлял себе когда писал это предложение не имеет отверстия куда бы сумку можно было засунуть) Так что правильно ON - на столе. Но и in могло бы быть верно если бы я имел столько же воображения сколько и вы (отправьте мне скриншот этого, а то мне даже интересно увидит ли кто-то когда-то это объяснение. Thank you. Your Vincent!)"
          },
          {
            text: "I'm James Bond!. <Br>- Nice to ____ you, Mr. Bond.",
            options: {
              A: "speak",
              B: "talk",
              C: "meet",
              D: "kisses",
              E: "watch"
            },
            correctAnswer: "C",
            explanation: "The correct phrase is 'Nice to meet you'."
          },
          {
            text: "She's only four years old but she ____.",
            options: {
              A: "can read",
              B: "cans read",
              C: "can reads",
              D: "can to read"
            },
            correctAnswer: "A",
            explanation: "The correct modal verb form is 'can read'."
          },
          {
            text: "My sister wants ____ a dancer.",
            options: {
              A: "be",
              B: "to being",
              C: "to be",
              D: "to is"
            },
            correctAnswer: "C",
            explanation: "The correct infinitive form is 'to be'."
          },
          {
            text: "Mandy is over there. She's ____ a blue T-shirt and jeans.",
            options: {
              A: "having",
              B: "wearing",
              C: "doing",
              D: "walking"
            },
            correctAnswer: "B",
            explanation: "The correct verb for clothes is 'wearing'."
          },

        ]
      },

    ]
  },
  testDeepSeek: {
    mainDescription: "Grammar & Vocabulary Test (30 questions)",
    tasks: [
      {
        taskDescription: 'Совет от Vincentik: читайте ответы вслух - если звучит хорошо, то возможно ответ верный... но это не точно =)',
        audio: null,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: null,
        questions: [
          {
            text: "The concert ___ at 5 o'clock. Don't be late!",
            options: {
              A: "starts",
              B: "will start",
              C: "is starting",
              D: "start"
            },
            correctAnswer: "A",
            explanation: "Present Simple для расписаний и событий по расписанию."
          },
          {
            text: "John is 1 year ___ than me.",
            options: {
              A: "older",
              B: "elder",
              C: "more old",
              D: "old"
            },
            correctAnswer: "A",
            explanation: "Сравнительная степень: older."
          },
          {
            text: "What time ___ me?",
            options: {
              A: "did you call",
              B: "have you called",
              C: "were you calling",
              D: "you called"
            },
            correctAnswer: "A",
            explanation: "Past Simple для вопроса о действии в прошлом."
          },
          {
            text: "Andrew ___ to Italy ___ Monday.",
            options: {
              A: "is flying, on",
              B: "flies, at",
              C: "will fly, in",
              D: "fly, on"
            },
            correctAnswer: "A",
            explanation: "перед днями недели предлог ON - ну а для планов на будущее используем Present Continuous"
          },
          {
            text: "The woman ___ a snake.",
            options: {
              A: "was bitten by",
              B: "was bit by",
              C: "bitten by",
              D: "was bite by"
            },
            correctAnswer: "A",
            explanation: "Past Simple Passive: was bitten by."
          },
          {
            text: "I ___ for 2 hours and she's not here.",
            options: {
              A: "have been waiting",
              B: "have waited",
              C: "am waiting",
              D: "wait"
            },
            correctAnswer: "A",
            explanation: "Present Perfect Continuous для действия, которое длится и результат важен сейчас."
          },
          {
            text: "She would get $100 if she ___ this old chair.",
            options: {
              A: "sold",
              B: "sells",
              C: "would sell",
              D: "will sell"
            },
            correctAnswer: "A",
            explanation: "Second Conditional: if + Past Simple, would + infinitive."
          },
          {
            text: "It is ___ show I've ever seen.",
            options: {
              A: "the worst",
              B: "worst",
              C: "the baddest",
              D: "more bad"
            },
            correctAnswer: "A",
            explanation: "Превосходная степень: the worst."
          },
          {
            text: "I ___ this car for 7 years so far.",
            options: {
              A: "have had",
              B: "have",
              C: "had",
              D: "have been having"
            },
            correctAnswer: "A",
            explanation: "Present Perfect для действия, начавшегося в прошлом и продолжающегося до сих пор."
          },
          {
            text: "Mark ___ to hospital in an ambulance.",
            options: {
              A: "was taken",
              B: "took",
              C: "was took",
              D: "were taken"
            },
            correctAnswer: "A",
            explanation: "Past Simple Passive: was taken."
          },
          {
            text: "Don't call me at 5 p.m. tomorrow, I ___ my homework.",
            options: {
              A: "will be doing",
              B: "will do",
              C: "am doing",
              D: "do"
            },
            correctAnswer: "A",
            explanation: "Future Continuous для действия в процессе в определённый момент в будущем."
          },
          {
            text: "This is ___ coffee I've ever drunk.",
            options: {
              A: "the worst",
              B: "the baddest",
              C: "more bad",
              D: "worst"
            },
            correctAnswer: "A",
            explanation: "Превосходная степень: the worst."
          },
          {
            text: "The royal wedding ___ by millions of people tomorrow.",
            options: {
              A: "will be watched",
              B: "will watch",
              C: "is watched",
              D: "was watched"
            },
            correctAnswer: "A",
            explanation: "Future Simple Passive: will be watched."
          },
          {
            text: "This is ___ biggest shop in the mall.",
            options: {
              A: "the",
              B: "a",
              C: "-",
              D: "an"
            },
            correctAnswer: "A",
            explanation: "Определённый артикль с превосходной степенью."
          },
          {
            text: "If I ___ you, I wouldn't eat that cake.",
            options: {
              A: "were",
              B: "was",
              C: "am",
              D: "would be"
            },
            correctAnswer: "A",
            explanation: "Second Conditional: were для всех лиц."
          },
          {
            text: "You left ___ this box?",
            options: {
              A: "What in",
              B: "What",
              C: "Where",
              D: "When"
            },
            correctAnswer: "A",
            explanation: "Вопрос о содержимом: 'What in this box?'"
          },
          {
            text: "Patrick ___ to the cinema with his friends tonight.",
            options: {
              A: "is going",
              B: "goes",
              C: "will go",
              D: "went"
            },
            correctAnswer: "A",
            explanation: "Present Continuous для планов на будущее."
          },
          {
            text: "We met when ___ in France.",
            options: {
              A: "we were living",
              B: "we lived",
              C: "we have lived",
              D: "we live"
            },
            correctAnswer: "A",
            explanation: "Past Continuous для фонового действия."
          },
          {
            text: "She ___ happy when she finds out what you have done.",
            options: {
              A: "won't be",
              B: "isn't",
              C: "wasn't",
              D: "hasn't been"
            },
            correctAnswer: "A",
            explanation: "Future Simple в придаточном времени с when."
          },
          {
            text: "I knew he ___ at 7 p.m. yesterday.",
            options: {
              A: "was working",
              B: "worked",
              C: "has worked",
              D: "works"
            },
            correctAnswer: "A",
            explanation: "Past Continuous для действия в процессе в определённый момент в прошлом."
          },
          {
            text: "They ___ climb the wall but the police caught them right there.",
            options: {
              A: "were able to",
              B: "could",
              C: "can",
              D: "managed"
            },
            correctAnswer: "A",
            explanation: "'Were able to' — смогли (однократное действие в прошлом)."
          },
          {
            text: "Before he got married he ___ a lot.",
            options: {
              A: "used to travel",
              B: "would travel",
              C: "traveled",
              D: "was traveling"
            },
            correctAnswer: "A",
            explanation: "'Used to' для привычек в прошлом."
          },
          {
            text: "This is ___ my house.",
            options: {
              A: "-",
              B: "a",
              C: "the"
            },
            correctAnswer: "A",
            explanation: "Артикль не нужен с притяжательными местоимениями."
          },
          {
            text: "Who ___ the fight?",
            options: {
              A: "began",
              B: "begin",
              C: "did begin",
              D: "was begin"
            },
            correctAnswer: "A",
            explanation: "Past Simple неправильного глагола: began."
          },
          {
            text: "Charles ___ in Thailand three times last year.",
            options: {
              A: "was",
              B: "has been",
              C: "have been",
              D: "had been"
            },
            correctAnswer: "A",
            explanation: "Past Simple для законченного действия в прошлом с указанием времени (last year)."
          },
          {
            text: "___ you help me with the housework, please?",
            options: {
              A: "Could",
              B: "Are you going to",
              C: "Should"
            },
            correctAnswer: "A",
            explanation: "Вежливая просьба: 'Could you...?'"
          },
          {
            text: "___ I go out?",
            options: {
              A: "Can",
              B: "May",
              C: "both are correct"
            },
            correctAnswer: "C",
            explanation: "И can, и may допустимы для разрешения."
          },
          {
            text: "I ___ all my homework by 6 o'clock yesterday.",
            options: {
              A: "had done",
              B: "have done",
              C: "was doing",
              D: "have been doing"
            },
            correctAnswer: "A",
            explanation: "Past Perfect для действия, завершённого к определённому моменту в прошлом."
          },
          {
            text: "___ open the window, please?",
            options: {
              A: "Could you",
              B: "Must you",
              C: "Are you able"
            },
            correctAnswer: "A",
            explanation: "Вежливая просьба: 'Could you...?'"
          },
          {
            text: "I told you he ___ going to come to the party.",
            options: {
              A: "was",
              B: "will",
              C: "is",
              D: "would"
            },
            correctAnswer: "A",
            explanation: "Reported speech: is → was."
          }
        ]
      }
    ]
  },

  cards36: {
    mainDescription: 'Экзамен по теме "deck of cards"',
    tasks: [
      {
        taskID: "multiple_choice",
        taskDescription: "Включите аудио, прибавьте звук, выберите верный ответ",
        audio: new URL('../assets/audio/Playing-cards-sort-order.mp3', import.meta.url).href,
        textScript: null,
        questions: [
          {
            text: "Какую карту мужчина назвал первой 1?",
            options: {
              A: "The Queen of clubs",
              B: "The Queen of hearts",
              C: "The Jack of hearts",
              D: "The King of clubs",
              E: "Да вообще ХЗ не слышу!",
              F: "The King of hearts"
            },
            correctAnswer: "F",
            explanation: "/ ДЭ КИНГ ОВ ХАРТС / Король черви",

          },
          {
            text: "Какую карту мужчина назвал второй?",
            options: {
              A: "Девятка крести",
              B: "Восьмерка пики",
              C: "Буби восьмерка",
              D: "Туз буби",
            },
            correctAnswer: "C",
            explanation: "/ ДЭ ЭЙТ ОВ ДАЙМОНДЗ / The eight of diamonds",
          },
          {
            text: "Какую карту мужчина назвал второй?",
            options: {
              A: "The ace of spades",
              B: "The ace of diamonds",
              C: "The ace of clubs",
              D: "The ace of hearts",

            },
            correctAnswer: "C",
            explanation: "/ ДЭ ЭЙC ОВ КЛАБЗ / Туз крести",
          },
          {
            text: "Какие две карты были последними?",
            options: {
              A: "Туз черви и Дама крести",
              B: "Двойка пики и Дама пики",
              C: "Дама черви и Двойка пики",
              D: "двойка черви и Дама пики ",
            },
            correctAnswer: "D",
            explanation: "Two of hearts and queen of spades",
          },
        ]
      },
      {
        taskID: "grid_table",
        taskDescription: "Впиши перевод",
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        tableData: {
          headers: ["Английский","Русский"],
          rows: [
            {
              cells: ["", "Пиковая дама",],
              editable: [true, false,],
              correctAnswers: {
                cells: ["the queen of spades", null ],
                almostCorrect: {
                  0: ["a queen of spades","queen of spades"], // Индекс поля (начиная с 0)
                }
              }
            },
            {
              cells: ["The Jack of hearts", "",],
              editable: [false, true],
              correctAnswers: {
                cells: [ null, "валет черви" ],
                almostCorrect: {
                  1: ["валет червей","червовый валет","валет червовый","червей валет"], // Индекс поля (начиная с 0)
                }
              }
            },
            {
              cells: ["", "Шутник",],
              editable: [true, false,],
              correctAnswers: {
                cells: ["a joker", null ],
                almostCorrect: {
                  0: ["the joker","joker"], // Индекс поля (начиная с 0)
                }
              }
            },

          ]
        }
      },
      {
        taskID: "true_false",
        taskDescription: "Послушайте и ответьте",
        usefulWords: 'in turns - по очереди, suit - / сЮт / масть или костюм, high or low? - высокий/низкий (ранг карты), trump - козырная карта, let`s give it a go - ну давай попробуем!',
        audio: new URL('../assets/audio/Playing-cards-full.mp3', import.meta.url).href,
        textScript: 'Man: So, how do you play again?\n' +
          'Woman: You have seven cards. Everybody plays in turns, and the highest card wins.\n' +
          'Man: And... Are aces high or low?\n' +
          'Woman: High.\n' +
          'Man: Can I play any suit?\n' +
          'Woman: No, of course not! You have to follow suit!\n' +
          'Man: So then, if someone plays hearts, and I don’t have any hearts…\n' +
          'Woman: You can play anything. You can play a trump, if you have one.\n' +
          'Man: I see. So I should try to win as many tricks as possible?\n' +
          'Woman: Yes, but don’t play all your winners straight away. You need to watch what other people are doing, too.\n' +
          'Man: Okay, let’s give it a go!',
        questions: [
          {
            text: "1. A woman is asking a man how to play cards",
            correctAnswer: "false"
          },
          {
            text: "2. A woman is explaining to a man how to play cards",
            correctAnswer: "true"
          },
          {
            text: "3. In this game Aces are low cards.",
            correctAnswer: "false"
          },
          {
            text: "4. The woman recommends not to watch what other players are doing, and to use all trumps.",
            correctAnswer: "false"
          },
        ]
      },
      {
        taskID: "drop_down_text",
        taskDescription: "Drop down",
        usefulWords: "let me - позвольте мне, share with you - поделиться с вами, a few words - несколько слов",
        audio: null,
        textScript: 'выбирай правильный ответ',
        questions: [
          {
            text: "Hello friends! Let me share (for, to, with*) you a few words about my favorite card game! It (is*, do, does, are, am ) called 'Twenty One'. This game (has*, have) the second name - it is Black Jack\n" +
              '\n' +
              "The rules (are*, am, is) very simple and easy. All players (have*, has) 2 cards in the beginning of the game, and all players must count cards.\n" +
              '\n' +
              "The ace is 11 points or 1 point. The king, the queen, and the (John, Jim, Jack*, Josh) are 10 points. And all other (cards*, card) have numbers of points on them.\n" +
              '\n' +
              "The winner is a player who is closer to 21. If you have more than 21 - you lose. If you have 20 and other players have 19 or 18 or less - they lose and you win\n" +
              '\n' +
              "And the funniest of this game is that when you need one more card from the ( dekc ,desk, deck*) of card you must say: HIT ME !",
          },
        ]
      },
      {
        taskID: "discussion_task",
        taskDescription: "Discuss these questions",
        usefulWords: null,
        audio: null,
        textScript: null,
        questions: [
          {
            text: "What is your favorite card game?",
            translation: "Какая твоя любимая карточная игра?",
          },
          {
            text: "When did you play cards last time? Tell about that",
            translation: "когда последний раз играли в картчеую игру? Расскажите об этом",
          },
          {
            text: "What else can people do with cards, besides playing?",
            translation: "Что еще можно делать с картами, кроме играния",
          },
        ]
      },
      {
        taskDescription: "Translate",
        taskID: "student_input",
        textScript: null,
        questions: [
          {
            text: 'Как на английском написать: "Мой учитель играет в карты со мной каждый урок" ____',
            correctAnswer: "My teacher plays cards with me every lesson",
            almostCorrectAnswers: ["Vincent plays cards with me every lesson", "V plays cards with me every lesson"]  // 👈 эти тоже засчитаются

          },{
            text: "Напиши короткий текст как ты относишься к карточным играм почему хорошо или плохо? ____",
            correctAnswer: "anyIsOk",

          },
        ]
      },
    ],
  },

  examY2V2: {
    mainDescription: 'Можно кликать на несколько ответов и...',
    tasks: [
      {
        taskID: "multiple_choice",
        taskDescription: "...или можно менять свой ответ после выбора",
        textScript: null,
        questions: [
          {
            text: "The concert ___ at 5 o’clock. Don’t be late!",
            options: {
              A: "will start",
              B: "is starting",
              C: "starts",
              D: "start"
            },
            correctAnswer: "C",
            explanation: "когда говорим о расписании (концерт по расписанию начнётся), используем Present Simple, даже несмотря на то что действие в будущем произойдет - расписание общественное всегда Present Simple"
          },
          {
            text: "Roberto is a year and a half ___ than me.",
            options: {
              A: "oldest",
              B: "older",
              C: "more old"
            },
            correctAnswer: "B",
            explanation: "than — это сравнение. old → older старше чем я"
          },
          {
            text: "What time ___ me?",
            options: {
              A: "have you called",
              B: "had you called",
              C: "did you call"
            },
            correctAnswer: "C",
            explanation: "спрашиваем о действии в прошлом (когда позвонил?), нужен Past Simple: did you call. Present Perfect здесь было бы ошибкой, так как действие в прошлом, а не в настоящем"
          },
          {
            text: "Andrew ___ to Italy ___ Monday.",
            options: {
              A: "flies, at",
              B: "is flying, in",
              C: "is flying, on",
              D: "flies, on"
            },
            correctAnswer: "C",
            explanation: "is flying — договорённость на ближайшее будущее, с днями недели предлог on"
          },
          {
            text: "The woman ___ a snake.",
            options: {
              A: "was bitten for",
              B: "was bitten by",
              C: "was bitten from",
              D: "was beaten by"
            },
            correctAnswer: "B",
            explanation: "пассивный залог: was bitten by (была укушена кем? змеёй)"
          },
          {
            text: "I ___ for 2 hours and she’s not here.",
            options: {
              A: "have waited",
              B: "have been waiting",
              C: "am waiting",
              D: "wait"
            },
            correctAnswer: "B",
            explanation: "действие длится 2 часа и ВСЁ ЕЩЁ продолжается → Present Perfect Continuous жду жду жду, а ее всё нет"
          },
          {
            text: "She would get $100 if she ___ this old chair.",
            options: {
              A: "will sell",
              B: "sold",
              C: "would sell",
              D: "sell"
            },
            correctAnswer: "B",
            explanation: "второй тип условных: if + Past Simple (sold), would + глагол"
          },
          {
            text: "It is ___ show I’ve ever seen.",
            options: {
              A: "the most good",
              B: "better",
              C: "best",
              D: "the best"
            },
            correctAnswer: "D",
            explanation: "превосходная степень: the best (good → better → the best)"
          },
          {
            text: "I ___ this car for 7 years so far.",
            options: {
              A: "have had",
              B: "have",
              C: "have been having",
              D: "did have"
            },
            correctAnswer: "A",
            explanation: "so far (до сих пор) — сигнал Present Perfect. have (иметь) в Continuous не используется"
          },
          {
            text: "Mark ___ to hospital in an ambulance.",
            options: {
              A: "was taken",
              B: "was took",
              C: "was taking"
            },
            correctAnswer: "A",
            explanation: "пассивный залог: его увезли (was taken), а не он сам увёз"
          },
          {
            text: "Don’t call me at 5 p.m. tomorrow, I ___ my homework.",
            options: {
              A: "will do",
              B: "will be doing",
              C: "am doing",
              D: "do"
            },
            correctAnswer: "B",
            explanation: "в конкретный момент в будущем (в 5 вечера) будет длиться действие → Future Continuous"
          },
          {
            text: "I ___ my toe. I can’t walk now.",
            options: {
              A: "have hurt",
              B: "hurt",
              C: "have hurted"
            },
            correctAnswer: "A",
            explanation: "результат в настоящем (не могу ходить) → Present Perfect. hurt — неправильный глагол: hurt-hurt-hurt"
          },
          {
            text: "I'm too old now but when I was younger I ___ surf and water ski.",
            options: {
              A: "could",
              B: "can",
              C: "can't",
              D: "was able"
            },
            correctAnswer: "A",
            explanation: "способность в прошлом (был способен, умел) → could"
          },
          {
            text: "Be careful! That tree ___.",
            options: {
              A: "will fall",
              B: "is going to fall",
              C: "falls"
            },
            correctAnswer: "B",
            explanation: "видим доказательства / признаки (дерево вот-вот упадёт) → is going to fall"
          },
          {
            text: "If I ___ you, I wouldn’t eat that cake.",
            options: {
              A: "be",
              B: "were",
              C: "will be",
              D: "would be",
              E: "will"
            },
            correctAnswer: "B",
            explanation: "второй тип условных с глаголом to be ВСЕГДА were (даже с I, he, she, it)"
          },
          {
            text: "This is ___ coffee I’ve ever drunk!",
            options: {
              A: "more disgusting",
              B: "the most disgusting",
              C: "the disgustingest",
              D: "disgusting"
            },
            correctAnswer: "B",
            explanation: "I've ever drunk — сигнал превосходной степени (самый отвратительный) → the most disgusting"
          },
          {
            text: "The royal wedding ___ by millions of people tomorrow.",
            options: {
              A: "was watched",
              B: "were watched",
              C: "will watch",
              D: "will be watched"
            },
            correctAnswer: "D",
            explanation: "tomorrow — будущее, пассивный залог (свадьбу будут смотреть) → will be watched"
          },
          {
            text: "This is ___ biggest shop in the mall.",
            options: {
              A: "a",
              B: "the",
              C: "--"
            },
            correctAnswer: "B",
            explanation: "перед превосходной степенью (biggest) всегда ставим the"
          },
          {
            text: "This time tomorrow I ___.",
            options: {
              A: "will ski",
              B: "will skiing",
              C: "will be skiing"
            },
            correctAnswer: "C",
            explanation: "в точно указанный момент в будущем (this time tomorrow) → Future Continuous"
          },
          {
            text: "___ you lift this box?",
            options: {
              A: "can",
              B: "mayn’t",
              C: "able to"
            },
            correctAnswer: "A",
            explanation: "спрашиваем о физической возможности (сможешь поднять?) → can"
          },
          {
            text: "Josh ___ to the cinema with his friends tonight.",
            options: {
              A: "goes",
              B: "is going",
              C: "will go",
              D: "is"
            },
            correctAnswer: "B",
            explanation: "запланированное действие на ближайшее будущее (есть билеты/договорённость) → is going"
          },
          {
            text: "We met when we ___ in France.",
            options: {
              A: "study",
              B: "were studying",
              C: "have been studying"
            },
            correctAnswer: "B",
            explanation: "длительное действие в прошлом (учились) прервалось другим (встретились) → Past Continuous"
          },
          {
            text: "She ___ happy when she finds out what you have done.",
            options: {
              A: "is",
              B: "would be",
              C: "will be",
              D: "was"
            },
            correctAnswer: "C",
            explanation: "придаточное с when в настоящем (finds out), а главное — в будущем → will be"
          },
          {
            text: "I knew he ___ at 7 p.m. yesterday.",
            options: {
              A: "was sleeping",
              B: "slept",
              C: "have been sleeping"
            },
            correctAnswer: "A",
            explanation: "в конкретный момент в прошлом (в 7 вечера) длилось действие → Past Continuous"
          },
          {
            text: "He is ___ mad at you!",
            options: {
              A: "a",
              B: "such",
              C: "so"
            },
            correctAnswer: "C",
            explanation: "so + прилагательное (mad) — так сильно (злится). such + существительное"
          },
          {
            text: "She ___ live in Liverpool.",
            options: {
              A: "didn’t used to",
              B: "didn’t use to",
              C: "usedn’t to"
            },
            correctAnswer: "B",
            explanation: "отрицание used to: didn't use to (без D в конце)"
          },
          {
            text: "The text is on ___ page 43.",
            options: {
              A: "a",
              B: "the",
              C: "--"
            },
            correctAnswer: "C",
            explanation: "перед номером страницы (page 43) артикль НЕ нужен"
          },
          {
            text: "He thought that she ___ be home.",
            options: {
              A: "won’t",
              B: "want",
              C: "wouldn’t",
              D: "were"
            },
            correctAnswer: "C",
            explanation: "согласование времён: thought (прошлое) → wouldn't (а не won't)"
          },
          {
            text: "They ___ climb the wall but the police caught them right there.",
            options: {
              A: "could",
              B: "was able to",
              C: "were able to"
            },
            correctAnswer: "C",
            explanation: "смогли И сделали (конкретный успешный результат в прошлом) → were able to (а не could) потому что could переводилось бы - они могли лазать по стене, а не смогли перелезть."
          },
          {
            text: "Before he got married he ___ a lot.",
            options: {
              A: "travels",
              B: "has travelled",
              C: "has been travelling",
              D: "had travelled"
            },
            correctAnswer: "D",
            explanation: "действие закончилось ДО другого действия в прошлом (до женитьбы) → Past Perfect"
          },
          {
            text: "This is ___ my house.",
            options: {
              A: "a",
              B: "the",
              C: "--"
            },
            correctAnswer: "C",
            explanation: "перед притяжательными местоимениями (my) артикли НЕ ставятся никакие. Если бы не было my тогда можно было бы сказать the house или a house"
          },
          {
            text: "Who ___ the fight?",
            options: {
              A: "begin",
              B: "begun",
              C: "did begin",
              D: "began"
            },
            correctAnswer: "D",
            explanation: "вопрос к подлежащему — не нужен did, просто ставим глагол в прошедшее время: began"
          },
          {
            text: "Charles ___ in Thailand three times last year.",
            options: {
              A: "was",
              B: "has been",
              C: "have been",
              D: "had been"
            },
            correctAnswer: "A",
            explanation: "last year — законченное время в прошлом (был 3 раза, но уже не важно) → Past Simple (was)"
          },
          {
            text: "___ help me with the housework, please?",
            options: {
              A: "Could you",
              B: "Are you going to",
              C: "Should you"
            },
            correctAnswer: "A",
            explanation: "вежливая просьба → Could you могли бы вы помочь"
          },
          {
            text: "___ I go out?",
            options: {
              A: "can",
              B: "may",
              C: "both are correct"
            },
            correctAnswer: "C",
            explanation: "и can, и may подходят для просьбы. can — разговорный, may — более официальный. Both - переводится оба"
          },
          {
            text: "I ___ all my homework by 6 o'clock yesterday",
            options: {
              A: "have done",
              B: "had done",
              C: "was doing",
              D: "have been doing"
            },
            correctAnswer: "B",
            explanation: "by 6 o'clock yesterday — действие завершилось ДО определённого момента в прошлом → Past Perfect"
          },
          {
            text: "___ open the window, please?",
            options: {
              A: "could you",
              B: "must you",
              C: "are you able"
            },
            correctAnswer: "A",
            explanation: "вежливая просьба → could you (можешь ли ты?)"
          },
          {
            text: "I told you he ___ going to come to the party.",
            options: {
              A: "will",
              B: "is",
              C: "was",
              D: "would"
            },
            correctAnswer: "C",
            explanation: "согласование времён: told (прошлое) → was going to (а не is going to)"
          },
          {
            text: "We ___ in two days. Don’t be late!",
            options: {
              A: "meet",
              B: "will meet",
              C: "are meeting",
              D: "met"
            },
            correctAnswer: "C",
            explanation: "запланированная встреча в ближайшем будущем → Present Continuous (are meeting)"
          }
        ]
      },

    ],
  },
  examY2V1: {
    mainDescription: 'Можно кликать на несколько ответов и...',
    tasks: [
      {
        taskID: "multiple_choice",
        taskDescription: "...или можно менять свой ответ после выбора",
        textScript: null,
        questions: [
          {
            text: "What time ___ her?",
            options: {
              A: "did you see",
              B: "have you seen",
              C: "had you seen"
            },
            correctAnswer: "A",
            explanation: "спрашиваем о конкретном моменте в прошлом (когда увидел) → Past Simple: did you see"
          },
          {
            text: "This time tomorrow I ___",
            options: {
              A: "will work",
              B: "will be working",
              C: "will working",
              D: "work"
            },
            correctAnswer: "B",
            explanation: "в конкретный момент в будущем (this time tomorrow) будет длиться действие → Future Continuous: will be working"
          },
          {
            text: "I ___ you if you ___ that again.",
            options: {
              A: "hit, say",
              B: "will hit, will say",
              C: "hit, will say",
              D: "will hit, say"
            },
            correctAnswer: "D",
            explanation: "первый тип условия: if + Present Simple (say), главная часть will + глагол (will hit)"
          },
          {
            text: "I have ___ family.",
            options: {
              A: "a",
              B: "the",
              C: "--"
            },
            correctAnswer: "A",
            explanation: "используем a, потому что имеется в виду 'одна семья' (неопределённый артикль)"
          },
          {
            text: "___ finish your homework last night?",
            options: {
              A: "could you",
              B: "can you",
              C: "were you able to",
              D: "was you able to"
            },
            correctAnswer: "C",
            explanation: "were you able to — смогли И сделали (конкретный успешный результат в прошлом). could — общая способность, но не факт, что сделали"
          },
          {
            text: "It’s ___ show I have ever seen.",
            options: {
              A: "the baddest",
              B: "worse",
              C: "worst",
              D: "the worst"
            },
            correctAnswer: "D",
            explanation: "I have ever seen — сигнал превосходной степени (самый плохой) → the worst (bad → worse → the worst)"
          },
          {
            text: "The conference ___ at 10 a.m.",
            options: {
              A: "will start",
              B: "starts",
              C: "is start"
            },
            correctAnswer: "B",
            explanation: "расписание (конференция по расписанию) → Present Simple: starts"
          },
          {
            text: "If Pat ___ his bike, he could go on a bicycle tour with us.",
            options: {
              A: "repaired",
              B: "repairs",
              C: "would repair",
              D: "will repair"
            },
            correctAnswer: "A",
            explanation: "второй тип условия: if + Past Simple (repaired), could + глагол (возможность сейчас или в будущем)"
          },
          {
            text: "You look so tired, Jack! Just go and have some rest! I ___ the dishes.",
            options: {
              A: "will be washing",
              B: "wash",
              C: "am washing",
              D: "will wash"
            },
            correctAnswer: "D",
            explanation: "спонтанное решение (только что решил помочь) → Future Simple: will wash"
          },
          {
            text: "I ___ to America three times this year.",
            options: {
              A: "have been",
              B: "was",
              C: "had been"
            },
            correctAnswer: "A",
            explanation: "this year — период времени, который ещё не закончился → Present Perfect: have been"
          },
          {
            text: "In the morning they told us that we ___ have lunch.",
            options: {
              A: "won’t",
              B: "want",
              C: "wouldn’t",
              D: "were"
            },
            correctAnswer: "C",
            explanation: "согласование времён: told (прошлое) → wouldn't (а не won't)"
          },
          {
            text: "Australia ___ in 1606.",
            options: {
              A: "is discovered",
              B: "was discovering",
              C: "will be discovered",
              D: "was discovered"
            },
            correctAnswer: "D",
            explanation: "пассивный залог в прошлом (Австралию открыли) → was discovered"
          },
          {
            text: "___ you close the door, please?",
            options: {
              A: "could",
              B: "must",
              C: "are you able"
            },
            correctAnswer: "A",
            explanation: "вежливая просьба → Could you"
          },
          {
            text: "Sarah ___ yesterday from 9 a.m. till 6 p.m.",
            options: {
              A: "worked",
              B: "was working",
              C: "had been working"
            },
            correctAnswer: "B",
            explanation: "действие длилось в течение определённого периода в прошлом → Past Continuous: was working"
          },
          {
            text: "I ___ home late tonight.",
            options: {
              A: "--",
              B: "will be",
              C: "would be"
            },
            correctAnswer: "B",
            explanation: "предсказание / обещание на будущее → Future Simple: will be"
          },
          {
            text: "Where is ___ platform 6?",
            options: {
              A: "a",
              B: "the",
              C: "--"
            },
            correctAnswer: "C",
            explanation: "перед номером платформы (platform 6) артикль НЕ нужен"
          },
          {
            text: "I ___ smoke.",
            options: {
              A: "didn’t used to",
              B: "didn’t use to",
              C: "usedn’t to"
            },
            correctAnswer: "B",
            explanation: "отрицание used to: didn't use to (без D в конце)"
          },
          {
            text: "___ you play the piano?",
            options: {
              A: "can",
              B: "mayn’t",
              C: "able to"
            },
            correctAnswer: "A",
            explanation: "спрашиваем об умении / способности → can"
          },
          {
            text: "We ___ tomorrow at 6 p.m. Don’t be late!",
            options: {
              A: "going to meet",
              B: "will meeting",
              C: "are meeting",
              D: "met"
            },
            correctAnswer: "C",
            explanation: "запланированная встреча на конкретное время → Present Continuous: are meeting"
          },
          {
            text: "He is ___ fat!",
            options: {
              A: "a",
              B: "such",
              C: "so"
            },
            correctAnswer: "C",
            explanation: "so + прилагательное (fat) — такой толстый. such + существительное"
          },
          {
            text: "___ I learn ___ I know.",
            options: {
              A: "then more, then littler",
              B: "more, less",
              C: "the more, the less",
              D: "then more, then less"
            },
            correctAnswer: "C",
            explanation: "конструкция the + сравнительная степень, the + сравнительная степень (чем больше, тем меньше)"
          },
          {
            text: "Daniel ___ when his wife came home.",
            options: {
              A: "was sleeping",
              B: "slept",
              C: "has slept"
            },
            correctAnswer: "A",
            explanation: "длительное действие в прошлом (спал) прервалось другим (пришла жена) → Past Continuous"
          },
          {
            text: "If they had enough money, they ___ a new car.",
            options: {
              A: "will buy",
              B: "buy",
              C: "would buy"
            },
            correctAnswer: "C",
            explanation: "второй тип условия (нереальная ситуация сейчас): if + Past Simple (had), would + глагол"
          },
          {
            text: "I ___ a dog for 7 years so far.",
            options: {
              A: "have had",
              B: "have",
              C: "have been having",
              D: "did have"
            },
            correctAnswer: "A",
            explanation: "so far (до сих пор) — сигнал Present Perfect. have (иметь) в Continuous не используется"
          },
          {
            text: "She ___ to London ___ Wednesday.",
            options: {
              A: "flies, at",
              B: "is flying, in",
              C: "is flying, on",
              D: "flied, on"
            },
            correctAnswer: "C",
            explanation: "is flying — договорённость на ближайшее будущее, с днями недели предлог on"
          },
          {
            text: "This is ___ book I’ve ever read.",
            options: {
              A: "the most boring",
              B: "the boringest",
              C: "more boring"
            },
            correctAnswer: "A",
            explanation: "I've ever read — сигнал превосходной степени. boring — длинное слово → the most boring"
          },
          {
            text: "Last night I decided that I ___ going to leave for another city.",
            options: {
              A: "will",
              B: "would",
              C: "am",
              D: "was"
            },
            correctAnswer: "D",
            explanation: "согласование времён: decided (прошлое) → was going to (а не am going to)"
          },
          {
            text: "___ Gloria last week?",
            options: {
              A: "have you seen",
              B: "did you see",
              C: "had you seen",
              D: "did you used to see"
            },
            correctAnswer: "B",
            explanation: "last week — законченное время в прошлом → Past Simple: did you see"
          },
          {
            text: "They ___ save the man from the fire.",
            options: {
              A: "could",
              B: "was able to",
              C: "were able to"
            },
            correctAnswer: "C",
            explanation: "смогли И сделали (конкретный успешный результат) → were able to (множественное число they)"
          },
          {
            text: "This morning I ___ up by the neighbour's dog.",
            options: {
              A: "woke",
              B: "was woke",
              C: "was woken",
              D: "were woken"
            },
            correctAnswer: "C",
            explanation: "пассивный залог: меня разбудили (was woken) → was woken by"
          },
          {
            text: "He drives ___ than anybody I know",
            options: {
              A: "more fast",
              B: "faster",
              C: "the fastest",
              D: "more faster"
            },
            correctAnswer: "B",
            explanation: "than — сигнал сравнительной степени. fast → faster (не more fast)"
          },
          {
            text: "These boxes are so heavy. ___ carry them for me, please.",
            options: {
              A: "Could you",
              B: "Are you going to",
              C: "Would"
            },
            correctAnswer: "A",
            explanation: "вежливая просьба о помощи → Could you"
          },
          {
            text: "Look at those big black clouds, ___",
            options: {
              A: "it will rain",
              B: "it is going to rain",
              C: "it’s raining",
              D: "it rains"
            },
            correctAnswer: "B",
            explanation: "видим доказательства / признаки (чёрные тучи) → is going to rain"
          },
          {
            text: "I was sure that I ___ her before.",
            options: {
              A: "meat",
              B: "have met",
              C: "had met",
              D: "meet"
            },
            correctAnswer: "C",
            explanation: "действие закончилось ДО другого действия в прошлом (до того, как был уверен) → Past Perfect: had met"
          },
          {
            text: "This picture ___ by a famous artist.",
            options: {
              A: "was drawed",
              B: "was drew",
              C: "was drawn"
            },
            correctAnswer: "C",
            explanation: "пассивный залог в прошлом. draw — неправильный глагол: draw-drew-drawn → was drawn"
          },
          {
            text: "They ___ work when I called them.",
            options: {
              A: "have already finished",
              B: "already finished",
              C: "have finished already",
              D: "had already finished"
            },
            correctAnswer: "D",
            explanation: "действие завершилось ДО другого действия в прошлом (до того, как позвонил) → Past Perfect: had already finished"
          },
          {
            text: "There is ___ fridge in the kitchen.",
            options: {
              A: "a",
              B: "the",
              C: "--"
            },
            correctAnswer: "A",
            explanation: "упоминаем предмет впервые (холодильник) → неопределённый артикль a"
          },
          {
            text: "It’s 9 a.m. and I’m so tired! I ___ all morning!",
            options: {
              A: "am working",
              B: "worked",
              C: "have been working",
              D: "had worked"
            },
            correctAnswer: "C",
            explanation: "действие длилось всё утро И результат виден сейчас (устал) → Present Perfect Continuous"
          },
          {
            text: "___ I come in?",
            options: {
              A: "can",
              B: "may",
              C: "both are correct"
            },
            correctAnswer: "C",
            explanation: "и can, и may подходят для просьбы. can — разговорный, may — более официальный"
          },
          {
            text: "Who ___ the fish?",
            options: {
              A: "catch",
              B: "caught",
              C: "did catch",
              D: "catched"
            },
            correctAnswer: "B",
            explanation: "catch - caught - caught - Кто поймал рыбу? Так как неизвестно кто поймал, поэтому не нужно did - это правило называется - Вопросы к подлежащему. Если скаазть Who did fish catch? это переводилось бы - кого поймала рыба? =)"
          }
        ]
      },
    ],
  },
  examY1V1: {
    mainDescription: 'Можно кликать на несколько ответов и...',
    tasks: [
      {
        taskID: "multiple_choice",
        taskDescription: "...или можно менять свой ответ после выбора",
        textScript: null,
        questions: [
          {
            text: "Did you buy _____ good toys?",
            textExtra: "Вы купили хоть каких-то хороших игрушек?",
            options: {
              A: "some",
              B: "any",
              C: "anything",
              D: "an",
              E: "a"
            },
            correctAnswer: "B",
            explanation: "Если бы был вариант ничего не вставлять, то было бы верно и супер, но по условию задания нужно перевести фразу - ВЫ КУПИЛИ ХОТЬ КАКИХ-НИБУДЬ ХОРОШИХ ИГРУШЕК ? Поэтому нужно выбрать один вариант з предложенных. В вопросе и отрицании с неисчисляемыми/множественными используем any (some — в утверждении)"
          },
          {
            text: "She _____ talks to anyone.",
            textExtra: "Она ни с кем не разговаривает.",
            options: {
              A: "never",
              B: "doesn’t",
              C: "will",
              D: "has"
            },
            correctAnswer: "A",
            explanation: "never (никогда) Она никогда не говорит ни с кем. Два отрицания англичане не говорят. поэтому she never talks "
          },
          {
            text: "We have _____ love in this world.",
            textExtra: "У нас мало любви в этом мире.",
            options: {
              A: "few",
              B: "little",
              C: "any",
              D: "many"
            },
            correctAnswer: "B",
            explanation: "В этом мире мало любви. (little) мало + неисчисляемое, (few) мало + исчисляемое, (any) любой, (many) много + исчисляемое, (much) много + неисчисляемое"
          },
          {
            text: "I promise I _____ read it.",
            textExtra: "Я обещаю, я прочитаю это.",
            options: {
              A: "will",
              B: "am going to",
              C: "have to",
              D: "am to"
            },
            correctAnswer: "A",
            explanation: "когда обещаем используем will → Future Simple: will read (will + глагол)"
          },
          {
            text: "Time _____ so quickly!",
            textExtra: "Время летит так быстро!",
            options: {
              A: "go",
              B: "goes",
              C: "has"
            },
            correctAnswer: "B",
            explanation: "time (время) — это оно - it - значит goes (Present Simple)"
          },
          {
            text: "I’ve _____ eaten",
            textExtra: "Я уже поел.",
            options: {
              A: "yet",
              B: "still",
              C: "already"
            },
            correctAnswer: "C",
            explanation: "already — уже (в утверждении), yet — в вопросах/отрицаниях, still — всё ещё"
          },
          {
            text: "She ______ help me with anything.",
            textExtra: "Она ничем не может мне помочь.",
            options: {
              A: "can’t",
              B: "can’t to",
              C: "doesn’t can to"
            },
            correctAnswer: "A",
            explanation: "отрицание can't + глагол (никаких doesn't не нужно) CAN и MUST это модальные глаголы, с ними не нужны ни to ни does ничего не нужно))  "
          },
          {
            text: "I _____ a dog.",
            textExtra: "У меня нет собаки.",
            options: {
              A: "haven’t",
              B: "don’t has",
              C: "don’t have"
            },
            correctAnswer: "C",
            explanation: "I don't have — правильное отрицание для have (значения 'иметь') еще можно было бы сказать I have no dog - но такого варианта нет здесь. I haven't нельзя говорить так. После haven't может быть только глагол - например I haven't kissed a dog!"
          },
          {
            text: "It _____ rains in London.",
            textExtra: "В Лондоне часто идёт дождь.",
            options: {
              A: "will",
              B: "often",
              C: "goes",
              D: "was"
            },
            correctAnswer: "B",
            explanation: "таких слова всего два ДОЖДЬ и СНЕГ с ними всегда говорим it rains или it snows - часто дождит, часто идет дождь/снег - often всегда ставится перед смысловым глаголом. It rains sometimes, it often rains и так далее. Говорить Rain goes нельзя"
          },
          {
            text: "If you come I ______ there",
            textExtra: "Если ты придёшь, я буду там.",
            options: {
              A: "will",
              B: "am",
              C: "will be"
            },
            correctAnswer: "C",
            explanation: "первый тип условия: if + Present Simple (come), главная часть will be"
          },
          {
            text: "I _______ always my keys.",
            textExtra: "Я всегда теряю свои ключи.",
            options: {
              A: "lose",
              B: "lost",
              C: "am loosing",
              D: "have lost"
            },
            correctAnswer: "A",
            explanation: "loosing не подойдет по смыслу (loose  ослаблять) если бы было I am always losing keys то так можно. Но такого не было дано варианта"
          },
          {
            text: "I like ______ late",
            textExtra: "Я люблю опаздывать.",
            options: {
              A: "to",
              B: "being"
            },
            correctAnswer: "B",
            explanation: "late - прилагательное ОПОЗДАВШИЙ - в английском нет глагола ОПАЗДЫВАТЬ поэтому они используют прилагательное - like + БЫТЬ + ing (нравится делать что-то) → being late - мне нравится БЫТЬ ОПОЗДАВШИМ - I don't like being late. I like being on time - мне нравится приходить вовремя"
          },
          {
            text: "The news _____ good today!",
            textExtra: "Новости сегодня хорошие!",
            options: {
              A: "are",
              B: "is",
              C: "-"
            },
            correctAnswer: "B",
            explanation: "news (новости) — в английском единственное число → is"
          },
          {
            text: "I _____ my leg! I can’t go now.",
            textExtra: "Я поранил ногу! Не могу сейчас идти.",
            options: {
              A: "have hurt",
              B: "hurt",
              C: "hurted"
            },
            correctAnswer: "A",
            explanation: "результат в настоящем (не могу идти) → Present Perfect. неправильный глагол hurt-hurt-hurt"
          },
          {
            text: "She didn’t drink _____ coffee.",
            textExtra: "Она не выпила много кофе.",
            options: {
              A: "few",
              B: "a few",
              C: "much",
              D: "many"
            },
            correctAnswer: "C",
            explanation: "Она не выпила много кофе. (a few) немного + исчисляемое, (few) мало + исчисляемое, (many) много + исчисляемое, (much) много + неисчисляемое"
          },
          {
            text: "Those people _____ organized a band",
            textExtra: "Те люди организовали группу.",
            options: {
              A: "has",
              B: "have",
              C: "did",
              D: "were"
            },
            correctAnswer: "B",
            explanation: "Если бы был вариант ничего не вставлять то было бы верно и супер - но такого варианта нет. Нужно выбрать подходящее - people (люди) — мн. число → have (Present Perfect: have organized)"
          },
          {
            text: "I haven’t come _____ ",
            textExtra: "Я ещё не пришёл.",
            options: {
              A: "yet",
              B: "still",
              C: "already",
              D: "just"
            },
            correctAnswer: "A",
            explanation: "yet — в отрицаниях и вопросах (ещё не, пока не). already - уже , just - только что"
          },
          {
            text: "I want to ______ some gardening",
            textExtra: "Я хочу заняться садоводством.",
            options: {
              A: "make",
              B: "have",
              C: "do"
            },
            correctAnswer: "C",
            explanation: "устойчивое выражение: do gardening (заниматься садоводством) Make было бы правильно в предложении make a garden - создать сад"
          },
          {
            text: "I _____ it 2 years ago.",
            textExtra: "Я сделал это 2 года назад.",
            options: {
              A: "did",
              B: "have done",
              C: "am doing"
            },
            correctAnswer: "A",
            explanation: "2 years ago — законченное время в прошлом → Past Simple: did"
          },
          {
            text: "I’m sorry. I ______ yet",
            textExtra: "Извините. Я ещё не закончил.",
            options: {
              A: "haven’t finished",
              B: "didn’t finish",
              C: "don’t finish"
            },
            correctAnswer: "A",
            explanation: "yet — ещё, пока - используется когда говорим пока еще не сделали чего-то - это Present Perfect"
          },
          {
            text: "I want to give up _______",
            textExtra: "Я хочу бросить пить.",
            options: {
              A: "to drink",
              B: "drink",
              C: "drinking"
            },
            correctAnswer: "C",
            explanation: "после give up всегда говорим глагол + ing"
          },
          {
            text: "She has stopped the train, ______?",
            textExtra: "Она остановила поезд, не так ли?",
            options: {
              A: "doesn’t she",
              B: "has she",
              C: "hasn’t she",
              D: "did she"
            },
            correctAnswer: "C",
            explanation: "это правило tag questions - если тут ошиблись, то напишите Винсенту объяснить вам это правило'"
          },
          {
            text: "There _____ a door and 2 windows there.",
            textExtra: "Там есть дверь и два окна.",
            options: {
              A: "are",
              B: "is",
              C: "some"
            },
            correctAnswer: "B",
            explanation: "Находится дверь - there is + существительное в единственном числе (a door). Если бы сперва были окна, то было бы there are 2 windows and a door."
          },
          {
            text: "It’s not warm, _____?",
            textExtra: "Не тепло, правда?",
            options: {
              A: "is it",
              B: "isn’t it?",
              C: "does it"
            },
            correctAnswer: "A",
            explanation: "правило батарейки -+ , +- уточняющий вопрос tag question? "
          },
          {
            text: "Are you going there? – Yes, I _____ ",
            textExtra: "Ты идёшь туда? – Да.",
            options: {
              A: "do",
              B: "was",
              C: "am",
              D: "did"
            },
            correctAnswer: "C",
            explanation: "краткий ответ на Are you... → Yes, I am"
          },
          {
            text: "There’s _____ paper on the table.",
            textExtra: "На столе есть немного бумаги.",
            options: {
              A: "a",
              B: "some",
              C: "any"
            },
            correctAnswer: "B",
            explanation: "Немного бумаги на столе или какая-то бумага на столе. В утверждениях some, в отрицаниях any. Артикль (A) не нужен потому что бумага - неисчислимое"
          },
          {
            text: "How many brothers and sisters _____ ?",
            textExtra: "Сколько у тебя братьев и сестёр?",
            options: {
              A: "are you having",
              B: "you have",
              C: "have you",
              D: "do you have"
            },
            correctAnswer: "D",
            explanation: "do you have brothers? How many brothers do you have? Вопрос с how many → do you have (Present Simple)"
          },
          {
            text: "We met when we _____ in France",
            textExtra: "Мы встретились, когда были во Франции.",
            options: {
              A: "are",
              B: "was",
              C: "were",
              D: "study"
            },
            correctAnswer: "C",
            explanation: "was - был, were - были, study - учиться, are - если бы мы сейчас находились во франции"
          },
          {
            text: "I don’t want _____ to leave me.",
            textExtra: "Я не хочу, чтобы она ушла от меня.",
            options: {
              A: "she",
              B: "her",
              C: "that she"
            },
            correctAnswer: "B",
            explanation: "нужно запомнить эту конструкцию, это не так как в русском языке - хочу чтобы она - want her to..."
          },
          {
            text: "____ _____ in London.",
            textExtra: "В Лондоне идёт снег.",
            options: {
              A: "Snow goes",
              B: "It snows",
              C: "It snowing"
            },
            correctAnswer: "B",
            explanation: "говорим о погоде: it snows (Present Simple — обычно идёт снег) так всегда будет с дождем и снегом. It snows, it rains. Говорить Rain goes нельзя"
          },
          {
            text: "How _____ sugar do you eat a day?",
            textExtra: "Сколько сахара ты съедаешь в день?",
            options: {
              A: "many",
              B: "much",
              C: "is"
            },
            correctAnswer: "B",
            explanation: "sugar (сахар) — неисчисляемое → how much"
          },
          {
            text: "There _____ some grapes there the day before yesterday.",
            textExtra: "Там было немного винограда позавчера.",
            options: {
              A: "was",
              B: "were",
              C: "are",
              D: "is"
            },
            correctAnswer: "B",
            explanation: "Находилось несколько винограден (grapes) там позавчера - первое there никак не переводится это просто отсылка - что-то находится где-то. А второе there переводится ТАМ "
          },
          {
            text: "Will you do it? – No, I _____",
            textExtra: "Ты сделаешь это? – Нет.",
            options: {
              A: "won’t",
              B: "wouldn’t",
              C: "will"
            },
            correctAnswer: "A",
            explanation: "краткий ответ won't это тоже самое что длинный ответ WILL + NOT. (won't = will + not)"
          },
          {
            text: "Who are ______ people?",
            textExtra: "Кто эти люди?",
            options: {
              A: "this",
              B: "those",
              C: "that"
            },
            correctAnswer: "B",
            explanation: "this - вот этот , that - вон тот, those - вон те, these - вот эти"
          },
          {
            text: "It’s _____ weather today",
            textExtra: "Сегодня ужасная погода.",
            options: {
              A: "a terrible",
              B: "terrible",
              C: "the terrible"
            },
            correctAnswer: "B",
            explanation: "weather — неисчисляемое, артикль не нужен → terrible weather"
          },
          {
            text: "As soon as she ______, I’ll do it.",
            textExtra: "Как только она придёт, я сделаю это.",
            options: {
              A: "come",
              B: "will come",
              C: "comes"
            },
            correctAnswer: "C",
            explanation: "как только она придет + Present Simple (comes) — будущее время не используется после as soon as"
          },
          {
            text: "His eyes _____ blue",
            textExtra: "Его глаза голубые.",
            options: {
              A: "are",
              B: "have",
              C: "has",
              D: "is"
            },
            correctAnswer: "A",
            explanation: "eyes (мн. число) → are (глаза голубые)"
          },
          {
            text: "_____ children are too noisy",
            textExtra: "Их дети слишком шумные.",
            options: {
              A: "they",
              B: "them",
              C: "their"
            },
            correctAnswer: "C",
            explanation: "them - им , they - они , their - их (притяжательное местоимение)"
          },
          {
            text: "Now she _____ him.",
            textExtra: "Теперь она ненавидит его.",
            options: {
              A: "is hating",
              B: "hated",
              C: "hates",
              D: "hate"
            },
            correctAnswer: "C",
            explanation: "hate (ненавидеть) — глагол состояния, не используется в Continuous → ну и после it he she S пиши! hates"
          },
          {
            text: "I’m going _____ home with you.",
            textExtra: "Я пойду домой с тобой.",
            options: {
              A: "at",
              B: "to",
              C: "–",
              D: "in"
            },
            correctAnswer: "C",
            explanation: "go home — предлог НЕ нужен - запомните фразу эту просто GO HOME !"
          },
          {
            text: "She _____ soon.",
            textExtra: "Она скоро уезжает.",
            options: {
              A: "leaves",
              B: "will leaves",
              C: "is leaving",
              D: "is life",
              E: "is live",
              F: "leave"
            },
            correctAnswer: "C",
            explanation: "покинет, уйдет. действие в ближайшем будущем → is leaving, остальные варианты просто неправильный набор слов бессмысленный"
          },
          {
            text: "What time _____ today?",
            textExtra: "В котором часу она пришла сегодня?",
            options: {
              A: "has she come",
              B: "she has come",
              C: "did she come"
            },
            correctAnswer: "C",
            explanation: "В вопросе what time всегда Past Simple или Past Continuous"
          },
          {
            text: "I _____ silly",
            textExtra: "Я не глупый.",
            options: {
              A: "amn’t",
              B: "am not",
              C: "isn’t"
            },
            correctAnswer: "B",
            explanation: "отрицание I am → I am not (amn't не используется и это ошибка 100%)"
          },
          {
            text: "Who _____ a shower with you?",
            textExtra: "Кто принимает душ вместе с тобой?",
            options: {
              A: "have",
              B: "has",
              C: "do have"
            },
            correctAnswer: "B",
            explanation: "Запомни в таких вопросах всегда сразу глагол. Вопрос к подлежащему (who = 3 лицо ед. число) → has - если не понимаешь это правило, то попроси Винсента объяснить у него есть лайфхак"
          },
          {
            text: "What _____ ?",
            textExtra: "Что она хочет?",
            options: {
              A: "she wants",
              B: "does she want",
              C: "does she wants"
            },
            correctAnswer: "B",
            explanation: "вопрос в Present Simple - это просто база - если неправильно ответил - гоу первые уроки повторять "
          },
          {
            text: "She’s gonna _____ leave",
            textExtra: "Она собирается уйти.",
            options: {
              A: "at",
              B: "to",
              C: "–",
              D: "in"
            },
            correctAnswer: "C",
            explanation: "gonna = going to → gonna leave (без лишних предлогов)"
          },
          {
            text: "If he _____ kisses me tomorrow, I’ll kiss him too",
            textExtra: "Если он поцелует меня завтра, я тоже поцелую его.",
            options: {
              A: "–",
              B: "will",
              C: "are",
              D: "is"
            },
            correctAnswer: "A",
            explanation: "После if не нужно will - если забыл это правило, то повтори - оно называется - первый тип условия: if + Present Simple"
          },
          {
            text: "They will arrive _____ Sunday",
            textExtra: "Они прибудут в воскресенье.",
            options: {
              A: "in",
              B: "on",
              C: "at",
              D: "-"
            },
            correctAnswer: "B",
            explanation: "с днями недели предлог on → on Sunday"
          },
          {
            text: "_____ help me?",
            textExtra: "Ты можешь мне помочь?",
            options: {
              A: "can you to",
              B: "do you can",
              C: "can you"
            },
            correctAnswer: "C",
            explanation: "вопрос с can: Can you help me? (без to и do)"
          },
          {
            text: "I _____ agree",
            textExtra: "Я не согласен.",
            options: {
              A: "am not",
              B: "not",
              C: "do not"
            },
            correctAnswer: "C",
            explanation: "agree — глагол - I don't agree"
          },
          {
            text: "I _____ agree",
            textExtra: "Я согласен.",
            options: {
              A: "am",
              B: "–"
            },
            correctAnswer: "B",
            explanation: "agree — глагол - I agree"
          }
        ]
      }
    ]
  },
  examYA165E: {
    mainDescription: 'Можно кликать на несколько ответов и...',
    tasks: [
      {
        taskID: "multiple_choice",
        taskDescription: "...или можно менять свой ответ после выбора",
        textScript: null,
        questions: [
          {
            text: "We go to work ____ train.",
            textExtra: "Мы ездим на работу на поезде.",
            options: {
              A: "with",
              B: "by",
              C: "for",
              D: "in"
            },
            correctAnswer: "B",
            explanation: "С видами транспорта используем предлог by: by train, by car, by bus."
          },
          {
            text: "Are you going to the party? – Yes, I ____",
            textExtra: "Ты идешь на вечеринку? – Да, я иду.",
            options: {
              A: "do",
              B: "is",
              C: "am",
              D: "are"
            },
            correctAnswer: "C",
            explanation: "В ответе на вопрос с глаголом to be используем соответствующую форму: I am."
          },
          {
            text: "There aren't ____ here.",
            textExtra: "Здесь нет ресторанов.",
            options: {
              A: "a restaurants",
              B: "any restaurants",
              C: "any restaurant",
              D: "a restaurant"
            },
            correctAnswer: "B",
            explanation: "В отрицании с исчисляемыми во множественном числе используем any + существительное во множественном числе."
          },
          {
            text: "I'm from Paris. ____ is in France.",
            textExtra: "Я из Парижа. Он во Франции.",
            options: {
              A: "They",
              B: "It",
              C: "He",
              D: "She"
            },
            correctAnswer: "B",
            explanation: "Город — неодушевленный предмет, поэтому используем местоимение It."
          },
          {
            text: "____ are my cups!",
            textExtra: "Это мои чашки!",
            options: {
              A: "this",
              B: "that",
              C: "it",
              D: "these"
            },
            correctAnswer: "D",
            explanation: "Для множественного числа и близких предметов используем these."
          },
          {
            text: "____? No, he isn't.",
            textExtra: "Мистер Баннинг учитель? Нет, он не учитель.",
            options: {
              A: "Are they teachers?",
              B: "Are you from Italy?",
              C: "Is Mr Banning a teacher?",
              D: "Is this your phone?"
            },
            correctAnswer: "C",
            explanation: "Короткий ответ No, he isn't соответствует вопросу с he (мужской род, единственное число)."
          },
          {
            text: "What is ____?",
            textExtra: "Какая работа у Мэри?",
            options: {
              A: "job Mary",
              B: "Mary job",
              C: "Mary's job",
              D: "job's Mary"
            },
            correctAnswer: "C",
            explanation: "Принадлежность выражается с помощью притяжательного падежа: Mary's job."
          },
          {
            text: "When do you play tennis? ____ Mondays.",
            textExtra: "Когда ты играешь в теннис? По понедельникам.",
            options: {
              A: "On",
              B: "In",
              C: "At",
              D: "By"
            },
            correctAnswer: "A",
            explanation: "С днями недели используем предлог On."
          },
          {
            text: "My name's Pete and this is Sylvia. ____ doctors from France.",
            textExtra: "Меня зовут Пит, а это Сильвия. Мы врачи из Франции.",
            options: {
              A: "I'm",
              B: "We're",
              C: "She's",
              D: "They're"
            },
            correctAnswer: "B",
            explanation: "Говорящий представляет себя и Сильвию, поэтому используем We're (мы)."
          },
          {
            text: "I don't have ____ meat.",
            textExtra: "У меня нет мяса.",
            options: {
              A: "many",
              B: "much"
            },
            correctAnswer: "B",
            explanation: "Meat — неисчисляемое существительное, поэтому используем much (many — для исчисляемых)."
          },
          {
            text: "It's ____.",
            textExtra: "Это дорогой отель.",
            options: {
              A: "a hotel expensive",
              B: "expensive hotel",
              C: "expensive a hotel",
              D: "an expensive hotel"
            },
            correctAnswer: "D",
            explanation: "Порядок слов: артикль + прилагательное + существительное. Hotel начинается с гласного звука, поэтому an."
          },
          {
            text: "____ like tea or coffee?",
            textExtra: "Не хотите ли чай или кофе?",
            options: {
              A: "You",
              B: "Would you",
              C: "You do"
            },
            correctAnswer: "B",
            explanation: "Вежливое предложение начинается с Would you like...?"
          },
          {
            text: "This is my ____ family.",
            textExtra: "Это семья моего друга.",
            options: {
              A: "friend's",
              B: "friends",
              C: "friend"
            },
            correctAnswer: "A",
            explanation: "Принадлежность (семья друга) — притяжательный падеж friend's."
          },
          {
            text: "____ they live in London?",
            textExtra: "Они живут в Лондоне?",
            options: {
              A: "Are",
              B: "Is",
              C: "Do",
              D: "Does"
            },
            correctAnswer: "C",
            explanation: "Вопросительная форма Present Simple для they — Do."
          },
          {
            text: "How ____ carrots do they have?",
            textExtra: "Сколько у них морковок?",
            options: {
              A: "many",
              B: "a lot of",
              C: "much",
              D: "lots of"
            },
            correctAnswer: "A",
            explanation: "Carrots — исчисляемое во множественном числе, поэтому How many."
          },
          {
            text: "Sorry, I ____ you at the moment.",
            textExtra: "Извините, я не могу помочь вам сейчас.",
            options: {
              A: "can't help",
              B: "don't can help",
              C: "can't helping",
              D: "can't helps"
            },
            correctAnswer: "A",
            explanation: "Модальный глагол can + инфинитив без to. Отрицание: can't help."
          },
          {
            text: "And this is your ____.",
            textExtra: "А это ваш стол.",
            options: {
              A: "desk",
              B: "desks",
              C: "a desk",
              D: "an desk"
            },
            correctAnswer: "A",
            explanation: "После this is your всегда идет существительное в единственном числе без артикля."
          },
          {
            text: "____ to the cinema.",
            textExtra: "Мы не часто ходим в кино.",
            options: {
              A: "We not often go",
              B: "We don't go often",
              C: "We don't often go",
              D: "Often we don't go"
            },
            correctAnswer: "C",
            explanation: "Правильный порядок: подлежащее + don't + наречие частоты (often) + основной глагол."
          },
          {
            text: "What ____ do after school today?",
            textExtra: "Что ты собираешься делать после школы сегодня?",
            options: {
              A: "are you going to",
              B: "are you",
              C: "do you",
              D: "you"
            },
            correctAnswer: "A",
            explanation: "Конструкция be going to для выражения планов на будущее."
          },
          {
            text: "____ two airports in the city.",
            textExtra: "В городе есть два аэропорта.",
            options: {
              A: "It is",
              B: "There is",
              C: "There are",
              D: "This is"
            },
            correctAnswer: "C",
            explanation: "Конструкция there are для множественного числа (two airports)."
          },
          {
            text: "Roy ____ in our company.",
            textExtra: "Рой работает в нашей компании.",
            options: {
              A: "work",
              B: "works",
              C: "is work",
              D: "working"
            },
            correctAnswer: "B",
            explanation: "Roy — 3-е лицо единственное число, поэтому добавляем -s: works."
          },
          {
            text: "I have a lot of ____.",
            textExtra: "У меня много зубов.",
            options: {
              A: "tooths",
              B: "tooth",
              C: "teeth",
              D: "toothes"
            },
            correctAnswer: "C",
            explanation: "Множественное число от tooth — teeth (исключение)."
          },
          {
            text: "Where's Steve? He ____ a shower.",
            textExtra: "Где Стив? Он принимает душ.",
            options: {
              A: "has",
              B: "is having",
              C: "having",
              D: "is have"
            },
            correctAnswer: "B",
            explanation: "Действие происходит прямо сейчас (сейчас принимает душ) — Present Continuous."
          },
          {
            text: "Her birthday is ____ 6th May 1979.",
            textExtra: "Ее день рождения 6 мая 1979 года.",
            options: {
              A: "in",
              B: "at",
              C: "on",
              D: "from"
            },
            correctAnswer: "C",
            explanation: "С конкретной датой (с числом) используем предлог On."
          },
          {
            text: "She ____ speaks on the phone.",
            textExtra: "Она никогда не говорит по телефону.",
            options: {
              A: "never",
              B: "doesn't",
              C: "isn't",
              D: "doesn't never"
            },
            correctAnswer: "A",
            explanation: "В английском языке не используется двойное отрицание. She never speaks — единственный правильный вариант."
          },
          {
            text: "His friends are ____.",
            textExtra: "Его друзья — мужчины.",
            options: {
              A: "man",
              B: "men",
              C: "mans",
              D: "men's"
            },
            correctAnswer: "B",
            explanation: "Множественное число от man — men."
          },
          {
            text: "Who are ____ people?",
            textExtra: "Кто эти люди?",
            options: {
              A: "this",
              B: "those",
              C: "that",
              D: "a"
            },
            correctAnswer: "B",
            explanation: "Для множественного числа и удаленных предметов используем those."
          },
          {
            text: "How many brothers and sisters _____?",
            textExtra: "Сколько у тебя братьев и сестер?",
            options: {
              A: "are you having",
              B: "you have",
              C: "have you",
              D: "do you have"
            },
            correctAnswer: "D",
            explanation: "Вопрос в Present Simple с глаголом have — Do you have."
          },
          {
            text: "Mary is married to John. He's her ____",
            textExtra: "Мэри замужем за Джоном. Он ее муж.",
            options: {
              A: "son",
              B: "husband",
              C: "wife",
              D: "boyfriend"
            },
            correctAnswer: "B",
            explanation: "Мужчина, на котором жената женщина — это husband."
          },
          {
            text: "There ____ windows in my room.",
            textExtra: "В моей комнате есть окна.",
            options: {
              A: "are some",
              B: "is some",
              C: "aren't some",
              D: "is any"
            },
            correctAnswer: "A",
            explanation: "Windows — множественное число, в утверждении используем there are some."
          },
          {
            text: "My aunt is going ____ me on Sunday.",
            textExtra: "Моя тетя собирается навестить меня в воскресенье.",
            options: {
              A: "to visiting",
              B: "visit",
              C: "visiting",
              D: "to visit"
            },
            correctAnswer: "D",
            explanation: "После be going to всегда идет инфинитив с частицей to: to visit."
          },
          {
            text: "The film starts ____ 9 o'clock.",
            textExtra: "Фильм начинается в 9 часов.",
            options: {
              A: "in",
              B: "at",
              C: "on",
              D: "from"
            },
            correctAnswer: "B",
            explanation: "С точным временем (часами) используем предлог At."
          },
          {
            text: "We have ____ sugar in the kitchen.",
            textExtra: "У нас есть немного сахара на кухне.",
            options: {
              A: "a",
              B: "some",
              C: "any",
              D: "many"
            },
            correctAnswer: "B",
            explanation: "В утвердительном предложении с неисчисляемым существительным используем some."
          },
          {
            text: "one potato - two ____.",
            textExtra: "одна картофелина - две картофелины.",
            options: {
              A: "potatoes",
              B: "potatos",
              C: "potato's"
            },
            correctAnswer: "A",
            explanation: "Множественное число от potato — potatoes (добавляется -es)."
          },
          {
            text: "I don't have ____ milk.",
            textExtra: "У меня нет молока.",
            options: {
              A: "a",
              B: "some",
              C: "any",
              D: "many"
            },
            correctAnswer: "C",
            explanation: "В отрицании с неисчисляемым существительным используем any."
          },
          {
            text: "Excuse me, ____ is the T-shirt? It's ₤25.99.",
            textExtra: "Извините, сколько стоит футболка? Она стоит 25.99 фунтов.",
            options: {
              A: "what expensive",
              B: "how much",
              C: "how many",
              D: "how price"
            },
            correctAnswer: "B",
            explanation: "Спрашиваем цену (неисчисляемое) — How much."
          },
          {
            text: "____ leave early today.",
            textExtra: "Я хотел бы уйти пораньше сегодня.",
            options: {
              A: "I like",
              B: "I'd like to",
              C: "I like to"
            },
            correctAnswer: "B",
            explanation: "Выражение желания — I'd like to (I would like to)."
          },
          {
            text: "We usually ____ shopping to a supermarket.",
            textExtra: "Мы обычно ходим за покупками в супермаркет.",
            options: {
              A: "make",
              B: "do",
              C: "have",
              D: "go"
            },
            correctAnswer: "D",
            explanation: "Устойчивое выражение go shopping."
          },
          {
            text: "I'd like ____ omelet, please.",
            textExtra: "Я хотел бы омлет, пожалуйста.",
            options: {
              A: "a",
              B: "an",
              C: "two"
            },
            correctAnswer: "B",
            explanation: "Omelet начинается с гласного звука, поэтому используем an."
          },
          {
            text: "Do you like French ____?",
            textExtra: "Тебе нравится французская еда?",
            options: {
              A: "kitchen",
              B: "meal",
              C: "food",
              D: "cook"
            },
            correctAnswer: "C",
            explanation: "French food — французская еда/кухня (в значении еда)."
          },
          {
            text: "Your bag is ____ the table.",
            textExtra: "Твоя сумка на столе.",
            options: {
              A: "on",
              B: "to",
              C: "in",
              D: "of"
            },
            correctAnswer: "A",
            explanation: "Предмет находится на поверхности — предлог on."
          },
          {
            text: "I'm Jeff Caine. Nice to ____ you, Mr Caine.",
            textExtra: "Я Джефф Кейн. Приятно познакомиться с вами, мистер Кейн.",
            options: {
              A: "speak",
              B: "talk",
              C: "meet",
              D: "watch"
            },
            correctAnswer: "C",
            explanation: "При знакомстве используется Nice to meet you."
          },
          {
            text: "She's only four years old but she ____.",
            textExtra: "Ей всего четыре года, но она умеет читать.",
            options: {
              A: "can read",
              B: "cans read",
              C: "can reads",
              D: "can to read"
            },
            correctAnswer: "A",
            explanation: "Модальный глагол can + инфинитив без частицы to."
          },
          {
            text: "My sister wants ____ a dancer.",
            textExtra: "Моя сестра хочет стать танцовщицей.",
            options: {
              A: "be",
              B: "to being",
              C: "to be",
              D: "to is"
            },
            correctAnswer: "C",
            explanation: "После want всегда идет инфинитив с частицей to: to be."
          },
          {
            text: "Mandy is over there. She's ____ a blue T-shirt and jeans.",
            textExtra: "Мэнди вон там. На ней синяя футболка и джинсы.",
            options: {
              A: "having",
              B: "wearing",
              C: "doing",
              D: "walking"
            },
            correctAnswer: "B",
            explanation: "Глагол wear используется, когда речь идет об одежде, которая надета на человеке."
          }
        ]
      }
    ]
  },
  examA164V1: {
    mainDescription: 'Можно кликать на несколько ответов и...',
    tasks: [
      {
        taskID: "multiple_choice",
        taskDescription: "...или можно менять свой ответ после выбора",
        textScript: null,
        questions: [
          {
            text: "The next film starts ____ 9 o'clock.",
            textExtra: "Следующий фильм начнется в 9 часов.",
            options: { A: "in", B: "at", C: "on", D: "from" },
            correctAnswer: "B",
            explanation: "перед времене используем предлог at 21:00, at 9 PM)"
          },
          {
            text: "We usually ____ shopping to our favorite shop.",
            textExtra: "Мы обычно ходим за покупками в наш любимый магазин.",
            options: { A: "make", B: "do", C: "have", D: "go" },
            correctAnswer: "D",
            explanation: "go shopping — устойчивое выражение 'ходить за покупками' . Do shopping можно было бы если бы там было IN a shop"
          },
          {
            text: "The ____ names are Polina and Annie.",
            textExtra: "Имена девочек — Гейл и Синди.",
            options: { A: "girl is", B: "girls'", C: "girl's", D: "girls" },
            correctAnswer: "B",
            explanation: "если множественное число оканчивается на s, то запятая сверху (она же опостроф - притяжательный падеж) ставится после s"
          },
          {
            text: "____ are my bottles!",
            textExtra: "Вот эти мои бутылки!",
            options: { A: "this", B: "that", C: "it", D: "these" },
            correctAnswer: "D",
            explanation: "this - это одно, that - то одно, these - эти несколько, those - те несколько"
          },
          {
            text: "And this is your ____ , and it looks great!",
            textExtra: "А это твоё рабочее место и оно выглядит потрясающе.",
            options: { A: "desk", B: "desks", C: "a desk", D: "an desk", E: "an desk" },
            correctAnswer: "A",
            explanation: "с притяжательными словами (your) не нужен артикль"
          },
          {
            text: "I'm from Vilnius. ____ is in Lithuania.",
            textExtra: "Я из Вильнюса. Он во Франции.",
            options: { A: "They", B: "It", C: "He", D: "She" },
            correctAnswer: "B",
            explanation: "Париж — это город (it), неодушевлённый предмет"
          },
          {
            text: "____? No, he isn't.",
            textExtra: "____? Нет, он не является им.",
            options: { A: "Are they actors?", B: "Are you from Vilnius?", C: "Is Arnold an actor?", D: "Is this your Android?" },
            correctAnswer: "C",
            explanation: "в ответе he, значит вопрос про мужчину → Is Mr Banning a teacher?"
          },
          {
            text: "A lot of ____ live alone.",
            textExtra: "Много людей живут одни.",
            options: { A: "people", B: "man", C: "person", D: "we" },
            correctAnswer: "A",
            explanation: "people — уже множественное число (люди), остальные не подходят"
          },
          {
            text: "My name's Connor and this is Mike Tyson. ____ fighters.",
            textExtra: "Меня зовут Конор, а это Майк Тайсон. Мы бойцы.",
            options: { A: "I'm", B: "We're", C: "She's", D: "They're" },
            correctAnswer: "B",
            explanation: "Я говорю о себе - Коннор и о Майке  → мы (We're)"
          },
          {
            text: "Her birthday is ____ the 5th of April 1998.",
            textExtra: "Её день рождения 6 мая 1979 года.",
            options: { A: "in", B: "at", C: "on", D: "from" },
            correctAnswer: "C",
            explanation: "с конкретной датой используем предлог ON"
          },
          {
            text: "“Hello! How are you?” – ____ .",
            textExtra: "— Привет! Как дела? — У меня всё отлично.",
            options: { A: "I'm fine", B: "I'm very", C: "I'm very super fine", D: "Thanks", E: "Чего блин? Ай доунт спик Инглиш" },
            correctAnswer: "A",
            explanation: "стандартный ответ на How are you? — I'm fine. Остальные ответы глупенькие"
          },
          {
            text: "I want ____ omelet, please.",
            textExtra: "Я хочу омлет, пожалуйста.",
            options: { A: "a", B: "--", C: "an", D: "two" },
            correctAnswer: "C",
            explanation: "omelet начинается с гласного звука → an (an omelet)"
          },
          {
            text: "Do you sleep ____ Sunday afternoon?",
            textExtra: "Ты спишь в воскресенье днём?",
            options: { A: "in", B: "at", C: "on", D: "from" },
            correctAnswer: "C",
            explanation: "с днями недели + часть дня → on Sunday afternoon"
          },
          {
            text: "____ they live in London?",
            textExtra: "Они живут в Лондоне?",
            options: { A: "Are", B: "Is", C: "Do", D: "Does" },
            correctAnswer: "C",
            explanation: "вопрос в Present Simple с they → вспомогательный глагол Do"
          },
          {
            text: "There aren't ____ here.",
            textExtra: "Здесь нет ресторанов.",
            options: { A: "a restaurants", B: "any restaurants", C: "any restaurant", D: "a restaurant" },
            correctAnswer: "B",
            explanation: "отрицание + множественное число → any restaurants"
          },
          {
            text: "What are ____ names?",
            textExtra: "Как их зовут?",
            options: { A: "they", B: "this", C: "their", D: "they're" },
            correctAnswer: "C",
            explanation: "их имена → притяжательное местоимение their"
          },
          {
            text: "Ron is ____ tired.",
            textExtra: "Рон устал.",
            options: { A: "a", B: "an", C: "--" },
            correctAnswer: "C",
            explanation: "перед прилагательным tired артикль не нужен"
          },
          {
            text: "____ to the Disneyland.",
            textExtra: "Мы не часто ходим в кино.",
            options: { A: "We not often go", B: "We don't go often", C: "We don't often go", D: "Often we don't go" },
            correctAnswer: "C",
            explanation: "слово OFTEN (наречие частотности) ставится перед смысловым глаголом. Любой другой вариант можно конечно попытаться за уши притянуть по приколу и настоять что типа правильно, но вообще это бред - так что просто так запомните - we don't often go there"
          },
          {
            text: "His ____ name is Peter.",
            textExtra: "Его отца зовут Питер.",
            options: { A: "father's", B: "father is", C: "of father", D: "father" },
            correctAnswer: "A",
            explanation: "имя отца → притяжательный падеж father's"
          },
          {
            text: "Stephen ____ in our company.",
            textExtra: "Стивен работает в нашей компании.",
            options: { A: "work", B: "works", C: "is work", D: "working" },
            correctAnswer: "B",
            explanation: "Stephen (он) → в Present Simple добавляем -s: works"
          },
          {
            text: "It's ____.",
            textExtra: "Это дорогой отель.",
            options: { A: "a hotel expensive", B: "expensive hotel", C: "expensive a hotel", D: "an expensive hotel" },
            correctAnswer: "D",
            explanation: "expensive начинается с гласного → an, прилагательное перед существительным"
          },
          {
            text: "Where's Steve? He ____ a shower.",
            textExtra: "Где Стив? Он принимает душ.",
            options: { A: "has", B: "is having", C: "having", D: "is have" },
            correctAnswer: "B",
            explanation: "действие происходит сейчас → Present Continuous: is having"
          },
          {
            text: "We're coming ____ train.",
            textExtra: "Мы едем на поезде.",
            options: { A: "with", B: "by", C: "for", D: "in" },
            correctAnswer: "B",
            explanation: "способ передвижения → by train (by car, by bus)"
          },
          {
            text: "one potato - two ____.",
            textExtra: "одна картофелина — две картофелины",
            options: { A: "potatoes", B: "potatos", C: "potato's" },
            correctAnswer: "A",
            explanation: "множественное число potato → potatoes (добавляем -es)"
          },
          {
            text: "She ____ speaks on the phone.",
            textExtra: "Она никогда не говорит по телефону.",
            options: { A: "never", B: "doesn't", C: "isn't", D: "doesn't never" },
            correctAnswer: "A",
            explanation: "never (никогда) уже означает отрицание, doesn't не нужно"
          },
          {
            text: "I'm always tired ____ the morning.",
            textExtra: "Я всегда уставший по утрам.",
            options: { A: "in", B: "at", C: "on", D: "from" },
            correctAnswer: "A",
            explanation: "части суток → in the morning, in the afternoon, in the evening"
          },
          {
            text: "I have a lot of ____.",
            textExtra: "У меня много зубов.",
            options: { A: "tooths", B: "tooth", C: "teeth", D: "toothes" },
            correctAnswer: "C",
            explanation: "исключение: tooth → teeth (зуб → зубы)"
          },
          {
            text: "“Are you skinny?” – “Yes, ____”.",
            textExtra: "— Ты худой? — Да.",
            options: { A: "I do", B: "I have", C: "I'm", D: "I am" },
            correctAnswer: "D",
            explanation: "краткий ответ на Are you... → Yes, I am"
          },
          {
            text: "There ____ windows in my room.",
            textExtra: "В моей комнате есть несколько окон.",
            options: { A: "are some", B: "is some", C: "aren't some", D: "is any" },
            correctAnswer: "A",
            explanation: "windows — мн.ч., утверждение → There are some"
          },
          {
            text: "I'm going ____ the bank.",
            textExtra: "Я иду в банк.",
            options: { A: "on", B: "to", C: "in", D: "of" },
            correctAnswer: "B",
            explanation: "направление движения → go to the bank"
          },
          {
            text: "What is ____?",
            textExtra: "Какая у Мэри работа?",
            options: { A: "job Mary", B: "Mary job", C: "Mary's job", D: "job's Mary" },
            correctAnswer: "C",
            explanation: "работа Мэри → притяжательный падеж Mary's job"
          },
          {
            text: "Mary is married to John. He's her ____",
            textExtra: "Мэри замужем за Джоном. Он её муж.",
            options: { A: "son", B: "husband", C: "wife", D: "boyfriend" },
            correctAnswer: "B",
            explanation: "мужчина, на котором жената Мэри → husband (муж)"
          },
          {
            text: "Your bag is ____ the desk.",
            textExtra: "Твоя сумка на столе.",
            options: { A: "on", B: "to", C: "in", D: "of" },
            correctAnswer: "A",
            explanation: "на поверхности → on the desk"
          },
          {
            text: "I'm Jeff Caine. Nice to ____ you, Mr Caine.",
            textExtra: "Я Джефф Кейн. Приятно познакомиться, мистер Кейн.",
            options: { A: "speak", B: "talk", C: "meet", D: "watch" },
            correctAnswer: "C",
            explanation: "при знакомстве → Nice to meet you"
          },
          {
            text: "____ two airports in the city.",
            textExtra: "В городе два аэропорта.",
            options: { A: "It is", B: "There is", C: "There are", D: "This is" },
            correctAnswer: "C",
            explanation: "there are + мн.ч. (two airports) → 'имеется, находится'"
          },
          {
            text: "Mandy is over there. She's ____ a blue T-shirt and jeans.",
            textExtra: "Мэнди вон там. На ней синяя футболка и джинсы.",
            options: { A: "having", B: "wearing", C: "doing", D: "walking" },
            correctAnswer: "B",
            explanation: "на ней надето → wearing (носить одежду)"
          },
          {
            text: "His friends are ____.",
            textExtra: "Его друзья — мужчины.",
            options: { A: "man", B: "men", C: "mans", D: "men's" },
            correctAnswer: "B",
            explanation: "множественное число man → men (мужчины)"
          },
          {
            text: "I ____ 25 years old.",
            textExtra: "Мне 25 лет.",
            options: { A: "have", B: "am", C: "has", D: "is" },
            correctAnswer: "B",
            explanation: "о возрасте: I am 25 years old (глагол to be)"
          },
          {
            text: "When do you play tennis? ____ Mondays.",
            textExtra: "Когда ты играешь в теннис? По понедельникам.",
            options: { A: "On", B: "In", C: "At", D: "By" },
            correctAnswer: "A",
            explanation: "с днями недели → on Mondays (по понедельникам)"
          },
          {
            text: "one party – two ____.",
            textExtra: "одна вечеринка — две вечеринки",
            options: { A: "parties", B: "partys", C: "partys" },
            correctAnswer: "A",
            explanation: "party → parties (y меняется на ies)"
          },
          {
            text: "How many brothers and sisters _____?",
            textExtra: "Сколько у тебя братьев и сестёр?",
            options: { A: "are you having", B: "you have", C: "have you", D: "do you have" },
            correctAnswer: "D",
            explanation: "вопрос в Present Simple: How many... do you have?"
          },
          {
            text: "Who are ____ people?",
            textExtra: "Кто эти люди?",
            options: { A: "this", B: "those", C: "that", D: "a" },
            correctAnswer: "B",
            explanation: "people (мн.ч.) + 'те' на расстоянии → those people"
          },
          {
            text: "This is ____ milk.",
            textExtra: "Это молоко.",
            options: { A: "a", B: "an", C: "--" },
            correctAnswer: "C",
            explanation: "milk — неисчисляемое, артикль не нужен"
          },
          {
            text: "We're students. That's ____ classroom.",
            textExtra: "Мы студенты. Это наш класс.",
            options: { A: "we", B: "our", C: "is", D: "the we" },
            correctAnswer: "B",
            explanation: "притяжательное местоимение 'наш' → our"
          },
          {
            text: "This is my ____ family.",
            textExtra: "Это семья моего друга.",
            options: { A: "friend's", B: "friends", C: "friend" },
            correctAnswer: "A",
            explanation: "семья друга → притяжательный падеж"
          }
        ]
      }
    ]
  },
  examA164V2: {
    mainDescription: 'Можно кликать на несколько ответов и...',
    tasks: [
      {
        taskID: "multiple_choice",
        taskDescription: "...или можно менять свой ответ после выбора",
        textScript: null,
        questions: [
          {
            text: "Mr. President is ____ clever.",
            textExtra: "Мистер президент умный.",
            options: { A: "a", B: "an", C: "--" },
            correctAnswer: "C",
            explanation: "перед одним прилагательным, без существительного артикль не нужен, если бы после прилагательного было существительное, тогда нужен был бы"
          },
          {
            text: "I'm from Beijing. ____ is in China.",
            textExtra: "Я из Пекина. Он в Китае.",
            options: { A: "They", B: "It", C: "He", D: "She" },
            correctAnswer: "B",
            explanation: "Пекин — это город, про города говорим it (он)"
          },
          {
            text: "My lamp is ____ the floor.",
            textExtra: "Моя лампа на полу.",
            options: { A: "on", B: "to", C: "in", D: "of" },
            correctAnswer: "A",
            explanation: "на поверхности → on (на полу)"
          },
          {
            text: "one photo – two ____.",
            textExtra: "одно фото — два фото",
            options: { A: "photos", B: "photoes", C: "photo's" },
            correctAnswer: "A",
            explanation: "photo → photos (просто добавляем s, photoes — неправильно)"
          },
          {
            text: "____? No, they aren't.",
            textExtra: "Они учителя? Нет.",
            options: { A: "Are they teachers?", B: "Are you from Italy?", C: "Is Mr Banning a teacher?", D: "Is this your phone?" },
            correctAnswer: "A",
            explanation: "в ответе they aren't (они не), значит вопрос про них → Are they teachers?"
          },
          {
            text: "Her birthday is ____ 6th May, 1979.",
            textExtra: "Её день рождения 6 мая 1979 года.",
            options: { A: "in", B: "at", C: "on", D: "from" },
            correctAnswer: "C",
            explanation: "с конкретной датой (число + месяц) → on"
          },
          {
            text: "It's ____.",
            textExtra: "Это вкусный апельсин.",
            options: { A: "an orange delicious", B: "delicious orange", C: "delicious an orange", D: "a delicious orange" },
            correctAnswer: "D",
            explanation: "сначала артикль a, потом прилагательное delicious, потом существительное orange"
          },
          {
            text: "Where are ____ bananas?",
            textExtra: "Где те бананы?",
            options: { A: "this", B: "those", C: "that", D: "a" },
            correctAnswer: "B",
            explanation: "бананов несколько (мн.ч.) и они вдалеке → those (те)"
          },
          {
            text: "There aren't ____ here.",
            textExtra: "Здесь нет банков.",
            options: { A: "a banks", B: "any banks", C: "any bank", D: "a bank" },
            correctAnswer: "B",
            explanation: "отрицание (aren't) + банков несколько (мн.ч.) → any banks"
          },
          {
            text: "A lot of ____ live in cities.",
            textExtra: "Много людей живут в городах.",
            options: { A: "people", B: "man", C: "person", D: "we" },
            correctAnswer: "A",
            explanation: "people — это уже 'люди' (множественное число)"
          },
          {
            text: "I ____ tired.",
            textExtra: "Я не устал.",
            options: { A: "amn't", B: "am not", C: "don't", D: "aren't" },
            correctAnswer: "B",
            explanation: "I am not — правильное отрицание, amn't не существует"
          },
          {
            text: "I only sleep ____ night.",
            textExtra: "Я сплю только ночью.",
            options: { A: "in", B: "at", C: "on", D: "from" },
            correctAnswer: "B",
            explanation: "at night — ночью (устойчивое выражение)"
          },
          {
            text: "____ football.",
            textExtra: "Мы не часто играем в футбол.",
            options: { A: "We not often play", B: "We don't often play", C: "We don't play often", D: "Often we don't play" },
            correctAnswer: "B",
            explanation: "often (часто) ставим перед глаголом play"
          },
          {
            text: "I love ____ coffee.",
            textExtra: "Я люблю кофе.",
            options: { A: "a", B: "an", C: "--" },
            correctAnswer: "C",
            explanation: "кофе — неисчисляемое, артикль не нужен"
          },
          {
            text: "Bob ____ in England.",
            textExtra: "Боб живёт в Англии.",
            options: { A: "live", B: "lives", C: "is live", D: "living" },
            correctAnswer: "B",
            explanation: "Боб — это он, к глаголу добавляем s → lives"
          },
          {
            text: "Where is ____?",
            textExtra: "Где кошка Джима?",
            options: { A: "cat Jim's", B: "Jim cat", C: "Jim's cat", D: "cat's Jim" },
            correctAnswer: "C",
            explanation: "кошка принадлежит Джиму → сначала хозяин с апострофом 's, потом кошка"
          },
          {
            text: "You're doctors. That's ____ hospital.",
            textExtra: "Вы врачи. Это ваша больница.",
            options: { A: "you", B: "your", C: "is", D: "the you" },
            correctAnswer: "B",
            explanation: "ваша больница → your hospital"
          },
          {
            text: "There ____ people in my house.",
            textExtra: "В моём доме есть люди.",
            options: { A: "is some", B: "are some", C: "aren't some", D: "is any" },
            correctAnswer: "B",
            explanation: "люди (people) — это они → there are some"
          },
          {
            text: "Look at his ____.",
            textExtra: "Посмотри на его ноги.",
            options: { A: "foots", B: "feet", C: "foot's", D: "feat" },
            correctAnswer: "B",
            explanation: "исключение: одна нога foot, две ноги feet"
          },
          {
            text: "His name's Pete and that is Sylvia. ____ doctors from France.",
            textExtra: "Его зовут Пит, а это Сильвия. Они врачи из Франции.",
            options: { A: "I'm", B: "We're", C: "She's", D: "They're" },
            correctAnswer: "D",
            explanation: "Пит и Сильвия — это они (мн.ч.) → They're"
          },
          {
            text: "He doesn't go ____ school.",
            textExtra: "Он не ходит в школу.",
            options: { A: "on", B: "to", C: "in", D: "of" },
            correctAnswer: "B",
            explanation: "идти в школу → go to school"
          },
          {
            text: "The ____ names are Fred and Tom.",
            textExtra: "Имена мальчиков — Фред и Том.",
            options: { A: "boy is", B: "boys'", C: "boy's", D: "boys" },
            correctAnswer: "B",
            explanation: "мальчиков несколько → boys, апостроф после s → boys'"
          },
          {
            text: "Where is Don? He ____ lunch.",
            textExtra: "Где Дон? Он обедает.",
            options: { A: "has", B: "is having", C: "having", D: "is have" },
            correctAnswer: "B",
            explanation: "действие происходит прямо сейчас → is having (Present Continuous)"
          },
          {
            text: "We're coming ____ car.",
            textExtra: "Мы едем на машине.",
            options: { A: "with", B: "by", C: "for", D: "in" },
            correctAnswer: "B",
            explanation: "на машине (способ передвижения) → by car"
          },
          {
            text: "one story – two ____.",
            textExtra: "одна история — две истории",
            options: { A: "storys", B: "storys", C: "stories" },
            correctAnswer: "C",
            explanation: "story → stories (y меняется на ies)"
          },
          {
            text: "She ____ has a shower.",
            textExtra: "Она никогда не принимает душ.",
            options: { A: "never", B: "doesn't", C: "isn't", D: "doesn't never" },
            correctAnswer: "A",
            explanation: "never (никогда) уже означает 'не', двойное отрицание не нужно"
          },
          {
            text: "How many cars _____?",
            textExtra: "Сколько у тебя машин?",
            options: { A: "are you having", B: "you have", C: "have you", D: "do you have" },
            correctAnswer: "D",
            explanation: "вопрос 'сколько у тебя' → How many... do you have?"
          },
          {
            text: "His ____ name is Lory.",
            textExtra: "Его сестру зовут Лори.",
            options: { A: "sister's", B: "sister is", C: "of sister", D: "sister" },
            correctAnswer: "A",
            explanation: "имя сестры → sister's (притяжательный падеж)"
          },
          {
            text: "“Are you smart?” – “Yes, ____”.",
            textExtra: "— Ты умный? — Да.",
            options: { A: "I do", B: "I have", C: "I'm", D: "I am" },
            correctAnswer: "D",
            explanation: "краткий ответ на Are you... → Yes, I am"
          },
          {
            text: "He has a lot of ____.",
            textExtra: "У него много детей.",
            options: { A: "child", B: "childs", C: "children", D: "children's" },
            correctAnswer: "C",
            explanation: "один ребенок child, много детей children (исключение)"
          },
          {
            text: "I ____ 25 years old.",
            textExtra: "Мне 25 лет.",
            options: { A: "have", B: "am", C: "has", D: "is" },
            correctAnswer: "B",
            explanation: "про возраст говорим I am ... years old"
          },
          {
            text: "I ride my bike ____ Thursday morning.",
            textExtra: "Я катаюсь на велосипеде в четверг утром.",
            options: { A: "in", B: "at", C: "on", D: "from" },
            correctAnswer: "C",
            explanation: "день недели + часть дня → on Thursday morning"
          },
          {
            text: "Mary is married to John. He's her ____.",
            textExtra: "Мэри замужем за Джоном. Он её муж.",
            options: { A: "son", B: "husband", C: "wife", D: "boyfriend" },
            correctAnswer: "B",
            explanation: "мужчина, на котором жената Мэри → husband (муж)"
          },
          {
            text: "She is my ____ sister.",
            textExtra: "Она сестра моей мамы.",
            options: { A: "mom's", B: "moms", C: "mom" },
            correctAnswer: "A",
            explanation: "сестра принадлежит маме → mom's (мамина)"
          },
          {
            text: "“Hello! How are you?” – ____ .",
            textExtra: "— Привет! Как дела? — У меня всё отлично.",
            options: { A: "I'm fine", B: "I'm very", C: "I'm very fine", D: "Thanks" },
            correctAnswer: "A",
            explanation: "стандартный ответ на How are you? → I'm fine"
          },
          {
            text: "Oh, ____ are my keys!",
            textExtra: "О, вот мои ключи!",
            options: { A: "this", B: "these", C: "that", D: "it" },
            correctAnswer: "B",
            explanation: "ключей несколько и они рядом → these (эти)"
          },
          {
            text: "I'm Jeff Caine. Nice to ____ you, Mr Caine.",
            textExtra: "Я Джефф Кейн. Приятно познакомиться, мистер Кейн.",
            options: { A: "speak", B: "talk", C: "meet", D: "watch" },
            correctAnswer: "C",
            explanation: "при знакомстве говорим Nice to meet you (приятно познакомиться)"
          },
          {
            text: "I want ____ orange, please.",
            textExtra: "Я хочу апельсин, пожалуйста.",
            options: { A: "a", B: "--", C: "an", D: "two" },
            correctAnswer: "C",
            explanation: "orange начинается с гласного звука (о) → an orange"
          },
          {
            text: "Mandy is over there. She's ____ a blue T-shirt and jeans.",
            textExtra: "Мэнди вон там. На ней синяя футболка и джинсы.",
            options: { A: "having", B: "wearing", C: "doing", D: "walking" },
            correctAnswer: "B",
            explanation: "на ней надето → wearing (носить одежду)"
          },
          {
            text: "I work late ____ Wednesdays.",
            textExtra: "Я работаю допоздна по средам.",
            options: { A: "in", B: "on", C: "at", D: "by" },
            correctAnswer: "B",
            explanation: "с днями недели → on"
          },
          {
            text: "When are ____ birthdays?",
            textExtra: "Когда у них дни рождения?",
            options: { A: "they", B: "this", C: "their", D: "they're" },
            correctAnswer: "C",
            explanation: "их - their, this - этот один, they - они, they're они являются"
          },
          {
            text: "This is your ___.",
            textExtra: "Это твой экзамен.",
            options: { A: "a exam", B: "an exam", C: "exam", D: "exams" },
            correctAnswer: "C",
            explanation: "после your (твой) артикль не нужен"
          },
          {
            text: "We usually ____ shopping to a supermarket.",
            textExtra: "Мы обычно ходим за покупками в супермаркет.",
            options: { A: "make", B: "do", C: "have", D: "go" },
            correctAnswer: "D",
            explanation: "устройчивое выражение - go shopping — ходить за покупками"
          },
          {
            text: "____ many hotels in Moscow.",
            textExtra: "В Москве много отелей.",
            options: { A: "It is", B: "There is", C: "There are", D: "This is" },
            correctAnswer: "C",
            explanation: "отели (мн.ч.) → there are (находятся, там имеются)"
          },
          {
            text: "That awesome show starts ____ 6 or 7 pm.",
            textExtra: "Концерт начинается в 6 или 7 вечера.",
            options: { A: "in", B: "at", C: "on", D: "from" },
            correctAnswer: "B",
            explanation: "перед временем говорим at"
          }
        ]
      }
    ]
  },

  test1V1: {
    mainDescription: "Let's find out the weak spots",
    tasks: [
      {
        taskDescription: 'Read out loud, choose the best variant',
        audio: null,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: null,
        questions: [
          {
            text: "Вопрос",
            options: {
              A: "answer",
              B: "answer",
              C: "answer",
              D: "answer",
              E: "answer",
            },
            correctAnswer: "D"
          },
        ]
      },

    ]
  },
  testWeakSpots6V1: {
    mainDescription: "Click the correct answer",
    tasks: [
      {
        taskDescription: 'Don`t be afraid, Vincent will help you... later',
        audio: null,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: null,
        questions: [
          {
            text: "By the age of 18, I ____ not to go to university.",
            options: {
              A: "had decided",
              B: "decided",
              C: "have decided",
              D: "was deciding"
            },
            correctAnswer: "A"
          },
          {
            text: "I’m afraid your car ____ repaired before next week.",
            options: {
              A: "hasn’t been",
              B: "wasn’t",
              C: "wouldn’t be",
              D: "can’t be"
            },
            correctAnswer: "D"
          },
          {
            text: "You may borrow my laptop ____ you promise to look after it.",
            options: {
              A: "unless",
              B: "in case",
              C: "as long as",
              D: "although"
            },
            correctAnswer: "C"
          },
          {
            text: "If the taxi hadn’t stopped for us, we ____ standing in the rain.",
            options: {
              A: "were still",
              B: "would still be",
              C: "are still",
              D: "will still be"
            },
            correctAnswer: "B"
          },
          {
            text: "____ I had the talent, I still wouldn’t want to be a movie star.",
            options: {
              A: "In case",
              B: "Even if",
              C: "Provided that",
              D: "However much"
            },
            correctAnswer: "B"
          },
          {
            text: "By the end of today’s seminar I will ____ to each of you individually.",
            options: {
              A: "speak",
              B: "have spoken",
              C: "be speaking",
              D: "have been speaking"
            },
            correctAnswer: "B"
          },
          {
            text: "This is a photo of my little sister ____ ice cream on the beach.",
            options: {
              A: "eat",
              B: "eating",
              C: "was eating",
              D: "having eaten"
            },
            correctAnswer: "B"
          },
          {
            text: "I’d lived in Australia, so I was used to ____ on the left side of the road.",
            options: {
              A: "driving",
              B: "drive",
              C: "having driven",
              D: "drove"
            },
            correctAnswer: "A"
          },
          {
            text: "The number of turtles on the island ____ by 70% over the last decade.",
            options: {
              A: "has declined",
              B: "has been declining",
              C: "has been declined",
              D: "is declining"
            },
            correctAnswer: "A"
          },
          {
            text: "What do you do?",
            options: {
              A: "I do a teacher.",
              B: "I working in a bank.",
              C: "I’m taking a test.",
              D: "I’m a doctor."
            },
            correctAnswer: "D"
          },
          {
            text: "If the decision ____ before he arrived, he would have been furious.",
            options: {
              A: "was taken",
              B: "was being taken",
              C: "would have been taken",
              D: "had been taken"
            },
            correctAnswer: "D"
          },
          {
            text: "Women had to fight hard to gain ____ equality.",
            options: {
              A: "the",
              B: "her",
              C: "an",
              D: "---"
            },
            correctAnswer: "D"
          },
          {
            text: "I've never heard ____ ridiculous speech.",
            options: {
              A: "such a",
              B: "so a",
              C: "a such",
              D: "a so"
            },
            correctAnswer: "A"
          },
          {
            text: "James is staying with ____ while he is in New York.",
            options: {
              A: "Greens",
              B: "the Green",
              C: "the Greens",
              D: "Green"
            },
            correctAnswer: "C"
          },
          {
            text: "No one wants to have extra homework tonight, ____",
            options: {
              A: "don't he",
              B: "do they",
              C: "does he",
              D: "don't they"
            },
            correctAnswer: "B"
          },
          {
            text: "I can reassure you that everything ____ as quickly as possible.",
            options: {
              A: "will deal with",
              B: "will be dealt",
              C: "will deal",
              D: "will be dealt with"
            },
            correctAnswer: "D"
          },
          {
            text: "My uncle ____ some land in southern France recently.",
            options: {
              A: "bought",
              B: "has bought",
              C: "is buying",
              D: "will have bought"
            },
            correctAnswer: "B"
          },
          {
            text: "They ___ forward to the concert the whole week.",
            options: {
              A: "are looking",
              B: "had looked",
              C: "have been looking",
              D: "looked"
            },
            correctAnswer: "C"
          },
          {
            text: "Bill Gates was only 20 years old when he ___ Microsoft.",
            options: {
              A: "found",
              B: "founded",
              C: "finds",
              D: "had found"
            },
            correctAnswer: "B"
          },
          {
            text: "The judge sentenced the man to eight years in prison because he ___ a bank.",
            options: {
              A: "has robbed",
              B: "was robbing",
              C: "has been robbing",
              D: "had robbed"
            },
            correctAnswer: "D"
          },
          {
            text: "They ___ for over 5 hours when the manager told them that the club was closed.",
            options: {
              A: "had been dancing",
              B: "had danced",
              C: "were dancing",
              D: "have been dancing"
            },
            correctAnswer: "A"
          },
          {
            text: "Look! Your car ___ lifted off the ground.",
            options: {
              A: "has just being",
              B: "was just being",
              C: "is just being",
              D: "is just lifted"
            },
            correctAnswer: "C"
          },
          {
            text: "They ____ accept it.",
            options: {
              A: "were made",
              B: "were made to"
            },
            correctAnswer: "B"
          },
          {
            text: "If we weren't careful, the bike ___ destroyed.",
            options: {
              A: "had",
              B: "has been",
              C: "had been",
              D: "would be"
            },
            correctAnswer: "D"
          },
          {
            text: "When I was a child, I never ___ about the future.",
            options: {
              A: "have worried",
              B: "used to worry",
              C: "was worrying",
              D: "would worried"
            },
            correctAnswer: "B"
          },
          {
            text: "I promise I’ll call you as soon as ___.",
            options: {
              A: "I arrive",
              B: "I arrived",
              C: "I’ll arrive",
              D: "I’ll have arrive"
            },
            correctAnswer: "A"
          },
          {
            text: "Why on earth isn’t Josh here yet? ___ for him for over an hour!",
            options: {
              A: "I’m waiting",
              B: "I’ve been waiting",
              C: "I’ve waited",
              D: "I’m being waiting"
            },
            correctAnswer: "B"
          },
          {
            text: "Ocean currents ___ play an important part in regulating global climate.",
            options: {
              A: "are known to",
              B: "thought to",
              C: "are believed that they"
            },
            correctAnswer: "A"
          },
          {
            text: "Where did you go ___ holiday last year?",
            options: {
              A: "for",
              B: "on",
              C: "to"
            },
            correctAnswer: "B"
          },
          {
            text: "Tomorrow’s a holiday, so we ___ go to work.",
            options: {
              A: "have to",
              B: "mustn’t",
              C: "don’t have to"
            },
            correctAnswer: "C"
          },
          {
            text: "Can you open the ____ for me, please? I’m carrying a stack of plates.",
            options: {
              A: "door of kitchen",
              B: "kitchen door",
              C: "kitchen’s door"
            },
            correctAnswer: "B"
          },
          {
            text: "I borrowed a ____ bike and went into town in the lunch break.",
            options: {
              A: "friend of my",
              B: "friend's of my",
              C: "friend's of mine",
              D: "friend of mine's"
            },
            correctAnswer: "D"
          },
          {
            text: "They live about ____ from here.",
            options: {
              A: "an hour of drive",
              B: "a drive hour",
              C: "an hour's drive",
              D: "a drive of an hour"
            },
            correctAnswer: "C"
          },
          {
            text: "I took the ____ clothes back to the shop.",
            options: {
              A: "other",
              B: "others",
              C: "another"
            },
            correctAnswer: "A"
          },
          {
            text: "We will be staying for ____ day.",
            options: {
              A: "other",
              B: "another",
              C: "others"
            },
            correctAnswer: "B"
          }
        ]
      },

    ]
  },
  AreAmIs0: {
    mainDescription: "Все делают ошибки 🤯",
    secondDescription: "(не бойтесь ошибиться, а затем исправить на другой ответ)",
    tasks: [
      {
        taskDescription: 'читай вслух и нажимай ответы',
        audio: null,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: null,
        questions: [
          {
            text: "crocodile ___ green <br>(крокодил зеленый)",
            options: {
              A: "are",
              B: "am",
              C: "is",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "C",
            explanation: " am + я<br><br>are + ты <br>are + вы <br>are + мы <br>are + они<br><br>is + он <br>is + она <br>is + оно <br>is + это"

          },
          {
            text: "Snow ___ yellow ! <br> (Снег жёлтый)",
            options: {
              A: "are",
              B: "is",
              C: "is not",
              D: "am",
              E: "not",
            },
            correctAnswer: ["B","C"],
            explanation: " am + я<br><br>are + ты <br>are + вы <br>are + мы <br>are + они<br><br>is + он <br>is + она <br>is + оно <br>is + это"
          },
          {
            text: "I ___ a student.<br>(Я студент)",
            options: {
              A: "is",
              B: "are",
              C: "am",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "C",
            explanation: " am + я<br><br>are + ты <br>are + вы <br>are + мы <br>are + они<br><br>is + он <br>is + она <br>is + оно <br>is + это"
          },
          {
            text: "She ___ my best friend.<br>(Она моя лучшая подруга)",
            options: {
              A: "am",
              B: "are",
              C: "is",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "C",
            explanation: " am + я<br><br>are + ты <br>are + вы <br>are + мы <br>are + они<br><br>is + он <br>is + она <br>is + оно <br>is + это"
          },
          {
            text: "We ___ happy.<br>(Мы счастливы)",
            options: {
              A: "am",
              B: "is",
              C: "are",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "C",
            explanation: " am + я<br><br>are + ты <br>are + вы <br>are + мы <br>are + они<br><br>is + он <br>is + она <br>is + оно <br>is + это"
          },
          {
            text: "Your dog ___ angry<br>(Ваша собака злая)",
            options: {
              A: "am",
              B: "is",
              C: "are",
              E: "ничего не нужно вставлять"

            },
            correctAnswer: "B",
            explanation: "Ваша собака = она (she is / it is)"
          },
          {
            text: "___ I late?<br>(Я опоздал?)",
            options: {
              A: "Am",
              B: "Is",
              C: "Are",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "A",
            explanation: "Am I late ? — вопрос<br><br>I am late . - утверждение"
          },
                    {
            text: "You and I ___ good.<br>(Ты и я хорошие)",
            options: {
              A: "am",
              B: "is",
              C: "are",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "C",
            explanation: "You and I = 2 человека <br><br> we (мы) are good"
          },
          {
            text: "My bro and I ___ sportsmen.<br>(Мой брат и я спортсмены)",
            options: {
              A: "am",
              B: "is",
              C: "are",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "C",
            explanation: "He and I = 2 человека <br><br> we (мы) are спортики"
          },
          {
            text: "Students ___ here.<br>(Студенты здесь)",
            options: {
              A: "am",
              B: "is",
              C: "are",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "C",
            explanation: " they = students = они + are"
          },
          {
            text: "One of my friends ___ a doctor.<br>(Один из моих друзей врач)",
            options: {
              A: "am",
              B: "is",
              C: "are",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "B",
            explanation: "One of my friends = один из друзей<br><br>He/She + is"
          },
          {
            text: "She and he ___ a team.<br>(Она и он команда)",
            options: {
              A: "am",
              B: "is",
              C: "are",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "C",
            explanation: "2 человека = Она и он<br> Они = They are "
          },
          {
            text: "Shrek and Fiona ___ green.<br>(Шрэк и Фиона зелёные)",
            options: {
              A: "am",
              B: "is",
              C: "are",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "C",
            explanation: "2 персонажа = Она и он<br> Они = They are<br>Огры, орки, они"
          },
          {
            text: "Vincent ___ not very stupid.<br>(Винсент не очень туп)",
            options: {
              A: "am",
              B: "is",
              C: "are",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "B",
            explanation: " am + я<br><br>are + ты <br>are + вы <br>are + мы <br>are + они<br><br>is + он <br>is + она <br>is + оно <br>is + это"
          },
          {
            text: "Pizza ___ our favorite food.<br>(Пицца - наша любимая еда)",
            options: {
              A: "am",
              B: "is",
              C: "are",
              D: "ничего не нужно вставлять"
            },
            correctAnswer: "B",
            explanation: " am + я<br><br>are + ты <br>are + вы <br>are + мы <br>are + они<br><br>is + он <br>is + она <br>is + оно <br>is + это"
          }
        ]
      },

    ]
  },
}

export default GameTestsSeedData

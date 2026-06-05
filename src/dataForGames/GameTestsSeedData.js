
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
            text: "Did you buy ….. good toys?",
            options: {
              A: "some",
              B: "any",
              C: "anything",
              D: "a"
            },
            correctAnswer: "B",
            explanation: "в вопросе и отрицании с неисчисляемыми/множественными используем any (some — в утверждении)"
          },
          {
            text: "She …….. talks to anyone.",
            options: {
              A: "never",
              B: "doesn’t",
              C: "will",
              D: "has"
            },
            correctAnswer: "A",
            explanation: "never (никогда) — отрицательное наречие, не требует вспомогательного глагола doesn't"
          },
          {
            text: "We have …….love in this world.",
            options: {
              A: "few",
              B: "little",
              C: "any",
              D: "many"
            },
            correctAnswer: "B",
            explanation: "love (любовь) — неисчисляемое, little = мало (few — для исчисляемых)"
          },
          {
            text: "I promise I……… read it.",
            options: {
              A: "will",
              B: "am going to",
              C: "have to",
              D: "am to"
            },
            correctAnswer: "A",
            explanation: "обещание → Future Simple: will read (will + глагол)"
          },
          {
            text: "Time……..so quickly!",
            options: {
              A: "go",
              B: "goes",
              C: "has"
            },
            correctAnswer: "B",
            explanation: "time (время) — 3 лицо единственное число → goes (Present Simple)"
          },
          {
            text: "I’ve …….. eaten",
            options: {
              A: "yet",
              B: "still",
              C: "already"
            },
            correctAnswer: "C",
            explanation: "already — уже (в утверждении), yet — в вопросах/отрицаниях, still — всё ещё"
          },
          {
            text: "She ……. help me with anything.",
            options: {
              A: "can’t",
              B: "can’t to",
              C: "doesn’t can to"
            },
            correctAnswer: "A",
            explanation: "отрицание can: can't + глагол без to (никаких doesn't)"
          },
          {
            text: "I ……. a dog.",
            options: {
              A: "haven’t",
              B: "don’t has",
              C: "don’t have"
            },
            correctAnswer: "C",
            explanation: "I don't have — правильное отрицание для have (значения 'иметь')"
          },
          {
            text: "It ……. rains in London.",
            options: {
              A: "will",
              B: "often",
              C: "was"
            },
            correctAnswer: "B",
            explanation: "often (часто) — наречие частотности, ставится перед смысловым глаголом"
          },
          {
            text: "If you come I………there",
            options: {
              A: "will",
              B: "am",
              C: "will be"
            },
            correctAnswer: "C",
            explanation: "первый тип условия: if + Present Simple (come), главная часть will be"
          },
          {
            text: "I………always my keys!",
            options: {
              A: "lose",
              B: "lost",
              C: "am losing",
              D: "have lost"
            },
            correctAnswer: "A",
            explanation: "always с Present Simple выражает регулярное действие (вечно теряю)"
          },
          {
            text: "I like…………late",
            options: {
              A: "to",
              B: "being"
            },
            correctAnswer: "B",
            explanation: "like + ing (нравится делать что-то) → being late"
          },
          {
            text: "News…….good today!",
            options: {
              A: "are",
              B: "is",
              C: "-"
            },
            correctAnswer: "B",
            explanation: "news (новости) — в английском единственное число → is"
          },
          {
            text: "I ……my leg. I can’t go now.",
            options: {
              A: "have hurt",
              B: "hurt",
              C: "hurted"
            },
            correctAnswer: "A",
            explanation: "результат в настоящем (не могу идти) → Present Perfect. hurt-hurt-hurt"
          },
          {
            text: "She didn’t drink …….coffee.",
            options: {
              A: "few",
              B: "a few",
              C: "much",
              D: "many"
            },
            correctAnswer: "C",
            explanation: "coffee (неисчисляемое) → much. many — для исчисляемых"
          },
          {
            text: "Those people ……. organized a band.",
            options: {
              A: "has",
              B: "have",
              C: "did",
              D: "were"
            },
            correctAnswer: "B",
            explanation: "people (люди) — мн. число → have (Present Perfect: have organized)"
          },
          {
            text: "I haven’t come……..",
            options: {
              A: "yet",
              B: "still",
              C: "already",
              D: "just"
            },
            correctAnswer: "A",
            explanation: "yet — в отрицаниях и вопросах (ещё не). already/just — в утверждениях"
          },
          {
            text: "I want to ………..some gardening",
            options: {
              A: "make",
              B: "have",
              C: "do"
            },
            correctAnswer: "C",
            explanation: "устойчивое выражение: do gardening (заниматься садоводством)"
          },
          {
            text: "I……..it 2 years ago.",
            options: {
              A: "did",
              B: "have done",
              C: "am doing"
            },
            correctAnswer: "A",
            explanation: "2 years ago — законченное время в прошлом → Past Simple: did"
          },
          {
            text: "I’m sorry. I …….. yet",
            options: {
              A: "haven’t finished",
              B: "didn’t finish",
              C: "don’t finish"
            },
            correctAnswer: "A",
            explanation: "yet — сигнал Present Perfect: haven't finished yet"
          },
          {
            text: "I want to give up………",
            options: {
              A: "to drink",
              B: "drink",
              C: "drinking"
            },
            correctAnswer: "C",
            explanation: "give up + ing (бросить делать что-то) → give up drinking"
          },
          {
            text: "She has stopped the train, ……..?",
            options: {
              A: "doesn’t she",
              B: "has she",
              C: "hasn’t she",
              D: "did she"
            },
            correctAnswer: "C",
            explanation: "разделительный вопрос: has → hasn't she"
          },
          {
            text: "There …… a door and 2 windows there.",
            options: {
              A: "are",
              B: "is",
              C: "some"
            },
            correctAnswer: "B",
            explanation: "конструкция there is + первое существительное в единственном числе (a door)"
          },
          {
            text: "It’s not warm, ……?",
            options: {
              A: "is it",
              B: "isn’t it?",
              C: "does it"
            },
            correctAnswer: "A",
            explanation: "разделительный вопрос: отрицание в первой части → is it?"
          },
          {
            text: "Are you going there? – Yes, I…….",
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
            text: "There’s …….. paper on the table.",
            options: {
              A: "a",
              B: "some",
              C: "any"
            },
            correctAnswer: "B",
            explanation: "paper (бумага) — неисчисляемое → some в утверждении"
          },
          {
            text: "How many brothers and sisters……..?",
            options: {
              A: "are you having",
              B: "you have",
              C: "have you",
              D: "do you have"
            },
            correctAnswer: "D",
            explanation: "вопрос с how many → do you have (Present Simple)"
          },
          {
            text: "We met when we…….in France",
            options: {
              A: "are",
              B: "was",
              C: "were",
              D: "study"
            },
            correctAnswer: "C",
            explanation: "we → were (Past Continuous: were living / находились во Франции)"
          },
          {
            text: "I don’t want …… to leave me.",
            options: {
              A: "she",
              B: "her",
              C: "that she"
            },
            correctAnswer: "B",
            explanation: "после want + объект (her) + to leave (конструкция want somebody to do)"
          },
          {
            text: "………… in London.",
            options: {
              A: "Snow goes",
              B: "It snows",
              C: "It snowing"
            },
            correctAnswer: "B",
            explanation: "говорим о погоде: it snows (Present Simple — обычно идёт снег)"
          },
          {
            text: "How………sugar do you eat a day?",
            options: {
              A: "many",
              B: "much",
              C: "is"
            },
            correctAnswer: "B",
            explanation: "sugar (сахар) — неисчисляемое → how much"
          },
          {
            text: "There ……… some grapes there the day before yesterday.",
            options: {
              A: "was",
              B: "were",
              C: "are",
              D: "is"
            },
            correctAnswer: "B",
            explanation: "grapes (виноград) — мн. число, the day before yesterday → Past: were"
          },
          {
            text: "Will you do it? – No, I…….",
            options: {
              A: "won’t",
              B: "wouldn’t",
              C: "will"
            },
            correctAnswer: "A",
            explanation: "краткий отрицательный ответ на will → No, I won't"
          },
          {
            text: "Who are …….people?",
            options: {
              A: "this",
              B: "those",
              C: "that"
            },
            correctAnswer: "B",
            explanation: "people (мн. число) → those (те). this/that — для ед. числа"
          },
          {
            text: "It’s ………..weather!",
            options: {
              A: "a terrible",
              B: "terrible",
              C: "the terrible"
            },
            correctAnswer: "B",
            explanation: "weather — неисчисляемое, артикль a не нужен → terrible weather"
          },
          {
            text: "As soon as she……., I’ll do it.",
            options: {
              A: "come",
              B: "will come",
              C: "comes"
            },
            correctAnswer: "C",
            explanation: "as soon as + Present Simple (comes) — будущее время не используется"
          },
          {
            text: "His eyes ……. blue",
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
            text: "…… children are too noisy",
            options: {
              A: "they",
              B: "them",
              C: "their"
            },
            correctAnswer: "C",
            explanation: "притяжательное местоимение перед существительным → their children"
          },
          {
            text: "Now she…….. him.",
            options: {
              A: "is hating",
              B: "hated",
              C: "hates",
              D: "hate"
            },
            correctAnswer: "C",
            explanation: "hate (ненавидеть) — глагол состояния, не используется в Continuous → hates"
          },
          {
            text: "I’m going …….home with you.",
            options: {
              A: "at",
              B: "to",
              C: "–",
              D: "in"
            },
            correctAnswer: "C",
            explanation: "go home — предлог НЕ нужен (home — наречие)"
          },
          {
            text: "She ………soon.",
            options: {
              A: "leaves",
              B: "will leaves",
              C: "is leaving",
              D: "leave"
            },
            correctAnswer: "C",
            explanation: "запланированное действие в ближайшем будущем → is leaving"
          },
          {
            text: "What time ………. today?",
            options: {
              A: "has she come",
              B: "she has come",
              C: "did she come"
            },
            correctAnswer: "C",
            explanation: "today (уже закончившийся день/прошлое) → Past Simple: did she come"
          },
          {
            text: "I …….. silly",
            options: {
              A: "amn’t",
              B: "am not",
              C: "isn’t"
            },
            correctAnswer: "B",
            explanation: "отрицание I am → I am not (amn't не используется)"
          },
          {
            text: "Who ………a shower with you?",
            options: {
              A: "have",
              B: "has",
              C: "do have"
            },
            correctAnswer: "B",
            explanation: "вопрос к подлежащему (who = 3 лицо ед. число) → has"
          },
          {
            text: "What …….?",
            options: {
              A: "she wants",
              B: "does she want",
              C: "does she wants"
            },
            correctAnswer: "B",
            explanation: "вопрос в Present Simple: does she want (без S на want)"
          },
          {
            text: "She’s gonna…… leave",
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
            text: "If he… .kisses me tomorrow, I’ll kiss him",
            options: {
              A: "–",
              B: "will",
              C: "are",
              D: "is"
            },
            correctAnswer: "A",
            explanation: "первый тип условия: if + Present Simple (kisses) — will не нужен"
          },
          {
            text: "They will arrive …. Sunday",
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
            text: "….. help me?",
            options: {
              A: "can you to",
              B: "do you can",
              C: "can you"
            },
            correctAnswer: "C",
            explanation: "вопрос с can: Can you help me? (без to и do)"
          },
          {
            text: "I…..agree",
            options: {
              A: "am",
              B: "–"
            },
            correctAnswer: "B",
            explanation: "agree — глагол, не требует am. I agree — я согласен"
          }
        ]
      },
    ],
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

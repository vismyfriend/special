
const TestsAndExamsData = {

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
              D: "b y",
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
            text: "And this is your ____.",
            options: {
              A: "desk",
              B: "desks",
              C: "a desk",
              D: "an desk"
            },
            correctAnswer: "A",
            explanation: "The singular form 'desk' is correct."
          },
          {
            text: "____ to the cinema.",
            options: {
              A: "We not often go",
              B: "We don't go often",
              C: "We don't often go",
              D: "Often we don't go"
            },
            correctAnswer: "C",
            explanation: "The correct adverb placement is 'don't often go'."
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
            explanation: "The future form 'are you going to' is correct."
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
            explanation: "The preposition 'on' indicates location."
          },
          {
            text: "I'm Jeff Caine. Nice to ____ you, Mr Caine.",
            options: {
              A: "speak",
              B: "talk",
              C: "meet",
              D: "watch"
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



}

export default TestsAndExamsData

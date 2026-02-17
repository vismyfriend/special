
const gameTestsNoSeedNoShuffleData = {

  checkMyLevel001: {
    mainDescription: "Совет : читайте всё вслух",
    tasks: [
      {
        taskDescription: "спэшл таскс фор спэшл эйджэнтс",
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/thinkAboutItTPNG.jpg", import.meta.url).href,
        questions: [
          {
            text: "Как переводится слово > special ?",
            options: {
              A: "я не знаю как",
              B: "особенный",
              C: "специальный",
              D: "специи",
              E: "я даже прочитать не знаю как",
              F: "скидка",
            },
            correctAnswer: ["B","C"],
            explanation: "Если чего-то не знаете - пробуйте догадаться. Ошибаться можно! Методом проб и ошибок на практике всё узнаете и запомните."
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
            correctAnswer: ["A","D","E"],
            explanation: "Если не нравится, значит вы ещё с Винсентом не занимались, у него дар влюблять в иностранные языки, я серьезно! \n \n утверждение: I like \n отрицание : I don't like."

          },
        ]
      },
      {
        taskDescription: "Внимательность и произношение :",
        taskID: "multiple_choice",
        questions: [
          {
            text: "Как произносится -> special ?",
            options: {
              A: "СПЕЦИАЛ",
              B: "СПЕСИАЛ",
              C: "СПЕКАЛ",
              D: "ШПЕЦЫЛ",
              E: "СПЭШЛ",
              F: "я не знаю как",
            },
            correctAnswer: ["E",],
            explanation: "/ спЭшл / и никак иначе"

          },
          {
            text: "Как произносится -> agent ?",
            options: {
              A: "агент",
              B: "эгент",
              C: "эйгент",
              D: "эйджэнт",
              E: "меня поймут при любом произношении",
            },
            correctAnswer: ["D",],
            explanation: "ударенией на первый слог / ЭЙджэнт / \n\n все остальные варианты - это максимально плохой и непонятный уровень английского"

          },
        ]
      },
      {
        taskDescription: "Выбери правильный ответ",
        audio: null,
        taskID: "drop_down_text",
        textScript: 'Ну а какие подсказки в этом задании вы хотите? Тут только ответы могу показать сразу, готовы к спойлерам? \n\n Всё же вроде очевидно: \n\nlater - позже \nlate - поздно \n\neasy - легко \nsimple - просто',
        questions: [
          {
            text: "Сейчас поздно (now late, now later, я Х3 вообще, не знаю, it's later now, it's late now*)",
          },
          {
            text: "Это просто (в душе не знаю, not hard, it is ease, it is easy, it is simple*)",
          },


        ]
      },
      {
        taskDescription: "Включить аудио и вписать что услышали:",
        taskID: "student_input",
        audio: new URL('../assets/audio/songs/hello_how_are_you.mp3', import.meta.url).href,
        textScript: 'Ответы в самом низу, а это подзказка : \n\n Слушайте несколько раз, слушайте пока не услышите, тренируйтесь, практикуйтесь, вы справитесь! You are special. Yes yes yes.\n' +
          '\n' +
          'Ошибки в написании слов - не страшно, если вы правильно произносите слова вслух. Никто же не видит как вы пишите слова ;-) \n\n Мой личный опыт: многими лингвистами и полиглотами доказано, что изучение правописания поднимает эффективность запоминания слов и фраз. \n\n Поэтому рекомендую сразу учиться правильно пЕсАтть слава лангискйие ;-) и завести себе блокнотик или записки в телефоне\n' +
          '\nhow are you - как дела?\ngood - хорошо\ngreat - великолепно\nI am wonderful - я замечательно\ntired - устал\nhungry - голодный\nnot so good - не так уж хорошо',
        questions: [
          {
            text: "Hello, hello, hello ___ ?",
            correctAnswer: "how are you",
          },{
            text: "I am  __ ?",
            correctAnswer: "good",
          },{
            text: "I am __ ?",
            correctAnswer: "great",
          },{
            text: "__ wonderful",
            correctAnswer: "I am",
          },{
            text: "I'm ___",
            correctAnswer: "tired",
          },{
            text: "I'm ___",
            correctAnswer: "hungry",
          },{
            text: "I'm ___ good",
            correctAnswer: "not so",
          },


        ]
      },
      {
        taskDescription: "Write in English",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "Напиши по-английски"],
          rows: [
            { cells: ["У меня есть телефон", ""],
              editable: [ false, true ],
              correctAnswers: {
                cells: [null, "I have a phone"],
                almostCorrect: {
                  1: ["I have phone"], // Индекс поля (начиная с 0)
                }
              }
            },
            { cells: ["У меня нет бургера", ""], editable: [ false, true],
              correctAnswers: {
                cells: [null, "I don't have a burger"],
                almostCorrect: {
                  1: ["I don't have burger"], // Индекс поля (начиная с 0)
                }
              }},
            { cells: ["Я устал(а)", ""], editable: [ false, true],
              correctAnswers: {
                cells: [null, "I am tired"],
              }
            },
            { cells: ["Она голодная", ""], editable: [ false, true],
              correctAnswers: {
                cells: [null, "She is hungry"],
              }},
            { cells: ["слова УСТАЛ и ГОЛОДЕН", " <- были в прошлом задании ;)"], editable: [ false, false],

            },
            { cells: ["Мы - особые агенты", ""], editable: [ false, true],
              correctAnswers: {
                cells: [null, "We are special agents"],
                almostCorrect: {
                  1: ["I don't have burger"], // Индекс поля (начиная с 0)
                }
              }},
          ],
        }
      },
      {
        taskDescription: "",
        taskID: "true_false",
        taskPicture: new URL("../assets/images/listeningPicture1.jpg", import.meta.url).href,
        textScript: 'У вас всё получится, записывайтесь на занятие и составим индивидуальный курс и план действий по достижению желаемого уровня английского\n\nНапишите мне в телеграм: \n"Хочу на урок" \nи я вам отвечу. Не БОТ, а лично я:\nживой, неповторимый, скромный Винсент \n\n@vismyfriend\n#vismyfriend',
        questions: [
          {
            text: "Этот тест для совсем новичков",
            correctAnswer: "true"
          },
          {
            text: "Я готов(а) улучшать свои результаты",
            correctAnswer: "true"
          },
          {
            text: "Я - ленивая за#ница! Признаюсь!",
            correctAnswer: "false"
          },
          {
            text: "Хочу на бесплатное занятие с Винсентом, живьём пообщаться",
            correctAnswer: "true"
          },
          {
            text: "У меня мечта, необходимость и цель: разговаривать на Инглише. Я хочу!",
            correctAnswer: "true"
          },

        ]
      },
      {
        taskDescription: "Что делать дальше?",
        taskID: "discussion_task",
        usefulWords: null,
        audio: null,
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        textScript: null,
        questions: [
          {
            text: "Choose missions, join classes",
            translation: "Выбирай миссии, записывайся на занятия",
          },
          {
            text: "Practice English several times a week",
            translation: "Практикуй английский несколько раз в неделю",
          },
          {
            text: "Send a message to Vincent's telegram: \n @vismyfriend `Hi, I want a lesson`",
            translation: "Отправь сообщение Винсенту в телеграм: @vismyfriend \n `Привет, хочу на урок`",
          },
          {
            text: "Если вы сделали все задания этого теста без ошибок - ваш уровень выше\n ( A1 ) Более подробные и серьезные тесты в разделе: \n Миссии -> Big Tests",
            translation: "(A0 - никогда не учили английский)\n(A1 - когда-то учили Инглиш)\n(B1 - понимаю, путаю времена)\n(B2 - нужна практика разговорная)\n(C1 - говорю как носитель)\n(С2 - вы училка и божество)\n",
          },

        ]
      },


    ],

  },
  smallTalk001: {
    mainDescription: "",
    tasks: [
      {
        taskDescription: "Вопросы могут повторятся, отвечай и задавай несколько раз 👇 Задай вопрос и отметь его",
        taskID: "discussion_task",
          questions: [
            {
              text: "What city are you from?",
              translation: "Из какого вы города? \n (I am from New-York)",
            },
            {
              text: "What is your father's name?",
              translation: "Как зовут вашего отца? \n (His name is Andrew)",
            },
            {
              text: "What is your mother's name?",
              translation: "Как зовут вашу маму? \n (Her name is Audrey)",
            },
            {
              text: "What is your favorite color?",
              translation: "Какой твой любимый цвет? \n (My favorite color is blue)",
            },
            {
              text: "How old are you?",
              translation: "Сколько тебе лет? \n (I am 18 / I am 25)",
            },
                        {
              text: "What is your job?",
              translation: "Какая твоя работа? \n (I am a student / I am a teacher / I work in the office",
            },
            {
              text: "What is your favorite day?",
              translation: "Какой твой любимый день? \n (I like all days / Friday is my favorite / My favorite day is Friday)",
            },
            {
              text: "What are your favorite drinks?",
              translation: "Какой твой любимый напиток? \n (I like water / Fanta is my favorite / My favorite drink is orange juice)",
            },
            {
              text: "What time is it on your clock now?",
              translation: "Сколько сейчас времени у тебя на часах? \n (It is 3 PM = It's 3 o'clock = It's 15 )",
            },
            {
              text: "How is the weather today?",
              translation: "Какая сегодня погода? \n (It is sunny / Weather is good / It is not cold / rainy / snowy / windy / Temperature is about 20 degrees)",
            },
            {
              text: "What are your 3 favorite films?",
              translation: "Какие твои 3 любимых фильма? \n (Shrek / Изгой / Terminator)",
            },
            {
              text: "Can you tell your phone in English?",
              translation: "Сможешь на английском свой номер телефона продиктовать? \n(I cannot / I can 89041113793)",
            },



        ]
      },


    ],

  },
  smallTalkTaxi1: {
    mainDescription: "Cars, Taxi, Driving",
    tasks: [
      {
        taskDescription: "Вопросы могут повторятся, отвечай и задавай несколько раз 👇 Задай вопрос и отметь его",
        taskID: "discussion_task",
        questions: [
          {
            text: "Are you a driver? Do you drive safely?",
            translation: "Ты водишь машину? Ты водишь аккуратно? \n (Yes, I drive / No, I don't have a car / I try to drive safely)",
          },
          {
            text: "Some people say that men drive better and more safely than women. What do you think about it? Who is a safer driver: a man or a woman?",
            translation: "Кто безопаснее за рулём: мужчина или женщина? \n (I think women drive safer / Men are more confident / It depends on the person)",
          },
          {
            text: "Do you prefer driving in silence or with music?",
            translation: "Ты предпочитаешь ездить в тишине или с музыкой? \n (I prefer music / I like silence / It depends on my mood)",
          },
          {
            text: "How often do you order a taxi?",
            translation: "Как часто ты заказываешь такси? \n (Every day / Once a week / Rarely / Only when I'm late)",
          },
          {
            text: "What app do you use to order a taxi?",
            translation: "Каким приложением ты пользуешься? \n (I use Uber / Yandex Taxi / Bolt / Local app)",
          },
          {
            text: "How much does a taxi from your home to downtown cost?",
            translation: "Сколько стоит такси от дома до центра? \n (it costs about $20 / It's cheap )",
          },
          {
            text: "Do you start a small talk with the driver? Or does the driver starts it usually?",
            translation: "Ты иногда болтаешь с водителем? \n (Yes, if the driver is friendly / No, I prefer silence / Sometimes)",
          },
          {
            text: "Do you give star ratings in taxi apps?",
            translation: "Ты ставишь оценки в приложении такси? \n (Always / Only if the ride was bad / Only if it was perfect)",
          },
          {
            text: "Describe a 5-star taxi ride for you.",
            translation: "Опиши идеальную поездку на 5 звёзд. \n (Clean car, nice driver, good music, arrives on time)",
          },
          {
            text: "What makes a good driver? What makes a bad driver?",
            translation: "Что делает водителя хорошим? А плохим? \n (Good driver is calm and careful / Bad driver is aggressive and distracted)",
          },
          {
            text: "What was your longest ride in a taxi?",
            translation: "Самая долгая поездка на такси? \n (About 2 hours / From the airport to home / Across the city)",
          },

        ]
      }
    ]
  },
  smallTalkTaxi2: {
    mainDescription: "Cars, Taxi, Driving",
    tasks: [
      {
        taskDescription: "Вопросы могут повторятся, отвечай и задавай несколько раз 👇 Задай вопрос и отметь его",
        taskID: "discussion_task",
        questions: [
          {
            text: "Have you ever had a funny, stupid or maybe emotional situation in a taxi?",
            translation: "Была смешная, нелепая или эмоциональная ситуация в такси? \n (Yes, the driver told jokes / No, nothing funny / My first kiss was in a taxi)",
          },
          {
            text: "Have you ever had a scary situation in a taxi?",
            translation: "А страшная ситуация была? \n (The driver was too fast / Almost had an accident / No, never)",
          },
          {
            text: "What would you do if you didn't like the driver's music?",
            translation: "Что сделаешь, если не нравится музыка водителя? \n (Say nothing / Politely ask to change / Use my headphones)",
          },
          {
            text: "Would you try a self-driving taxi car?",
            translation: "Хочешь попробовать такси без водителя? \n (Yes, it sounds exciting / No, I'm scared / Maybe)",
          },
          {
            text: "If you were an animal in a cartoon, and all animals could drive cars, what animal would you be?",
            translation: "Если бы вы были в мултике животным за рулем, то каким? \n (A cool cat / A slow turtle / A fast rabbit)",
          },
          {
            text: "Do you know some important unwritten rule of driving in your city/country that visitors might not know? (For example: speed limit +20 km/h is okay, or other local habits)",
            translation: "Знаешь неписаные правила вождения? \n (You can speed a little / Always let buses go first / Honking is rude)",
          },
          {
            text: "Do you prefer automatic transmission or manual transmission in a car? (Answer even if you don’t have a car)",
            translation: "Автомат или механика? \n (Automatic is easier / Manual gives more control / I can drive both)",
          },
          {
            text: "When did you see a car accident last time?",
            translation: "Когда последний раз видели аварию? \n (Yesterday / A week ago / Never)",
          },
          {
            text: "Have you ever been in a car accident? Has anyone of your friends been in a car accident?",
            translation: "Ты или друзья попадали в аварию? \n (Yes, a small one / No, thank God / My friend had an accident)",
          }

        ]
      }
    ]
  },


  debug: {
    mainDescription: "mainDescription",
    tasks: [
      {
        taskDescription: "taskDescription",
        taskID: "grid_table",
        tableData: {
          headers: ["Name","Present Simple"],
          rows: [
            {
              cells: ["do", "did", "done","делать", "I did it"],
              editable: [false, false, false, false, false,]
            },
            {
              cells: ["eat","","eaten","","",],
              editable: [false, true, false, true, true,],
              correctAnswers: {
                cells: [null, "ate",null,"есть","anyIsOk" ],
                almostCorrect: {
                  1: ["two","2"], // Индекс поля (начиная с 0)
                  3: ["поесть","кушать","жрать","скушать","покушать",],
                }
              }
            },
          ]
        }
      },
    ],
  },
  pattern: {
    mainDescription: "V-IS-MY-DEBUGGER",
    tasks: [
      {
        taskDescription: "Grid - fill in",
        taskID: "grid_table",
        tableData: {
          headers: ["v1","v2","v3","перевод","пример",],
          rows: [
            {
              cells: ["do", "did", "done","делать", "I did it"],
              editable: [false, false, false, false, false,]
            },
            {
              cells: ["eat","","eaten","","",],
              editable: [false, true, false, true, true,],
              correctAnswers: {
                cells: [null, "ate",null,"есть","anyIsOk" ],
                almostCorrect: {
                  1: ["two","2"], // Индекс поля (начиная с 0)
                  3: ["поесть","кушать","жрать","скушать","покушать",],
                }
              }
            },
          ]
        }
      },
      {
        taskDescription: "GRID - Irregular Verbs:",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["V1", "V2", "V3", "перевод"],
          rows: [
            { cells: ["break", "broke", "broken", "ломать"], editable: [false, false, false, false] },
            { cells: ["beat", "beat", "beaten", "побить"], editable: [false, false, false, false] },
            { cells: ["become", "became", "become", "становиться"], editable: [false, false, false, false] },
            { cells: ["begin", "began", "begun", "начинать"], editable: [false, false, false, false] },
            { cells: ["blow", "blew", "blown", "дуть"], editable: [false, false, false, false] },
            { cells: ["borrow", "borrowed", "borrowed", "брать в долг"], editable: [false, false, false, false] },
            { cells: ["build", "built", "built", "строить"], editable: [false, false, false, false] },
            { cells: ["burn", "burnt", "burnt", "сжигать, гореть"], editable: [false, false, false, false] },
            { cells: ["buy", "bought", "bought", "покупать"], editable: [false, false, false, false] },
            { cells: ["bring", "brought", "brought", "приносить"], editable: [false, false, false, false] },
            { cells: ["be", "was/were", "been", "быть"], editable: [false, false, false, false] },
            { cells: ["bite", "bit", "bitten", "кусать"], editable: [false, false, false, false] },
            { cells: ["come", "came", "come", "приходить"], editable: [false, false, false, false] },
            { cells: ["choose", "chose", "chosen", "выбирать"], editable: [false, false, false, false] },
            { cells: ["catch", "caught", "caught", "ловить"], editable: [false, false, false, false] },
            { cells: ["creep", "crept", "crept", "ползать"], editable: [false, false, false, false] },
            { cells: ["cost", "cost", "cost", "стоить"], editable: [false, false, false, false] },
            { cells: ["cut", "cut", "cut", "резать"], editable: [false, false, false, false] },
            { cells: ["deal", "dealt", "dealt", "иметь дела"], editable: [false, false, false, false] },
            { cells: ["dig", "dug", "dug", "копать"], editable: [false, false, false, false] },
            { cells: ["do", "did", "done", "делать"], editable: [false, false, false, false] },
            { cells: ["drive", "drove", "driven", "водить"], editable: [false, false, false, false] },
            { cells: ["draw", "drew", "drawn", "рисовать"], editable: [false, false, false, false] },
            { cells: ["drink", "drank", "drunk", "пить"], editable: [false, false, false, false] },
            { cells: ["eat", "ate", "eaten", "кушать"], editable: [false, false, false, false] },
            { cells: ["fall", "fell", "fallen", "падать"], editable: [false, false, false, false] },
            { cells: ["feed", "fed", "fed", "кормить"], editable: [false, false, false, false] },
            { cells: ["feel", "felt", "felt", "чувствовать"], editable: [false, false, false, false] },
            { cells: ["fight", "fought", "fought", "сражаться"], editable: [false, false, false, false] },
            { cells: ["find", "found", "found", "находить"], editable: [false, false, false, false] },
            { cells: ["fly", "flew", "flown", "летать"], editable: [false, false, false, false] },
            { cells: ["forbid", "forbade", "forbidden", "запрещать"], editable: [false, false, false, false] },
            { cells: ["forget", "forgot", "forgotten", "забывать"], editable: [false, false, false, false] },
            { cells: ["forgive", "forgave", "forgiven", "прощать"], editable: [false, false, false, false] },
            { cells: ["freeze", "froze", "frozen", "замерзать"], editable: [false, false, false, false] },
            { cells: ["grow", "grew", "grown", "расти"], editable: [false, false, false, false] },
            { cells: ["get", "got", "got", "получать"], editable: [false, false, false, false] },
            { cells: ["give", "gave", "given", "давать"], editable: [false, false, false, false] },
            { cells: ["go", "went", "gone", "ходить"], editable: [false, false, false, false] },
            { cells: ["have", "had", "had", "иметь"], editable: [false, false, false, false] },
            { cells: ["hear", "heard", "heard", "слышать"], editable: [false, false, false, false] },
            { cells: ["hide", "hid", "hidden", "прятать"], editable: [false, false, false, false] },
            { cells: ["hit", "hit", "hit", "ударять"], editable: [false, false, false, false] },
            { cells: ["hurt", "hurt", "hurt", "причинять боль"], editable: [false, false, false, false] },
            { cells: ["hold", "held", "held", "держать"], editable: [false, false, false, false] },
            { cells: ["keep", "kept", "kept", "хранить"], editable: [false, false, false, false] },
            { cells: ["know", "knew", "known", "знать"], editable: [false, false, false, false] },
            { cells: ["lead", "led", "led", "вести, приводить"], editable: [false, false, false, false] },
            { cells: ["learn", "learnt", "learnt", "изучать"], editable: [false, false, false, false] },
            { cells: ["leave", "left", "left", "покидать"], editable: [false, false, false, false] },
            { cells: ["lend", "lent", "lent", "давать в долг"], editable: [false, false, false, false] },
            { cells: ["let", "let", "let", "позволять"], editable: [false, false, false, false] },
            { cells: ["lose", "lost", "lost", "терять"], editable: [false, false, false, false] },
            { cells: ["tell a lie", "told a lie", "told a lie", "говорить ложь"], editable: [false, false, false, false] },
            { cells: ["lie", "lay", "lain", "лежать"], editable: [false, false, false, false] },
            { cells: ["make", "made", "made", "создавать"], editable: [false, false, false, false] },
            { cells: ["mean", "meant", "meant", "иметь ввиду"], editable: [false, false, false, false] },
            { cells: ["meet", "met", "met", "встречать(ся)"], editable: [false, false, false, false] },
            { cells: ["pay", "paid", "paid", "платить"], editable: [false, false, false, false] },
            { cells: ["put", "put", "put", "класть"], editable: [false, false, false, false] },
            { cells: ["read", "read", "read", "читать"], editable: [false, false, false, false] },
            { cells: ["ride", "rode", "ridden", "ездить верхом"], editable: [false, false, false, false] },
            { cells: ["ring", "rang", "rung", "звенеть, звонить"], editable: [false, false, false, false] },
            { cells: ["run", "ran", "run", "бегать"], editable: [false, false, false, false] },
            { cells: ["rise", "rose", "risen", "подниматься"], editable: [false, false, false, false] },
            { cells: ["say", "said", "said", "сказать, произнести"], editable: [false, false, false, false] },
            { cells: ["see", "saw", "seen", "увидеть"], editable: [false, false, false, false] },
            { cells: ["sell", "sold", "sold", "продавать"], editable: [false, false, false, false] },
            { cells: ["send", "sent", "sent", "отправлять"], editable: [false, false, false, false] },
            { cells: ["shake", "shook", "shaken", "трясти"], editable: [false, false, false, false] },
            { cells: ["shoot", "shot", "shot", "стрелять"], editable: [false, false, false, false] },
            { cells: ["shut", "shut", "shut", "захлопнуть"], editable: [false, false, false, false] },
            { cells: ["sing", "sang", "sung", "петь"], editable: [false, false, false, false] },
            { cells: ["sink", "sank", "sunk", "затонуть"], editable: [false, false, false, false] },
            { cells: ["sit", "sat", "sat", "сидеть"], editable: [false, false, false, false] },
            { cells: ["sleep", "slept", "slept", "спать"], editable: [false, false, false, false] },
            { cells: ["slide", "slid", "slid", "скользить"], editable: [false, false, false, false] },
            { cells: ["speak", "spoke", "spoken", "разговаривать"], editable: [false, false, false, false] },
            { cells: ["spend", "spent", "spent", "тратить"], editable: [false, false, false, false] },
            { cells: ["spit", "spat", "spat", "плеваться"], editable: [false, false, false, false] },
            { cells: ["stand", "stood", "stood", "встать, стоять"], editable: [false, false, false, false] },
            { cells: ["steal", "stole", "stolen", "воровать"], editable: [false, false, false, false] },
            { cells: ["stick", "stuck", "stuck", "приклеить, застрять"], editable: [false, false, false, false] },
            { cells: ["stink", "stank", "stunk", "вонять"], editable: [false, false, false, false] },
            { cells: ["strike", "struck", "struck", "ударять"], editable: [false, false, false, false] },
            { cells: ["swear", "swore", "sworn", "клясться, материться"], editable: [false, false, false, false] },
            { cells: ["sweep", "swept", "swept", "подметать"], editable: [false, false, false, false] },
            { cells: ["swim", "swam", "swum", "плавать"], editable: [false, false, false, false] },
            { cells: ["swing", "swung", "swung", "качаться"], editable: [false, false, false, false] },
            { cells: ["take", "took", "taken", "брать"], editable: [false, false, false, false] },
            { cells: ["teach", "taught", "taught", "обучать"], editable: [false, false, false, false] },
            { cells: ["tear", "tore", "torn", "порвать"], editable: [false, false, false, false] },
            { cells: ["tell", "told", "told", "рассказывать"], editable: [false, false, false, false] },
            { cells: ["think", "thought", "thought", "думать"], editable: [false, false, false, false] },
            { cells: ["throw", "threw", "thrown", "бросать"], editable: [false, false, false, false] },
            { cells: ["understand", "understood", "understood", "понимать"], editable: [false, false, false, false] },
            { cells: ["wake up", "woke up", "woken up", "просыпаться"], editable: [false, false, false, false] },
            { cells: ["wear", "wore", "worn", "носить одежду"], editable: [false, false, false, false] },
            { cells: ["write", "wrote", "written", "писать"], editable: [false, false, false, false] },
            { cells: ["weep", "wept", "wept", "хныкать"], editable: [false, false, false, false] },
            { cells: ["win", "won", "won", "выигрывать"], editable: [false, false, false, false] },
            { cells: ["misunderstand", "misunderstood", "misunderstood", "неправильно понять"], editable: [false, false, false, false] },
            { cells: ["misspell", "misspelt", "misspelt", "неправильно написать"], editable: [false, false, false, false] },
            { cells: ["mistake", "mistook", "mistaken", "ошибаться"], editable: [false, false, false, false] },
            { cells: ["mishear", "misheard", "misheard", "неправильно услышать"], editable: [false, false, false, false] },
            { cells: ["oversleep", "overslept", "overslept", "проспать"], editable: [false, false, false, false] },
            { cells: ["overeat", "overate", "overeaten", "переесть"], editable: [false, false, false, false] },
            { cells: ["overpay", "overpaid", "overpaid", "переплатить"], editable: [false, false, false, false] },
            { cells: ["arise", "arose", "arisen", "возникнуть"], editable: [false, false, false, false] },
            { cells: ["awake", "awoke", "awoken", "пробудиться"], editable: [false, false, false, false] },
            { cells: ["abide", "abode", "abode", "соблюдать, пребывать, обитать"], editable: [false, false, false, false] }
          ]
        }
      },
      {
        taskDescription: "Заполни пропуски в таблице:",
        taskID: "grid_table",
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        tableData: {
          headers: ["Russian", "English"],
          rows: [
            {
              cells: ["Марвэл - моя собака", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Marvel is my dog",],
                almostCorrect: {
                  1: ["Marvel's my dog"]
                }
              }
            },
            {
              cells: ["Марвэл любит Сырника!", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Marvel likes Cheesecake.",],
                almostCorrect: {
                  1: ["Marvel loves Cheesecake","Marvel likes Cheesecakes","Marvel loves Cheesecakes"]
                }

              }
            },
            {
              cells: ["", "He doesn't like milk."],
              editable: [true, false],
              correctAnswers: {
                cells: ["Он не любит молоко",null, ],
                almostCorrect: {
                  1: ["Ему не нравится молоко",]
                }

              }
            },
            {
              cells: ["", "He loves to run."],
              editable: [true, false],
              correctAnswers: {
                cells: ["Он любит бегать",null, ],
                almostCorrect: {
                  1: ["Ему нравится бегать",]
                }

              }
            },
            {
              cells: ["Кто любит Марвела?", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Who loves Marvel?",],
                almostCorrect: {
                  1: ["Who likes Marvel?"]
                }

              }
            },
            {
              cells: ["Кого Марвел любит?", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Who does Marvel love?",],
                almostCorrect: {
                  1: ["Who does Marvel like?"]
                }
              }
            },
          ]
        },
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

        ]
      },
      {
        taskDescription: "Drop down",
        taskID: "drop_down_text",
        usefulWords: "let me - позвольте мне, share with you - поделиться с вами, a few words - несколько слов",
        audio: null,
        textScript: 'выбирай правильный ответ',
        questions: [
          {
            text: "Hello friends! Let me share (for, to, with*) you a few words about myself, I (do, does, are, am*, is) a secret agent Antony. I always sit (under, behind, on*, near) my chair and every day I work (in, at*, under, for, between) my computer.\n" +
              '\n' +
              "I (haven't, don't have*, hasn't) a cat. But I (do, have*, has) a fantastic dog! (Her, His*) name is Marvel, not DC. My dog (have, has*, doesn't have*, hasn't, do) problems. I can talk about my dog endlessly, but I (haven't, don't have*, doesn't have) much time, so I am going to finish talking about my dog now. And let me (say, telk, tell*) you about new cool stories bout my baby (Cupcake*, Cheesecake*, Muffin*) ",
          },
        ]
      },
      {
        taskDescription: "Discuss this:",
        taskID: "discussion_task",
        usefulWords: null,
        audio: null,
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        textScript: null,
        questions: [
          {
            text: "What is your favorite animal?",
            translation: "какое твое любимое животное",
          },
          {
            text: "What is your favorite color?",
            translation: "какой твой любимый цвет",
          },
          {
            text: "How old are you?",
            translation: "какой ваш возраст?",
          },
        ]
      },
      {
        taskDescription: "Translate",
        taskID: "student_input",
        usefulWords: null,
        audio: null,
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        textScript: null,
        questions: [
          {
            text: "Позвольте мне ____",
            correctAnswer: "Let me",
          },
          {
            text: "поделиться с вами ____",
            correctAnswer: "share with you",
          },
          {
            text: "несколькими словами про моего сына____",
            correctAnswer: "a few words about my son",
            almostCorrectAnswers: ["a few words about cheesecake","a few words about my cheesecake",]

          },
          {
            text: "Он не любит ТикТок ____",
            correctAnswer: "He doesn't like TikTok",
            almostCorrectAnswers: ["He doesn't love TikTok",]
          },
          {
            text: "Кто любит ТикТок? ____",
            correctAnswer: "Who likes TikTok?",
            almostCorrectAnswers: ["Who loves TikTok?",]
          },
          {
            text: "Кого любит ТикТок? ____",
            correctAnswer: "Who does TikTok like?",
            almostCorrectAnswers: ["Who does TikTok love?",]
          },
          {
            text: "Кого ты любишь? ____",
            correctAnswer: "Who do you like?",
            almostCorrectAnswers: ["Who do you love?",]
          },



        ]
      },
      {
        taskDescription: "Listen & click the correct answer",
        audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/listeningPicture1.jpg", import.meta.url).href,
        textScript: '1)\n' +
          '\n' +
          'A: Are you going to take the bus downtown, or are you going to take your bike?\n' +
          '\n' +
          'B: I think there’s too much traffic on the road today to go by bike. It’s not safe to ride in traffic.\n' +
          '\n' +
          'A: I guess there’s so much traffic because of the big football game. Well, look, I’m driving downtown. Can I give you a ride?\n' +
          '\n' +
          'B: Hey, thanks.\n' +
          '\n' +
          'A: So do you use your bike very often?\n' +
          '\n' +
          'B: Not during the week, but I ride it pretty often on the weekend.\n' +
          '\n' +
          '2)\n' +
          '\n' +
          'A: How are you going to get downtown? Are you going to drive?\n' +
          '\n' +
          'B: I don’t think so. I just heard the traffic report on the radio. It seems there is a traffic jam on the freeway. They said a couple of buses have broken down.\n' +
          '\n' +
          'A: I guess it will be quicker to take the subway.\n' +
          '\n' +
          'B: Absolutely!\n' +
          '\n' +
          '3)\n' +
          '\n' +
          'A: Gosh. I wonder how much longer we’ll have to wait for a bus. We’ve waited half an hour already! Do you think we should go back and get the car?\n' +
          '\n' +
          'B: Oh, no. I hate driving at night.\n' +
          '\n' +
          'A: Let’s take a taxi. I don’t want to be late for the movie.\n' +
          '\n' +
          'B: Good idea. I’ll call for one on cell phone. They usually come pretty quickly.\n' +
          '\n' +
          '4)\n' +
          '\n' +
          'A: How are you going to get home from the restaurant on Sunday, Harry?\n' +
          '\n' +
          'B: Oh, I can just take a bus or a taxi. There are usually plenty of taxis around that area at night.\n' +
          '\n' +
          'A: Yes, but not on a Sunday night. You might wait for a long time. Why don’t you ask Kevin to drive you home? He’s having dinner with us and he lives near you.\n' +
          '\n' +
          'B: That’s right. I’ll ask him.\n' +
          '\n' +
          '5)\n' +
          '\n' +
          'A: What’s the traffic like downtown today?\n' +
          '\n' +
          'B: It’s pretty bad. One of the traffic lights is broken, so all the traffic is backing up.\n' +
          '\n' +
          'A: Oh. How should I get to doctor’s appointment? Drive? Take a taxi?\n' +
          '\n' +
          'B: A taxi won’t be any faster than driving.\n' +
          '\n' +
          'A: Well then, I’ll probably take the subway to the station and then walk from there.\n' +
          '\n' +
          'B: Yeah, today I think that’s the fastest way.\n' +
          '\n' +
          '6)\n' +
          '\n' +
          'A: How do you plan to get to your friend’s house? Do you need a ride?\n' +
          '\n' +
          'B: How’s the weather?\n' +
          '\n' +
          'A: It’s really nice out.\n' +
          '\n' +
          'B: Oh, thanks anyway, but I’ll ride bike. I was going to take the bus, but I need to get some exercise.\n' +
          '\n' +
          'A: All right. But be careful of the traffic.',

        questions: [
          {
            text: "Как Vincent доберется до центра?",
            options: {
              A: "Я вообще ХЗ, он непредсказуем!",
              B: "by car",
              C: "on foot",
              D: "by bicycle",
              E: "by bus"
            },
            correctAnswer: "B"
          },
          {
            text: "Каким способом сегодня быстрее?",
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
      },
    ],
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
        taskDescription: "спэшл таскс фор спэшл эйджэнтс",
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
  pattern_true_false: {
    mainDescription: "V-IS-MY-DEBUGGER",
    tasks: [
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
        ]
      },
    ],
  },
  pattern_multiple_choice: {
    mainDescription: "PatternMC",
    tasks: [
      {
        taskDescription: "Выбери правильный ответ",
        audio: new URL('../assets/audio/WithoutMeNoSpaces.mp3', import.meta.url).href,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: 'текст к этому заданию отсутствует пока что, но Винсент работает над тем, чтобы он появился',
        questions: [
          {
            text: "What is another name for the game Checkers?",
            options: {
              A: "lazy chess",
              B: "wooden circles",
              C: "shashkis",
              D: "draughts",
              E: "corners"
            },
            correctAnswer: "D",
            explanation: "People in England say 'draughts' instead of 'checkers'."
          },

          {
            text: "How many people play checkers together?",
            options: {
              A: "1",
              B: "2",
              C: "4",
              D: "unlimited"
            },
            correctAnswer: "B",
            explanation: "One person uses dark pieces, the other uses light pieces."
          },
        ]
      },
    ]
  },
  pattern_discussion_task: {
    mainDescription: "V-IS-MY-DEBUGGER",
    tasks: [
      {
        taskDescription: "Discuss this:",
        taskID: "discussion_task",
        questions: [
          {
            text: "What is your favorite animal?",
            translation: "какое твое любимое животное",
          },
          {
            text: "What is your favorite color?",
            translation: "какой твой любимый цвет",
          },
          {
            text: "How old are you?",
            translation: "какой ваш возраст?",
          },
        ]
      },
    ],
  },
  pattern_drop_down_text: {
    mainDescription: "V-IS-MY-DEBUGGER",
    tasks: [
      {
        taskDescription: "Drop down",
        taskID: "drop_down_text",
        usefulWords: 'Special - /спэшл/ особенный, Agent - /эйджэнт/ агент',
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        audio: new URL('../assets/audio/WithoutMeNoSpaces.mp3', import.meta.url).href,
        textScript: 'тут подсказки или текст аудио или ответы скоро появятся. ask #vismyfriend',
        questions: [
          {
            text: "Hello friends! Let me share (for, to, with*) you a few words about myself, I (do, does, are, am*, is) a secret agent Antony. I always sit (under, behind, on*, near) my chair and every day I work (in, at*, under, for, between) my computer.\n" +
              '<-->\n' +
              "I (haven't, don't have*, hasn't) a cat. But I (do, have*, has) a fantastic dog! (Her, His*) name is Marvel, not DC. My dog (have, has*, doesn't have*, hasn't, do) problems. I can talk about my dog endlessly, but I (haven't, don't have*, doesn't have) much time, so I am going to finish talking about my dog now. And let me (say, telk, tell*) you about new cool stories bout my baby (Cupcake*, Cheesecake*, Muffin*) ",
          },
        ]
      },
    ],
  },
  pattern_drop_down_short: {
    mainDescription: "IELTS exam listening",
    tasks: [
      {
        taskDescription: "What is the location of ... ?",
        taskID: "drop_down_text",
        usefulWords: 'Summit - /самит/ вершина, Stables - /стЭйблз/ конюшни, Surgery room - /сЁджэри рум/ операционная' ,
        taskPicture: new URL("../assets/images/ielts_listening_7.png", import.meta.url).href,
        audio: new URL('../assets/audio/ielts_listening_7.mp3', import.meta.url).href,
        textScript: 'if you need hints or help - ask #vismyfriend',
        questions: [
          {
            text:
              "Old bakery (A,B,C*,D,E,F,G,H,i)\n" +
              "Doctor's surgery (A,B,C,D,E,F*,G,H,i)\n" +
              "Cooper's cottage (A*,B,C,D,E,F,G,H,i)\n" +
              "Stables (A,B,C,D,E,F,G,H*,i)\n" +
              "Old school (A,B,C,D,E*,F,G,H,i)\n"
          },
        ]
      },
    ],
  },
  pattern_grid_table: {
    mainDescription: "V-IS-MY-DEBUGGER",
    tasks: [
      {
        taskDescription: "Grid - fill in",
        taskID: "grid_table",
        usefulWords: 'Special - /спэшл/ особенный, Agent - /эйджэнт/ агент',
        audio: new URL('../assets/audio/WithoutMeNoSpaces.mp3', import.meta.url).href,
        textScript: 'тут подсказки или текст аудио или ответы скоро появятся. ask #vismyfriend',
        tableData: {
          headers: ["v1","v2","v3","перевод","пример",],
          rows: [
            {
              cells: ["do", "did", "done","делать", "I did it"],
              editable: [false, false, false, false, false,]
            },
            {
              cells: ["eat","","eaten","","",],
              editable: [false, true, false, true, true,],
              correctAnswers: {
                cells: [null, "ate",null,"есть","anyIsOk" ],
                almostCorrect: {
                  1: ["two","2"], // Индекс поля (начиная с 0)
                  3: ["поесть","кушать","жрать","скушать","покушать",],
                }
              }
            },
          ]
        }
      },
      {
        taskDescription: "GRID - Irregular Verbs:",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["V1", "V2", "V3", "перевод"],
          rows: [
            { cells: ["break", "broke", "broken", "ломать"], editable: [false, false, false, false] },
            { cells: ["beat", "beat", "beaten", "побить"], editable: [false, false, false, false] },
            { cells: ["become", "became", "become", "становиться"], editable: [false, false, false, false] },
            { cells: ["begin", "began", "begun", "начинать"], editable: [false, false, false, false] },
            { cells: ["blow", "blew", "blown", "дуть"], editable: [false, false, false, false] },
          ]
        }
      },
      {
        taskDescription: "Заполни пропуски в таблице:",
        taskID: "grid_table",
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        tableData: {
          headers: ["Russian", "English"],
          rows: [
            {
              cells: ["Марвэл - моя собака", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Marvel is my dog",],
                almostCorrect: {
                  1: ["Marvel's my dog"]
                }
              }
            },
            {
              cells: ["Марвэл любит Сырника!", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Marvel likes Cheesecake.",],
                almostCorrect: {
                  1: ["Marvel loves Cheesecake","Marvel likes Cheesecakes","Marvel loves Cheesecakes"]
                }

              }
            },
            {
              cells: ["", "He doesn't like milk."],
              editable: [true, false],
              correctAnswers: {
                cells: ["Он не любит молоко",null, ],
                almostCorrect: {
                  1: ["Ему не нравится молоко",]
                }

              }
            },
            {
              cells: ["", "He loves to run."],
              editable: [true, false],
              correctAnswers: {
                cells: ["Он любит бегать",null, ],
                almostCorrect: {
                  1: ["Ему нравится бегать",]
                }

              }
            },
            {
              cells: ["Кто любит Марвела?", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Who loves Marvel?",],
                almostCorrect: {
                  1: ["Who likes Marvel?"]
                }

              }
            },
            {
              cells: ["Кого Марвел любит?", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Who does Marvel love?",],
                almostCorrect: {
                  1: ["Who does Marvel like?"]
                }
              }
            },
          ]
        },
      },
    ],
  },
  pattern_student_input: {
    mainDescription: "V-IS-MY-DEBUGGER",
    tasks: [
      {
        taskDescription: "Translate",
        taskID: "student_input",
        usefulWords: 'Special - /спэшл/ особенный, Agent - /эйджэнт/ агент',
        audio: new URL('../assets/audio/WithoutMeNoSpaces.mp3', import.meta.url).href,
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        textScript: 'тут подсказки или текст аудио или ответы скоро появятся. ask #vismyfriend',
        questions: [
          {
            text: "Напиши одну букву 'кью' _ ",
            correctAnswer: "q",
          },
          {
            text: "Особенный это - __",
            correctAnswer: "special",
            almostCorrectAnswers: ["special","unique","unusual"]

          },
          {
            text: "Длинный это - ___",
            correctAnswer: "long",
            almostCorrectAnswers: ["not short","tall",]

          },
          {
            text: "Новая строка - ____",
            correctAnswer: "a new line",
            almostCorrectAnswers: ["new line","new string", "a new string"]
          },
        ]
      },
    ],
  },
  listening_introductory2_i5: {
    mainDescription: "Fishing with wife 'i5'",
    tasks: [
      {
        taskID: "multiple_choice",
        audio: new URL('../assets/audio/storiesListening/10 5. A good fishing.mp3', import.meta.url).href,
        taskPicture: new URL("../assets/audio/storiesListening/10 5. A good fishing.jpg", import.meta.url).href,
        usefulWords: 'talk loudly - говорить гормко, neighbour - /нЭйбор/ сосед(ка),',
        textScript:
          'Paul Robinson liked fishing very much.\n' +
          'In the summer he went out fishing every evening. And in the winter he fished on Saturdays and Sundays. ' +
          'His wife Joan did not see him very much.\n ' +
          'Then one day last summer Paul said to her, \'I\'m going to have two weeks holiday this year, and we are going to go to Scotland and fish there.\n' +
          '"And what am I going to do?", said Joan.\n' +
          '"You are going to fish with me", Paul answered.\n' +
          'They went to Scotland and fished there for two weeks. Then they came home, and Joan talked to her neighbour, Mrs. Andrews, about her fishing trip with her husband.\n' +
          '"I did everything wrong on the trip", she said to her.I talked loudly in the boat and the fish were afraid. I put the wrong things on my hook, I pulled my line in very quickly...\n' +
          'and I caught a lot more fish than Paul did.',
        questions: [
          {
            text: "Does Paul like or dislike fishing?",
          },
          {
            text: "Where did he and his wife go last August?",
          },
          {
            text: "What did they do for two weeks?",
          },
          {
            text: "Who did Joan talk to after that?",
          },
          {
            text: "What did Joan do wrong?",
          },
        ]
      },
    ],
  },
  listening_elementary1_e11: {
    mainDescription: "Road accident 'e11'",
    tasks: [
      {
        taskID: "multiple_choice",
        audio: new URL('../assets/audio/storiesListening/(11) Elementary Stories for Reproduction.mp3', import.meta.url).href,
        taskPicture: new URL("../assets/audio/storiesListening/(11) Elementary Stories for Reproduction.jpg", import.meta.url).href,
        textScript:
          'The lights were red, so the old man stopped his car and waited for them to change to green. While he was waiting, a police car came up behind him, hit his car hard in the back and stopped.\n' +
          'There were two policemen in the police car, and they were very surprised and glad when the old man got out of his car and walked towards them without any trouble after such an accident. He was over 70 years old.\n' +
          'The old man came to the door of the police car, smiled kindly, and said: "Tell me, young man, how do you stop this car when the lights are red and I am not here ?"',
        questions: [
          {
            text: "Why did the old man stop his car ?",
          },
          {
            text: "What did he wait for ?",
          },
          {
            text: "What happened while he was waiting ?",
          },
          {
            text: "What people were there in the police car ?",
          },
          {
            text: "What did the old man do ?",
          },
          {
            text: "How did the policemen feel about it ?",
          },
          {
            text: "Why were they surprised ?",
          },
          {
            text: "How old was the man ?",
          },
          {
            text: "What did the old man ask the police officers?",
          },
        ]
      },
    ],
  },
  listening_elementary1_e4: {
    mainDescription: "friends in a bar 'e4'",
    tasks: [
      {
        taskID: "multiple_choice",
        audio: new URL('../assets/audio/storiesListening/Elementary Stories for Reproduction-№ 4.mp3', import.meta.url).href,
        taskPicture: new URL("../assets/audio/storiesListening/Elementary Stories for Reproduction-№ 4.jpg", import.meta.url).href,
        textScript:
          "A man always went to the same bar at the (same) time every day and asked for two glasses of beer. He drank them and then asked for two more.\n" +
          "One day the man behind the bar asked him, 'Why do you always ask for two glasses of beer? Why don't you get one big glass instead /инстЭд/ (вместо) двух маленьких один большой?'\n" +
          "The man answered, 'Because I do not like to drink alone. I drink with my friend.'\n" +
          "But a few days later the man came in and asked only for one beer.\n" +
          "'Oh,' said the barman, 'has your friend died?'\n" +
          "'Oh, no,' said the man. 'He is very well. This beer is for him. But I have stopped drinking beer. My doctor doesn't want me to drink any more because it is dangerous for me.'\n"
          ,
        questions: [
          {
            text: "What did the man from this story do every day?",
          },
          {
            text: "What did he ask for ?",
          },
          {
            text: "What did he do then?",
          },
          {
            text: "What did the man behind the bar ask one day ?\n",
          },
          {
            text: "What did the man answer?",
          },
          {
            text: "What happened a few days later?",
          },
          {
            text: "What did the man ask for this time?",
          },
          {
            text: "What did the barman ask ?",
          },
          {
            text: "What did the man answer ?",
          },
        ]
      },
    ],
  },
  listening_elementary1_e2: {
    mainDescription: "How do you make a B ? 'e2'",
    tasks: [
      {
        taskID: "multiple_choice",
        audio: new URL('../assets/audio/storiesListening/telephone call.mp3', import.meta.url).href,
        taskPicture: new URL("../assets/audio/storiesListening/telephone call.jpg", import.meta.url).href,
        textScript:
          "Mrs Jones was waiting for an important telephone call, but she had no bread in the house, so she left the baby at home and said to his five-year-old brother,'I am going to the shops, Jimmy, and I will be back in a few minutes.'\n" +
          "\n" +
          "While she was out, the telephone rang, and Jimmy answered. 'Hello,' said a man, 'is your mother there?'\n" +
          "'No,' answered Jimmy.\n" +
          "'Well, when she comes back, say to her, \"Mr Baker telephoned\".'\n" +
          "'What?'\n" +
          "'Mr Baker. Write it down. B-A-K-E-R.'\n" +
          "'How do you write a 'B'?'\n" +
          "'How do I write . . . ? Listen, little boy, is there anybody else with you? Any brothers or sisters?'\n" +
          "'My brother Billy is here.'\n" +
          "'Good, I want to talk to him, please.'\n" +
          "'All right.' Jimmy took the telephone to the baby's bed and gave it to Billy. \n" +
          "\n" +
          "When their mother came back, she asked,\n" +
          "'Did anyone telephone?'\n" +
          "'Yes,' said Jimmy, 'a man. But he only wanted to talk to Billy.'\n"
          ,
        questions: [
          {
            text: "What was Mrs Jones waiting for?",
          },
          {
            text: "Why did she go out and what did she do with her babies?",
          },
          {
            text: "What did she say to Jimmy?",
          },
          {
            text: "How old was he?",
          },
          {
            text: "What happened while she was out?",
          },
          {
            text: "What did Jimmy do?",
          },
          {
            text: "What did the man say?",
          },
          {
            text: "What did Jimmy answer?",
          },
          {
            text: "What did the man say then?",
          },
          {
            text: "What did Jimmy say?",
          },
          {
            text: "What was the man's answer?",
          },
          {
            text: "What did Jimmy ask him then?",
          },
          {
            text: "What did the man say then?",
          },
          {
            text: "What did Jimmy answer?",
          },
          {
            text: "What did the man say?",
          },
          {
            text: "What did Jimmy say?",
          },
          {
            text: "What did he do?",
          },
          {
            text: "What did Jimmy's mother do when she came home?",
          },
          {
            text: "What did Jimmy answer?",
          }
        ]
      },
    ],
  },
  listening_intermediate_b7: {
    mainDescription: "Fancy taxi 'b7'",
    tasks: [
      {
        taskID: "multiple_choice",
        audio: new URL('../assets/audio/storiesListening/fancy taxi b7.mp3', import.meta.url).href,
        taskPicture: new URL("../assets/audio/storiesListening/fancy taxi b7.jpg", import.meta.url).href,
        textScript:
          "Two rich ladies were sharing a taxi and talking about the high cost of going anywhere by taxi.\n" +
          "One of the ladies said: 'Taxis are terribly expensive these days. The owners get a lot of money for nothing.'\n" +
          "'Yes,' said the other lady, 'and the drivers get such big tips that they soon become rich. They ought to be ashamed of themselves.'\n" +
          "One of the ladies was smoking a cigarette. After a minute or two she said to the other lady, 'Can you see an ashtray in this taxi? There isn't one on my side.'\n" +
          "'No,' said the other, 'there isn't one on this side either.\n" +
          "Driver! Where is the ashtray in this taxi? Why haven't you got one?'\n" +
          "The driver, who had heard everything the ladies had said, answered, 'Oh, just drop the ashes on the carpet—I have a servant who comes in and cleans, three days in the week!'\n"
          ,
        questions: [
          {
            text: "What were the two rich ladies doing?",
          },
          {
            text: "What were they talking about?",
          },
          {
            text: "What did one of them say?",
          },
          {
            text: "What did the other one say?",
          },
          {
            text: "What was one of the ladies doing?",
          },
          {
            text: "What did she say to the other lady?",
          },
          {
            text: "What did the other lady answer?",
          },
          {
            text: "What did she say to the driver?",
          },
          {
            text: "What did he answer?",
          },
          {
            text: "Why did he answer in this way?",
          }
        ]
      },
    ],
  },
  listening_intermediate_b5: {
    mainDescription: "Cut a branch 'b5'",
    tasks: [
      {
        taskID: "multiple_choice",
        audio: new URL('../assets/audio/storiesListening/cut a branch.mp3', import.meta.url).href,
        taskPicture: new URL("../assets/audio/storiesListening/cut a branch.jpg", import.meta.url).href,
        textScript:
          "Nasreddin was cutting a branch off a tree in his garden. While he was sawing, another man passed in the street. He stopped and said, 'Excuse me, but if you continue to saw that branch like that, you will fall down with it.' He said this because Nasreddin was sitting on the branch and cutting it at a place between himself and the trunk of the tree.\n" +
          "Nasreddin said nothing. He thought, 'This is some foolish person who has no work to do and goes about telling other people what to do and what not to do.' The man continued on his way.\n" +
          "Of course, after a few minutes, the branch fell and Nasreddin fell with it.\n" +
          "'My God!' he cried. 'That man knows the future!' and he ran after him to ask how long he was going to live. But the man had\n"
          ,
        questions: [
          {
            text: "What was Nasreddin doing at the beginning of this story?",
          },
          {
            text: "Who passed in the street?",
          },
          {
            text: "What did the man say?",
          },
          {
            text: "Why did he say this?",
          },
          {
            text: "What did Nasreddin say?",
          },
          {
            text: "What did he think?",
          },
          {
            text: "What did the other man do then?",
          },
          {
            text: "What happened after a few minutes?",
          },
          {
            text: "What did Nasreddin say then?",
          },
          {
            text: "What did he do?",
          },
          {
            text: "Why did he do this?",
          },
          {
            text: "Did he find the man? Why (not)?",
          },

        ]
      },
    ],
  },
  listening_b1_test_30p1: {
    mainDescription: "B1 listening 30p1",
    tasks: [
      {
        taskDescription: null,
        audio: new URL('../assets/audio/b1-test-30-1.mp3', import.meta.url).href,
        usefulWords: 'part - часть, exhibition - / эгзибИшн / выставка, recently - /рИсэнтли/ недавно (на днях), refund - / рИфанд / возврат денег',
        taskID: "multiple_choice",
        taskPicture: null,
        textScript:
          '1   Which part of the Arts Centre only opened recently?\n' +
          '\n' +
          'Woman:   In the heart of the city the Arts Centre includes a concert hall, cinema and an art gallery. The cinema is presenting a programme of films by younger film-makers and is attracting larger audiences than ever. The open-air concert area is the new home to the City Orchestra with an exciting concert programme of new composers and guest performers, while the City Art Gallery has a major programme of exhibitions all summer. Guests can enjoy dinner in the popular restaurant and enjoy the wonderful views of the city and river.\n' +
          '\n' +
          '2   What does the shop assistant give the man?\n' +
          '\n' +
          'Man:   Excuse me, I bought this sweater here, but when I got home I noticed it had a hole in it.\n' +
          '\n' +
          'Woman:   Oh, I’m sorry. Oh yes, I see. Well I can certainly exchange it for you. We have plenty more – or would you like your money back instead?\n' +
          '\n' +
          'Man:   Well, I’d actually prefer one of those shirts over there but you haven’t got my size. Oh, don’t worry about it. I’ll just have a refund, please.\n' +
          '\n' +
          'Woman:   Of course. We’re having more shirts in next week if you’re interested.\n' +
          '\n' +
          '3   Where does the woman feel pain?\n' +
          '\n' +
          'Woman:   Hello, it’s Maria here. Just to let you know about my health problems again. I saw Dr Jones last week about my knee and he told me to rest. It still hurts and he said if things don’t improve, I should go back and see him again. Honestly, it was my ankle a few weeks ago. At least my headaches seem to have gone for the moment. Give me a ring and let me know how you are. Let’s meet for a coffee soon. Call me back.\n' +
          '\n' +
          '4   Where must the woman go to buy dollars?\n' +
          '\n' +
          'Man:   Can I help you?\n' +
          '\n' +
          'Woman:   I’d like to buy some dollars, please.\n' +
          '\n' +
          'Man:   Do you bank with us? We only sell dollars to customers who have an account at this bank.\n' +
          '\n' +
          'Woman:   No, I’m a tourist – I’m just in the country for a few days. I just wanted to change some euros into dollars. What do you suggest I do then?\n' +
          '\n' +
          'Man:   There’s a currency exchange office at the airport.\n' +
          '\n' +
          'Woman:   That’s so far away! Is there nowhere nearer? In a shopping mall, for example?\n' +
          '\n' +
          'Man:   Sorry, there used to be an exchange office in the big department store in the mall, but it closed last year.\n' +
          '\n' +
          '5   Which vegetable is used in all today’s recipes?\n' +
          '\n' +
          'Man:   On today’s Student Cookery programme, I’m going to show you how to make some really cheap and healthy meals. Forget about opening tins and think fresh! You can do wonderful things with tomatoes, potatoes – and I don’t mean chips or fries! – even cabbage, yes cabbage rolls, filled with tasty rice and herbs. And the essential vegetable in all my recipes is the ordinary onion, red or white or brown – colour doesn’t matter. First of all, you need a sharp knife. So, watch carefully and off we go …\n' +
          '\n' +
          '6   Where is the meeting?\n' +
          '\n' +
          'Man:   Do you know where today’s meeting with the Theatre Director will be held?\n' +
          '\n' +
          'Woman:   I thought it was in his office. Let me check his online diary.\n' +
          '\n' +
          'Man:   He did say he might hold it outdoors as it’s so hot. But that’s never a very good idea as papers can get blown away. I hope it’s in the staff restaurant – I could do with a cold drink!\n' +
          '\n' +
          'Woman:   Ah, here it is in the diary – he’s arranged it down by the lake. You could take something to drink with you – enjoy!\n' +
          '\n' +
          '7   How did the man want to pay?\n' +
          '\n' +
          'Man:   You’d think that paying a bill would be easy. On tonight’s Money Today, I’m looking at some of the difficulties there can be. The story starts with my own experience. Thinking it’d be simpler, I made the mistake of trying to pay a hotel bill in cash. Well, amazingly they insisted on me using a credit card. I didn’t have one with me, so had to get onto my internet banking site using my mobile phone to try and get my card details. Nothing’s easy.\n' +
          '\n' +
          '1 B   2 C   3 C   4 A   5 A   6 B   7 A',
        questions: [
          {
            text: "Which part of the Arts Centre only opened recently?",
            questionPicture: new URL("../assets/images/b1-test-30-1.jpg", import.meta.url).href,
            options: {
              A: "Art gallery",
              B: "Open-air concert hall",
              C: "Cinema",
              D: "Mysterious toilet"
            },
            correctAnswer: "A",
          },
          {
            text: "What does the shop assistant give the man?",
            questionPicture: new URL("../assets/images/b1-test-30-2.jpg", import.meta.url).href,
            options: {
              A: "A",
              B: "B",
              C: "C",
            },
            correctAnswer: "C",
          },
          {
            text: "Where does the woman feel pain?",
            questionPicture: new URL("../assets/images/b1-test-30-3.jpg", import.meta.url).href,
            options: {
              A: "A",
              B: "B",
              C: "C",
            },
            correctAnswer: "C",
          },
          {
            text: " Where must the woman go to buy dollars?",
            questionPicture: new URL("../assets/images/b1-test-30-4.jpg", import.meta.url).href,
            options: {
              A: "A",
              B: "B",
              C: "C",
            },
            correctAnswer: "A",
          },
          {
            text: "Which vegetable is used in all today’s recipes?",
            questionPicture: new URL("../assets/images/b1-test-30-5.jpg", import.meta.url).href,
            options: {
              A: "A",
              B: "B",
              C: "C",
            },
            correctAnswer: "A",
          },
          {
            text: "Where is the meeting?",
            questionPicture: new URL("../assets/images/b1-test-30-6.jpg", import.meta.url).href,
            options: {
              A: "A",
              B: "B",
              C: "C",
            },
            correctAnswer: "B",
          },
          {
            text: "How did the man want to pay?",
            questionPicture: new URL("../assets/images/b1-test-30-7.jpg", import.meta.url).href,
            options: {
              A: "A",
              B: "B",
              C: "C",
            },
            correctAnswer: "A",
          },
        ]
      },
    ]
  },

  lifeInThe80s: {
    mainDescription: "Послушать и выбрать правильные ответы",
    tasks: [
      {
        taskDescription: "Todd and Rachel are talking about the 1980 and how it is different from life now",
        taskID: "drop_down_text",
        usefulWords: 'teens - teenagers (подростки), generation - поколение, in advance - заранее, obviously - очевидно, so much different - на столько сильно разная',
        audio: new URL('../assets/audio/storiesListening/LifeInThe80sB1.mp3', import.meta.url).href,
        questions: [
          {
            text: "Todd: Rachel, did you grow up in (France, Zimbabwe, USA, New Zealand*) ?\n" +
              "\n" +
              "Rachel: Yes. I did.\n" +
              "\n" +
              "Todd: Nice. I grew up in the States - USA. And I (think, thought*, hope) we would talk about how life is so much different for teens today than it was for our generation.\n" +
              "\n" +
              "Rachel: Okay. I think we can do that.\n" +
              "\n" +
              "Todd: Obviously the first thing is that when we were young, we didn't have (laptops, computers, smart phones*) and things like that. We didn't have the internet, actually.\n" +
              "\n" +
              "Rachel: We didn't have internet. We didn't have email.\n" +
              "\n" +
              "Todd: Yeah. I remember if you wanted to meet a friend, you would have to plan it way (for, at, in*, by) advance.\n" +
              "\n" +
              "Rachel: Yes.\n" +
              "\n" +
              "Todd: You would have to wait by the phone. Remember that, waiting by the phone. You couldn't go outside because if you were waiting for the call, you had to wait at your house (until*, before, after, when) you got the call, and then...\n" +
              "\n" +
              "Rachel: We didn't even have an answering machine at my house.\n" +
              "\n" +
              "Todd: Wow, my gosh. That's really (stupid, awesome, old school*).\n" +
              "\n" +
              "Rachel: We used to have to wait by the phone.\n" +
              "\n" +
              "Todd: Yeah.\n" +
              "\n" +
              "Rachel: I used to (spend*, spending) every afternoon after school on the phone with my friends. After we got home from school, we would call each other, and discuss the day's events I suppose.\n" +
              "\n" +
              "Todd: Yeah, you had so much to share. That's true. I think...\n" +
              "\n" +
              "Rachel: So, my teens these days, they come home from school, they get on their phone, and they text all their friends.\n" +
              "\n" +
              "Todd: Right. And they do it all day, like it's constant. (Always chatter, Constant chatting, Constant chatter*, Не понимаю я!).\n" +
              "\n\n\n\n",
              // "Слушаем до этого момента.\n" +
              // "\n" +
              // "Слушаем до этого момента.\n" +
              // "\n" +
              // "Дальше не нужно.\n" +
              // "\n" +
              // "\n\n\n\n" +
              // "Rachel: Yeah.\n" +
              // "\n" +
              // "Todd: I think maybe that's why I'm not so much into texting. It's just too much work. I like to build up the mystery of not knowing what somebody did for a while.\n" +
              // "\n" +
              // "Rachel: Mm, yeah. But I was thinking about it recently, and I think that it was similar because we used to telephone a lot. But then we did have to wait a long time before finding the news.\n" +
              // "\n" +
              // "Todd: True. Yeah, I read once about how a lot of the movie plots from the '60s, '70s, and '80s wouldn't work today because of cell phones.\n" +
              // "\n" +
              // "Rachel: Yes.\n" +
              // "\n" +
              // "Todd: Because a lot of the story line...\n" +
              // "\n" +
              // "Rachel: ...are about missed communications and...\n" +
              // "\n" +
              // "Todd: Right, right. Yeah.\n" +
              // "\n" +
              // "Rachel: Yes. And somebody arrived and somebody else didn't.\n" +
              // "\n" +
              // "Todd: Another one I think that's really obvious is bottled water. When I grew up, there was no such thing as bottled water. You had to get water from a faucet, right?\n" +
              // "\n" +
              // "Rachel: Yes, or a tap.\n" +
              // "\n" +
              // "Todd: Yeah, and I think I remember when they first started coming out with bottled water. I think I was about 14 or 15.\n" +
              // "\n" +
              // "Rachel: It was a bit later in New Zealand, I think.\n" +
              // "\n" +
              // "Todd: Yeah. That was crazy. I mean, do you remember what it was like when people were first drinking bottled water, how strange it seemed at the time? Everyone was like, \"Why don't you get it from the tap?\"\n" +
              // "\n" +
              // "Rachel: Well, it's very clean in New Zealand, so the tap water was clean. So, there was really no reason.\n" +
              // "\n" +
              // "Todd: Yeah, if you come from a temperate climate, it was never a problem, right? Because you just ... I'm from a temperate climate as well, and so the water doesn't really have problems with bacteria or things like that. It's always clean. It used to be clean. In New Zealand, it's probably still clean.\n" +
              // "\n" +
              // "Rachel: The rivers used to be clean, but they're not so clean now.\n" +
              // "\n" +
              // "Todd: Oh really? Even in New Zealand?\n" +
              // "\n" +
              // "Rachel: Problems, yeah.\n" +
              // "\n" +
              // "Todd: Oh, really. Shocking.\n" +
              // "\n" +
              // "Rachel: Mm, it's a bit sad.\n" +
              // "\n" +
              // "Todd: Yeah. How about other things that we used to do when we were kids. One thing is, I think compared to kids today, is we used to spend a lot of time outside.\n" +
              // "\n" +
              // "Rachel: Yes.\n" +
              // "\n" +
              // "Todd: Actually, our parents would not allow you to stay inside. You had to go outside.\n" +
              // "\n" +
              // "Rachel: You had to go outside.\n" +
              // "\n" +
              // "Todd: Right?\n" +
              // "\n" +
              // "Rachel: It's the opposite today.\n" +
              // "\n" +
              // "Todd: Yeah.\n" +
              // "\n" +
              // "Rachel: They tend to make them stay inside, won't let them go outside.\n" +
              // "\n" +
              // "Todd: Why is that? What's the rationale for why they should stay inside?\n" +
              // "\n" +
              // "Rachel: Safety.\n" +
              // "\n" +
              // "Todd: Safety?\n" +
              // "\n" +
              // "Rachel: Mm.\n" +
              // "\n" +
              // "Todd: Yeah.\n" +
              // "\n" +
              // "Rachel: We didn't used to hear about all of the kidnappings and abuse in the media, so people weren't afraid of it.\n" +
              // "\n" +
              // "Todd: Right. Yeah. And the crazy thing is I think...\n" +
              // "\n" +
              // "Rachel: You hear about it now.\n" +
              // "\n" +
              // "Todd: It's actually safer now, right? They say...\n" +
              // "\n" +
              // "Rachel: Yeah, it's safer now.\n" +
              // "\n" +
              // "Todd: Even in the states, where they hear about this, I think statistics say that it's actually safer that it was before, but the perception is there.\n" +
              // "\n" +
              // "Rachel: Although that could be because the children are all inside.\n" +
              // "\n" +
              // "Todd: That's true. Yeah.\n" +
              // "\n" +
              // "Rachel: That's a difficult one to figure out. But I don't think it's that unsafe to play outside. I think it's better for kids socially, for their bodies, for their development to play outside if they can.\n" +
              // "\n" +
              // "Todd: I agree. I totally agree. Kids definitely should be outside. And kids should be bored. I think that's one of the things that kids miss out on is boredom.\n" +
              // "\n" +
              // "Rachel: They're never bored now. They've always got a screen to look at.\n" +
              // "\n" +
              // "Todd: Right. So, obviously when we were young, you had nothing to do, so you had to go outside and find something.\n" +
              // "\n" +
              // "Rachel: Climb a tree.\n" +
              // "\n" +
              // "Todd: Yeah. Exactly. Oh, that's so fun.\n" +
              // "\n" +
              // "Rachel: I thought of something. We used to have video watching parties.\n" +
              // "\n" +
              // "Rachel: Oh, yeah.\n" +
              // "\n" +
              // "Rachel: Because only one person in 10 had a video machine.\n" +
              // "\n" +
              // "Todd: Right.\n" +
              // "\n" +
              // "Rachel: We would all go to the video store together, and argue over which videos to watch, and choose some horror movies and some comedies. And then go to one person's house, and all watch them altogether.\n" +
              // "\n" +
              // "Todd: I do remember that. Yeah. It was a big thing.\n" +
              // "\n" +
              // "Rachel: No Netflix binging, but yeah, having a video party at someone's house was a big deal.\n" +
              // "\n" +
              // "Todd: And I think movies were a much bigger deal back then because we didn't have screen time. There was no such thing as screen time. You had your TV, but that was not the same thing. Your parents wouldn't let you watch that much TV anyway. And so a movie was a big deal.\n" +
              // "\n" +
              // "Rachel: It was more of a big deal. You didn't just watch it on Netflix when you were bored.\n" +
              // "\n" +
              // "Todd: Yeah, but a kid these days, it's just they're on their screen all the time. It's just more digital pixels. Yeah, different times.",
          },
        ]
      },
    ],
  },

  readingIntensive1: {
    mainDescription: null,
    tasks: [
      {
        taskDescription: "Без перевода - читай, везде звук /Э/",
        taskID: "grid_table",
        taskPicture: new URL("../assets/images/A sound.jpeg", import.meta.url).href,
        tableData: {
          headers: ["", "читается", "пишется"],
          rows: [
            { cells: ["могу, умею, банка", "/ кЭн /", "CAN"], editable: [false, false, false] },
            { cells: ["кот, кошка, котик", "/ кЭт /", "CAT"], editable: [false, false, false] },
            { cells: ["такси в Британии", "/ кЭб /", "CAB"], editable: [false, false, false] },
            { cells: ["кепка", "/ кЭп /", "CAP"], editable: [false, false, false] },
            { cells: ["шляпа, шапка", "/ хЭт /", "HAT"], editable: [false, false, false] },
            { cells: ["мужчина, человек", "/ мЭн /", "MAN"], editable: [false, false, false] },
            { cells: ["грустный, печальный", "/ сЭд /", "SAD"], editable: [false, false, false] },
            { cells: ["приятель в Британии", "/ лЭд /", "LAD"], editable: [false, false, false] },
            { cells: ["кровать, постель","/ бЭд /", "BED"], editable: [false, false, false] },
            { cells: ["имя мужское Теодор", "/ тЭд /", "TED"], editable: [false, false, false] },
            { cells: ["светодиод", "/ лЭД /", "LED"], editable: [false, false, false] },
            { cells: ["позволять, разрешать", "/ лЭт /", "LET"], editable: [false, false, false] },
          ]
        }
      },
      {
        taskDescription: "Даже если хочетя читать А, читай везде /Э/",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читай вслух"],
          rows: [
            { cells: ["могу, умею, банка", "CAN"], editable: [false, false] },
            { cells: ["кот, кошка, котик", "CAT"], editable: [false, false] },
            { cells: ["такси в Британии", "CAB"], editable: [false, false] },
            { cells: ["кепка", "CAP"], editable: [false, false] },
            { cells: ["шляпа, шапка", "HAT"], editable: [false, false] },
            { cells: ["мужчина, человек", "MAN"], editable: [false, false] },
            { cells: ["грустный, печальный", "SAD"], editable: [false, false] },
            { cells: ["приятель в Британии", "LAD"], editable: [false, false] },
            { cells: ["кровать, постель", "BED"], editable: [false, false] },
            { cells: ["имя мужское Теодор", "TED"], editable: [false, false] },
            { cells: ["светодиод", "LED"], editable: [false, false] },
            { cells: ["позволять, разрешать", "LET"], editable: [false, false] },

          ]
        }
      },
      {
        taskDescription: "уверенно читай - ты сможешь!",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читай вслух"],
          rows: [
            { cells: ["летучая мышь, бита", "BAT"], editable: [false, false] },
            { cells: ["толстый, жирный", "FAT"], editable: [false, false] },
            { cells: ["коврик для йоги, мат", "MAT"], editable: [false, false] },
            { cells: ["крыса", "RAT"], editable: [false, false] },
            { cells: ["красный цвет", "RED"], editable: [false, false] },
            { cells: ["устанавливать, настраивать", "SET"], editable: [false, false] },
            { cells: ["встретил", "MET"], editable: [false, false] },
            { cells: ["могу", "CAN"], editable: [false, false] },
            { cells: ["не могу", "CAN`T"], editable: [false, false] },
          ]
        }
      },
      {
        taskDescription: "Обрати внимание - короткий звук Э или длинный ЭЭЭ",
        taskID: "grid_table",
        tableData: {
          headers: ["", "произношение"],
          rows: [
            { cells: ["мужчина один", "/ мЭЭЭн /", "MAN"], editable: [false, false, false] },
            { cells: ["мужчин много", "/ мЭн /", "MEN"], editable: [false, false, false] },
            { cells: ["плохой", "/ бЭЭЭд /", "BAD"], editable: [false, false, false] },
            { cells: ["кровать", "/ бЭд /", "BED"], editable: [false, false, false] },
            { cells: ["плохая кровать","/ бЭЭЭд бЭд/", "BAD BED"], editable: [false, false, false] },
            { cells: ["плохие мужчины","/ бЭЭЭд мЭн/", "BAD MEN"], editable: [false, false, false] },
            { cells: ["плохой мужик","/ бЭЭЭд мЭЭЭн/", "BAD MAN"], editable: [false, false, false] },

          ]
        }
      },
      {
        taskDescription: "Проверим вашу память",
        taskID: "grid_table",
        taskPicture: new URL("../assets/images/A_sound_long.jpeg", import.meta.url).href,

        tableData: {
          headers: ["", "читай вслух"],
          rows: [
            { cells: ["мужик", "MAN"], editable: [ false, false] },
            { cells: ["мужики", "MEN"], editable: [ false, false] },
            { cells: ["плохой", "BAD"], editable: [ false, false] },
            { cells: ["постель", "BED"], editable: [ false, false] },
            { cells: ["некачественная постель","BAD BED"], editable: [ false, false] },
            { cells: ["плохие мужчины","BAD MEN"], editable: [ false, false] },
            { cells: ["один плохой мужик","BAD MAN"], editable: [ false, false] },
          ]
        }
      },
      {
        taskDescription: "Write in English",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "Напиши по-английски"],
          rows: [
            { cells: ["Плохая кровать", ""],
              editable: [ false, true ],
              correctAnswers: {
                cells: [null, "bad bed"],
                almostCorrect: {
                  1: ["a bad bed"], // Индекс поля (начиная с 0)
                }
              }},
            { cells: ["1 мужчинА", ""], editable: [ false, true],
              correctAnswers: {
                cells: [null, "a man"],
                almostCorrect: {
                  1: ["man","1 man","one man"], // Индекс поля (начиная с 0)
                }
              }},
            { cells: ["мужчины", ""], editable: [ false, true],
              correctAnswers: {
                cells: [null, "men"],
              }},
          ],
        }
      },
    ],
  },
  readingIntensive2: {
    mainDescription: null,
    tasks: [
      {
        taskDescription: "Без перевода - просто читай",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читается", "пишется"],
          rows: [
            { cells: ["мальчик, парень", "/ бОй /", "BOY"], editable: [false, false, false] },
            { cells: ["игрушка", "/ тОй /", "TOY"], editable: [false, false, false] },
            { cells: ["документ", "/ дОк /", "DOC"], editable: [false, false, false] },
            { cells: ["собака, пёс", "/ дОг /", "DOG"], editable: [false, false, false] },
            { cells: ["большой", "/ бИг /", "BIG"], editable: [false, false, false] },
            { cells: ["свинья, хрюша", "/ пИг /", "PIG"], editable: [false, false, false] },
            { cells: ["булавка, пинкод", "/ пИн /", "PIN"], editable: [false, false, false] },
            { cells: ["почтовый индекс", "/ зИп /", "ZIP"], editable: [false, false, false] },
            { cells: ["сидеть", "/ сИт /", "SIT"], editable: [false, false, false] },
            { cells: ["макать, окунаться", "/ дИп /", "DIP"], editable: [false, false, false] },
          ]
        }
      },
      {
        taskDescription: "С максимальной скоростью",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читай вслух"],
          rows: [
            { cells: ["макать, окунаться", "DIP"], editable: [false, false] },
            { cells: ["сидеть", "SIT"], editable: [false, false] },
            { cells: ["почтовый индекс", "ZIP"], editable: [false, false] },
            { cells: ["свинья, хрюша", "PIG"], editable: [false, false] },
            { cells: ["большой", "BIG"], editable: [false, false] },
            { cells: ["булавка, пинкод", "PIN"], editable: [false, false] },
            { cells: ["собака, пёс", "DOG"], editable: [false, false] },
            { cells: ["документ", "DOC"], editable: [false, false] },
            { cells: ["мальчик, парень", "BOY"], editable: [false, false] },
            { cells: ["игрушка", "TOY"], editable: [false, false] },
          ]
        }
      },
      {
        taskDescription: "без разницы Можно О = можно А",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читается", "пишется"],
          rows: [
            { cells: ["горячий", "/ хОт, хАт /", "HOT"], editable: [false, false, false] },
            { cells: ["кастрюля", "/ пОт, пАт /", "POT"], editable: [false, false, false] },
            { cells: ["получил", "/ гОт , гАт /", "GOT"], editable: [false, false, false] },
            { cells: ["точка", "/ дОт , дАт /", "DOT"], editable: [false, false, false] },
            { cells: ["господь Бог", "/ гОд , гАд /", "GOD"], editable: [false, false, false] },
            { cells: ["замОк", "/ лОк , лАк /", "LOCK"], editable: [false, false, false] },
            { cells: ["блок", "/ блОк , блАк /", "BLOCK"], editable: [false, false, false] },
            { cells: ["часы", "/ клОк , клАк /", "CLOCK"], editable: [false, false, false] },
            { cells: ["место", "/ спОт , спАт /", "SPOT"], editable: [false, false, false] },
          ]
        }
      },{
        taskDescription: "без разницы Можно О = можно А",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["и так и так понятно", "как нравится так и читай"],
          rows: [
            { cells: ["блок", "BLOCK"], editable: [false, false] },
            { cells: ["часы", "CLOCK"], editable: [false, false] },
            { cells: ["замок", "LOCK"], editable: [false, false] },
            { cells: ["место", "SPOT"], editable: [false, false] },
            { cells: ["горячий", "HOT"], editable: [false, false] },
            { cells: ["кастрюля", "POT"], editable: [false, false] },
            { cells: ["получил", "GOT"], editable: [false, false] },
            { cells: ["точка", "DOT"], editable: [false, false] },
            { cells: ["господь Бог", "GOD"], editable: [false, false] },
          ]
        }
      },
      {
        taskDescription: "Без перевода - просто читай",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читается", "пишется"],
          rows: [
            { cells: ["эй, привет", "/ хЭй /", "HEY"], editable: [false, false, false] },
            { cells: ["день", "/ дЭй /", "DAY"], editable: [false, false, false] },
            { cells: ["играть", "/ плЭй /", "PLAY"], editable: [false, false, false] },
            { cells: ["месяц Май", "/ мЭй /", "MAY"], editable: [false, false, false] },
            { cells: ["платить", "/ пЭй /", "PAY"], editable: [false, false, false] },
            { cells: ["ручка", "/ пЭн /", "PEN"], editable: [false, false, false] },
            { cells: ["курица", "/ хЭн /", "HEN"], editable: [false, false, false] },
            { cells: ["варенье", "/ джЭм /", "JAM"], editable: [false, false, false] },
            { cells: ["имя ДЖЭК", "/ джЭк /", "JACK"], editable: [false, false, false] },
            { cells: ["реактивный самолёт", "/ джЭт /", "JET"], editable: [false, false, false] },
            { cells: ["пока ещё нет", "/ йЕт /", "YET"], editable: [false, false, false] },
            { cells: ["ага, угу, да", "/ йЕп /", "YEP"], editable: [false, false, false] },
            { cells: ["да", "/ йЕc /", "YES"], editable: [false, false, false] },
          ]
        }
      },
      {
        taskDescription: "На максимальной сорости",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читай вслух"],
          rows: [
            { cells: ["имя Джек", "JACK"], editable: [false, false] },
            { cells: ["реактивный самолёт", "JET"], editable: [false, false] },
            { cells: ["пока ещё нет", "YET"], editable: [false, false] },
            { cells: ["ага, угу, да", "YEP"], editable: [false, false] },
            { cells: ["да", "YES"], editable: [false, false] },
            { cells: ["эй, привет", "HEY"], editable: [false, false] },
            { cells: ["день", "DAY"], editable: [false, false] },
            { cells: ["играть", "PLAY"], editable: [false, false] },
            { cells: ["месяц Май", "MAY"], editable: [false, false] },
            { cells: ["платить", "PAY"], editable: [false, false] },
            { cells: ["ручка", "PEN"], editable: [false, false] },
            { cells: ["курица", "HEN"], editable: [false, false] },
            { cells: ["варенье", "JAM"], editable: [false, false] },
            { cells: ["мадам, мэм", "MAM"], editable: [false, false] },
            { cells: ["ветчина", "HAM"], editable: [false, false] },
          ]
        }
      },
      {
        taskDescription: "Без перевода - просто читай",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читай вслух"],
          rows: [

            { cells: ["лиса, лис", "FOX"], editable: [false, false] },
            { cells: ["коробка, ящик", "BOX"], editable: [false, false] },
          ]
        }
      },
    ],
  },
  readingIntensive3: {
    mainDescription: null,
    tasks: [
      {
        taskDescription: "'Е' вконце слова не читается",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читАЙ i ", "буква i ай"],
          rows: [
            { cells: ["нравится, нравиться", "/ лАЙк /", "LIKE"], editable: [false, false, false] },
            { cells: ["щука (вид рыбы)", "/ пАЙк /", "PIKE"], editable: [false, false, false] },
            { cells: ["имя Майк", "/ мАЙк /", "MIKE"], editable: [false, false, false] },
            { cells: ["имя Майкл", "/ мАЙкл /", "MICHAEL"], editable: [false, false, false] },
            { cells: ["вЕлик", "/ бАЙк /", "BIKE"], editable: [false, false, false] },
            { cells: ["вЕлосипед", "/ бАЙсикл /", "BICYCLE"], editable: [false, false, false] },
            { cells: ["шип, колючка", "/ спАЙк /", "SPIKE"], editable: [false, false, false] },
            { cells: ["телефон", "/ АЙфоун /", "IPHONE"], editable: [false, false, false] },
            { cells: ["лёд", "/ АЙс /", "ICE"], editable: [false, false, false] },
            { cells: ["кости игральные", "/ дАЙс /", "DICE"], editable: [false, false, false] },
            { cells: ["мыши", "/ мАЙс /", "MICE"], editable: [false, false, false] },
            { cells: ["рис", "/ рАЙс /", "RICE"], editable: [false, false, false] },

          ]
        }
      },
      {
        taskDescription: "Если вконце буква 'E' тогда",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", " i читай Ай"],
          rows: [
            { cells: ["имя Майк", "MIKE"], editable: [false, false] },
            { cells: ["имя Майкл", "MICHAEL"], editable: [ false, false] },
            { cells: ["велосипед", "BIKE"], editable: [false, false] },
            { cells: ["вЕлосипед", "BICYCLE"], editable: [false, false] },
            { cells: ["нравиться", "LIKE"], editable: [false, false] },
            { cells: ["щука (рыба)", "PIKE"], editable: [false, false] },
            { cells: ["шип, колючка", "SPIKE"], editable: [false, false] },
            { cells: ["лёд", "ICE"], editable: [false, false] },
            { cells: ["несколько мышей", "MICE"], editable: [false, false] },
            { cells: ["рис", "RICE"], editable: [ false, false] },
            { cells: ["игральные кости", "DICE"], editable: [false, false] },

          ]
        }
      },
      {
        taskDescription: "ЗАКРЫТЫЙ СЛОГ - гласная одна всего",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читай коротко - И "],
          rows: [
            { cells: ["сидеть", "SIT"], editable: [ false, false] },
            { cells: ["укусил", "BIT"], editable: [false, false] },
            { cells: ["поджёг", "LIT"], editable: [false, false] },
            { cells: ["подходить по размеру", "FIT"], editable: [false, false] },
            { cells: ["имя Мужское", "NICK"], editable: [false, false] },
            { cells: ["подобрать", "PICK"], editable: [false, false] },
            { cells: ["картинка", "PIC"], editable: [false, false] },
            { cells: ["кирпич", "BRICK"], editable: [false, false] },
            { cells: ["больной", "SICK"], editable: [false, false] },
            { cells: ["облизывать", "LICK"], editable: [ false, false] },
            { cells: ["пинаться", "KICK"], editable: [false, false] },
            { cells: ["набор", "KIT"], editable: [false, false] },

          ]
        }
      },
      {
        taskDescription: "ОТКРЫТЫЙ СЛОГ - две гласные буквы",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "буква i", "Ай"],
          rows: [
            { cells: ["кусать", "/ бАЙт /", "BITE"], editable: [false, false, false] },
            { cells: ["легкий вес", "/ лАЙт /", "LITE"], editable: [false, false, false] },
            { cells: ["скользить","/ слАЙд /", "SLIDE"], editable: [false, false, false] },
            { cells: ["достопримечательность","/ сАЙт /", "SITE"], editable: [false, false, false] },
            { cells: ["щука (рыба)","/ пАЙк /", "PIKE"], editable: [false, false, false] },
            { cells: ["нравиться", "/ лАЙк /","LIKE"], editable: [false, false, false] },
            { cells: ["воздушный змей","/ кАЙт /", "KITE"], editable: [false, false, false] },
            { cells: ["планировать (полёт)","/ глАЙд /", "GLIDE"], editable: [false, false, false] },
            { cells: ["широкий шаг","/ стрАЙд /", "STRIDE"], editable: [false, false, false] },
            { cells: ["правильный, право", "/ рАЙт /","RIGHT"], editable: [false, false, false] },
            { cells: ["свет","/ лАЙт /", "LIGHT"], editable: [false, false, false] },
            { cells: ["драться", "/ фАЙт /","FIGHT"], editable: [false, false, false] },
            { cells: ["вероятно","/ мАЙт /", "MIGHT"], editable: [false, false, false] },
          ]
        }
      },
      {
        taskDescription: "Когда Ай i ? Когда И i ?",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["Ай", "И"],
          rows: [
            { cells: ["-", "-"], editable: [ false, false] },
            { cells: ["BITE", "BIT"], editable: [ false, false] },
            { cells: ["LITE", "LIT"], editable: [false, false] },
            { cells: ["SLIDE", "SLID"], editable: [false, false, false] },
            { cells: ["SITE", "SIT"], editable: [false, false, false] },
            { cells: ["KITE", "KIT"], editable: [false, false, false] },
            { cells: ["PIKE", "PICK"], editable: [false, false, false] },
            { cells: ["LIKE", "LICK"], editable: [false, false, false] },
          ]
        }
      },
      {
        taskDescription: "Буква ЭЙ закрытая и открытая",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["звук /ЭЙ/", "звук /Э/"],
          rows: [
            { cells: ["-", "-"], editable: [ false, false] },
            { cells: ["SAME", "SAM"], editable: [ false, false] },
            { cells: ["GAME", "GAM"], editable: [false, false] },
            { cells: ["PLANE", "PLAN"], editable: [false, false, false] },
            { cells: ["JAME", "JAM"], editable: [false, false, false] },
            { cells: ["JACKE", "JACK"], editable: [false, false, false] },
            { cells: ["JANE", "JAN"], editable: [false, false, false] },
            { cells: ["KATE", "KAT"], editable: [ false, false] },
            { cells: ["FAME", "FAM"], editable: [false, false, false] },
            { cells: ["LAME", "LAM"], editable: [false, false, false] },
            { cells: ["LANE", "LAN"], editable: [false, false, false] },
            { cells: ["CANE", "CAN"], editable: [false, false, false] },
          ]
        }
      },

      {
        taskDescription: "Без перевода - просто читай",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читается", "пишется"],
          rows: [
            { cells: ["бежать", "/ рАн /", "RUN"], editable: [false, false, false] },
            { cells: ["солнце", "/ сАн /", "SUN"], editable: [false, false, false] },
            { cells: ["бомж, бездомный", "/ бАм /", "BUM"], editable: [false, false, false] },
            { cells: ["булочка", "/ бАн /", "BUN"], editable: [false, false, false] },
            { cells: ["но", "/ бАт /", "BUT"], editable: [false, false, false] },
            { cells: ["грязь", "/ мАд /", "MUD"], editable: [false, false, false] },
            { cells: ["кувшин", "/ джАг /", "JUG"], editable: [false, false, false] },
            { cells: ["фу! отвращение", "/ йАк /", "YUK"], editable: [false, false, false] },
            { cells: ["утка", "/ дак /", "DUCK"], editable: [false, false, false] },
            { cells: ["шайба хоккей", "/ пак /", "PUCK"], editable: [false, false, false] },
            { cells: ["удачa", "/ лак /", "LUCK"], editable: [false, false, false] },
            { cells: ["грузовик", "/ трак /", "TRUCK"], editable: [false, false, false] },
            { cells: ["застрять", "/ стак /", "STUCK"], editable: [false, false, false] },
            { cells: ["обнимать", "/ хаг /", "HUG"], editable: [false, false, false] },
            { cells: ["коврик", "/ раг /", "RUG"], editable: [false, false, false] },
            { cells: ["чашка", "/ кап /", "CUP"], editable: [false, false, false] }
          ]
        }
      },
      {
        taskDescription: "Без перевода - просто читай",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "прочитай"],
          rows: [
            { cells: ["бежать", "RUN"], editable: [false, false] },
            { cells: ["солнце", "SUN"], editable: [false, false] },
            { cells: ["бомж, бездомный", "BUM"], editable: [false, false] },
            { cells: ["булочка", "BUN"], editable: [false, false] },
            { cells: ["но", "BUT"], editable: [false, false] },
            { cells: ["грязь", "MUD"], editable: [false, false] },
            { cells: ["кувшин", "JUG"], editable: [false, false] },
            { cells: ["фу! отвращение", "YUK"], editable: [false, false] },
            { cells: ["утка", "DUCK"], editable: [false, false] },
            { cells: ["шайба (хоккей)", "PUCK"], editable: [false, false] },
            { cells: ["удача", "LUCK"], editable: [false, false] },
            { cells: ["грузовик", "TRUCK"], editable: [false, false] },
            { cells: ["застрять", "STUCK"], editable: [false, false] },
            { cells: ["обнимать", "HUG"], editable: [false, false] },
            { cells: ["коврик", "RUG"], editable: [false, false] },
            { cells: ["чашка", "CUP"], editable: [false, false] }
          ]
        }
      },
    ],
  },
  readingIntensive4: {
    mainDescription: null,
    tasks: [
      {
        taskDescription: "Дифтонги - двойные звуки",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читается ОУ", "пишется OA"],
          rows: [
            { cells: ["лодка", "/бОУт/", "BOAT"], editable: [false, false, false] },
            { cells: ["дорога", "/рОУд/", "ROAD"], editable: [false, false, false] },
            { cells: ["пальто", "/кОУт/", "COAT"], editable: [false, false, false] },
            { cells: ["коза", "/гОУт/", "GOAT"], editable: [false, false, false] },
            { cells: ["жаба", "/тОУд/", "TOAD"], editable: [false, false, false] },
            { cells: ["тост", "/тОУст/", "TOAST"], editable: [false, false, false] },
          ]
        }
      },
      {
        taskDescription: "Дифтонги - двойные звуки",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["", "читается АУ", "пишется OU"],
          rows: [
            { cells: ["дом", "/хАУс/", "HOUSE"], editable: [false, false, false] },
            { cells: ["мышь", "/мАУс/", "MOUSE"], editable: [false, false, false] },
            { cells: ["звук", "/сАУнд/", "SOUND"], editable: [false, false, false] },
            { cells: ["громкий", "/лАУд/", "LOUD"], editable: [false, false, false] },
            { cells: ["облако", "/клАУд/", "CLOUD"], editable: [false, false, false] }
          ]
        }
      },

    ],
  },
  halloweenCharacters30advanced: {
    tasks: [
      {
        taskPicture: new URL("../assets/images/yesNoBecause.png", import.meta.url).href,
        taskID: "discussion_task",
        questions: [
          {
            text: "Should pineapple be on pizza?",
            translation: "Ананас должен быть на пицце?"
          },
          {
            text: "Is it okay to wear socks with sandals?",
            translation: "Нормально ли носить носки с сандалями?"
          },
          {
            text: "Can you lick your elbow?",
            translation: "Вы можете лизнуть свой локоть?"
          },
          {
            text: "Do you talk to your pet?",
            translation: "Вы разговариваете со своим питомцем?"
          },
          {
            text: "Is it okay to eat pizza with a fork?",
            translation: "Нормально ли есть пиццу вилкой?"
          },
          {
            text: "Would you wear the same socks for 30 days for $100?",
            translation: "Вы бы носили одни носки 30 дней за $100?"
          },
          {
            text: "Do you believe in ghosts?",
            translation: "Вы верите в привидений?"
          },
          {
            text: "Do you sing in the shower?",
            translation: "Вы поёте в душе?"
          }
        ]
      },
    ],
  },
  yesNoBecause1: {
    tasks: [
      {
        taskPicture: new URL("../assets/images/yesNoBecause.png", import.meta.url).href,
        taskID: "discussion_task",
        questions: [
          {
            text: "Do you need to have a shower every day?",
            translation: "Вам нужно принимать душ каждый день?"
          },
          {
            text: "Do you need to check your phone first thing in the morning?",
            translation: "Вам нужно проверять телефон сразу после пробуждения?"
          },
          {
            text: "Is it important to exercise every day?",
            translation: "Важно ли заниматься спортом каждый день?"
          },
          {
            text: "Do you usually eat breakfast?",
            translation: "Вы обычно завтракаете?"
          },
          {
            text: "Do people need to drink 8 glasses of water a day?",
            translation: "Нужно ли людям выпивать 8 стаканов воды в день?"
          },
          {
            text: "Do you prefer to stay up late or wake up early?",
            translation: "Вы предпочитаете поздно ложиться спать или вставать рано?"
          },
          {
            text: "Can you cook well?",
            translation: "Вы хорошо готовите?"
          },
          {
            text: "Do you like spicy food?",
            translation: "Вам нравится острая еда?"
          },
        ]
      },
    ],
  },
  yesNoBecause2: {
    tasks: [
      {
        taskPicture: new URL("../assets/images/yesNoBecause.png", import.meta.url).href,
        taskID: "discussion_task",
        questions: [
          {
            text: "Is it okay to eat fast food often?",
            translation: "Нормально ли есть фастфуд часто?"
          },
          {
            text: "Do you enjoy trying new foods?",
            translation: "Вам нравится пробовать новую еду?"
          },
          {
            text: "Is chocolate tasty? What is your favorite one?",
            translation: "Шоколад вкусный? Какой твой любимый"
          },
          {
            text: "Do you like reading books?",
            translation: "Вам нравится читать книги?"
          },
          {
            text: "Are movies better than books?",
            translation: "Фильмы лучше, чем книги?"
          },
          {
            text: "Does everyone need a hobby?",
            translation: "У каждого должно быть хобби?"
          },
          {
            text: "Do you enjoy shopping?",
            translation: "Вам нравится шопинг?"
          },
          {
            text: "Can video games be good for people?",
            translation: "Могут ли видеоигры быть полезными для людей?"
          }
        ]
      },
    ],
  },
  yesNoBecause3: {
    tasks: [
      {
        taskPicture: new URL("../assets/images/yesNoBecause.png", import.meta.url).href,
        taskID: "discussion_task",
        questions: [
          {
            text: "Is it better to study alone or in a group?",
            translation: "Лучше учиться одному или в группе?"
          },
          {
            text: "Do you usually do homework at the last minute?",
            translation: "Вы обычно делаете домашку в последний момент?"
          },
          {
            text: "Should school start later in the morning?",
            translation: "Школа должна начинаться позже утром?"
          },
          {
            text: "Is it important to learn a foreign language?",
            translation: "Важно ли учить иностранный язык?"
          },
          {
            text: "Can you work well under pressure?",
            translation: "Вы хорошо работаете под давлением?"
          },
          {
            text: "Would you eat insects if they were good for health?",
            translation: "Вы бы ели насекомых, если бы они были полезны для здоровья?"
          },
          {
            text: "Can you dance well?",
            translation: "Вы хорошо танцуете?"
          },
          {
            text: "Do you believe in aliens?",
            translation: "Вы верите в инопланетян?"
          }
        ]
      },
    ],
  },
  yesNoBecause4: {
    tasks: [
      {
        taskPicture: new URL("../assets/images/yesNoBecause.png", import.meta.url).href,
        taskID: "discussion_task",
        questions: [
          {
            text: "Should pineapple be on pizza?",
            translation: "Ананас должен быть на пицце?"
          },
          {
            text: "Is it okay to wear socks with sandals?",
            translation: "Нормально ли носить носки с сандалями?"
          },
          {
            text: "Can you lick your elbow?",
            translation: "Вы можете лизнуть свой локоть?"
          },
          {
            text: "Do you talk to your pet?",
            translation: "Вы разговариваете со своим питомцем?"
          },
          {
            text: "Is it okay to eat pizza with a fork?",
            translation: "Нормально ли есть пиццу вилкой?"
          },
          {
            text: "Would you wear the same socks for 30 days for $100?",
            translation: "Вы бы носили одни носки 30 дней за $100?"
          },
          {
            text: "Do you believe in ghosts?",
            translation: "Вы верите в привидений?"
          },
          {
            text: "Do you sing in the shower?",
            translation: "Вы поёте в душе?"
          }
        ]
      },
    ],
  },
  yesNoBecause5: {
    tasks: [
      {
        taskPicture: new URL("../assets/images/yesNoBecause.png", import.meta.url).href,
        taskID: "discussion_task",
        questions: [
          {
            text: "Should weekends be longer than weekdays?",
            translation: "Выходные должны быть длиннее будних дней?"
          },
          {
            text: "Do you procrastinate a lot?",
            translation: "Вы часто прокрастинируете?"
          },
          {
            text: "Is it better to be rich or famous?",
            translation: "Лучше быть богатым или знаменитым?"
          },
          {
            text: "Can you sleep with the light on?",
            translation: "Вы можете спать при свете?"
          },
          {
            text: "Do you take selfies often?",
            translation: "Вы часто делаете селфи?"
          },
          {
            text: "Should smartphones be banned in schools?",
            translation: "Смартфоны должны быть запрещены в школах?"
          },
          {
            text: "Can robots replace teachers in the future?",
            translation: "Могут ли роботы заменить учителей в будущем?"
          },
          {
            text: "Do you use emojis every day?",
            translation: "Вы используете эмодзи каждый день?"
          }
        ]
      },
    ],
  },
  yesNoBecause6: {
    tasks: [
      {
        taskPicture: new URL("../assets/images/yesNoBecause.png", import.meta.url).href,
        taskID: "discussion_task",
        questions: [
          {
            text: "Is social media making people less social?",
            translation: "Соцсети делают людей менее общительными?"
          },
          {
            text: "Is it better to be too hot or too cold?",
            translation: "Лучше быть слишком жарко или слишком холодно?"
          },
          {
            text: "Would you eat a live worm for $100?",
            translation: "Вы бы съели живого червя за $100?"
          },
          {
            text: "Can money buy happiness?",
            translation: "Могут ли деньги купить счастье?"
          },
          {
            text: "Should cats rule the world?",
            translation: "Должны ли кошки править миром?"
          },
          {
            text: "Would you like to fly to space as a tourist?",
            translation: "Хотели бы вы полететь в космос как турист?"
          },
          {
            text: "Is it better to travel alone or with friends?",
            translation: "Лучше путешествовать одному или с друзьями?"
          },
          {
            text: "Can you jump into a swimming pool?",
            translation: "Вы умеете прыгать в бассейн?"
          }
        ]
      },
    ],
  },
  howMuchIsTooMuchDiscussion1: {
    tasks: [
      {
        taskID: "discussion_task",
        usefulWords: 'To my mind - по моему мнению, I suppose - / ай сапОуз/ я полагаю, They say that - говорят что, I`d say - я бы сказал, 5 kisses from V is too much - чересчур',
        questions: [
          {
            text: "How much pizza is too much for one person?",
            translation: "Сколько пиццы — это уже перебор для одного человека?"
          },
          {
            text: "How much screen time is too much for kids?",
            translation: "Сколько времени у экрана — это уже много для детей?"
          },
          {
            text: "How much sarcasm is too much in a relationship?",
            translation: "Когда сарказм в отношениях становится токсичным?"
          },
          {
            text: "How much coffee is too much?",
            translation: "Сколько кофе можно, чтобы не переборщить?"
          },
          {
            text: "How many pelmenis is too many?",
            translation: "Сколько пельменей считается уже перебором в пельменях?"
          },
          {
            text: "How much gossip is too much at work?",
            translation: "Когда сплетни на работе становятся невыносимыми?"
          },
          {
            text: "How much glitter is too much on a birthday card?",
            translation: "Сколько блёсток на открытке — это уже слишком?"
          }
        ]
      }
    ]
  },
  howMuchIsTooMuchDiscussion2: {
    tasks: [
      {
        taskID: "discussion_task",
        usefulWords: 'To my mind - по моему мнению, I suppose - / ай сапОуз/ я полагаю, They say that - говорят что, I`d say - я бы сказал, 5 kisses from V is too much - чересчур',

        questions: [
          {
            text: "How much chocolate is too much with a cup of tea?",
            translation: "Сколько шоколада можно съесть без вреда за одной чашечкой чая?"
          },
          {
            text: "How many roses is too many for the first date?",
            translation: "Как много роз на первом свидании будет считаться слишком уже чересчур много?"
          },
          {
            text: "How much TikTok or Instagram is too much per day?",
            translation: "Сколько часов в соцсетях — это уже зависимость?"
          },
          {
            text: "How much doshirak is too much for a week?",
            translation: "Разве может быть много Дошика?"
          },
          {
            text: "How much beer is too much at a party?",
            translation: "Разве можно переборщить с пивасиком на вечеринке?"
          },
          {
            text: "How much sport exercise is too much?",
            translation: "Когда спорта становится слишком много?"
          }
        ]
      }
    ]
  },
  howMuchIsTooMuchDiscussion3: {
    tasks: [
      {
        taskID: "discussion_task",
        usefulWords: 'To my mind - по моему мнению, I suppose - / ай сапОуз/ я полагаю, They say that - говорят что, I`d say - я бы сказал, 5 kisses from V is too much - чересчур',
        questions: [
          {
            text: "How much fast food is too much in a week?",
            translation: "Сколько фастфуда в неделю — это уже вредно?"
          },
          {
            text: "How big lips are too big?",
            translation: "Насколько увеличенные губы считается уже чересчур?"
          },
          {
            text: "How many emoji is too many in one message? 😅😅😅😅",
            translation: "Сколько эмодзи в письме — это непрофессионально?"
          },
          {
            text: "How much sleep is too much on Saturday and Sunday?",
            translation: "Сколько можно спать на выходных без чувства вины?"
          },
          {
            text: "How much volume is too much in headphones?",
            translation: "Когда громкость в наушниках становится опасной для слуха?"
          },
          {
            text: "How much computer games is too much?",
            translation: "Сколько играть в видеоигры, чтобы голова разболелась?"
          }
        ]
      }
    ]
  },
  howMuchIsTooMuchDiscussion4: {
    tasks: [
      {
        taskID: "discussion_task",
        usefulWords: 'To my mind - по моему мнению, I suppose - / ай сапОуз/ я полагаю, They say that - говорят что, I`d say - я бы сказал, 5 kisses from V is too much - чересчур',
        questions: [
          {
            text: "How much soda is too much?",
            translation: "Сколько газировки можно пить без вреда?"
          },
          {
            text: "How much social media is too much before bed?",
            translation: "Сколько времени в соцсетях вечером мешает заснуть?"
          },
          {
            text: "How much joking is too much in a serious meeting?",
            translation: "Когда шутки на серьёзной встрече становятся неуместными?"
          },
          {
            text: "How much salt is too much in soup?",
            translation: "Сколько соли в супе — это уже пересол?"
          },
          {
            text: "How much homework from Vincent is too much homework?",
            translation: "Как много домашки от Винсента считается перебором?"
          },
          {
            text: "How many pets is too many?",
            translation: "Сколько питомцев считается уже перебор с питомцами?"
          }
        ]
      }
    ]
  },
  directionsA2: {
    mainDescription: "Послушай и выбери правильный ответ",
    tasks: [
      {
        taskDescription: "Drop down",
        taskID: "drop_down_text",
        usefulWords: 'The bookstore - книжный магазин (USA), The bookshop - книжный магазин (UK)',
        taskPicture: new URL("../assets/images/directionsA2.png", import.meta.url).href,
        audio: new URL('../assets/audio/whereisthebookstore.mp3', import.meta.url).href,
        questions: [
          {
            text: "The bookstore is Hello friends! Let me share (for, to, with*) you a few words about myself, I (do, does, are, am*, is) a secret agent Antony. I always sit (under, behind, on*, near) my chair and every day I work (in, at*, under, for, between) my computer.\n" +
              '<-->\n' +
              "I (haven't, don't have*, hasn't) a cat. But I (do, have*, has) a fantastic dog! (Her, His*) name is Marvel, not DC. My dog (have, has*, doesn't have*, hasn't, do) problems. I can talk about my dog endlessly, but I (haven't, don't have*, doesn't have) much time, so I am going to finish talking about my dog now. And let me (say, telk, tell*) you about new cool stories bout my baby (Cupcake*, Cheesecake*, Muffin*) ",
          },
        ]
      },
    ],
  },
  ieltsListening1: {
    mainDescription: "IELTS listening",
    tasks: [
      {
        taskDescription: "Write the correct letter A, B, D, E, F, G, H",
        taskID: "student_input",
        usefulWords: 'Entrance - вход, Cross - крест, First Aid - первая помощь, Main field - главное поле',
        audio: new URL('../assets/audio/Ielts_listening_1.mp3', import.meta.url).href,
        taskPicture: new URL("../assets/images/ielts_listening_1.png", import.meta.url).href,
        textScript: 'Before you listen to the audio, you have some time to look at questions 1 to 5.\n' +
          '\n' +
          'Now listen carefully and answer questions 1 to 5.\n' +
          '\n' +
          'Okay, let\'s have a look at a map of the Athletic Centre. You can see South Gate Road along the bottom of the map going horizontally, and there\'s East Gate Road on the right-hand side going from the bottom up to the top of the map. And there\'s the main entrance, also there at the bottom of the map on South Gate Road.\n' +
          '\n' +
          'So, first of all, you\'ll need to know where to send other parents to park their cars. That\'ll be Car Park 3. Actually, there are several car parks at the centre on both sides of the main entrance. See the large square-shaped area on the map? Car Park 3 is the top half of that square, just below the trees, so please send parents over there.\n' +
          '\n' +
          'Now, the changing rooms. You\'ll need to know where to find them. I remember they used to be up near the running track. You can see the running track is that large oval area on the map, but the changing rooms are much more conveniently located now. All you have to do is come in through the main entrance, immediately take the road that goes off left and aim for the building that looks a bit like a cross. That\'s where the kids will be getting changed for this year\'s sports day.\n' +
          '\n' +
          'Right, the first aid centre. Hopefully, we won\'t be taking too many children there, but you do need to know where it is. So, if you\'re starting from the main entrance, the quickest route is to walk around the hall on the right-hand side. There\'s no path, so you\'ll be walking on the grass. Keep straight on so you\'re walking between the main field and the oval running track, and then you can see on the map there that the first aid centre is just above those two locations, and right below that little bridge.\n' +
          '\n' +
          'The cafe is a bit of a walk from the main entrance. It\'s in that long, narrow building, the one that\'s near the northern end of Eastgate Road, and sort of above the oval running track. If you\'re walking from the hall, you\'ll probably want to cut through that line of trees to get up there. Anyway, you can see that that building is divided into two, and you want the room with a view of the river, not of East Gate Road.\n' +
          '\n' +
          'Finally, when the kids go kayaking on the river, they\'ll all have to be wearing life jackets. The life jackets are kept in a small building near the boathouse. There\'s no actual road to the life jacket shed, but it\'s just a short walk from the boathouse. You can see it there, not far from Southgate Road. So make sure no one gets into a kayak without first getting themselves a life jacket.',
        questions: [
          {
            text: "1 - Carpark № 3 _",
            correctAnswer: "e",
          },
          {
            text: "2 - Changing Rooms _",
            correctAnswer: "g",
          },
          {
            text: "3 - First-aid  Rooms _",
            correctAnswer: "a",
          },
          {
            text: "4 - Cafe _",
            correctAnswer: "b",
          },
          {
            text: "5 - Life jackets _",
            correctAnswer: "f",
          },
        ]
      },
    ],
  },
  ieltsListening7: {
    mainDescription: "IELTS exam listening 7",
    tasks: [
      {
        taskDescription: "What is the location of ... ?",
        taskID: "drop_down_text",
        usefulWords: 'Summit - /самит/ вершина, Stables - /стЭйблз/ конюшни, Surgery room - /сЁджэри рум/ операционная' ,
        taskPicture: new URL("../assets/images/ielts_listening_7.png", import.meta.url).href,
        audio: new URL('../assets/audio/ielts_listening_7.mp3', import.meta.url).href,
        textScript: 'Before you listen to the audio, you have some time to look at questions 31 to 35. Now listen carefully and answer questions 31 to 35.\n' +
          '\n' +
          'Okay, so if you take out your maps, I\'ll just point out a few places you might like to visit. So right now, we\'re standing in the ticket office at the bottom of your maps. So one place I recommend is the Old Bakery.\n' +
          '\n' +
          'This is a typical bakery from this area from about 100 years ago. To get there from the ticket office, walk up Stafford Street and then turn into Rigby Road. Walk down Rigby Road, there are a few interesting places along the way, and the Old Bakery is right next to the canal.\n' +
          '\n' +
          'Another interesting place is the Doctor\'s Surgery. This was moved here brick by brick and rebuilt on the museum site. Walk up Stafford Street until you reach the dock.\n' +
          '\n' +
          'You see the cafe. Walk past that and the Doctor\'s Surgery is just there. Cooper\'s Cottage is also fascinating.\n' +
          '\n' +
          'A worker\'s cottage from the 19th century. Walk up Stafford Street and take the first turning on the left. The road curves round to the west, then south as it climbs Jack\'s Hill.\n' +
          '\n' +
          'You\'ll pass a few little houses on the way up, and Cooper\'s Cottage is right on the summit of Jack\'s Hill. The stables are also great. This is where they kept all the horses.\n' +
          '\n' +
          'Again, walk up Stafford Street to the dock and turn right. Walk round the dock till you get to the canal, then cross the bridge over the canal to reach the stables. Also, be sure to visit the old school.\n' +
          '\n' +
          'So, walk north-east up through the museum and it\'s not too far. The old school is right on the corner of Stafford Street and Rigby Road. Now, one other thing that I need to mention.\n',
        questions: [
          {
            text:
              "Old bakery (A,B,C*,D,E,F,G,H,i)\n" +
              "Doctor's surgery (A,B,C,D,E,F*,G,H,i)\n" +
              "Cooper's cottage (A*,B,C,D,E,F,G,H,i)\n" +
              "Stables (A,B,C,D,E,F,G,H*,i)\n" +
              "Old school (A,B,C,D,E*,F,G,H,i)\n"
          },
        ]
      },
    ],
  },
  WhatIsMyLevel: {
    mainDescription: "СПЭШЛ проверка уровня",
    tasks: [
      {
        usefulWords: null,
        taskDescription: "Слушайте и повторяйте вслух. Переводить не нужно, только повторять. Без пауз. (можете настроить скорость аудио) Нужно каждое слово и фразу из аудио повторить вслух на английском языке. Проверим способность слышать и копировать английские звуки, правильную интонацию, произношение. Ну и рАшн акцент проверим есть или нет. Ван ту фри нажимай плэй и погнали лэтс гоу эйджэнт слушатинг и повторятинг вслух",
        audio: new URL('../assets/audio/Musical-instrument.mp3', import.meta.url).href,
        taskID: "true_false",
        taskPicture: new URL("../assets/images/guitarist.jpg", import.meta.url).href,
        textScript: 'Что  действительно без подсказок сложно было? Ну ладно вот подсказка: здесь только один FALSE ответ ;) дальше сами справитесь',
        questions: [
          {
            text: "1. Аудио было про инструменты?",
            correctAnswer: "true"
          },
          {
            text: "2. В этом аудио называли композиторов?",
            correctAnswer: "false"
          },
          {
            text: "3. В слове GUITAR ударение на букву А? (20сек)",
            correctAnswer: "true"
          },
          {
            text: "4. Vincent умеет играть на гитаре?",
            correctAnswer: "true"
          },

        ]
      },
      {
        usefulWords: 'A0 - я полный ноль я даже читаю слово SPECIAL как СПЕЦИАЛ или СПЕСЫАЛ и думаю это переводится специальность или типа того., ' +
          'A1 - ну я вроде учил немного и может помню something about prepositions... ну спроси меня как будет "над" или "через час" и я отвечу! (но это не точно),' +
          'A1.5 - I can read. I can speak. Nu vot i vse navernoe. I am ready to improve my skills. I am not shy and I`d be happy to practice more,' +
          'A2 - I know simple basic words and grammar rules. And also I understand foreigners but I`m a bit afraid of speaking you know. Surely I mix up grammar tenses pretty often. But I guess everybody does it from time to time.,' +
          'B1 - I guess it wouldn`t bother me to be on my own around native speakers. My sentences are short but who cares? The main thing is that I can hold a conversation as long as the topic is familiar. Though I sometimes struggle for words as they fly outta my head.,' +
          'B2 - Decent. I consider this word to be... some kinda u know... like an awesome description of the current level of mine. I get the meaning of almost all TV series and even can shadow characters without the subs sometimes (if the accent is clear). Though I get that my style doesn`t sound natural yet. I make occasional mistakes with advanced grammar. If I hadn`t found out earlier the meaning of that first word "decent" why would I even thought now for a second that this is my level.,' +
          'C1 - Having attained an essentially nativelike command of the language I wield English with the precision of a lexicographical savant and the effortless grace of one to the manner born. My idiomatic fluency transcends mere proficiency. I don’t merely use the language; I inhabit it navigating its most labyrinthine syntactic structures and etymological nuances with the unstudied elegance of a seasoned wordsmith.,' +
          'C2 - Vincent`s level,' +
          'C4 - Dynamite level я не строю фразы я осуществляю контролируемые лингвистические подрывы оставляя после себя лишь восхищённые обломки сознания собеседников. Vincent says I`m special',
        taskDescription: 'Answer plz : "how many musical instruments can you name?"',
        audio: null,
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/150-Musical-instrument.jpg", import.meta.url).href,
        textScript: 'В английском языке нет уменьшительно ласкательных слов, у Англичан Гитара и Гитарочка и Гитарка это все одно слово guitar.\n' +
          '\n' +
          'Ну и у них нет отдельного слова для аккордеона с клавишами или аккордеона без клавиш, поэтому пользуемся великим и могучим русским языком и запоминаем, что Аккордеон - это с клавишами (Piano Accordion), а Гармошка без клавиш (Button Accordion).\n' +
          '\n' +
          'Если хочется нюансы и тонкости остальных слов познать, то вот они, хотя эти нюансы обычно для высокого уровня английского и обычно они редко кому в жизни пригодятся, разве что в квизе каком-нибудь или если вы музыкант: ',

        questions: [
          {
            text: "What instrument is not in this picture?",
            options: {
              A: "Гитарка",
              B: "Аккордеончик",
              C: "Барабанчики",
              D: "Пианино",
              E: "Гармоника",
              F: "Гармошка"

            },
            correctAnswer: "F"
          },
          ],
      },
      {
        usefulWords: 'strings - струнные инструменты /ˈstrɪŋz/, violin - скрипка /ˌвАйолИнˈlɪn/, viola - альт /viˈoʊlə/, cello - виолончель / чЕлоу ˈtʃeloʊ/, double bass - контрабас /бЭйс/, acoustic guitar - акустика /əˈkuːstɪk ɡɪˈtɑːr/, electric guitar - электрогитара /ɪˈlektrɪk ɡɪˈtɑːr/, banjo - банджо /ˈbændʒoʊ/, harp - арфа /hɑːrp/, woodwind - деревянные духовые /ˈwʊdwɪnd/, piccolo - пикколо /ˈpɪkəloʊ/, flute - флейта /fluːt/, clarinet - кларнет /ˌklærəˈnɛt/, oboe - гобой /ˈoʊboʊ/, recorder - блокфлейта /rɪˈkɔːrdər/, saxophone - саксофон /ˈsæksəfoʊn/, bassoon - фагот /bəˈsuːn/, brass instruments - медные духовые /bræs/, trumpet - труба /ˈtrʌmpɪt/, trombone - тромбон /trɒmˈboʊn/, French horn - валторна /frentʃ hɔːrn/, tuba - туба /ˈtuːbə/, percussion - ударные /pərˈkʌʃən/, drums - барабаны /drʌmz/, cymbals - тарелки /ˈsɪmbəlz/, tambourine - тамбурин /ˌtæmbəˈriːn/, xylophone - ксилофон /ˈzaɪləfoʊn/, keyboard - клавишные инструменты /ˈkiːbɔːrd/, piano - фортепиано /piˈænoʊ/, electric keyboard - синтезатор /ɪˈlektrɪk ˈkiːbɔːrd/, organ - орган /ˈɔːrɡən/, other - lругие /ˈʌðər/, instruments - инструменты /ˌɪnstrəmənts/, accordion - аккордеон /əˈkɔːrdiən/, harmonica - гармоника /hɑːrˈmɒnɪkə/ button accordion - гармошка /əˈkɔːrdiən/',
        taskDescription: "Если заметите опечатку - отправьте Vismyfriend скриншот в телегу. Но это потом, а пока ответьте: ",
        audio: null,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: '1) Скрипка - a violin is a small string instrument played with a bow (смычок). It has a high sound.\n' +
          '\n' +
          '2) Альт - a viola is a bit bigger than a violin, with a deeper sound. Also played with a bow.\n' +
          '\n' +
          '3) Виолончель - a cello is a large string instrument you play sitting down. It has a warm, deep sound.\n' +
          '\n' +
          '4) Контрабас - the double bass is the biggest string instrument! It makes very low sounds. Often used in jazz and orchestras.\n' +
          '\n' +
          '5) Акустическая гитара - an acoustic guitar is a wooden instrument with 6 strings. You pick strings or strum to make music.\n' +
          '\n' +
          '6) Электрогитара - an electric guitar needs electricity. It can make loud, rock sounds!\n' +
          '\n' +
          '7) Банджо - a banjo is a round instrument with a metal body. Often used in country and folk music.\n' +
          '\n' +
          '8) Арфа - a harp is a tall instrument with many strings. You pluck strings with your fingers to make melodies.\n' +
          '\n' +
          '9) Пикколо - the piccolo is the smallest flute! It makes very high sounds.\n' +
          '\n' +
          '10) Флейта - a flute is a silver or wooden tube. You blow air into it and cover holes to make music.\n' +
          '\n' +
          '11) Кларнет - a clarinet is a black wooden instrument. It has a smooth sound.\n' +
          '\n' +
          '12) Гобой - an oboe is a wooden instrument with a double reed (тросточки, рид, рих, наконечники). It sounds a bit "nasal" and sweet.\n' +
          '\n' +
          '13) Блокфлейта - a recorder is a simple plastic or wooden flute. Often the first instrument for kids!\n' +
          '\n' +
          '14) Саксофон - a saxophone is a shiny brass instrument with a reed. Used in jazz and pop music.\n' +
          '\n' +
          '15) Фагот - a bassoon is a big, long wooden instrument with a double reed (рих, часть инструмента). It makes deep, funny sounds.\n' +
          '\n' +
          '16) Труба - a trumpet is a shiny brass instrument with 3 buttons. It makes bright, loud sounds.\n' +
          '\n' +
          '17) Тромбон - a trombone is a long brass instrument with a sliding tube. It can make funny "wah-wah" sounds!\n' +
          '\n' +
          '18) Валторна - a French horn is a round brass instrument with a coiled tube. It has a warm, mellow (притный, душевный) sound.\n' +
          '\n' +
          '19) Туба - the tuba is the biggest brass instrument! It makes very low, "oom-pah" sounds.\n' +
          '\n' +
          '20) Барабаны - drums are instruments you hit with sticks or hands to make rhythm. The "heartbeat" of the band!\n' +
          '\n' +
          '21) Тарелки - cymbals are two round metal plates that crash together to make a loud "clang!"\n' +
          '\n' +
          '22) Тамбурин - a tambourine is a small drum with jingles (бубенцами). You shake it or hit it with your hand.\n' +
          '\n' +
          '23) Ксилофон - a xylophone has wooden or metal bars you hit with mallets (special hammers). Makes bright, ringing sounds.\n' +
          '\n' +
          '24) Фортепиано - a piano is a big instrument with black and white keys. You press them to make soft or loud sounds.\n' +
          '\n' +
          '25) Синтезатор - an electric keyboard is like a piano, but can make many different electronic sounds.\n' +
          '\n' +
          '26) Орган - an organ is a huge instrument with pipes. Often found in churches.\n' +
          '\n' +
          '27) Аккордеон - an accordion is a box-shaped instrument with bellows (меха - сильфон). You squeeze it and press buttons/keys to play.\n' +
          '\n' +
          '28) Гармоника - a harmonica is a small metal instrument you blow into. Often used in blues and folk music.',
        questions: [
          {
            text: "What words were new for you?",
            options: {
              S: "Nothing new",
              P: "Ничего нового",
              E: "Nothing special",
              C: "вИнсент! Прекрати!!!",
              I: "I am stupid!",
              A: "Правильный ответ строкой ниже",
              L: "Невозможно знать все слова в мире",
            },
            correctAnswer: "L"
          },


        ]
      },
      {
        taskDescription: "А тест по аудированию-то будем делать или живое общение лучше показывает уровень английского, чем все эти тесты? Про грамматику я вообще молчу",
        audio: new URL('../assets/audio/Check your English LISTENING LEVEL in 20 minutes.mp3', import.meta.url).href,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: 'это же экзаменационный тест, тут без подсказок нужно! Но если очень хочется, то вот варианты ответов' +
          '\n' +
          '\n' +
          '1) \n' +
          'a) post office \n' +
          'b) party\n' +
          'c) conference\n' +
          'd) theater\n'+
          '\n' +
          '2) \n' +
          'a) Chinese \n' +
          'b) Italian\n' +
          'c) Greek\n' +
          'd) Fusion\n'+
          '\n' +
          '3) \n' +
          'a) bathroom \n' +
          'b) basement\n' +
          'c) living room\n' +
          'd) bedroom\n'+
          '\n' +
          '4) \n' +
          'a) once \n' +
          'b) twice\n' +
          'c) three times\n' +
          'd) more than 3 times\n'+
          '\n',
        questions: [
          {
            text: "Tom met a TV announcer at the ____",
            options: {
              A: "_______",
              B: "_______",
              C: "_______",
              D: "_______"
            },
            correctAnswer: "A"
          },
          {
            text: "Michael hasn't tried ___ food.",
            options: {
              A: "___(запишите или запомните свои ответы)__",
              B: "___(позже проверим верно ли услышали)__",
              C: "___(варианты ответов есть в подсказках)__",
              D: "___(но попробуйте без подсказок понять)__"
            },
            correctAnswer: "C"
          },
          {
            text: "Vanessa has recently decorated her ___ .",
            options: {
              A: "_______",
              B: "_______",
              C: "_______",
              D: "_______"
            },
            correctAnswer: "D"
          },
          {
            text: "Sara has been to the south of Italy ___ .",
            options: {
              A: "_______",
              B: "_______",
              C: "_______",
              D: "_______"
            },
            correctAnswer: "A"
          },

        ]
      },

    ]
  },
  traffic1: {
    mainDescription: "Level B1 ",
    tasks: [
      {
        taskDescription: "Послушайте и ответьте",
        audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
        taskID: "true_false",
        taskPicture: null,
        textScript: null,
        questions: [
          {
            text: "1. The city has a big hockey game today.",
            correctAnswer: "false"
          },
          {
            text: "2. There is a traffic jam (пробка) on the road.",
            correctAnswer: "true"
          },
          {
            text: "3. Taxi usually doesn’t come very quickly.",
            correctAnswer: "false"
          },
          {
            text: "4. Kevin lives close to Harry.",
            correctAnswer: "true"
          },
          {
            text: "5. The traffic is slow because a traffic light is broken.",
            correctAnswer: "true"
          },
          {
            text: "6. The weather is not so good.",
            correctAnswer: "false"
          },
        ]
      },
      {
        taskDescription: "Listen & click the correct answer",
        audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/listeningPicture1.jpg", import.meta.url).href,
        textScript: '1)\n' +
          '\n' +
          'A: Are you going to take the bus downtown, or are you going to take your bike?\n' +
          '\n' +
          'B: I think there’s too much traffic on the road today to go by bike. It’s not safe to ride in traffic.\n' +
          '\n' +
          'A: I guess there’s so much traffic because of the big football game. Well, look, I’m driving downtown. Can I give you a ride?\n' +
          '\n' +
          'B: Hey, thanks.\n' +
          '\n' +
          'A: So do you use your bike very often?\n' +
          '\n' +
          'B: Not during the week, but I ride it pretty often on the weekend.\n' +
          '\n' +
          '2)\n' +
          '\n' +
          'A: How are you going to get downtown? Are you going to drive?\n' +
          '\n' +
          'B: I don’t think so. I just heard the traffic report on the radio. It seems there is a traffic jam on the freeway. They said a couple of buses have broken down.\n' +
          '\n' +
          'A: I guess it will be quicker to take the subway.\n' +
          '\n' +
          'B: Absolutely!\n' +
          '\n' +
          '3)\n' +
          '\n' +
          'A: Gosh. I wonder how much longer we’ll have to wait for a bus. We’ve waited half an hour already! Do you think we should go back and get the car?\n' +
          '\n' +
          'B: Oh, no. I hate driving at night.\n' +
          '\n' +
          'A: Let’s take a taxi. I don’t want to be late for the movie.\n' +
          '\n' +
          'B: Good idea. I’ll call for one on cell phone. They usually come pretty quickly.\n' +
          '\n' +
          '4)\n' +
          '\n' +
          'A: How are you going to get home from the restaurant on Sunday, Harry?\n' +
          '\n' +
          'B: Oh, I can just take a bus or a taxi. There are usually plenty of taxis around that area at night.\n' +
          '\n' +
          'A: Yes, but not on a Sunday night. You might wait for a long time. Why don’t you ask Kevin to drive you home? He’s having dinner with us and he lives near you.\n' +
          '\n' +
          'B: That’s right. I’ll ask him.\n' +
          '\n' +
          '5)\n' +
          '\n' +
          'A: What’s the traffic like downtown today?\n' +
          '\n' +
          'B: It’s pretty bad. One of the traffic lights is broken, so all the traffic is backing up.\n' +
          '\n' +
          'A: Oh. How should I get to doctor’s appointment? Drive? Take a taxi?\n' +
          '\n' +
          'B: A taxi won’t be any faster than driving.\n' +
          '\n' +
          'A: Well then, I’ll probably take the subway to the station and then walk from there.\n' +
          '\n' +
          'B: Yeah, today I think that’s the fastest way.\n' +
          '\n' +
          '6)\n' +
          '\n' +
          'A: How do you plan to get to your friend’s house? Do you need a ride?\n' +
          '\n' +
          'B: How’s the weather?\n' +
          '\n' +
          'A: It’s really nice out.\n' +
          '\n' +
          'B: Oh, thanks anyway, but I’ll ride bike. I was going to take the bus, but I need to get some exercise.\n' +
          '\n' +
          'A: All right. But be careful of the traffic.',

        questions: [
          {
            text: "Как Vincent доберется до центра?",
            options: {
              A: "Я вообще ХЗ, он непредсказуем!",
              B: "by car",
              C: "on foot",
              D: "by bicycle",
              E: "by bus"
            },
            correctAnswer: "B"
          },
          {
            text: "Каким способом сегодня быстрее?",
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
      },
      {
        taskDescription: "My friends, если увидите ошибки/отпечатки в русских или английских словах, то сдеайте скриншот и отправьте в телеграм #vismyfriend он исправит эвриthin' 4 you. Thx!",
        audio: null,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: null,
        questions: [
          {
            text: "Как вам эти задания?",
            options: {
              S: "Ниче особенного",
              P: "Ничего особенного",
              E: "Nothing special",
              C: "вИнсент! Прекрати!!!",
              I: "I am stupid!",
              A: "Правильный ответ строкой ниже",
              L: "Thank you, it's awesome! Ещё хочу",
            },
            correctAnswer: "L"
          },


        ]
      },
      {
        taskDescription: "People are describing (описывают) traffic problems in their cities and different solutions (решения).",
        audio: new URL('../assets/audio/traffic_2.mp3', import.meta.url).href,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: '1)\n' +
          '\n' +
          'In town, public transportation was never very good. You had to drive everywhere, so there was always traffic. The government wanted to make public transportation easier than driving cars. They bought some nice new buses, for example, and they added air conditioning to the ones we already had. They also began offering lower bus fares on the weekends, so more people would be encouraged to try the new buses. They raised taxi fares, too. I guess they figure that if taxis cost more, people might think about using buses more often.\n' +
          '\n' +
          '2)\n' +
          '\n' +
          'Well, the problem was that thousands of people drove into the city center every day, and there weren’t enough parking spaces. So the government wanted to make parking easier. But they didn’t build more parking garages. Instead, they tried to keep cars out of the city center. Recently, they started making people who drive their cars downtown pay a daily fee. You have to pay $10 if you want to drive your car into the center between 8 a.m. and 6 p.m. At the same time, they have raised the parking lot rates, so people think twice before they drive their car into the city.\n' +
          '\n' +
          '3)\n' +
          '\n' +
          'Traffic was a real problem around here. It moved so slowly. Last year the government turned a bunch of streets downtown into one-way streets. This helped the traffic move more quickly. Special lanes on roads just for buses were built at the same time. If you’re caught driving your car in a bus lane, you have to pay a fine – and it’s a really high fine! Also, they passed a law last year that says you can only drive your car downtown three days a week. You have to display a special pass in your car that says which days you’re allowed to drive downtown.\n' +
          '\n' +
          '4)\n' +
          '\n' +
          'Air pollution in our city was a huge problem, and we really needed to lower it. I guess that’s why the government started putting special bicycle lanes on the streets downtown. That way, people can ride their bikes to work instead of using their stinky cars! They also made a rule that says there must be at least two people in your car if you want to drive downtown during the week. They also ordered these amazing new pollution-free buses. They use electricity, so they don’t put anything bad into the air.',
        questions: [
          {
            text: "What did they do to improve transportation?",
            options: {
              A: "They improved the quality of buses.",
              B: "They raised bus fares on weekends.",
              C: "They lowered taxi fares."
            },
            correctAnswer: "A"
          },
          {
            text: "What change was made about parking?",
            options: {
              A: "They built more parking garages.",
              B: "They made drivers pay a daily fee.",
              C: "They kept all cars out of the city center."
            },
            correctAnswer: "C"
          },
          {
            text: "What was done to manage traffic jams?",
            options: {
              A: "They made many streets downtown one-way.",
              B: "They made new lanes for cars to use.",
              C: "They made a law that people can drive downtown every day if they have a special pass."
            },
            correctAnswer: "A"
          },
          {
            text: "What rule was introduced to reduce pollution?",
            options: {
              A: "They did not allow people to ride a bicycle downtown.",
              B: "They made a rule that there must be at least three people in a car to go downtown.",
              C: "They bought new buses that don’t create pollution."
            },
            correctAnswer: "C"
          },

        ]
      },

    ]
  },
  mission2: {
    mainDescription: "Level A1 ",
    tasks: [
      {
        taskDescription: "Послушайте и ответьте",
        audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
        taskID: "true_false",
        taskPicture: null,
        textScript: null,
        questions: [
          {
            text: "1. The city has a big hockey game today.",
            correctAnswer: "false"
          },
          {
            text: "2. There is a traffic jam (пробка) on the road.",
            correctAnswer: "true"
          },
          {
            text: "3. Taxi usually doesn’t come very quickly.",
            correctAnswer: "false"
          },
          {
            text: "4. Kevin lives close to Harry.",
            correctAnswer: "true"
          },
          {
            text: "5. The traffic is slow because a traffic light is broken.",
            correctAnswer: "true"
          },
          {
            text: "6. The weather is not so good.",
            correctAnswer: "false"
          },
        ]
      },
      {
        taskDescription: "Listen and answer",
        audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/listeningPicture1.jpg", import.meta.url).href,
        textScript: '1)\n' +
          '\n' +
          'A: Are you going to take the bus downtown, or are you going to take your bike?\n' +
          '\n' +
          'B: I think there’s too much traffic on the road today to go by bike. It’s not safe to ride in traffic.\n' +
          '\n' +
          'A: I guess there’s so much traffic because of the big football game. Well, look, I’m driving downtown. Can I give you a ride?\n' +
          '\n' +
          'B: Hey, thanks.\n' +
          '\n' +
          'A: So do you use your bike very often?\n' +
          '\n' +
          'B: Not during the week, but I ride it pretty often on the weekend.\n' +
          '\n' +
          '2)\n' +
          '\n' +
          'A: How are you going to get downtown? Are you going to drive?\n' +
          '\n' +
          'B: I don’t think so. I just heard the traffic report on the radio. It seems there is a traffic jam on the freeway. They said a couple of buses have broken down.\n' +
          '\n' +
          'A: I guess it will be quicker to take the subway.\n' +
          '\n' +
          'B: Absolutely!\n' +
          '\n' +
          '3)\n' +
          '\n' +
          'A: Gosh. I wonder how much longer we’ll have to wait for a bus. We’ve waited half an hour already! Do you think we should go back and get the car?\n' +
          '\n' +
          'B: Oh, no. I hate driving at night.\n' +
          '\n' +
          'A: Let’s take a taxi. I don’t want to be late for the movie.\n' +
          '\n' +
          'B: Good idea. I’ll call for one on cell phone. They usually come pretty quickly.\n' +
          '\n' +
          '4)\n' +
          '\n' +
          'A: How are you going to get home from the restaurant on Sunday, Harry?\n' +
          '\n' +
          'B: Oh, I can just take a bus or a taxi. There are usually plenty of taxis around that area at night.\n' +
          '\n' +
          'A: Yes, but not on a Sunday night. You might wait for a long time. Why don’t you ask Kevin to drive you home? He’s having dinner with us and he lives near you.\n' +
          '\n' +
          'B: That’s right. I’ll ask him.\n' +
          '\n' +
          '5)\n' +
          '\n' +
          'A: What’s the traffic like downtown today?\n' +
          '\n' +
          'B: It’s pretty bad. One of the traffic lights is broken, so all the traffic is backing up.\n' +
          '\n' +
          'A: Oh. How should I get to doctor’s appointment? Drive? Take a taxi?\n' +
          '\n' +
          'B: A taxi won’t be any faster than driving.\n' +
          '\n' +
          'A: Well then, I’ll probably take the subway to the station and then walk from there.\n' +
          '\n' +
          'B: Yeah, today I think that’s the fastest way.\n' +
          '\n' +
          '6)\n' +
          '\n' +
          'A: How do you plan to get to your friend’s house? Do you need a ride?\n' +
          '\n' +
          'B: How’s the weather?\n' +
          '\n' +
          'A: It’s really nice out.\n' +
          '\n' +
          'B: Oh, thanks anyway, but I’ll ride bike. I was going to take the bus, but I need to get some exercise.\n' +
          '\n' +
          'A: All right. But be careful of the traffic.',

        questions: [
          {
            text: "Как Vincent доберется до спэшл места?",
            options: {
              A: "Я вообще ХЗ",
              B: "by car",
              C: "on foot",
              D: "by bicycle",
              E: "by bus"
            },
            correctAnswer: "B"
          },
          {
            text: "Каким способом сегодня быстрее?",
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
      },
      {
        taskDescription: "People are describing (описывают) traffic problems in their cities and different solutions (решения).",
        audio: new URL('../assets/audio/traffic_2.mp3', import.meta.url).href,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: '1)\n' +
          '\n' +
          'In town, public transportation was never very good. You had to drive everywhere, so there was always traffic. The government wanted to make public transportation easier than driving cars. They bought some nice new buses, for example, and they added air conditioning to the ones we already had. They also began offering lower bus fares on the weekends, so more people would be encouraged to try the new buses. They raised taxi fares, too. I guess they figure that if taxis cost more, people might think about using buses more often.\n' +
          '\n' +
          '2)\n' +
          '\n' +
          'Well, the problem was that thousands of people drove into the city center every day, and there weren’t enough parking spaces. So the government wanted to make parking easier. But they didn’t build more parking garages. Instead, they tried to keep cars out of the city center. Recently, they started making people who drive their cars downtown pay a daily fee. You have to pay $10 if you want to drive your car into the center between 8 a.m. and 6 p.m. At the same time, they have raised the parking lot rates, so people think twice before they drive their car into the city.\n' +
          '\n' +
          '3)\n' +
          '\n' +
          'Traffic was a real problem around here. It moved so slowly. Last year the government turned a bunch of streets downtown into one-way streets. This helped the traffic move more quickly. Special lanes on roads just for buses were built at the same time. If you’re caught driving your car in a bus lane, you have to pay a fine – and it’s a really high fine! Also, they passed a law last year that says you can only drive your car downtown three days a week. You have to display a special pass in your car that says which days you’re allowed to drive downtown.\n' +
          '\n' +
          '4)\n' +
          '\n' +
          'Air pollution in our city was a huge problem, and we really needed to lower it. I guess that’s why the government started putting special bicycle lanes on the streets downtown. That way, people can ride their bikes to work instead of using their stinky cars! They also made a rule that says there must be at least two people in your car if you want to drive downtown during the week. They also ordered these amazing new pollution-free buses. They use electricity, so they don’t put anything bad into the air.',
        questions: [
          {
            text: "What did they do to improve transportation?",
            options: {
              A: "They improved the quality of buses.",
              B: "They raised bus fares on weekends.",
              C: "They lowered taxi fares."
            },
            correctAnswer: "A"
          },
          {
            text: "What change was made about parking?",
            options: {
              A: "They built more parking garages.",
              B: "They made drivers pay a daily fee.",
              C: "They kept all cars out of the city center."
            },
            correctAnswer: "C"
          },
          {
            text: "What was done to manage traffic jams?",
            options: {
              A: "They made many streets downtown one-way.",
              B: "They made new lanes for cars to use.",
              C: "They made a law that people can drive downtown every day if they have a special pass."
            },
            correctAnswer: "A"
          },
          {
            text: "What rule was introduced to reduce pollution?",
            options: {
              A: "They did not allow people to ride a bicycle downtown.",
              B: "They made a rule that there must be at least three people in a car to go downtown.",
              C: "They bought new buses that don’t create pollution."
            },
            correctAnswer: "C"
          },

        ]
      },
      {
        taskDescription: "Если видите ошибки/опечатки или несогласны с результатом, то сдеайте скриншот и отправьте в телеграм #vismyfriend",
        audio: null,
        taskID: "multiple_choice",
        taskPicture: null,
        textScript: null,
        questions: [
          {
            text: "Как вам эти задания?",
            options: {
              A: "Мне кажется это провал...",
              B: "I am stupid!",
              C: "Thank you, it was awesome! Ещё хочу"
            },
            correctAnswer: "C"
          },


        ]
      },
    ]
  },
  airportCode: {
    mainDescription: "Level A2 ",
    tasks: [
      {
        taskDescription: 'Listen to the situation based on a true story (основанная на реальных событиях)\n' +
          '\n' +
          'How did Sandy Valdivieso and her husband fly? Is it 1, 2, 3 or 4?',
        audio: new URL('../assets/audio/airportCode.mp3', import.meta.url).href,
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/airportCode.jpg", import.meta.url).href,
        textScript:
          '\n' +
          'Dhaka (D) to Istanbul (C) to Dakar (B).\n' +
          '\n' +
          'Transcript\n' +
          '\n' +
          'Sandy Valdivieso and her husband were looking forward to their holiday in Africa. They had tickets for a Turkish Airlines flight from Los Angeles to Dakar, the capital of Senegal in West Africa. However, an airline mix-up sent them 11,000 kilometres away from their destination, to another continent. They boarded their flight at Los Angeles International Airport in the USA. But unfortunately, an airline employee at the airport accidentally entered the wrong three-letter airport code into the flight booking system. The code for Dakar is DKR. But the employee entered DAC, which is the code for Dhaka, the capital of Bangladesh, in Asia.\n' +
          '\n' +
          'The first leg of their flight to Istanbul in Turkey went smoothly, but it was the second leg of the trip that sent them off in the wrong direction. From Turkey, they headed East rather than West.\n' +
          '\n' +
          'At first, Sandy and her husband did not notice that there was a problem. When the flight attendant said they were heading to Dhaka, they thought she was saying ‘Dakar’ with a Turkish accent. Several hours into the trip they woke up from a long sleep and noticed the inflight map showed the plane over the Middle East. They then realised the plane was full of passengers who looked Asian, not African. That’s when they knew that there was a serious mistake. But there was nothing they could do about it: they had to continue all the way to Bangladesh!\n' +
          '\n' +
          'Once on the ground, it took several hours for the airline to confirm the mistake was their fault. They apologized to Sandy and her husband and 12 hours later, they flew them back to Istanbul. From there, they took the correct plane to Senegal. To say sorry, Turkish Airlines offered the passengers two free econo class tickets to any destination it flies to.' +
        '\n' + '3) They flew from Los Angeles (A) to Istanbul (C) to\n',
        questions: [
          {
            text: "Какой у них получился маршрут по факту?",
            options: {
              A: "1- They flew from A to B to C to D",
              B: "2- They flew from A to C to D to B.",
              C: "3- They flew from A to C to D to C to B",
              D: "4- They flew from A to C to D to C to A.",
              E: "5- Я вообще ничего не понял, заного слушаю!"
            },
            correctAnswer: "C"
          },
        ]
      },

    ]
  },
  directionsListeningA2: {
    mainDescription: "Listening skills Level A2",
    tasks: [
      {
        usefulWords: 'You are here! - /ю а хИэ/ вы находитесь здесь!, ' +
          'Where am I? - /уЭ Эм ай/ где я?, ' +
          'on the right - справа, ' +
          'on the left - слева, ' +
          'to the left - налево, ' +
          'to the right - направо, ' +
          'next turn - /нэкст тёрн/ следующий поворот, ' +
          'go straight - /гоу стрЭйт/ идти прямо, ' +
          'go ahead - /гоу э хЭд/ иди вперёд, ' +
          'turn right - /тёрн райт/ поверни направо, ' +
          'take right - /тэйк райт/ cверни вправо, ' +
          'take the first left - сверни сразу влево, ' +
          'get to - добираться до, ' +
          'the theatre - театр, ' +
          'until you get to - /антИл/ пока не доберешься до, ' +
          'next to - возле и следующий / близко к, ' +
          'opposite - /Опозит/ напротив, ' +
          'go past something - проходить мимо чего-то, ' +
          'traffic lights - светофор, ' +
          'roundabout - /рАунд эбаут/ круговое движение, ' +
          'crossroads - перекресток',
        taskDescription: 'Посмотрите на карту, find yourself. Do you know all the buildings here?',
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/A2_directionsNew.png", import.meta.url).href,
        textScript: null,
        questions: [
          {
            text: 'Take the second right - означает:"',
            options: {
              A: "Свернуть налево на Green Street",
              B: "Свернуть вправо на Green Street",
              C: "Свернуть налево на King's Road",
              D: "Свернуть вправо на King's Road",
              E: "Взять секунду, чтобы подумать о верном повороте",
            },
            correctAnswer: "D"
          },
          {
            text: "Какой смысл фразы 'go straight on'?",
            options: {
              A: "Иди назад",
              B: "Остановись",
              C: "Развернись",
              D: "Продолжай идти",
              E: "Иди направо",
            },
            correctAnswer: "D"
          },
          {
            text: 'Как сказать "мы на перекрёстке"?',
            options: {
              A: "we are AT the roundabout",
              B: "we are AT home",
              C: "we are ON perekrestok",
              D: "we are AT the crossroads",
              E: "we are AT the traffic lights",
            },
            correctAnswer: "D"
          },
          {
            text: 'Как сказать "это не почта, это полийцейский участок"',
            options: {
              A: "it's not the police, it's the pochta",
              B: "it's not the post, it's the policia",
              C: "it's not the post office, it's the police station",
            },
            correctAnswer: "C"
          },
        ]
      },
      {
        usefulWords: 'You are here! - /ю а хИэ/ вы находитесь здесь!, ' +
          'Where am I? - /уЭ Эм ай/ где я?, ' +
          'on the right - справа, ' +
          'on the left - слева, ' +
          'to the left - налево, ' +
          'to the right - направо, ' +
          'next turn - /нэкст тёрн/ следующий поворот, ' +
          'go straight - /гоу стрЭйт/ идти прямо, ' +
          'go ahead - /гоу э хЭд/ иди вперёд, ' +
          'turn right - /тёрн райт/ поверни направо, ' +
          'take right - /тэйк райт/ cверни вправо, ' +
          'take the first left - сверни сразу влево, ' +
          'get to - добираться до, ' +
          'the theatre - театр, ' +
          'until you get to - /антИл/ пока не доберешься до, ' +
          'next to - возле и следующий / близко к, ' +
          'opposite - /Опозит/ напротив, ' +
          'go past something - проходить мимо чего-то, ' +
          'traffic lights - светофор, ' +
          'roundabout - /рАунд эбаут/ круговое движение, ' +
          'crossroads - перекресток',
        taskDescription: 'Послушайте и проложите маршрут - линию пути людей от "You are here" до ...',
        audio: new URL('../assets/audio/A2_giving_directions.mp3', import.meta.url).href,
        taskID: "student_input",
        taskPicture: new URL("../assets/images/A2_directionsNew.png", import.meta.url).href,
        textScript: 'A\n' +
          'Go straight on. Then take the first left on Green Street. Walk past the library and it’s the building next to the library on the left.\n' +
          '\n' +
          'B\n' +
          'Go straight on. Go past the traffic lights. You will see a shop on the right. Go past that and it’s on the right next to the shop.\n' +
          '\n' +
          'C\n' +
          'Go straight on. Go past the traffic lights and go straight on until you get to the roundabout. At the roundabout turn left. Go past the theatre. It’s the building next to the theatre, opposite the hospital.\n' +
          '\n' +
          'D\n' +
          'Go straight on. Go past the traffic lights and take the second right on to King’s Road. Go past the bookshop. It’s the building next to the bookshop opposite the café.',
        questions: [
          {
            text: "The 1 first person is going to the __",
            correctAnswer: "post office",
            almostCorrectAnswers: ["post",]
          },
          {
            text: "The 2 second person is going to the __",
            correctAnswer: "underground station",
            almostCorrectAnswers: ["metro","underground"]
          },
          {
            text: "The 3 third person is going to the __",
            correctAnswer: "cinema",
            almostCorrectAnswers: ["movie theater",]
          },
          {
            text: "The 4 fourth person is going to the __",
            correctAnswer: "bus station",
          },
        ]
      },
      {
        taskDescription: "Discuss this:",
        taskID: "discussion_task",
        usefulWords: null,
        audio: null,
        taskPicture: new URL("../assets/images/A2_directionsNew.png", import.meta.url).href,
        textScript: null,
        questions: [
          {
            text: "What building is opposite the theatre?",
            translation: "Какое здание находится напротив театра?",
          },
          {
            text: "How many traffic lights are in the picture?",
            translation: "Сколько светофоров на этой картинке",
          },
          {
            text: "HWhat building is next to the factory?",
            translation: "Какое здание находится рядом с заводом",
          },
          {
            text: "What building is on the right to the cafe?",
            translation: "Что за здание расположено справа от кафе?",
          },
        ]
      },
      {
        taskDescription: "Discuss this:",
        taskID: "discussion_task",
        usefulWords: 'You are here! - /ю а хИэ/ вы находитесь здесь!, ' +
          'Where am I? - /уЭ Эм ай/ где я?, ' +
          'on the right - справа, ' +
          'on the left - слева, ' +
          'to the left - налево, ' +
          'to the right - направо, ' +
          'next turn - /нэкст тёрн/ следующий поворот, ' +
          'go straight - /гоу стрЭйт/ идти прямо, ' +
          'go ahead - /гоу э хЭд/ иди вперёд, ' +
          'turn right - /тёрн райт/ поверни направо, ' +
          'take right - /тэйк райт/ cверни вправо, ' +
          'take the first left - сверни сразу влево, ' +
          'get to - добираться до, ' +
          'the theatre - театр, ' +
          'until you get to - /антИл/ пока не доберешься до, ' +
          'next to - возле и следующий / близко к, ' +
          'opposite - /Опозит/ напротив, ' +
          'go past something - проходить мимо чего-то, ' +
          'traffic lights - светофор, ' +
          'roundabout - /рАунд эбаут/ круговое движение, ' +
          'crossroads - перекресток',

        audio: null,
        taskPicture: new URL("../assets/images/A2_directionsNew.png", import.meta.url).href,
        textScript: null,
        questions: [
          {
            text: "How to get to the factory from the hospital? (you are in the hospital) Tell all possible variants.",
            translation: "Как добраться до завода если идешь с больницы? расскажи все возможные варианты",
          },
          {
            text: "How to get to the Italian restaurant from the place where you are ? Tell all possible variants.",
            translation: "Как добраться до ресторана Итальянского с того места где вы находитесь? расскажи все возможные варианты",
          },
          {
            text: "How to get to the shop from the bus station? Tell all possible variants. (you are near the bus station)",
            translation: "Как добраться до магазина если идешь с автовокзала? расскажи все возможные варианты",
          },
          {
            text: "How to get to the police station from the factory? Tell all possible variants. (you are behind the factory)",
            translation: "Как добраться до полицейского участка если идешь с завода? (ты за заводом) расскажи все возможные варианты",
          },
          {
            text: "How to get to the museum from the place where you are ? Tell all possible variants.",
            translation: "Как добраться до музея с того места где вы находитесь? расскажи все возможные варианты",
          },
          {
            text: "How to get to the supermarket from the place where you are? What if the Bond Street is blocked?",
            translation: "Как добраться до супермаркета с того места где вы находитесь? Что если улица Бонда заблокированна и по ней нельзя идти?",
          },
        ]
      },
    ]
  },
  directionsListeningA1: {
    mainDescription: "Аудио файл 👇 снизу",
    tasks: [
      {
        usefulWords:
          'Go straight - / гоу стрЭйт / идите прямо, ' +
          'On the right - / он дэ райт / справа, ' +
          'Library - / лАйбрэри / библиотека, ' +
          'take the first left - сверни сразу влево (на\u00A0первом\u00A0повороте), ' +
          'take the second left - сверни на втором повороте\u00A0налево', // неразрывной пробел юникод если &nbsp; не работает
        taskDescription: '(можно изменить скорость аудио) Послушай и впиши пропущенные слова',
        audio: new URL('../assets/audio/A2_giving_directions.mp3', import.meta.url).href,
        taskID: "student_input",
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        textScript: 'Если вы ввели неверный ответ, то исправьте его на верный и нажмите кнопку проверить - результат пересчитается\n' +
          '\n' +
          'Не ради оценок, а ради практики вашего английского! \n '+
          '\n' +
          'From\u00A0Vincent\u00A0with\u00A0love!',
        questions: [
          {
            text: "A) Go straight on. Then take the first left on to Green Street. Walk past the ___ and it’s the building next to the library on the left.",
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
    ]
  },
  irregularVerbsGridNaughtyVerbsGrid: {
    mainDescription: "Naughty Verbs",
    tasks: [
      {
        taskDescription: "Глаголы проказники:",
        taskID: "grid_table",
        taskPicture: null,
        tableData: {
          headers: ["V1", "V2", "V3", "перевод"],
          rows: [
            { cells: ["разбить", "разбил", "разбитый", "сломанный"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["настоящее (обычно)", "прошлое (вчера)", "прилагательные (какой, какие)", "разломанные"], editable: [false, false, false, false] },

            { cells: ["break", "broke", "broken", ""], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },
            { cells: ["buy", "bought", "bought", "/бай, бот, бот/"], editable: [false, false, false, false] },
            { cells: ["покупаю", "купил", "купленный", ""], editable: [false, false, false, false] },

            { cells: ["beat", "beat", "beaten", "побить"], editable: [false, false, false, false] },
            { cells: ["become", "became", "become", "становиться"], editable: [false, false, false, false] },
            { cells: ["begin", "began", "begun", "начинать"], editable: [false, false, false, false] },
            { cells: ["blow", "blew", "blown", "дуть"], editable: [false, false, false, false] },
            { cells: ["borrow", "borrowed", "borrowed", "брать в долг"], editable: [false, false, false, false] },
            { cells: ["build", "built", "built", "строить"], editable: [false, false, false, false] },
            { cells: ["burn", "burnt", "burnt", "сжигать, гореть"], editable: [false, false, false, false] },
            { cells: ["bring", "brought", "brought", "приносить"], editable: [false, false, false, false] },
            { cells: ["be", "was/were", "been", "быть"], editable: [false, false, false, false] },
            { cells: ["bite", "bit", "bitten", "кусать"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["come", "came", "come", "приходить"], editable: [false, false, false, false] },
            { cells: ["choose", "chose", "chosen", "выбирать"], editable: [false, false, false, false] },
            { cells: ["catch", "caught", "caught", "ловить"], editable: [false, false, false, false] },
            { cells: ["creep", "crept", "crept", "ползать"], editable: [false, false, false, false] },
            { cells: ["cost", "cost", "cost", "стоить"], editable: [false, false, false, false] },
            { cells: ["cut", "cut", "cut", "резать"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },
            { cells: ["deal", "dealt", "dealt", "иметь дела"], editable: [false, false, false, false] },
            { cells: ["dig", "dug", "dug", "копать"], editable: [false, false, false, false] },
            { cells: ["do", "did", "done", "делать"], editable: [false, false, false, false] },
            { cells: ["drive", "drove", "driven", "водить"], editable: [false, false, false, false] },
            { cells: ["draw", "drew", "drawn", "рисовать"], editable: [false, false, false, false] },
            { cells: ["drink", "drank", "drunk", "пить"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["eat", "ate", "eaten", "кушать"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["fall", "fell", "fallen", "падать"], editable: [false, false, false, false] },
            { cells: ["feed", "fed", "fed", "кормить"], editable: [false, false, false, false] },
            { cells: ["feel", "felt", "felt", "чувствовать"], editable: [false, false, false, false] },
            { cells: ["fight", "fought", "fought", "сражаться"], editable: [false, false, false, false] },
            { cells: ["find", "found", "found", "находить"], editable: [false, false, false, false] },
            { cells: ["fly", "flew", "flown", "летать"], editable: [false, false, false, false] },
            { cells: ["forbid", "forbade", "forbidden", "запрещать"], editable: [false, false, false, false] },
            { cells: ["forget", "forgot", "forgotten", "забывать"], editable: [false, false, false, false] },
            { cells: ["forgive", "forgave", "forgiven", "прощать"], editable: [false, false, false, false] },
            { cells: ["freeze", "froze", "frozen", "замерзать"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["grow", "grew", "grown", "расти"], editable: [false, false, false, false] },
            { cells: ["get", "got", "got", "получать"], editable: [false, false, false, false] },
            { cells: ["give", "gave", "given", "давать"], editable: [false, false, false, false] },
            { cells: ["go", "went", "gone", "ходить"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["have", "had", "had", "иметь"], editable: [false, false, false, false] },
            { cells: ["hear", "heard", "heard", "слышать"], editable: [false, false, false, false] },
            { cells: ["hide", "hid", "hidden", "прятать"], editable: [false, false, false, false] },
            { cells: ["hit", "hit", "hit", "ударять"], editable: [false, false, false, false] },
            { cells: ["hurt", "hurt", "hurt", "причинять боль"], editable: [false, false, false, false] },
            { cells: ["hold", "held", "held", "держать"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["keep", "kept", "kept", "хранить"], editable: [false, false, false, false] },
            { cells: ["know", "knew", "known", "знать"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["lead", "led", "led", "вести, приводить"], editable: [false, false, false, false] },
            { cells: ["learn", "learnt", "learnt", "изучать"], editable: [false, false, false, false] },
            { cells: ["leave", "left", "left", "покидать"], editable: [false, false, false, false] },
            { cells: ["lend", "lent", "lent", "давать в долг"], editable: [false, false, false, false] },
            { cells: ["let", "let", "let", "позволять"], editable: [false, false, false, false] },
            { cells: ["lose", "lost", "lost", "терять"], editable: [false, false, false, false] },
            { cells: ["tell a lie", "told a lie", "told a lie", "говорить ложь"], editable: [false, false, false, false] },
            { cells: ["lie", "lay", "lain", "лежать"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["make", "made", "made", "создавать"], editable: [false, false, false, false] },
            { cells: ["mean", "meant", "meant", "иметь ввиду"], editable: [false, false, false, false] },
            { cells: ["meet", "met", "met", "встречать(ся)"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["pay", "paid", "paid", "платить"], editable: [false, false, false, false] },
            { cells: ["put", "put", "put", "класть"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["read", "read", "read", "читать"], editable: [false, false, false, false] },
            { cells: ["ride", "rode", "ridden", "ездить верхом"], editable: [false, false, false, false] },
            { cells: ["ring", "rang", "rung", "звенеть, звонить"], editable: [false, false, false, false] },
            { cells: ["run", "ran", "run", "бегать"], editable: [false, false, false, false] },
            { cells: ["rise", "rose", "risen", "подниматься"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["say", "said", "said", "сказать, произнести"], editable: [false, false, false, false] },
            { cells: ["see", "saw", "seen", "увидеть"], editable: [false, false, false, false] },
            { cells: ["sell", "sold", "sold", "продавать"], editable: [false, false, false, false] },
            { cells: ["send", "sent", "sent", "отправлять"], editable: [false, false, false, false] },
            { cells: ["shake", "shook", "shaken", "трясти"], editable: [false, false, false, false] },
            { cells: ["shoot", "shot", "shot", "стрелять"], editable: [false, false, false, false] },
            { cells: ["shut", "shut", "shut", "захлопнуть"], editable: [false, false, false, false] },
            { cells: ["sing", "sang", "sung", "петь"], editable: [false, false, false, false] },
            { cells: ["sink", "sank", "sunk", "затонуть"], editable: [false, false, false, false] },
            { cells: ["sit", "sat", "sat", "сидеть"], editable: [false, false, false, false] },
            { cells: ["sleep", "slept", "slept", "спать"], editable: [false, false, false, false] },
            { cells: ["slide", "slid", "slid", "скользить"], editable: [false, false, false, false] },
            { cells: ["speak", "spoke", "spoken", "разговаривать"], editable: [false, false, false, false] },
            { cells: ["spend", "spent", "spent", "тратить"], editable: [false, false, false, false] },
            { cells: ["spit", "spat", "spat", "плеваться"], editable: [false, false, false, false] },
            { cells: ["stand", "stood", "stood", "встать, стоять"], editable: [false, false, false, false] },
            { cells: ["steal", "stole", "stolen", "воровать"], editable: [false, false, false, false] },
            { cells: ["stick", "stuck", "stuck", "приклеить, застрять"], editable: [false, false, false, false] },
            { cells: ["stink", "stank", "stunk", "вонять"], editable: [false, false, false, false] },
            { cells: ["strike", "struck", "struck", "ударять"], editable: [false, false, false, false] },
            { cells: ["swear", "swore", "sworn", "клясться, материться"], editable: [false, false, false, false] },
            { cells: ["sweep", "swept", "swept", "подметать"], editable: [false, false, false, false] },
            { cells: ["swim", "swam", "swum", "плавать"], editable: [false, false, false, false] },
            { cells: ["swing", "swung", "swung", "качаться"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["take", "took", "taken", "брать"], editable: [false, false, false, false] },
            { cells: ["teach", "taught", "taught", "обучать"], editable: [false, false, false, false] },
            { cells: ["tear", "tore", "torn", "порвать"], editable: [false, false, false, false] },
            { cells: ["tell", "told", "told", "рассказывать"], editable: [false, false, false, false] },
            { cells: ["think", "thought", "thought", "думать"], editable: [false, false, false, false] },
            { cells: ["throw", "threw", "thrown", "бросать"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["understand", "understood", "understood", "понимать"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["wake up", "woke up", "woken up", "просыпаться"], editable: [false, false, false, false] },
            { cells: ["wear", "wore", "worn", "носить одежду"], editable: [false, false, false, false] },
            { cells: ["write", "wrote", "written", "писать"], editable: [false, false, false, false] },
            { cells: ["weep", "wept", "wept", "хныкать"], editable: [false, false, false, false] },
            { cells: ["win", "won", "won", "выигрывать"], editable: [false, false, false, false] },
            { cells: ["", "", "", ""], editable: [true, true, true, true] },

            { cells: ["misunderstand", "misunderstood", "misunderstood", "неправильно понять"], editable: [false, false, false, false] },
            { cells: ["misspell", "misspelt", "misspelt", "неправильно написать"], editable: [false, false, false, false] },
            { cells: ["mistake", "mistook", "mistaken", "ошибаться"], editable: [false, false, false, false] },
            { cells: ["mishear", "misheard", "misheard", "неправильно услышать"], editable: [false, false, false, false] },
            { cells: ["oversleep", "overslept", "overslept", "проспать"], editable: [false, false, false, false] },
            { cells: ["overeat", "overate", "overeaten", "переесть"], editable: [false, false, false, false] },
            { cells: ["overpay", "overpaid", "overpaid", "переплатить"], editable: [false, false, false, false] },
            { cells: ["arise", "arose", "arisen", "возникнуть"], editable: [false, false, false, false] },
            { cells: ["awake", "awoke", "awoken", "пробудиться"], editable: [false, false, false, false] },
            { cells: ["abide", "abode", "abode", "соблюдать, пребывать, обитать"], editable: [false, false, false, false] }
          ]
        }
      },
    ],
  },
  grid_table_IrregularVerbs_b_part_1_ru: {
    mainDescription: "Irregular Verbs 'B' part 1",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Тренируй произношение", ""," и говори уверенно"],
          rows: [
            {
              cells: ["break - broke - broken", "", "ломать"],
              editable: [false, false, false]
            },
            {
              cells: ["БрЭйк - БрОУк - БрОУкЭн", "", "БрЭйк - БрОУк - БрОУкЭн"],
              editable: [false, false, false]
            },
            {
              cells: ["buy - bought - bought", "", "покупать"],
              editable: [false, false, false]
            },
            {
              cells: ["Бай - Бот - Бот", "", "Бай - Бот - Бот"],
              editable: [false, false, false]
            },
            {
              cells: ["bring - brought - brought", "", "приносить"],
              editable: [false, false, false]
            },
            {
              cells: ["Брин - Брот - Брот", "", "Брин - Брот - Брот"],
              editable: [false, false, false]
            },
            {
              cells: ["beat - beat - beaten", "", "бить"],
              editable: [false, false, false]
            },
            {
              cells: ["би:т - би:т - би:тэн", "", "би:т - би:т - би:тэн"],
              editable: [false, false, false]
            },
            {
              cells: ["build - built - built", "", "строить"],
              editable: [false, false, false]
            },
            {
              cells: ["БилД - БилТ - БилТ", "", "БилД - БилТ - БилТ"],
              editable: [false, false, false]
            },
            {
              cells: ["bite - bit - bit", "", "кусать"],
              editable: [false, false, false]
            },
            {
              cells: ["байт - бит - бит", "", "байт - бит - бит"],
              editable: [false, false, false]
            },
          ]
        }
      },
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Произнеси 3 формы вслух", "","и перевод :"],
          rows: [
            {
              cells: ["break - broke - broken","",""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ломать"],
                almostCorrect: {
                  2: ["сломать", "нарушить", "поломать"]
                }
              }
            },
            {
              cells: ["buy - bought - bought", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "покупать"],
                almostCorrect: {
                  2: ["купить", "приобретать", "закупать"]
                }
              }
            },
            {
              cells: ["bring - brought - brought", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "приносить"],
                almostCorrect: {
                  2: ["привести", "доставлять", "привозить"]
                }
              }
            },
            {
              cells: ["beat - beat - beaten", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "бить"],
                almostCorrect: {
                  2: ["побить", "побеждать", "избивать", "победить","избить"]
                }
              }
            },
            {
              cells: ["build - built - built", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "строить"],
                almostCorrect: {
                  2: ["построить", "создавать", "возводить"]
                }
              }
            },
            {
              cells: ["bite - bit - bit", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "кусать"],
                almostCorrect: {
                  2: ["покусать", "укусить", "откусить","прикусить"]
                }
              }
            },
          ]
        }
      },{
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Скажи вслух на английском", "",""],
          rows: [
            {
              cells: ["принести - принёс - принесённый","",""],
              editable: [false, false, true],
            },
            {
              cells: ["купить - купил - купленный", "", ""],
              editable: [false, false, true],
            },
            {
              cells: ["ударить - ударил - избитый", "", ""],
              editable: [false, false, true],
            },
            {
              cells: ["кусать - укусил - покусанный", "", ""],
              editable: [false, false, true],
            },
            {
              cells: ["строить - построил - построенный", "", ""],
              editable: [false, false, true],
            },
            {
              cells: ["разбить - разбил - разбитый", "", ""],
              editable: [false, false, true],
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_b_part_2_ru: {
    mainDescription: "Irregular Verbs 'B' part 2",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Тренируй произношение", ""," и говори уверенно"],
          rows: [
            {
              cells: ["blow - blew - blown", "", "дУть"],
              editable: [false, false, false]
            },
            {
              cells: ["БлоУ - блУ: - БлоУН", "", "БлоУ - блУ: - БлоУН"],
              editable: [false, false, false]
            },
            {
              cells: ["burn - burnt - burnt", "", "гореть"],
              editable: [false, false, false]
            },
            {
              cells: ["бЁрн - бёрнТ - бёрнТ", "", "бЁрн - бёрнТ - бёрнТ"],
              editable: [false, false, false]
            },

            {
              cells: ["become - became - become", "", "становиться"],
              editable: [false, false, false]
            },
            {
              cells: ["бикАм - бикЭйм - бикАм", "", "бикАм - бикЭйм - бикАм"],
              editable: [false, false, false]
            },
            {
              cells: ["begin - began - begun", "", "начинать"],
              editable: [false, false, false]
            },
            {
              cells: ["бигИн - бигЭн - бигАн", "", "бигИн - бигЭн - бигАн"],
              editable: [false, false, false]
            },





            {
              cells: ["be - was/were - been", "", "быть"],
              editable: [false, false, false]
            },
            {
              cells: ["Би - воз / вё - Бин", "", "Би - воз / вё - Бин"],
              editable: [false, false, false]
            },
          ]
        }
      },

      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Произнеси 3 формы вслух", "","и перевод :"],
          rows: [
            {
              cells: ["blow - blew - blown", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "дуть"],
                almostCorrect: {
                  2: ["сдуть", "задувать", "развевать", "взрывать"]
                }
              }
            },

            {
              cells: ["burn - burnt - burnt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "гореть"],
                almostCorrect: {
                  2: ["жечь", "обжигать", "сжигать"]
                }
              }
            },

            {
              cells: ["become - became - become", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "становиться"],
                almostCorrect: {
                  2: ["превращаться", "оказываться", "сделаться", "стать"]
                }
              }
            },
            {
              cells: ["begin - began - begun", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "начинать"],
                almostCorrect: {
                  2: ["начать", "приступать", "запускать"]
                }
              }
            },
            {
              cells: ["be - was/were - been", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "быть"],
                almostCorrect: {
                  2: ["являться", "находиться", "существовать"]
                }
              }
            },
          ]
        }
      },
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Скажи на английском громко", "",""],
          rows: [
            {
              cells: ["есть - был / были - побывал", "", ""],
              editable: [false, false, true],
            },
            {
              cells: ["жечь - сожгли - сгоревший", "", ""],
              editable: [false, false, true],
            },

            {
              cells: ["надувать - надул - взорвавшийся", "", ""],
              editable: [false, false, true],
            },

            {
              cells: ["начинаю - начал - начавшийся", "", ""],
              editable: [false, false, true],
            },

            {
              cells: ["стать - стал - ставший", "", ""],
              editable: [false, false, true],
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_b_gaps: {
    mainDescription: "Irregular Verbs 'B'",
    tasks: [
      {
        taskDescription: "заполни таблицу",
        taskID: "grid_table",
        tableData: {
          headers: ["обычно V1","в прошлом V2","какой V3", "перевод"],
          rows: [
            {
              cells: ["burn","","burnt","гореть"],
              editable: [false, true, false,false],
              correctAnswers: {
                cells: [null,"burnt", null, null],
                almostCorrect: {
                  1: ["burned"]
                }
              }
            },
            {
              cells: ["","was/were","been","быть, являться"],
              editable: [true, false, false, false,],
              correctAnswers: {
                cells: ["be", null, null, null],
                almostCorrect: {
                  0: ["to be"]
                }
              }
            },
            {
              cells: ["beat", "beat", "", "бить, побеждать"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "beaten", null],
              }
            },
            {
              cells: ["become", "became", "", "становиться"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "become", null],
              }
            },
            {
              cells: ["begin", "", "", "начинать"],
              editable: [false, true, true, false,],
              correctAnswers: {
                cells: [null, "began", "begun", null],
              }
            },
            {
              cells: ["", "broke", "broken", "ломать"],
              editable: [ true, false, false, false],
              correctAnswers: {
                cells: ["break", null, null, null],
              }
            },
            {
              cells: ["bring", "", "brought", ""],
              editable: [false, true, false, true],
              correctAnswers: {
                cells: [null, "brought", null, "приносить"],
                almostCorrect: {
                  3: ["привозить", "доставлять"]
                }
              }
            },
            {
              cells: ["build", "", "", "строить"],
              editable: [false, true, true, false],
              correctAnswers: {
                cells: [null, "built", "built", null],
                almostCorrect: {}
              }
            },
            {
              cells: ["buy", "bought", "", ""],
              editable: [false, false, true, true],
              correctAnswers: {
                cells: [null, null, "bought", "покупать"],
                almostCorrect: {
                  3: ["приобретать", "купить"]
                }
              }
            },
            {
              cells: ["bite", "", "bit", ""],
              editable: [false, true, false, true],
              correctAnswers: {
                cells: [null, "bit", null, "кусать"],
                almostCorrect: {
                  3: ["укусить", "грызть"]
                }
              }
            }
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_c_ru: {
    mainDescription: "Irregular Verbs 'С'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Тренируй произношение", ""," и говори уверенно"],
          rows: [
            {
              cells: ["come - came - come", "", "приходить"],
              editable: [false, false, false],
            },
            {
              cells: ["кАм - кЕйм - кАм", "", "кАм - кЕйм - кАм"],
              editable: [false, false, false],
            },
            {
              cells: ["choose - chose - chosen", "", "выбирать"],
              editable: [false, false, false],
            },
            {
              cells: ["чУз - чОуз - чОузн", "", "чУз - чОуз - чОузн"],
              editable: [false, false, false],
            },
            {
              cells: ["catch - caught - caught", "", "ловить"],
              editable: [false, false, false],
            },
            {
              cells: ["кЭч - кОт - кОт", "", "кЭч - кОт - кОт"],
              editable: [false, false, false],
            },
            {
              cells: ["creep - crept - crept", "", "ползать"],
              editable: [false, false, false],
            },
            {
              cells: ["крИп - крЭпт - крЭпт", "", "крИп - крЭпт - крЭпт"],
              editable: [false, false, false],
            },
            {
              cells: ["cost - cost - cost", "", "стоить"],
              editable: [false, false, false],
            },
            {
              cells: ["кост - кост - кост", "", "кост - кост - кост"],
              editable: [false, false, false],
            },
            {
              cells: ["cut - cut - cut", "", "резать"],
              editable: [false, false, false],
            },
            {
              cells: ["кАт - кАт - кАт", "", "кАт - кАт - кАт"],
              editable: [false, false, false],
            },
          ]
        }
      },
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Произнеси 3 формы вслух", "","и перевод :"],
          rows: [
            {
              cells: ["come - came - come", "", "приходить"],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "приходить"],
                almostCorrect: {
                  2: ["прийти", "подходить", "наступать"]
                }
              }
            },
            {
              cells: ["choose - chose - chosen", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "выбирать"],
                almostCorrect: {
                  2: ["выбрать", "избирать", "предпочитать"]
                }
              }
            },
            {
              cells: ["catch - caught - caught", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ловить"],
                almostCorrect: {
                  2: ["поймать", "схватить", "перехватить"]
                }
              }
            },
            {
              cells: ["creep - crept - crept", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ползать"],
                almostCorrect: {
                  2: ["красться", "пресмыкаться", "медленно двигаться"]
                }
              }
            },
            {
              cells: ["cost - cost - cost", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "стоить"],
              }
            },
            {
              cells: ["cut - cut - cut", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "резать"],
                almostCorrect: {
                  2: ["разрезать", "отрезать", "порезать"]
                }
              }
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_c_gaps: {
    mainDescription: "Irregular Verbs 'C'",
    tasks: [
      {
        taskDescription: "заполни таблицу",
        taskID: "grid_table",
        tableData: {
          headers: ["обычно V1","в прошлом V2","какой V3", "перевод"],
          rows: [
            {
              cells: ["come","","come","приходить"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null,"came", null, null],
                almostCorrect: {}
              }
            },
            {
              cells: ["","chose","chosen","выбирать"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["choose", null, null, null],
                almostCorrect: {}
              }
            },
            {
              cells: ["catch", "", "", "ловить"],
              editable: [false, true, true, false],
              correctAnswers: {
                cells: [null, "caught", "caught", null],
                almostCorrect: {
                  1: ["catched"],
                  2: ["catched"]
                }
              }
            },
            {
              cells: ["creep", "crept", "", "ползать"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "crept", null],
              }
            },
            {
              cells: ["cost", "", "", "стоить"],
              editable: [false, true, true, false],
              correctAnswers: {
                cells: [null, "cost", "cost", null],
              }
            },
            {
              cells: ["", "cut", "cut", ""],
              editable: [true, false, false, true],
              correctAnswers: {
                cells: ["cut", null, null, "резать"],
                almostCorrect: {
                  3: ["разрезать","порезать"]
                }
              }
            },
          ]
        }
      }
    ]
  },
  grid_table_IrregularVerbs_de_ru: {
    mainDescription: "Irregular Verbs 'D,E'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Тренируй произношение", ""," и говори уверенно"],
          rows: [
            {
              cells: ["deal - dealt - dealt", "", "иметь дело"],
              editable: [false, false, false],
            },
            {
              cells: ["дИл - дЭлт - дЭлт", "", "дИл - дЭлт - дЭлт"],
              editable: [false, false, false],
            },
            {
              cells: ["dig - dug - dug", "", "копать"],
              editable: [false, false, false],
            },
            {
              cells: ["диГ - дАГ - дАГ", "", "диГ - дАГ - дАГ"],
              editable: [false, false, false],
            },
            {
              cells: ["do - did - done", "", "делать"],
              editable: [false, false, false],
            },
            {
              cells: ["ду: - дид - дАн", "", "ду - дид - дАн"],
              editable: [false, false, false],
            },
            {
              cells: ["drive - drove - driven", "", "водить"],
              editable: [false, false, false],
            },
            {
              cells: ["дрАйв - дрОУв - дрИвн", "", "дрАйв - дрОУв - дрИвн"],
              editable: [false, false, false],
            },
            {
              cells: ["draw - drew - drawn", "", "рисовать"],
              editable: [false, false, false],
            },
            {
              cells: ["дрО - дрУ: - дроУн", "", "дрО - дрУ - дроУн"],
              editable: [false, false, false],
            },
            {
              cells: ["drink - drank - drunk", "", "пить"],
              editable: [false, false, false],
            },
            {
              cells: ["дринк - дрЭнк - дранк", "", "дринк - дрЭнк - дранк"],
              editable: [false, false, false],
            },
            {
              cells: ["eat - ate - eaten", "", "есть"],
              editable: [false, false, false],
            },
            {
              cells: ["Ит - эЙт - Итэн", "", "Ит - эЙт - Итэн"],
              editable: [false, false, false],
            }
          ]
        }
      },

      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Произнеси 3 формы вслух", "","и перевод :"],
          rows: [
            {
              cells: ["deal - dealt - dealt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "иметь дело"],
                almostCorrect: {
                  2: ["раздавать", "иметь дела", "договариваться"]
                }
              }
            },
            {
              cells: ["dig - dug - dug", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "копать"],
                almostCorrect: {
                  2: ["выкопать", "рыть", "закапывать"]
                }
              }
            },
            {
              cells: ["do - did - done", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "делать"],
                almostCorrect: {
                  2: ["совершать", "выполнять", "изготавливать", "сделать"]
                }
              }
            },
            {
              cells: ["drive - drove - driven", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "водить"],
                almostCorrect: {
                  2: ["ехать", "управлять", "гнать"]
                }
              }
            },
            {
              cells: ["draw - drew - drawn", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "рисовать"],
                almostCorrect: {
                  2: ["чертить", "тащить", "извлекать"]
                }
              }
            },
            {
              cells: ["drink - drank - drunk", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "пить"],
                almostCorrect: {
                  2: ["выпивать", "поглощать", "употреблять","выпить"]
                }
              }
            },
            {
              cells: ["eat - ate - eaten", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "есть"],
                almostCorrect: {
                  2: ["кушать", "поедать", "съедать"]
                }
              }
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_de_gaps: {
    mainDescription: "Irregular Verbs 'DE'",
    tasks: [
      {
        taskDescription: "заполни таблицу",
        taskID: "grid_table",
        tableData: {
          headers: ["обычно V1","в прошлом V2","какой V3", "перевод"],
          rows: [
            {
              cells: ["deal","","dealt","иметь дела"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null,"dealt", null, null],
                almostCorrect: {
                  1: ["dealed"]
                }
              }
            },
            {
              cells: ["","dug","dug","копать"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["dig", null, null, null],
              }
            },
            {
              cells: ["do", "did", "", "делать"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "done", null],
              }
            },
            {
              cells: ["drive", "", "driven", "водить"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null, "drove", null, null],
              }
            },
            {
              cells: ["", "drew", "drawn", "рисовать"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["draw", null, null, null],
              }
            },
            {
              cells: ["drink", "drank", "", ""],
              editable: [false, false, true, true],
              correctAnswers: {
                cells: [null, null, "drunk", "пить"],
                almostCorrect: {
                  3: ["выпивать", "употреблять"]
                }
              }
            },
            {
              cells: ["eat", "", "eaten", ""],
              editable: [false, true, false, true],
              correctAnswers: {
                cells: [null, "ate", null, "есть"],
                almostCorrect: {
                  3: ["кушать", "поедать","покушать","поесть",]
                }
              }
            }
          ]
        }
      }
    ]
  },
  grid_table_IrregularVerbs_f_part_1_ru: {
    mainDescription: "Irregular Verbs 'F' part 1",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Напиши перевод глагола", "","(что делать?)"],
          rows: [
            {
              cells: ["fall - fell - fallen", "", "падать"],
              editable: [false, false, false]
            },
            {
              cells: ["фОл - фЭл - фОлэн", "", "Фол - фЭл - фОлэн"],
              editable: [false, false, false]
            },
            {
              cells: ["feed - fed - fed", "", "кормить"],
              editable: [false, false, false]
            },
            {
              cells: ["фи:Д - фэД - фэД", "", "фи:Д - фэД - фэД"],
              editable: [false, false, false]
            },
            {
              cells: ["feel - felt - felt", "", "чувствовать"],
              editable: [false, false, false]
            },
            {
              cells: ["фи:л - фэлт - фэлт", "", "фи:л - фэлт - фэлт"],
              editable: [false, false, false]
            },
            {
              cells: ["fight - fought - fought", "", "сражаться"],
              editable: [false, false, false]
            },
            {
              cells: ["файт - фо:т - фо:т", "", "файт - фо:т - фо:т"],
              editable: [false, false, false]
            },
            {
              cells: ["find - found - found", "", "находить"],
              editable: [false, false, false]
            },
            {
              cells: ["фАЙнд - фАунд - фАунд", "", "фАЙнд - фАунд - фАунд"],
              editable: [false, false, false]
            },
          ]
        }
      },
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Напиши перевод глагола", "","(что делать?)"],
          rows: [
            {
              cells: ["fall - fell - fallen", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "падать"],
                almostCorrect: {
                  2: ["упасть", "понижаться", "снижаться"]
                }
              }
            },
            {
              cells: ["feed - fed - fed", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "кормить"],
                almostCorrect: {
                  2: ["прокормить", "питать", "давать корм"]
                }
              }
            },
            {
              cells: ["feel - felt - felt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "чувствовать"],
                almostCorrect: {
                  2: ["ощущать", "испытывать", "трогать"]
                }
              }
            },
            {
              cells: ["fight - fought - fought", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "сражаться"],
                almostCorrect: {
                  2: ["бороться", "драться", "воевать", "спорить"]
                }
              }
            },
            {
              cells: ["find - found - found", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "находить"],
                almostCorrect: {
                  2: ["обнаруживать", "отыскать", "выяснять", "искать"]
                }
              }
            },

          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_f_part_2_ru: {
    mainDescription: "Irregular Verbs 'F' part 2",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Напиши перевод глагола", "","(что делать?)"],
          rows: [
            {
              cells: ["fly - flew - flown", "", "летать"],
              editable: [false, false, false]
            },
            {
              cells: ["флай - флУ - флОУн", "", "флай - флУ - флОУн"],
              editable: [false, false, false]
            },
            {
              cells: ["forbid - forbade - forbidden", "", "запрещать"],
              editable: [false, false, false]
            },
            {
              cells: ["фобИд - фоБЭйд - фоБИдэн", "", "фобИд - фоБЭйд - фоБИдэн"],
              editable: [false, false, false]
            },
            {
              cells: ["forget - forgot - forgotten", "", "забывать"],
              editable: [false, false, false]
            },
            {
              cells: ["фогет - фогот - фоготэн", "", "фогет - фогот - фоготэн"],
              editable: [false, false, false]
            },
            {
              cells: ["forgive - forgave - forgiven", "", "прощать"],
              editable: [false, false, false]
            },
            {
              cells: ["фогив - фогэйв - фогивэн", "", "фогив - фогэйв - фогивэн"],
              editable: [false, false, false]
            },
            {
              cells: ["freeze - froze - frozen", "", "замерзать"],
              editable: [false, false, false]
            },
            {
              cells: ["фриз - фроуз - фроузен", "", "фриз - фроуз - фроузен"],
              editable: [false, false, false]
            }
          ]
        }
      },

      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Напиши перевод глагола", "","(что делать?)"],
          rows: [

            {
              cells: ["fly - flew - flown", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "летать"],
                almostCorrect: {
                  2: ["лететь", "парить", "пилотировать"]
                }
              }
            },
            {
              cells: ["forbid - forbade - forbidden", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "запрещать"],
                almostCorrect: {
                  2: ["воспрещать", "не разрешать"]
                }
              }
            },
            {
              cells: ["forget - forgot - forgotten", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "забывать"],
                almostCorrect: {
                  2: ["забыть", "упускать из виду"]
                }
              }
            },
            {
              cells: ["forgive - forgave - forgiven", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "прощать"],
                almostCorrect: {
                  2: ["извинять", "отпускать грехи"]
                }
              }
            },
            {
              cells: ["freeze - froze - frozen", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "замерзать"],
                almostCorrect: {
                  2: ["замораживать", "леденеть", "останавливаться", "не двигаться"]
                }
              }
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_f_gaps: {
    mainDescription: "Irregular Verbs 'F'",
    tasks: [
      {
        taskDescription: "заполни таблицу",
        taskID: "grid_table",
        tableData: {
          headers: ["обычно V1","в прошлом V2","какой V3", "перевод"],
          rows: [
            {
              cells: ["fall","","fallen","падать"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null,"fell", null, null],
                almostCorrect: {}
              }
            },
            {
              cells: ["","fed","fed","кормить"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["feed", null, null, null],
              }
            },
            {
              cells: ["feel", "felt", "", "чувствовать"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "felt", null],
              }
            },
            {
              cells: ["fight", "", "", "сражаться"],
              editable: [false, true, true, false],
              correctAnswers: {
                cells: [null, "fought", "fought", null],
              }
            },
            {
              cells: ["", "found", "found", "находить"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["find", null, null, null],
              }
            },
            {
              cells: ["fly", "flew", "", ""],
              editable: [false, false, true, true],
              correctAnswers: {
                cells: [null, null, "flown", "летать"],
                almostCorrect: {
                  3: ["лететь", "парить"]
                }
              }
            },
            {
              cells: ["forbid", "", "forbidden", ""],
              editable: [false, true, false, true],
              correctAnswers: {
                cells: [null, "forbade", null, "запрещать"],
                almostCorrect: {
                  1: ["forbad"],
                  3: ["воспрещать"]
                }
              }
            },
            {
              cells: ["forget", "forgot", "", ""],
              editable: [false, false, true, true],
              correctAnswers: {
                cells: [null, null, "forgotten", "забывать"],
                almostCorrect: {
                  3: ["забыть", "упускать"]
                }
              }
            },
            {
              cells: ["", "forgave", "forgiven", "прощать"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["forgive", null, null, null],
              }
            },
            {
              cells: ["freeze", "", "", "замерзать"],
              editable: [false, true, true, false],
              correctAnswers: {
                cells: [null, "froze", "frozen", null],
              }
            }
          ]
        }
      }
    ]
  },
  grid_table_IrregularVerbs_g_ru: {
    mainDescription: "Irregular Verbs 'G'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Тренируй произношение", ""," и говори уверенно"],
          rows: [
            {
              cells: ["grow - grew - grown", "", "расти"],
              editable: [false, false, false]
            },
            {
              cells: ["гроу - грУ: - гроУн", "", "гроу - грУ: - гроУн"],
              editable: [false, false, false]
            },
            {
              cells: ["get - got - got", "", "получать"],
              editable: [false, false, false]
            },
            {
              cells: ["гет - гат - гат", "", "гет - гот - гот"],
              editable: [false, false, false]
            },
            {
              cells: ["give - gave - given", "", "давать"],
              editable: [false, false, false]
            },
            {
              cells: ["гив - гэйв - гивен", "", "гив - гэйв - гивен"],
              editable: [false, false, false]
            },
            {
              cells: ["go - went - gone", "", "идти"],
              editable: [false, false, false]
            },
            {
              cells: ["гоу - уэнт - гАн", "", "гоу - уэнт - гАн"],
              editable: [false, false, false]
            },
          ]
        }
      },
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Произнеси вслух 3", "","формы и перевод"],
          rows: [
            {
              cells: ["grow - grew - grown", "", ""],
              editable: [false, false, true],
            },
            {
              cells: ["get - got - got", "", ""],
              editable: [false, false, true],
            },
            {
              cells: ["give - gave - given", "", ""],
              editable: [false, false, true],
            },
            {
              cells: ["go - went - gone", "", ""],
              editable: [false, false, true],
            },
            {
              cells: ["have - had - had", "", ""],
              editable: [false, false, true],
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_h_ru: {
    mainDescription: "Irregular Verbs 'H'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Тренируй произношение", ""," и говори уверенно"],
          rows: [

            {
              cells: ["have - had - had", "", "иметь"],
              editable: [false, false, false]
            },
            {
              cells: ["хэв - хэд - хэд", "", "хэв - хэд - хэд"],
              editable: [false, false, false]
            },
            {
              cells: ["hear - heard - heard", "", "слышать"],
              editable: [false, false, false]
            },
            {
              cells: ["хИэр - хЁрд - хЁрд", "", "хИэр - хЁрд - хЁрд"],
              editable: [false, false, false]
            },
            {
              cells: ["hide - hid - hidden", "", "прятать"],
              editable: [false, false, false]
            },
            {
              cells: ["хАЙд - хид - хИдн", "", "хАЙд - хид - хИдн"],
              editable: [false, false, false]
            },
            {
              cells: ["hit - hit - hit", "", "ударять"],
              editable: [false, false, false]
            },
            {
              cells: ["хит - хит - хит", "", ""],
              editable: [false, false, false]
            },

            {
              cells: ["хЁрт - хЁрт - хЁрт", "", "хЁрт - хЁрт - хЁрт"],
              editable: [false, false, false]
            },
            {
              cells: ["hurt - hurt - hurt", "", "причинять боль"],
              editable: [false, false, false]
            },
            {
              cells: ["hold - held - held", "", "держать"],
              editable: [false, false, false]
            },
            {
              cells: ["хОУлд - хЭлд - хЭлд", "", "хОУлд - хЭлд - хЭлд"],
              editable: [false, false, false]
            }
          ]
        }
      },
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Громко произнеси все", "","3 формы и перевод"],
          rows: [
            {
              cells: ["hurt - hurt - hurt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "причинять боль"],
                almostCorrect: {
                  2: ["ранить", "обижать", "повреждать"]
                }
              }
            },
            {
              cells: ["hear - heard - heard", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "слышать"],
                almostCorrect: {
                  2: ["услышать", "слушать", "узнавать"]
                }
              }
            },
            {
              cells: ["hold - held - held", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "держать"],
                almostCorrect: {
                  2: ["удерживать", "проводить", "содержать"]
                }
              }
            },
            {
              cells: ["have - had - had", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "иметь"],
                almostCorrect: {
                  2: ["обладать", "владеть", "испытывать"]
                }
              }
            },
            {
              cells: ["hide - hid - hidden", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "прятать"],
                almostCorrect: {
                  2: ["скрывать", "затаиться", "утаивать"]
                }
              }
            },
            {
              cells: ["hit - hit - hit", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ударять"],
                almostCorrect: {
                  2: ["бить", "попадать", "поражать"]
                }
              }
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_gh_gaps: {
    mainDescription: "Irregular Verbs 'G,H'",
    tasks: [
      {
        taskDescription: "заполни таблицу",
        taskID: "grid_table",
        tableData: {
          headers: ["обычно V1","в прошлом V2","какой V3", "перевод"],
          rows: [
            {
              cells: ["grow","","grown","расти"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null,"grew", null, null],
              }
            },
            {
              cells: ["","got","got","получать"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["get", null, null, null],
              }
            },
            {
              cells: ["give", "gave", "", "давать"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "given", null],
              }
            },
            {
              cells: ["", "went", "gone", "идти"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["go", null, null, null],
              }
            },
            {
              cells: ["have", "had", "", ""],
              editable: [false, false, true, true],
              correctAnswers: {
                cells: [null, null, "had", "иметь"],
                almostCorrect: {
                  3: ["обладать", "владеть"]
                }
              }
            },
            {
              cells: ["hear", "", "heard", ""],
              editable: [false, true, false, true],
              correctAnswers: {
                cells: [null, "heard", null, "слышать"],
                almostCorrect: {
                  3: ["услышать", "слушать"]
                }
              }
            },
            {
              cells: ["hide", "hid", "", ""],
              editable: [false, false, true, true],
              correctAnswers: {
                cells: [null, null, "hidden", "прятать"],
                almostCorrect: {
                  3: ["скрывать", "затаиться"]
                }
              }
            },
            {
              cells: ["hit", "hit", "", "ударять"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "hit", null],
              }
            },
            {
              cells: ["", "hurt", "hurt", "причинять боль"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["hurt", null, null, null],
              }
            },
            {
              cells: ["hold", "", "held", ""],
              editable: [false, true, false, true],
              correctAnswers: {
                cells: [null, "held", null, "держать"],
              }
            }
          ]
        }
      }
    ]
  },
  grid_table_IrregularVerbs_kl_ru: {
    mainDescription: "Irregular Verbs 'K,L'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Читай громко и уверенно", "",""],
          rows: [
            {
              cells: ["keep - kept - kept", "", "хранить"],
              editable: [false, false, false]
            },
            {
              cells: ["ки:п - кэпт - кэпт", "", "ки:п - кэпт - кэпт"],
              editable: [false, false, false]
            },
            {
              cells: ["know - knew - known", "", "знать"],
              editable: [false, false, false]
            },
            {
              cells: ["ноу - ню: - ноун", "", "ноу - ню: - ноун"],
              editable: [false, false, false]
            },
            {
              cells: ["learn - learnt - learnt", "", "учить"],
              editable: [false, false, false]
            },
            {
              cells: ["лёр:н - лёр:нт - лёр:нт", "", "лёр:н - лёр:нт - лёр:нт"],
              editable: [false, false, false]
            },
            {
              cells: ["lead - led - led", "", "вести"],
              editable: [false, false, false]
            },
            {
              cells: ["ли:д - лэд - лэд", "", "ли:д - лэд - лэд"],
              editable: [false, false, false]
            },
            {
              cells: ["leave - left - left", "", "оставлять"],
              editable: [false, false, false]
            },
            {
              cells: ["ли:в - лЭфт - лЭфт", "", "ли:в - лЭфт - лЭфт"],
              editable: [false, false, false]
            },
            {
              cells: ["lend - lent - lent", "", "давать в долг"],
              editable: [false, false, false]
            },
            {
              cells: ["лэнД - лэнТ - лэнТ", "", "лэнД - лэнТ - лэнТ"],
              editable: [false, false, false]
            },
            {
              cells: ["let - let - let", "", "позволять"],
              editable: [false, false, false]
            },
            {
              cells: ["lose - lost - lost", "", "терять"],
              editable: [false, false, false]
            },
            {
              cells: ["лу:з - лост - лост", "", "лу:з - лост - лост"],
              editable: [false, false, false]
            },
            {
              cells: ["lie - lay - lain", "", "лежать"],
              editable: [false, false, false]
            },
            {
              cells: ["лАй - лЭй - лЭйн", "", "лАй - лЭй - лЭйн"],
              editable: [false, false, false]
            },
          ]
        }
      },
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Напиши перевод глагола", "","(что делать?)"],
          rows: [
            {
              cells: ["keep - kept - kept", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "хранить"],
                almostCorrect: {
                  2: ["сохранять", "продолжать", "содержать"]
                }
              }
            },
            {
              cells: ["know - knew - known", "", "букву К перед N"],
              editable: [false, false, false],
              correctAnswers: {
                cells: [null, null, "знать"],
                almostCorrect: {
                  2: ["узнавать", "быть знакомым", "разбираться"]
                }
              }
            },
            {
              cells: ["/ нОу - нЮ - нОУн /", "", "не произносим"],
              editable: [false, false, false],

            },
            {
              cells: ["learn - learnt - learnt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "учить"],
                almostCorrect: {
                  2: ["изучать", "узнавать", "осваивать", "учиться", "научить", "научиться"]
                }
              }
            },
            {
              cells: ["lead - led - led", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "вести"],
                almostCorrect: {
                  2: ["руководить", "возглавлять", "приводить"]
                }
              }
            },
            {
              cells: ["leave - left - left", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "оставлять"],
                almostCorrect: {
                  2: ["покидать", "уходить", "бросать"]
                }
              }
            },
            {
              cells: ["lend - lent - lent", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "давать в долг"],
                almostCorrect: {
                  2: ["давать взаймы", "ссужать", "одалживать", "одолжить"]
                }
              }
            },
            {
              cells: ["let - let - let", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "позволять"],
                almostCorrect: {
                  2: ["разрешать", "давать возможность", "сдавать внаём"]
                }
              }
            },
            {
              cells: ["lose - lost - lost", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "терять"],
                almostCorrect: {
                  2: ["проигрывать", "утрачивать", "лишаться", "потерять", "проиграть"]
                }
              }
            },
            {
              cells: ["lie - lay - lain", "", "лАй - лЭй - лЭйн"],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "лежать"],
                almostCorrect: {
                  2: ["находиться", "простираться", "покоиться"]
                }
              }
            },
            {
              cells: ["tell a lie. Told a lie.  Lied", "", "тоулд э лАй = лАйд"],
              editable: [false, false, false],
              correctAnswers: {
                cells: [null, null, "лгать"],
                almostCorrect: {
                  2: ["обманывать", "говорить неправду", "говорить ложь"]
                }
              }
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_kl_gaps: {
    mainDescription: "Irregular Verbs 'K,L'",
    tasks: [
      {
        taskDescription: "заполни таблицу",
        taskID: "grid_table",
        tableData: {
          headers: ["обычно V1","в прошлом V2","какой V3", "перевод"],
          rows: [
            {
              cells: ["keep","","kept","хранить"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null,"kept", null, null],
              }
            },
            {
              cells: ["know","","known","знать"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null,"knew", null, null],
              }
            },
            {
              cells: ["learn", "learnt", "", "учить"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "learnt", null],
                almostCorrect: {
                  2: ["learned"]
                }
              }
            },
            {
              cells: ["", "led", "led", "вести"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["lead", null, null, null],
              }
            },
            {
              cells: ["leave", "left", "", ""],
              editable: [false, false, true, true],
              correctAnswers: {
                cells: [null, null, "left", "оставлять"],
                almostCorrect: {
                  3: ["покидать", "уходить"]
                }
              }
            },
            {
              cells: ["lend", "", "lent", ""],
              editable: [false, true, false, true],
              correctAnswers: {
                cells: [null, "lent", null, "давать в долг"],
                almostCorrect: {
                  3: ["ссужать", "одалживать", "дать в долг", "одолжить"]
                }
              }
            },
            {
              cells: ["let", "", "", "позволять"],
              editable: [false, true, true, false],
              correctAnswers: {
                cells: [null, "let", "let", null],
              }
            },
            {
              cells: ["", "lost", "lost", "терять"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["lose", null, null, null],
              }
            },
            {
              cells: ["", "lay", "lain", "лежать"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["lie", null, null, null],
              }
            },
            {
              cells: ["", "told a lie", "lied", ""],
              editable: [true, false, false, true],
              correctAnswers: {
                cells: ["tell a lie", null, null, "лгать"],
                almostCorrect: {
                  0: ["lie"],
                  3: ["обманывать", "говорить неправду", "солгать", "сказать неправду", "обмануть"]
                }
              }
            }
          ]
        }
      }
    ]
  },
  grid_table_IrregularVerbs_mpr_ru: {
    mainDescription: "Irregular Verbs 'M,P,R'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Читай уверенно, тренируй", "","произношение и память"],
          rows: [
            {
              cells: ["make - made - made", "", "создавать, делать"],
              editable: [false, false, false]
            },
            {
              cells: ["mean - meant - meant", "", "значить, иметь ввиду"],
              editable: [false, false, false]
            },
            {
              cells: ["мИн - мЭнт - мЭнт", "", "мИн - мЭнт - мЭнт"],
              editable: [false, false, false]
            },
            {
              cells: ["meet - met - met", "", "встречать"],
              editable: [false, false, false]
            },
            {
              cells: ["мИ:т - мЭт - мЭт", "", "мИ:т - мЭт - мЭт"],
              editable: [false, false, false]
            },
            {
              cells: ["pay - paid - paid", "", "платить, заплатить"],
              editable: [false, false, false]
            },
            {
              cells: ["put - put - put", "", "класть"],
              editable: [false, false, false]
            },
            {
              cells: ["пУт - пУт - пУт", "", "пУт - пУт - пУт"],
              editable: [false, false, false]
            },
            {
              cells: ["ри:д - рэд - рэд", "", "ри:д - рэд - рэд"],
              editable: [false, false, false]
            },
            {
              cells: ["read - read - read", "", "читать"],
              editable: [false, false, false]
            },
            {
              cells: ["ride - rode - ridden", "", "ездить верхом"],
              editable: [false, false, false]
            },
            {
              cells: ["райд - роуд - ридн", "", "райд - роуд - ридн"],
              editable: [false, false, false]
            },
            {
              cells: ["ring - rang - rung", "", "звонить"],
              editable: [false, false, false]
            },
            {
              cells: ["рИнг - рЭнг - рАнг", "", "рИнг - рЭнг - рАнг"],
              editable: [false, false, false]
            },
            {
              cells: ["run - ran - run", "", "бежать"],
              editable: [false, false, false]
            },
            {
              cells: ["рАн - рЭн - рАн", "", "рАн - рЭн - рАн"],
              editable: [false, false, false]
            },
            {
              cells: ["rise - rose - risen", "", "подниматься"],
              editable: [false, false, false]
            },
            {
              cells: ["райз - роуз - ризн", "", "райз - роуз - ризн"],
              editable: [false, false, false]
            }
          ]
        }
      },
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Произнеси вслух", "","все формы и перевод"],
          rows: [
            {
              cells: ["make - made - made", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "делать"],
                almostCorrect: {
                  2: ["изготавливать", "создавать", "заставлять"]
                }
              }
            },
            {
              cells: ["mean - meant - meant", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "значить"],
                almostCorrect: {
                  2: ["иметь в виду", "подразумевать", "означать", "обозначать"]
                }
              }
            },
            {
              cells: ["meet - met - met", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "встречать"],
                almostCorrect: {
                  2: ["встретиться", "знакомиться", "удовлетворять","встречаться"]
                }
              }
            },
            {
              cells: ["pay - paid - paid", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "платить"],
                almostCorrect: {
                  2: ["оплачивать", "выплачивать", "окупаться", "оплатить", "расплатиться"]
                }
              }
            },
            {
              cells: ["put - put - put", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "класть"],
                almostCorrect: {
                  2: ["помещать", "ставить", "вкладывать", "ложить", "накладывать", "положить"]
                }
              }
            },
            {
              cells: ["read - read - read", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "читать"],
                almostCorrect: {
                  2: ["прочитывать", "изучать", "воспринимать"]
                }
              }
            },
            {
              cells: ["ride - rode - ridden", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ездить верхом"],
                almostCorrect: {
                  2: ["кататься", "верхом", "передвигаться", "ездить"]
                }
              }
            },
            {
              cells: ["ring - rang - rung", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "звонить"],
                almostCorrect: {
                  2: ["звенеть", "окружать", "созванивать"]
                }
              }
            },
            {
              cells: ["run - ran - run", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "бежать"],
                almostCorrect: {
                  2: ["бегать", "управлять", "протекать"]
                }
              }
            },
            {
              cells: ["rise - rose - risen", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "подниматься"],
                almostCorrect: {
                  2: ["вставать", "возрастать", "восходить"]
                }
              }
            },
          ]
        }
      },

    ]
  },
  grid_table_IrregularVerbs_mpr_gaps: {
    mainDescription: "Irregular Verbs 'M,P,R'",
    tasks: [
      {
        taskDescription: "заполни пропущенные формы",
        taskID: "grid_table",
        tableData: {
          headers: ["V1 (инфинитив)","V2 (прошедшее)","V3 (причастие)", "перевод"],
          rows: [
            {
              cells: ["make","","made","создавать, делать"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null,"made", null, null],
              }
            },
            {
              cells: ["","meant","meant","значить"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["mean", null, null, null],
              }
            },
            {
              cells: ["meet", "met", "", "встречать"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "met", null],
                almostCorrect: {}
              }
            },
            {
              cells: ["pay", "", "paid", "платить"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null, "paid", null, null],
                almostCorrect: {}
              }
            },
            {
              cells: ["put", "put", "put", "класть"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null,  null, "класть",],
                almostCorrect: {
                  3: ["положить", "вставлять", "ложить"]
                }
              }
            },
            {
              cells: ["", "read", "read", "читать"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["read", null, null, null],
              }
            },
            {
              cells: ["ride", "rode", "", "ездить верхом"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "ridden", null],
              }
            },
            {
              cells: ["ring", "", "rung", "звонить"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null, "rang", null, null],
                almostCorrect: {}
              }
            },
            {
              cells: ["run", "ran", "", "бежать"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "run", null],
              }
            },
            {
              cells: ["rise", "", "risen", "подниматься"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null, "rose", null, null],
              }
            }
          ]
        }
      }
    ]
  },
  grid_table_IrregularVerbs_s_part_1_ru: {
    mainDescription: "Irregular Verbs 'S' part 1",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Громко и четко произноси", "","вслух"],
          rows: [
            {
              cells: ["see - saw - seen", "", "видеть (но не смотреть:)"],
              editable: [false, false, false]
            },
            {
              cells: [" си - со - син", "", " си - со - син"],
              editable: [false, false, false]
            },
            {
              cells: ["sell - sold - sold", "", "продавать"],
              editable: [false, false, false]
            },
            {
              cells: ["send - sent - sent", "", "отправлять"],
              editable: [false, false, false]
            },
            {
              cells: ["сэнД - сэнт - сэнт", "", "сэнД - сэнт - сэнт"],
              editable: [false, false, false]
            },
            {
              cells: ["shake - shook - shaken", "", "трясти"],
              editable: [false, false, false]
            },
            {
              cells: ["шэйк - шук - шэйкен", "", "шэйк - шук - шэйкен"],
              editable: [false, false, false]
            },
            {
              cells: ["shoot - shot - shot", "", "стрелять"],
              editable: [false, false, false]
            },
            {
              cells: ["шу:т - шот - шот", "", "шу:т - шот - шот"],
              editable: [false, false, false]
            },
            {
              cells: ["shut - shut - shut", "", "захлопывать,закрывать"],
              editable: [false, false, false]
            },
            {
              cells: ["шАт - шАт - шАт", "", "шАт - шАт - шАт"],
              editable: [false, false, false]
            },
            {
              cells: ["sing - sang - sung", "", "петь"],
              editable: [false, false, false]
            },
            {
              cells: ["синг - сЭнг - сАнг", "", "синг - сЭнг - сАнг"],
              editable: [false, false, false]
            },
            {
              cells: ["sink - sank - sunk", "", "затонуть (о предметах)"],
              editable: [false, false, false]
            },
            {
              cells: ["синк - сЭнк - сАнк", "", "синк - сЭнк - сАнк"],
              editable: [false, false, false]
            },
            {
              cells: ["drown - drowned - drowned", "", "тонуть (о людях)"],
              editable: [false, false, false]
            },
            {
              cells: ["драун - драунд - драунд", "", "драун - драунд - драунд"],
              editable: [false, false, false]
            },
          ]
        }
      },
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Напиши перевод глагола", "","(что делать?)"],
          rows: [
            {
              cells: ["see - saw - seen", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "видеть"],
                almostCorrect: {
                  2: ["увидеть", "смотреть", "понимать"]
                }
              }
            },
            {
              cells: ["sell - sold - sold", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "продавать"],
                almostCorrect: {
                  2: ["реализовывать", "сбывать", "торговать"]
                }
              }
            },
            {
              cells: ["send - sent - sent", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "отправлять"],
                almostCorrect: {
                  2: ["посылать", "пересылать", "направлять"]
                }
              }
            },
            {
              cells: ["shake - shook - shaken", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "трясти"],
                almostCorrect: {
                  2: ["встряхивать", "сотрясать", "пожимать"]
                }
              }
            },
            {
              cells: ["shoot - shot - shot", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "стрелять"],
                almostCorrect: {
                  2: ["застрелить", "снимать", "бросать"]
                }
              }
            },
            {
              cells: ["shut - shut - shut", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "закрывать"],
                almostCorrect: {
                  2: ["затворять", "запирать", "закрыться", "захлопнуть", "захлапывать", "захлопывать","закрыть", ]
                }
              }
            },
            {
              cells: ["sing - sang - sung", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "петь"],
                almostCorrect: {
                  2: ["напевать", "воспевать", "свистеть"]
                }
              }
            },

            {
              cells: ["sink - sank - sunk", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "затонуть"],
                almostCorrect: {
                  2: ["потонуть", "утонуть", "уйти на дно", "тонуть",]
                }
              }
            },
            {
              cells: ["drown - drowned - drowned", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "тонуть"],
                almostCorrect: {
                  2: ["потонуть", "опускаться", "оседать", "утонуть",]
                }
              }
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_s_part_2_ru: {
    mainDescription: "Irregular Verbs 'S part 2'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Громко и четко произноси", "","вслух"],
          rows: [
            {
              cells: ["sit - sat - sat", "", "сидеть"],
              editable: [false, false, false]
            },
            {
              cells: ["сит - сэт - сэт", "", "сит - сэт - сэт"],
              editable: [false, false, false]
            },
            {
              cells: ["sleep - slept - slept", "", "спать"],
              editable: [false, false, false]
            },
            {
              cells: ["сли:п - слэпт - слэпт", "", "сли:п - слэпт - слэпт"],
              editable: [false, false, false]
            },
            {
              cells: ["slide - slid - slid", "", "скользить"],
              editable: [false, false, false]
            },
            {
              cells: ["слайд - слид - слид", "", "слайд - слид - слид"],
              editable: [false, false, false]
            },
            {
              cells: ["spend - spent - spent", "", "тратить"],
              editable: [false, false, false]
            },
            {
              cells: ["спэнД - спэнт - спэнт", "", "спэнД - спэнт - спэнт"],
              editable: [false, false, false]
            },
            {
              cells: ["spit - spat - spat", "", "плевать"],
              editable: [false, false, false]
            },
            {
              cells: ["спит - спЭт - спЭт", "", "спит - спЭт - спЭт"],
              editable: [false, false, false]
            },
            {
              cells: ["stand - stood - stood", "", "стоять"],
              editable: [false, false, false]
            },
            {
              cells: ["стэнд - студ - студ", "", "стэнд - студ - студ"],
              editable: [false, false, false]
            },
            {
              cells: ["steal - stole - stolen", "", "красть"],
              editable: [false, false, false]
            },
            {
              cells: ["сти:л - стоУл - стоУлэн", "", "сти:л - стоУл - стоУлэн"],
              editable: [false, false, false]
            },
          ]
        }
      },
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Напиши перевод глагола", "","(что делать?)"],
          rows: [
            {
              cells: ["sit - sat - sat", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "сидеть"],
                almostCorrect: {
                  2: ["садиться", "восседать", "размещаться"]
                }
              }
            },
            {
              cells: ["sleep - slept - slept", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "спать"],
                almostCorrect: {
                  2: ["засыпать", "ночевать", "дремать"]
                }
              }
            },
            {
              cells: ["slide - slid - slid", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "скользить"],
                almostCorrect: {
                  2: ["съезжать", "плавно двигаться", "проскальзывать"]
                }
              }
            },
            {
              cells: ["spend - spent - spent", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "тратить"],
                almostCorrect: {
                  2: ["проводить", "расходовать", "истощать", "проводить",]
                }
              }
            },
            {
              cells: ["spit - spat - spat", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "плевать"],
                almostCorrect: {
                  2: ["выплевывать", "шипеть", "брызгать", "плеваться", "плюнуть",]
                }
              }
            },
            {
              cells: ["stand - stood - stood", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "стоять"],
                almostCorrect: {
                  2: ["выдерживать", "находиться", "поддерживать"]
                }
              }
            },
            {
              cells: ["steal - stole - stolen", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "красть"],
                almostCorrect: {
                  2: ["воровать", "похищать", "уводить", "украсть",]
                }
              }
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_s_part_3_ru: {
    mainDescription: "Irregular Verbs 'S part 3'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Громко и четко произноси", "","вслух"],
          rows: [
            {
              cells: ["stick - stuck - stuck", "", "застрять"],
              editable: [false, false, false]
            },
            {
              cells: ["стик - стак - стак", "", "стик - стак - стак"],
              editable: [false, false, false]
            },
            {
              cells: ["stink - stank - stunk", "", "вонять"],
              editable: [false, false, false]
            },
            {
              cells: ["стинк - стЭнк - стАнк", "", "стинк - стЭнк - стАнк"],
              editable: [false, false, false]
            },
            {
              cells: ["strike - struck - struck", "", "ударять"],
              editable: [false, false, false]
            },
            {
              cells: ["страйк - страк - страк", "", "страйк - страк - страк"],
              editable: [false, false, false]
            },
            {
              cells: ["swear - swore - sworn", "", "клясться"],
              editable: [false, false, false]
            },
            {
              cells: ["сВЭа - свО: - свОрн", "", "сВЭа - свО: - свОрн"],
              editable: [false, false, false]
            },
            {
              cells: ["sweep - swept - swept", "", "подметать"],
              editable: [false, false, false]
            },
            {
              cells: ["сви:п - свэпт - свэпт", "", "сви:п - свэпт - свэпт"],
              editable: [false, false, false]
            },
            {
              cells: ["swim - swam - swum", "", "плавать"],
              editable: [false, false, false]
            },
            {
              cells: ["свим - свЭм - свАм", "", "свим - свЭм - свАм"],
              editable: [false, false, false]
            },
            {
              cells: ["swing - swung - swung", "", "качаться"],
              editable: [false, false, false]
            },
            {
              cells: ["свинг - свАнг - свАнг", "", "свинг - свАнг - свАнг"],
              editable: [false, false, false]
            },
            {
              cells: ["speak - spoke - spoken", "", "разговаривать"],
              editable: [false, false, false]
            },
            {
              cells: ["спи:к - спОУк - споУкен", "", "спи:к - спОУк - споУкен"],
              editable: [false, false, false]
            }
          ]
        }
      },
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Напиши перевод глагола", "","(что делать?)"],
          rows: [

            {
              cells: ["stick - stuck - stuck", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "застрять"],
                almostCorrect: {
                  2: ["втыкать", "застревать", "прилипать", "приклеивать",]
                }
              }
            },
            {
              cells: ["stink - stank - stunk", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "вонять"],
                almostCorrect: {
                  2: ["смердеть", "пахнуть", "быть неприятным"]
                }
              }
            },
            {
              cells: ["strike - struck - struck", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ударять"],
                almostCorrect: {
                  2: ["бастовать", "поражать", "наносить удар", "выбивать"]
                }
              }
            },
            {
              cells: ["swear - swore - sworn", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "клясться"],
                almostCorrect: {
                  2: ["ругаться", "давать присягу", "божиться", "материться", "клянуться",]
                }
              }
            },
            {
              cells: ["sweep - swept - swept", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "подметать"],
                almostCorrect: {
                  2: ["сметать", "проноситься", "чистить", "мести",]
                }
              }
            },
            {
              cells: ["swim - swam - swum", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "плавать"],
                almostCorrect: {
                  2: ["плыть", "купаться", "скользить по воде"]
                }
              }
            },
            {
              cells: ["swing - swung - swung", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "качаться"],
                almostCorrect: {
                  2: ["размахивать", "вращаться", "меняться"]
                }
              }
            },
            {
              cells: ["speak - spoke - spoken", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "разговаривать"],
                almostCorrect: {
                  2: ["говорить", "выступать", "изъясняться"]
                }
              }
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_s_gaps: {
    mainDescription: "Irregular Verbs 'S'",
    tasks: [
      {
        taskDescription: "заполни пропущенные формы",
        taskID: "grid_table",
        tableData: {
          headers: ["V1 (инфинитив)","V2 (прошедшее)","V3 (причастие)", "перевод"],
          rows: [
            {
              cells: ["say","","said","говорить"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null,"said", null, null],
                almostCorrect: {}
              }
            },
            {
              cells: ["","saw","seen","видеть"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["see", null, null, null],
                almostCorrect: {}
              }
            },
            {
              cells: ["sell", "sold", "", "продавать"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "sold", null],
                almostCorrect: {}
              }
            },
            {
              cells: ["send", "", "sent", "отправлять"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null, "sent", null, null],
                almostCorrect: {}
              }
            },
            {
              cells: ["shake", "shook", "", "трясти"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "shaken", null],
                almostCorrect: {}
              }
            },
            {
              cells: ["", "shot", "shot", "стрелять"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["shoot", null, null, null],
              }
            },
            {
              cells: ["shut", "shut", "", "закрывать, захлопнуть"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "shut", null],
                almostCorrect: {}
              }
            },
            {
              cells: ["sing", "", "sung", "петь"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null, "sang", null, null],
                almostCorrect: {}
              }
            },
            {
              cells: ["sit", "sat", "", "сидеть"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "sat", null],
                almostCorrect: {}
              }
            },
            {
              cells: ["sleep", "", "slept", "спать"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null, "slept", null, null],
                almostCorrect: {}
              }
            },
            {
              cells: ["", "spoke", "spoken", "говорить"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["speak", null, null, null],
              }
            },
            {
              cells: ["spend", "spent", "", "тратить"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "spent", null],
                almostCorrect: {}
              }
            },
            {
              cells: ["stand", "", "stood", "стоять"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null, "stood", null, null],
                almostCorrect: {}
              }
            },
            {
              cells: ["swim", "swam", "", "плавать"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "swum", null],
                almostCorrect: {}
              }
            }
          ]
        }
      }
    ]
  },
  grid_table_IrregularVerbs_t_ru: {
    mainDescription: "Irregular Verbs 'T'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["вслух вслух вслух", "","читай всё вслух"],
          rows: [
            {
              cells: ["tell - told - told", "", "рассказывать"],
              editable: [false, false, false]
            },
            {
              cells: ["тэл - тОУлд - тОУлд", "", "тэл - тОУлд - тОУлд"],
              editable: [false, false, false]
            },
            {
              cells: ["take - took - taken", "", "брать"],
              editable: [false, false, false]
            },
            {
              cells: ["тэйк - тук - тэйкн", "", "тэйк - тук - тэйкн"],
              editable: [false, false, false]
            },
            {
              cells: ["teach - taught - taught", "", "преподавать, обучать"],
              editable: [false, false, false]
            },
            {
              cells: ["тич - тот - тот", "", "тич - тот - тот"],
              editable: [false, false, false]
            },
            {
              cells: ["tear - tore - torn", "", "рвать"],
              editable: [false, false, false]
            },
            {
              cells: ["тЭа - тор - торн", "", "тЭа - тор - торн"],
              editable: [false, false, false]
            },
            {
              cells: ["глухой МЕЖЗУБНЫЙ звук TH", "", "не Финк и не Синк"],
              editable: [false, false, false]
            },
            {
              cells: ["think - thought - thought", "", "думать"],
              editable: [false, false, false]
            },
            {
              cells: ["", "", "th-ынк , th-от , th-от"],
              editable: [false, false, false]
            },
            {
              cells: ["throw - threw - thrown", "", "бросать"],
              editable: [false, false, false]
            },
            {
              cells: ["", "", "th-РОУ , th-РУ , th-РОУН"],
              editable: [false, false, false]
            },
            {
              cells: ["глухой МЕЖЗУБНЫЙ звук TH", "", "не Сроу и не Фроу"],
              editable: [false, false, false]
            },


          ]
        }
      },
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["тренируй произношение ", "","всех форм и перевод"],
          rows: [
            {
              cells: ["tell - told - told", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "рассказывать"],
                almostCorrect: {
                  2: ["говорить", "сообщать", "различать","рассказать"]
                }
              }
            },
            {
              cells: ["take - took - taken", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "брать"],
                almostCorrect: {
                  2: ["взять", "занимать", "требовать"]
                }
              }
            },
            {
              cells: ["teach - taught - taught", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "преподавать"],
                almostCorrect: {
                  2: ["учить", "обучать", "наставлять"]
                }
              }
            },
            {
              cells: ["tear - tore - torn", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "рвать"],
                almostCorrect: {
                  2: ["разрывать", "отрывать", "срывать", "вырывать"]
                }
              }
            },
            {
              cells: ["think - thought - thought", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "думать"],
                almostCorrect: {
                  2: ["полагать", "размышлять", "считать"]
                }
              }
            },
            {
              cells: ["throw - threw - thrown", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "бросать"],
                almostCorrect: {
                  2: ["кидать", "метать", "сбрасывать"]
                }
              }
            },

          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_uw_ru: {
    mainDescription: "Irregular Verbs 'U,W'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["увереннее с произношением,", "","внятно и громко"],
          rows: [
            {
              cells: ["understand - understood", "", "понимать"],
              editable: [false, false, false]
            },
            {
              cells: ["андэстЭнд - андэстУд ", "", "андэстЭнд - андэстУд"],
              editable: [false, false, false]
            },
            {
              cells: ["wake up - woke up - woken up", "", "просыпаться"],
              editable: [false, false, false]
            },
            {
              cells: ["вЭйк ап - вОУк ап - вОУкэн", "", "уэйк - уоук - уокэн"],
              editable: [false, false, false]
            },

            {
              cells: ["wear - wore - worn", "", "носить"],
              editable: [false, false, false]
            },
            {
              cells: ["вЭа - во - ворн", "", "вЭа - во - ворн"],
              editable: [false, false, false]
            },
            {
              cells: ["write - wrote - written", "", "писать"],
              editable: [false, false, false]
            },
            {
              cells: ["райт - роУт - ритн", "", "райт - роУт - ритн"],
              editable: [false, false, false]
            },
            {
              cells: ["weep - wept - wept", "", "хныкать, ныть"],
              editable: [false, false, false]
            },
            {
              cells: ["уи:п - уЭпт - уЭпт", "", "уи:п - уЭпт - уЭпт"],
              editable: [false, false, false]
            },
            {
              cells: ["win - won - won", "", "побеждать"],
              editable: [false, false, false]
            },
            {
              cells: ["уин - уАн - уАн", "", "вин - вАн - вАн"],
              editable: [false, false, false]
            }
          ]
        }
      },{
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["тренируй произношение ", "","всех форм и перевод"],
          rows: [
                        // Глаголы на U
            {
              cells: ["understand - understood - understood", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "понимать"],
                almostCorrect: {
                  2: ["осознавать", "разбираться", "уяснять", "понять"]
                }
              }
            },

            // Глаголы на W
            {
              cells: ["wake up - woke up - woken up", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "просыпаться"],
                almostCorrect: {
                  2: ["будить", "пробуждаться", "вставать"]
                }
              }
            },
            {
              cells: ["wear - wore - worn", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "носить"],
                almostCorrect: {
                  2: ["одевать", "изнашивать", "иметь на себе", "надевать", "надеть"]
                }
              }
            },
            {
              cells: ["write - wrote - written", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "писать"],
                almostCorrect: {
                  2: ["записывать", "сочинять", "выводить", "написать"]
                }
              }
            },
            {
              cells: ["weep - wept - wept", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "хныкать"],
                almostCorrect: {
                  2: ["рыдать", "всхлипывать", "скорбеть", "плакать", "ныть"]
                }
              }
            },
            {
              cells: ["win - won - won", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "побеждать"],
                almostCorrect: {
                  2: ["выигрывать", "одерживать победу", "завоёвывать"]
                }
              }
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_tuw_gaps: {
    mainDescription: "Irregular Verbs 'T,U,W'",
    tasks: [
      {
        taskDescription: "заполни пропущенные формы или перевод",
        taskID: "grid_table",
        tableData: {
          headers: ["V1 (инфинитив)","V2 (прошедшее)","V3 (причастие)", "перевод"],
          rows: [
            // Глаголы на T
            {
              cells: ["tell","told","","рассказывать"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "told", null],
                almostCorrect: {}
              }
            },
            {
              cells: ["take","","taken",""],
              editable: [false, true, false, true],
              correctAnswers: {
                cells: [null, "took", null, "брать"],
                almostCorrect: {
                  3: ["взять", "занимать"]
                }
              }
            },
            {
              cells: ["","taught","taught","преподавать"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["teach", null, null, null],
                almostCorrect: {}
              }
            },
            {
              cells: ["tear","tore","",""],
              editable: [false, false, true, true],
              correctAnswers: {
                cells: [null, null, "torn", "рвать"],
                almostCorrect: {
                  3: ["разрывать", "отрывать"]
                }
              }
            },
            {
              cells: ["think","","","думать"],
              editable: [false, true, true, false],
              correctAnswers: {
                cells: [null, "thought", "thought", null],
              }
            },
            {
              cells: ["throw","thrown","","бросать"],
              editable: [false, false, true, false],
              correctAnswers: {
                cells: [null, null, "thrown", null],
              }
            },

            // Глагол на U
            {
              cells: ["understand","","understood","понимать"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null, "understood", null, null],
              }
            },

            // Глаголы на W
            {
              cells: ["wake up","","woken up","просыпаться"],
              editable: [false, true, false, false],
              correctAnswers: {
                cells: [null, "woke up", null, null],
              }
            },
            {
              cells: ["wear","wore","",""],
              editable: [false, false, true, true],
              correctAnswers: {
                cells: [null, null, "worn", "носить"],
                almostCorrect: {
                  3: ["одевать", "надевать"]
                }
              }
            },
            {
              cells: ["","wrote","written","писать"],
              editable: [true, false, false, false],
              correctAnswers: {
                cells: ["write", null, null, null],
              }
            },
            {
              cells: ["","wept","wept",""],
              editable: [true, false, false, true],
              correctAnswers: {
                cells: ["weep", null, null, "плакать"],
                almostCorrect: {
                  3: ["рыдать", "всхлипывать", "хныкать"]
                }
              }
            },
            {
              cells: ["win","won","",""],
              editable: [false, false, true, true],
              correctAnswers: {
                cells: [null, null, "won", "побеждать"],
                almostCorrect: {
                  3: ["выигрывать", "одержать победу", "победить", "выйграть", "выиграть"]
                }
              }
            }
          ]
        }
      }
    ]
  },
  grid_table_IrregularVerbs_last_ru: {
    mainDescription: "Irregular Verbs '?'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Напиши перевод глагола", "","(что делать?)"],
          rows: [
            // Глаголы с приставками
            {
              cells: ["misunderstand - misunderstood", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "неправильно понять"],
                almostCorrect: {
                  2: ["неверно истолковать", "ошибаться", "недопонять", "неправильно понимать"]
                }
              }
            },
            {
              cells: ["misspell - misspelt - misspelt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "неправильно написать"],
                almostCorrect: {
                  2: ["искажать написание", "делать орф. ошибки", "писать с ошибками", "неправильно писать"]
                }
              }
            },
            {
              cells: ["mistake - mistook - mistaken", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ошибаться"],
                almostCorrect: {
                  2: ["перепутать", "неправильно понять", "принять за другое", "ошибиться", "сделать ошибку", "совершить ошибку"]
                }
              }
            },
            {
              cells: ["mishear - misheard - misheard", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ослышаться"],
                almostCorrect: {
                  2: ["неправильно услышать", "перепутать на слух"]
                }
              }
            },
            {
              cells: ["oversleep - overslept - overslept", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "проспать"],
                almostCorrect: {
                  2: ["проснуться слишком поздно", "заспаться", "переспать"]
                }
              }
            },
            {
              cells: ["overeat - overate - overeaten", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "переедать"],
                almostCorrect: {
                  2: ["объедаться", "есть слишком много", "переесть"]
                }
              }
            },
            {
              cells: ["overpay - overpaid - overpaid", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "переплачивать"],
                almostCorrect: {
                  2: ["платить слишком много", "оплачивать сверх меры","переплатить"]
                }
              }
            },
            //остальные случаи can shall may will bleed
            {
              cells: ["can ------ could ----- could", "", "могу, мог"],
              editable: [false, false, false],
            },
            {
              cells: ["shall ---- should ---- should", "", "следует, следовало"],
              editable: [false, false, false],
            },
            {
              cells: ["may ------ might ----- might", "", "можно, вероятно"],
              editable: [false, false, false],
            },
            {
              cells: ["will ------ would ----- would", "", "глагол невидимка"],
              editable: [false, false, false],
            },
            {
              cells: ["bleed ----- bled ----- bled", "", "кровоточить"],
              editable: [false, false, false],
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_X4_ru: {
    mainDescription: "Irregular Verbs '?'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Напиши перевод глагола", "","(что делать?)"],
          rows: [
            {
              cells: ["break - broke - broken","","ломать"],
              editable: [false, false, false]
            },
          ]
        }
      },
    ]
  },
  grid_table_IrregularVerbs_all_ru: {
    mainDescription: "Irregular Verbs 'All'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Напиши перевод глагола", "", "(что делать?)"],
          rows: [
            {
              cells: ["break - broke - broken","","ломать"],
              editable: [false, false, false]
            },
            {
              cells: ["be - was/were - been", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "быть"],
                almostCorrect: {
                  2: ["являться", "находиться", "существовать"]
                }
              }
            },
            {
              cells: ["beat - beat - beaten", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "бить"],
                almostCorrect: {
                  2: ["побить", "побеждать", "избивать", "победить","избить"]
                }
              }
            },
            {
              cells: ["become - became - become", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "становиться"],
                almostCorrect: {
                  2: ["превращаться", "оказываться", "сделаться", "стать"]
                }
              }
            },
            {
              cells: ["begin - began - begun", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "начинать"],
                almostCorrect: {
                  2: ["начать", "приступать", "запускать"]
                }
              }
            },
            {
              cells: ["build - built - built", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "строить"],
                almostCorrect: {
                  2: ["построить", "создавать", "возводить"]
                }
              }
            },
            {
              cells: ["bite - bit - bit", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "кусать"],
                almostCorrect: {
                  2: ["покусать", "укусить", "откусить","прикусить"]
                }
              }
            },
            {
              cells: ["blow - blew - blown", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "дуть"],
                almostCorrect: {
                  2: ["сдуть", "задувать", "развевать", "взрывать"]
                }
              }
            },
            {
              cells: ["bring - brought - brought", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "приносить"],
                almostCorrect: {
                  2: ["привести", "доставлять", "привозить"]
                }
              }
            },
            {
              cells: ["burn - burnt - burnt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "гореть"],
                almostCorrect: {
                  2: ["жечь", "обжигать", "сжигать"]
                }
              }
            },
            {
              cells: ["buy - bought - bought", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "покупать"],
                almostCorrect: {
                  2: ["купить", "приобретать", "закупать"]
                }
              }
            },
            {
              cells: ["come - came - come", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "приходить"],
                almostCorrect: {
                  2: ["прийти", "подходить", "наступать"]
                }
              }
            },
            {
              cells: ["choose - chose - chosen", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "выбирать"],
                almostCorrect: {
                  2: ["выбрать", "избирать", "предпочитать"]
                }
              }
            },
            {
              cells: ["catch - caught - caught", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ловить"],
                almostCorrect: {
                  2: ["поймать", "схватить", "перехватить"]
                }
              }
            },
            {
              cells: ["creep - crept - crept", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ползать"],
                almostCorrect: {
                  2: ["красться", "пресмыкаться", "медленно двигаться"]
                }
              }
            },
            {
              cells: ["cost - cost - cost", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "стоить"],
                almostCorrect: {
                  2: ["обходиться", "оцениваться", "иметь цену"]
                }
              }
            },
            {
              cells: ["cut - cut - cut", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "резать"],
                almostCorrect: {
                  2: ["разрезать", "отрезать", "порезать"]
                }
              }
            },
            {
              cells: ["deal - dealt - dealt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "иметь дело"],
                almostCorrect: {
                  2: ["раздавать", "иметь дела", "договариваться"]
                }
              }
            },
            {
              cells: ["dig - dug - dug", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "копать"],
                almostCorrect: {
                  2: ["выкопать", "рыть", "закапывать"]
                }
              }
            },
            {
              cells: ["do - did - done", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "делать"],
                almostCorrect: {
                  2: ["совершать", "выполнять", "изготавливать", "сделать"]
                }
              }
            },
            {
              cells: ["drive - drove - driven", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "водить"],
                almostCorrect: {
                  2: ["ехать", "управлять", "гнать"]
                }
              }
            },
            {
              cells: ["draw - drew - drawn", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "рисовать"],
                almostCorrect: {
                  2: ["чертить", "тащить", "извлекать"]
                }
              }
            },
            {
              cells: ["drink - drank - drunk", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "пить"],
                almostCorrect: {
                  2: ["выпивать", "поглощать", "употреблять","выпить"]
                }
              }
            },
            {
              cells: ["eat - ate - eaten", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "есть"],
                almostCorrect: {
                  2: ["кушать", "поедать", "съедать"]
                }
              }
            },
            {
              cells: ["fall - fell - fallen", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "падать"],
                almostCorrect: {
                  2: ["упасть", "понижаться", "снижаться"]
                }
              }
            },
            {
              cells: ["feed - fed - fed", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "кормить"],
                almostCorrect: {
                  2: ["прокормить", "питать", "давать корм"]
                }
              }
            },
            {
              cells: ["feel - felt - felt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "чувствовать"],
                almostCorrect: {
                  2: ["ощущать", "испытывать", "трогать"]
                }
              }
            },
            {
              cells: ["fight - fought - fought", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "сражаться"],
                almostCorrect: {
                  2: ["бороться", "драться", "воевать", "спорить"]
                }
              }
            },
            {
              cells: ["find - found - found", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "находить"],
                almostCorrect: {
                  2: ["обнаруживать", "отыскать", "выяснять", "искать"]
                }
              }
            },
            {
              cells: ["fly - flew - flown", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "летать"],
                almostCorrect: {
                  2: ["лететь", "парить", "пилотировать"]
                }
              }
            },
            {
              cells: ["forbid - forbade - forbidden", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "запрещать"],
                almostCorrect: {
                  2: ["воспрещать", "не разрешать"]
                }
              }
            },
            {
              cells: ["forget - forgot - forgotten", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "забывать"],
                almostCorrect: {
                  2: ["забыть", "упускать из виду"]
                }
              }
            },
            {
              cells: ["forgive - forgave - forgiven", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "прощать"],
                almostCorrect: {
                  2: ["извинять", "отпускать грехи"]
                }
              }
            },
            {
              cells: ["freeze - froze - frozen", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "замерзать"],
                almostCorrect: {
                  2: ["замораживать", "леденеть", "останавливаться", "не двигаться"]
                }
              }
            },
            {
              cells: ["grow - grew - grown", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "расти"],
                almostCorrect: {
                  2: ["вырастать", "выращивать", "увеличиваться"]
                }
              }
            },
            {
              cells: ["get - got - got", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "получать"],
                almostCorrect: {
                  2: ["добывать", "приобретать", "доставать"]
                }
              }
            },
            {
              cells: ["give - gave - given", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "давать"],
                almostCorrect: {
                  2: ["подавать", "вручать", "жертвовать"]
                }
              }
            },
            {
              cells: ["go - went - gone", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "идти"],
                almostCorrect: {
                  2: ["ходить", "ехать", "отправляться"]
                }
              }
            },
            {
              cells: ["have - had - had", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "иметь"],
                almostCorrect: {
                  2: ["обладать", "владеть", "испытывать"]
                }
              }
            },
            {
              cells: ["hear - heard - heard", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "слышать"],
                almostCorrect: {
                  2: ["услышать", "слушать", "узнавать"]
                }
              }
            },
            {
              cells: ["hide - hid - hidden", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "прятать"],
                almostCorrect: {
                  2: ["скрывать", "затаиться", "утаивать"]
                }
              }
            },
            {
              cells: ["hit - hit - hit", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ударять"],
                almostCorrect: {
                  2: ["бить", "попадать", "поражать"]
                }
              }
            },
            {
              cells: ["hurt - hurt - hurt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "причинять боль"],
                almostCorrect: {
                  2: ["ранить", "обижать", "повреждать"]
                }
              }
            },
            {
              cells: ["hold - held - held", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "держать"],
                almostCorrect: {
                  2: ["удерживать", "проводить", "содержать"]
                }
              }
            },
            {
              cells: ["keep - kept - kept", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "хранить"],
                almostCorrect: {
                  2: ["сохранять", "продолжать", "содержать"]
                }
              }
            },
            {
              cells: ["know - knew - known", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "знать"],
                almostCorrect: {
                  2: ["узнавать", "быть знакомым", "разбираться"]
                }
              }
            },
            {
              cells: ["learn - learnt - learnt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "учить"],
                almostCorrect: {
                  2: ["изучать", "узнавать", "осваивать", "учиться", "научить", "научиться"]
                }
              }
            },
            {
              cells: ["lead - led - led", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "вести"],
                almostCorrect: {
                  2: ["руководить", "возглавлять", "приводить"]
                }
              }
            },
            {
              cells: ["leave - left - left", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "оставлять"],
                almostCorrect: {
                  2: ["покидать", "уходить", "бросать"]
                }
              }
            },
            {
              cells: ["lend - lent - lent", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "давать в долг"],
                almostCorrect: {
                  2: ["давать взаймы", "ссужать", "одалживать", "одолжить"]
                }
              }
            },
            {
              cells: ["let - let - let", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "позволять"],
                almostCorrect: {
                  2: ["разрешать", "давать возможность", "сдавать внаём"]
                }
              }
            },
            {
              cells: ["lose - lost - lost", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "терять"],
                almostCorrect: {
                  2: ["проигрывать", "утрачивать", "лишаться", "потерять", "проиграть"]
                }
              }
            },
            {
              cells: ["lie - lay - lain", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "лежать"],
                almostCorrect: {
                  2: ["находиться", "простираться", "покоиться"]
                }
              }
            },
            {
              cells: ["tell a lie - told a lie = lied", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "лгать"],
                almostCorrect: {
                  2: ["обманывать", "говорить неправду", "говорить ложь"]
                }
              }
            },
            {
              cells: ["make - made - made", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "делать"],
                almostCorrect: {
                  2: ["изготавливать", "создавать", "заставлять"]
                }
              }
            },
            {
              cells: ["mean - meant - meant", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "значить"],
                almostCorrect: {
                  2: ["иметь в виду", "подразумевать", "означать", "обозначать"]
                }
              }
            },
            {
              cells: ["meet - met - met", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "встречать"],
                almostCorrect: {
                  2: ["встретиться", "знакомиться", "удовлетворять","встречаться"]
                }
              }
            },
            {
              cells: ["pay - paid - paid", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "платить"],
                almostCorrect: {
                  2: ["оплачивать", "выплачивать", "окупаться", "оплатить", "расплатиться"]
                }
              }
            },
            {
              cells: ["put - put - put", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "класть"],
                almostCorrect: {
                  2: ["помещать", "ставить", "вкладывать", "ложить", "накладывать", "положить"]
                }
              }
            },
            {
              cells: ["read - read - read", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "читать"],
                almostCorrect: {
                  2: ["прочитывать", "изучать", "воспринимать"]
                }
              }
            },
            {
              cells: ["ride - rode - ridden", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ездить верхом"],
                almostCorrect: {
                  2: ["кататься", "верхом", "передвигаться", "ездить"]
                }
              }
            },
            {
              cells: ["ring - rang - rung", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "звонить"],
                almostCorrect: {
                  2: ["звенеть", "окружать", "созванивать"]
                }
              }
            },
            {
              cells: ["run - ran - run", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "бежать"],
                almostCorrect: {
                  2: ["бегать", "управлять", "протекать"]
                }
              }
            },
            {
              cells: ["rise - rose - risen", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "подниматься"],
                almostCorrect: {
                  2: ["вставать", "возрастать", "восходить"]
                }
              }
            },
            {
              cells: ["see - saw - seen", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "видеть"],
                almostCorrect: {
                  2: ["увидеть", "смотреть", "понимать"]
                }
              }
            },
            {
              cells: ["sell - sold - sold", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "продавать"],
                almostCorrect: {
                  2: ["реализовывать", "сбывать", "торговать"]
                }
              }
            },
            {
              cells: ["send - sent - sent", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "отправлять"],
                almostCorrect: {
                  2: ["посылать", "пересылать", "направлять"]
                }
              }
            },
            {
              cells: ["shake - shook - shaken", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "трясти"],
                almostCorrect: {
                  2: ["встряхивать", "сотрясать", "пожимать"]
                }
              }
            },
            {
              cells: ["shoot - shot - shot", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "стрелять"],
                almostCorrect: {
                  2: ["застрелить", "снимать", "бросать"]
                }
              }
            },
            {
              cells: ["shut - shut - shut", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "закрывать"],
                almostCorrect: {
                  2: ["затворять", "запирать", "закрыться"]
                }
              }
            },
            {
              cells: ["sing - sang - sung", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "петь"],
                almostCorrect: {
                  2: ["напевать", "воспевать", "свистеть"]
                }
              }
            },
            {
              cells: ["sit - sat - sat", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "сидеть"],
                almostCorrect: {
                  2: ["садиться", "восседать", "размещаться"]
                }
              }
            },
            {
              cells: ["sink - sank - sunk", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "затонуть"],
                almostCorrect: {
                  2: ["потонуть", "утонуть", "уйти на дно", "тонуть",]
                }
              }
            },
            {
              cells: ["drown - drowned - drowned", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "тонуть"],
                almostCorrect: {
                  2: ["потонуть", "опускаться", "оседать", "утонуть",]
                }
              }
            },
            {
              cells: ["sleep - slept - slept", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "спать"],
                almostCorrect: {
                  2: ["засыпать", "ночевать", "дремать"]
                }
              }
            },
            {
              cells: ["slide - slid - slid", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "скользить"],
                almostCorrect: {
                  2: ["съезжать", "плавно двигаться", "проскальзывать"]
                }
              }
            },
            {
              cells: ["spend - spent - spent", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "тратить"],
                almostCorrect: {
                  2: ["проводить", "расходовать", "истощать", "проводить",]
                }
              }
            },
            {
              cells: ["spit - spat - spat", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "плевать"],
                almostCorrect: {
                  2: ["выплевывать", "шипеть", "брызгать", "плеваться", "плюнуть",]
                }
              }
            },
            {
              cells: ["stand - stood - stood", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "стоять"],
                almostCorrect: {
                  2: ["выдерживать", "находиться", "поддерживать"]
                }
              }
            },
            {
              cells: ["steal - stole - stolen", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "красть"],
                almostCorrect: {
                  2: ["воровать", "похищать", "уводить", "украсть",]
                }
              }
            },
            {
              cells: ["stick - stuck - stuck", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "застрять"],
                almostCorrect: {
                  2: ["втыкать", "застревать", "прилипать", "приклеивать",]
                }
              }
            },
            {
              cells: ["stink - stank - stunk", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "вонять"],
                almostCorrect: {
                  2: ["смердеть", "пахнуть", "быть неприятным"]
                }
              }
            },
            {
              cells: ["strike - struck - struck", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ударять"],
                almostCorrect: {
                  2: ["бастовать", "поражать", "наносить удар", "выбивать"]
                }
              }
            },
            {
              cells: ["swear - swore - sworn", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "клясться"],
                almostCorrect: {
                  2: ["ругаться", "давать присягу", "божиться", "материться", "клянуться",]
                }
              }
            },
            {
              cells: ["sweep - swept - swept", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "подметать"],
                almostCorrect: {
                  2: ["сметать", "проноситься", "чистить", "мести",]
                }
              }
            },
            {
              cells: ["swim - swam - swum", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "плавать"],
                almostCorrect: {
                  2: ["плыть", "купаться", "скользить по воде"]
                }
              }
            },
            {
              cells: ["swing - swung - swung", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "качаться"],
                almostCorrect: {
                  2: ["размахивать", "вращаться", "меняться"]
                }
              }
            },
            {
              cells: ["speak - spoke - spoken", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "разговаривать"],
                almostCorrect: {
                  2: ["говорить", "выступать", "изъясняться"]
                }
              }
            },
            // Глаголы на T
            {
              cells: ["tell - told - told", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "рассказывать"],
                almostCorrect: {
                  2: ["говорить", "сообщать", "различать","рассказать"]
                }
              }
            },
            {
              cells: ["take - took - taken", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "брать"],
                almostCorrect: {
                  2: ["взять", "занимать", "требовать"]
                }
              }
            },
            {
              cells: ["teach - taught - taught", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "преподавать"],
                almostCorrect: {
                  2: ["учить", "обучать", "наставлять"]
                }
              }
            },
            {
              cells: ["tear - tore - torn", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "рвать"],
                almostCorrect: {
                  2: ["разрывать", "отрывать", "срывать", "вырывать"]
                }
              }
            },
            {
              cells: ["think - thought - thought", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "думать"],
                almostCorrect: {
                  2: ["полагать", "размышлять", "считать"]
                }
              }
            },
            {
              cells: ["throw - threw - thrown", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "бросать"],
                almostCorrect: {
                  2: ["кидать", "метать", "сбрасывать"]
                }
              }
            },

            // Глаголы на U
            {
              cells: ["understand - understood - understood", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "понимать"],
                almostCorrect: {
                  2: ["осознавать", "разбираться", "уяснять", "понять"]
                }
              }
            },

            // Глаголы на W
            {
              cells: ["wake up - woke up - woken up", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "просыпаться"],
                almostCorrect: {
                  2: ["будить", "пробуждаться", "вставать"]
                }
              }
            },
            {
              cells: ["wear - wore - worn", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "носить"],
                almostCorrect: {
                  2: ["одевать", "изнашивать", "иметь на себе", "надевать", "надеть"]
                }
              }
            },
            {
              cells: ["write - wrote - written", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "писать"],
                almostCorrect: {
                  2: ["записывать", "сочинять", "выводить", "написать"]
                }
              }
            },
            {
              cells: ["weep - wept - wept", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "хныкать"],
                almostCorrect: {
                  2: ["рыдать", "всхлипывать", "скорбеть", "плакать", "ныть"]
                }
              }
            },
            {
              cells: ["win - won - won", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "побеждать"],
                almostCorrect: {
                  2: ["выигрывать", "одерживать победу", "завоёвывать"]
                }
              }
            },

            // Глаголы с приставками
            {
              cells: ["misunderstand - misunderstood - misunderstood", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "неправильно понять"],
                almostCorrect: {
                  2: ["неверно истолковать", "ошибаться", "недопонять", "неправильно понимать"]
                }
              }
            },
            {
              cells: ["misspell - misspelt - misspelt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "неправильно написать"],
                almostCorrect: {
                  2: ["искажать написание", "делать орф. ошибки", "писать с ошибками", "неправильно писать"]
                }
              }
            },
            {
              cells: ["mistake - mistook - mistaken", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ошибаться"],
                almostCorrect: {
                  2: ["перепутать", "неправильно понять", "принять за другое", "ошибиться", "сделать ошибку", "совершить ошибку"]
                }
              }
            },
            {
              cells: ["mishear - misheard - misheard", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "ослышаться"],
                almostCorrect: {
                  2: ["неправильно услышать", "перепутать на слух"]
                }
              }
            },
            {
              cells: ["oversleep - overslept - overslept", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "проспать"],
                almostCorrect: {
                  2: ["проснуться слишком поздно", "заспаться", "переспать"]
                }
              }
            },
            {
              cells: ["overeat - overate - overeaten", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "переедать"],
                almostCorrect: {
                  2: ["объедаться", "есть слишком много", "переесть"]
                }
              }
            },
            {
              cells: ["overpay - overpaid - overpaid", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "переплачивать"],
                almostCorrect: {
                  2: ["платить слишком много", "оплачивать сверх меры","переплатить"]
                }
              }
            },
            //остальные случаи can shall may will bleed
            {
              cells: ["can - could - - -", "", "могу, мог"],
              editable: [false, false, false],
            },
            {
              cells: ["shall - should - - -", "", "следует, следовало"],
              editable: [false, false, false],
            },
            {
              cells: ["may - might - might", "", "можно, вероятно"],
              editable: [false, false, false],
            },
            {
              cells: ["will - would - - -", "", "глагол невидимка"],
              editable: [false, false, false],
            },
            {
              cells: ["bleed - bled - bled", "", "кровоточить"],
              editable: [false, false, false],
            },

          ]
        }
      }
    ]
  },
  grid_table_IV_c: {
    mainDescription: "Irregular Verbs 'B'",
    tasks: [
      {
        taskDescription: null,
        taskID: "grid_table",
        tableData: {
          headers: ["Напиши перевод глагола", "","(что делать?)"],
          rows: [
            {
              cells: ["break - broke - broken","","ломать"],
              editable: [false, false, false]
            },
            {
              cells: ["be - was/were - been", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "быть"],
                almostCorrect: {
                  2: ["являться", "находиться", "существовать"]
                }
              }
            },
            {
              cells: ["beat - beat - beaten", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "бить"],
                almostCorrect: {
                  2: ["побить", "побеждать", "избивать", "победить","избить"]
                }
              }
            },
            {
              cells: ["become - became - become", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "становиться"],
                almostCorrect: {
                  2: ["превращаться", "оказываться", "сделаться", "стать"]
                }
              }
            },
            {
              cells: ["begin - began - begun", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "начинать"],
                almostCorrect: {
                  2: ["начать", "приступать", "запускать"]
                }
              }
            },
            {
              cells: ["build - built - built", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "строить"],
                almostCorrect: {
                  2: ["построить", "создавать", "возводить"]
                }
              }
            },
            {
              cells: ["bite - bit - bit", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "кусать"],
                almostCorrect: {
                  2: ["покусать", "укусить", "откусить","прикусить"]
                }
              }
            },
            {
              cells: ["blow - blew - blown", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "дуть"],
                almostCorrect: {
                  2: ["сдуть", "задувать", "развевать", "взрывать"]
                }
              }
            },
            {
              cells: ["bring - brought - brought", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "приносить"],
                almostCorrect: {
                  2: ["привести", "доставлять", "привозить"]
                }
              }
            },
            {
              cells: ["burn - burnt - burnt", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "гореть"],
                almostCorrect: {
                  2: ["жечь", "обжигать", "сжигать"]
                }
              }
            },
            {
              cells: ["buy - bought - bought", "", ""],
              editable: [false, false, true],
              correctAnswers: {
                cells: [null, null, "покупать"],
                almostCorrect: {
                  2: ["купить", "приобретать", "закупать"]
                }
              }
            }
          ]
        }
      },
      {
        taskDescription: "заполни таблицу",
        taskID: "grid_table",
        tableData: {
          headers: ["настоящее","прошлое","причастия", "перевод"],
          rows: [
            {
              cells: ["burn","","burnt/burned","гореть"],
              editable: [false, true, false,false],
              correctAnswers: {
                cells: [null,"burnt", null, null],
                almostCorrect: {
                  1: ["burned"]
                }
              }
            },
            {
              cells: ["","was/were","been","быть,являться"],
              editable: [true, false, false, false,],
              correctAnswers: {
                cells: ["be", null, null, null],
                almostCorrect: {
                  0: ["to be"]
                }
              }
            },
          ]
        }
      },
    ]
  },
  grid_table_AV_all: {
    mainDescription: "Заполните таблицу недостающими данными",
    tasks: [
      {
        taskDescription: "Заполните пропуски в таблице",
        taskID: "grid_table",
        tableData: {
          headers: ["Время Grammar", "Пример"],
          rows: [
            {
              cells: ["To be", "am, is, are"],
              editable: [false, false, false, false]
            },
            {
              cells: ["Present Simple", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Does Do", ],
                almostCorrect: {
                  1: ["Do does","does and do","does & do", "do & does", "do and does"], // Индекс поля (начиная с 0)
                }
              }
            },
            {
              cells: ["", "did"],
              editable: [true, false],
              correctAnswers: {
                cells: ["Past Simple",null ],
                almostCorrect: {
                  0: ["simple past"] // Индекс поля (начиная с 0)
                }
              }
            },
            {
              cells: ["Name", "?"],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "anyIsOk" ],
                }

            }
          ]
        }
      },
    ]
  },
  grid_table_agentAntony: {
    mainDescription: "Antony is awesome!",
    tasks: [
      {
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,

        taskDescription: "Заполни пропуски в таблице:",
        taskID: "grid_table",
        tableData: {
          headers: ["Russian", "English"],
          rows: [
            {
              cells: ["Марвэл - моя собака", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Marvel is my dog",],
                almostCorrect: {
                  1: ["Marvel's my dog"]
                }
              }
            },
            {
              cells: ["Марвэл любит Сырника!", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Marvel likes Cheesecake.",],
                almostCorrect: {
                  1: ["Marvel loves Cheesecake","Marvel likes Cheesecakes","Marvel loves Cheesecakes"]
                }

              }
            },
            {
              cells: ["", "He doesn't like milk."],
              editable: [true, false],
              correctAnswers: {
                cells: ["Он не любит молоко",null, ],
                almostCorrect: {
                  1: ["Ему не нравится молоко",]
                }

              }
            },
            {
              cells: ["", "He loves to run."],
              editable: [true, false],
              correctAnswers: {
                cells: ["Он любит бегать",null, ],
                almostCorrect: {
                  1: ["Ему нравится бегать",]
                }

              }
            },
            {
              cells: ["Кто любит Марвела?", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Who loves Marvel?",],
                almostCorrect: {
                  1: ["Who likes Marvel?"]
                }

              }
            },
            {
              cells: ["Кого Марвел любит?", ""],
              editable: [false, true],
              correctAnswers: {
                cells: [null, "Who does Marvel love?",],
                almostCorrect: {
                  1: ["Who does Marvel like?"]
                }
              }
            },
          ]
        },
      },
      {
        usefulWords: "let me - позвольте мне, share with you - поделиться с вами, a few words - несколько слов",
        taskDescription: "Drop down",
        audio: null,
        taskID: "drop_down_text",
        textScript: 'выбирай правильный ответ',
        questions: [
          {
            text: "Hello friends! Let me share with you a few words about myself, I (do, does, are, am*, is) a secret agent Antony. I always sit (under, behind, on*, near) my chair and work at my computer. I (haven't, don't have*, hasn't) a cat. But I (do, have*, has) a fantastic dog! (Her, His*) name is Marvel, not DC. My dog (have, has*, doesn't have*, hasn't, do) problems. I can talk about my dog endlessly, but I (haven't, don't have*, doesn't have) much time, so I am going to finish talking about my dog now. And let me (say, telk, tell*) you about new cool stories bout my baby (Cupcake*, Cheesecake*, Muffin*) ",
          },


        ]
      },
      {
        usefulWords: null,
        taskDescription: null,
        audio: null,
        taskID: "student_input",
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        textScript: null,
        questions: [
          {
            text: "Позвольте мне ____",
            correctAnswer: "Let me",
          },
          {
            text: "поделиться с вами ____",
            correctAnswer: "share with you",
          },
          {
            text: "несколькими словами про моего сына____",
            correctAnswer: "a few words about my son",
            almostCorrectAnswers: ["a few words about cheesecake","a few words about my cheesecake",]

          },
          {
            text: "Он не любит ТикТок ____",
            correctAnswer: "He doesn't like TikTok",
            almostCorrectAnswers: ["He doesn't love TikTok",]
          },
          {
            text: "Кто любит ТикТок? ____",
            correctAnswer: "Who likes TikTok?",
            almostCorrectAnswers: ["Who loves TikTok?",]
          },
          {
            text: "Кого любит ТикТок? ____",
            correctAnswer: "Who does TikTok like?",
            almostCorrectAnswers: ["Who does TikTok love?",]
          },
          {
            text: "Кого ты любишь? ____",
            correctAnswer: "Who do you like?",
            almostCorrectAnswers: ["Who do you love?",]
          },



        ]
      },

    ]
  },
  testPatternMultipleChoiceCopyThisAndChangeName: {
    mainDescription: "Listening skills Level A2",
    tasks: [
      {
        usefulWords: 'useful - полезные , words - слова , special - /спэшл/ особенный',
        taskDescription: 'Read out loud, choose the best variant',
        audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/listeningPicture1.jpg", import.meta.url).href,
        textScript: 'текст к этому заданию отсутствует пока что, но Винсент работает над тем, чтобы он появился',
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
  testPatternTrueFalseCopyThisAndChangeName: {
    mainDescription: "Listening skills Level A2",
    tasks: [
      {
        taskDescription: "Послушайте и ответьте",
        audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
        taskID: "true_false",
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

        ]
      },

    ]
  },
  testWeakSpots1: {
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
            text: "___ to the bar.",
            options: {
              A: "My friends not often go",
              B: "My friends don't go often",
              C: "My friends don't often go",
              D: "My friends doesn't go often"
            },
            correctAnswer: "C"
          },
          {
            text: "I ___ a dog.",
            options: {
              A: "haven't",
              B: "don't has",
              C: "don't have",
              D: "have not",
              E: "am",
            },
            correctAnswer: "C"
          },
          {
            text: "If you call me, I ___ there.",
            options: {
              A: "will",
              B: "am",
              C: "will be",
              D: "be"
            },
            correctAnswer: "C"
          },
          {
            text: "That's ___ car.",
            options: {
              A: "Bob's",
              B: "Bobs",
              C: "Bobs'",
              D: "Bob"
            },
            correctAnswer: "A"
          },
          {
            text: "She ___ it 2 years ago.",
            options: {
              A: "done",
              B: "does",
              C: "is doing",
              D: "did"
            },
            correctAnswer: "D"
          },
          {
            text: "It ___ snows in London.",
            options: {
              A: "will",
              B: "never",
              C: "was"
            },
            correctAnswer: "B"
          },
          {
            text: "___ two airports in the city.",
            options: {
              A: "It is",
              B: "There is",
              C: "There are",
              D: "This is"
            },
            correctAnswer: "C"
          },
          {
            text: "Are you going to live with us? - Yes, I ___.",
            options: {
              A: "do",
              B: "was",
              C: "am",
              D: "are"
            },
            correctAnswer: "C"
          },
          {
            text: "Ask any questions now as you ___ not talk during the test.",
            options: {
              A: "are",
              B: "could",
              C: "is",
              D: "may"
            },
            correctAnswer: "D"
          },
          {
            text: "Bob ___ Helen the secret.",
            options: {
              A: "tell",
              B: "telled",
              C: "told",
              D: "tolded"
            },
            correctAnswer: "C"
          },
          {
            text: "He ___ his keys!",
            options: {
              A: "always lose",
              B: "always is losing",
              C: "is always losing",
              D: "is losing"
            },
            correctAnswer: "C"
          },
          {
            text: "When I went into my office, he ___ for me.",
            options: {
              A: "wait",
              B: "waited",
              C: "was waiting",
              D: "were waiting"
            },
            correctAnswer: "C"
          },
          {
            text: "You ___ drive when you are tired.",
            options: {
              A: "shouldn't",
              B: "don't have to",
              C: "haven't to"
            },
            correctAnswer: "A"
          },
          {
            text: "I ___ silly",
            options: {
              A: "amn't",
              B: "am not",
              C: "both are correct"
            },
            correctAnswer: "B"
          },
          {
            text: "He ___ today.",
            options: {
              A: "lates",
              B: "is lating",
              C: "is late",
              D: "lated"
            },
            correctAnswer: "C"
          },
          {
            text: "Now she ___ him.",
            options: {
              A: "is hating",
              B: "hated",
              C: "hates",
              D: "hate"
            },
            correctAnswer: "C"
          },
          {
            text: "What ___?",
            options: {
              A: "she wants",
              B: "does she want",
              C: "does she wants",
              D: "is she want"
            },
            correctAnswer: "B"
          },
          {
            text: "He stopped when he ___ me.",
            options: {
              A: "was seeing",
              B: "saw",
              C: "seen",
              D: "see"
            },
            correctAnswer: "B"
          },
          {
            text: "Miranda is ___ the concert now.",
            options: {
              A: "in",
              B: "on",
              C: "at",
              D: "to"
            },
            correctAnswer: "C"
          },
          {
            text: "She ___ swim.",
            options: {
              A: "can't",
              B: "can't to",
              C: "doesn't can to",
              D: "doesn't can"
            },
            correctAnswer: "A"
          },
          {
            text: "He wants ___ us.",
            options: {
              A: "to see",
              B: "seeing",
              C: "to seeing",
              D: "see"
            },
            correctAnswer: "A"
          },
          {
            text: "My birthday is ___ February.",
            options: {
              A: "in",
              B: "on",
              C: "at",
              D: "to"
            },
            correctAnswer: "A"
          },
          {
            text: "Were you here at 5 p.m.? No, I ___.",
            options: {
              A: "didn't",
              B: "am not",
              C: "wasn't",
              D: "weren't"
            },
            correctAnswer: "C"
          },
          {
            text: "He'll be here ___ 7.30 a.m.",
            options: {
              A: "in",
              B: "on",
              C: "at",
              D: "to"
            },
            correctAnswer: "C"
          },
          {
            text: "They are meeting with the doctor ___.",
            options: {
              A: "yesterday",
              B: "tonight",
              C: "two hours ago",
              D: "last day"
            },
            correctAnswer: "B"
          },
          {
            text: "He's ___ good doctor.",
            options: {
              A: "a",
              B: "an",
              C: "the",
              D: "-"
            },
            correctAnswer: "A"
          },
          {
            text: "I ___ staying home tonight.",
            options: {
              A: "am going to",
              B: "will",
              C: "am"
            },
            correctAnswer: "C"
          },
          {
            text: "He's crazy about ___ sports.",
            options: {
              A: "play",
              B: "to play",
              C: "playing",
              D: "is playing"
            },
            correctAnswer: "C"
          },
          {
            text: "How many brothers and sisters ___?",
            options: {
              A: "are you having",
              B: "you have",
              C: "have you",
              D: "do you have"
            },
            correctAnswer: "D"
          },
          {
            text: "I never read ____ magazines.",
            options: {
              A: "woman's",
              B: "women's",
              C: "womens'"
            },
            correctAnswer: "B"
          },
          {
            text: "What ___ do after school tomorrow?",
            options: {
              A: "are you going to",
              B: "are you",
              C: "do you",
              D: "you"
            },
            correctAnswer: "A"
          },
          {
            text: "She ___ to Toronto next Tuesday.",
            options: {
              A: "goes",
              B: "will goes",
              C: "is going",
              D: "go"
            },
            correctAnswer: "C"
          },
          {
            text: "Oh, no! Look, what ___?",
            options: {
              A: "is he doing",
              B: "does he do",
              C: "is he do",
              D: "he doing"
            },
            correctAnswer: "A"
          },
          {
            text: "I promise I ___ read it.",
            options: {
              A: "will",
              B: "going to",
              C: "has to",
              D: "am"
            },
            correctAnswer: "A"
          },
          {
            text: "She's only four but she ___.",
            options: {
              A: "cans read",
              B: "can read",
              C: "can reads",
              D: "cans reads"
            },
            correctAnswer: "B"
          },
          {
            text: "I was busy yesterday, so I ___ meet you.",
            options: {
              A: "can",
              B: "can't",
              C: "could",
              D: "couldn't"
            },
            correctAnswer: "D"
          },
          {
            text: "We met when we ___ in France.",
            options: {
              A: "are",
              B: "was",
              C: "were",
              D: "study"
            },
            correctAnswer: "C"
          },
          {
            text: "I'll see you ___ Monday.",
            options: {
              A: "in",
              B: "on",
              C: "at",
              D: "to"
            },
            correctAnswer: "B"
          },
          {
            text: "If he ___ I will be angry.",
            options: {
              A: "doesn't come",
              B: "don't come",
              C: "willn't come",
              D: "won't come"
            },
            correctAnswer: "A"
          },
          {
            text: "She ___ talks to me.",
            options: {
              A: "never",
              B: "is never",
              C: "doesn't",
              D: "doesn't never"
            },
            correctAnswer: "A"
          },
          {
            text: "There ___ a door and 2 windows in the room.",
            options: {
              A: "are",
              B: "is",
              C: "some"
            },
            correctAnswer: "B"
          },
          {
            text: "Where's John? He's in the bathroom. He ___ a shower.",
            options: {
              A: "has",
              B: "is having",
              C: "is making",
              D: "is doing"
            },
            correctAnswer: "B"
          },
          {
            text: "This is ___ best cake ever!",
            options: {
              A: "a",
              B: "an",
              C: "the",
              D: "-"
            },
            correctAnswer: "C"
          },
          {
            text: "Where ___?",
            options: {
              A: "was he",
              B: "were he",
              C: "did he be"
            },
            correctAnswer: "A"
          },
          {
            text: "You are ___ relaxed.",
            options: {
              A: "a",
              B: "an",
              C: "the",
              D: "-"
            },
            correctAnswer: "D"
          }
        ]
      },

    ]
  },
  testWeakSpots6V2: {
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
            text: "They ____ accept it.",
            options: {
              A: "were made",
              B: "were made to"
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
            text: "Why on earth isn't Josh here yet? ___ for him for over an hour!",
            options: {
              A: "I'm waiting",
              B: "I've been waiting",
              C: "I've waited",
              D: "I'm being waiting"
            },
            correctAnswer: "B"
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
            text: "I'm afraid your car ____ repaired before next week.",
            options: {
              A: "hasn't been",
              B: "wasn't",
              C: "wouldn't be",
              D: "can't be"
            },
            correctAnswer: "D"
          },
          {
            text: "We will be staying for ____ day.",
            options: {
              A: "other",
              B: "another",
              C: "others"
            },
            correctAnswer: "B"
          },
          {
            text: "What do you do?",
            options: {
              A: "I do a teacher.",
              B: "I working in a bank.",
              C: "I'm taking a test.",
              D: "I'm a doctor."
            },
            correctAnswer: "D"
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
            text: "I took the ____ clothes back to the shop.",
            options: {
              A: "other",
              B: "others",
              C: "another"
            },
            correctAnswer: "A"
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
            text: "____ I had the talent, I still wouldn't want to be a movie star.",
            options: {
              A: "In case",
              B: "Even if",
              C: "Provided that",
              D: "However much"
            },
            correctAnswer: "B"
          },
          {
            text: "Tomorrow's a holiday, so we ___ go to work.",
            options: {
              A: "have to",
              B: "mustn't",
              C: "don't have to"
            },
            correctAnswer: "C"
          },
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
            text: "I promise I'll call you as soon as ___.",
            options: {
              A: "I arrive",
              B: "I arrived",
              C: "I'll arrive",
              D: "I'll have arrive"
            },
            correctAnswer: "A"
          },
          {
            text: "I'd lived in Australia, so I was used to ____ on the left side of the road.",
            options: {
              A: "driving",
              B: "drive",
              C: "having driven",
              D: "drove"
            },
            correctAnswer: "A"
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
            text: "Can you open the ____ for me, please? I'm carrying a stack of plates.",
            options: {
              A: "door of kitchen",
              B: "kitchen door",
              C: "kitchen's door"
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
            text: "If the taxi hadn't stopped for us, we ____ standing in the rain.",
            options: {
              A: "were still",
              B: "would still be",
              C: "are still",
              D: "will still be"
            },
            correctAnswer: "B"
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
            text: "By the end of today's seminar I will ____ to each of you individually.",
            options: {
              A: "speak",
              B: "have spoken",
              C: "be speaking",
              D: "have been speaking"
            },
            correctAnswer: "B"
          }
        ]
      },

    ]
  },
  testForValery: {
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
  firstAidA2: {
    mainDescription: "Listening skills Level A2",
    tasks: [
      {
        taskDescription: "Послушайте и ответьте",
        audio: new URL('../assets/audio/firstAidA2.mp3', import.meta.url).href,
        taskID: "true_false",
        taskPicture: null,
        textScript: 'текст к этому заданию отсутствует пока что, но Винсент работает над тем, чтобы он появился',
        questions: [
          {
            text: "1. First aid",
            correctAnswer: "true"
          },
          {
            text: "2. second aid",
            correctAnswer: "false"
          },

        ]
      },

    ]
  },
  checkersQuiz: {
    mainDescription: "Checkers",
    tasks: [
      {
        taskDescription: "Выбери правильный ответ",
        audio: null,
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/checkers.jpeg", import.meta.url).href,
        textScript: 'текст к этому заданию отсутствует пока что, но Винсент работает над тем, чтобы он появился',
        questions: [
          {
            text: "What is another name for the game Checkers?",
            options: {
              A: "lazy chess",
              B: "wooden circles",
              C: "shashkiss",
              D: "draughts",
              E: "corners"
            },
            correctAnswer: "D",
            explanation: "People in England say 'draughts' instead of 'checkers'."
          },
          {
            text: "The game 'Checkers' uses a strategy from an old Egyptian game. What was the name of the old game from Egypt?",
            options: {
              A: "alquerque",
              B: "pyramids",
              C: "pharaoners",
              D: "vincentikas",
              E: "towers"
            },
            correctAnswer: "A",
            explanation: "Egyptians played it 3,000 years ago!"
          },
          {
            text: "Can you play checkers on a computer?",
            options: {
              A: "Only on a very powerful PC",
              B: "Sure, you can",
              C: "You cannot",
              D: "Windows only"
            },
            correctAnswer: "B",
            explanation: "First computer checkers game was coded and played in 1951"
          },
          {
            text: "How many people play checkers together?",
            options: {
              A: "1",
              B: "2",
              C: "4",
              D: "unlimited"
            },
            correctAnswer: "B",
            explanation: "One person uses dark pieces, the other uses light pieces."
          },
          {
            text: "How many squares are on a checkers board?",
            options: {
              A: "32",
              B: "50",
              C: "64",
              D: "96",
              E: "128",
              F: "212",
              G: "330"
            },
            correctAnswer: "C",
            explanation: "Most boards have 64 squares. But Canadians use 144 squares."
          },
          {
            text: "How does a normal piece usually move?",
            options: {
              A: "straight forward",
              B: "diagonally forward",
              C: "up and down",
              D: "backwards",
              E: "telekinesis"
            },
            correctAnswer: "B",
            explanation: "It goes to the next empty square diagonally."
          },
          {
            text: "How do you capture your opponent's piece?",
            options: {
              A: "Jump over it",
              B: "Steal it and run",
              C: "Touch it",
              D: "Say 'check and mate'",
              E: "kick your opponent with a board"
            },
            correctAnswer: "A",
            explanation: "If you jump over your opponent's piece, you capture it!"
          },
          {
            text: "What happens when your piece reaches the end of the board?",
            options: {
              A: "You win",
              B: "Game stops",
              C: "It becomes a king or a queen",
              D: "It disappears",
              E: "Vincent cries"
            },
            correctAnswer: "C",
            explanation: "Kings can move backward too - they're more powerful!"
          },
          {
            text: "When does the game end?",
            options: {
              A: "When Vincent starts to cry",
              B: "When the timer stops",
              C: "When one of players cannot move",
              D: "When all pieces are black",
              E: "When one of the players is dead"
            },
            correctAnswer: "C",
            explanation: "A player who cannot move loses the match!"
          },
          {
            text: "The final question: What do people NOT use when they play checkers on a professional level?",
            options: {
              A: "A chessboard",
              B: "Brains",
              C: "Pieces",
              D: "Timers",
              E: "Dice"
            },
            correctAnswer: "E",
            explanation: "A player who cannot move loses the match!"
          }
        ]
      },

    ]
  },
}

export default gameTestsNoSeedNoShuffleData

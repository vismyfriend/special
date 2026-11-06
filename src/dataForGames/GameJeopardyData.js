const gameJeopardyData = {
  // Это ключи, которые будут использоваться в URL
  DevJeopardy: {
    mainDescription: "Testing the Jeopardy Game",
    extraDescription: "Играй учись кайфуй",
    level: "A1",
    categories: [
      {
        name: "Animals",
        questions: [
          {
            value: 100,
            question: "What animal says 'meow'?",
            answer: "cat",
            image: null,
            audio: new URL('../assets/audio/FaithYoungSheldonS1e3.mp3', import.meta.url).href,
          },
          {
            value: 200,
            question: "What is the biggest animal in the world?",
            answer: "whale",
            image: new URL("../assets/images/testPic1.png", import.meta.url).href
          },
          {
            value: 300,
            question: "What animal lives in water and has fins?",
            answer: "fish"
          },
        ]
      },
      {
        name: "Family",
        questions: [

          {
            value: 500,
            question: "What is your sister's son called?",
            answer: "nephew"
          }
        ]
      },
      {
        name: "Colors",
        questions: [
          {
            value: 100,
            question: "What color is the sky?",
            answer: "blue"
          },

        ]
      },
    ]
  },
  MyFirstJeopardy: {
    mainDescription: "Beginner's English",
    level: "S.P.E.C.I.A.L",
    categories: [
      {
        name: "Animals",
        questions: [
          {
            value: 100,
            question: "What animal says 'meow'?",
            answer: "cat",
            // image: null,
            // audio: new URL('../assets/audio/FaithYoungSheldonS1e3.mp3', import.meta.url).href,
          },
          {
            value: 200,
            question: "What is the biggest animal in the world?",
            answer: "кит - whale / вЭйл /",
            // image: new URL("../assets/images/testPic1.png", import.meta.url).href
          },
          {
            value: 300,
            question: "What does a fisherman catch usually?",
            answer: "fish"
          },
          {
            value: 400,
            question: "What animal has a long neck?",
            answer: "giraffe"
          },
          {
            value: 500,
            question: "What animal can fly and has feathers?",
            answer: "bird"
          }
        ]
      },
      {
        name: "Food",
        questions: [
          {
            value: 100,
            question: "A name of a fruit and a big company?",
            answer: "apple"
          },
          {
            value: 200,
            question: "What do people drink in the morning?",
            answer: "coffee/tea/juice/water/milk/soda"
          },
          {
            value: 300,
            question: "Breakfast is in the morning. Dinner is in the evening. What is in the afternoon?",
            answer: "dinner/supper"
          },
          {
            value: 400,
            question: "What is the general name of something sweet, that people eat after meals?",
            answer: "dessert"
          },
          {
            value: 500,
            question: "What is Italian most famous food ?",
            answer: "pizza"
          }
        ]
      },
      {
        name: "School",
        questions: [
          {
            value: 100,
            question: "What do you use to write in school?",
            answer: "pen/pencil/markers"
          },
          {
            value: 200,
            question: "What subject teaches you about numbers?",
            answer: "math/mathematics"
          },
          {
            value: 300,
            question: "Who teaches you at school?",
            answer: "teacher"
          },
          {
            value: 400,
            question: "What do you carry your books in?",
            answer: "backpack/bag"
          },
          {
            value: 500,
            question: "What is a place where you can borrow books?",
            answer: "library"
          }
        ]
      },
      {
        name: "Family",
        questions: [
          {
            value: 100,
            question: "What do you call your mother's brother?",
            answer: "uncle"
          },
          {
            value: 200,
            question: "What do you call your father's mother?",
            answer: "grandmother/granny"
          },
          {
            value: 300,
            question: "What is a girl child called?",
            answer: "daughter"
          },
          {
            value: 400,
            question: "Who is married to your father?",
            answer: "mother/mom"
          },
          {
            value: 500,
            question: "What is your sister's son called?",
            answer: "nephew"
          }
        ]
      },
      {
        name: "Colors",
        questions: [
          {
            value: 100,
            question: "What color is the sky?",
            answer: "blue"
          },
          {
            value: 200,
            question: "What color are bananas?",
            answer: "yellow"
          },
          {
            value: 300,
            question: "What color is grass?",
            answer: "green"
          },
          {
            value: 400,
            question: "What color is milk?",
            answer: "white"
          },
          {
            value: 500,
            question: "What color is an orange?",
            answer: "orange"
          }
        ]
      },
      {
        name: "Weather",
        questions: [
          {
            value: 100,
            question: "What is frozen water called?",
            answer: "ice/snow"
          },
          {
            value: 200,
            question: "What comes from the sky and makes things wet?",
            answer: "rain"
          },
          {
            value: 300,
            question: "What is a strong wind called?",
            answer: "storm"
          },
          {
            value: 400,
            question: "What is the season when leaves fall?",
            answer: "autumn/fall"
          },
          {
            value: 500,
            question: "What is a bright flash in the sky during a storm?",
            answer: "lightning"
          }
        ]
      }
    ]
  },
  CatsFamily: {
    mainDescription: "!? Чей ход  🦁  ХУЗ ТЁРН ?! ",
    level: "S.P.E.C.I.A.L",
    categories: [
      {
        name: "джоб интэвью\n job interview",
        questions: [
          {
            value: 150,
            question: "Hi, we are happy to have you at this interview!\n " +
              "One small problem, we see your first name, but\n " +
              "we don't see your last name. \n" +
              "Will you spell it please letter by letter?",
            answer: "Sure, it is not a problem for me.\n" +
              "My last name is Y-E-P-O-P-C-K-i-N-A",
            // image: null,
            // audio: new URL('../assets/audio/FaithYoungSheldonS1e3.mp3', import.meta.url).href,
          },
          {
            value: 222,
            question: "What is your phone number?",
            answer: "My phone number is a private information,\nbut I can tell it now, if you hire me: it is +91 002 100 3008",
            // image: new URL("../assets/images/testPic1.png", import.meta.url).href
          },
          {
            value: 300,
            question: "Introduce yourself:\n" +
              "basic info (name, age, location, hobby)",
            answer: "Well... okay! Hello again, and \n " +
              "let me introduce myself \nI am Alex, I am 99,\n" +
              "I am in Hawaii now, but I was born in Australia,\n" +
              "my hobby is going to job interviews.\n" +
              "I don't like to work, I like interviews only!",
          },
          {
            value: 412,
            question: "What are your salary expectations ?",
            answer: "I believe salary must reflect my effort and value I bring to the company. (Ten thousand dollars in cash and no tax)",
          }
        ]
      },
      {
        name: "a foot is food and \n feet are not food",
        questions: [
          {
            value: 100,
            question: "what is your favorite fruit?",
            answer: "my favorite fruit is a banana,\n but to be honest I like all fruits\nexcept mandarins, because I have an allergy to mandarins"
          },
          {
            value: 101,
            question: "What is your favorite vegetable?",
            answer: "my favorite vegetable is a cabbage,\n but to be honest I like all vegetables\nexcept onions, because I have an allergy to onions"
          },
          {
            value: 110,
            question: "What is the most important meal during the day?",
            answer: "Some people say that breakfast is the most important meal of the day"
          },
          {
            value: 111,
            question: "Name the food without mistakes\none mistake and you lose! 🌽🌶🥕🥒🧅🍄",
            answer: "corn, pepper, carrot \ncucumber, onion, mushroom"
          },
        ]
      },
      {
        name: "My lovely cats 🦁\nmy cute monsters",
        questions: [
          {
            value: 105,
            question: "How many cats do you have?\nWhat are their names?",
            answer: "I have 5 cats, and their names are _ _ _ _ _ \nI (don't) have a cat, I have an allergy to cats"
          },
          {
            value: 189,
            question: "If a dog has a babby, the baby is called a puppy.\n If a cat has a baby, the baby is called _ ______",
            answer: "a baby of a cat is called a kitten"
          },
          {
            value: 215,
            question: 'You have 50 seconds to \ngoogle and tell the answer! \nTime starts NOW! \nWhat is the English for как на английском\n "усы человека" и "усы кошки"',
            answer: "a human has moustache / мАс таш /\na cat has whiskers / вис керзс/"
          },
          {
            value: 350,
            question: "What was the name of a bad lion from a cartoon The Lion King ?",
            answer: " if you say 'SCAR' it is a correct answer,\n and if you want to know the history: \nhis real birth name was Taka. But after a fight with buffalo (in the original book The Lion King: A Tale of Two Brothers) he had a scar on his left eye, and after this situation he took his nickname. Mufasa was his brother and Simba is his nephew"
          },
        ]
      },
      {
        name: "Инглиш грЭмма ?\n это ещё what такое?",
        questions: [
          {
            value: 13,
            question: "Сколько времен в английском? И сколько обычно используется в повседневной жизни и разговорах?",
            answer: "12 - twelve tenses - всего, но есть еще пассивный залог так что ответ 24 тоже правильный =) \n-\n используются в основном \n Present Simple \n Present Continuous \n Past Simple \n Past Continuous \n Future Simple \n Present perfect\n"
          },
          {
            value: 30,
            question: "Как на английском проще всего сказать: \n Студенты учились, студенты учатся, студенты выучатся",
            answer: "students studied\nstudents study\nstudents will study"
          },
          {
            value: 303,
            question: "Correct all mistakes:  \nEverything okay, I haven't problem",
            answer: "everything is okay, I don't have a problem"
          },
          {
            value: 1000,
            question: "Когда нужны артикли A / An / The ?",
            answer: "The - когда говорим о чем-то уникальном, \nтом самом, конкретном о чем всем известно и пофиг множественное число или нет, \n -\n" +
              "например the internet, the great pyramids, \nthe best cat in the world\n -\n An и A только когда слово в единственном числе и можно посчитать например какая-то одна кошка \nA cute cat, a good dog, a pyramid, a computer\n -\nAn это тоже самое ноперед гласным звуком \n- \n an umbrella, an old cat, an ugly dog "
          },
        ]
      },

    ]
  },
  quickJ_1: {
    mainDescription: "Цель игры: попрактиковаться and speak инглиш :",
    level: "S.P.E.C.I.A.L",
    categories: [
      {
        name: "Animals",
        questions: [
          {
            value: 100,
            question: "What does a cat say? \n(what sound)",
            answer: 'A cat says "meow". \n \n+ extra 100 points \nif you guess what animal says "bark! bark!"',
            // image: null,
            // audio: new URL('../assets/audio/FaithYoungSheldonS1e3.mp3', import.meta.url).href,
          },
          {
            value: 200,
            question: "What sound does a pig make?\n (you can use google to find the answer)",
            answer: 'in Russian pigs say "ХРЮ-хрю" \n in English pigs say "Oink-oink"',
            // image: new URL("../assets/images/testPic1.png", import.meta.url).href
          },
          {
            value: 300,
            question: "What does a fisherman catch usually?",
            answer: "fish"
          },
          {
            value: 400,
            question: "What animal has the longest neck?",
            answer: "A giraffe"
          },
          {
            value: 500,
            question: "What animal poops cubes?\n It has square shape feces",
            answer: "A wombat. If you don't believe it - google it now"
          }
        ]
      },
      {
        name: "Food",
        questions: [
          {
            value: 100,
            question: "A name of a fruit and a big company?",
            answer: "apple"
          },
          {
            value: 200,
            question: "What do people drink in the morning?",
            answer: "coffee/tea/juice/water/milk/soda"
          },
          {
            value: 300,
            question: "Breakfast is in the morning. Dinner is in the evening. What is in the afternoon?",
            answer: "lunch"
          },
          {
            value: 400,
            question: "What is the general name of something sweet, that people eat after meals?",
            answer: "dessert"
          },
          {
            value: 500,
            question: "What is Italian most famous food ?",
            answer: "pizza"
          }
        ]
      },
      {
        name: "School",
        questions: [
          {
            value: 100,
            question: "What do you use to write in school?",
            answer: "pen/pencil/markers"
          },
          {
            value: 200,
            question: "What subject teaches you about numbers?",
            answer: "math/mathematics"
          },
          {
            value: 300,
            question: "Who teaches you at school?",
            answer: "teacher"
          },
          {
            value: 400,
            question: "What do you carry your books in?",
            answer: "backpack/bag"
          },
          {
            value: 500,
            question: "What is a place where you can borrow books?",
            answer: "library"
          }
        ]
      },
      {
        name: "Family",
        questions: [
          {
            value: 100,
            question: "What do you call your mother's brother?",
            answer: "uncle"
          },
          {
            value: 200,
            question: "What do you call your father's mother?",
            answer: "grandmother/granny"
          },
          {
            value: 300,
            question: "What is a girl child called?",
            answer: "daughter"
          },
          {
            value: 400,
            question: "Who is married to your father?",
            answer: "mother/mom"
          },
          {
            value: 500,
            question: "What is your sister's son called?",
            answer: "nephew"
          }
        ]
      },
      {
        name: "Colors",
        questions: [
          {
            value: 100,
            question: "What color is the sky?",
            answer: "blue"
          },
          {
            value: 200,
            question: "What color are bananas?",
            answer: "yellow"
          },
          {
            value: 300,
            question: "What color is grass?",
            answer: "green"
          },
          {
            value: 400,
            question: "What color is milk?",
            answer: "white"
          },
          {
            value: 500,
            question: "What color is an orange?",
            answer: "orange"
          }
        ]
      },
      {
        name: "Weather",
        questions: [
          {
            value: 100,
            question: "What is frozen water called?",
            answer: "ice/snow"
          },
          {
            value: 200,
            question: "What comes from the sky and makes things wet?",
            answer: "rain"
          },
          {
            value: 300,
            question: "What is a strong wind called?",
            answer: "storm"
          },
          {
            value: 400,
            question: "What is the season when leaves fall?",
            answer: "autumn/fall"
          },
          {
            value: 500,
            question: "What is a bright flash in the sky during a storm?",
            answer: "lightning"
          }
        ]
      }
    ]
  },


  HalloweenJeopardy: {
    mainDescription: "Halloween Jeopardy! 🎃",
    extraDescription: "Выбирай категорию и сложность вопроса",
    level: "",
    categories: [
      {
        name: "Spooky Vocabulary 👻",
        questions: [
          {
            value: 100,
            question: 'What do you call the carved pumpkin with a face that people put outside their houses on Halloween?',
            answer: "a jack-o'-lantern",
          },
          {
            value: 200,
            question: "Name at least 6 Halloween costumes you can see on October 31st. (no time limit, you can use a dictionary)",
            answer: "a witch, a ghost, a vampire, a zombie, a skeleton, a werewolf, a mummy, a pirate, a black cat, a superhero, Frankenstein's monster",
          },
          {
            value: 300,
            question: "Explain the difference between 'trick or treat', 'a haunted house' and 'a costume party'. Use each phrase in your own sentence.",
            answer: "'Trick or treat' is what children say when they go door to door asking for sweets. 'A haunted house' is an attraction (or a real house) where ghosts are said to live. 'A costume party' is a party where everyone wears a costume.",
          },
          {
            value: 400,
            question: "Describe your perfect Halloween costume. What would you wear, what would you be, and why? Use at least 5 adjectives.",
            answer: "any personal answer with 5+ adjectives (e.g. a creepy, shiny, old-fashioned, elegant, terrifying vampire costume)",
          },
          {
            value: 500,
            question: "Tell a short scary (or funny) Halloween story in 1 minute. Use at least 4 of these words: ghost, candle, dark, scream, pumpkin, shadow, door, midnight. After your story the other players ask you 1 question about it.",
            answer: "any coherent story using 4+ of the given words",
          },
        ],
      },
      {
        name: "Halloween Around the World 🌍",
        questions: [
          {
            value: 100,
            question: "On which date is Halloween celebrated?",
            answer: "on the 31st of October",
          },
          {
            value: 200,
            question: "Halloween comes from an ancient Celtic festival. What is it called?",
            answer: "Samhain",
          },
          {
            value: 300,
            question: "How is Halloween (or a similar holiday) celebrated in your country? Is it popular? Explain.",
            answer: "any personal answer (in Russia it's mostly parties and decorations, not door-to-door trick-or-treating)",
          },
          {
            value: 400,
            question: "Name 3 countries where Halloween is widely celebrated and say one tradition from each.",
            answer: "the USA (trick-or-treating), Ireland (barmbrack cake with hidden objects), Mexico (Día de los Muertos, sugar skulls), Canada, the UK",
          },
          {
            value: 500,
            question: "Compare Halloween with another holiday from your culture (e.g. Ivan Kupala, Maslenitsa, Día de los Muertos). What do they have in common and how are they different?",
            answer: "any reasonable comparison — e.g. both involve costumes/fire/spirits, but one is about scaring away evil and the other about celebrating the dead or the seasons",
          },
        ],
      },
      {
        name: "Spooky Grammar & Words 📝",
        questions: [
          {
            value: 100,
            question: "Put the words in the correct order: 'a / wearing / she / is / witch / hat / black'.",
            answer: "She is wearing a black witch hat.",
          },
          {
            value: 200,
            question: "Choose the correct form: 'Last Halloween I (see / saw / seen) a real bat in the park.'",
            answer: "saw",
          },
          {
            value: 300,
            question: "Find and correct 3 mistakes: 'Yesterday my friends and me goed to a haunted house. It was very scaryer than I thinked.'",
            answer: "Yesterday my friends and I went to a haunted house. It was much scarier than I thought.",
          },
          {
            value: 400,
            question: "Make 3 sentences about Halloween using: Present Simple, Present Continuous and Past Simple.",
            answer: "e.g. People celebrate Halloween on October 31st. / Children are wearing costumes right now. / Last year I watched a horror film.",
          },
          {
            value: 500,
            question: "Rewrite this sentence in 3 different tenses (past, present perfect, future): 'I carve a pumpkin.'",
            answer: "I carved a pumpkin. / I have carved a pumpkin. / I will carve a pumpkin.",
          },
        ],
      },
      {
        name: "Movies & Monsters 🧟",
        questions: [
          {
            value: 100,
            question: "Name 3 classic Halloween monsters in English.",
            answer: "a vampire, a werewolf, a zombie, a ghost, a witch, a mummy, Frankenstein's monster",
          },
          {
            value: 200,
            question: "What do you call a film that is designed to make you scared? Give one example in English.",
            answer: "a horror film (e.g. 'Halloween', 'The Conjuring', 'IT', 'A Nightmare on Elm Street')",
          },
          {
            value: 300,
            question: "Describe a scary film you have seen: what was it about, and why was it scary?",
            answer: "any personal answer with a short plot description",
          },
          {
            value: 400,
            question: "There is a famous horror film and its main villain is named after this holiday. What is the film and who is the villain?",
            answer: "the film is 'Halloween' (1978) and the villain is Michael Myers",
          },
          {
            value: 500,
            question: "Are horror films good for people or bad? Give at least 2 arguments for and 2 against.",
            answer: "for: harmless adrenaline, a way to face fears; against: nightmares, too much violence, not for children",
          },
        ],
      },
      {
        name: "Halloween Fun & Facts 🎃",
        questions: [
          {
            value: 100,
            question: "What is the traditional Halloween colour combination?",
            answer: "orange and black",
          },
          {
            value: 200,
            question: "Name 4 Halloween symbols in English.",
            answer: "a pumpkin, a bat, a spider web, a ghost, a skeleton, a black cat, a witch's hat, a candle",
          },
          {
            value: 300,
            question: "What do children say when they knock on a door on Halloween? And what do they get?",
            answer: "they say 'Trick or treat!' and they get sweets (candy, chocolate, lollipops)",
          },
          {
            value: 400,
            question: "Guess the number: how many pounds of pumpkins are grown in the USA every year — 1 million, 100 million, or 1.5 billion?",
            answer: "about 1.5 billion pounds",
          },
          {
            value: 500,
            question: "You are organising a Halloween party for your class. Tell us your plan: the decorations, the food, the music and 2 games. Use at least 6 Halloween words.",
            answer: "any detailed plan with 6+ Halloween words (e.g. pumpkins, candles, spider webs, a haunted maze, 'apple bobbing', a costume contest)",
          },
        ],
      },
    ],
  },
  HalloweenKidsJeopardy: {
    mainDescription: "! HaLLOWeeN !",
    extraDescription: "Выбирай категорию и отвечай на вопросы",
    level: "",
    categories: [
      {
        name: "Halloween Words 👻",
        questions: [
          {
            value: 100,
            question: "What is this? It is big, round and orange.",
            answer: "a pumpkin",
          },
          {
            value: 200,
            question: "Отгадайте перевод слова / КАРВ / прочитав предложение с ним: When you carve a pumpkin, you carve a face. Carving is a tradition for halloween.",
            answer: "to carve - вырезать красивую форму - карвинг - carving - хобби",
          },
          {
            value: 300,
            question: "What animal flies at night and lives in a cave? It is black and has wings. 🦇",
            answer: "a bat",
          },
          {
            value: 400,
            question: "What is this? It is white, it says 'boo!' and it is very scary. 👻",
            answer: "э гОУст - a ghost - призрак, привидение",
          },
          {
            value: 500,
            question: "Name 5 popular Halloween costumes ( + extra $100 if you name 2 not usual costumes)",
            answer: "a witch, a ghost, a vampire, a skeleton, a black cat, a superhero, a pumpkin, a pirate, Indiana Jones, Breaking Bad Walter White",
          },
        ],
      },
      {
        name: "Colors & Numbers 🎨",
        questions: [
          {
            value: 100,
            question: "What two colors are Halloween colors?",
            answer: "orange and black  🟠⚫",
          },
          {
            value: 200,
            question: "Count the pumpkins: 🎃🎃🎃🎃🎃🎃🎃🎃. How many? (+$100 если напишите на листочке ручкой без ошибок)",
            answer: "eight (8)",
          },
          {
            value: 300,
            question: "What color is a ghost? 👻 And what color is a bat? 🦇 " +
              "(What color is Vincent's underwear today? +$100)",
            answer: "a ghost is white, a bat is black",
          },
          {
            value: 400,
            question: "How many legs does a spider have?️",
            answer: "eight (8)  🕷",
          },
          {
            value: 500,
            question: "Look and say: 🎃🦇👻🕷️🧙 — name all 5 things in English.",
            answer: "a pumpkin, a bat, a ghost, a spider, a witch",
          },
        ],
      },
      {
        name: "Trick or Treat 🍬",
        questions: [
          {
            value: 100,
            question: "What do children say when they knock on the door on Halloween?",
            answer: "Trick or treat! - пакость или сладость",
          },
          {
            value: 200,
            question: "What do children get on Halloween? 🍬🍫",
            answer: "sweets / candy / chocolate",
          },
          {
            value: 300,
            question: "Where do children keep sweets? (in what object?)",
            answer: "a bag / a basket / a bucket",
          },
          {
            value: 400,
            question: "What is the English for Надевать / Одевать?",
            answer: "put on / dress",
          },
          {
            value: 500,
            question: "Make a scary Halloween voice and say : 'Surprise! Trick or treat! Here comes Johny' 🚪🍬",
            answer: "Other players decide if you deserve $ and sweets =)",
          },
        ],
      },
      {
        name: "Halloween Animals 🐈",
        questions: [
          {
            value: 100,
            question: "What animal says 'meow' and what color is it on Halloween? 🐈‍⬛",
            answer: "a black cat",
          },
          {
            value: 200,
            question: "If spiderman is человек паук... Who is Batman? 🕷️",
            answer: "человек летучая мышь",
          },
          {
            value: 300,
            question: "What animal flies at night and says 'Hoot'? 🦉",
            answer: "эн аул - произносится через А пишется через о - an owl - аул",
          },
          {
            value: 400,
            question: "Name 5 Halloween animals in English.",
            answer: "a bat, a black cat, a spider, an owl, a frog, a rat, a wolf",
          },
          {
            value: 500,
            question: "Make + - ? sentences: 'My teacher loves vampires.'🦇",
            answer: "+ he loves vampires " +
              "- he doesn't love vampires" +
              "does he love vampires?",
          },
        ],
      },
      {
        name: "Fun & Games 🎉",
        questions: [
          {
            value: 100,
            question: "Is Halloween happy or sad?",
            answer: "happy (it's a fun holiday!)",
          },
          {
            value: 200,
            question: "Say 'boo!' like a ghost. 👻",
            answer: "Boo!",
          },
          {
            value: 300,
            question: "When is the official date of Halloween?",
            answer: "on the 31st of October",
          },
          {
            value: 400,
            question: "What was your last Halloween costume? (даже если 100 лет назад это было вспоминай)",
            answer: "any personal answer, e.g. 'My favourite costume is a witch.' Or I never had a costume",
          },
          {
            value: 500,
            question: "Sing or say a short Halloween song or rhyme in English! 🎵 (For example: 'Five little pumpkins sitting on a gate...')",
            answer: "any short rhyme or song — e.g. 'This is halloween this is halloween!'",
          },
        ],
      },
    ],
  },
  A2Jeopardy: {
    mainDescription: "Intermediate English Jeopardy",
    level: "A2",
    categories: [
      {
        name: "Travel & Tourism",
        questions: [
          {
            value: 100,
            question: "What do you need to travel to another country?",
            answer: "passport",
            audio: new URL("../assets/audio/passport.mp3", import.meta.url).href
          },
          {
            value: 200,
            question: "Where do you wait for a plane?",
            answer: "airport",
            image: new URL("../assets/images/airport.jpg", import.meta.url).href
          },
          {
            value: 300,
            question: "What do you call a trip on a ship?",
            answer: "cruise"
          },
          {
            value: 400,
            question: "What is a place where tourists stay?",
            answer: "hotel"
          },
          {
            value: 500,
            question: "What do you use to find your way in a new city?",
            answer: "map/GPS"
          }
        ]
      },
      {
        name: "Work & Career",
        questions: [
          {
            value: 100,
            question: "What do you call the person who employs you?",
            answer: "employer/boss"
          },
          {
            value: 200,
            question: "What is a formal meeting for a job?",
            answer: "interview"
          },
          {
            value: 300,
            question: "What do you receive for your work?",
            answer: "salary/pay"
          },
          {
            value: 400,
            question: "What is a person who works in an office called?",
            answer: "employee/office worker"
          },
          {
            value: 500,
            question: "What is the opposite of 'employed'?",
            answer: "unemployed"
          }
        ]
      },
      {
        name: "Health & Medicine",
        questions: [
          {
            value: 100,
            question: "What is a person who treats you when you're sick?",
            answer: "doctor"
          },
          {
            value: 200,
            question: "Where do you go when you're very sick?",
            answer: "hospital"
          },
          {
            value: 300,
            question: "What is a medicine you take for a headache?",
            answer: "aspirin/painkiller"
          },
          {
            value: 400,
            question: "What is the condition when you have a high temperature?",
            answer: "fever"
          },
          {
            value: 500,
            question: "What do you call a treatment with needles?",
            answer: "acupuncture"
          }
        ]
      },
      {
        name: "Technology",
        questions: [
          {
            value: 100,
            question: "What is a device you use to communicate with people far away?",
            answer: "phone/smartphone"
          },
          {
            value: 200,
            question: "What is a device you use to write documents?",
            answer: "computer/laptop"
          },
          {
            value: 300,
            question: "What is the system that connects computers worldwide?",
            answer: "internet"
          },
          {
            value: 400,
            question: "What do you call a software that protects your computer?",
            answer: "antivirus"
          },
          {
            value: 500,
            question: "What is a code that protects your device?",
            answer: "password"
          }
        ]
      },
      {
        name: "Environment",
        questions: [
          {
            value: 100,
            question: "What is the planet we live on?",
            answer: "Earth"
          },
          {
            value: 200,
            question: "What do you call the gas that plants need?",
            answer: "carbon dioxide/CO2"
          },
          {
            value: 300,
            question: "What is the process of plants making food from sunlight?",
            answer: "photosynthesis"
          },
          {
            value: 400,
            question: "What do you call the warming of Earth's surface?",
            answer: "global warming"
          },
          {
            value: 500,
            question: "What is a renewable energy source from the sun?",
            answer: "solar energy"
          }
        ]
      },
      {
        name: "Culture",
        questions: [
          {
            value: 100,
            question: "What is a type of music with guitars and drums?",
            answer: "rock/pop music"
          },
          {
            value: 200,
            question: "What is a film with actors in historical clothes?",
            answer: "historical drama/costume drama"
          },
          {
            value: 300,
            question: "What do you call a painting of a person?",
            answer: "portrait"
          },
          {
            value: 400,
            question: "What is a famous building in Paris?",
            answer: "Eiffel Tower"
          },
          {
            value: 500,
            question: "What is a traditional story that explains natural phenomena?",
            answer: "myth/legend"
          }
        ]
      }
    ]
  },
  BackToSchoolJeopardy: {
    mainDescription: "Back to School! - Knowledge Day 🎒",
    extraDescription: "Выбирай категорию и сложность вопроса",
    level: "",
    categories: [
      {
        name: "Back to School 🤔",
        questions: [
          {
            value: 100,
            question: 'How do you say the word "линейка" in English? (translate: 1-го сентября мы положили в рюкзак линейку и пошли на линейку)',
            answer: 'On the first of September we took a ruler, and we went to a "back to school ceremony"',
          },
          {
            value: 200,
            question: "In order to get your 200 points you need to name 20 school objects that students can have in their backpacks. (no time limit, and you can use a dictionary)",
            answer: "an eraser, some snack, a toy snake, an extra pair of shoes, cigarettes?! Who knows what else...",
          },
          {
            value: 300,
            question: "Who was your school crush? What did he or she looked liked? Describe the appearance and character traits of that person",
            answer: "Vincent liked a girl from another class. It was the same grade, but a different class. (In Russia people say: parallel class. But in US people don't say it.) She had long blond hair, she used to fight, she liked riding a horse, and she liked punk music. And she was very funny and so beautiful. Vincent was too shy to speak with her. "
          },
          {
            value: 400,
            question: "What do you miss from the time when you were studying at school? Explain your answer. Extra: how different are the schools now from the schools where you studied?",
            answer: "Vincent misses the canteen - the place where all children ran to eat food during the long 15 minute break between lessons"
          },
          {
            value: 500,
            question: "Tell any (funny, weird, sad, stupid, shocking, usual, scary) story about you and your school, maybe about your teachers or classmates. You have 1 minute to think before you start. After you finish your story all other agents should ask you 1 question about your story.",
            answer: "Where did you study? (city/village/school/lyceum/gymnasium/private school) Who was your best friend at that time? What did you like? Were you a good or a naughty student?"
          }
        ]
      },
      {
        name: "All Subjects 📚",
        questions: [
          {
            value: 100,
            question: 'Guess the russian name of this English subject: "Health and Safety class"',
            answer: 'О БЭ ЖЭ',
          },
          {
            value: 200,
            question: "In order to get your 200 points you need to name at least 7 school subjects you know in English. (no time limit, you can use a dictionary)",
            answer: "math, physics, chemistry, biology, history, geography, literature, English, PE, art, music, IT, psychology, foreign languages, speaking about important stuff"
          },
          {
            value: 300,
            question: "Tell us about your favorite teacher. What subject did they teach? What made them special? Do you remember something funny or touching about them?",
            answer: "Vincent's favorite teacher was his Chemistry teacher. She had a special way of teaching — she always used cool stories and she had a deep calm voice. Vincent was a very bad student at chemistry, but he decided to pass that exam anyway. Just to spend some time looking at Oksana Alekseevna."
          },
          {
            value: 400,
            question: "If you were a principal of a school,\n" +
              "what rules would you change or add or remove? \n(Be creative, think outside the box)",
            answer: "Vincent would make all school students take skateboards to school and he would add nk rock songs instead of the ringing bell between classes. And he would make 5 English lessons a week for all classes."
          },
          {
            value: 500,
            question: "Did you learn by heart poems at school? Do you remember any of them now? What do you think was the main idea of forcing students to learn poems by heart? Was there ever a poem that maybe touched your heart?",
            answer: "If you can keep your head when all about you\n" +
              "Are losing theirs and blaming it on you,\n" +
              "If you can trust yourself when all men doubt you,\n" +
              "But make allowance for their doubting too;\n" +
              "If you can wait and not be tired by waiting,\n" +
              "Or being lied about, don't deal in lies,\n" +
              "Or being hated, don't give way to hating,\n" +
              "And yet don't look too good, nor talk too wise" +
              "\n...\n" +
              "Владей собой среди толпы смятенной,\n" +
              "Тебя клянущей за смятенье всех,\n" +
              "Верь сам в себя, наперекор вселенной,\n" +
              "И маловерным отпусти их грех;\n" +
              "Пусть час не пробил, жди, не уставая,\n" +
              "Пусть лгут лжецы, не снисходи до них;\n" +
              "Умей прощать и не кажись, прощая,\n" +
              "Великодушней и мудрей других."
          }
        ]
      },
      {
        name: "Mother Russia 🇷🇺",
        questions: [
          {
            value: 100,
            question: "Put the stress in the correct place\n'каталог', 'квартал', 'баловать', 'красивее', 'торты', 'щавель'.",
            answer: "каталОг\nквартАл\nбаловАть\nкрасИвее\nтОрты\nщавЕль\n",
          },
          {
            value: 200,
            question: "Find, count and correct mistakes:\n\n'Она проснулася, помылася и причесалася. Одевши пальто вышла на улицу и увидя своего друга, она сразуже поняла что произошло чёто не то ваще.'",
            answer: "Она проснулась, помыласт и причесалась. Надев пальто, вышла на улицу и, увидев своего друга, сразу же поняла, что произошло что-то не то вообще.",
          },
          {
            value: 300,
            question: "Закрываем тетради, достаем двойные листочки и пишем диктант - Винсент диктует предложения на английском - вы пишете на русском:",
            answer: "Нам нужно было собраться и привести себя в порядок. А главное, перед тем как отправиться в путешествие, нам нужно было сыграть в «камень, ножницы, бумага», чтобы понять, кто отправится на машине, а кто автостопом. Я подыграла друзьям и проиграла, поэтому еду за город на общественном транспорте. Кстати, я облокотилась на дверь троллейбуса и встретилась с Винсентом плечом к плечу. Он почему-то спросил у меня: «Чем занимаешься?» Я как будто прищурилась, но не стушевалась и расчётливо ответила, что сейчас еду в аэропорт автостопом, а после этого лечу в город Кронштадт закрывать один секретный гештальт. Ну и, конечно же, по приезде обязательно разошлю всем родственникам пару-тройку фотографий. Винсент попросил меня ему тоже привезти что-нибудь, но я сказала, что только если он пообещает привести меня к знаниям английского до уровня ЦЭ 2."          },
          {
            value: 400,
            question: "How many cases are in the Russian Language?",
            answer: "Иван Родил Девчонку Велел Тащить Пеленку 6 падежей"
          },
          {
            value: 500,
            question: "ДЛЯ НАСТОЯЩИХ ЗНАТОКОВ РУССКОГО ЯЗЫКА!\n\nЧтобы выполнить задание - прочитайте текст и найдите минимум 15 ошибок (считаются ВСЕ ошибки) орфографические, пунктуационные, грамматические и речевые ошибки. Их больше 15!\n\nТекст:\n\n'Вчера я решил занятся своим английским и пошол на занятия к Винстону. Я сел за парту и увидел, что на доске подписано: «Сегодня мы будем говорить о временах». Я сразуже обрадовался потому-что я давно хотел разобраться в этих временах. Но когда Винстен начал обиснять, я понял что я непонимаю ничево. Я почесал затылок и подумал: «Надо было учить правила ещё в школе!» Витоге я не выдержал и вышол из класса. Когда я выходил, я услышал как Винсэт сказал: «Не расстраивайтесь! Всё приходит с опытом!» Я остановился, повернулся и сказал: «Спасибо, Винс! Я обязательно приду на следующее занятие!» Он улыбнулся и пожелал мне удачи. Теперь я каждую неделю хожу на английский и заметно прогресирую. Я даже начал смотреть фильмы в оригинале и понимать отлельные слова. Я советую всем: не бойтесь ошибатся, потому-что ошибки — это путь к успеху!'",
            answer: " если нашли больше 15 то вы молодец"
          }
        ]
      },
      // {
      //   name: "Travel & Culture 🌍",
      //   questions: [
      //     {
      //       value: 100,
      //       question: "What country would you like to live in and why?",
      //       answer: "Italy for the food / Japan for the culture / Spain for the lifestyle",
      //       audio: new URL("../assets/audio/travel_dreams.mp3", import.meta.url).href
      //     },
      //     {
      //       value: 200,
      //       question: "Is traveling or reading more effective for learning about other cultures?",
      //       answer: "Both, but travel gives direct experience",
      //       image: new URL("../assets/images/travel_vs_reading.jpg", import.meta.url).href
      //     },
      //     {
      //       value: 300,
      //       question: "What's the most memorable trip you've ever had and what made it special?",
      //       answer: "an unexpected adventure / meeting locals"
      //     },
      //     {
      //       value: 400,
      //       question: "How do you adapt to cultural differences when traveling?",
      //       answer: "I observe, I ask, I try to understand"
      //     },
      //     {
      //       value: 500,
      //       question: "What does your dream vacation look like?",
      //       answer: "a quiet beach / a busy city / an adventure"
      //     }
      //   ]
      // },
      // {
      //   name: "Modern Life 📱",
      //   questions: [
      //     {
      //       value: 100,
      //       question: "Is technology making us more or less connected?",
      //       answer: "More connected online, but less in real life",
      //       image: new URL("../assets/images/technology_connection.jpg", import.meta.url).href
      //     },
      //     {
      //       value: 200,
      //       question: "Should social media be regulated like tobacco?",
      //       answer: "Yes, it's addictive / No, it's about freedom"
      //     },
      //     {
      //       value: 300,
      //       question: "What's the biggest problem of modern society?",
      //       answer: "information overload / loneliness / inequality"
      //     },
      //     {
      //       value: 400,
      //       question: "Are people happier now than 50 years ago?",
      //       answer: "We have more things, but not more happiness"
      //     },
      //     {
      //       value: 500,
      //       question: "What rules would you make for a better digital world?",
      //       answer: "no phone at dinner / digital detox days"
      //     }
      //   ]
      // },
      {
        name: "Philosophy 🤯",
        questions: [
          {
            value: 100,
            question: "Why do we need to learn languages?",
            answer: "to understand people / to think differently / for opportunities",
            image: new URL("../assets/images/languages.jpg", import.meta.url).href
          },
          {
            value: 200,
            question: "Does language shape how we think?",
            answer: "Yes, different languages = different perspectives"
          },
          {
            value: 300,
            question: "Why do adults stop learning new things?",
            answer: "comfort zone / no time / fear of failure"
          },
          {
            value: 400,
            question: "Is it better to be smart or wise?",
            answer: "smart = knowledge, wise = knowing how to use it"
          },
          {
            value: 500,
            question: "What's one question you've been asking yourself lately?",
            answer: "any personal reflection"
          }
        ]
      },
      {
        name: "Future & Goals 🚀",
        questions: [
          {
            value: 100,
            question: "What are you plans for tomorrow?",
            answer: "reading more / exercising / meditation",
          },
          {
            value: 200,
            question: "Do you have goals for this studying year?",
            answer: "I will speak better English / change career / travel more",
          },
          {
            value: 300,
            question: "What would you do if you didn't need to work for money?",
            answer: "travel / volunteer / start a passion project"
          },
          {
            value: 400,
            question: "What's your biggest motivation to learn English?",
            answer: "career / travel / personal growth"
          },
          {
            value: 500,
            question: "What advice would you give your younger self?",
            answer: "start earlier / don't be afraid / learn languages"
          }
        ]
      }
    ]
  },
  B1Jeopardy: {
    mainDescription: "Upper-Intermediate English Jeopardy",
    level: "B1",
    categories: [
      // ... данные для B1
    ]
  },

  B2Jeopardy: {
    mainDescription: "Advanced English Jeopardy",
    level: "B2",
    categories: [
      // ... данные для B2
    ]
  }
};

export default gameJeopardyData;

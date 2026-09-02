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

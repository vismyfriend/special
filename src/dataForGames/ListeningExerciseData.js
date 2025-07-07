
const ListeningExerciseData = {

  testQuicklyData: {
    mainDescription: "Listening skills",
    tasks: [
      {
        usefulWords: 'useful - полезные , words - слова , special - /спэшл/ особенный',
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
  WhatIsMyLevel: {
    mainDescription: "СПЭШЛ проверка уровня",
    tasks: [
      {
        usefulWords: null,
        taskDescription: "Слушайте и повторяйте вслух. Переводить не нужно, только повторять. Без пауз. Каждое слово или фразу из аудио нужно повторить вслух на английском. Проверим способность слышать и копировать английское произношение, звуки, правильную интонацию, ну и рАшн Экцент проверим есть или нет. уан ту фри нажимай плэй и погнали лэтс гоу эйджэнт",
        audio: new URL('../assets/audio/Musical-instrument.mp3', import.meta.url).href,
        taskID: "true_false",
        taskPicture: new URL("../assets/images/guitarist.jpg", import.meta.url).href,
        textScript: 'Что  действительно без подсказок сложно было? Ну ладно вот подсказка: здесь только один FALSE ответ ;) дальше сами справитесь',
        questions: [
          {
            text: "1. Аудио было про интструменты?",
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
          'A1 - ну я вроде учил немного и может помню something about prepositions... ну спроси меня как будет "над" или "через час" и я отвечу.,' +
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
        usefulWords: 'strings - струнные инструменты /ˈstrɪŋz/, violin - скрипка /ˌvaɪəˈlɪn/, viola - альт /viˈoʊlə/, cello - виолончель /ˈtʃeloʊ/, double bass - контрабас /beɪs/, acoustic guitar - акустика /əˈkuːstɪk ɡɪˈtɑːr/, electric guitar - электрогитара /ɪˈlektrɪk ɡɪˈtɑːr/, banjo - банджо /ˈbændʒoʊ/, harp - арфа /hɑːrp/, woodwind - деревянные духовые /ˈwʊdwɪnd/, piccolo - пикколо /ˈpɪkəloʊ/, flute - флейта /fluːt/, clarinet - кларнет /ˌklærəˈnɛt/, oboe - гобой /ˈoʊboʊ/, recorder - блокфлейта /rɪˈkɔːrdər/, saxophone - саксофон /ˈsæksəfoʊn/, bassoon - фагот /bəˈsuːn/, brass instruments - медные духовые /bræs/, trumpet - труба /ˈtrʌmpɪt/, trombone - тромбон /trɒmˈboʊn/, French horn - валторна /frentʃ hɔːrn/, tuba - туба /ˈtuːbə/, percussion - ударные /pərˈkʌʃən/, drums - барабаны /drʌmz/, cymbals - тарелки /ˈsɪmbəlz/, tambourine - тамбурин /ˌtæmbəˈriːn/, xylophone - ксилофон /ˈzaɪləfoʊn/, keyboard - клавишные инструменты /ˈkiːbɔːrd/, piano - фортепиано /piˈænoʊ/, electric keyboard - синтезатор /ɪˈlektrɪk ˈkiːbɔːrd/, organ - орган /ˈɔːrɡən/, other - lругие /ˈʌðər/, instruments - инструменты /ˌɪnstrəmənts/, accordion - аккордеон /əˈkɔːrdiən/, harmonica - гармоника /hɑːrˈmɒnɪkə/ button accordion - гармошка /əˈkɔːrdiən/',
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
        taskDescription: 'Послушайте и нарисуйте маршрут - линию пути людей от "You are here" до ...',
        audio: new URL('../assets/audio/A2_giving_directions.mp3', import.meta.url).href,
        taskID: "multiple_choice",
        taskPicture: new URL("../assets/images/A2_directions.png", import.meta.url).href,
        textScript: 'A\n' +
          'Go straight on. Then take the first left on to Green Street. Walk past the library and it’s the building next to the library on the left.\n' +
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
            text: 'Как сказть "мы на перекрёстке"?',
            options: {
              A: "we are AT the roundabout",
              B: "we are AT home",
              C: "we are ON perekrestok",
              D: "we are AT the crossroads",
              E: "we are AT the traffic lights",
            },
            correctAnswer: "D"
          },
        ]
      },
    ]
  },
  student_input_newTask: {
    mainDescription: "введи верный ответ",
    tasks: [
      {
        usefulWords: 'on the right - справа, on the left - слева' ,
        taskDescription: 'прочитай текст и введи недостающий слова',
        audio: new URL('../assets/audio/A2_giving_directions.mp3', import.meta.url).href,
        taskID: "student_input",
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        textScript: 'I am on the right and my dog is on the left.',
        questions: [
          {
            text: "A) Go straight on. Then take the first left on to Green Street. Walk past the ___ and it’s the building next to the library on the left.",
            correctAnswer: "library",
            almostCorrectAnswers: ["laibreri", "librery", "libreri"]
          },
          {
            text: "B) Go straight on. Go past the traffic lights. ___ see a shop on the right. Go past that and it’s on the right next to the shop.",
            correctAnswer: "you'll",
            almostCorrectAnswers: null

          },

        ]
      },
    ]
  },
  student_input_wordOrder: {
    mainDescription: "Word_order порядок_слов",
    tasks: [
      {
        usefulWords: null,
        taskDescription: null,
        audio: null,
        taskID: "student_input",
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        textScript: 'I am on the right and my dog is on the left.',
        questions: [
          {
            text: "У моего друга красивые глаза. _ ",
            correctAnswer: "My friend has beautiful eyes",
            almostCorrectAnswers: ["my friend has nice eyes", "My friend's eyes are beautiful", "The eyes of my friend are beautiful"]
          },
          {
            text: "__",
            correctAnswer: "My friend doesn't have beautiful eyes",
            almostCorrectAnswers: null

          },
          {
            text: " привет ___",
            correctAnswer: "my friend does not have beautiful eyes",
            almostCorrectAnswers: null

          },
          {
            text: " привет ____",
            correctAnswer: "my friend does not have beautiful eyes",
            almostCorrectAnswers: null

          },

        ]
      },
    ]
  },
  dropDownPattern: {
    mainDescription: "Drop_Down",
    tasks: [
      {
        usefulWords: null,
        taskDescription: "Drop down",
        audio: null,
        taskID: "drop_down_text",
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        textScript: 'выбирай правильный ответ',
        questions: [
          {
            text: "I (haven't, don't have*, hasn't) a cat. But my wife (have, has*, has got*) it!",
          },
          {
            text: "I don't (have*, has, know) a car. Because it is very expensive to have a car. And cars (do, are*, did, does) dangerous.",

          },

        ]
      },{
        usefulWords: "dd - dd, dd -dd",
        taskDescription: "Drop down2 ",
        audio: null,
        taskID: "drop_down_text",
        taskPicture: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
        textScript: 'выбирай правильный ответ',
        questions: [
          {
            text: "I (haven't, don't have*, hasn't) a cat. But my wife (have, has*, has got*) it!",
          },
          {
            text: "I don't (have*, has, know) a car. Because it is very expensive to have a car. And cars (do, are*, did, does) dangerous.",

          },

        ]
      },
    ]
  },
  grid_table_task1: {
    mainDescription: "Заполните таблицу недостающими данными",
    tasks: [
      {
        taskDescription: "Заполните пропуски в таблице",
        taskID: "grid_table",
        tableData: {
          headers: ["Имя", "Время", "Действие", "Настроение"],
          rows: [
            {
              cells: ["Alex", "8:00pm", "wake up", "happy"],
              editable: [false, false, false, false]
            },
            {
              cells: ["John", "", "", "tired"],
              editable: [false, true, true, false],
              correctAnswers: {
                cells: [null, "7:30am", "get up", null],
                almostCorrect: {
                  1: ["7:30", "19:30"], // Индекс поля (начиная с 0)
                  2: ["wake up", "rise"] // Индекс поля (начиная с 0)
                }
              }
            }
          ]
        }
      }
    ]
  },
  grid_table_task: {
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
              D: "in"
            },
            correctAnswer: "B",
            explanation: "The correct preposition for means of transport is 'by'."
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


}

export default ListeningExerciseData

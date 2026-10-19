// Данные для домашних заданий
export const homeworkData = {
  'patterns': {
    missionName: 'Примеры заданий :',
    description: 'Шаблоны заданий :',
    tasks: [

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
      }
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

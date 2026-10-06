// Данные для домашних заданий
export const homeworkData = {
  'intro-1': {
    missionName: 'Никнэйм:',
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
      {
        type: 'doTheMagic',
        question: 'Мы хорошие студенты',
        // Опционально: подсказки для каждого поля
        labels: {
          positive: '+',
          negative: '−',
          question: '?',
          openQuestion: 'o?',
          answer: 'a*'
        },
        // Правильные ответы для каждого поля (можно массивом — для нескольких вариантов)
        correct: {
          positive: ['We are good students'],
          negative: ['We are not good students', "We aren't good students"],
          question: ['Are we good students?'],
          openQuestion: ['Who are good students?', 'What are we?'],
          answer: ['Yes, we are', 'No, we are not']
        },
        // Подсказки (опционально)
        hints: {
          positive: 'Present Simple, to be',
          negative: 'not после are',
          question: 'Вопрос начинается с Are',
          openQuestion: 'Who / What',
          answer: 'Краткий ответ'
        }
      }

    ],
  },
  'intro-2': {
    missionName: 'Никнэйм:',
    agentName: 'Нажмите здесь и введите имя',
    title: 'Первое задание',
    description: 'Переведи письменно:',
    tasks: [
      {
        type: 'text',
        question: 'Я люблю английский.',
        hint1: 'Может быть несколько ответов верных',
        hint2: '/ ай лав инглиш /',
        answers: ['I like English','I love English'],
        placeholder: 'нажмите чтобы писать...'
      },
      {
        type: 'textarea',
        question: 'Напишите любой вопрос своему тичеру Винсентику:',
        placeholder: 'нажмите чтобы писать...'
      }
    ],
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
  '2': {
    missionName: 'Миссия Цвета / кА лаз /',
    agentName: 'Винсентик',
    title: 'Colors',
    description: 'Переведи на английский:',
    tasks: [
      {
        type: 'text',
        question: 'Синий.',
        hint1: 'Цвет неба',
        hint2: '/ блу /',
        answers: ['Blue', 'blue'],
        placeholder: 'напишите перевод...'
      },
      {
        type: 'text',
        question: 'Синий.',
        hint1: 'Цвет неба',
        hint2: '/ блу /',
        answers: ['Blue', 'blue'],
        placeholder: 'напишите перевод...'
      },
      {
        type: 'text',
        question: 'Синий.',
        hint1: 'Цвет неба',
        hint2: '/ блу /',
        answers: ['Blue', 'blue'],
        placeholder: 'напишите перевод...'
      },
      {
        type: 'text',
        question: 'Зелёный.',
        hint1: 'Цвет травы',
        answers: ['Green', 'green'],
        placeholder: 'напишите перевод...'
      },{
        type: 'text',
        question: 'Зелёный.',
        hint1: 'Цвет травы',
        answers: ['Green', 'green'],
        placeholder: 'напишите перевод...'
      },{
        type: 'text',
        question: 'Зелёный.',
        hint1: 'Цвет травы',
        answers: ['Green', 'green'],
        placeholder: 'напишите перевод...'
      },{
        type: 'text',
        question: 'Зелёный.',
        hint1: 'Цвет травы',
        answers: ['Green', 'green'],
        placeholder: 'напишите перевод...'
      },
      {
        type: 'textarea',
        question: 'Составьте предложение с этими словами',
        placeholder: 'нажми чтобы писать...'
      },
      {
        type: 'textarea',
        question: 'Составьте предложение с этими словами',
        placeholder: 'нажми чтобы писать...'
      },
      {
        type: 'textarea',
        question: 'Составьте предложение с этими словами',
        placeholder: 'нажми чтобы писать...'
      },
      {
        type: 'textarea',
        question: 'Составьте предложение с этими словами',
        placeholder: 'нажми чтобы писать...'
      },
    ],
  },
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

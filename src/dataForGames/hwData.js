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

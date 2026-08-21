// Данные для домашних заданий
export const homeworkData = {
  'intro-1': {
    missionName: 'Вводное д/з:',
    agentName: 'Винсентик',
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
      },
      {
        type: 'textarea',
        question: 'Составьте предложение с этими словами',
        placeholder: 'нажми чтобы писать...'
      }
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

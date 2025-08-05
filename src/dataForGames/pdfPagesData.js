const pdfPagesData = {
  testQuicklyData: {
    pdfUrl: new URL('../assets/pdfPages/work_vocab.pdf', import.meta.url).href,
    tasks: [
      {
        taskID: "simple_questions",
        taskDescription: "Ответьте на вопросы по странице 1",
        questions: [
          "1. Какое прилагательное описывает скучную работу?",
          "2. Как называется работа, которая приносит удовлетворение?",
          "3. Что означает 'demanding job'?"
        ]
      }
    ]
  },
  grammar_lesson: {
    pdfUrl: new URL('../assets/pdfPages/grammar.pdf', import.meta.url).href,
    tasks: [
      {
        taskID: "fill_answers",
        taskDescription: "Заполните пропуски по материалам PDF",
        questions: [
          "1. Present Simple образуется с помощью: _____",
          "2. 3 форма глагола 'to go': _____"
        ]
      }
    ]
  }
};
export default pdfPagesData;

// чтобы удалить пустые строки нужно ввести в CTRL+F или CTRL R   
// ^\s*$\n
const trickyQuizData = {
   
    devmode0: [
        {
            id: 1,
            quizQuestion: "Как на английском сказать: Я",
            answers: [
                {
                    answer: "I",
                    correct: true
                },
                {
                    answer: "I am",
                    correct: false
                },
            ]
        },
        {
            id: 2,
            quizQuestion: "Как на английском сказать: ты или вы",
            answers: [
                {
                    answer: "you",
                    correct: true
                },
                {
                    answer: "ti",
                    correct: false
                },
                {
                    answer: "we",
                    correct: false
                },
            ]
        },
        {
            id: 3,
            quizQuestion: "Как на английском сказать: мы",
            answers: [
                {
                    answer: "we",
                    correct: true
                },
                {
                    answer: "they",
                    correct: false
                },
                {
                    answer: "our",
                    correct: false
                },
                {
                    answer: "mi",
                    correct: false
                },
            ]
        },
        {
            id: 4,
            quizQuestion: "Как на английском сказать: они",
            answers: [
                {
                    answer: "they",
                    correct: true
                },
                {
                    answer: "we",
                    correct: false
                },
                {
                    answer: "our",
                    correct: false
                },
                {
                    answer: "your",
                    correct: false
                },
                {
                    answer: "him",
                    correct: false
                },
            ]
        },
        {
            id: 5,
            quizQuestion: "Как на английском сказать: он",
            answers: [
                {
                    answer: "he",
                    correct: true
                },
                {
                    answer: "his",
                    correct: false
                },
            ]
        },
    ],
}
export default trickyQuizData

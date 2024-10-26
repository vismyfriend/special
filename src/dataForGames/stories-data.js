// чтобы удалить пустые строки нужно ввести в CTRL+F или CTRL R   
// ^\s*$\n
const storiesData = {

    devmode0: [
        {
            text: "Vincent and I ___ going to beer together. We are ___ meet behind the garages. We always ___ alcohol together. This exercise is very easy, ___ the last question must be very hard! Or not? =)",
            options: [
                ['am', 'is', 'are',],
                ['going', 'gonna to', 'go to', 'gonna',],
                ['drinking', 'drink', 'drunk', 'drinked', 'are drinking',],
                ['because', 'for it', 'because of', 'to', 'that`s why', 'due to'],
            ],
            correctAnswers: ['are', 'gonna', 'drink', 'that`s why']
        },
        {
            text: "Vincent ___ like beer. He ___ every day. ___ you like beer?",
            options: [
                ['loves', 'does not', 'drinks'],
                ['drink', 'doesn`t drink', 'gonna drink', 'drinked',],
                ['Does', 'Are', 'Is', 'Do', 'Vincent',],
            ],
            correctAnswers: ['does not', 'doesn`t drink', 'Do']
        },
    ],
}
export default storiesData

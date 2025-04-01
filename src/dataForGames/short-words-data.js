// чтобы удалить пустые строки нужно ввести в CTRL+F или CTRL R
// ^\s*$\n
const shortWordsData = {

  devModeNumbersFast: [
    { id: 3, eng: "three", ru: "три", hint: "/ THри /" },
    { id: 8, eng: "eight", ru: "восемь", hint: "/ эйт /" },
    { id: 29, eng: "hundred", ru: "сто", hint: "/ хандред /" },
    { id: 30, eng: "thousand", ru: "тысяча", hint: "/ THаузэнд /" },

  ],


    devModeNumbers: [
        { id: 1, eng: "one", ru: "один", hint: "/ уан /" },
        { id: 2, eng: "two", ru: "два", hint: "/ ту /" },
        { id: 3, eng: "three", ru: "три", hint: "/ THри /" },
        { id: 4, eng: "four", ru: "четыре", hint: "/ фор /" },
        { id: 5, eng: "five", ru: "пять", hint: "/ файв /" },
        { id: 6, eng: "six", ru: "шесть", hint: "/ сыкс /" },
        { id: 7, eng: "seven", ru: "семь", hint: "/ сэвэн /" },
        { id: 8, eng: "eight", ru: "восемь", hint: "/ эйт /" },
        { id: 9, eng: "nine", ru: "девять", hint: "/ найн /" },
        { id: 10, eng: "ten", ru: "десять", hint: "/ тэн /" },
        { id: 11, eng: "eleven", ru: "одиннадцать", hint: "/ иливэн /" },
        { id: 12, eng: "twelve", ru: "двенадцать", hint: "/ туэлв /" },
        { id: 13, eng: "thirteen", ru: "тринадцать", hint: "/ THётин /" },
        { id: 14, eng: "fourteen", ru: "четырнадцать", hint: "/ фортиН /" },
        { id: 15, eng: "fifteen", ru: "пятнадцать", hint: "/ фифтиН /" },
        { id: 16, eng: "sixteen", ru: "шестнадцать", hint: "/ сыкстиН /" },
        { id: 17, eng: "seventeen", ru: "семнадцать", hint: "/ сэвэнтиН /" },
        { id: 18, eng: "eighteen", ru: "восемнадцать", hint: "/ эйтиН /" },
        { id: 19, eng: "nineteen", ru: "девятнадцать", hint: "/ найнтиН /" },
        { id: 20, eng: "twenty", ru: "двадцать", hint: "/ твэнти /" },
        { id: 21, eng: "first", ru: "первый", hint: "/ фёрст /" },
        { id: 22, eng: "zero", ru: "ноль", hint: "/ зиро /" },
        { id: 23, eng: "third", ru: "третий", hint: "/ THёрд /" },
        { id: 24, eng: "thirty", ru: "тридцать", hint: "/  THёрти /" },
        { id: 25, eng: "forty", ru: "сорок", hint: "/ форти /" },
        { id: 26, eng: "fifty", ru: "пятьдесят", hint: "/ фифти /" },
        { id: 27, eng: "eighty", ru: "восемьдесят", hint: "/ эйти /" },
        { id: 28, eng: "ninety", ru: "девяносто", hint: "/ найнти /" },
        { id: 29, eng: "hundred", ru: "сто", hint: "/ хандред /" },
        { id: 30, eng: "thousand", ru: "тысяча", hint: "/ THаузэнд /" },
        { id: 31, eng: "million", ru: "миллион", hint: "/ миллион /" },
        { id: 32, eng: "billion", ru: "миллиард", hint: "/ биллион /" }
    ],
    devmode1: [
        {
            id: 1,
            eng: "first",
            ru: "первый"
        },
        {
            id: 2,
            eng: "second",
            ru: "второй"
        },
        {
            id: 3,
            eng: "third",
            ru: "третий"
        },
        {
            id: 4,
            eng: "fourth",
            ru: "четвертый"
        },
        {
            id: 5,
            eng: "fifth",
            ru: "пятый"
        },
        {
            id: 6,
            eng: "sixth",
            ru: "шестой"
        },
        {
            id: 7,
            eng: "seventh",
            ru: "седьмой"
        },
        {
            id: 8,
            eng: "eighth",
            ru: "восьмой"
        },
        {
            id: 9,
            eng: "nineth",
            ru: "девятый"
        },
        {
            id: 10,
            eng: "tenth",
            ru: "десятый"
        },
        {
            id: 11,
            eng: "eleventh",
            ru: "одинадцатый"
        },
        {
            id: 12,
            eng: "twelveth",
            ru: "двенадцатый"
        },
        {
            id: 13,
            eng: "thirteenth",
            ru: "тринадцатый"
        },
    ],

    digits: [
    { id: 1, eng: "one", ru: "один", hint: "/ уан /" },
    { id: 2, eng: "two", ru: "два", hint: "/ ту /" },
    { id: 3, eng: "three", ru: "три", hint: "/ THри /" },
    { id: 4, eng: "four", ru: "четыре", hint: "/ фор /" },
    { id: 5, eng: "five", ru: "пять", hint: "/ файв /" },
    { id: 6, eng: "six", ru: "шесть", hint: "/ сыкс /" },
    { id: 7, eng: "seven", ru: "семь", hint: "/ сэвэн /" },
    { id: 8, eng: "eight", ru: "восемь", hint: "/ эйт /" },
    { id: 9, eng: "nine", ru: "девять", hint: "/ найн /" },
    { id: 10, eng: "zero", ru: "ноль", hint: "/ оу или зироу /" }
  ],

  alphabetData: [
    { id: 1, eng: "Aa", ru: "эй", hint: "/ эй /" },
    { id: 2, eng: "Bb", ru: "би", hint: "/ би /" },
    { id: 3, eng: "Cc", ru: "си", hint: "/ си /" },
    { id: 4, eng: "Dd", ru: "ди", hint: "/ ди /" },
    { id: 5, eng: "Ee", ru: "и", hint: "/ и /" },
    { id: 6, eng: "Ff", ru: "эф", hint: "/ эф /" },
    { id: 7, eng: "Gg", ru: "джи", hint: "/ джи /" },
    { id: 8, eng: "Hh", ru: "эйч", hint: "/ эйч /" },
    { id: 9, eng: "Ii", ru: "ай", hint: "/ ай /" },
    { id: 10, eng: "Jj", ru: "джэй", hint: "/ джэй /" },
    { id: 11, eng: "Kk", ru: "кей", hint: "/ кей /" },
    { id: 12, eng: "Ll", ru: "эл", hint: "/ эл /" },
    { id: 13, eng: "Mm", ru: "эм", hint: "/ эм /" },
    { id: 14, eng: "Nn", ru: "эн", hint: "/ эн /" },
    { id: 15, eng: "Oo", ru: "оу", hint: "/ оу /" },
    { id: 16, eng: "Pp", ru: "пи", hint: "/ пи /" },
    { id: 17, eng: "Qq", ru: "кью", hint: "/ кью /" },
    { id: 18, eng: "Rr", ru: "ар", hint: "/ ар /" },
    { id: 19, eng: "Ss", ru: "эс", hint: "/ эс /" },
    { id: 20, eng: "Tt", ru: "ти", hint: "/ ти /" },
    { id: 21, eng: "Uu", ru: "ю", hint: "/ ю /" },
    { id: 22, eng: "Vv", ru: "ви", hint: "/ ви /" },
    { id: 23, eng: "Ww", ru: "дабл-ю", hint: "/ дабл-ю /" },
    { id: 24, eng: "Xx", ru: "экс", hint: "/ экс /" },
    { id: 25, eng: "Yy", ru: "уай", hint: "/ уай /" },
    { id: 26, eng: "Zz", ru: "зи/зэд", hint: "/ зи или zэд /" }
  ],



    halloween01: [
        {
            id: 1,
            eng: "Costumes",
            ru: "костюмы",
            hint: "/ кОстьюмз /"
        },
        {
            id: 2,
            eng: "Candy",
            ru: "конфета",
            hint: "/ кЭнди /"
        },
        {
            id: 3,
            eng: "Pumpkins",
            ru: "тыквы",
            hint: "/ пАмпкинз /"
        },
        {
            id: 4,
            eng: "Ghosts",
            ru: "призраки",
            hint: "/ гОуст /"
        },
        {
            id: 5,
            eng: "Spooky",
            ru: "жуткий",
            hint: "/ спУки /"
        },
        {
            id: 6,
            eng: "Witches",
            ru: "ведьмы",
            hint: "/ вИчез /"
        },
        {
            id: 7,
            eng: "Skeletons",
            ru: "скелеты",
            hint: "/ скЕлетонз /"
        },
        {
            id: 8,
            eng: "Spiders",
            ru: "пауки",
            hint: "/ спАйдэрз /"
        },
        {
            id: 9,
            eng: "Web",
            ru: "паутина",
            hint: "/ уЭб /"
        },
        {
            id: 10,
            eng: "Bats",
            ru: "летучие мыши",
            hint: "/ бЭтс /"
        },
        {
            id: 11,
            eng: "Adults",
            ru: "взрослые",
            hint: "/ эдАлтс /"
        },
        {
            id: 12,
            eng: "Fear",
            ru: "страх",
            hint: "/ фИэ /"
        },
        {
            id: 13,
            eng: "Darkness",
            ru: "темнота",
            hint: "/ дАркнэс /"
        },
        {
            id: 14,
            eng: "Fun",
            ru: "веселье",
            hint: "/ фАн /"
        },
        {
            id: 15,
            eng: "Zombies",
            ru: "зомби",
            hint: "/ зОмбиз /"
        },
        {
            id: 16,
            eng: "Decorations",
            ru: "декорации",
            hint: "/ декорЭйшэнз /"
        },
        {
            id: 17,
            eng: "Horror",
            ru: "ужас",
            hint: "/ хОрор /"
        },
        {
            id: 18,
            eng: "Children",
            ru: "дети",
            hint: "/ чИлдрэн /"
        },

    ],

}
export default shortWordsData

// чтобы удалить пустые строки нужно ввести в CTRL+F или CTRL R
// ^\s*$\n
const shortWordsData = {
  universalSet: [
    { id: 1, eng: "I", ru: "я", hint: "/ ай /" },
    { id: 2, eng: "You", ru: "мы", hint: "/ ю /" },
    { id: 3, eng: "We", ru: "ты", hint: "/ ви /" },
    { id: 4, eng: "They", ru: "вы", hint: "/ дэй /" },
    { id: 5, eng: "He", ru: "он", hint: "/ хи /" },
    { id: 6, eng: "She", ru: "она", hint: "/ щи /" },
    { id: 7, eng: "It", ru: "оно", hint: "/ ит /" },
  ],


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

  popularIrregularVerbs: [
    { id: 1, eng: "forget", ru: "забывать" },
    { id: 2, eng: "have", ru: "иметь" },
    { id: 3, eng: "do", ru: "делать" },
    { id: 4, eng: "say", ru: "сказать" },
    { id: 5, eng: "go", ru: "идти" },
    { id: 6, eng: "get", ru: "получать" },
    { id: 7, eng: "make", ru: "делать" },
    { id: 8, eng: "know", ru: "знать" },
    { id: 9, eng: "think", ru: "думать" },
    { id: 10, eng: "take", ru: "брать" },
    { id: 11, eng: "see", ru: "видеть" },
    { id: 12, eng: "come", ru: "приходить" },
    { id: 13, eng: "find", ru: "находить" },
    { id: 14, eng: "give", ru: "давать" },
    { id: 15, eng: "tell", ru: "рассказывать" },
    { id: 16, eng: "become", ru: "становиться" },
    { id: 17, eng: "show", ru: "показывать" },
    { id: 18, eng: "leave", ru: "покидать" },
    { id: 19, eng: "feel", ru: "чувствовать" },
    { id: 20, eng: "put", ru: "класть" },
    { id: 21, eng: "bring", ru: "приносить" },
    { id: 22, eng: "begin", ru: "начинать" },
    { id: 23, eng: "keep", ru: "сохранять" },
    { id: 24, eng: "hold", ru: "держать" },
    { id: 25, eng: "write", ru: "писать" },
    { id: 26, eng: "stand", ru: "стоять" },
    { id: 27, eng: "hear", ru: "слышать" },
    { id: 28, eng: "let", ru: "позволять" },
    { id: 29, eng: "forgive", ru: "прощать" },
    { id: 30, eng: "freeze", ru: "замерзать" },
    { id: 31, eng: "meet", ru: "встречать" },
    { id: 32, eng: "run", ru: "бегать" },
    { id: 33, eng: "pay", ru: "платить" },
    { id: 34, eng: "sit", ru: "сидеть" },
    { id: 35, eng: "speak", ru: "говорить" },
    { id: 36, eng: "swear", ru: "материться, клянуться" },
    { id: 37, eng: "mishear", ru: "неправильно услышать" },
    { id: 38, eng: "read", ru: "читать" },
    { id: 39, eng: "grow", ru: "расти" },
    { id: 40, eng: "lose", ru: "терять" },
    { id: 41, eng: "fall", ru: "падать" },
    { id: 42, eng: "send", ru: "отправлять" },
    { id: 43, eng: "build", ru: "строить" },
    { id: 44, eng: "understand", ru: "понимать" },
    { id: 45, eng: "draw", ru: "рисовать" },
    { id: 46, eng: "break", ru: "ломать" },
    { id: 47, eng: "spend", ru: "тратить" },
    { id: 48, eng: "cut", ru: "резать" },

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
  introTapButtonWords: [

    { id: 1, eng: "Face", ru: "лицо" },
    { id: 2, eng: "Hair", ru: "волосы" },
    { id: 3, eng: "Eyes", ru: "глаза" },
    { id: 4, eng: "Nose", ru: "нос" },
    { id: 5, eng: "Mouth", ru: "рот" },
    { id: 6, eng: "Teeth", ru: "зубы" },
    { id: 7, eng: "Ears", ru: "уши" },
    { id: 8, eng: "Neck", ru: "шея" },
    { id: 9, eng: "Shoulders", ru: "плечи" },
    { id: 10, eng: "Arms", ru: "руки" },
    { id: 11, eng: "Hands", ru: "кисти рук" },
    { id: 12, eng: "Fingers", ru: "пальцы" },
    { id: 13, eng: "Legs", ru: "ноги" },
    { id: 14, eng: "Feet", ru: "ступни" },
    { id: 15, eng: "Tall", ru: "высокий" },
    { id: 16, eng: "Short", ru: "низкий" },
    { id: 17, eng: "Fat", ru: "толстый" },
    { id: 18, eng: "Thin", ru: "тонкий / худой" },
    { id: 19, eng: "Big", ru: "большой" },
    { id: 20, eng: "Small", ru: "маленький" },
    { id: 21, eng: "Young", ru: "молодой" },
    { id: 22, eng: "Old", ru: "старый" },
    { id: 23, eng: "Beautiful", ru: "красивый" },
    { id: 24, eng: "Ugly", ru: "некрасивый" },
    { id: 25, eng: "Cute", ru: "милый" },
    { id: 26, eng: "Pretty", ru: "симпатичная" },
    { id: 27, eng: "Smile", ru: "улыбка" },
    { id: 28, eng: "Dress", ru: "платье" },
    { id: 29, eng: "Shirt", ru: "рубашка" },
    { id: 30, eng: "T-shirt", ru: "футболка" },
    { id: 31, eng: "Pants", ru: "штаны" },
    { id: 32, eng: "Jeans", ru: "джинсы" },
    { id: 33, eng: "Skirt", ru: "юбка" },
    { id: 34, eng: "Shoes", ru: "обувь" },
    { id: 35, eng: "Socks", ru: "носки" },
    { id: 36, eng: "Hat", ru: "шляпа / кепка" },
    { id: 37, eng: "Cap", ru: "кепка" },
    { id: 38, eng: "Glasses", ru: "очки" },
    { id: 39, eng: "Coat", ru: "пальто" },
    { id: 40, eng: "Jacket", ru: "куртка" },
    { id: 41, eng: "Scarf", ru: "шарф" },
    { id: 42, eng: "Gloves", ru: "перчатки" },
    { id: 43, eng: "Belt", ru: "ремень" },
    { id: 44, eng: "Haircut", ru: "стрижка" },
    { id: 45, eng: "Beard", ru: "борода" },
    { id: 46, eng: "Mustache", ru: "усы" },
    { id: 47, eng: "Blonde", ru: "блондин" },
    { id: 48, eng: "Brown hair", ru: "каштановые волосы" },
    { id: 49, eng: "Hairy", ru: "волосатый" },
    { id: 50, eng: "Red hair", ru: "рыжие волосы" },
    { id: 51, eng: "Big", ru: "большой" },
    { id: 52, eng: "Small", ru: "маленький" },
    { id: 53, eng: "Tall", ru: "высокий" },
    { id: 54, eng: "Short", ru: "низкий / короткий" },
    { id: 55, eng: "Fat", ru: "толстый" },
    { id: 56, eng: "Thin", ru: "худой / тонкий" },
    { id: 57, eng: "Strong", ru: "сильный" },
    { id: 58, eng: "Weak", ru: "слабый" },
    { id: 59, eng: "Beautiful", ru: "красивый" },
    { id: 60, eng: "Ugly", ru: "некрасивый" },
    { id: 61, eng: "Cute", ru: "милый" },
    { id: 62, eng: "Pretty", ru: "симпатичная" },
    { id: 63, eng: "Handsome", ru: "красивый (о мужчине)" },
    { id: 64, eng: "Old", ru: "старый" },
    { id: 65, eng: "Young", ru: "молодой" },
    { id: 66, eng: "Happy", ru: "счастливый" },
    { id: 67, eng: "Sad", ru: "грустный" },
    { id: 68, eng: "Angry", ru: "сердитый" },
    { id: 69, eng: "Nice", ru: "милый / хороший" },
    { id: 70, eng: "Kind", ru: "добрый" },
    { id: 71, eng: "Funny", ru: "смешной" },
    { id: 72, eng: "Friendly", ru: "дружелюбный" },
    { id: 73, eng: "Clever", ru: "умный" },
    { id: 74, eng: "Lazy", ru: "ленивый" },
    { id: 75, eng: "Fast", ru: "быстрый" },
    { id: 76, eng: "Slow", ru: "медленный" },
    { id: 77, eng: "Quiet", ru: "тихий" },
    { id: 78, eng: "Loud", ru: "громкий" },
    { id: 79, eng: "Brave", ru: "смелый" },
    { id: 80, eng: "Shy", ru: "застенчивый" },
    { id: 81, eng: "Polite", ru: "вежливый" },
    { id: 82, eng: "Rude", ru: "грубый" },
    { id: 83, eng: "Clean", ru: "чистый" },
    { id: 84, eng: "Dirty", ru: "грязный" },
    { id: 85, eng: "Busy", ru: "занятой" },
    { id: 86, eng: "Tired", ru: "уставший" },
    { id: 87, eng: "Hungry", ru: "голодный" },
    { id: 88, eng: "Thirsty", ru: "хочет пить" },
    { id: 89, eng: "Good", ru: "хороший" },
    { id: 90, eng: "Bad", ru: "плохой" },
    { id: 91, eng: "Cool", ru: "классный / крутой" },
    { id: 92, eng: "Sweet", ru: "сладкий / милый" },
    { id: 93, eng: "Scary", ru: "страшный" },
    { id: 94, eng: "Sleepy", ru: "сонный" },
    { id: 95, eng: "Healthy", ru: "здоровый" },
    { id: 96, eng: "Sick", ru: "больной" },
    { id: 97, eng: "Smart", ru: "умный" },
    { id: 98, eng: "Clumsy", ru: "неуклюжий" },
    { id: 99, eng: "Friendly face", ru: "дружелюбное лицо" },
    { id: 100, eng: "Big smile", ru: "широкая улыбка" }
  ],


}
export default shortWordsData

// чтобы удалить пустые строки нужно ввести в CTRL+F или CTRL R
// ^\s*$\n
const shortWordsData = {

  introSetFindPairsHard: [
    { id: 2, eng: "thousand", ru: "тысяча", hint: "/ˈθaʊznd/" },
    { id: 3, eng: "hundred", ru: "сто", hint: "/хандрэд/" },
    { id: 4, eng: "fifteen", ru: "пятнадцать", hint: "/ фифтИн /" },
    { id: 5, eng: "fifty", ru: "пятьдесят", hint: "/ фИфти /" },

    { id: 6, eng: "seventeen", ru: "семнадцать", hint: "/ сэвэнтИн /" },
    { id: 7, eng: "seventy", ru: "семьдесят", hint: "/ сЭвэнти /" },
    { id: 8, eng: "eight", ru: "восемь", hint: "/ эйт /" },
    { id: 9, eng: "nine", ru: "девять", hint: "/ найн /" },
    { id: 11, eng: "twelve", ru: "двенадцать", hint: "/ тВэлв /" },
    { id: 12, eng: "twenty", ru: "двадцать", hint: "/ твЭнти /" }
  ],

  introSetSpellThis: [

  { id: 8, eng: "eight", ru: "восемь", hint: "/ эйт /" },
  { id: 100, eng: "hundred", ru: "сто", hint: "/ хандред /" },
  { id: 1000, eng: "thousand", ru: "тысяча", hint: "/ THаузэнд /" },


  ],

  introSetCutWires: [
    // Базовые вопросительные слова
    { id: 1, eng: "What", ru: "какой, что", hint: "/ уот /" },
    { id: 2, eng: "Where", ru: "где", hint: "/ уэ-э /" },
    { id: 3, eng: "When", ru: "когда", hint: "/ уэн /" },
    { id: 4, eng: "Why", ru: "почему", hint: "/ уай /" },
    { id: 5, eng: "Who", ru: "кто", hint: "/ ху /" },
    { id: 6, eng: "How", ru: "как", hint: "/ хау /" },

    // Уточняющие формы
    { id: 7, eng: "For whom", ru: "для кого (официально)", hint: "/ фо хум /" },
    { id: 8, eng: "Whose", ru: "чей", hint: "/ хуз /" },
    { id: 9, eng: "Which", ru: "который (из)", hint: "/ уич /" },

    // Вопросы о количестве
    { id: 10, eng: "How much", ru: "сколько (неисчисляемое)", hint: "/ хау мач /" },
    { id: 11, eng: "How many", ru: "сколько (исчисляемое)", hint: "/ хау мэни /" },

    // Вопросы о характеристиках
    { id: 12, eng: "What color", ru: "какого цвета", hint: "/ уот кала /" },
    { id: 13, eng: "What size", ru: "какого размера", hint: "/ уот сайз /" },
    { id: 14, eng: "What time", ru: "во сколько", hint: "/ уот тайм /" },
    { id: 15, eng: "What kind", ru: "какой вид", hint: "/ уот кайнд /" },
    { id: 16, eng: "What type", ru: "какой тип", hint: "/ уот тайп /" },

    // Вопросы о времени и расстоянии
    { id: 17, eng: "How long", ru: "как долго", hint: "/ хау лонг /" },
    { id: 18, eng: "How often", ru: "как часто", hint: "/ хау офэн /" },
    { id: 19, eng: "How far", ru: "как далеко", hint: "/ хау фар /" },
    { id: 20, eng: "How old", ru: "сколько лет, насколько стар", hint: "/ хау оулд /" },

    // Специальные вопросительные фразы
    { id: 21, eng: "How come", ru: "как так получилось", hint: "/ хау кам /" },
    { id: 22, eng: "What about", ru: "что насчёт", hint: "/ уот эбаут /" },
    { id: 23, eng: "What else", ru: "что ещё", hint: "/ уот элс /" },
    { id: 24, eng: "Why not", ru: "почему бы нет", hint: "/ уай нот /" },
    { id: 25, eng: "What for", ru: "для чего", hint: "/ уот фор /" },

    // Дополнительные полезные вопросы
    { id: 26, eng: "How about", ru: "как насчёт", hint: "/ хау эбаут /" },
    { id: 27, eng: "What's up", ru: "как дела (разг.)", hint: "/ уотс ап /" },
    { id: 28, eng: "How so", ru: "как так", hint: "/ хау соу /" },
    { id: 29, eng: "What if", ru: "что если", hint: "/ уот иф /" },
  ],

  universalSet: [
    { id: 1, eng: "I", ru: "я", hint: "/ ай /" },
    { id: 2, eng: "You", ru: "вы", hint: "/ ю /" },
    { id: 3, eng: "We", ru: "мы", hint: "/ ви /" },
    { id: 4, eng: "They", ru: "они", hint: "/ дэй /" },
    { id: 5, eng: "He", ru: "он", hint: "/ хи /" },
    { id: 6, eng: "She", ru: "она", hint: "/ щи /" },
    { id: 7, eng: "It", ru: "оно", hint: "/ ит /" },
  ],

  questionWords1: [
    { id: 1, eng: "What", ru: "что", hint: "/ уот /" },
    { id: 2, eng: "Where", ru: "где", hint: "/ уЭ-э /" },
    { id: 3, eng: "When", ru: "когда", hint: "/ уэн /" },
    { id: 4, eng: "Why", ru: "почему", hint: "/ уай /" },
    { id: 5, eng: "How", ru: "как", hint: "/ хау /" },
    { id: 6, eng: "How often", ru: "как часто", hint: "/ хау офэн /" },
    { id: 7, eng: "What color", ru: "какого цвета", hint: "/ уот кала /" },
    { id: 8, eng: "What size", ru: "какого размера", hint: "/ уот сайз /" },
    { id: 9, eng: "Who", ru: "кто", hint: "/ ху /" },
  ],

  questionWords2: [
    { id: 1, eng: "What", ru: "что, какой", hint: "/ уот /" },
    { id: 2, eng: "What color", ru: "какого цвета", hint: "/ уот кала /" },
    { id: 3, eng: "What size", ru: "какого размера", hint: "/ уот сайз /" },
    { id: 4, eng: "What time", ru: "во сколько", hint: "/ уот тайм /" },
    { id: 5, eng: "What type", ru: "какой тип", hint: "/ уот тайп ов /" },
    { id: 6, eng: "What kind", ru: "какой вид", hint: "/ уот кайнд ов /" },
    { id: 7, eng: "What for", ru: "для чего", hint: "/ уот фор /" },
    { id: 8, eng: "How", ru: "как", hint: "/ хау /" },
    { id: 9, eng: "How come", ru: "как так получилось", hint: "/ хау кам /" },
    { id: 10, eng: "How old", ru: "какой возраст, сколько лет, насколько стар", hint: "/ хау олд /" },
    { id: 11, eng: "Whose", ru: "чей", hint: "/ хуз /" },

  ],

  questionWords3: [
    { id: 1, eng: "Which", ru: "который", hint: "/ уич /" },
    { id: 2, eng: "How much", ru: "сколько (неисчисляемое)", hint: "/ хау мач /" },
    { id: 3, eng: "How many", ru: "сколько (исчисляемое)", hint: "/ хау мэни /" },
    { id: 4, eng: "How long", ru: "как долго", hint: "/ хау лонг /" },
    { id: 5, eng: "How often", ru: "как часто", hint: "/ хау офэн /" },
    { id: 6, eng: "How far", ru: "как далеко", hint: "/ хау фар /" },
    { id: 7, eng: "How come", ru: "как так получилось", hint: "/ хау кам /" },
    { id: 8, eng: "What about", ru: "что насчёт", hint: "/ уот эбаут /" },
    { id: 9, eng: "What else", ru: "что ещё", hint: "/ уот элс /" },
    { id: 10, eng: "Why not", ru: "почему бы нет", hint: "/ уай нот /" }
  ],


  questionWordsAll: [
    // Базовые вопросительные слова (5W1H)
    { id: 1, eng: "What", ru: "что, какой", hint: "/ уот /" },
    { id: 2, eng: "Where", ru: "где", hint: "/ уэ-э /" },
    { id: 3, eng: "When", ru: "когда", hint: "/ уэн /" },
    { id: 4, eng: "Why", ru: "почему", hint: "/ уай /" },
    { id: 5, eng: "Who", ru: "кто", hint: "/ ху /" },
    { id: 6, eng: "How", ru: "как", hint: "/ хау /" },

    // Уточняющие формы
    { id: 7, eng: "For whom", ru: "для кого (официально)", hint: "/ фо хум /" },
    { id: 8, eng: "Whose", ru: "чей", hint: "/ хуз /" },
    { id: 9, eng: "Which", ru: "который (из)", hint: "/ уич /" },

    // Вопросы о количестве
    { id: 10, eng: "How much", ru: "сколько (неисчисляемое)", hint: "/ хау мач /" },
    { id: 11, eng: "How many", ru: "сколько (исчисляемое)", hint: "/ хау мэни /" },

    // Вопросы о характеристиках
    { id: 12, eng: "What color", ru: "какого цвета", hint: "/ уот кала /" },
    { id: 13, eng: "What size", ru: "какого размера", hint: "/ уот сайз /" },
    { id: 14, eng: "What time", ru: "во сколько", hint: "/ уот тайм /" },
    { id: 15, eng: "What kind", ru: "какой вид", hint: "/ уот кайнд /" },
    { id: 16, eng: "What type", ru: "какой тип", hint: "/ уот тайп /" },

    // Вопросы о времени и расстоянии
    { id: 17, eng: "How long", ru: "как долго", hint: "/ хау лонг /" },
    { id: 18, eng: "How often", ru: "как часто", hint: "/ хау офэн /" },
    { id: 19, eng: "How far", ru: "как далеко", hint: "/ хау фар /" },
    { id: 20, eng: "How old", ru: "сколько лет", hint: "/ хау оулд /" },

    // Специальные вопросительные фразы
    { id: 21, eng: "How come", ru: "как так получилось", hint: "/ хау кам /" },
    { id: 22, eng: "What about", ru: "что насчёт", hint: "/ уот эбаут /" },
    { id: 23, eng: "What else", ru: "что ещё", hint: "/ уот элс /" },
    { id: 24, eng: "Why not", ru: "почему бы нет", hint: "/ уай нот /" },
    { id: 25, eng: "What for", ru: "для чего", hint: "/ уот фор /" },

    // Дополнительные полезные вопросы
    { id: 26, eng: "How about", ru: "как насчёт", hint: "/ хау эбаут /" },
    { id: 27, eng: "What's up", ru: "как дела (разг.)", hint: "/ уотс ап /" },
    { id: 28, eng: "How so", ru: "как так", hint: "/ хау соу /" },
    { id: 29, eng: "What if", ru: "что если", hint: "/ уот иф /" },

  ],




  devModeNumbersFast: [
    { id: 3, eng: "three", ru: "три", hint: "/ THри /" },
    { id: 8, eng: "eight", ru: "восемь", hint: "/ эйт /" },
    { id: 29, eng: "hundred", ru: "сто", hint: "/ хандред /" },
    { id: 30, eng: "thousand", ru: "тысяча", hint: "/ THаузэнд /" },
    { id: 28, eng: "Test word delete after using this ", ru: "как так djnd kjkajskj dsd", hint: "/ хау соу /" },

  ],
  randomSet: [

    // Вопросительные слова
    { id: 1, en: "What", ru: "что" },
    { id: 2, en: "Where", ru: "где" },
    { id: 3, en: "Why", ru: "почему" },

    // Внешность (Appearance)
    { id: 4, en: "beautiful", ru: "красивая" },
    { id: 5, en: "handsome", ru: "красивый" },
    { id: 6, en: "tall", ru: "высокий" },
    { id: 7, en: "short", ru: "низкий" },
    { id: 8, en: "curly hair", ru: "кудрявые волосы" },

    // Части тела (Parts of the Body)
    { id: 9, en: "head", ru: "голова" },
    { id: 10, en: "nose", ru: "нос" },
    { id: 11, en: "eyes", ru: "глаза" },
    { id: 12, en: "fingers", ru: "пальцы" },

    // Характер (Character)
    { id: 13, en: "kind", ru: "добрый" },
    { id: 14, en: "unkind", ru: "злой" },
    { id: 15, en: "angry", ru: "сердитый" },
    { id: 16, en: "happy", ru: "счастливый" },
    { id: 17, en: "sad", ru: "грустный" },
    { id: 18, en: "clever", ru: "умный" },
    { id: 19, en: "silly", ru: "глупый" },
    { id: 20, en: "polite", ru: "вежливый" },
    { id: 21, en: "shy", ru: "стеснительный" },
    { id: 22, en: "calm", ru: "спокойный" },
    { id: 23, en: "friendly", ru: "дружелюбный" },
    { id: 24, en: "strong", ru: "сильный" },
    { id: 25, en: "weak", ru: "слабый" },

    // Дополнительные популярные слова
    { id: 26, en: "brave", ru: "храбрый" },
    { id: 27, en: "honest", ru: "честный" },
    { id: 28, en: "funny", ru: "смешной" },
    { id: 29, en: "serious", ru: "серьёзный" },
    { id: 30, en: "creative", ru: "креативный" },
    { id: 31, en: "patient", ru: "терпеливый" },

    // Профессии (Jobs)
    { id: 32, en: "driver", ru: "водитель" },
    { id: 33, en: "doctor", ru: "врач" },
    { id: 34, en: "teacher", ru: "учитель" },

    // Действия (Actions)
    { id: 35, en: "smile", ru: "улыбаться" },
    { id: 36, en: "run", ru: "бегать" },
    { id: 37, en: "swim", ru: "плавать" },

    // Фразы для общения
    { id: 38, en: "Hello!", ru: "Привет!" },
    { id: 39, en: "Thank you!", ru: "Спасибо!" },
    { id: 40, en: "Goodbye!", ru: "Пока!" },
    { id: 41, eng: "how long", ru: "как долго", hint: "/ хау лонг /" },
    { id: 42, eng: "when", ru: "когда", hint: "/ уэн /" },
    { id: 43, eng: "how often", ru: "как часто", hint: "" },
    { id: 44, eng: "who", ru: "кто", hint: "" },


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
        { id: 11, eng: "eleven", ru: "одиннадцать", hint: "/ илЭвэн /" },
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
  teenTy: [
    { id: 8, eng: "eight", ru: "восемь", hint: "/ эйт /" },
    { id: 11, eng: "eleven", ru: "одиннадцать", hint: "/ илЭвэн /" },
    { id: 12, eng: "twelve", ru: "двенадцать", hint: "/ туэлв /" },
    { id: 13, eng: "thirteen", ru: "тринадцать", hint: "/ THётин /" },
    { id: 19, eng: "nineteen", ru: "девятнадцать", hint: "/ найнтиН /" },
    { id: 20, eng: "twenty", ru: "двадцать", hint: "/ твэнти /" },
    { id: 30, eng: "thirty", ru: "тридцать", hint: "/  THёрти /" },
    { id: 15, eng: "fifteen", ru: "пятнадцать", hint: "/ фифтин /" },
    { id: 100, eng: "hundred", ru: "сто" },
    { id: 1000, eng: "thousand", ru: "тысяча", hint: "/ THаузэнд /" },
    { id: 90, eng: "ninety", ru: "девяносто", hint: "/ нАйнти /" },


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
  clothes: [
    // Level A (A1, A2)
    { id: 1, eng: "hat", ru: "шляпа", EnglishLevel: "A" },
    { id: 2, eng: "cap", ru: "кепка", EnglishLevel: "A" },
    { id: 3, eng: "scarf", ru: "шарф", EnglishLevel: "A" },
    { id: 4, eng: "gloves", ru: "перчатки", EnglishLevel: "A" },
    { id: 5, eng: "jacket", ru: "куртка", EnglishLevel: "A" },
    { id: 6, eng: "coat", ru: "пальто", EnglishLevel: "A" },
    { id: 7, eng: "sweater", ru: "свитер", EnglishLevel: "A" },
    { id: 8, eng: "shirt", ru: "рубашка", EnglishLevel: "A" },
    { id: 9, eng: "t-shirt", ru: "футболка", EnglishLevel: "A" },
    { id: 10, eng: "jeans", ru: "джинсы", EnglishLevel: "A" },
    { id: 11, eng: "trousers", ru: "брюки", EnglishLevel: "A" },
    { id: 12, eng: "pants", ru: "штаны (амер.)", EnglishLevel: "A" },
    { id: 13, eng: "shorts", ru: "шорты", EnglishLevel: "A" },
    { id: 14, eng: "skirt", ru: "юбка", EnglishLevel: "A" },
    { id: 15, eng: "dress", ru: "платье", EnglishLevel: "A" },
    { id: 16, eng: "underwear", ru: "нижнее белье", EnglishLevel: "A" },
    { id: 17, eng: "socks", ru: "носки", EnglishLevel: "A" },
    { id: 18, eng: "tights", ru: "колготки", EnglishLevel: "A" },
    { id: 19, eng: "boots", ru: "ботинки", EnglishLevel: "A" },
    { id: 20, eng: "shoes", ru: "туфли", EnglishLevel: "A" },
    { id: 21, eng: "sneakers", ru: "кроссовки", EnglishLevel: "A" },
    { id: 22, eng: "slippers", ru: "тапочки", EnglishLevel: "A" },
    { id: 23, eng: "belt", ru: "ремень", EnglishLevel: "A" },
    { id: 24, eng: "pocket", ru: "карман", EnglishLevel: "A" },
    { id: 25, eng: "buttons", ru: "пуговицы", EnglishLevel: "A" },
    { id: 26, eng: "hood", ru: "капюшон", EnglishLevel: "A" },
    { id: 28, eng: "swimsuit", ru: "купальник", EnglishLevel: "A" },
    { id: 29, eng: "bag", ru: "сумка", EnglishLevel: "A" },
    { id: 31, eng: "backpack", ru: "рюкзак", EnglishLevel: "A" },
    { id: 32, eng: "wallet", ru: "бумажник", EnglishLevel: "A" },
    { id: 33, eng: "umbrella", ru: "зонтик", EnglishLevel: "A" },
    { id: 34, eng: "watch", ru: "наручные часы", EnglishLevel: "A" },
    { id: 35, eng: "ring", ru: "кольцо", EnglishLevel: "A" },
    { id: 36, eng: "glasses", ru: "очки", EnglishLevel: "A" },
    { id: 37, eng: "sunglasses", ru: "солнцезащитные очки", EnglishLevel: "A" },
    { id: 39, eng: "style", ru: "стиль", EnglishLevel: "A" },
    { id: 40, eng: "jewellery", ru: "ювелирные изделия", EnglishLevel: "B" },


    // Level B (B1, B2)
    { id: 41, eng: "hoodie", ru: "толстовка с капюшоном", EnglishLevel: "B" },
    { id: 42, eng: "jumper", ru: "джемпер", EnglishLevel: "B" },
    { id: 45, eng: "suit", ru: "костюм", EnglishLevel: "B" },
    { id: 46, eng: "tie", ru: "галстук", EnglishLevel: "B" },
    { id: 47, eng: "bow tie", ru: "бабочка", EnglishLevel: "B" },
    { id: 48, eng: "tank top", ru: "майка", EnglishLevel: "B" },
    { id: 49, eng: "blouse", ru: "блузка", EnglishLevel: "B" },
    { id: 50, eng: "leggings", ru: "леггинсы", EnglishLevel: "B" },
    { id: 52, eng: "overalls", ru: "комбинезон", EnglishLevel: "B" },
    { id: 53, eng: "bra", ru: "бюстгальтер", EnglishLevel: "B" },
    { id: 54, eng: "panties", ru: "трусики", EnglishLevel: "B" },
    { id: 56, eng: "stockings", ru: "чулки", EnglishLevel: "B" },
    { id: 57, eng: "sandals", ru: "сандалии", EnglishLevel: "B" },
    { id: 58, eng: "flip-flops", ru: "шлепанцы", EnglishLevel: "B" },
    { id: 59, eng: "heels", ru: "туфли на каблуке", EnglishLevel: "B" },
    { id: 60, eng: "zipper", ru: "молния", EnglishLevel: "B" },
    { id: 61, eng: "laces", ru: "шнурки", EnglishLevel: "B" },
    { id: 62, eng: "collar", ru: "воротник", EnglishLevel: "B" },
    { id: 64, eng: "rain coat", ru: "дождевик", EnglishLevel: "B" },
    { id: 65, eng: "vest", ru: "жилет", EnglishLevel: "B" },
    { id: 68, eng: "outfit", ru: "наряд", EnglishLevel: "B" },

    { id: 72, eng: "earrings", ru: "серьги", EnglishLevel: "B" },
    { id: 73, eng: "necklace", ru: "ожерелье", EnglishLevel: "B" },
    { id: 74, eng: "bracelet", ru: "браслет", EnglishLevel: "B" },
    { id: 75, eng: "purse", ru: "кошелек (брит.)", EnglishLevel: "B" },
    { id: 76, eng: "helmet", ru: "шлем", EnglishLevel: "B" },
    { id: 78, eng: "robe", ru: "халат", EnglishLevel: "B" },

    // Level C (C1, C+)
    { id: 81, eng: "attire", ru: "облачение", EnglishLevel: "C" },
    { id: 83, eng: "windbreaker", ru: "ветровка", EnglishLevel: "C" },
    { id: 84, eng: "cloak", ru: "плащ", EnglishLevel: "C" },
    { id: 88, eng: "gown", ru: "халат/мантия", EnglishLevel: "C" },
    { id: 89, eng: "veil", ru: "вуаль/фата", EnglishLevel: "C" },
    { id: 91, eng: "tuxedo", ru: "смокинг", EnglishLevel: "C" },
    { id: 92, eng: "cape", ru: "накидка", EnglishLevel: "C" },
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
    { id: 36, eng: "swear", ru: "материться" },
    { id: 37, eng: "tell a lie", ru: "лгать" },
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

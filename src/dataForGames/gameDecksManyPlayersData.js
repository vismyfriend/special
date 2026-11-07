// src/dataForGames/gameDecksManyPlayersData.js
// deckOne  — вопросы (что игрок «тянет» из левой колоды)
// deckTwo  — ответы (что игроки «тянут» из правой колоды)
// backTitleOne / backTitleTwo — что написано на рубашках колод

const gameDecksManyPlayersData = {
  developerSet: {
    backTitleOne: 'Questions',
    backTitleTwo: 'Answers',

    // ============================================================
    // КОЛОДА 1 — ВОПРОСЫ
    // ============================================================
    deckOne: [
      // --- домашние дела ---
      { id: 1,  eng: 'iron clothes',           ru: 'гладить одежду',              hint: '/ айрон клоуз /' },
      { id: 2,  eng: 'make the bed',           ru: 'заправлять кровать',          hint: '/ мэйк зэ бэд /' },
      { id: 3,  eng: 'go shopping',            ru: 'ходить по магазинам',         hint: '/ гоу шопинг /' },
      { id: 4,  eng: 'do the dishes',          ru: 'мыть посуду',                 hint: '/ ду зэ дишэз /' },
      { id: 5,  eng: 'do the laundry',         ru: 'стирать бельё',               hint: '/ ду зэ лон-дри /' },
      { id: 6,  eng: 'vacuum the floor',       ru: 'пылесосить пол',              hint: '/ вакьюм зэ флор /' },
      { id: 7,  eng: 'sweep the floor',        ru: 'подметать пол',               hint: '/ свип зэ флор /' },
      { id: 8,  eng: 'mop the floor',          ru: 'мыть пол',                    hint: '/ моп зэ флор /' },
      { id: 9,  eng: 'clean the bathroom',     ru: 'убирать ванную',              hint: '/ клин зэ баthрум /' },
      { id: 10, eng: 'clean the windows',      ru: 'мыть окна',                   hint: '/ клин зэ уиндоуз /' },
      { id: 11, eng: 'take out the trash',     ru: 'выносить мусор',              hint: '/ тэйк аут зэ трэш /' },
      { id: 12, eng: 'water the plants',       ru: 'поливать растения',           hint: '/ вотэр зэ плэнтс /' },
      { id: 13, eng: 'feed the cat',           ru: 'кормить кота',                hint: '/ фид зэ кэт /' },
      { id: 14, eng: 'walk the dog',           ru: 'гулять с собакой',            hint: '/ вок зэ дог /' },
      { id: 15, eng: 'cook dinner',            ru: 'готовить ужин',               hint: '/ кук динэр /' },
      { id: 16, eng: 'wash the car',           ru: 'мыть машину',                 hint: '/ вош зэ кар /' },
      { id: 17, eng: 'go to the gym',          ru: 'ходить в спортзал',           hint: '/ гоу ту зэ джим /' },
      { id: 18, eng: 'watch TV',               ru: 'смотреть телевизор',          hint: '/ вотч ти-ви /' },
      { id: 19, eng: 'read books',             ru: 'читать книги',                hint: '/ рид букс /' },
      { id: 20, eng: 'play football',          ru: 'играть в футбол',             hint: '/ плэй футбол /' },
      { id: 21, eng: 'meet my friends',        ru: 'встречаться с друзьями',      hint: '/ мит май фрэндз /' },
      { id: 22, eng: 'visit my grandma',       ru: 'навещать бабушку',            hint: '/ визит май грэнма /' },
      { id: 23, eng: 'go to the park',         ru: 'ходить в парк',               hint: '/ гоу ту зэ парк /' },
      { id: 24, eng: 'buy new clothes',        ru: 'покупать новую одежду',       hint: '/ бай нью клоуз /' },
      { id: 25, eng: 'study English',          ru: 'учить английский',            hint: '/ стади инглиш /' },
      { id: 26, eng: 'wash the dishes',        ru: 'мыть посуду',                 hint: '/ вош зэ дишэз /' },
      { id: 27, eng: 'take a shower',          ru: 'принимать душ',               hint: '/ тэйк э шауэр /' },
      { id: 28, eng: 'brush my teeth',         ru: 'чистить зубы',                hint: '/ браш май тиth /' },
      { id: 29, eng: 'eat out',                ru: 'есть в кафе/ресторане',       hint: '/ ит аут /' },
      { id: 30, eng: 'sleep late',             ru: 'поздно вставать',             hint: '/ слип лэйт /' },

      // --- твои вопросы из чата ---
      { id: 31, eng: 'How often do you work?', ru: 'Как часто ты работаешь?',     hint: '/ хау офтэн ду ю ворк /' },
      { id: 32, eng: 'How often do you sing?', ru: 'Как часто ты поёшь?',         hint: '/ хау офтэн ду ю синг /' },
    ],

    // ============================================================
    // КОЛОДА 2 — ОТВЕТЫ
    // ============================================================
    deckTwo: [
      // --- частотность ---
      { id: 1,  eng: 'always',                 ru: 'всегда',                      hint: '/ олвэйз /' },
      { id: 2,  eng: 'almost always',          ru: 'почти всегда',                hint: '/ олмоуст олвэйз /' },
      { id: 3,  eng: 'usually',                ru: 'обычно',                      hint: '/ южуэли /' },
      { id: 4,  eng: 'often',                  ru: 'часто',                       hint: '/ офтэн /' },
      { id: 5,  eng: 'not often',              ru: 'не часто',                    hint: '/ нот офтэн /' },
      { id: 6,  eng: 'sometimes',              ru: 'иногда',                      hint: '/ самтаймз /' },
      { id: 7,  eng: 'seldom',                 ru: 'редко',                       hint: '/ сэлдом /' },
      { id: 8,  eng: 'rarely',                 ru: 'изредка',                     hint: '/ рэрли /' },
      { id: 9,  eng: 'never',                  ru: 'никогда',                     hint: '/ нэвэр /' },
      { id: 10, eng: 'almost never',           ru: 'почти никогда',               hint: '/ олмоуст нэвэр /' },
      { id: 11, eng: 'almost every day',       ru: 'почти каждый день',           hint: '/ олмоуст эври дэй /' },
      { id: 12, eng: 'every day',              ru: 'каждый день',                 hint: '/ эври дэй /' },
      { id: 13, eng: 'every night',            ru: 'каждую ночь',                 hint: '/ эври найт /' },
      { id: 14, eng: 'every week',             ru: 'каждую неделю',               hint: '/ эври уик /' },
      { id: 15, eng: 'every month',            ru: 'каждый месяц',                hint: '/ эври манth /' },
      { id: 16, eng: 'every year',             ru: 'каждый год',                  hint: '/ эври ер /' },
      { id: 17, eng: 'every morning',          ru: 'каждое утро',                 hint: '/ эври морнинг /' },
      { id: 18, eng: 'every evening',          ru: 'каждый вечер',                hint: '/ эври ивнинг /' },
      { id: 19, eng: 'every weekend',          ru: 'каждые выходные',             hint: '/ эври уикэнд /' },

      // --- сколько раз ---
      { id: 20, eng: 'one time a year',        ru: 'один раз в год',              hint: '/ уан тайм э ер /' },
      { id: 21, eng: 'two times a year',       ru: 'два раза в год',              hint: '/ ту таймз э ер /' },
      { id: 22, eng: 'three times a day',      ru: 'три раза в день',             hint: '/ thри таймз э дэй /' },
      { id: 23, eng: 'four times a month',     ru: 'четыре раза в месяц',         hint: '/ фор таймз э манth /' },
      { id: 24, eng: 'five times a week',      ru: 'пять раз в неделю',           hint: '/ файв таймз э уик /' },
      { id: 25, eng: 'six days a week',        ru: 'шесть дней в неделю',         hint: '/ сикс дэйз э уик /' },
      { id: 26, eng: 'seven days a week',      ru: 'семь дней в неделю',          hint: '/ сэвэн дэйз э уик /' },
      { id: 27, eng: 'eight hours a day',      ru: 'восемь часов в день',         hint: '/ эйт ауэрз э дэй /' },
      { id: 28, eng: 'nine months a year',     ru: 'девять месяцев в год',        hint: '/ найм манths э ер /' },
      { id: 29, eng: 'twenty-four hours a day',ru: '24 часа в сутки',             hint: '/ твэнти фор ауэрз э дэй /' },

      // --- весь день / всю ночь ---
      { id: 30, eng: 'all day',                ru: 'весь день',                   hint: '/ ол дэй /' },
      { id: 31, eng: 'all night',              ru: 'всю ночь',                    hint: '/ ол найт /' },
      { id: 32, eng: 'all morning',            ru: 'всё утро',                    hint: '/ ол морнинг /' },
      { id: 33, eng: 'all evening',            ru: 'весь вечер',                  hint: '/ ол ивнинг /' },
      { id: 34, eng: 'all week',               ru: 'всю неделю',                  hint: '/ ол уик /' },
      { id: 35, eng: 'all weekend',            ru: 'все выходные',                hint: '/ ол уикэнд /' },
      { id: 36, eng: 'all month',              ru: 'весь месяц',                  hint: '/ ол манth /' },
      { id: 37, eng: 'all year',               ru: 'весь год',                    hint: '/ ол ер /' },

      // --- части дня ---
      { id: 38, eng: 'in the morning',         ru: 'утром',                       hint: '/ ин зэ морнинг /' },
      { id: 39, eng: 'in the afternoon',       ru: 'днём',                        hint: '/ ин зэ афтэрнун /' },
      { id: 40, eng: 'in the evening',         ru: 'вечером',                     hint: '/ ин зэ ивнинг /' },
      { id: 41, eng: 'at night',               ru: 'ночью',                       hint: '/ эт найт /' },
      { id: 42, eng: 'at midnight',            ru: 'в полночь',                   hint: '/ эт миднайт /' },
    ],
  },

  // Пример второй миссии — как добавлять новый набор:
  // halloween: {
  //   backTitleOne: 'Spooky Questions',
  //   backTitleTwo: 'Spooky Answers',
  //   deckOne: [...],
  //   deckTwo: [...],
  // },
};

export default gameDecksManyPlayersData;

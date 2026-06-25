const engBooksData = {
  componentBookManualDocumentation: {
    id: 'componentBookManualDocumentation',
    mainTitleOfTheText: "📖 Библиотека примеров",
    author: "Vincent & Polina",
    chapters: [
       {
        title: "1. Жирный, курсив и подчеркивание ((Bold, Italic and Underline))",
        content: `Это пример <strong>жирного текста</strong> (strong). Используется для выделения важных слов.

Это пример <em>курсивного текста</em> (em).((this is an example of cursive)) Используется для акцента или иностранных слов.

Это пример <u>подчеркнутого текста</u> (u). Используется для указания на что-то важное.

Комбинация: <strong><em>жирный + курсив</em></strong> и <u><em>подчеркнутый + курсив</em></u>.`
      },
      {
        title: "2. Выделение цветом и фоном ((Color and Background Highlight))",
        content: `Это пример <span style="color: #ff6b35;">текста оранжевого цвета</span>.

Это пример <span style="color: #4CAF50;">текста зеленого цвета</span>.

Это пример <span style="color: #2196F3;">текста синего цвета</span>.

Это пример <span style="background: #ffdd57; padding: 0 4px; border-radius: 3px;">текста с желтым фоном</span>.

Это пример <span style="background: #ff6b35; color: white; padding: 0 4px; border-radius: 3px;">текста с оранжевым фоном</span>.`
      },
      {
        title: "3. Выделение маркером ((Mark Highlight))",
        content: `Это пример <mark>текста выделенного маркером</mark> (mark).

Можно выделять <mark>важные фрагменты</mark> в тексте, чтобы <mark>привлечь внимание</mark> читателя.

В темной теме маркер остается желтым, но текст становится темнее для контраста.`
      },
      {
        title: "4. Списки с маркерами ((Bullet Lists))",
        content: `В тексте можно использовать списки с маркерами. Для этого нужно начинать строку с символа • (Option+8 на Mac или Alt+7 на Windows):

• Первый пункт списка((First bullet point))
• Второй пункт списка((Second bullet point))
• Третий пункт списка с <strong>жирным</strong> текстом((Third bullet point with bold text))

Каждый пункт автоматически отображается с новой строки и с отступом.`
      },
      {
        title: "5. Перевод предложений ((Sentence Translation))",
        content: `Для перевода предложений используется специальный синтаксис:

Английский текст((Перевод на русский язык))

Например:
Welcome to the revolution.((Добро пожаловать в революцию.))

<strong>Важно:</strong> перевод отображается при клике на предложение.`

      },
      {
        title: "6. Комбинирование стилей ((Combining Styles))",
        content: `Можно комбинировать разные стили в одном предложении:

<strong><em><span style="color: #ff6b35;">Важное и выделенное</span></em></strong> слово в тексте.

<mark><strong><u>Максимальное выделение</u></strong></mark> для самых важных моментов.

<span style="background: #ffdd57; padding: 0 4px; border-radius: 3px;"><strong><em>Жирный курсив на желтом фоне</em></strong></span>.`
      },
      {
        title: "7. Заголовки и структура ((Headers and Structure))",
        content: `Заголовки глав автоматически отображаются крупным шрифтом.

Их тоже можно переводить:
How This Changed Brian Tracy's Life((Как это изменило жизнь Брайана Трейси))

Заголовки <strong>не</strong> имеют подчеркивания по умолчанию, но становятся кликабельными при наведении.`
      },
      {
        title: "8. Технические детали ((Technical Details))",
        content: `📌 <strong>Как это работает:</strong>

• Текст хранится в data с HTML-тегами
• Для отображения используется v-html
• Все стили описаны в CSS

📌 <strong>Доступные теги:</strong>

• <strong>strong</strong> — жирный текст
• <em>em</em> — курсив
• <u>u</u> — подчеркивание
• <mark>mark</mark> — выделение маркером
• <span style="...">span</span> — произвольные стили

📌 <strong>Синтаксис перевода:</strong>
Английский текст((Перевод на русский))

📌 <strong>Маркированные списки:</strong>
• Пункт списка((Перевод пункта))`
      }
    ]
  },

  learningRevolution: {
    mainTitleOfTheText: "THE LEARNING REVOLUTION",
    author: "By Brian Tracy & Colin Rose",
    chapters: [
      {
        title: null,
        content: `Welcome to the revolution.((Добро пожаловать в революцию.)) We've entered into the most <em>turbulent</em> time in all of human history, with changes happening more often, more rapidly, and more unpredictably than ever before.((Мы вступили в самое неспокойное время во всей истории человечества, когда перемены происходят чаще, быстрее и непредсказуемее, чем когда-либо прежде.)) And the only thing we know about the future is that it will be faster, changing, and more unpredictable than the present.((И единственное, что мы знаем о будущем — оно будет быстрее, изменчивее и непредсказуемее, чем настоящее.))

Your job is to learn how to survive and thrive in the months and years ahead, and this program is designed to help you do exactly that.((Ваша задача — научиться выживать и процветать в предстоящие месяцы и годы, и эта программа создана, чтобы помочь вам именно в этом.))`
      },
      {
        title: "From Failure to Success ((От провала к успеху))",
        content: `I have studied, practiced, and taught in the area of human potential development for more than 30 years.((Я изучал, практиковал и преподавал в области развития человеческого потенциала более 30 лет.))

I left high school without graduating and worked at laboring jobs, drifting from place to place until well into my 20s.((Я бросил школу, не закончив её, и работал на работах требующих физической активности, скитаясь с места на место до глубоких двадцати лет.)) The turning point came for me when I was about 24.((Поворотный момент наступил, когда мне было около 24 лет.)) I began to ask the question:((Я начал задавать вопрос:))

"Why is it that some people are more successful than others?"((«Почему одни люди более успешны, чем другие?»))

Why is it that some people make more money, have nicer homes and cars, and enjoy better lives and relationships, have better health and seem to get far more satisfaction out of life?((Почему некоторые люди зарабатывают больше денег, имеют более красивые дома и машины, наслаждаются лучшей жизнью и отношениями, имеют лучшее здоровье и, кажется, получают гораздо больше удовлетворения от жизни?))

And at the same time, why is it that the great majority are frustrated and unhappy with their current levels of achievement?((И в то же время, почему подавляющее большинство разочарованы и недовольны своим текущим уровнем достижений?)) Why is it that so few people realize their full potentials for living?((Почему так мало людей реализуют свой полный жизненный потенциал?))`
      },
      {
        title: "The First Breakthrough: The Success Secret",
        content: `The Bible says:((В Библии сказано:))

"Seek and ye shall find, for all who seek findeth."((«Ищите и найдете, ибо всякий ищущий находит.»))

Searching for the answer to the question about success led to my first breakthrough.((Поиски ответа на вопрос об успехе привели к моему первому прорыву.)) I learned that:((Я понял, что:))

If you could find out what the most successful people did in any area, and then you did the same thing over and over, you would eventually get the same results as they do.((Если бы вы могли узнать, что делали самые успешные люди в любой области, и затем делали бы то же самое снова и снова, вы бы в итоге получили те же результаты, что и они.))

This idea is so simple that most people have passed it over without noticing it.((Эта идея настолько проста, что большинство людей прошли мимо, не заметив её.)) Yet in every field, the people at the top were once at the bottom.((И всё же в каждой области люди на вершине когда-то были внизу.)) When they were at the bottom, they studied the people at the top and they did what they were doing.((Когда они были внизу, они изучали людей на вершине и делали то, что делали они.)) As a result, they moved ahead rapidly and eventually they were at the top themselves.((В результате они быстро продвигались вперед и в конце концов сами оказывались на вершине.))

Their success had very little to do with luck or being at the right place at the right time.((Их успех имел очень мало общего с удачей или оказанием в нужном месте в нужное время.)) People create their own success by learning what they need to learn and then by practicing it until they become proficient at it.((Люди создают свой собственный успех, изучая то, что им нужно изучить, и затем практикуя это до тех пор, пока не становятся в этом искусными.)) It's no miracle.((Это не чудо.))`
      },
      {
        title: "How This Changed Brian Tracy's Life",
        content: `In Sales:((В продажах:))

This discovery changed my life.((Это открытие изменило мою жизнь.)) I had been spinning my wheels in sales for a year.((Я топтался на месте в продажах в течение года.)) When I learned this secret, I immediately began:((Когда я узнал этот секрет, я немедленно начал:))

• Interviewing the top salespeople((• Интервьюировать лучших продавцов))
• Reading books written by the top salespeople((• Читать книги, написанные лучшими продавцами))
• Listening to audio tapes produced by top salespeople((• Слушать аудиозаписи, созданные лучшими продавцами))
• Attending seminars given by top salespeople((• Посещать семинары, проводимые лучшими продавцами))

In one more year, I was at the top of my sales force and earning more money than I'd ever dreamed possible.((Ещё через год я был на вершине моего отдела продаж и зарабатывал больше денег, чем когда-либо мог мечтать.))

As a Sales Manager:((Как менеджер по продажам:))

I applied the same principles:((Я применил те же принципы:))

- I talked to other successful sales managers((• Я разговаривал с другими успешными менеджерами по продажам))
- I read books on management((• Я читал книги по управлению))
- I listened to tapes and took courses on management((• Я слушал записи и проходил курсы по управлению))

In no time, I had 95 people working for me, and I was in charge of six countries.((В мгновение ока у меня работало 95 человек, и я отвечал за шесть стран.)) The amount of money I was earning was more than I had ever expected.((Сумма денег, которую я зарабатывал, была больше, чем я когда-либо ожидал.))

In Real Estate Development((В сфере развития недвижимости)) I applied the same principles:((Я применил те же принципы:))

• I read all the books, articles, and magazines I could find((• Я прочитал все книги, статьи и журналы, которые мог найти))
• I talked to other people who were successful in real estate development((• Я разговаривал с другими людьми, которые были успешны в развитии недвижимости))
• I attended lectures given by experts in real estate((• Я посещал лекции экспертов в сфере недвижимости))
• I took courses and got a real estate license((• Я проходил курсы и получил лицензию на недвижимость))

Over the next few years, I bought, developed, leased, sold, and otherwise disposed of more than $50 million worth of real estate.((В течение следующих нескольких лет я купил, развил, сдал в аренду, продал и иным образом распорядился недвижимостью на сумму более 50 миллионов долларов.))

I moved from a rented apartment to a condominium, to a home, to an even bigger home.((Я переехал из съемной квартиры в кондоминиум, затем в дом, затем в ещё больший дом.)) I went from driving an old car to a new car and then to a new Mercedes.((Я перешел от вождения старой машины к новой, а затем к новому Мерседесу.)) I went from traveling by car and staying with friends to traveling by jet and staying in the best hotels.((Я перешел от путешествий на машине и остановок у друзей к путешествиям на реактивных самолетах и проживанию в лучших отелях.))`
      }
    ]
  },

  test: {
    mainTitleOfTheText: "📖 Test",
    author: "Vincent",
    chapters: [
      {
        title: "From test to test ((От теста к тесту))",
        content: `It is a test of a new unknown word. And this is a test of the translated sentence. Everything is here. It is hilarious, but yet very useful`
      },
    ]
  },


};

export default engBooksData;

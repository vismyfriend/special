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

Комбинация: <strong><em>жирный + курсив</em></strong> и <u><em>подчеркнутый + курсив</em></u>.`,
         picture: new URL("../assets/images/ielts_listening_7.png", import.meta.url).href,

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
    author: "(это не ИИ) -> this is one of Vincent's favorite books. Часть первая.",
    chapters: [

      {
        title: null,
        content: `Welcome to the revolution.((Добро пожаловать в революцию.)) We entered into the most <em>turbulent</em> time in all of human history, when changes happen more often, more rapidly, and more unpredictably than ever before.((Мы вступили в самое неспокойное время во всей истории человечества, когда перемены происходят чаще, быстрее и непредсказуемее, чем когда-либо прежде.)) And the only thing we know about the future is that it will be faster, changing, and more unpredictable than the present.((И единственное, что мы знаем о будущем — оно будет быстрее, изменчивее и непредсказуемее, чем настоящее.))

Your job is to learn how to survive and thrive in the months and years ahead, and this S.P.E.C.I.A.L. program is designed to help you do exactly that.((Ваша задача — научиться выживать и процветать в предстоящие месяцы и годы, и эта программа создана, чтобы помочь вам именно в этом.))`
      },
      {
        title: null,
        content: `The Key Principle is : ((Ключевой момент, принцип :))

<strong>The great breakthrough in your life comes when you realize that you can learn anything you need to learn to accomplish any goal that you can set for yourself.((Великий прорыв в вашей жизни наступает, когда вы осознаёте, что можете научиться всему, чему вам нужно научиться, чтобы достичь любой цели, которую вы перед собой ставите.))</strong>`
      },
      {
        title: "From Failure to Success ((От провала к успеху))",

        content: `This is the story of Brian Tracy((Это история Брайана Трэйси )). I have studied, practiced, and taught in the area of human potential development for more than 30 years.((Я изучал, практиковал и преподавал в области развития человеческого потенциала более 30 лет.))

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

<strong>If you could find out what the most successful people did in any area, and then you did the same thing over and over, you would eventually get the same results as they do.</strong>((Если бы вы могли узнать, что делали самые успешные люди в любой области, и затем делали бы то же самое снова и снова, вы бы в итоге получили те же результаты, что и они.))

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

---

As a Sales Manager.((Как менеджер по продажам:)) I applied the same principles:((Я применил те же принципы:))

1. I talked to other successful sales managers((• Я разговаривал с другими успешными менеджерами по продажам))
2. I read books on management((• Я читал книги по управлению))
3. I listened to tapes and took courses on management((• Я слушал записи и проходил курсы по управлению))

In no time, I had 95 people working for me, and I was in charge of six countries.((В мгновение ока у меня работало 95 человек, и я отвечал за шесть стран.)) The amount of money I was earning was more than I had ever expected.((Сумма денег, которую я зарабатывал, была больше, чем я когда-либо ожидал.))

---

In Real Estate Development((В сфере развития недвижимости)) I applied the same principles:((Я применил те же принципы:))

• I read all the books, articles, and magazines I could find((• Я прочитал все книги, статьи и журналы, которые мог найти))

• I talked to other people who were successful in real estate development((• Я разговаривал с другими людьми, которые были успешны в развитии недвижимости))

• I attended lectures given by experts in real estate((• Я посещал лекции экспертов в сфере недвижимости))

• I took courses and got a real estate license((• Я проходил курсы и получил лицензию на недвижимость))

Over the next few years, I bought, developed, leased, sold, and otherwise disposed of more than $50 million worth of real estate.((В течение следующих нескольких лет я купил, развил, сдал в аренду, продал и иным образом распорядился недвижимостью на сумму более 50 миллионов долларов.))

I moved from a rented apartment to a condominium, to a home, to an even bigger home.((Я переехал из съемной квартиры в кондоминиум, затем в дом, затем в ещё больший дом.)) I went from driving an old car to a new car and then to a new Mercedes.((Я перешел от вождения старой машины к новой, а затем к новому Мерседесу.)) I went from traveling by car and staying with friends to traveling by jet and staying in the best hotels.((Я перешел от путешествий на машине и остановок у друзей к путешествиям на реактивных самолетах и проживанию в лучших отелях.))`
      },
      {
        title: `We already mentioned the Key Principle : ((Мы уже упоминали ключевой принцип :))`,
        content: `The great breakthrough in your life comes when you realize that you can learn anything you need to learn to accomplish any goal that you can set for yourself. ((Великий прорыв в вашей жизни наступает, когда вы осознаёте, что можете научиться всему, что вам нужно, чтобы достичь любой цели, которую вы перед собой ставите.))

Wow! ((Вау!)) This means that there are no limits on what you can be, have, or do. ((Это означает, что нет никаких ограничений на то, кем вы можете быть, что иметь и что делать.)) All you have to do is: ((Всё, что вам нужно сделать, это:))

1. Decide what you want. ((1. Решить, чего вы хотите.))

2. Decide what you have to learn and be able to do to achieve it. ((2. Решить, чему вам нужно научиться и что уметь делать, чтобы достичь этого.))

3. Then get busy. ((3. Затем приступить к делу.))

It may take you a week or a month or a year, but your success is inevitable using this simple approach. ((Это может занять неделю, месяц или год, но ваш успех неизбежен при использовании этого простого подхода.))`
      },

      // ===== ГЛАВА 6 =====
      {
        title: "Colin Rose and Accelerated Learning ((Колин Роуз и ускоренное обучение))",
        content: `I became so impressed with the power of learning to change a person's life that in 1980 I began studying the subject of learning in greater depth.((Я был настолько впечатлён силой обучения, способной изменить жизнь человека, что в 1980 году начал изучать тему обучения более глубоко.)) I studied:((Я изучал:))

• Sales((• Продажи))
• Management((• Управление))
• Psychology((• Психологию))
• Philosophy((• Философию))
• History((• Историю))
• Metaphysics((• Метафизику))
• The workings of the human mind((• Работу человеческого разума))
• The learning process((• Процесс обучения))

What I found was quite amazing:((Что я обнаружил, было довольно удивительным:)) instead of being boring, frustrating, painstaking hard work, learning was really enjoyable, entertaining, and highly effective.((вместо того чтобы быть скучным, разочаровывающим, кропотливым трудом, обучение было действительно приятным, увлекательным и высокоэффективным.))

I began practicing concepts of accelerated learning, including:((Я начал применять концепции ускоренного обучения, включая:))

• Relaxation((• Расслабление))
• Music((• Музыку))
• Visualization((• Визуализацию))
• Memorization techniques((• Техники запоминания))
• Whole brain learning methodologies((• Методологии обучения с использованием всего мозга))

I soon found that I could read, learn, remember, apply, and get better results faster using these methods than I ever could before.((Вскоре я обнаружил, что могу читать, учиться, запоминать, применять и получать лучшие результаты быстрее, используя эти методы, чем когда-либо раньше.))`
      },

      // ===== ГЛАВА 7 =====
      {
        title: "Colin Rose Speaks ((Колин Роуз говорит))",
        content: `"Hello, I'm Colin Rose, and I'd like to tell you how accelerated learning developed and what it will do for you.((«Здравствуйте, я Колин Роуз, и я хотел бы рассказать вам, как развивалось ускоренное обучение и что оно даст вам.))

Over the years, I've spent literally thousands of hours pursuing my passion, which is the discovery of how people can use more of their phenomenal brain capacity.((За эти годы я провёл буквально тысячи часов, следуя своей страсти — открытию того, как люди могут использовать больше своего феноменального мозгового потенциала.)) I've explored extensive research on the brain and on how memory works, on intelligence and on how people learn.((Я исследовал обширные научные работы о мозге, о том, как работает память, об интеллекте и о том, как люди учатся.))

As a result, we've built the methods of accelerated learning into a system that's really powerful.((В результате мы превратили методы ускоренного обучения в действительно мощную систему.))

What emerged from my research is this proven fact:((Из моего исследования вышло это доказанное утверждение:))

You learn best in a low-stress environment and when you can make best use of your personal learning style.((Вы учитесь лучше всего в среде с низким уровнем стресса и когда вы можете наилучшим образом использовать свой личный стиль обучения.))

If the way that information reaches you exactly matches the way that you prefer to learn, you'll truly be learning naturally.((Если способ, которым информация доходит до вас, точно соответствует тому, как вы предпочитаете учиться, вы будете учиться по-настоящему естественно.)) And when you're learning naturally, you're also learning easily, effectively and quickly, which is why we call the method accelerated learning."((А когда вы учитесь естественно, вы также учитесь легко, эффективно и быстро, именно поэтому мы называем этот метод ускоренным обучением.»))`
      },

      // ===== ГЛАВА 8 =====
      {
        title: "Proven Results of Accelerated Learning ((Доказанные результаты ускоренного обучения))",
        content: `We've applied the accelerated learning method to educational, personal, and corporate training with, it's fair to say, spectacular results:((Мы применили метод ускоренного обучения в образовании, личном и корпоративном обучении с, справедливо сказать, впечатляющими результатами:))

• An independent study showed that 10 times as many students got top grades using accelerated learning compared with those using conventional methods.((• Независимое исследование показало, что в 10 раз больше студентов получили высшие оценки, используя ускоренное обучение, по сравнению с теми, кто использовал традиционные методы.))
• A major US telephone company cut its training times in half using this method, saving over a million dollars a year in the process.((• Крупная американская телефонная компания сократила время обучения вдвое, используя этот метод, сэкономив при этом более миллиона долларов в год.))`
      },

      // ===== ГЛАВА 9 =====
      {
        title: "Colin Rose's Goal ((Цель Колина Роуза))",
        content: `"I have a goal which I'm determined to reach.((«У меня есть цель, которую я полон решимости достичь.)) I want to see everyone, from children to adults, acquire the tools and the motivation to realise their dreams.((Я хочу, чтобы каждый — от детей до взрослых — приобрёл инструменты и мотивацию для реализации своих мечтаний.)) I've seen the incredible impact that accelerated learning has on people's lives and I hope that when you've experienced it too, you'll be just as excited as I am about this dynamic breakthrough in personal achievement."((Я видел невероятное влияние, которое ускоренное обучение оказывает на жизнь людей, и я надеюсь, что когда вы тоже испытаете это, вы будете так же взволнованы, как и я, этим динамичным прорывом в личных достижениях.»))`
      },

      // ===== ГЛАВА 10 =====
      {
        title: "The Information Age: Knowledge is King ((Эпоха информации: знание — король))",
        content: `It took thousands of years for man to pass from the agricultural age into the industrial age.((Человечеству потребовались тысячи лет, чтобы перейти от сельскохозяйственной эпохи к индустриальной.)) The industrial age came and went faster than any other age in history, starting about 1815 and officially ending in the last few years as we passed into the information age.((Индустриальная эпоха пришла и ушла быстрее, чем любая другая эпоха в истории, начавшись примерно в 1815 году и официально завершившись в последние несколько лет, когда мы перешли в эпоху информации.))

Throughout the developed world, we have moved from manpower to mind power.((Во всём развитом мире мы перешли от физической силы к силе ума.)) We have moved from the use of physical muscles to the use of mental muscles.((Мы перешли от использования физических мышц к использованию умственных.))

Today, the chief sources of value in our society are knowledge and the ability to apply that knowledge in a timely fashion.((Сегодня главными источниками ценности в нашем обществе являются знания и способность применять эти знания своевременно.))

In the information age, knowledge is king.((В эпоху информации знание — король.)) And those people who develop the ability to continuously acquire new and better forms of knowledge that they can apply to their work and to their lives will be the movers and shakers and leaders in our society for the indefinite future.((И те люди, которые развивают способность постоянно приобретать новые и лучшие формы знаний, которые они могут применять в своей работе и жизни, будут двигателями, преобразователями и лидерами в нашем обществе на неопределённое будущее.))`
      },

      // ===== ГЛАВА 11 =====
      {
        title: "What Experts Say ((Что говорят эксперты))",
        content: `• Peter Drucker: "The truly educated person today is a person who has learned how to learn continuously and throughout life."((• Питер Друкер: «По-настоящему образованный человек сегодня — это тот, кто научился учиться непрерывно и на протяжении всей жизни.»))

• John Nesbitt: "The only real skill that matters in the world's tomorrow is the ability to learn what you need to know on a regular basis."((• Джон Несбитт: «Единственный реальный навык, который имеет значение в мире завтрашнего дня — это способность регулярно узнавать то, что вам нужно знать.»))

• Tom Peters: "Continuous learning may be the only real source of sustainable competitive advantage for individuals and corporations."((• Том Питерс: «Непрерывное обучение может быть единственным реальным источником устойчивого конкурентного преимущества для отдельных людей и корпораций.»))

• Peter Senge (author of The Fifth Discipline): "Only learning organizations, those organizations that are capable of taking in new information, adapting it, and using it faster than their competitors, will survive in the fast-changing competitive world of tomorrow."((• Питер Сенге (автор «Пятой дисциплины»): «Только обучающиеся организации — те организации, которые способны воспринимать новую информацию, адаптировать её и использовать быстрее, чем их конкуренты — выживут в быстро меняющемся конкурентном мире завтрашнего дня.»))`
      },

      // ===== ГЛАВА 12 =====
      {
        title: "Three Types of People ((Три типа людей))",
        content: `It's been said that there are three types of people:((Говорят, что есть три типа людей:))

1. Those who MAKE things happen((1. Те, кто ЗАСТАВЛЯЕТ вещи происходить))
2. Those who WATCH things that are happening((2. Те, кто НАБЛЮДАЕТ за происходящим))
3. The vast majority who simply say, "What happened?"((3. Подавляющее большинство, которые просто говорят: «Что случилось?»))

The great majority of people are walking around today saying, "What happened? What happened?"((Подавляющее большинство людей сегодня ходят и говорят: «Что случилось? Что случилось?»)) They don't understand that our society has gone through a fundamental transformation and things will never be the same again.((Они не понимают, что наше общество прошло через фундаментальную трансформацию и вещи уже никогда не будут прежними.))`
      },

      // ===== ГЛАВА 13 =====
      {
        title: "The New Source of Wealth ((Новый источник богатства))",
        content: `It used to be that the main difference between people in our society was between those who have more and those who have less.((Раньше главное различие между людьми в нашем обществе было между теми, у кого больше, и теми, у кого меньше.))

Today, however, the difference is between those who know more and those who know less.((Сегодня, однако, различие — между теми, кто знает больше, и теми, кто знает меньше.))

Wealth today is no longer contained in land, labor, capital, factories, fixtures, and raw materials.((Богатство сегодня больше не заключено в земле, труде, капитале, фабриках, оборудовании и сырье.))

Today, the greatest single source of wealth is between your ears.((Сегодня величайший единственный источник богатства — между вашими ушами.))

Today, wealth is contained in brain power, not brute power.((Сегодня богатство заключено в силе ума, а не в грубой силе.))`
      },

      // ===== ГЛАВА 14 =====
      {
        title: "The Power of Your Mind ((Сила вашего разума))",
        content: `The most sophisticated and expensive multi-million dollar factory can be rendered obsolete almost overnight with a change in technology.((Самый сложный и дорогой многомиллионный завод может устареть почти за одну ночь с изменением технологии.)) But this can never happen to your mind unless you allow it to happen.((Но этого никогда не может случиться с вашим разумом, если только вы сами этого не позволите.))

It is your ability to think that is your chief source of value.((Именно ваша способность мыслить является вашим главным источником ценности.))

In fact, you are a mind with a body to carry it around in.((Фактически, вы — это разум с телом, чтобы его носить.))

Your house could burn down, your car could be stolen, your bank account could be looted, and your job could disappear, but you could still walk across the street, and by using your brain power, you could begin immediately to pump thousands of dollars per year into your life.((Ваш дом может сгореть, ваша машина может быть украдена, ваш банковский счёт может быть опустошён, и ваша работа может исчезнуть, но вы всё равно можете перейти через улицу и, используя силу своего мозга, немедленно начать приносить в свою жизнь тысячи долларов в год.))`
      },

      // ===== ГЛАВА 15 =====
      {
        title: "The \"Nothing to Declare\" Story ((История «Нечего декларировать»))",
        content: `A computer expert with the ability to create a $100 million empire in his mind could walk up to customs in New York with only the clothes on his back and say:((Специалист по компьютерам, способный создать в своём уме империю на 100 миллионов долларов, мог бы подойти к таможне в Нью-Йорке в одной одежде, которая на нём, и сказать:))

"Nothing to declare."((«Нечего декларировать.»))

He could walk into this country or any country with a hundred million dollars worth of value between his ears and, in terms of capital or goods, have nothing to declare.((Он мог бы войти в эту страну или в любую страну со стоимостью в сто миллионов долларов между своими ушами и, с точки зрения капитала или товаров, не иметь ничего для декларации.))

This is an incredible thought.((Это невероятная мысль.)) This has never occurred before in human history and it will be the norm for the rest of our lives.((Этого никогда не случалось раньше в истории человечества, и это станет нормой до конца нашей жизни.))`
      },

      // ===== ГЛАВА 16 =====
      {
        title: "Your Most Valuable Asset ((Ваш самый ценный актив))",
        content: `Here's a question for you:((Вот вопрос для вас:))

What is your most valuable asset?((Что является вашим самым ценным активом?))

In terms of cash flow, what is the most valuable thing you have?((С точки зрения денежного потока, что является самой ценной вещью, которая у вас есть?))

Unless you're very rich or have a family trust account, your most valuable asset is your earning ability.((Если вы не очень богаты или у вас нет семейного трастового счёта, ваш самый ценный актив — это ваша способность зарабатывать.)) It is your ability to earn money.((Это ваша способность зарабатывать деньги.)) It's your ability to apply your knowledge and skill in a timely fashion to get results for which others will pay.((Это ваша способность своевременно применять свои знания и навыки для получения результатов, за которые другие будут платить.))

All your education, knowledge, experience, reading, training, and work has contributed toward building up your earning ability.((Всё ваше образование, знания, опыт, чтение, обучение и работа внесли свой вклад в развитие вашей способности зарабатывать.))`
      },

      // ===== ГЛАВА 17 =====
      {
        title: "The Future Belongs to the Competent ((Будущее принадлежит компетентным))",
        content: `The future belongs to the competent.((Будущее принадлежит компетентным.))

The future belongs to those people who stay ahead of the curve.((Будущее принадлежит тем, кто остаётся на шаг впереди.)) The future belongs to those people who are engaged in a lifelong process of learning what they need to learn to do what they need to do in an excellent fashion.((Будущее принадлежит тем, кто вовлечён в пожизненный процесс обучения тому, что им нужно узнать, чтобы делать то, что им нужно делать, отличным образом.))

And if you're not moving forward, you are actually moving backward.((И если вы не движетесь вперёд, вы на самом деле движетесь назад.)) No one is staying in the same place in the fastest-moving society in all of human history.((Никто не остаётся на месте в самом быстро меняющемся обществе за всю историю человечества.))`
      },

      // ===== ГЛАВА 18 =====
      {
        title: "MacArthur's Wisdom ((Мудрость Макартура))",
        content: `General Douglas MacArthur once said:((Генерал Дуглас Макартур однажды сказал:))

"There is no security in life, only opportunity."((«В жизни нет безопасности, есть только возможность.»))

And the great opportunity for you, an almost unlimited opportunity, comes from learning how to learn faster and easier and then by doing it throughout all the years of your life.((И великая возможность для вас, почти безграничная возможность, исходит от того, чтобы научиться учиться быстрее и легче, а затем делать это на протяжении всех лет вашей жизни.))`
      },

      // ===== ГЛАВА 19 =====
      {
        title: "What You Will Learn ((Что вы узнаете))",
        content: `In the coming sessions, you're going to learn:((В предстоящих сессиях вы узнаете:))

• The finest methods and techniques ever discovered on how to unlock the incredible powers of your brain((• Лучшие из когда-либо открытых методов и техник о том, как раскрыть невероятные силы вашего мозга))
• How to become smarter faster than ever before((• Как стать умнее быстрее, чем когда-либо прежде))
• How to become a master of your circumstances rather than a victim of your circumstances((• Как стать хозяином своих обстоятельств, а не их жертвой))
• How to take complete control of your present and future destiny so that you can accomplish and achieve anything you really want in life((• Как взять полный контроль над вашей настоящей и будущей судьбой, чтобы вы могли достичь и осуществить всё, что действительно хотите в жизни))`
      },

      // ===== ГЛАВА 20 =====
      {
        title: "The Old Paradigm vs. The New Paradigm ((Старая парадигма против новой парадигмы))",
        content: `The Old Paradigm of Learning:((Старая парадигма обучения:))

Life was divided into three parts:((Жизнь была разделена на три части:))

1. Learning Years (until about age 20) — you got your education((1. Годы обучения (примерно до 20 лет) — вы получали образование))
2. Earning Years (until about age 65) — you worked((2. Годы заработка (примерно до 65 лет) — вы работали))
3. Yearning Years (retirement) — paid for by social security, savings, and pensions((3. Годы тоски (пенсия) — оплачиваемые социальным обеспечением, сбережениями и пенсиями))

In this old model, learning was something that you did during your formative years, and then you never had to do it again.((В этой старой модели обучение было тем, что вы делали в годы своего становления, а затем вам никогда не нужно было делать это снова.))

The New Paradigm:((Новая парадигма:))

A person starting work today can expect to have:((Человек, начинающий работать сегодня, может ожидать:))

• Five full careers and 14 full-time jobs lasting two years or more over the course of their working lifetime((• Пять полноценных карьер и 14 работ на полную ставку продолжительностью два года или более на протяжении своей трудовой жизни))
• As many as 50% of people working today are in the first year of employment in their current jobs((• До 50% людей, работающих сегодня, находятся на первом году работы на своей текущей должности))

With knowledge doubling every two to three years, jobs are becoming obsolete at the rate of 30 to 50% per year.((Поскольку знания удваиваются каждые два-три года, профессии устаревают со скоростью от 30 до 50% в год.))`
      },

      // ===== ГЛАВА 21 =====
      {
        title: "The Danger of Obsolescence ((Опасность устаревания))",
        content: `An engineer coming out of school today is better educated and more skilled with state-of-the-art tools and concepts than an engineer who graduated five years ago.((Инженер, выходящий из учебного заведения сегодня, лучше образован и более квалифицирован в использовании передовых инструментов и концепций, чем инженер, окончивший учёбу пять лет назад.)) Unless that engineer who graduated five years ago has kept current with the rapid changes in his profession, he can be replaced by a new graduate at perhaps half the salary he's receiving.((Если только тот инженер, который окончил учёбу пять лет назад, не следил за быстрыми изменениями в своей профессии, он может быть заменён новым выпускником, возможно, за половину зарплаты, которую он получает.))

There are many people today who are obsolete in their fields at 30 years of age.((Сегодня много людей, которые устарели в своих областях в возрасте 30 лет.))

They bought into the old paradigm and they've not read or kept current since they left school.((Они поверили в старую парадигму и не читали и не следили за актуальностью с тех пор, как покинули школу.))

Today, you must not only be asking:((Сегодня вы должны не только спрашивать:))

"What is my next job going to be?"((«Какой будет моя следующая работа?»))

But you must also be asking yourself:((Но вы также должны спрашивать себя:))

"What is my next career going to be?"((«Какой будет моя следующая карьера?»))`
      },

      // ===== ГЛАВА 22 =====
      {
        title: "A Critical Question ((Важный вопрос))",
        content: `Imagine for a moment that your entire industry vanished overnight and you had to start again in a completely new business doing an entirely different job.((Представьте на мгновение, что вся ваша отрасль исчезла за одну ночь, и вам пришлось начать заново в совершенно новом бизнесе, выполняя совершенно иную работу.)) What would it be?((Чем бы это было?))

And don't think this question is speculative or that it applies to someone else.((И не думайте, что этот вопрос умозрительный или что он относится к кому-то другому.)) It's a question that you will probably have to deal with and perhaps far sooner than you expect.((Это вопрос, с которым вам, вероятно, придётся столкнуться, и, возможно, гораздо раньше, чем вы ожидаете.))

In thinking about your new job and your new career, here are the most important questions of all:((Размышляя о своей новой работе и новой карьере, вот самые важные вопросы из всех:))

"What skills do I have to have?((«Какими навыками я должен обладать?)) What do I have to be absolutely, positively excellent at doing in order to earn an excellent living in my new job and my new career?"((В чём я должен быть абсолютно, безусловно превосходен, чтобы хорошо зарабатывать на своей новой работе и в новой карьере?»))

Remember:((Помните:))

Whatever got you to where you are today is not enough to keep you there.((Того, что привело вас туда, где вы сегодня, недостаточно, чтобы удержать вас там.))

Unless you are continuously upgrading your knowledge and skills, you are becoming more obsolete each day.((Если вы не обновляете свои знания и навыки постоянно, вы становитесь всё более устаревшим с каждым днём.)) And if you're not happy with the results you're getting today, you must remember that the more you do of what you're doing, the more you'll get of what you've got.((И если вы недовольны результатами, которые получаете сегодня, вы должны помнить: чем больше вы делаете то, что вы делаете, тем больше вы получаете того, что у вас уже есть.))`
      },

      // ===== ГЛАВА 23 =====
      {
        title: "Three Essential Paradigm Shifts ((Три важнейших сдвига парадигмы))",
        content: `Shift #1: From One-Time Learning to Lifelong Learning((Сдвиг №1: От разового обучения к обучению на протяжении всей жизни))

The first major paradigm shift that everyone must go through is shifting from getting an education when you are young to getting an education all the days of your life.((Первый крупный сдвиг парадигмы, через который должен пройти каждый, — это переход от получения образования в молодости к получению образования во все дни своей жизни.))

Shift #2: Recognize Your Most Valuable Asset((Сдвиг №2: Признайте свой самый ценный актив))

Your most valuable asset is your earning ability.((Ваш самый ценный актив — это ваша способность зарабатывать.)) Just as you would take excellent care of an extremely expensive piece of equipment or machinery, you must take exquisite care of your earning ability.((Точно так же, как вы бы отлично заботились о чрезвычайно дорогом оборудовании или механизме, вы должны проявлять исключительную заботу о своей способности зарабатывать.))

You must:((Вы должны:))

• Always look for ways to maintain it and preserve it((• Всегда искать способы поддерживать и сохранять её))
• Look for ways to enhance it and increase it((• Искать способы улучшать и увеличивать её))
• Always add to your earning ability to replace the inevitable 30 to 50% obsolescence occurring every year in your field((• Постоянно добавлять к своей способности зарабатывать, чтобы компенсировать неизбежное устаревание на 30-50%, происходящее каждый год в вашей области))
• Continually upgrade your skills and replace old skills with new ones((• Постоянно обновлять свои навыки и заменять старые навыки новыми))

Every day, every week, you should feel that you are making forward progress in preserving and upgrading your earning ability.((Каждый день, каждую неделю вы должны чувствовать, что делаете прогресс в сохранении и улучшении своей способности зарабатывать.))

Shift #3: From Lifelong Employment to Lifelong Employability((Сдвиг №3: От пожизненной занятости к пожизненной способности быть востребованным))

Today, no one can expect lifelong employment, but you can create lifelong employability.((Сегодня никто не может рассчитывать на пожизненную занятость, но вы можете создать пожизненную способность быть востребованным.))

This requires that you make an essential mind shift from seeing yourself as an employee to viewing yourself as self-employed.((Это требует, чтобы вы совершили важный сдвиг в сознании — от восприятия себя как наёмного работника к восприятию себя как самозанятого.))`
      },

      // ===== ГЛАВА 24 =====
      {
        title: "You Are Self-Employed ((Вы самозанятый))",
        content: `Earl Nightingale once said:((Эрл Найтингейл однажды сказал:))

"The biggest mistake you can ever make in life is to ever think that you work for anyone else but yourself."((«Самая большая ошибка, которую вы когда-либо можете совершить в жизни — это думать, что вы работаете на кого-то, кроме себя.»))

When I heard these words at the age of 28, I almost drove off the road.((Когда я услышал эти слова в возрасте 28 лет, я чуть не съехал с дороги.)) I was shocked.((Я был потрясён.)) It was an overwhelming idea.((Это была ошеломляющая идея.))

From that moment onward, I knew the truth.((С того момента я знал правду.)) I was self-employed.((Я был самозанятым.)) I was working for myself.((Я работал на себя.))

In fact:((Фактически:))

You are the president of your own personal services corporation.((Вы — президент своей собственной корпорации личных услуг.))

You are the president of an entrepreneurial organization of one, selling your services to your current employer, and receiving fees in the form of a salary or commission for the value and results of what you do.((Вы — президент предпринимательской организации из одного человека, продающей свои услуги вашему текущему работодателю и получающей вознаграждение в виде зарплаты или комиссионных за ценность и результаты того, что вы делаете.))

You are, in fact, on your own payroll.((Вы, по сути, в собственном платёжном ведомости.)) You are your own boss.((Вы сами себе начальник.))

Over the long term, you determine the size of your own paycheck.((В долгосрочной перспективе вы определяете размер своего собственного чека.)) If you're not happy with the amount you're earning, you can go and find a mirror and negotiate with your boss for an increase.((Если вы недовольны суммой, которую зарабатываете, вы можете пойти, найти зеркало и провести переговоры со своим начальником о повышении.))`
      },

      // ===== ГЛАВА 25 =====
      {
        title: "Your Responsibilities as President ((Ваши обязанности как президента))",
        content: `As the president of your own personal services corporation, you are in charge of:((Как президент своей собственной корпорации личных услуг, вы отвечаете за:))

• Finance((• Финансы))
• Production((• Производство))
• Marketing((• Маркетинг))
• Quality Control((• Контроль качества))
• Distribution((• Распределение))
• R&D — continually upgrading the quality and quantity of the products you are offering to your particular market((• НИОКР — постоянное повышение качества и количества продуктов, которые вы предлагаете на своём конкретном рынке))
• Your own Training Department((• Свой собственный отдел обучения))

As the president of your own company, you should have an ongoing personal and professional development program.((Как президент своей компании, вы должны иметь постоянную программу личного и профессионального развития.)) Each month, each quarter, each year, you should have a learning project.((Каждый месяц, каждый квартал, каждый год у вас должен быть учебный проект.)) You should have a plan for what you need to learn and how you're going to learn it.((У вас должен быть план того, что вам нужно узнать и как вы будете это учить.))

You should allocate a certain amount of money and a certain number of hours each day, each week, each month to learn what you need to learn so that you can achieve the goals that you want to achieve.((Вы должны выделять определённое количество денег и определённое количество часов каждый день, каждую неделю, каждый месяц, чтобы учиться тому, что вам нужно, чтобы достичь целей, которых вы хотите достичь.))`
      },

      // ===== ГЛАВА 26 =====
      {
        title: "How to Answer \"What Do You Do?\" ((Как отвечать на вопрос «Чем вы занимаетесь?»))",
        content: `From now on, when someone asks you what you do, you can tell them proudly:((Отныне, когда кто-то спрашивает вас, чем вы занимаетесь, вы можете с гордостью сказать им:))

"I'm the president of my own company."((«Я президент своей собственной компании.»))

When they say that they thought you worked for ABC Corporation, you can say confidently:((Когда они скажут, что думали, что вы работаете на корпорацию ABC, вы можете уверенно сказать:))

"Yes, they're my best client."((«Да, они мой лучший клиент.»))

Remember: Your current employer is merely your best client at the moment.((Помните: ваш текущий работодатель — всего лишь ваш лучший клиент на данный момент.)) You have not always worked for your existing client, and you will not always work for your existing client, but you will always work for yourself.((Вы не всегда работали на своего текущего клиента, и вы не всегда будете работать на него, но вы всегда будете работать на себя.))`
      },

      // ===== ГЛАВА 27 =====
      {
        title: "The Seven R's ((Семь «Р»))",
        content: `Today there are a series of buzzwords being used by companies everywhere.((Сегодня существует ряд модных слов, используемых компаниями повсюду.)) I call them The Seven R's:((Я называю их Семь «Р»:))

1. Reorganization — moving people and resources around to produce more and better products and services((1. Реорганизация — перемещение людей и ресурсов для производства большего количества и лучших продуктов и услуг))
2. Restructuring — moving more resources to areas where they contribute greater value and discontinuing activities that customers are not willing to pay for((2. Реструктуризация — перемещение большего количества ресурсов в области, где они приносят большую ценность, и прекращение деятельности, за которую клиенты не готовы платить))
3. Re-engineering — process analysis, downsizing, eliminating, or outsourcing lower-value activities so that it takes fewer inputs to achieve the same level of outputs((3. Реинжиниринг — анализ процессов, сокращение, устранение или аутсорсинг менее ценных видов деятельности, чтобы для достижения того же уровня результатов требовалось меньше затрат))
4. Reinventing — continually looking at what they would do if they were starting over again today((4. Переосмысление — постоянное рассмотрение того, что они бы делали, если бы начинали заново сегодня))
5. Re-evaluation — looking at everything they do to decide if this is the real business they want to be in((5. Переоценка — рассмотрение всего, что они делают, чтобы решить, является ли это тем бизнесом, которым они действительно хотят заниматься))
6. Refocusing — concentrating time, activities, and resources on the few things they can do in an excellent fashion((6. Перефокусировка — концентрация времени, деятельности и ресурсов на тех немногих вещах, которые они могут делать отличным образом))
7. Regaining Control — becoming proactive and making clear, specific decisions about what business they are really in and the direction in which they are going((7. Возвращение контроля — становление проактивными и принятие чётких, конкретных решений о том, каким бизнесом они на самом деле занимаются и в каком направлении движутся))`
      },

      // ===== ГЛАВА 28 =====
      {
        title: "The Seven R's Apply to YOU ((Семь «Р» применимы и к ВАМ))",
        content: `Whenever you hear about companies going through the seven big R's, you must remember that you are the president of your own company as well.((Всякий раз, когда вы слышите о компаниях, проходящих через семь больших «Р», вы должны помнить, что вы также являетесь президентом своей собственной компании.)) The seven R's apply to you personally just as they apply to corporations:((Семь «Р» применимы к вам лично так же, как и к корпорациям:))

• Reorganize yourself and your activities to focus on higher priority tasks((• Реорганизуйте себя и свои действия, чтобы сосредоточиться на более приоритетных задачах))
• Restructure what you do so that you are doing more things that contribute the greatest value to your current clients((• Реструктурируйте то, что вы делаете, чтобы выполнять больше дел, которые приносят наибольшую ценность вашим текущим клиентам))
• Re-engineer your activities, continuously outsourcing, downsizing, and eliminating certain activities so that you can spend more time producing more of the things that make more of a difference in your life((• Перепроектируйте свои действия, постоянно передавая на аутсорсинг, сокращая и устраняя определённые виды деятельности, чтобы вы могли проводить больше времени, производя больше того, что имеет большее значение в вашей жизни))
• Reinvent yourself every six months — continually think about what you want to do and be when you grow up((• Переосмысливайте себя каждые шесть месяцев — постоянно думайте о том, чем вы хотите заниматься и кем хотите быть, когда вырастете))
• Re-evaluate yourself and every part of your life, recognizing that whatever the future may hold, it will be radically different from the present((• Переоценивайте себя и каждую часть своей жизни, признавая, что каким бы ни было будущее, оно будет кардинально отличаться от настоящего))
• Refocus your mental, physical, and emotional energies on those parts of your life that are really important to you((• Перефокусируйте свои умственные, физические и эмоциональные энергии на те части вашей жизни, которые действительно важны для вас))
• As a result of applying the first six, you will Regain Control — you will feel more in charge of your life rather than being battered around by the storms of fate and destiny((• В результате применения первых шести вы Вернёте Контроль — вы будете чувствовать себя более ответственным за свою жизнь, а не быть избитым бурями судьбы и предназначения))`
      },

      // ===== ГЛАВА 29 =====
      {
        title: "The Deepest Human Need ((Глубочайшая человеческая потребность))",
        content: `The deepest human need, according to psychologists, is the need for security — for a feeling of being secure physically, financially, and emotionally.((Глубочайшая человеческая потребность, по мнению психологов, — это потребность в безопасности — в чувстве защищённости физически, финансово и эмоционально.)) Our greatest fear is to be deprived of our security.((Наш величайший страх — быть лишённым нашей безопасности.))

We fear failure, loss, criticism, embarrassment, disapproval, and so on, because they make us feel insecure and incapable of controlling our own lives and our own futures.((Мы боимся неудач, потерь, критики, смущения, неодобрения и так далее, потому что они заставляют нас чувствовать себя неуверенно и неспособными контролировать свою жизнь и своё будущее.))

In the world of rapid change that we're experiencing today, fears of insecurity are at an all-time high.((В мире быстрых перемен, который мы переживаем сегодня, страхи неуверенности находятся на рекордном уровне.))

This is the primary reason why we fear change.((Это главная причина, почему мы боимся перемен.)) We're afraid that we will be worse off after an unexpected and unpredicted change than we were before.((Мы боимся, что после неожиданных и непредвиденных изменений нам будет хуже, чем раньше.)) This is also why we resist change.((Это также причина, почему мы сопротивляемся переменам.)) We think that if we fight the change, we will somehow be safer and more secure doing things the old way.((Мы думаем, что если будем бороться с переменами, мы будем как-то безопаснее и защищённее, делая всё по-старому.))

But of course, this is a fool's game.((Но, конечно, это игра дурака.))

There's no security in adhering to the old ways.((Нет никакой безопасности в приверженности старым способам.))

The only security you can ever have is your ability to do a job uncommonly well.((Единственная безопасность, которую вы когда-либо можете иметь — это ваша способность выполнять работу исключительно хорошо.))`
      },

      // ===== ГЛАВА 30 =====
      {
        title: "Gap Analysis ((Анализ разрыва))",
        content: `Whenever you think about the things you want in life — in your personal life, your financial life, your career, your material accomplishments, your health, your family, your contribution to society — you realize that there's a gap between where you are and where you want to be.((Всякий раз, когда вы думаете о том, что хотите в жизни — в личной жизни, финансовой жизни, карьере, материальных достижениях, здоровье, семье, вкладе в общество — вы понимаете, что есть разрыв между тем, где вы находитесь, и тем, где вы хотите быть.))

In fact, with regard to achievement, you are in the business of what is called gap analysis:((Фактически, что касается достижений, вы занимаетесь тем, что называется анализом разрыва:))

1. Decide where you are((1. Решите, где вы находитесь))
2. Decide where you want to go((2. Решите, куда вы хотите прийти))
3. Analyze the gap between your current situation and your future desired situation((3. Проанализируйте разрыв между вашей текущей ситуацией и желаемой будущей ситуацией))
4. Decide how to fill that gap((4. Решите, как заполнить этот разрыв))

Once you've clearly defined a goal, ask yourself:((Как только вы чётко определили цель, спросите себя:))

"What is holding me back from achieving my goal right now?"((«Что сейчас удерживает меня от достижения моей цели?»))

In almost every case, you will find that your bridging materials are knowledge and skill.((Почти в каждом случае вы обнаружите, что вашим связующим материалом являются знания и навыки.)) In order to get from where you are to where you want to go, you have to learn and practice something new and different.((Чтобы перейти от того, где вы находитесь, к тому, где вы хотите оказаться, вам нужно изучить и попрактиковать что-то новое и другое.))

If you want to be a better parent, you must learn and practice better parenting skills.((Если вы хотите быть лучшим родителем, вы должны изучить и практиковать лучшие родительские навыки.))

If you want to be a better spouse, you must study and practice relationship skills.((Если вы хотите быть лучшим супругом, вы должны изучать и практиковать навыки отношений.))

If you want to earn more money, you have to determine what it is that people will pay more money for and then get busy learning and practicing those behaviors.((Если вы хотите зарабатывать больше денег, вы должны определить, за что люди готовы платить больше, а затем заняться изучением и практикой этих навыков.))`
      },

      // ===== ГЛАВА 31 =====
      {
        title: "Personal Growth as a Motivator ((Личностный рост как мотиватор))",
        content: `Harvard University studies on motivation some years ago found that:((Исследования Гарвардского университета по мотивации несколько лет назад показали, что:))

The experience of personal growth is one of the best of all motivators.((Переживание личностного роста — один из лучших мотиваторов из всех.))

When you feel yourself learning and growing and becoming more capable and competent, you get a natural high.((Когда вы чувствуете, что учитесь, растёте и становитесь более способными и компетентными, вы получаете естественный подъём.)) You feel happy and exhilarated.((Вы чувствуете себя счастливыми и воодушевлёнными.)) You feel positive and excited about your life and your future.((Вы чувствуете позитив и волнение по поводу своей жизни и будущего.))

On the other hand, when people stop growing as the result of no longer learning new things, they begin to stagnate mentally.((С другой стороны, когда люди перестают расти из-за того, что больше не учатся новому, они начинают умственно застаиваться.)) People who have stopped growing are far more prone to negativity, pessimism, fears, doubts, and anxiety.((Люди, которые перестали расти, гораздо более склонны к негативу, пессимизму, страхам, сомнениям и тревоге.))

And you can throw these all off by deciding what it is you need to learn and by putting your whole heart into learning those things you need in a rapid, enjoyable way.((И вы можете отбросить всё это, решив, что вам нужно изучить, и вложив всё своё сердце в изучение этих вещей быстрым и приятным способом.))`
      },

      // ===== ГЛАВА 32 =====
      {
        title: "You Are Already an Excellent Learner ((Вы уже отличный ученик))",
        content: `The good news is that you are already an excellent learner.((Хорошая новость в том, что вы уже отличный ученик.)) You have already learned thousands of things, starting from infancy:((Вы уже выучили тысячи вещей, начиная с младенчества:))

• By the time you were six years old, you had learned to recognize and use more than 5,000 words with ease((• К тому времени, когда вам исполнилось шесть лет, вы научились легко распознавать и использовать более 5000 слов))
• You've learned tremendous social skills((• Вы освоили огромные социальные навыки))
• You've learned how to play a variety of sports, to ride a bicycle, drive a car, be a husband or a wife, and how to sell, manage, negotiate, motivate, communicate, and interact with hundreds and even thousands of different people((• Вы научились играть в различные виды спорта, кататься на велосипеде, водить машину, быть мужем или женой, а также продавать, управлять, вести переговоры, мотивировать, общаться и взаимодействовать с сотнями и даже тысячами разных людей))

In fact, as you will learn in the next session, you are actually a brilliant human being.((Фактически, как вы узнаете в следующей сессии, вы на самом деле блестящий человек.)) You have mental capacities that are far beyond anything that you have ever imagined.((У вас есть умственные способности, которые далеко превосходят всё, что вы когда-либо могли себе представить.))

Accelerated learning does not require that you become something more or different than what you are.((Ускоренное обучение не требует, чтобы вы стали чем-то большим или иным, чем вы есть.)) It simply shows you how to become far more of what you are already capable of becoming.((Оно просто показывает вам, как стать гораздо большим из того, кем вы уже способны стать.))`
      },

      // ===== ГЛАВА 33 =====
      {
        title: "Negative School Experiences ((Негативный школьный опыт))",
        content: `Like myself, many people have had negative experiences going to school.((Как и я, многие люди имели негативный опыт посещения школы.)) Because the way of teaching was not consistent with your individual way of learning, you may have had difficulties with various subjects.((Поскольку способ преподавания не соответствовал вашему индивидуальному способу обучения, у вас могли возникнуть трудности с различными предметами.)) You may have experienced underachievement and even failure.((Вы могли испытывать недостаточную успеваемость и даже неудачи.)) You may have experienced negative comparisons with others.((Вы могли испытывать негативные сравнения с другими.))

You may have gone through:((Вы могли пройти через:))

• Poor report cards((• Плохие табели успеваемости))
• Failed tests and examinations((• Проваленные тесты и экзамены))
• Repetition of classes and courses((• Повторение классов и курсов))
• A general feeling of inferiority when it came to learning new subjects((• Общее чувство неполноценности, когда дело доходило до изучения новых предметов))

Well, you're not alone.((Что ж, вы не одиноки.)) This just happens to describe the school experiences of about 70 to 80% of the population.((Это как раз описывает школьный опыт примерно 70-80% населения.))

Fortunately, we've learned more in the last 15 years about how the brain functions and how to learn well than we have learned in all of human history.((К счастью, за последние 15 лет мы узнали о том, как работает мозг и как хорошо учиться, больше, чем мы узнали за всю историю человечества.)) What we know is that our current methods of teaching do not fit with what we know about how the brain really works.((Что мы знаем, так это то, что наши текущие методы преподавания не соответствуют тому, что мы знаем о том, как на самом деле работает мозг.)) They work for only a small number of students and leave the rest undereducated and undermotivated.((Они работают только для небольшого числа учеников и оставляют остальных недообразованными и немотивированными.))`
      },

      // ===== ГЛАВА 34 =====
      {
        title: "With Accelerated Learning, It's All Different ((С ускоренным обучением всё по-другому))",
        content: `When you practice accelerated learning techniques and learn the way you are uniquely designed to learn, you will be able to absorb and retain huge quantities of information.((Когда вы практикуете техники ускоренного обучения и учитесь так, как вы уникально созданы для обучения, вы сможете поглощать и удерживать огромные объёмы информации.)) You will amaze yourself and everyone around you.((Вы поразите себя и всех вокруг.))`
      },

      // ===== ГЛАВА 35 =====
      {
        title: "The Six Principles ((Шесть принципов))",
        content: `In closing this session, here are the six principles upon which this course, and perhaps the whole rest of your life, is built:((Завершая эту сессию, вот шесть принципов, на которых построен этот курс и, возможно, вся остальная ваша жизнь:))

1. No Limits((1. Нет ограничений))
You can learn anything you need to learn to accomplish any goal you want to accomplish, to become any person you want to become.((Вы можете научиться всему, что нужно, чтобы достичь любой цели, которую хотите достичь, стать любым человеком, которым хотите стать.)) There are no limits.((Нет ограничений.))

2. Learning How to Learn is the Key Ability((2. Умение учиться — ключевая способность))
Learning how to learn is the core competence that makes everything else possible for you for the rest of your life.((Умение учиться — это основная компетенция, которая делает всё остальное возможным для вас на всю оставшуюся жизнь.))

3. Anyone Can Learn Faster, Better, and Easier((3. Любой может учиться быстрее, лучше и легче))
Anyone can learn faster, better, and easier than ever before by discovering how their brain and their intelligences work, and then by structuring new information so that they can absorb it easily and well.((Любой может учиться быстрее, лучше и легче, чем когда-либо прежде, открыв, как работают его мозг и его интеллекты, а затем структурируя новую информацию так, чтобы он мог легко и хорошо её усваивать.))

4. Intelligence is Not Fixed((4. Интеллект не фиксирован))
Intelligence is like a muscle.((Интеллект похож на мышцу.)) It can be made to grow with use.((Его можно заставить расти с использованием.)) This means that you can become far smarter and more mentally acute than you are today simply by engaging in the mental exercises that you will learn in this course.((Это означает, что вы можете стать гораздо умнее и острее умственно, чем сегодня, просто занимаясь умственными упражнениями, которые вы изучите в этом курсе.))

5. To Earn More, You Must Learn More((5. Чтобы зарабатывать больше, вы должны учиться больше))
Since there's no limit on how much you can learn in your field or in any other field, there's virtually no limit on how much you can ultimately earn as well.((Поскольку нет ограничений на то, сколько вы можете узнать в своей области или в любой другой области, практически нет ограничений и на то, сколько вы в конечном итоге можете заработать.))

6. You Can Achieve Almost Any Goal((6. Вы можете достичь почти любой цели))
You can achieve almost any goal, solve almost any problem, and overcome almost any obstacle in your life by acquiring the necessary knowledge and skill required by that particular situation.((Вы можете достичь почти любой цели, решить почти любую проблему и преодолеть почти любое препятствие в своей жизни, приобретая необходимые знания и навыки, требуемые в конкретной ситуации.)) There are virtually no limits.((Практически нет ограничений.))`
      },

      // ===== ГЛАВА 36 =====
      {
        title: "Final Thoughts ((Заключительные мысли))",
        content: `The benefits you will enjoy in terms of greater income, greater security, greater prestige, more rapid advancement and promotability, greater self-confidence, and a greater feeling of power and control over your life are tremendous.((Преимущества, которые вы получите в виде более высокого дохода, большей безопасности, большего престижа, более быстрого продвижения и возможности повышения, большей уверенности в себе и большего чувства силы и контроля над своей жизнью — огромны.))

Learning how to learn rapidly and well is the key to accomplishing any goal you could ever set for yourself.((Умение учиться быстро и хорошо — это ключ к достижению любой цели, которую вы когда-либо могли поставить перед собой.))

Specific knowledge and skills will become obsolete with the passing of time, but learning how to learn is a permanent skill that you can use all the days of your life.((Конкретные знания и навыки устареют с течением времени, но умение учиться — это постоянный навык, который вы можете использовать во все дни своей жизни.))

The people who learn how to learn faster, earlier — like those people who learn how to operate the first computers or learn how to become excellent in their fields before others — will be able to earn more in one or two years of work than the average person earns in five or ten years.((Люди, которые учатся учиться быстрее и раньше — как те, кто научился работать на первых компьютерах или научился становиться отличными в своей области раньше других — смогут заработать за один-два года работы больше, чем средний человек зарабатывает за пять или десять лет.))

Accelerated learning techniques will enhance every area of your life:((Техники ускоренного обучения улучшат каждую область вашей жизни:))

• You'll be able to help your spouse and your children unlock and realize more of their individual potentials((• Вы сможете помочь своему супругу и своим детям раскрыть и реализовать больше их индивидуальных потенциалов))
• You'll be a better friend in helping your friends to utilize more of their abilities((• Вы будете лучшим другом, помогая своим друзьям использовать больше их способностей))
• You'll be a better manager and develop the skills to get far more out of other people than ever before((• Вы будете лучшим менеджером и разовьёте навыки, чтобы получать от других людей гораздо больше, чем когда-либо прежде))

Above all, in the sessions ahead, you will learn a new system for enhancing and enriching everything you do for all the years of your life.((Прежде всего, в предстоящих сессиях вы узнаете новую систему для улучшения и обогащения всего, что вы делаете, на все годы вашей жизни.))`
      },

      // ===== ГЛАВА 37 =====
      {
        title: "Conclusion: You Are a Potential Genius ((Заключение: Вы — потенциальный гений))",
        content: `Now you can send a short message to Vincent if you liked this part, and if you want to discuss it or share your thoughts or if you want to continue reading you can tell your teacherka about it. Vincent is always happy to make his students smile, happy and proud! Text me, and in the next session you will see why and how you are a potential genius.((А теперь напишите училочке своему что вы думаете и хотите ли дальше читать, болтать и учить Инглиш.))`
      }


    ]
  },

  littleRedRidingHood: {
    mainTitleOfTheText: "Little Red Riding Hood",
    author: "Brothers Grimm",
    chapters: [
      // ===== ВВЕДЕНИЕ =====
      {
        picture: new URL("../assets/images/littleRedRidingHood_TJPEG.jpeg", import.meta.url).href,

        title: "A hood - капюшон / худ / ((Riding hood - у наездников обычно накидка))",
        content: `В английской версии этого рассказа девочку рисуют не в шапочке, а в накидке с капюшоном, в таких обычно на конях скакали. Поэтому и сказку называют по-английски Riding Red Hood, а не Red Hat`
      },
      // ===== ГЛАВА 1 =====
      {

        title: "The Little Hat ((Красная шапочка))",
        content: `Once upon a time there was a sweet little girl. (("Однажды жила-была милая маленькая девочка". {Не нужно переводить каждое слово по отдельности - запоминайте фразу целиком как она есть, а не отдельные слова. Именно с такой фразы - начинаются почти все сказки и смысл его такой - УАНС АПОН Э ТАЙМ ДЭЭ ВОЗ Э СВИТ ЛИТЛ ГЁРЛ - вы справитесь! Винсент в Вас верит!} )) Everyone who saw her liked her, but most of all her grandmother, who did not know what to give the child next. ((Все, кто её видел, любили её, но больше всех — её бабушка, которая не знала, что ещё подарить ребёнку.)) Once she gave her a little hat made of red velvet. ((Однажды она подарила ей шапочку из красного бархата.)) Because it suited her so well, and she wanted to wear it all the time, she came to be known as Little Red Riding Hood. ((Поскольку она так хорошо ей шла, и она хотела носить её всё время, её стали называть Красной Шапочкой.))

One day her mother said to her: ((Однажды её мама сказала ей:)) "Come Little Red Riding Hood. ((«Иди, Красная Шапочка.)) Here is a piece of cake and a bottle of wine. ((Вот кусок пирога и бутылка вина.)) Take them to your grandmother. ((Отнеси их своей бабушке.)) She is sick and weak, and they will do her well. ((Она больна и слаба, и это поможет ей.)) Mind your manners and give her my greetings. ((Веди себя прилично и передай ей мой привет.)) Behave yourself on the way, and do not leave the path, or you might fall down and break the glass, and then there will be nothing for your sick grandmother." ((Веди себя хорошо в дороге и не сходи с тропинки, иначе ты можешь упасть и разбить бутылку, и тогда твоей больной бабушке ничего не достанется.»))

Little Red Riding Hood promised to obey her mother. ((Красная Шапочка пообещала слушаться свою маму.))`
      },

      // ===== ГЛАВА 2 =====
      {
        title: "The Wolf ((Волк))",
        content: `The grandmother lived out in the woods, a half hour from the village. ((Бабушка жила в лесу, в получасе ходьбы от деревни.)) When Little Red Riding Hood entered the woods a wolf came up to her. ((Когда Красная Шапочка вошла в лес, к ней подошёл волк.)) She did not know what a wicked animal he was, and was not afraid of him. ((Она не знала, какой он злой зверь, и не испугалась его.)) "Good day to you, Little Red Riding Hood." ((«Добрый день тебе, Красная Шапочка.»)) - "Thank you, wolf." ((«Спасибо, волк.»)) - "Where are you going so early, Little Red Riding Hood?" ((«Куда ты так рано идёшь, Красная Шапочка?»)) - "To grandmother's." ((«К бабушке.»)) - "And what are you carrying under your apron?" ((«А что ты несёшь под фартуком?»)) - "Grandmother is sick and weak, and I am taking her some cake and wine. ((«Бабушка больна и слаба, и я несу ей пирог и вино.)) We baked yesterday, and they should give her strength." ((Мы пекли вчера, и это должно придать ей сил.»)) - "Little Red Riding Hood, just where does your grandmother live?" ((«Красная Шапочка, а где именно живёт твоя бабушка?»)) - "Her house is a good quarter hour from here in the woods, under the three large oak trees. ((«Её дом в четверти часа ходьбы отсюда в лесу, под тремя большими дубами.)) There's a hedge of hazel bushes there. ((Там есть живая изгородь из орешника.)) You must know the place," said Little Red Riding Hood. ((Ты должен знать это место,» — сказала Красная Шапочка.))

The wolf thought to himself: ((Волк подумал про себя:)) "Now there is a tasty bite for me. ((«Вот теперь для меня есть вкусный кусочек.)) Just how are you going to catch her?" ((«Как бы мне её поймать?»)) Then he said: ((Затем он сказал:)) "Listen, Little Red Riding Hood, haven't you seen the beautiful flowers that are blossoming in the woods? ((«Послушай, Красная Шапочка, разве ты не видела красивые цветы, которые цветут в лесу?)) Why don't you go and take a look? ((Почему бы тебе не пойти и не посмотреть?)) And I don't believe you can hear how beautifully the birds are singing. ((И я не верю, что ты слышишь, как красиво поют птицы.)) You are walking along as though you were on your way to school in the village. ((Ты идёшь так, будто направляешься в школу в деревне.)) It is very beautiful in the woods." ((В лесу очень красиво.»))`
      },

      // ===== ГЛАВА 3 =====
      {
        title: "The Wolf Eats Grandmother ((Волк съедает бабушку))",
        content: `Little Red Riding Hood opened her eyes and saw the sunlight breaking through the trees and how the ground was covered with beautiful flowers. ((Красная Шапочка открыла глаза и увидела, как солнечный свет пробивается сквозь деревья и как земля покрыта красивыми цветами.)) She thought: ((Она подумала:)) "If a take a bouquet to grandmother, she will be very pleased. ((«Если я отнесу букет бабушке, она будет очень довольна.)) Anyway, it is still early, and I'll be home on time." ((В любом случае, ещё рано, и я вернусь домой вовремя.»)) And she ran off into the woods looking for flowers. ((И она побежала в лес искать цветы.)) Each time she picked one she thought that she could see an even more beautiful one a little way off, and she ran after it, going further and further into the woods. ((Каждый раз, когда она срывала один, ей казалось, что она видит ещё более красивый чуть поодаль, и она бежала за ним, заходя всё дальше и дальше в лес.))

But the wolf ran straight to the grandmother's house and knocked on the door. ((Но волк побежал прямо к дому бабушки и постучал в дверь.)) "Who's there?" ((«Кто там?»)) - "Little Red Riding Hood. ((«Красная Шапочка.)) I'm bringing you some cake and wine. ((Я несу тебе пирог и вино.)) Open the door for me." ((Открой мне дверь.»)) - "Just press the latch," called out the grandmother. ((«Просто нажми на засов,» — крикнула бабушка.)) "I'm too weak to get up." ((«Я слишком слаба, чтобы встать.»)) The wolf pressed the latch, and the door opened. ((Волк нажал на засов, и дверь открылась.)) He stepped inside, went straight to the grandmother's bed, and ate her up. ((Он вошёл внутрь, подошёл прямо к бабушкиной кровати и съел её.)) Then he took her clothes, put them on, and put her hat on his head. ((Затем он взял её одежду, надел её и надел её шапочку себе на голову.)) He got into her bed and pulled the curtains shut. ((Он лёг в её кровать и задёрнул занавески.))`
      },

      // ===== ГЛАВА 4 =====
      {
        title: "Little Red Riding Hood Arrives ((Красная Шапочка приходит))",
        content: `Little Red Riding Hood had run after flowers, and did not continue on her way to grandmother's until she had gathered all that she could carry. ((Красная Шапочка бегала за цветами и не продолжила путь к бабушке, пока не набрала столько, сколько могла унести.)) When she arrived, she found, to her surprise, that the door was open. ((Когда она пришла, она с удивлением обнаружила, что дверь открыта.)) She walked into the parlor, and everything looked so strange that she thought: ((Она вошла в гостиную, и всё выглядело так странно, что она подумала:)) "Oh, my God, why am I so afraid? ((«О, Боже, почему мне так страшно?)) I usually like it at grandmother's." ((Обычно мне нравится у бабушки.»)) Then she went to the bed and pulled back the curtains. ((Затем она подошла к кровати и отдёрнула занавески.)) Grandmother was lying there with her hat pulled down over her face and looking very strange. ((Бабушка лежала там с шапочкой, надвинутой на лицо, и выглядела очень странно.))

"Oh, grandmother, what big ears you have!" ((«О, бабушка, какие у тебя большие уши!»)) - "All the better to hear you with." ((«Чтобы лучше слышать тебя.»)) - "Oh, grandmother, what big eyes you have!" ((«О, бабушка, какие у тебя большие глаза!»)) - "All the better to see you with." ((«Чтобы лучше видеть тебя.»)) - "Oh, grandmother, what big hands you have!" ((«О, бабушка, какие у тебя большие руки!»)) - "All the better to grab you with!" ((«Чтобы лучше схватить тебя!»)) - "Oh, grandmother, what a horribly big mouth you have!" ((«О, бабушка, какой у тебя ужасно большой рот!»)) - "All the better to eat you with!" ((«Чтобы лучше съесть тебя!»)) And with that he jumped out of bed, jumped on top of poor Little Red Riding Hood, and ate her up. ((И с этими словами он выпрыгнул из кровати, прыгнул на бедную Красную Шапочку и съел её.))`
      },

      // ===== ГЛАВА 5 =====
      {
        title: "The Huntsman Saves Them ((Охотник спасает их))",
        content: `As soon as the wolf had finished this tasty bite, he climbed back into bed, fell asleep, and began to snore very loudly. ((Как только волк закончил этот вкусный обед, он забрался обратно в кровать, заснул и начал очень громко храпеть.)) A huntsman was just passing by. ((Охотник как раз проходил мимо.)) He thought it strange that the old woman was snoring so loudly, so he decided to take a look. ((Он подумал, что странно, что старушка так громко храпит, и решил заглянуть.)) He stepped inside, and in the bed there lay the wolf that he had been hunting for such a long time. ((Он вошёл внутрь, и в кровати лежал тот самый волк, на которого он так долго охотился.)) "He has eaten the grandmother, but perhaps she still can be saved. ((«Он съел бабушку, но, возможно, её ещё можно спасти.)) I won't shoot him," thought the huntsman. ((«Я не буду в него стрелять,» — подумал охотник.)) So he took a pair of scissors and cut open his belly. ((Поэтому он взял ножницы и разрезал волку живот.)) He had cut only a few strokes when he saw the red hat shining through. ((Он сделал всего несколько разрезов, когда увидел, что сквозь шерсть блестит красная шапочка.)) He cut a little more, and the girl jumped out and cried: ((Он разрезал ещё немного, и девочка выпрыгнула и закричала:)) "Oh, I was so frightened! ((«О, как же мне было страшно!)) It was so dark inside the wolf's body!" ((«Так темно было внутри волчьего тела!»)) And then the grandmother came out alive as well. ((А затем вышла живой и бабушка.)) Then Little Red Riding Hood fetched some large heavy stones. ((Затем Красная Шапочка принесла большие тяжёлые камни.)) They filled the wolf's body with them, and when he woke up and tried to run away, the stones were so heavy that he fell down dead. ((Они заполнили волчий живот камнями, и когда он проснулся и попытался убежать, камни были такими тяжёлыми, что он упал замертво.))

The three of them were happy. ((Все трое были счастливы.)) The huntsman took the wolf's pelt. ((Охотник снял с волка шкуру.)) The grandmother ate the cake and drank the wine that Little Red Riding Hood had brought. ((Бабушка съела пирог и выпила вино, которое принесла Красная Шапочка.)) And Little Red Riding Hood thought to herself: ((И Красная Шапочка подумала про себя:)) "As long as I live, I will never leave the path and run off into the woods by myself if mother tells me not to." ((«Пока я жива, я никогда не сойду с тропинки и не убегу в лес одна, если мама запретит мне.»))`
      },

      // ===== ГЛАВА 6 =====
      {
        title: "The Second Wolf ((Второй волк))",
        content: `They also tell how Little Red Riding Hood was taking some baked things to her grandmother another time, when another wolf spoke to her and wanted her to leave the path. ((Рассказывают также, как Красная Шапочка в другой раз несла бабушке что-то из выпечки, и снова волк заговорил с ней и хотел, чтобы она сошла с тропинки.)) But Little Red Riding Hood took care and went straight to grandmother's. ((Но Красная Шапочка была осторожна и пошла прямо к бабушке.)) She told her that she had seen the wolf, and that he had wished her a good day, but had stared at her in a wicked manner. ((Она рассказала, что видела волка, и что он пожелал ей доброго дня, но смотрел на неё злобно.)) "If we hadn't been on a public road, he would have eaten me up," she said. ((«Если бы мы не были на большой дороге, он бы меня съел,» — сказала она.)) "Come," said the grandmother. ((«Пойдём,» — сказала бабушка.)) "Let's lock the door, so he can't get in." ((«Давай закроем дверь, чтобы он не мог войти.»))

Soon afterward the wolf knocked on the door and called out: ((Вскоре после этого волк постучал в дверь и крикнул:)) "Open up, grandmother. ((«Открой, бабушка.)) It's Little Red Riding Hood, and I'm bringing you some baked things." ((«Это Красная Шапочка, я несу тебе угощение.»)) They remained silent, and did not open the door. ((Они молчали и не открывали дверь.)) The wicked one walked around the house several times, and finally jumped onto the roof. ((Злодей несколько раз обошёл дом и наконец запрыгнул на крышу.)) He wanted to wait until Little Red Riding Hood went home that evening, then follow her and eat her up in the darkness. ((Он хотел дождаться, пока Красная Шапочка вечером пойдёт домой, затем последовать за ней и съесть её в темноте.))

But the grandmother saw what he was up to. ((Но бабушка видела, что он задумал.)) There was a large stone trough in front of the house. ((Перед домом стояло большое каменное корыто.)) "Fetch a bucket, Little Red Riding Hood," she said. ((«Принеси ведро, Красная Шапочка,» — сказала она.)) "Yesterday I cooked some sausage. ((«Вчера я варила колбасу.)) Carry the water that I boiled them with to the trough." ((«Отнеси воду, в которой я их варила, в корыто.»)) Little Red Riding Hood carried water until the large, large trough was clear full. ((Красная Шапочка носила воду, пока большое-пребольшое корыто не наполнилось до краёв.)) The smell of sausage arose into the wolf's nose. ((Запах колбасы ударил волку в нос.)) He sniffed and looked down, stretching his neck so long that he could no longer hold himself, and he began to slide. ((Он понюхал и посмотрел вниз, вытягивая шею так сильно, что больше не мог удержаться и начал скользить.)) He slid off the roof, fell into the trough, and drowned. ((Он соскользнул с крыши, упал в корыто и утонул.)) And Little Red Riding Hood returned home happily and safely. ((И Красная Шапочка счастливая и невредимая вернулась домой.))`
      }
    ]
  },
  test: {
    mainTitleOfTheText: "📖 Test",
    author: "Vincent",
    chapters: [
      {
        title: "From test to test ((От теста к тесту))",
        picture: new URL("../assets/images/ielts_listening_7.png", import.meta.url).href,
        content: `It is a test of a new unknown word. And this is a test of the translated sentence. Everything is here. It is hilarious, but yet very useful`
      },
      {
        title: "From test to test ((От теста к тесту))",
        picture: new URL("../assets/images/ielts_listening_2.png", import.meta.url).href,
        content: `It is a test of a new unknown word. And this is a test of the translated sentence. Everything is here. It is hilarious, but yet very useful`
      },
    ]
  },


};

export default engBooksData;

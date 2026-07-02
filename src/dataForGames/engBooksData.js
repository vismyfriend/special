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

  acceleratedLearningInAction: {
    mainTitleOfTheText: "THE LEARNING REVOLUTION",
    author: "(это не ИИ) -> this is one of Vincent's favorite books. Часть первая.",
    chapters: [

      {
        title: null,
        content: `Welcome to the revolution.((Добро пожаловать в революцию.)) We entered into the most <em>turbulent /\u00A0тёр\u00A0бу\u00A0лент\u00A0/</em> time in all of human history, when changes happen more often, more <em><b>rapidly</b> /\u00A0рэ\u00A0пид\u00A0ли\u00A0/</em>, and more <em><b>unpredictably</b> /\u00A0ан\u00A0пре\u00A0дик\u00A0та\u00A0бли\u00A0/</em> than ever before.((Мы вступили в самое неспокойное время во всей истории человечества, когда перемены происходят чаще, быстрее и непредсказуемее, чем когда-либо прежде.))

And the only thing we know about the future is that it will be faster, changing, and more unpredictable than the present.((И единственное, что мы знаем о будущем — оно будет быстрее, изменчивее и непредсказуемее, чем настоящее.)) Your job is to learn how to <em>survive</em> and <em><b>thrive</b></em> in the months and years ahead. ((Ваша задача — научиться выживать и процветать в предстоящие месяцы и годы))

And this S.P.E.C.I.A.L. program is designed to help you do exactly that.((И эта программа создана, чтобы помочь вам именно в этом.))`
      },
      {
        title: null,
        content: `The Key Principle is : ((Ключевой момент, принцип :))

<strong>The great breakthrough in your life comes when you realize that you can learn anything you need to learn to accomplish any goal that you can set for yourself.((Великий прорыв в вашей жизни наступает, когда вы осознаёте, что можете научиться всему, чему вам нужно научиться, чтобы достичь любой цели, которую вы перед собой ставите.))</strong>`
      },
      {
        title: "From Failure to Success ((От провала к успеху))",

        content: `This is the story of Brian Tracy((Это история Брайана Трэйси )). Let's listen to what he says about his life experience.((Давайте полсушаем что он говорит о его жизненном опыте.)) I have studied, practiced, and taught in the area of human potential development for more than 30 years.((Я изучал, практиковал и преподавал в области развития человеческого потенциала более 30 лет.))

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
  acceleratedLearningInAction2: {
    mainTitleOfTheText: "YOU ARE A GENIOUS / джИ ни ус / гений",
    author: "(это не ИИ) -> this is one of Vincent's favorite books. Часть вторая.",
    audioUrl: new URL('../assets/audio/02-YouAreAGenius.mp3', import.meta.url).href,

    chapters: [

      // ===== ГЛАВА 38 =====
      {
        title: "The Bottom Line ((Суть))",
        content: `You are a <em>potential /\u00A0потЭн\u00A0шиал\u00A0/</em> genius.((Ты — потенциальный гений.)) You have the mental <em>capacity</em> to be, have and do anything you really want in life.((У тебя есть умственный потенциал-емкость, чтобы быть, иметь и делать всё, что ты действительно хочешь в жизни.)) By <em>harnessing</em> your amazing mental powers you can <em>accomplish</em> any goal, <em>overcome</em> any obstacle and solve any problem.((Обуздав свои удивительные умственные силы, ты можешь достичь любой цели, преодолеть любое препятствие и решить любую проблему.))

We are learning more today about the <em>incredible /\u00A0ин\u00A0крЭ\u00A0дэ\u00A0бэл/ potential</em>  of your brain, than we ever learned before in human history.((Сегодня мы узнаём об невероятном потенциале твоего мозга больше, чем когда-либо прежде за всю историю человечества.)) And all of it is good.((И всё из этого — хорошие новости.))

The <em>bottom line</em> of the research, that is now <em>pouring in</em> from all sides, is that you have amazing powers that you have not yet begun to use.((Суть исследований, которые сейчас поступают со всех сторон, заключается в том, что у вас есть удивительные способности, которые вы еще не начали использовать.)) When you learn to use your brain power to its full <em>potential</em>, the things you will be able to <em>accomplish</em> will be far beyond anything you've ever done in the past.((Когда вы научитесь использовать силу своего мозга на полную мощность, то, чего вы сможете достичь, будет далеко за пределами всего, что вы делали в прошлом.))

According to the Stanford Brain Institute, the average person gets by with about two percent of their mental <em>potential</em>.((По данным Стэнфордского института мозга, средний человек обходится примерно двумя процентами своего умственного потенциала.)) For some reason, most of us are keeping our mental <em>capacities</em> in <em>reserve</em>, saving them up for some great need at a later time.((По какой-то причине большинство из нас держат свои умственные способности в резерве, приберегая их для какой-то великой нужды в будущем.))

Your goal in life, your <em>responsibility</em> to yourself, is to become everything you are <em>capable</em> of becoming.((Ваша цель в жизни, ваша ответственность перед собой — стать всем, кем вы способны стать.)) In the information age, this means that your <em>obligation</em> to yourself must be to develop your mental abilities to the highest degree possible.((В информационную эпоху это означает, что ваша обязанность перед собой — развивать свои умственные способности до максимально возможной степени.)) And wonderfully enough, much of the <em>pioneering</em> work and research has already been done.((И, что замечательно, большая часть пионерской работы и исследований уже проделана.)) What you will learn in this course is tested, proven, and <em>practical</em>.((То, что вы узнаете из этого курса, проверено, доказано и практично.)) It works for anyone, anywhere, and under any set of <em>circumstances</em>.((Это работает для любого человека, в любом месте и при любых обстоятельствах.)) You are now able to get the <em>bottom line</em> results of decades of trial and error, and you will be learning proven techniques that will work for you as soon as you <em>apply</em> them.((Теперь у вас есть возможность получить суть результатов десятилетий проб и ошибок, и вы будете изучать проверенные техники, которые начнут работать на вас, как только вы их примените.))`
      },

      // ===== ГЛАВА 39 =====
      {
        title: "Your Brain: A Supercomputer Without a Manual ((Ваш мозг: суперкомпьютер без инструкции))",
        content: `Your brain is an incredibly complex and capable piece of equipment, but it comes without an owner's manual.((Ваш мозг — это невероятно сложное и мощное устройство, но оно поставляется владельцу без инструкции по эксплуатации.)) It is only today that we are learning how it works and how to get the best out of it.((Только сегодня мы начинаем понимать, как он работает и как выжать из него максимум.)) Your brain is like a supercomputer that's been delivered to you fully installed, but with no instructions on how to operate it for maximum effectiveness.((Ваш мозг подобен суперкомпьютеру, который вам доставили уже установленным, но без инструкций по его эксплуатации для максимальной эффективности.)) This course will show you how.((Этот курс покажет вам, как это сделать.))

Here's the first breakthrough in our knowledge of the brain.((Вот первый прорыв в наших знаниях о мозге.)) It is a discovery that you actually have three brains rather than just one.((Это открытие, что у вас на самом деле три мозга, а не один.)) Each of these brains has evolved after the other.((Каждый из этих мозгов эволюционировал вслед за другим.))

At the base of your skull, you have a rather primitive brain, what is called the reptilian brain.((В основании вашего черепа находится довольно примитивный мозг, так называемый рептильный мозг.)) It keeps you breathing and it keeps your heart beating.((Он заставляет вас дышать и поддерживает биение вашего сердца.)) It tells you to fight or run when danger threatens.((Он говорит вам сражаться или бежать, когда угрожает опасность.)) It also controls some of your more primitive instincts, like your sense of territory, which is why you start feeling angry or uncomfortable when someone moves too close to you.((Он также контролирует некоторые из ваших более примитивных инстинктов, например, чувство территории, поэтому вы начинаете злиться или чувствовать дискомфорт, когда кто-то подходит слишком близко.))

The next to evolve was your middle brain, a type of brain that mammals also possess.((Следующим эволюционировал ваш средний мозг — тип мозга, которым также обладают млекопитающие.)) We call this the mammalian brain for this reason.((По этой причине мы называем его мозгом млекопитающих.)) Only recently have we realized how important this middle brain is to learning.((Только недавно мы осознали, насколько важен этот средний мозг для обучения.)) Your middle brain controls your hormonal system, your health and immune system, your sexuality, your emotions, and an important part of your long-term memory.((Ваш средний мозг контролирует вашу гормональную систему, здоровье и иммунную систему, сексуальность, эмоции и важную часть долговременной памяти.))

The fact that your emotions and your long-term memory are both controlled from the same middle brain explains something that we have all observed.((Тот факт, что ваши эмоции и долговременная память контролируются одним и тем же средним мозгом, объясняет то, что мы все наблюдали.)) When something involves strong emotions, it is usually very well remembered.((Когда что-то связано с сильными эмоциями, это обычно очень хорошо запоминается.)) You probably remember your first kiss, for example, or where you were when you heard someone insignificant had died.((Вы, вероятно, помните свой первый поцелуй или где вы были, когда услышали, что кто-то (*незначительный*) умер.)) This also means that enjoyment and fun are important elements in learning because they involve positive emotions.((Это также означает, что удовольствие и веселье являются важными элементами обучения, поскольку они вовлекают положительные эмоции.))

Now make a fist with your hand.((Теперь сожмите руку в кулак.)) Wrap your hand over the top of this fist.((Обхватите этот кулак сверху другой рукой.)) If your wrist represents your primitive brain, then the fist is your middle brain and the hand wrapped over it represents your new brain.((Если ваше запястье представляет примитивный мозг, то кулак — это средний мозг, а рука, обхватывающая его, — ваш новый мозг.)) This third brain, your new brain or neocortex is truly extraordinary.((Этот третий мозг, ваш новый мозг или неокортекс, поистине необычаен.)) The good news is that this brain has all the capacity you will ever need to learn and remember anything you want, so long as you know how.((Хорошая новость в том, что этот мозг имеет всю необходимую вам емкость, чтобы учиться и запоминать всё, что вы захотите, при условии, что вы знаете, как это делать.))`
      },

      // ===== ГЛАВА 40 =====
      {
        title: "Brain Cells and Connections ((Клетки мозга и связи))",
        content: `The incredible capacity of your brain has only recently been realized.((О невероятной емкости вашего мозга узнали только недавно.)) You have about 100 billion brain cells.((У вас около 100 миллиардов клеток мозга.)) This is a number that is almost impossible to visualize.((Это число, которое почти невозможно визуализировать.)) It's 20 times the entire population of the world.((Это в 20 раз больше всего населения мира.))

A brain cell looks like a miniature octopus.((Клетка мозга похожа на миниатюрного осьминога.)) The cell is in the middle.((Клетка находится в центре.)) Branching out from that are tiny threads.((От нее отходят крошечные нити.)) Each time something touches or reaches one of your senses of sight, sound, or touch, it creates a thought or impression.((Каждый раз, когда что-то касается или достигает одного из ваших чувств — зрения, слуха или осязания — это создает мысль или впечатление.)) It travels out from a brain cell and along one of the little branch-like threads.((Оно перемещается от клетки мозга по одной из этих маленьких нитевидных веточек.)) These threads are called dendrites, from a Greek word meaning branch.((Эти нити называются дендритами, от греческого слова, означающего «ветвь».)) Then the thought crosses over to another brain cell along its branch.((Затем мысль переходит к другой клетке мозга по её ветви.)) The process continues with perhaps thousands or millions of brain cells being connected in sequence, like a string of Christmas lights, all lighting up one after the other.((Процесс продолжается, соединяя в последовательность тысячи или миллионы клеток мозга, подобно гирлянде рождественских огней, зажигающихся один за другим.))

This split-second mental chain reaction is conducted by electrical activity.((Эта мгновенная ментальная цепная реакция осуществляется благодаря электрической активности.)) Each time this chain reaction takes place, new connections form between brain cells.((Каждый раз, когда происходит эта цепная реакция, между клетками мозга образуются новые связи.)) Some of these connections become permanent.((Некоторые из этих связей становятся постоянными.)) That is why you can remember so many things without conscious effort, like riding a bicycle or driving a car.((Вот почему вы можете помнить так много вещей без сознательных усилий, например, как ездить на велосипеде или управлять автомобилем.))

Here's the key point.((Вот ключевой момент.)) It's not really the number of brain cells you have.((Дело не столько в количестве клеток мозга, которое у вас есть.)) It's the number of connections you make between those brain cells that determines how useful your brain becomes or how intelligent you really are.((Именно количество связей, которые вы устанавливаете между этими клетками, определяет, насколько полезным становится ваш мозг и насколько вы действительно умны.))

The big news from brain scientists over the last 10 or 15 years is that intelligence is not fixed.((Большая новость от ученых-мозговедов за последние 10–15 лет заключается в том, что интеллект не является фиксированной величиной.)) You become more intelligent the more you use your brain and the more stimulation you give your mind.((Вы становитесь умнее, чем больше используете свой мозг и чем больше стимуляции даете своему разуму.)) Because the more you use your brain, the more connections you make between your brain cells, the greater is your potential for intelligent thought.((Потому что чем больше вы используете свой мозг, тем больше связей образуется между клетками, и тем выше ваш потенциал для интеллектуального мышления.)) You literally expand your brain through use.((Вы буквально расширяете свой мозг через его использование.))

In a real sense, you are the architect of your own brain power.((В прямом смысле вы — архитектор собственной умственной силы.)) You can develop your own intelligence.((Вы можете развивать свой собственный интеллект.)) Except for an injury or major illness, you don't lose brain capacity as you grow older.((За исключением травмы или серьезной болезни, вы не теряете емкость мозга с возрастом.)) As long as you keep learning and seeking new experiences through hobbies, reading, work, sports, art, music, and so on, you continue to stay alive and alert.((Пока вы продолжаете учиться и искать новый опыт через хобби, чтение, работу, спорт, искусство, музыку и так далее, вы остаетесь живым и бдительным.)) Your brain thrives on novelty, and it only declines with a lack of stimulation.((Ваш мозг процветает на новизне и ухудшается только от недостатка стимуляции.)) The more you use your brain, the better it gets at virtually any age.((Чем больше вы используете свой мозг, тем лучше он становится практически в любом возрасте.)) On the other hand, the less you use it, the fewer brain cell connections you will make, and eventually your brain's capability will decline.((С другой стороны, чем меньше вы его используете, тем меньше связей между клетками образуется, и со временем возможности вашего мозга снизятся.)) The motto is, use it or lose it, and the choice is always yours.((Девиз таков: используй или потеряй, и выбор всегда за вами.))`
      },

      // ===== ГЛАВА 41 =====
      {
        title: "Two Halves of the Brain: Linear vs Global ((Два полушария мозга: линейное vs глобальное))",
        content: `Now, imagine that you're looking down on the top of your head and are able to see through your skull to the thinking brain within.((А теперь представьте, что вы смотрите на макушку своей головы и можете видеть сквозь череп мыслящий мозг внутри.)) What you would see is that the thinking brain, or neocortex, consists of two distinct halves.((Вы бы увидели, что мыслящий мозг, или неокортекс, состоит из двух отдельных половин.)) These are the cerebral hemispheres of your brain.((Это полушария вашего мозга.)) The two halves are connected by a rich bundle of nerves called the corpus callosum.((Две половины соединены богатым пучком нервов, называемым мозолистым телом.))

Each hemisphere, or half of the brain, tends to have its own style of processing information for learning.((Каждое полушарие имеет свой собственный стиль обработки информации для обучения.)) The left brain, for example, is the linear, logical, practical brain.((Левое полушарие, например, является линейным, логическим, практическим мозгом.)) It is responsible for speech, step-by-step logic and numbers.((Оно отвечает за речь, пошаговую логику и числа.)) Your right brain, on the other hand, is the creative, musical, emotional brain.((Ваше правое полушарие, с другой стороны, является творческим, музыкальным, эмоциональным мозгом.)) It's responsible for melodies, patterns and intuitions or feelings.((Оно отвечает за мелодии, паттерны и интуицию или чувства.))

Your left brain sees individual details.((Ваше левое полушарие видит отдельные детали.)) Your right brain sees the whole picture all at once.((Ваше правое полушарие видит всю картину целиком.)) People who are more left-brained or linear prefer a slow, step-by-step build-up of information.((Люди с более «левым» мышлением предпочитают медленное, пошаговое накопление информации.)) Others, more right-brained people, prefer and need to see the big picture of the subject and have an overview so they can see where it all leads to.((Другие, более «правополушарные» люди, предпочитают и нуждаются в том, чтобы видеть общую картину предмета и иметь обзор, чтобы понимать, к чему всё ведет.)) They need to see the picture of the jigsaw on the side of the box before they can begin assembling the pieces.((Им нужно увидеть картинку пазла на коробке, прежде чем они начнут собирать кусочки.)) This person is called a more global type of learner.((Такого человека называют более глобальным типом учащегося.))

When you listen to a song, the left brain will basically be attending to the words, while the right brain will be attending to the music.((Когда вы слушаете песню, левое полушарие в основном будет воспринимать слова, в то время как правое полушарие будет воспринимать музыку.)) In addition, the emotional center of your brain, your limbic system, will be engaged.((Кроме того, будет задействован эмоциональный центр вашего мозга — лимбическая система.)) In other words, when a song is playing and you're paying attention to it, your whole brain is actively involved.((Другими словами, когда играет песня и вы обращаете на неё внимание, весь ваш мозг активно вовлечен.))

Now think how comparatively easy it is to learn the words of a song.((Теперь подумайте, как сравнительно легко выучить слова песни.)) You probably already know dozens, maybe hundreds of songs from the past, yet you made very little conscious effort to learn them.((Вы, вероятно, уже знаете десятки, возможно, сотни песен из прошлого, но вы приложили очень мало сознательных усилий, чтобы их выучить.)) Sometimes you can hear the first chords of a song that was playing when you were a teenager, and you will immediately remember the time, the place, the person you were with and what was happening and a whole lot of other things.((Иногда вы можете услышать первые аккорды песни, которая играла, когда вы были подростком, и вы немедленно вспомните время, место, человека, с которым были, что происходило, и множество других вещей.)) This is because your brain was fully engaged when you were taking in the song and experiencing the emotions simultaneously.((Это потому, что ваш мозг был полностью задействован, когда вы воспринимали песню и одновременно испытывали эмоции.))

The conditions under which you easily learned song after song were that you were relaxed and stress-free.((Условия, в которых вы легко учили песню за песней, были таковы, что вы были расслаблены и свободны от стресса.)) In accelerated learning techniques, you will discover how to create the same kind of learning environment so that you learn other subjects at an equally rapid rate without stress or fatigue.((В техниках ускоренного обучения вы узнаете, как создать такую же учебную среду, чтобы изучать другие предметы с такой же скоростью, без стресса и усталости.))

A simple way to explain the difference between linear and global thinking would be to imagine someone you know.((Простой способ объяснить разницу между линейным и глобальным мышлением — представить кого-то, кого вы знаете.)) A total linear approach would be for you to build up the image of the person step by step.((Полностью линейный подход заключался бы в том, чтобы вы создавали образ человека шаг за шагом.)) You would first look at the hair, then the forehead, the eyebrows, the nose, the mouth, the chin, and so on one by one.((Вы бы сначала посмотрели на волосы, затем на лоб, брови, нос, рот, подбородок и так далее по порядку.)) It's a slow, logical buildup of information in sequence.((Это медленное, логическое накопление информации в последовательности.)) Of course you don't do that.((Конечно, вы так не делаете.)) You glance at the person and instantly your capacity for global thinking enables you to see the pattern that represents that person's appearance.((Вы смотрите на человека, и мгновенно ваша способность к глобальному мышлению позволяет вам увидеть тот паттерн, который представляет внешность этого человека.)) The result is that you immediately recognize the person.((В результате вы сразу узнаете человека.))

And here's the problem that arises in formal education.((И вот проблема, которая возникает в формальном образовании.)) Most traditional educational materials rely too heavily on the linear presentation or slow detailed buildup of information.((Большинство традиционных учебных материалов слишком сильно полагаются на линейное представление или медленное, детализированное накопление информации.)) The more global learners, most people get frustrated.((Более глобальные учащиеся, большинство людей, расстраиваются.)) They can't see where it's all leading to, so they get bored and switch off.((Они не видят, к чему всё это ведет, поэтому им становится скучно, и они отключаются.))

Most of your formal learning experiences have tended to be based on the type of instruction that linear learners most enjoy.((Большая часть вашего формального обучения была основана на том типе обучения, который больше всего нравится линейным учащимся.)) This is unfortunate for people who like intuitive right-brain thinking.((Это неудачно для людей, которым нравится интуитивное мышление правого полушария.)) School rarely enables them to achieve their full potential.((Школа редко позволяет им реализовать свой полный потенциал.)) It's also sad for those who rely on a linear type of thinking as well.((Это также печально для тех, кто полагается на линейный тип мышления.)) They have not been given the chance to develop more creative and intuitive styles of thinking.((Им не дали шанса развить более творческие и интуитивные стили мышления.))

Have you ever had a situation where you are absolutely stuck with something new you are reading?((Была ли у вас когда-нибудь ситуация, когда вы совершенно застряли с чем-то новым, что читаете?)) You are unable to retain it?((Вы не можете это запомнить?)) You are unable to maintain interest and concentration while you read?((Вы не можете поддерживать интерес и концентрацию во время чтения?)) Try looking at the way you are approaching it.((Попробуйте посмотреть на то, как вы к этому подходите.)) Can you identify your approach as linear or global?((Можете ли вы определить свой подход как линейный или глобальный?)) If you are a global learner, by using pictures, colored pens and pencils, a learning map or a poster, you will be able to represent the material to yourself and learn it far faster.((Если вы глобальный учащийся, используя картинки, цветные ручки и карандаши, интеллект-карту или плакат, вы сможете представить материал себе и выучить его гораздо быстрее.)) We'll cover this in subsequent sessions.((Мы рассмотрим это в следующих занятиях.))`
      },

      // ===== ГЛАВА 11 =====
      {
        title: "The Middle Brain and Emotions ((Средний мозг и эмоции))",
        content: `Understanding how your brain works is an absolutely essential part of accelerating your learning.((Понимание того, как работает ваш мозг, является абсолютно необходимой частью ускорения вашего обучения.)) Information entering your brain travels to the middle brain.((Информация, поступающая в ваш мозг, направляется в средний мозг.)) The middle brain acts as a sort of central switchboard.((Средний мозг действует как своего рода центральный коммутатор.)) It has a small appendage called the reticular cortex.((У него есть небольшой придаток, называемый ретикулярной корой.)) If it decides that incoming information is worthwhile or important, it switches that information up to your thinking brain where you notice it.((Если он решает, что входящая информация заслуживает внимания или важна, он переключает эту информацию в ваш мыслящий мозг, где вы её замечаете.))

This reticular cortex within your middle brain is not only a switchboard for incoming information, it's also the part of your brain that controls your emotions.((Эта ретикулярная кора в вашем среднем мозге — не только коммутатор для входящей информации, но и часть вашего мозга, которая контролирует ваши эмоции.)) When the new information is transmitted to you in ways that appeal positively to your emotions, you can learn well and remember easily.((Когда новая информация передается вам способами, которые положительно воздействуют на ваши эмоции, вы можете хорошо учиться и легко запоминать.)) When what you are learning includes color, picture, games, and musical accompaniment, your emotions become engaged positively and you learn faster and better.((Когда то, что вы изучаете, включает цвет, картинку, игры и музыкальное сопровождение, ваши эмоции вовлекаются положительно, и вы учитесь быстрее и лучше.)) The teachers and instructors that you remember the most were almost invariably the ones who were enthusiastic.((Учителя и инструкторы, которых вы помните больше всего, почти всегда были теми, кто был полон энтузиазма.)) Enthusiasm has emotional appeal.((Энтузиазм имеет эмоциональную привлекательность.))

However, when negative emotions of fear, doubt, worry, or anxiety are present, your middle brain may suppress incoming information.((Однако, когда присутствуют отрицательные эмоции — страх, сомнение, беспокойство или тревога, — ваш средний мозг может подавлять входящую информацию.)) If you're under stress, information may never even reach your thinking brain.((Если вы находитесь в состоянии стресса, информация может даже никогда не достигнуть вашего мыслящего мозга.)) It just gets filtered out.((Она просто отфильтровывается.)) This is what happens when your mind goes blank.((Это происходит, когда ваш мозг «отключается».))

Stress involves, however, not only the worries and concerns that you are conscious of.((Однако стресс включает в себя не только осознаваемые вами волнения и заботы.)) Very often, people with poor previous experiences of learning feel unconsciously threatened by new learning experiences.((Очень часто люди с неудачным прошлым опытом обучения бессознательно чувствуют угрозу от нового учебного опыта.)) This could happen to you.((Это может случиться и с вами.)) It becomes a vicious circle because when you feel you are poor at learning, you feel threatened.((Это становится порочным кругом, потому что когда вы чувствуете, что плохо учитесь, вы чувствуете угрозу.)) And because you feel under threat, your thinking brain receives less information and you do learn less effectively.((А потому, что вы чувствуете угрозу, ваш мыслящий мозг получает меньше информации, и вы действительно учитесь менее эффективно.)) If you feel insecure, less of your brain's potential is available.((Если вы чувствуете неуверенность, меньшая часть потенциала вашего мозга доступна.)) That's why when you're worried, you may suddenly come to realize that you've been staring at the page without taking it in.((Вот почему, когда вы обеспокоены, вы можете внезапно осознать, что смотрели на страницу, ничего не воспринимая.)) This is why you need to get into a calm, positive mood before you start learning.((Вот почему вам нужно войти в спокойное, позитивное настроение, прежде чем начать учиться.))

For you to function at your best, you must become actively involved in the entire learning process.((Чтобы вы функционировали наилучшим образом, вы должны активно участвовать во всем процессе обучения.)) Your entire brain, both left and right hemispheres, and your limbic, mammalian, and neocortex parts of your brain must all be involved in the way you approach and absorb new ideas.((Весь ваш мозг — и левое, и правое полушария, и лимбическая часть, и мозг млекопитающего, и неокортекс — должны быть вовлечены в то, как вы подходите к новым идеям и усваиваете их.))

Throughout your life, you've often been exposed to a single piece of information just once and have remembered it for many years, if not forever.((В течение вашей жизни вы часто сталкивались с какой-то информацией всего один раз и помнили её долгие годы, если не навсегда.)) This was a case when your whole brain was functioning at its best.((Это был случай, когда ваш мозг функционировал наилучшим образом.))

In the following sessions, you will learn method after method, each of which you can use to enhance your intelligence and accelerate your learning ability.((В следующих занятиях вы узнаете метод за методом, каждый из которых вы можете использовать, чтобы повысить свой интеллект и ускорить способность к обучению.)) By the time you are finished, not only will you be amazed at how good a student you are, but you will be delighted at the newfound pleasure that you derive from learning virtually anything you want, anytime you want to learn it.((К тому времени, когда вы закончите, вы не только будете поражены тем, какой вы хороший ученик, но и будете восхищены новообретенным удовольствием, которое вы будете получать от изучения практически всего, что захотите, когда захотите.))

Now let's look at some of the specific reasons why and how you can begin to function at exceptional levels.((Теперь давайте посмотрим на некоторые конкретные причины, почему и как вы можете начать функционировать на исключительном уровне.))`
      },

      // ===== ГЛАВА 12 =====
      {
        title: "Informal vs Formal Learning ((Неформальное vs Формальное обучение))",
        content: `Almost everything you've learned, you learn effortlessly and without trying.((Почти всему, чему вы научились, вы научились без усилий и не стараясь.)) You learned it through conversation, discussion, self-directed reading, fun, play, and interaction with others.((Вы узнали это через разговоры, обсуждения, самостоятельное чтение, веселье, игру и взаимодействие с другими.)) You learned many of your work-related skills on the job as a result of experience, feedback, self-analysis, and personal application.((Вы освоили многие рабочие навыки непосредственно на работе в результате опыта, обратной связи, самоанализа и личного применения.)) These are all examples of informal learning.((Это всё примеры неформального обучения.))

It's not uncommon for children playing on the street in multilingual neighborhoods to learn two, three, and four languages by the age of five or six without effort.((Нередко дети, играющие на улице в многоязычных районах, к пяти-шести годам без усилий учат два, три и четыре языка.)) They were so busy playing with their friends and involved in communicating with them that they never even thought that they were learning languages.((Они были так заняты играми с друзьями и общением с ними, что даже не думали, что учат языки.))

Think for a moment about the things that you feel you are really good at, both at home and at work.((Подумайте на мгновение о том, что, как вы считаете, вы умеете действительно хорошо делать, как дома, так и на работе.)) How did you become good at these things?((Как вы стали хороши в этом?)) What were the various things that you did that enabled you to advance so rapidly?((Какие различные вещи вы делали, которые позволили вам так быстро продвинуться?) How exactly did you learn to become competent, skilled, or proficient in each of these areas?((Как именно вы научились быть компетентным, квалифицированным или искусным в каждой из этих областей?))

One of the great secrets of success is to find out what works and do more of it.((Один из великих секретов успеха — найти то, что работает, и делать больше этого.)) The law of cause and effect says that there is a cause-effect relationship that explains everything that happens to you.((Закон причины и следствия гласит, что существует причинно-следственная связь, которая объясняет всё, что с вами происходит.)) When you begin to identify your dominant intelligences and your particular learning style, and you apply them to learning other skills and abilities, your learning will accelerate overnight.((Когда вы начнете определять свои доминирующие виды интеллекта и свой особый стиль обучения и примените их к изучению других навыков и способностей, ваше обучение ускорится в одночасье.))

The one thing you can conclude is that you are already a very good learner.((Единственное, что вы можете заключить, — вы уже очень хороший ученик.)) You have had to be throughout life.((Вы должны были быть таким на протяжении всей жизни.)) No one is born with the ability to walk, talk, function as a member of complex family relationships, create budgets, set schedules, count, sell, manage people, run a machine, use electric utensils, drive a car, read a paper, or anything else.((Никто не рождается с умением ходить, говорить, функционировать как член сложных семейных отношений, составлять бюджеты, устанавливать расписания, считать, продавать, управлять людьми, управлять станком, пользоваться электрическими приборами, водить машину, читать газету или чем-либо еще.)) These are all things that you had to learn by a process of trial and error.((Всему этому вам пришлось учиться методом проб и ошибок.)) And the remarkable thing is that you learn them almost effortlessly.((И замечательно то, что вы учитесь этому почти без усилий.)) In fact, you probably forget when and how you learn most of those things.((На самом деле, вы, вероятно, забываете, когда и как вы учились большинству из этих вещей.))

Now, you might say that that sort of learning isn't the problem.((Теперь вы можете сказать, что такой вид обучения — это не проблема.)) It's the sort of learning that involves textbooks, lectures, computers, and training rooms that is the challenge for you.((Проблема для вас — это тот вид обучения, который включает учебники, лекции, компьютеры и учебные классы.)) It is your experience with formal learning as opposed to informal learning that has caused you to question your ability.((Именно ваш опыт формального обучения, в отличие от неформального, заставил вас усомниться в своих способностях.)) This is the heart of the issue.((Это и есть суть проблемы.))

Most of your learning has been informal learning.((Большая часть вашего обучения была неформальным обучением.)) It's been based on exploration, and you've done it pretty successfully.((Оно было основано на исследовании, и вы справились с этим довольно успешно.)) In fact, most of the important things that you have learned in life, you have learned informally.((Фактически, большинству важных вещей в жизни вы научились неформально.))

To use a simple analogy, if you have the three numbers of a combination lock, having opened a combination lock once, you can open that or any other combination lock if you have the correct numbers.((Используя простую аналогию: если у вас есть три цифры кодового замка, открыв однажды такой замок, вы сможете открыть этот или любой другой кодовый замок, если у вас есть правильные цифры.)) But if you don't have the right numbers, or if you have the right numbers but they're in the wrong sequence, you can spin the dial of the lock indefinitely and not get it open.((Но если у вас нет правильных цифр или если они есть, но в неправильной последовательности, вы можете крутить диск замка бесконечно и не открыть его.)) This is the situation most people are in with regard to learning.((Вот в какой ситуации находятся большинство людей в отношении обучения.))

To go back to the example of informal learning, you will probably remember that this type of learning involves discussing things with others, asking lots of questions, a process of trial and error where you experiment with new information and ideas, getting other people's reactions, watching and practicing, getting some fun out of the process along the way.((Возвращаясь к примеру неформального обучения, вы, вероятно, вспомните, что этот тип обучения включает обсуждение с другими, задавание множества вопросов, метод проб и ошибок, когда вы экспериментируете с новой информацией и идеями, получаете реакцию других людей, смотрите и практикуете, получая некоторое удовольствие от процесса по ходу дела.)) The preschool child learns just like this.((Ребенок дошкольного возраста учится именно так.)) He uses all his senses.((Он использует все свои чувства.)) He is free of stress.((Он свободен от стресса.)) He has individual attention from the teacher.((У него есть индивидуальное внимание учителя.)) He's encouraged continuously, and he learns faster than at any other time of his life.((Его постоянно поощряют, и он учится быстрее, чем в любое другое время своей жизни.))

Many adult skills are also learned in a similar way through trial and error, talking to others and asking questions.((Многие взрослые навыки также осваиваются аналогичным образом через пробы и ошибки, общение с другими и задавание вопросов.))

It's the formal learning process that tends to give us problems.((Именно формальный процесс обучения доставляет нам проблемы.)) Why?((Почему?)) Because formal learning does not come naturally to most people.((Потому что формальное обучение не является естественным для большинства людей.)) It's largely based on textbooks, lectures, and study methods, and we need to be taught how to do it.((Оно в значительной степени основано на учебниках, лекциях и методах изучения, и нас нужно учить, как это делать.)) In a way, formal learning is a bit unnatural in terms of how we learn best and most effectively.((В некотором смысле, формальное обучение немного неестественно с точки зрения того, как мы учимся лучше и наиболее эффективно.)) It's natural, for example, to dance, but you need some training to be able to do a formal dance like a quick step or a waltz.((Например, танцевать естественно, но вам нужно некоторое обучение, чтобы уметь танцевать формальный танец, такой как квикстеп или вальс.))

Formal learning is necessary whenever you're confronted with the need to learn a large, complex subject with a structured body of information.((Формальное обучение необходимо всякий раз, когда вы сталкиваетесь с необходимостью изучить большую, сложную тему со структурированным массивом информации.)) You simply can't take it in in a random and haphazard way.((Вы просто не можете воспринимать это случайным и беспорядочным образом.))

In addition, preschool and primary school children usually learn with a lot of love and encouragement.((Кроме того, дети дошкольного и младшего школьного возраста обычно учатся с большой любовью и поощрением.)) They explore, they learn through games, and they work on cooperative projects involving lots of different activities.((Они исследуют, учатся через игры и работают над совместными проектами, включающими множество различных видов деятельности.)) It's fast, effective, and fun.((Это быстро, эффективно и весело.))

Then the rules change.((Затем правила меняются.)) They go off to primary school.((Они идут в школу.)) There's a sharp divide between the way they learned up till now and the way they're expected to learn in the future.((Существует резкий разрыв между тем, как они учились до сих пор, и тем, как от них ожидают учиться в будущем.)) Now they sit in rows.((Теперь они сидят по рядам.)) They are taught as a group and are expected to be quiet during the class.((Их учат как группу и ожидают, что они будут тихими во время урока.)) There is less group involvement.((Меньше группового взаимодействия.)) They are taught in more limited ways.((Их учат более ограниченными способами.)) And surprise, surprise, it doesn't seem to work as well as informal learning used to do.((И, что удивительно, это, кажется, не работает так же хорошо, как работало неформальное обучение.))

In one study, 95% of children tested between the ages of four and seven were found to be highly creative, intelligent, curious, and interested in the world around them.((В одном исследовании 95% детей в возрасте от 4 до 7 лет были признаны высокотворческими, интеллектуальными, любопытными и заинтересованными в окружающем мире.)) After several years of traditional schooling, only 7% of the same children at age 15 were found to still be highly creative and intelligent.((После нескольких лет традиционного школьного обучения только 7% тех же детей в возрасте 15 лет все еще считались высокотворческими и интеллектуальными.)) Those early years of schooling, using a model based on the Prussian system of 1830, turned the whole business of learning from an exciting, exhilarating experience to a boring, frustrating exercise that children only looked forward to getting out of as soon as possible.((Те ранние школьные годы, использующие модель, основанную на прусской системе 1830 года, превратили всё дело обучения из захватывающего, волнующего опыта в скучное, разочаровывающее занятие, из которого дети хотели вырваться как можно скорее.))

Why is formal learning more difficult?((Почему формальное обучение сложнее?))

First, formal learning concentrates on books and lectures.((Во-первых, формальное обучение сосредоточено на книгах и лекциях.)) These methods are effective and necessary, but by themselves, they're not enough for many people.((Эти методы эффективны и необходимы, но сами по себе они недостаточны для многих людей.)) You may remember being bored out of your head in school.((Вы, возможно, помните, как вам было смертельно скучно в школе.)) I certainly do.((Я точно помню.)) Many people, as we'll see, don't learn well unless they can add more natural ways to learn to the conventional and formal methods of teaching.((Многие люди, как мы увидим, учатся плохо, если они не могут добавить более естественные способы обучения к обычным и формальным методам преподавания.)) This course will teach you a variety of more natural ways for you to learn and to take in new information.((Этот курс научит вас различным более естественным способам обучения и восприятия новой информации.))

The second reason formal learning is more difficult for most people is that many books and lectures are written in a step-by-step academic style.((Вторая причина, по которой формальное обучение сложнее для большинства людей, заключается в том, что многие книги и лекции написаны пошаговым академическим стилем.)) This style often comes across as artificial and boring.((Этот стиль часто кажется искусственным и скучным.)) It's hard for you to concentrate because the material does not hold your attention.((Вам трудно сосредоточиться, потому что материал не удерживает ваше внимание.)) But fortunately, there are many ways you can restructure this type of formal learning situation so that it becomes more fun and enjoyable and far more effective.((Но, к счастью, есть много способов реструктурировать такую формальную учебную ситуацию, чтобы она стала более веселой, приятной и гораздо более эффективной.))

The third reason formal learning is more difficult than informal learning is because most of it requires you to work in large groups without much interaction or one-on-one teaching.((Третья причина, по которой формальное обучение сложнее неформального, заключается в том, что большая его часть требует от вас работы в больших группах без особого взаимодействия или индивидуального обучения.)) This reduces the amount of individual attention, which is such a successful feature of most informal learning.((Это уменьшает объем индивидуального внимания, что является такой успешной чертой большинства неформальных форм обучения.)) The preschool child usually has the individual attention of his parents or another caring adult.((Ребенок дошкольного возраста обычно имеет индивидуальное внимание своих родителей или другого заботливого взрослого.)) The person at work usually has the individual attention of his or her boss and colleagues as he or she trains to do the job.((Человек на работе обычно имеет индивидуальное внимание своего начальника и коллег, когда он учится выполнять работу.))`
      },

      // ===== ГЛАВА 13 =====
      {
        title: "The Law of Belief and the Power of Self-Concept ((Закон веры и сила самооценки))",
        content: `The big problem most people have today is that they equate learning with formal study-type learning.((Большая проблема, с которой сегодня сталкиваются большинство людей, заключается в том, что они отождествляют обучение с формальным учебным процессом.)) Because they were never taught to learn from books, lectures, and training sessions, many people lack confidence in their ability to learn formally.((Поскольку их никогда не учили учиться по книгам, лекциям и на тренингах, многие люди не уверены в своей способности учиться формально.)) They then conclude quite wrongly that they are poor learners.((Затем они совершенно ошибочно заключают, что они плохие ученики.))

The law of belief says that whatever you believe with feeling becomes your reality.((Закон веры гласит, что всё, во что вы верите с чувством, становится вашей реальностью.)) The starting point in becoming a genius is for you to believe that you have the capacity to learn anything you want and to learn it at a rapid rate.((Отправной точкой на пути к тому, чтобы стать гением, является ваша вера в то, что вы обладаете способностью учиться всему, чему захотите, и учиться этому с высокой скоростью.)) Your attitude toward your ability to learn will be more important than all the methods and techniques that you can possibly learn in this program.((Ваше отношение к своей способности учиться будет важнее всех методов и техник, которые вы можете изучить в этой программе.)) If you absolutely positively believe that you have unlimited capacity, that will become your reality.((Если вы абсолютно точно верите, что у вас неограниченный потенциал, это станет вашей реальностью.))

It's a shame that so many people left school with so many bad memories and experiences.((Жаль, что так много людей покинули школу с таким количеством плохих воспоминаний и переживаний.)) They started out into adult life wanting never to have to be exposed to education again.((Они вступили во взрослую жизнь, желая никогда больше не сталкиваться с образованием.)) But unless these people change their thinking about themselves and their capacities, they have no future in the information age.((Но если эти люди не изменят свое мышление о себе и своих способностях, у них нет будущего в информационную эпоху.)) According to the research, they will work at low-wage jobs marked by continued periods of unemployment and underemployment.((Согласно исследованиям, они будут работать на низкооплачиваемых работах, отмеченных периодами безработицы и неполной занятости.))

You have to become a positive, optimistic, enthusiastic learner if you want to achieve everything that is possible for you.((Вы должны стать позитивным, оптимистичным, увлеченным учеником, если хотите достичь всего, что для вас возможно.)) The power of positive expectations on your life and your future is quite incredible.((Сила позитивных ожиданий в вашей жизни и вашем будущем просто невероятна.)) If you expect to win, you most often will.((Если вы ожидаете победы, вы чаще всего побеждаете.)) If you expect to succeed, you will ultimately be a big success.((Если вы ожидаете успеха, вы в конечном итоге добьетесь большого успеха.)) If you expect to learn how to learn easily and well, then there is really nothing that can hold you back from doing it.((Если вы ожидаете научиться учиться легко и хорошо, то нет ничего, что могло бы вас остановить.))

The great breakthrough in psychology was the discovery that the amount of your potential that you use is largely determined by your self-concept, by the way you think and feel about yourself.((Великим прорывом в психологии стало открытие, что объем вашего потенциала, который вы используете, в значительной степени определяется вашей самооценкой, тем, как вы думаете и чувствуете о себе.)) If you believe yourself to be an outstanding person, capable of tremendous accomplishments, then that will become true for you.((Если вы считаете себя выдающимся человеком, способным на огромные достижения, это станет для вас правдой.)) You will walk, talk and act as if you had the qualities that you believe you have.((Вы будете ходить, говорить и действовать так, как будто у вас есть те качества, которые, как вы верите, у вас есть.)) On the other hand, if you're like most people and you are plagued by fears and doubts about your own abilities, these doubts will act as breaks on your potential.((С другой стороны, если вы, как и большинство людей, страдаете от страхов и сомнений в своих способностях, эти сомнения будут действовать как тормоза для вашего потенциала.)) They will hold you back and cause you to sell yourself short, to settle for far less than you're really capable of.((Они будут сдерживать вас и заставят вас недооценивать себя, довольствоваться гораздо меньшим, чем вы действительно способны достичь.)) Your levels of performance and personal effectiveness are determined by your self-image, your self-esteem and your self-concept.((Ваши уровни производительности и личной эффективности определяются вашим образом себя, вашей самооценкой и вашей самооценкой.)) As you begin to think about yourself in a more positive way, you begin to accomplish even more.((Когда вы начинаете думать о себе более позитивно, вы начинаете достигать еще большего.))

When we say that you can dramatically increase your intelligence so that you function at genius or exceptional levels, your first instinct may be to reject the notion.((Когда мы говорим, что вы можете значительно повысить свой интеллект, чтобы функционировать на гениальном или исключительном уровне, ваш первый инстинкт может быть отвергнуть эту идею.)) After all, you've been going on the same way for many years.((В конце концов, вы жили так много лет.)) The idea that you could increase your intelligence and your functional mental ability two, three, four times or more is too incredible for most people to even imagine.((Идея, что вы можете увеличить свой интеллект и функциональные умственные способности в два, три, четыре раза и более, слишком невероятна, чтобы большинство людей могли даже представить.)) But here's another analogy.((Но вот другая аналогия.))

If you decide you want to learn to type with a typewriter or keyboard, there are two ways that you can do it.((Если вы решите научиться печатать на пишущей машинке или клавиатуре, есть два способа это сделать.)) You can use the hunt-and-peck method, where you concentrate on the keyboard and you peck out the words with your four fingers one by one.((Вы можете использовать метод «тыка», когда вы сосредотачиваетесь на клавиатуре и выстукиваете слова четырьмя пальцами по одному.)) With this method and a little luck and persistence, you might get your typing speed up to around 8 to 10 words per minute.((С этим методом и небольшим везением и упорством вы можете довести скорость печати примерно до 8–10 слов в минуту.)) However, if you were serious about being an excellent typist, you could take one of the many touch typing courses that are available.((Однако, если вы серьезно настроены стать отличным машинистом, вы можете пройти один из многих курсов слепой печати.)) If you practiced one hour per day for 30 days, putting your fingers on the proper keys, and following the instructions in the course, you could get your typing speed up to 30, 40, and even 50 words per minute.((Если вы будете практиковаться по часу в день в течение 30 дней, ставя пальцы на правильные клавиши и следуя инструкциям курса, вы сможете довести скорость печати до 30, 40 и даже 50 слов в минуту.)) A good friend of mine took a typing course during the summer when he was 15 years old.((Один мой хороший друг прошел курс машинописи летом, когда ему было 15 лет.)) Ever since then, he's continued to practice typing and now types 120 words per minute.((С тех пор он продолжал практиковаться в печати и теперь печатает 120 слов в минуту.)) He can type virtually as fast as he can formulate words in his mind, and he can type with his eyes closed, and he types perfectly without mistakes.((Он может печатать практически так же быстро, как формулирует слова в уме, может печатать с закрытыми глазами и печатает идеально без ошибок.)) Most secretaries and typists can produce 50, 60, and 70 words per minute without mistakes as well.((Большинство секретарей и машинисток также могут печатать 50, 60 и 70 слов в минуту без ошибок.)) Does this mean that they are five or six or seven times as intelligent as the person using the hunt and peck method who is typing perhaps ten words per minute?((Означает ли это, что они в пять, шесть или семь раз умнее человека, использующего метод «тыка», который печатает, возможно, десять слов в минуту?)) Of course not.((Конечно нет.)) It simply means that they have learned how to type properly.((Это просто означает, что они научились правильно печатать.))

The same principle applies to using your intelligence.((Тот же принцип применим к использованию вашего интеллекта.)) By learning to learn and practicing accelerated learning techniques until they become habitual, you'll gradually increase your ability to learn, remember, and apply by hundreds of percents.((Изучая и практикуя техники ускоренного обучения, пока они не станут привычными, вы постепенно увеличите свою способность учиться, запоминать и применять на сотни процентов.))

Intelligence is not just a matter of IQ.((Интеллект — это не просто показатель IQ.)) although IQ is one way of measuring intelligence among large groups of people.((Хотя IQ — это один из способов измерения интеллекта среди больших групп людей.)) Intelligence is more a way of acting.((Интеллект — это скорее способ действий.)) If you act intelligently, you are intelligent.((Если вы действуете умно, вы умны.)) If you act stupidly, you are stupid, irrespective of your IQ.((Если вы действуете глупо, вы глупы, независимо от вашего IQ.))

Now, if you agree that a person who acts intelligently is intelligent, your next question might be, what then would be an intelligent way of acting?((Итак, если вы согласны, что человек, действующий умно, является умным, ваш следующий вопрос может быть: что тогда является умным способом действий?)) And the answer is simple.((И ответ прост.)) Every time that you do something that moves you toward a goal important to you, you are behaving intelligently.((Каждый раз, когда вы делаете что-то, что приближает вас к важной для вас цели, вы ведете себя умно.)) Every time that you do something that moves you away from a goal that is important to you or doesn't help you at all, you are acting stupidly.((Каждый раз, когда вы делаете что-то, что удаляет вас от важной цели или вообще вам не помогает, вы действуете глупо.)) Intelligence is relevant only to your own self-selected goals and ambitions.((Интеллект актуален только для ваших собственных, самостоятельно выбранных целей и амбиций.)) Your level of intelligence is determined by what you do relative to what you want to have and become.((Ваш уровень интеллекта определяется тем, что вы делаете по отношению к тому, что хотите иметь и кем хотите стать.))

What is an intelligent person?((Что такое умный человек?)) An intelligent person is one who works continuously and consistently on activities that move them ever closer to their goals.((Умный человек — это тот, кто постоянно и последовательно работает над действиями, которые приближают его к целям.)) On the other hand, a stupid person is a person who either has no goals or who engages in activities that are contrary to achieving those goals.((С другой стороны, глупый человек — это тот, у кого либо нет целей, либо кто занимается деятельностью, противоречащей достижению этих целей.)) A person who wants to be financially secure and respected in his or her profession is one who works steadily to become better and better at their job and who applies their talents and abilities in the very best way to get the job done fast.((Человек, который хочет быть финансово обеспеченным и уважаемым в своей профессии, — это тот, кто постоянно работает над тем, чтобы становиться лучше и лучше в своей работе, и кто применяет свои таланты и способности наилучшим образом, чтобы быстро выполнять работу.)) This is an intelligent person.((Это умный человек.)) Every time you learn and practice something new and different that you can use to achieve your goals faster, you are acting with the very highest of intelligence.((Каждый раз, когда вы учитесь и практикуете что-то новое и другое, что вы можете использовать для более быстрого достижения своих целей, вы действуете с самым высоким интеллектом.)) In fact, the more things that you do that are consistent with your goals, the smarter you become.((Фактически, чем больше вещей вы делаете, соответствующих вашим целям, тем умнее вы становитесь.))`
      },

      // ===== ГЛАВА 14 =====
      {
        title: "Seven Intelligences: The Gardner Model ((Семь видов интеллекта: модель Гарднера))",
        content: `Some of the most controversial scientific work being done today is in the area of intelligence and how intelligence is related to success.((Некоторая из самых противоречивых научных работ, ведущихся сегодня, находится в области интеллекта и того, как интеллект связан с успехом.)) Based on more than 50 years of independent testing and surveys, authors Richard Heronstein and Charles Murray have concluded in their book The Bell Curve that there is a strong correlation between the success that a person achieves in life and their level of intelligence.((Основываясь на более чем 50-летнем независимом тестировании и опросах, авторы Ричард Херонштейн и Чарльз Мюррей пришли к выводу в своей книге «Колоколообразная кривая», что существует сильная корреляция между успехом, которого человек достигает в жизни, и его уровнем интеллекта.)) The smarter you are, the more successful you will be.((Чем вы умнее, тем вы успешнее.)) If you increase your intelligence, you will increase your potential for success at whatever you do.((Если вы повысите свой интеллект, вы повысите свой потенциал успеха в любом деле.))

Of course, these findings are a restatement of the obvious.((Конечно, эти выводы являются переформулировкой очевидного.)) We've entered into the information age where knowledge is the primary source of value.((Мы вступили в информационную эпоху, где знания являются основным источником ценности.)) The person who develops the capacity to learn and apply more knowledge is going to be more valuable than the person who does not.((Человек, который развивает способность учиться и применять больше знаний, будет более ценным, чем тот, кто этого не делает.)) In the age of manpower, people with greater physical strength were able to accomplish greater physical feats.((В эпоху физической силы люди с большей физической силой могли совершать большие физические подвиги.)) In the age of mind power, however, people with greater mental strength are going to be able to accomplish greater mental feats and tasks.((Однако в эпоху силы ума люди с большей умственной силой смогут совершать большие умственные подвиги и задачи.)) What this means is that you must do everything possible to enhance your intelligence to become smarter and more competent at what you do.((Это означает, что вы должны делать всё возможное, чтобы повысить свой интеллект, стать умнее и компетентнее в том, что вы делаете.)) Fortunately, as I said in the last session, intelligence is not a fixed quantity.((К счастью, как я сказал в прошлом занятии, интеллект не является фиксированной величиной.)) It is like a muscle.((Он подобен мышце.)) Just as you can build your muscles by pumping physical iron, you can build your mental muscles by pumping mental iron.((Как вы можете наращивать мышцы, качая физическое железо, так вы можете наращивать свои умственные мышцы, качая умственное железо.)) By learning how your brain works and then by using your brain to its full capacity, you can become increasingly intelligent over time.((Изучая, как работает ваш мозг, а затем используя его на полную мощность, вы можете со временем становиться все более интеллектуальным.))

The most important breakthrough work in the field of intelligence has been done by Dr. Howard Gardner of Harvard University.((Самая важная прорывная работа в области интеллекта была проделана доктором Говардом Гарднером из Гарвардского университета.)) His research shows that you have not just one intelligence, but at least seven intelligences.((Его исследования показывают, что у вас есть не один, а как минимум семь видов интеллекта.)) Each of your intelligences is of similar importance in reaching your full human potential.((Каждый из ваших видов интеллекта имеет одинаковое значение для достижения вашего полного человеческого потенциала.)) Your intelligences are really your natural talents, which you have to a greater or lesser extent.((Ваши виды интеллекта на самом деле являются вашими природными талантами, которые у вас есть в большей или меньшей степени.))

The first of the seven intelligences, and the most common, is linguistic intelligence, or talent with language and words.((Первый из семи видов интеллекта и самый распространенный — лингвистический интеллект, или талант к языку и словам.)) This is the ability to speak or write well.((Это способность хорошо говорить или писать.)) Some people just have the gift of the gab, or they can write well.((У некоторых людей просто есть дар красноречия, или они хорошо пишут.)) Many people like to read good novels or even write poetry.((Многие люди любят читать хорошие романы или даже писать стихи.)) They have good linguistic intelligence.((У них хороший лингвистический интеллект.))

The second type is mathematical and logical intelligence, or talent with math, logic, and systems.((Второй тип — математико-логический интеллект, или талант к математике, логике и системам.)) This is the ability to deal well with numbers and to think logically.((Это способность хорошо обращаться с числами и мыслить логически.)) You probably know people who perhaps don't think of themselves as particularly intelligent, but who are razor sharp on adding up the odds on a bet or calculating percentages on sports scores.((Вы, вероятно, знаете людей, которые, возможно, не считают себя особенно умными, но которые очень остры в подсчете шансов на ставках или вычислении процентов в спортивных счетах.)) Engineers, scientists, and accountants would be very high in this intelligence.((Инженеры, ученые и бухгалтеры были бы очень высоки в этом виде интеллекта.))

The third type of intelligence is visual spatial intelligence or visual talent.((Третий тип интеллекта — визуально-пространственный интеллект или визуальный талант.)) This is the ability to visualize how things will eventually look in advance of them coming into reality or to imagine things in your mind's eye in advance of creating them.((Это способность визуализировать, как вещи будут в конечном итоге выглядеть до того, как они станут реальностью, или воображать вещи мысленным взором до их создания.)) Designers, architects, and artists would be examples of people with high levels of visual and spatial intelligence.((Дизайнеры, архитекторы и художники будут примерами людей с высоким уровнем визуального и пространственного интеллекта.)) You use this intelligence, by the way, whenever you use your sense of direction, or whenever you navigate or draw a picture.((Кстати, вы используете этот интеллект всякий раз, когда используете чувство направления, ориентируетесь или рисуете картинку.))

The fourth type of intelligence is musical intelligence, or talent with music.((Четвертый тип интеллекта — музыкальный интеллект, или талант к музыке.)) This is the ability to create and interpret music.((Это способность создавать и интерпретировать музыку.)) It's the ability to keep rhythm.((Это способность чувствовать ритм.)) Most of us have a good, basic musical intelligence, and we can all develop it to a higher extent.((У большинства из нас есть хороший базовый музыкальный интеллект, и мы все можем развить его в большей степени.)) Think how helpful it is for you to learn a jingle or a rhyme.((Подумайте, насколько полезно для вас учить песенку или рифму.)) For example, do you remember "30 days hath September, April, June, and November"?((Например, помните ли вы: «В сентябре, апреле, июне и ноябре по 30 дней»?)) Or the song for remembering the alphabet?((Или песенку для запоминания алфавита?))

The fifth type of intelligence is bodily or physical intelligence.((Пятый тип интеллекта — телесный или физический интеллект.)) You use this intelligence when you move well, run, dance, build, and construct something.((Вы используете этот интеллект, когда хорошо двигаетесь, бегаете, танцуете, строите и создаете что-то.)) All arts and crafts use this intelligence.((Все виды ремесел и искусств используют этот интеллект.)) Many people who are physically talented at sports or good with their hands, don't recognize that they are showing a very high form of intelligence.((Многие люди, которые физически талантливы в спорте или хорошо работают руками, не осознают, что они демонстрируют очень высокую форму интеллекта.)) This form of intelligence is of equal value to the other intelligences.((Эта форма интеллекта имеет равную ценность с другими видами интеллекта.)) Think of the kind of money earned by sports stars who are absolute geniuses in terms of physical and bodily intelligence.((Подумайте о деньгах, которые зарабатывают спортивные звезды, являющиеся абсолютными гениями с точки зрения физического и телесного интеллекта.))

The sixth form of intelligence you might have is interpersonal or social talent.((Шестая форма интеллекта, которая может быть у вас, — межличностный или социальный талант.)) This is the ability to communicate well and to get along with others.((Это способность хорошо общаться и ладить с другими.)) Many people have a superb ability to make people feel at ease, to read others' emotions, and to be sympathetic to the feelings of others.((Многие люди обладают превосходной способностью располагать к себе людей, считывать эмоции других и сочувствовать чувствам других.)) This is also a vital human intelligence.((Это также жизненно важный человеческий интеллект.)) This talent is used to the full when you are being a good parent, a supportive colleague, or a good teacher.((Этот талант используется в полной мере, когда вы хороший родитель, поддерживающий коллега или хороший учитель.)) And by the way, this is the highest paid intelligence in America.((И, кстати, это самый высокооплачиваемый вид интеллекта в Америке.)) It is used by salespeople, managers, entertainers, public speakers, courtroom lawyers and anyone who makes a living by influencing other people in any way, and it is very seldom ever measured or graded in school.((Его используют продавцы, менеджеры, артисты, публичные ораторы, адвокаты в судах и все, кто зарабатывает на жизнь, влияя на других людей так или иначе, и его очень редко измеряют или оценивают в школе.))

The seventh form of intelligence is intrapersonal intelligence or inner control.((Седьмая форма интеллекта — внутриличностный интеллект или внутренний контроль.)) This is an ability for quiet, objective self-analysis.((Это способность к спокойному, объективному самоанализу.)) This intelligence enables you to understand your own behavior and feelings.((Этот интеллект позволяет вам понимать свое собственное поведение и чувства.)) You use this intelligence to create your own goals and plans, and to study your own successes and mistakes as a guide to future improvement.((Вы используете этот интеллект, чтобы создавать свои собственные цели и планы, а также изучать свои успехи и ошибки как руководство для будущего улучшения.))

Dr. Howard Gardner has proposed that the definition of intelligence really should be the ability to create useful products and to solve everyday problems.((Доктор Говард Гарднер предложил, чтобы определение интеллекта на самом деле было способностью создавать полезные продукты и решать повседневные проблемы.)) Previously, intelligence was defined much more narrowly.((Ранее интеллект определялся гораздо более узко.)) It was mostly related to academic performance, yet academic subjects are largely taught through just two intelligences, the linguistic and mathematical logical.((В основном он был связан с академической успеваемостью, хотя академические предметы в значительной степени преподаются через использование всего двух видов интеллекта — лингвистического и математико-логического.)) Academic success is indeed one way of demonstrating intelligence.((Академический успех действительно является одним из способов проявления интеллекта.)) In the real world, however, it is far from the only way.((Однако в реальном мире это далеко не единственный способ.))

You become a genius by learning how to use all of your intelligences in the areas of your life that are important to you.((Вы становитесь гением, научившись использовать все свои виды интеллекта в важных для вас сферах жизни.)) People today are learning math through songs, chants, and jingles.((Сегодня люди изучают математику через песни, напевы и рекламные джинглы.)) They are learning by physically handling counters, by actually picturing the patterns that numbers make, or by working together in pairs through imagery, through colored charts and diagrams.((Они учатся, физически манипулируя счетными палочками, фактически представляя себе паттерны, которые образуют числа, или работая вместе в парах с помощью образов, цветных диаграмм и схем.)) and they are loving it.((и им это нравится.)) People are learning to write really creatively by using learning maps, which you will hear about later.((Люди учатся писать действительно креативно, используя интеллект-карты, о которых вы узнаете позже.)) They are making vivid mental pictures before they start writing.((Они создают яркие мысленные образы перед тем, как начать писать.)) They are acting parts of their stories, and they are seeing the value of working in pairs.((Они разыгрывают части своих историй и видят ценность работы в парах.)) In the sessions ahead, you will learn how to unlock more and more of your intelligences to ensure that you learn how to learn in ways that suit your unique mix of capabilities.((В следующих занятиях вы узнаете, как раскрывать все больше и больше своих видов интеллекта, чтобы гарантировать, что вы научитесь учиться способами, подходящими вашему уникальному сочетанию способностей.))`
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
        content: `В английской версии этого рассказа девочку рисуют не в шапочке, а в накидке с капюшоном (в таких обычно на конях скакали). Поэтому и сказку называют по-английски Red Hood, а не Red Hat.`
      },
      // ===== ГЛАВА 1 =====
      {

        title: "The Little Red Hood ((Красная шапочка))",
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

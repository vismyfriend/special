const definitionsData = {

  halloweenCharactersDefinitions: [
    {
      id: 1,
      eng: "This creature (создание, существо) is known for its insatiable (ненасытный) hunger for human flesh. It's typically reanimated (восставший) and mindless, often portrayed as emerging from a grave. Unlike a ghost, it has a physical body.",
      ru: "Это существо известно своим ненасытным голодом к человеческой плоти. Обычно оно восставшее и безмозглое, часто его изображают выходящим из могилы. В отличие от призрака, у него есть физическое тело.",
      ans: "Zombie"
    },
    {
      id: 2,
      eng: "This mythical being undergoes a transformation from a human into a fearsome, wolf-like creature(создание, существо) during a full moon. The change is often painful and involuntary (непроизвольный).",
      ru: "Это мифическое существо претерпевает превращение из человека в свирепое, волкоподобное создание во время полнолуния. Перемена часто бывает болезненной и непроизвольной.",
      ans: "Werewolf"
    },
    {
      id: 3,
      eng: "This character is a specific type of undead creature(создание, существо) that is bound in wrappings (пелена) and originates from ancient Egyptian lore. It is often discovered in a cursed tomb.",
      ru: "Этот персонаж — особый вид нежити, завёрнутый в погребальные пелена и берущий начало из древнеегипетского фольклора. Его часто находят в проклятой гробнице.",
      ans: "Mummy"
    },
    {
      id: 4,
      eng: "This being is a classic symbol of death itself. It is often depicted as a skeletal figure wearing a long, dark robe and carrying a scythe (коса), coming to collect souls.",
      ru: "Это существо — классический символ самой смерти. Его часто изображают в виде скелета в длинном тёмном балахоне с косой, пришедшего, чтобы забрать души.",
      ans: "Grim Reaper"
    },
    {
      id: 5,
      eng: "This is not a single character, but a title. He is a notorious (печально известный) historical figure from London whose identity remains a mystery. He is often portrayed with a cloak and top hat, preying on women in foggy streets.",
      ru: "Это не конкретный персонаж, а прозвище. Он — печально известная историческая личность из Лондона, чья личность остаётся загадкой. Его часто изображают в плаще и цилиндре, охотящимся на женщин на туманных улицах.",
      ans: "Jack the Ripper"
    },
    {
      id: 6,
      eng: "This creature(создание, существо) is a shapeshifter (оборотень) from Native American folklore. It is a malevolent (злобный), cannibalistic spirit associated with winter, cold, and famine (голод). It is often depicted with animal features like antlers (рога).",
      ru: "Это существо — оборотень из фольклора коренных американцев. Это злобный, каннибалистический дух, ассоциирующийся с зимой, холодом и голодом. Его часто изображают с животными чертами, такими как рога.",
      ans: "Wendigo"
    },
    {
      id: 7,
      eng: "This character is a specific, iconic clown from a Stephen King novel. It primarily preys on children, exploiting their deepest fears, and often appears in the sewers (канализация). Its favorite phrase is, 'We all float down here!'",
      ru: "Этот персонаж — конкретный, культовый клоун из романа Стивена Кинга. Он в основном охотится на детей, используя их самые глубокие страхи, и часто появляется в канализации. Его любимая фраза: «Мы все тут плаваем!»",
      ans: "Pennywise"
    },
    {
      id: 8,
      eng: "This being is a demonic entity from folklore that takes the form of a beautiful woman to seduce men in their dreams, often feeding on their life force or energy.",
      ru: "Это существо — демоническая сущность из фольклора, которая принимает форму прекрасной женщины, чтобы соблазнять мужчин в их снах, часто питаясь их жизненной силой или энергией.",
      ans: "Succubus"
    },
    {
      id: 9,
      eng: "This creature(создание, существо) is a monstrous, three-headed dog from Greek mythology. It guards the entrance to the underworld to prevent the dead from leaving.",
      ru: "Это существо — чудовищный трёхглавый пёс из греческой мифологии. Он охраняет вход в подземный мир, чтобы мёртвые не могли выйти.",
      ans: "Cerberus"
    },
    {
      id: 10,
      eng: "This is an evil spirit or monster from Arabic folklore that dwells (обитает) in cemeteries and consumes human flesh. It is often confused with a zombie but is considered a type of shapeshifting demon.",
      ru: "Это злой дух или монстр из арабского фольклора, который обитает на кладбищах и пожирает человеческую плоть. Его часто путают с зомби, но он считается разновидностью демона-оборотня.",
      ans: "Ghoul"
    },
    {
      id: 11,
      eng: "This character is a specific, reanimated creature(создание, существо) brought to life through a scientific experiment. It is often misunderstood and seeks acceptance, famously saying, 'Fire bad!'",
      ru: "Этот персонаж — конкретное, оживлённое существо, возвращённое к жизни с помощью научного эксперимента. Его часто неправильно понимают, и он ищет принятия, известный фразой «Огонь плохо!»",
      ans: "Frankenstein's Monster"
    },
    {
      id: 12,
      eng: "This is a ghostly doppelgänger or double of a living person. Seeing one is considered a very bad omen (дурное предзнаменование), often a sign of impending (надвигающейся) illness or death.",
      ru: "Это призрачный двойник живого человека. Считается, что увидеть его — очень дурное предзнаменование, часто знак надвигающейся болезни или смерти.",
      ans: "Doppelganger"
    },
    {
      id: 13,
      eng: "This is a specific witch from Slavic folklore. She lives in a hut (избушка) that stands on chicken legs and flies around in a mortar (ступа), using a pestle (пест) as an oar (весло).",
      ru: "Это конкретная ведьма из славянского фольклора. Она живёт в избушке на курьих ножках и летает в ступе, используя пест как весло.",
      ans: "Baba Yaga"
    },
    {
      id: 14,
      eng: "This is a mischievous (озорной) and destructive creature(создание, существо) that becomes even more dangerous when exposed to water or after midnight. It is known for causing mechanical failures.",
      ru: "Это озорное и разрушительное существо, которое становится ещё опаснее при контакте с водой или после полуночи. Оно известно тем, что вызывает поломки механизмов.",
      ans: "Gremlin"
    },
    {
      id: 15,
      eng: "This is a demonic dog from folklore, often of enormous (громадного) size and with glowing red eyes. It is an omen (предзнаменование) of death and is said to serve the Devil, haunting graveyards and lonely roads.",
      ru: "Это демонический пёс из фольклора, часто громадного размера и со светящимися красными глазами. Он является предвестником смерти и, как говорят, служит Дьяволу, бродя по кладбищам и безлюдным дорогам.",
      ans: "Hellhound"
    }
  ],
}
export default definitionsData

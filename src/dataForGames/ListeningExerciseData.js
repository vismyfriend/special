export default {
  mainDescription: "B1 listening 1",
  tasks: [
    {
      taskDescription: "Послушайте и ответьте True или False.",
      audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
      taskID: "true_false",
      taskPicture: null,
      textScript: null,
      questions: [
        {
          text: "There is a big hockey match today.",
          correctAnswer: "false"
        },
        {
          text: "There is a traffic jam on the freeway.",
          correctAnswer: "true"
        },
        {
          text: "Taxis usually don’t come very quickly.",
          correctAnswer: "false"
        },
        {
          text: "Kevin lives close to Harry.",
          correctAnswer: "true"
        },
        {
          text: "The traffic is backing up because a traffic light is broken.",
          correctAnswer: "true"
        },
        {
          text: "The weather is not so good.",
          correctAnswer: "false"
        },
      ]
    },
    {
      taskDescription: "Listen to this audio",
      audio: new URL('../assets/audio/how_are_they_getting_there.mp3', import.meta.url).href,
      taskID: "multiple_choice",
      taskPicture: new URL("../assets/images/listeningPicture1.jpg", import.meta.url).href,
      textScript: '1)\n' +
        '\n' +
        'A: Are you going to take the bus downtown, or are you going to take your bike?\n' +
        '\n' +
        'B: I think there’s too much traffic on the road today to go by bike. It’s not safe to ride in traffic.\n' +
        '\n' +
        'A: I guess there’s so much traffic because of the big football game. Well, look, I’m driving downtown. Can I give you a ride?\n' +
        '\n' +
        'B: Hey, thanks.\n' +
        '\n' +
        'A: So do you use your bike very often?\n' +
        '\n' +
        'B: Not during the week, but I ride it pretty often on the weekend.\n' +
        '\n' +
        '2)\n' +
        '\n' +
        'A: How are you going to get downtown? Are you going to drive?\n' +
        '\n' +
        'B: I don’t think so. I just heard the traffic report on the radio. It seems there is a traffic jam on the freeway. They said a couple of buses have broken down.\n' +
        '\n' +
        'A: I guess it will be quicker to take the subway.\n' +
        '\n' +
        'B: Absolutely!\n' +
        '\n' +
        '3)\n' +
        '\n' +
        'A: Gosh. I wonder how much longer we’ll have to wait for a bus. We’ve waited half an hour already! Do you think we should go back and get the car?\n' +
        '\n' +
        'B: Oh, no. I hate driving at night.\n' +
        '\n' +
        'A: Let’s take a taxi. I don’t want to be late for the movie.\n' +
        '\n' +
        'B: Good idea. I’ll call for one on cell phone. They usually come pretty quickly.\n' +
        '\n' +
        '4)\n' +
        '\n' +
        'A: How are you going to get home from the restaurant on Sunday, Harry?\n' +
        '\n' +
        'B: Oh, I can just take a bus or a taxi. There are usually plenty of taxis around that area at night.\n' +
        '\n' +
        'A: Yes, but not on a Sunday night. You might wait for a long time. Why don’t you ask Kevin to drive you home? He’s having dinner with us and he lives near you.\n' +
        '\n' +
        'B: That’s right. I’ll ask him.\n' +
        '\n' +
        '5)\n' +
        '\n' +
        'A: What’s the traffic like downtown today?\n' +
        '\n' +
        'B: It’s pretty bad. One of the traffic lights is broken, so all the traffic is backing up.\n' +
        '\n' +
        'A: Oh. How should I get to doctor’s appointment? Drive? Take a taxi?\n' +
        '\n' +
        'B: A taxi won’t be any faster than driving.\n' +
        '\n' +
        'A: Well then, I’ll probably take the subway to the station and then walk from there.\n' +
        '\n' +
        'B: Yeah, today I think that’s the fastest way.\n' +
        '\n' +
        '6)\n' +
        '\n' +
        'A: How do you plan to get to your friend’s house? Do you need a ride?\n' +
        '\n' +
        'B: How’s the weather?\n' +
        '\n' +
        'A: It’s really nice out.\n' +
        '\n' +
        'B: Oh, thanks anyway, but I’ll ride bike. I was going to take the bus, but I need to get some exercise.\n' +
        '\n' +
        'A: All right. But be careful of the traffic.',

      questions: [
        {
          text: "Как мужчина доберется туда?",
          options: {
            A: "Vincent will drive him",
            B: "by car",
            C: "on foot",
            D: "by bicycle",
            E: "by bus"
          },
          correctAnswer: "A"
        },
        {
          text: "Каким способом добраться быстрее?",
          options: {
            A: "by subway",
            B: "by taxi",
            C: "on foot",
            D: "by bicycle",
          },
          correctAnswer: "A"
        },
        {
          text: "Как они доберутся?",
          options: {
            A: "Vincent will drive them",
            B: "by taxi",
            C: "on foot",
            D: "by electric scooters",

          },
          correctAnswer: "B"
        },
        {
          text: "Как он доберется до дома?",
          options: {
            A: "his friend will drive him",
            B: "his friend will give him a car",
            C: "he will ride a bike",
            D: "his friend will call a taxi",
          },
          correctAnswer: "A"
        },
        {
          text: "Какой самый быстрый способ сегодня?",
          options: {
            A: "by subway",
            B: "by taxi",
            C: "by bicycle",
            D: "on a horse",
          },
          correctAnswer: "A"
        },
        {
          text: "Как она доберется?",
          options: {
            A: "by bike",
            B: "by taxi",
            C: "on foot",
            D: "by an electric scooter",
          },
          correctAnswer: "A"
        },
      ]
    },
    {
      taskDescription: "People are describing (описывают) traffic problems in their cities and different solutions (решения). What did each city do? ",
      audio: new URL('../assets/audio/traffic_2.mp3', import.meta.url).href,
      taskID: "multiple_choice",
      taskPicture: null,
      textScript: '1)\n' +
        '\n' +
        'In town, public transportation was never very good. You had to drive everywhere, so there was always traffic. The government wanted to make public transportation easier than driving cars. They bought some nice new buses, for example, and they added air conditioning to the ones we already had. They also began offering lower bus fares on the weekends, so more people would be encouraged to try the new buses. They raised taxi fares, too. I guess they figure that if taxis cost more, people might think about using buses more often.\n' +
        '\n' +
        '2)\n' +
        '\n' +
        'Well, the problem was that thousands of people drove into the city center every day, and there weren’t enough parking spaces. So the government wanted to make parking easier. But they didn’t build more parking garages. Instead, they tried to keep cars out of the city center. Recently, they started making people who drive their cars downtown pay a daily fee. You have to pay $10 if you want to drive your car into the center between 8 a.m. and 6 p.m. At the same time, they have raised the parking lot rates, so people think twice before they drive their car into the city.\n' +
        '\n' +
        '3)\n' +
        '\n' +
        'Traffic was a real problem around here. It moved so slowly. Last year the government turned a bunch of streets downtown into one-way streets. This helped the traffic move more quickly. Special lanes on roads just for buses were built at the same time. If you’re caught driving your car in a bus lane, you have to pay a fine – and it’s a really high fine! Also, they passed a law last year that says you can only drive your car downtown three days a week. You have to display a special pass in your car that says which days you’re allowed to drive downtown.\n' +
        '\n' +
        '4)\n' +
        '\n' +
        'Air pollution in our city was a huge problem, and we really needed to lower it. I guess that’s why the government started putting special bicycle lanes on the streets downtown. That way, people can ride their bikes to work instead of using their stinky cars! They also made a rule that says there must be at least two people in your car if you want to drive downtown during the week. They also ordered these amazing new pollution-free buses. They use electricity, so they don’t put anything bad into the air.',
      questions: [
        {
          text: "What did they do to improve transportation?",
          options: {
            A: "They improved the quality of buses.",
            B: "They raised bus fares on weekends.",
            C: "They lowered taxi fares."
          },
          correctAnswer: "A"
        },
        {
          text: "What change was made about parking?",
          options: {
            A: "They built more parking garages.",
            B: "They made drivers pay a daily fee.",
            C: "They kept all cars out of the city center."
          },
          correctAnswer: "C"
        },
        {
          text: "What was done to manage traffic jams?",
          options: {
            A: "They made many streets downtown one-way.",
            B: "They made new lanes for cars to use.",
            C: "They made a law that people can drive downtown every day if they have a special pass."
          },
          correctAnswer: "A"
        },
        {
          text: "What rule was introduced to reduce pollution?",
          options: {
            A: "They did not allow people to ride a bicycle downtown.",
            B: "They made a rule that there must be at least three people in a car to go downtown.",
            C: "They bought new buses that don’t create pollution."
          },
          correctAnswer: "C"
        },

      ]
    },
  ]
}

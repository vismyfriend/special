const gameJeopardyData = {
  // Это ключи, которые будут использоваться в URL
  DevJeopardy: {
    mainDescription: "Testing the Jeopardy Game",
    extraDescription: "Играй учись кайфуй",
    level: "A1",
    categories: [
      {
        name: "Animals",
        questions: [
          {
            value: 100,
            question: "What animal says 'meow'?",
            answer: "cat",
            image: null,
            audio: new URL('../assets/audio/FaithYoungSheldonS1e3.mp3', import.meta.url).href,
          },
          {
            value: 200,
            question: "What is the biggest animal in the world?",
            answer: "whale",
            image: new URL("../assets/images/testPic1.png", import.meta.url).href
          },
          {
            value: 300,
            question: "What animal lives in water and has fins?",
            answer: "fish"
          },
        ]
      },
      {
        name: "Family",
        questions: [

          {
            value: 500,
            question: "What is your sister's son called?",
            answer: "nephew"
          }
        ]
      },
      {
        name: "Colors",
        questions: [
          {
            value: 100,
            question: "What color is the sky?",
            answer: "blue"
          },

        ]
      },
    ]
  },
  MyFirstJeopardy: {
    mainDescription: "Basic English Jeopardy 1",
    level: "A1",
    categories: [
      {
        name: "Animals",
        questions: [
          {
            value: 100,
            question: "What animal says 'meow'?",
            answer: "cat",
            image: null,
            audio: new URL('../assets/audio/FaithYoungSheldonS1e3.mp3', import.meta.url).href,
          },
          {
            value: 200,
            question: "What is the biggest animal in the world?",
            answer: "whale",
            image: new URL("../assets/images/testPic1.png", import.meta.url).href
          },
          {
            value: 300,
            question: "What animal lives in water and has fins?",
            answer: "fish"
          },
          {
            value: 400,
            question: "What animal has a long neck?",
            answer: "giraffe"
          },
          {
            value: 500,
            question: "What animal can fly and has feathers?",
            answer: "bird"
          }
        ]
      },
      {
        name: "Food",
        questions: [
          {
            value: 100,
            question: "What is a fruit that is red and round?",
            answer: "apple"
          },
          {
            value: 200,
            question: "What do you drink in the morning?",
            answer: "coffee/tea/juice"
          },
          {
            value: 300,
            question: "What is a meal you eat in the evening?",
            answer: "dinner/supper"
          },
          {
            value: 400,
            question: "What is something sweet you eat after a meal?",
            answer: "dessert"
          },
          {
            value: 500,
            question: "What is an Italian food made with dough and sauce?",
            answer: "pizza"
          }
        ]
      },
      {
        name: "School",
        questions: [
          {
            value: 100,
            question: "What do you use to write in school?",
            answer: "pen/pencil"
          },
          {
            value: 200,
            question: "What subject teaches you about numbers?",
            answer: "math/mathematics"
          },
          {
            value: 300,
            question: "Who teaches you at school?",
            answer: "teacher"
          },
          {
            value: 400,
            question: "What do you carry your books in?",
            answer: "backpack/bag"
          },
          {
            value: 500,
            question: "What is a place where you can borrow books?",
            answer: "library"
          }
        ]
      },
      {
        name: "Family",
        questions: [
          {
            value: 100,
            question: "What do you call your mother's brother?",
            answer: "uncle"
          },
          {
            value: 200,
            question: "What do you call your father's mother?",
            answer: "grandmother/granny"
          },
          {
            value: 300,
            question: "What is a girl child called?",
            answer: "daughter"
          },
          {
            value: 400,
            question: "Who is married to your father?",
            answer: "mother/mom"
          },
          {
            value: 500,
            question: "What is your sister's son called?",
            answer: "nephew"
          }
        ]
      },
      {
        name: "Colors",
        questions: [
          {
            value: 100,
            question: "What color is the sky?",
            answer: "blue"
          },
          {
            value: 200,
            question: "What color are bananas?",
            answer: "yellow"
          },
          {
            value: 300,
            question: "What color is grass?",
            answer: "green"
          },
          {
            value: 400,
            question: "What color is milk?",
            answer: "white"
          },
          {
            value: 500,
            question: "What color is an orange?",
            answer: "orange"
          }
        ]
      },
      {
        name: "Weather",
        questions: [
          {
            value: 100,
            question: "What is frozen water called?",
            answer: "ice/snow"
          },
          {
            value: 200,
            question: "What comes from the sky and makes things wet?",
            answer: "rain"
          },
          {
            value: 300,
            question: "What is a strong wind called?",
            answer: "storm"
          },
          {
            value: 400,
            question: "What is the season when leaves fall?",
            answer: "autumn/fall"
          },
          {
            value: 500,
            question: "What is a bright flash in the sky during a storm?",
            answer: "lightning"
          }
        ]
      }
    ]
  },

  A2Jeopardy: {
    mainDescription: "Intermediate English Jeopardy",
    level: "A2",
    categories: [
      {
        name: "Travel & Tourism",
        questions: [
          {
            value: 100,
            question: "What do you need to travel to another country?",
            answer: "passport",
            audio: new URL("../assets/audio/passport.mp3", import.meta.url).href
          },
          {
            value: 200,
            question: "Where do you wait for a plane?",
            answer: "airport",
            image: new URL("../assets/images/airport.jpg", import.meta.url).href
          },
          {
            value: 300,
            question: "What do you call a trip on a ship?",
            answer: "cruise"
          },
          {
            value: 400,
            question: "What is a place where tourists stay?",
            answer: "hotel"
          },
          {
            value: 500,
            question: "What do you use to find your way in a new city?",
            answer: "map/GPS"
          }
        ]
      },
      {
        name: "Work & Career",
        questions: [
          {
            value: 100,
            question: "What do you call the person who employs you?",
            answer: "employer/boss"
          },
          {
            value: 200,
            question: "What is a formal meeting for a job?",
            answer: "interview"
          },
          {
            value: 300,
            question: "What do you receive for your work?",
            answer: "salary/pay"
          },
          {
            value: 400,
            question: "What is a person who works in an office called?",
            answer: "employee/office worker"
          },
          {
            value: 500,
            question: "What is the opposite of 'employed'?",
            answer: "unemployed"
          }
        ]
      },
      {
        name: "Health & Medicine",
        questions: [
          {
            value: 100,
            question: "What is a person who treats you when you're sick?",
            answer: "doctor"
          },
          {
            value: 200,
            question: "Where do you go when you're very sick?",
            answer: "hospital"
          },
          {
            value: 300,
            question: "What is a medicine you take for a headache?",
            answer: "aspirin/painkiller"
          },
          {
            value: 400,
            question: "What is the condition when you have a high temperature?",
            answer: "fever"
          },
          {
            value: 500,
            question: "What do you call a treatment with needles?",
            answer: "acupuncture"
          }
        ]
      },
      {
        name: "Technology",
        questions: [
          {
            value: 100,
            question: "What is a device you use to communicate with people far away?",
            answer: "phone/smartphone"
          },
          {
            value: 200,
            question: "What is a device you use to write documents?",
            answer: "computer/laptop"
          },
          {
            value: 300,
            question: "What is the system that connects computers worldwide?",
            answer: "internet"
          },
          {
            value: 400,
            question: "What do you call a software that protects your computer?",
            answer: "antivirus"
          },
          {
            value: 500,
            question: "What is a code that protects your device?",
            answer: "password"
          }
        ]
      },
      {
        name: "Environment",
        questions: [
          {
            value: 100,
            question: "What is the planet we live on?",
            answer: "Earth"
          },
          {
            value: 200,
            question: "What do you call the gas that plants need?",
            answer: "carbon dioxide/CO2"
          },
          {
            value: 300,
            question: "What is the process of plants making food from sunlight?",
            answer: "photosynthesis"
          },
          {
            value: 400,
            question: "What do you call the warming of Earth's surface?",
            answer: "global warming"
          },
          {
            value: 500,
            question: "What is a renewable energy source from the sun?",
            answer: "solar energy"
          }
        ]
      },
      {
        name: "Culture",
        questions: [
          {
            value: 100,
            question: "What is a type of music with guitars and drums?",
            answer: "rock/pop music"
          },
          {
            value: 200,
            question: "What is a film with actors in historical clothes?",
            answer: "historical drama/costume drama"
          },
          {
            value: 300,
            question: "What do you call a painting of a person?",
            answer: "portrait"
          },
          {
            value: 400,
            question: "What is a famous building in Paris?",
            answer: "Eiffel Tower"
          },
          {
            value: 500,
            question: "What is a traditional story that explains natural phenomena?",
            answer: "myth/legend"
          }
        ]
      }
    ]
  },

  B1Jeopardy: {
    mainDescription: "Upper-Intermediate English Jeopardy",
    level: "B1",
    categories: [
      // ... данные для B1
    ]
  },

  B2Jeopardy: {
    mainDescription: "Advanced English Jeopardy",
    level: "B2",
    categories: [
      // ... данные для B2
    ]
  }
};

export default gameJeopardyData;

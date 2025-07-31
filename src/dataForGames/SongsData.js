const songsData = {
  songFaith: {
    mainDescription: null,
    tasks: [
      {
        taskDescription: null,
        taskID: "listenCarefully",
        usefulWords: null,
        taskPicture: new URL("../assets/images/faith.png", import.meta.url).href,
        audio: new URL('../assets/audio/FaithYoungSheldonS1e3.mp3', import.meta.url).href,
        extraInfo: null,
        script: [
          {
            singer: "Special Agent - George Michael",
            audioName: null,
            text: "Well, I guess it would be nice \n" +
              "if I could (touch) your body\n" +
              "I know not everybody has \n" +
              "got a body like you!\n" +
              "-\n" +
              "But I gotta think (twice)\n" +
              "before I give my heart away\n" +
              "And I know (all) (the) (games) you play\n" +
              "because I played them too\n" +
              "-\n" +
              "Oh, but I need some time off\n" +
              "from that (emotion)\n" +
              "Time to pick my heart up\n" +
              "off the floor\n" +
              "Oh, when that love comes down \n" +
              "(without) (devotion)\n" +
              "Well it takes a strong man, baby\n" +
              "But I'm showing you the door\n" +
              "-\n" +
              "'Cause I gotta have faith\n" +
              "I gotta have (faith)\n" +
              "Because I gotta have (faith, faith, faith)\n" +
              "I (got) (to) (have) faith, faith, faith\n" +
              "-\n" +
              "Baby, I know you (are) asking me to stay\n" +
              "Say, \"Please, please, please\n" +
              "(don't) (go) (away)\"\n" +
              "You say I'm giving you the blues\n" +
              "Maybe, you mean every word you say\n" +
              "Can't help but think of (yesterday)\n" +
              "..."

          },
        ]
      },

    ],
  },
  testQuicklyData: {
    mainDescription: "How much is too much?",
    tasks: [
      {
        taskDescription: 'too much - слишком, чересчур',
        taskID: "taskDialogs",
        usefulWords: null,
        taskPicture: null,
        audio: null,
        extraInfo: null,
        script: [
          {
            singer: "1 and 2",
            audioName: null,
            text: "Emma: Do you have time to relax during the week?\n" +
              "Liam: Not really. I relax for about 20 minutes after work.\n" +
              "Emma: (That's not enough.)\n" +
              "Liam: (I know. I always feel tired.)\n" +
              "Emma: (And what about friends? Do you meet them often?)\n" +
              "Liam: (Yes, I see my friends every Saturday.)\n" +
              "Emma: (That's okay then.)\n" +
              "Liam: (Yeah. But I still need more quiet time just for me.)"
          },
        ]
      },
      {
        taskDescription: 'диалог 2',
        taskID: "taskDialogs",
        usefulWords: null,
        taskPicture: null,
        audio: null,
        extraInfo: null,
        script: [
          {
            singer: "второй певец",
            audioName: null,
            text: "John: Do you have time to relax during the week?\n" +
              "Patric: Not really. I relax for about 20 minutes after work.\n" +
              "John: (That's not enough.)\n" +
              "Patrick: (I know. I always feel tired.)\n" +
              "John: (Yeah. But I still need more quiet time just for me.)"
          },
        ]
      },
    ],
  },

}
export default songsData

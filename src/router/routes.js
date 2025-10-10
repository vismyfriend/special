const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayoutWithCursor.vue'),
    children: [
      { path: '',
        component: () => import('pages/IntroPage.vue') },

      {
        path: '/see-all-sets-of-words',
        component: () => import('src/layouts/specialLayout.vue'), // без курсора (если хочешь)
        children: [
          { path: '', component: () => import('pages/SeeAllSetsOfWords.vue') },
          {
            path: '/phoneFramePattern',
            component: () => import('pages/PhoneFramePattern.vue'),
          },
          {
            path: ':missionName',
            component: () => import('src/layouts/GameLayout.vue'),
            children: [
              { path: '', component: () => import('src/pages/ChooseGame.vue') },
              {
                path: 'stories',
                component: () => import('components/GameStoriesAndWords.vue')
              },
              {
                path: 'this-game-is-coming-soon',
                component: () => import('components/ThisGameIsComingSoon.vue')
              },
              {
                path: 'print-all-words',
                component: () => import('components/GameHWNotebook.vue')
              },
              {
                path: 'print-all-words2',
                component: () => import('components/GamePrintAllWordsNotebook.vue')
              },
              {
                path: 'print',
                component: () => import('components/GamePrintAllWords.vue')
              },

              {
                path: 'listening-exercises',
                component: () => import('components/ListeningExercise.vue')
              },
              {
                path: 'songs',
                component: () => import('components/GameSongs.vue')
              },
              {
                path: 'tests-and-exams',
                component: () => import('components/GameTestsAndExams.vue')
              },
              {
                path: 'tag-questions-game',
                component: () => import('components/GameTagQuestions.vue')
              },
              {
                path: 'pnqw',
                component: () => import('components/GamePNQW.vue')
              },

              {
                path: 'find-pairs-hard',
                component: () => import('src/components/GameFindPairsHard.vue')
              },
              {
                path: 'find-pairs-easy',
                component: () => import('src/components/GameFindPairsWires.vue')
              },
              {
                path: 'word-order-sortable',
                component: () => import('src/components/GameDragAndDropSwapy.vue')
              },
              // {
              //   path: 'find-pairs-easy',
              //   component: () => import('src/components/GameFindPairsNEW.vue')
              // },
              {
                path: 'find-pairs-hardcore',
                component: () => import('src/components/GameFindPairsHardcore.vue')
              },
              {
                path: 'explain-the-word',
                component: () => import('components/GameExplainTheWord.vue')
              },
              {
                path: 'bender',
                component: () => import('src/components/GameBenderWordOrder.vue')
              },
              {
                path: 'deck-of-cards',
                component: () => import('src/components/GameDeckOfCards.vue')
              },
              {
                path: 'tnt',
                component: () => import('src/components/GameTNT.vue')
              },
              {
                path: 'tricky-quiz',
                component: () => import('src/components/GameTrickyQuiz.vue')
              },
              {
                path: 'scrambled',
                component: () => import('src/components/GameScrambled.vue')
              },
              {
                path: 'hw',
                component: () => import('src/components/GameHW.vue')
              },
              {
                path: 'hw-links',
                component: () => import('src/components/GameHomeworkLinks.vue')
              },
              {
                path: 'spelling',
                component: () => import('src/components/GameSpelling.vue')
              },
              {
                path: 'spell-ten',
                component: () => import('components/GameSpellTen.vue')
              },
              {
                path: 'word-order',
                component: () => import('src/components/GameWordOrder.vue')
              },
              {
                path: 'game-translate',
                component: () => import('src/components/GameTranslate.vue')
              },
              {
                path: 'gamePics',
                component: () => import('src/components/GamePictures.vue')
              },
              {
                path: 'pdfPages',
                component: () => import('src/components/pdfPages.vue')
              },
              {
                path: 'gameDresser',
                component: () => import('src/components/GameDresser.vue')
              },


            ]
          },
        ]
      },

      {
        path: '/main-page',
        component: () => import('src/pages/MainPage.vue')
      },
      {
        path: '/a-new-page',
        component: () => import('src/pages/visAnewPage.vue')
      },
      {
        path: '/create-special-set',
        component: () => import('src/components/CreateSpecialSet.vue'),
      },
      {
        path: '/games',
        component: () => import('pages/SeeAllGames.vue'),
      },

      {
        path: '/extra-page',
        component: () => import('src/pages/extraPage.vue'),
      },
      {
        path: '/registration',
        component: () => import('src/pages/Registration.vue')
      },
      {
        path: '/vismycoder',
        component: () => import('src/pages/vismycoder.vue')
      },
      {
        path: '/photos-of-agents',
        component: () => import('src/pages/PhotosOfAgents.vue')
      },
      {
        path: '/my-games',
        component: () => import('src/pages/myGames.vue')
      },
      {
        path: '/workbench1',
        component: () => import('src/pages/pageWorkbench1.vue')
      },
      {
        path: '/workbench2',
        component: () => import('src/pages/pageWorkbench2.vue')
      },
      {
        path: '/workbench3',
        component: () => import('src/pages/pageWorkbench3.vue')
      },
      {
        path: '/workbench4',
        component: () => import('src/pages/pageWorkbench4.vue')
      },
      {
        path: '/workbench5',
        component: () => import('src/pages/pageWorkbench5.vue')
      },
      {
        path: '/workbench6',
        component: () => import('src/pages/pageWorkbench6.vue')
      },
      {
        path: '/flipBook',
        component: () => import('src/pages/flipBook.vue')
      },
      {
        path: '/game-puzzle-squares',
        component: () => import('src/pages/gamePuzzleSquares.vue')
      },
      {
        path: '/leader-board',
        component: () => import('src/pages/LeaderBoard.vue'),
        // props: {time: 0, mistakes: 0},
        props: true,
      },
    ]
  },
    // http://192.168.0.21:9000/special/ localhost

  {
    path: '/special',
    component: () => import('src/layouts/TestingLayout.vue'),
    children: [
      {
        path: '/neat',
        component: () => import('src/pages/intros/neatDeskIntro.vue')
      },
      {
        path: '/notebook',
        component: () => import('src/pages/intros/notebookBlank.vue')
      },
      {
        path: '/notebook1',
        component: () => import('src/pages/intros/notebook1.vue')
      },  {
        path: '/keypad',
        component: () => import('src/pages/specialKeypad.vue')
      },
      {
        path: '/examplePage',
        component: () => import('src/pages/intros/ExamplePage.vue')
      },
      {
        path: '/hw1',
        component: () => import('src/pages/intros/notebookPattern1.vue')
      },
      {
        path: '/newspaper',
        component: () => import('src/pages/GameNewspaper.vue')
      },
      {
        path: '/specialHeader',
        component: () => import('src/layouts/specialLayout.vue'),
        children: [
          {
            path: '/homework1',
            component: () => import('src/pages/CopyBook/HomeWork1.vue'),
          },
          // НОВЫЙ МАРШРУТ БЕЗ ЛЕЙАУТА
          {
            path: '/direct-print/:missionName',
            component: () => import('src/components/GamePrintAllWordsNotebook.vue')
          },
          {
            path: '/pixelArt',
            component: () => import('pages/PixelArtEditor.vue')
          },
        ]
      },

    ]

  },


  {
    path: '/vismyfriend',
    component: () => import('src/pages/Vismyfriend.vue')
  },
  {
    path: '/soundcheck',
    component: () => import('src/layouts/MainLayout.vue')
  },
  {
    path: '/scroll-zoom-in',
    component: () => import('src/pages/intros/scrollZoomIn.vue')
  },
  {
    path: '/noLayoutPage',
    component: () => import('src/pages/pageWithoutMainLayout.vue')
  },
  {
    path: '/tablitsa',
    component: () => import('src/pages/tablitsa.vue')
  },
  {
    path: '/tablitsaRef',
    component: () => import('src/pages/tablitsaRef.vue')
  },
  {
    path: '/yearGuesser',
    component: () => import('src/pages/gameYearGuesser.vue')
  },

  {
    path: '/differenceSeeLook',
    component: () => import('src/components/pageInfoWordDifference.vue')
  },
  {
    path: '/gameSnakeCursor',
    component: () => import('src/pages/gameSnakeCursor.vue')
  },
  {
    path: '/noLayoutPage2',
    component: () => import('src/pages/pageWithoutMainLayout2.vue')
  },
  {
    path: '/v-is-my-friend',
    component: () => import('src/pages/MyCornerOfTheInternet.vue')
  },
  {
    path: '/landing',
    component: () => import('src/pages/LandingPage/LandingPageVismyfriend.vue')
  },
  {
    path: '/sounds',
    component: () => import('src/pages/EnglishSounds.vue')
  },
  {
    path: '/canvas-test',
    component: () => import('src/pages/canvasTest.vue')
  },
  {
    path: '/NOcanvas-test',
    component: () => import('pages/noCanvasTest.vue')
  },
  {
    path: '/test',
    component: () => import('pages/PageForTestingImports.vue')
  },


  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }

]

export default routes

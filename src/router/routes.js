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
    path: '/noLayoutPage2',
    component: () => import('src/pages/pageWithoutMainLayout2.vue')
  },
  {
    path: '/v-is-my-friend',
    component: () => import('src/pages/MyCornerOfTheInternet.vue')
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
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }

]

export default routes

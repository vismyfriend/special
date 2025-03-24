const routes = [



  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/IntroPage.vue') },
      {
        path: '/special-app',
        component: () => import('src/layouts/specialLayout.vue'),
        children: [
          { path: '', component: () => import('src/pages/SpecialApp.vue') },
          {
            // : двоеточие обозначает динамичный переход
            path: ':missionName',
            component: () => import('src/layouts/GameLayout.vue'),
            children: [
              { path: '', component: () => import('src/pages/ChooseGame.vue') },
              {
                path: 'stories',
                component: () => import('src/components/GameStories.vue')
              },
              {
                path: 'print-all-words',
                component: () => import('src/components/PrintArray.vue')
              },
              {
                path: 'see-all-words',
                component: () => import('src/components/SeeArrayWords.vue')
              },
              {
                path: 'find-pairs',
                component: () => import('src/components/GameFindPairsHard.vue')
              },
              {
                path: 'find-pairs-hardcore',
                component: () => import('src/components/GameFindPairsHardcore.vue')
              },
              {
                path: 'find-one-pair',
                component: () => import('src/components/GameFindPairsEasy.vue')
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
                path: 'spell-eight',
                component: () => import('src/components/GameSpellEight.vue')
              },
              {
                path: 'word-order',
                component: () => import('src/components/GameWordOrder.vue')
              },
            ]
          },
        ]
      },


      {
        path: '/a-new-page',
        component: () => import('src/pages/visAnewPage.vue')
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
    ]
  },

  {
    path: '/vismyfriend',
    component: () => import('src/pages/Vismyfriend.vue')
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

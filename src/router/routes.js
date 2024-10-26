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
                path: 'find-pairs',
                component: () => import('src/components/GameFindPairs.vue')
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
            ]
          },
        ]
      },


      {
        path: '/a-new-page',
        component: () => import('src/pages/visAnewPage.vue')
      },
      {
        path: '/vismycoder',
        component: () => import('src/pages/vismycoder.vue')
      },
      {
        path: '/photos-of-agents',
        component: () => import('src/pages/PhotosOfAgents.vue')
      },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

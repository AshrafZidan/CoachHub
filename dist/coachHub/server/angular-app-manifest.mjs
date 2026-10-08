
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/auth/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GJHSU7TU.js"
    ],
    "redirectTo": "/auth/login",
    "route": "/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GJHSU7TU.js",
      "chunk-2MGI4XIN.js",
      "chunk-JHUEYNEN.js",
      "chunk-DJCTW2YA.js",
      "chunk-ZCVB54Z2.js",
      "chunk-YVGFNDFE.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GJHSU7TU.js",
      "chunk-2MGI4XIN.js",
      "chunk-JHUEYNEN.js",
      "chunk-DJCTW2YA.js",
      "chunk-ZCVB54Z2.js",
      "chunk-YVGFNDFE.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/auth/login-admin"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GJHSU7TU.js",
      "chunk-DTY34LL4.js",
      "chunk-L7IDWOXF.js",
      "chunk-DJCTW2YA.js",
      "chunk-QSIFF64N.js",
      "chunk-SJQNQEVG.js",
      "chunk-UWQDIJ2G.js",
      "chunk-7MR4FQNO.js",
      "chunk-V2QU2LFX.js",
      "chunk-VBZ7GX3J.js"
    ],
    "route": "/auth/register"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GJHSU7TU.js",
      "chunk-RLV77W4K.js",
      "chunk-DJCTW2YA.js",
      "chunk-YVGFNDFE.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/auth/forgot-password"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-EF4WUNXM.js",
      "chunk-MOJ4HNYV.js",
      "chunk-WMI36XHT.js",
      "chunk-ZA2LFK4R.js",
      "chunk-RXTFRLVU.js",
      "chunk-LUWCOT3Z.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/admin"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-EF4WUNXM.js",
      "chunk-MOJ4HNYV.js",
      "chunk-WMI36XHT.js",
      "chunk-ZA2LFK4R.js",
      "chunk-RXTFRLVU.js",
      "chunk-LUWCOT3Z.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/admin/coaches"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-EF4WUNXM.js",
      "chunk-MOJ4HNYV.js",
      "chunk-WMI36XHT.js",
      "chunk-ZA2LFK4R.js",
      "chunk-RXTFRLVU.js",
      "chunk-LUWCOT3Z.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/admin/coaches/edit-coach/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-EF4WUNXM.js",
      "chunk-MOJ4HNYV.js",
      "chunk-WMI36XHT.js",
      "chunk-ZA2LFK4R.js",
      "chunk-RXTFRLVU.js",
      "chunk-LUWCOT3Z.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/admin/coaches/add-coach"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-EF4WUNXM.js",
      "chunk-MOJ4HNYV.js",
      "chunk-WMI36XHT.js",
      "chunk-ZA2LFK4R.js",
      "chunk-RXTFRLVU.js",
      "chunk-LUWCOT3Z.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/admin/booking"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-EF4WUNXM.js",
      "chunk-MOJ4HNYV.js",
      "chunk-WMI36XHT.js",
      "chunk-ZA2LFK4R.js",
      "chunk-RXTFRLVU.js",
      "chunk-LUWCOT3Z.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/admin/coupons"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-EF4WUNXM.js",
      "chunk-MOJ4HNYV.js",
      "chunk-WMI36XHT.js",
      "chunk-ZA2LFK4R.js",
      "chunk-RXTFRLVU.js",
      "chunk-LUWCOT3Z.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/admin/coupons/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-EF4WUNXM.js",
      "chunk-MOJ4HNYV.js",
      "chunk-WMI36XHT.js",
      "chunk-ZA2LFK4R.js",
      "chunk-RXTFRLVU.js",
      "chunk-LUWCOT3Z.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/admin/admins-list"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-EF4WUNXM.js",
      "chunk-MOJ4HNYV.js",
      "chunk-WMI36XHT.js",
      "chunk-ZA2LFK4R.js",
      "chunk-RXTFRLVU.js",
      "chunk-LUWCOT3Z.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/admin/admins-List/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-EF4WUNXM.js",
      "chunk-MOJ4HNYV.js",
      "chunk-WMI36XHT.js",
      "chunk-ZA2LFK4R.js",
      "chunk-RXTFRLVU.js",
      "chunk-LUWCOT3Z.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/admin/reports"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-EF4WUNXM.js",
      "chunk-MOJ4HNYV.js",
      "chunk-WMI36XHT.js",
      "chunk-ZA2LFK4R.js",
      "chunk-RXTFRLVU.js",
      "chunk-LUWCOT3Z.js",
      "chunk-PDCSMXJC.js",
      "chunk-7UUNGCNS.js",
      "chunk-WRCAAS5S.js",
      "chunk-74HYMIX4.js"
    ],
    "route": "/admin/forbidden"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-I7NJIK53.js",
      "chunk-CYYN6UKL.js",
      "chunk-NCNICCWM.js",
      "chunk-JHUEYNEN.js",
      "chunk-ZCVB54Z2.js"
    ],
    "route": "/coach"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-I7NJIK53.js",
      "chunk-CYYN6UKL.js",
      "chunk-NCNICCWM.js",
      "chunk-JHUEYNEN.js",
      "chunk-ZCVB54Z2.js"
    ],
    "route": "/coach/bookings"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-I7NJIK53.js",
      "chunk-CYYN6UKL.js",
      "chunk-NCNICCWM.js",
      "chunk-JHUEYNEN.js",
      "chunk-ZCVB54Z2.js"
    ],
    "route": "/coach/calendar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-I7NJIK53.js",
      "chunk-CYYN6UKL.js",
      "chunk-NCNICCWM.js",
      "chunk-JHUEYNEN.js",
      "chunk-ZCVB54Z2.js"
    ],
    "route": "/coach/todo"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-I7NJIK53.js",
      "chunk-CYYN6UKL.js",
      "chunk-NCNICCWM.js",
      "chunk-JHUEYNEN.js",
      "chunk-ZCVB54Z2.js"
    ],
    "route": "/coach/todo/add"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-I7NJIK53.js",
      "chunk-CYYN6UKL.js",
      "chunk-NCNICCWM.js",
      "chunk-JHUEYNEN.js",
      "chunk-ZCVB54Z2.js"
    ],
    "route": "/coach/task-details/*"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-I7NJIK53.js",
      "chunk-CYYN6UKL.js",
      "chunk-NCNICCWM.js",
      "chunk-JHUEYNEN.js",
      "chunk-ZCVB54Z2.js"
    ],
    "route": "/coach/Coachees"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-I7NJIK53.js",
      "chunk-CYYN6UKL.js",
      "chunk-NCNICCWM.js",
      "chunk-JHUEYNEN.js",
      "chunk-ZCVB54Z2.js"
    ],
    "route": "/coach/profile"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-I7NJIK53.js",
      "chunk-CYYN6UKL.js",
      "chunk-NCNICCWM.js",
      "chunk-JHUEYNEN.js",
      "chunk-ZCVB54Z2.js"
    ],
    "route": "/coach/session/*"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XDSUSL6W.js",
      "chunk-CYYN6UKL.js",
      "chunk-NCNICCWM.js",
      "chunk-JHUEYNEN.js",
      "chunk-ZCVB54Z2.js"
    ],
    "route": "/coachee"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XDSUSL6W.js",
      "chunk-CYYN6UKL.js",
      "chunk-NCNICCWM.js",
      "chunk-JHUEYNEN.js",
      "chunk-ZCVB54Z2.js"
    ],
    "route": "/coachee/find-coach"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XDSUSL6W.js",
      "chunk-CYYN6UKL.js",
      "chunk-NCNICCWM.js",
      "chunk-JHUEYNEN.js",
      "chunk-ZCVB54Z2.js"
    ],
    "route": "/coachee/coache-details"
  },
  {
    "renderMode": 2,
    "route": "/forbidden"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 6549, hash: '9bf042e8b1f4d5e820eb84a4fa75c491fcd596b6a35e5e701d9e5ecd2251f5d4', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1472, hash: 'e8705057803f9d8b2becb07f6b8708f57ce96db05ff71bf39fd2b44a18ef7043', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/login-admin/index.html': {size: 99021, hash: '4bf4bfa4048f739cae9d0b8a76b5bacc9b3149546389f34eced4d92b121174e1', text: () => import('./assets-chunks/auth_login-admin_index_html.mjs').then(m => m.default)},
    'coach/bookings/index.html': {size: 53827, hash: 'fbb36d37c4271c690f8611e32f50f1e87d4ae0f87b41437b48cbcd0b948d1185', text: () => import('./assets-chunks/coach_bookings_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 100902, hash: '54a1d6c2db1b6f5192b176961eff403a54f6a24b11d9fcf92d6ae2b45d8a1ed8', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'forbidden/index.html': {size: 69098, hash: '9f75813352a3bd1b9780d17532eb480b1fee778b3baaeb2e02575212739b02f5', text: () => import('./assets-chunks/forbidden_index_html.mjs').then(m => m.default)},
    'auth/forgot-password/index.html': {size: 89904, hash: '748d96938056471357f5f3c1b195616f36e191b6bd7a3ac09bd6eb257af70542', text: () => import('./assets-chunks/auth_forgot-password_index_html.mjs').then(m => m.default)},
    'coach/calendar/index.html': {size: 142102, hash: 'aac70ecfa55d9ab9cd352ed1f45edfa972dbe8104306098f77045363f761100e', text: () => import('./assets-chunks/coach_calendar_index_html.mjs').then(m => m.default)},
    'coach/todo/index.html': {size: 36028, hash: 'e7f11405689423eaa5bf4d5e59404fbfddd1bc1669b35795c1b354abf875645a', text: () => import('./assets-chunks/coach_todo_index_html.mjs').then(m => m.default)},
    'coachee/coache-details/index.html': {size: 53198, hash: 'bae78befa4215d57896aba8868e533a06eb42f219225c2e0963aa906b0d63d7e', text: () => import('./assets-chunks/coachee_coache-details_index_html.mjs').then(m => m.default)},
    'coach/index.html': {size: 267, hash: 'e13cdce7436d10b7981f3979ff686ac3b5f3a5684ea96990af7f7d11ea602808', text: () => import('./assets-chunks/coach_index_html.mjs').then(m => m.default)},
    'coach/profile/index.html': {size: 58924, hash: 'efb059de8e2998d712d85a088642df4e1dd57feaa858a614a21023fe75c525c3', text: () => import('./assets-chunks/coach_profile_index_html.mjs').then(m => m.default)},
    'coach/todo/add/index.html': {size: 41257, hash: '4ea4e02101b1ff38b5f2847c114cfbb32b214ac4b6516ac426ac413de7ca3b6a', text: () => import('./assets-chunks/coach_todo_add_index_html.mjs').then(m => m.default)},
    'auth/register/index.html': {size: 125288, hash: '987fb5d12e76ff8e81d84d90fe91076a9a8598f242b3a584e090a9cdb661479b', text: () => import('./assets-chunks/auth_register_index_html.mjs').then(m => m.default)},
    'coachee/index.html': {size: 279, hash: '41d815877e1ac8ab65569c6985fff83145e40788f13957fe3b8b8a5bd62d5cb9', text: () => import('./assets-chunks/coachee_index_html.mjs').then(m => m.default)},
    'coach/Coachees/index.html': {size: 49263, hash: '54a4124bedcda37392a4cc53ecce2eb1fd0a9eca3ff8f65459974e58694e0134', text: () => import('./assets-chunks/coach_Coachees_index_html.mjs').then(m => m.default)},
    'coachee/find-coach/index.html': {size: 98979, hash: '04c2492bf3a866ab512a518e4882ad059fee3d9dd8ba41b4187fee7010add9d9', text: () => import('./assets-chunks/coachee_find-coach_index_html.mjs').then(m => m.default)},
    'styles-FCWYS6RK.css': {size: 40940, hash: 'zzXGXootaV0', text: () => import('./assets-chunks/styles-FCWYS6RK_css.mjs').then(m => m.default)}
  },
};

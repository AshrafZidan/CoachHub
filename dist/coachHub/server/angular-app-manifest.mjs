
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
      "chunk-ENM5LA5A.js"
    ],
    "redirectTo": "/auth/login",
    "route": "/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ENM5LA5A.js",
      "chunk-XUCDM6KP.js",
      "chunk-XXXV2UPL.js",
      "chunk-YG3Q4MD3.js",
      "chunk-I546B4GX.js",
      "chunk-VRC3JJVD.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ENM5LA5A.js",
      "chunk-XUCDM6KP.js",
      "chunk-XXXV2UPL.js",
      "chunk-YG3Q4MD3.js",
      "chunk-I546B4GX.js",
      "chunk-VRC3JJVD.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/auth/login-admin"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ENM5LA5A.js",
      "chunk-MNPVSEPP.js",
      "chunk-7DCIFFBT.js",
      "chunk-YG3Q4MD3.js",
      "chunk-AZ5P3ZYL.js",
      "chunk-ASC36J5M.js",
      "chunk-RANGPQLF.js",
      "chunk-AW5JZIED.js",
      "chunk-LC4H3JPK.js",
      "chunk-NQIKW6O4.js"
    ],
    "route": "/auth/register"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ENM5LA5A.js",
      "chunk-FQHBFDEW.js",
      "chunk-YG3Q4MD3.js",
      "chunk-VRC3JJVD.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/auth/forgot-password"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MGKHFYK4.js",
      "chunk-WFRQKA7G.js",
      "chunk-KXC7S737.js",
      "chunk-XX3QFNUG.js",
      "chunk-GLFR42BS.js",
      "chunk-IRNVN4KW.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/admin"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MGKHFYK4.js",
      "chunk-WFRQKA7G.js",
      "chunk-KXC7S737.js",
      "chunk-XX3QFNUG.js",
      "chunk-GLFR42BS.js",
      "chunk-IRNVN4KW.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/admin/coaches"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MGKHFYK4.js",
      "chunk-WFRQKA7G.js",
      "chunk-KXC7S737.js",
      "chunk-XX3QFNUG.js",
      "chunk-GLFR42BS.js",
      "chunk-IRNVN4KW.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/admin/coaches/edit-coach/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MGKHFYK4.js",
      "chunk-WFRQKA7G.js",
      "chunk-KXC7S737.js",
      "chunk-XX3QFNUG.js",
      "chunk-GLFR42BS.js",
      "chunk-IRNVN4KW.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/admin/coaches/add-coach"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MGKHFYK4.js",
      "chunk-WFRQKA7G.js",
      "chunk-KXC7S737.js",
      "chunk-XX3QFNUG.js",
      "chunk-GLFR42BS.js",
      "chunk-IRNVN4KW.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/admin/booking"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MGKHFYK4.js",
      "chunk-WFRQKA7G.js",
      "chunk-KXC7S737.js",
      "chunk-XX3QFNUG.js",
      "chunk-GLFR42BS.js",
      "chunk-IRNVN4KW.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/admin/coupons"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MGKHFYK4.js",
      "chunk-WFRQKA7G.js",
      "chunk-KXC7S737.js",
      "chunk-XX3QFNUG.js",
      "chunk-GLFR42BS.js",
      "chunk-IRNVN4KW.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/admin/coupons/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MGKHFYK4.js",
      "chunk-WFRQKA7G.js",
      "chunk-KXC7S737.js",
      "chunk-XX3QFNUG.js",
      "chunk-GLFR42BS.js",
      "chunk-IRNVN4KW.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/admin/admins-list"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MGKHFYK4.js",
      "chunk-WFRQKA7G.js",
      "chunk-KXC7S737.js",
      "chunk-XX3QFNUG.js",
      "chunk-GLFR42BS.js",
      "chunk-IRNVN4KW.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/admin/admins-List/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MGKHFYK4.js",
      "chunk-WFRQKA7G.js",
      "chunk-KXC7S737.js",
      "chunk-XX3QFNUG.js",
      "chunk-GLFR42BS.js",
      "chunk-IRNVN4KW.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/admin/reports"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MGKHFYK4.js",
      "chunk-WFRQKA7G.js",
      "chunk-KXC7S737.js",
      "chunk-XX3QFNUG.js",
      "chunk-GLFR42BS.js",
      "chunk-IRNVN4KW.js",
      "chunk-X3IMBY3F.js",
      "chunk-TQZ4IB3X.js",
      "chunk-DJ4NMBTM.js",
      "chunk-QKSKYLG4.js"
    ],
    "route": "/admin/forbidden"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GJBEUJW6.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coach"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GJBEUJW6.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coach/bookings"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GJBEUJW6.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coach/calendar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GJBEUJW6.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coach/todo"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GJBEUJW6.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coach/todo/add"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-GJBEUJW6.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coach/task-details/*"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GJBEUJW6.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coach/Coachees"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GJBEUJW6.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coach/profile"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-GJBEUJW6.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coach/session/*"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FHAS43BY.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coachee"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FHAS43BY.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coachee/find-coach"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FHAS43BY.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coachee/coache-details"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FHAS43BY.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coachee/bookings"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FHAS43BY.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coachee/todo"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-FHAS43BY.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coachee/task-details/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-FHAS43BY.js",
      "chunk-GKW7VF6I.js",
      "chunk-T6TEDIHT.js",
      "chunk-XXXV2UPL.js",
      "chunk-I546B4GX.js"
    ],
    "route": "/coachee/session/*"
  },
  {
    "renderMode": 2,
    "route": "/forbidden"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 6549, hash: '9ed361594e5f990c3aaee70f7696c639ebe4711af679256810aff7e2b01e09f7', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1472, hash: '283a989fdab0eadb23ced178474b07db7b36ad53567372c5185f3f56ab331071', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'coach/bookings/index.html': {size: 54066, hash: '9cf8be2fa0c800a2d4da3f48cfd0afaa17dc34fd757afe1f34dd5af1bc5663fc', text: () => import('./assets-chunks/coach_bookings_index_html.mjs').then(m => m.default)},
    'auth/login-admin/index.html': {size: 99021, hash: '827e3f81d875639921a8afb8f9efb573be435b1e3ae5f8709f73281270cf21ef', text: () => import('./assets-chunks/auth_login-admin_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 100902, hash: '7b5f3b467323092fbc55a2fdbfc500bf3403820d8adc88a6e14e791c3bdadafe', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'coachee/bookings/index.html': {size: 46377, hash: '088ce6843f2991517d84d03021d2523e4da0221ebf3df593ac4dc257d7a1cb68', text: () => import('./assets-chunks/coachee_bookings_index_html.mjs').then(m => m.default)},
    'forbidden/index.html': {size: 63311, hash: 'c4bf7efb9c1b1cc3db0c2b0c60ccfdb3d52a05172dbc1915d011d8a5dc19f920', text: () => import('./assets-chunks/forbidden_index_html.mjs').then(m => m.default)},
    'coach/calendar/index.html': {size: 142219, hash: '9b8f6d9b6e01457bfc40043b918ac32a2ffb4fb79b45199529b20cc8d7c3a296', text: () => import('./assets-chunks/coach_calendar_index_html.mjs').then(m => m.default)},
    'auth/forgot-password/index.html': {size: 76617, hash: 'baae05cc95da6085717db797ea93ea39a2d3e3818baa99aeb81f18ffec265bb2', text: () => import('./assets-chunks/auth_forgot-password_index_html.mjs').then(m => m.default)},
    'coach/todo/index.html': {size: 25418, hash: '967064d12399326d7e393c1f4aaba8dd9ebd84783ac76034f51a9599e8489fd6', text: () => import('./assets-chunks/coach_todo_index_html.mjs').then(m => m.default)},
    'coachee/coache-details/index.html': {size: 53193, hash: '10a579b1de5f16f089ff1abe2f79cfe7398f327f7bed911c0f66d10b838499e0', text: () => import('./assets-chunks/coachee_coache-details_index_html.mjs').then(m => m.default)},
    'auth/register/index.html': {size: 112023, hash: '831fb8cd07346629fd4377fba835a6ebd0022b2c864885b937941be8fb194c9f', text: () => import('./assets-chunks/auth_register_index_html.mjs').then(m => m.default)},
    'coach/todo/add/index.html': {size: 42261, hash: 'a9196c067e01a2193def28c3f47252c42c44d54d3e1659024f4aee99edfd9301', text: () => import('./assets-chunks/coach_todo_add_index_html.mjs').then(m => m.default)},
    'coachee/todo/index.html': {size: 58188, hash: 'a8e2a23adf733a0d15a6e8231bbdfb3e7f2b799a6727c6e6975389a1c4fa2b24', text: () => import('./assets-chunks/coachee_todo_index_html.mjs').then(m => m.default)},
    'coach/Coachees/index.html': {size: 62555, hash: '04053160d116fc94e3971336e00efbf6b26aba5c24c6ea2223b907d77adbde47', text: () => import('./assets-chunks/coach_Coachees_index_html.mjs').then(m => m.default)},
    'coach/profile/index.html': {size: 39840, hash: '166f89450a29881dd22081c51d6e99e80ac9b6700e99ce8738cfcde8514d8a7d', text: () => import('./assets-chunks/coach_profile_index_html.mjs').then(m => m.default)},
    'coach/index.html': {size: 267, hash: 'e13cdce7436d10b7981f3979ff686ac3b5f3a5684ea96990af7f7d11ea602808', text: () => import('./assets-chunks/coach_index_html.mjs').then(m => m.default)},
    'coachee/index.html': {size: 279, hash: '41d815877e1ac8ab65569c6985fff83145e40788f13957fe3b8b8a5bd62d5cb9', text: () => import('./assets-chunks/coachee_index_html.mjs').then(m => m.default)},
    'coachee/find-coach/index.html': {size: 118115, hash: '7bb92481fe135200702c483b1d644ba8dc962c0d58120be41db576f7faa867e2', text: () => import('./assets-chunks/coachee_find-coach_index_html.mjs').then(m => m.default)},
    'styles-DZYBZM3Y.css': {size: 40930, hash: 'heMuIlF33tw', text: () => import('./assets-chunks/styles-DZYBZM3Y_css.mjs').then(m => m.default)}
  },
};

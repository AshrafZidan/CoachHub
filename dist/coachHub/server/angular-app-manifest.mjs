
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
      "chunk-RPHE5TRO.js"
    ],
    "redirectTo": "/auth/login",
    "route": "/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-RPHE5TRO.js",
      "chunk-CV4BTEG3.js",
      "chunk-4YGJWNCI.js",
      "chunk-YDCPT6FI.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-RPHE5TRO.js",
      "chunk-CV4BTEG3.js",
      "chunk-4YGJWNCI.js",
      "chunk-YDCPT6FI.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/auth/login-admin"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-RPHE5TRO.js",
      "chunk-RTX57KGQ.js",
      "chunk-PIY2YX57.js",
      "chunk-4YGJWNCI.js",
      "chunk-WK6HUQUP.js",
      "chunk-JGRZIM4A.js",
      "chunk-V2YMY3EU.js",
      "chunk-P64BZV42.js",
      "chunk-RJSH7G4C.js",
      "chunk-KVJX2FM7.js"
    ],
    "route": "/auth/register"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-RPHE5TRO.js",
      "chunk-6Z3IZQVI.js",
      "chunk-4YGJWNCI.js",
      "chunk-YDCPT6FI.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/auth/forgot-password"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-PKVGQYHL.js",
      "chunk-O46L6HBN.js",
      "chunk-XQILZNC4.js",
      "chunk-SMUZNDFA.js",
      "chunk-JOEFBPEA.js",
      "chunk-XFXDP56Y.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/admin"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-PKVGQYHL.js",
      "chunk-O46L6HBN.js",
      "chunk-XQILZNC4.js",
      "chunk-SMUZNDFA.js",
      "chunk-JOEFBPEA.js",
      "chunk-XFXDP56Y.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/admin/coaches"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-PKVGQYHL.js",
      "chunk-O46L6HBN.js",
      "chunk-XQILZNC4.js",
      "chunk-SMUZNDFA.js",
      "chunk-JOEFBPEA.js",
      "chunk-XFXDP56Y.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/admin/coaches/edit-coach/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-PKVGQYHL.js",
      "chunk-O46L6HBN.js",
      "chunk-XQILZNC4.js",
      "chunk-SMUZNDFA.js",
      "chunk-JOEFBPEA.js",
      "chunk-XFXDP56Y.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/admin/coaches/add-coach"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-PKVGQYHL.js",
      "chunk-O46L6HBN.js",
      "chunk-XQILZNC4.js",
      "chunk-SMUZNDFA.js",
      "chunk-JOEFBPEA.js",
      "chunk-XFXDP56Y.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/admin/booking"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-PKVGQYHL.js",
      "chunk-O46L6HBN.js",
      "chunk-XQILZNC4.js",
      "chunk-SMUZNDFA.js",
      "chunk-JOEFBPEA.js",
      "chunk-XFXDP56Y.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/admin/coupons"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-PKVGQYHL.js",
      "chunk-O46L6HBN.js",
      "chunk-XQILZNC4.js",
      "chunk-SMUZNDFA.js",
      "chunk-JOEFBPEA.js",
      "chunk-XFXDP56Y.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/admin/coupons/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-PKVGQYHL.js",
      "chunk-O46L6HBN.js",
      "chunk-XQILZNC4.js",
      "chunk-SMUZNDFA.js",
      "chunk-JOEFBPEA.js",
      "chunk-XFXDP56Y.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/admin/admins-list"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-PKVGQYHL.js",
      "chunk-O46L6HBN.js",
      "chunk-XQILZNC4.js",
      "chunk-SMUZNDFA.js",
      "chunk-JOEFBPEA.js",
      "chunk-XFXDP56Y.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/admin/admins-List/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-PKVGQYHL.js",
      "chunk-O46L6HBN.js",
      "chunk-XQILZNC4.js",
      "chunk-SMUZNDFA.js",
      "chunk-JOEFBPEA.js",
      "chunk-XFXDP56Y.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/admin/reports"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-PKVGQYHL.js",
      "chunk-O46L6HBN.js",
      "chunk-XQILZNC4.js",
      "chunk-SMUZNDFA.js",
      "chunk-JOEFBPEA.js",
      "chunk-XFXDP56Y.js",
      "chunk-PZDNPH4U.js",
      "chunk-FNSSGC3B.js",
      "chunk-TZDVC2YG.js",
      "chunk-7NUDQJMI.js"
    ],
    "route": "/admin/forbidden"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ECO3U7AM.js",
      "chunk-GXQ3X7V6.js"
    ],
    "route": "/coach"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ECO3U7AM.js",
      "chunk-GXQ3X7V6.js"
    ],
    "route": "/coach/bookings"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ECO3U7AM.js",
      "chunk-GXQ3X7V6.js"
    ],
    "route": "/coach/calendar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ECO3U7AM.js",
      "chunk-GXQ3X7V6.js"
    ],
    "route": "/coach/todo"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ECO3U7AM.js",
      "chunk-GXQ3X7V6.js"
    ],
    "route": "/coach/todo/add"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ECO3U7AM.js",
      "chunk-GXQ3X7V6.js"
    ],
    "route": "/coach/task-details/*"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ECO3U7AM.js",
      "chunk-GXQ3X7V6.js"
    ],
    "route": "/coach/Coachees"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ECO3U7AM.js",
      "chunk-GXQ3X7V6.js"
    ],
    "route": "/coach/profile"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-I3FA2A63.js",
      "chunk-ONSRI2D6.js"
    ],
    "route": "/user"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-I3FA2A63.js",
      "chunk-ONSRI2D6.js"
    ],
    "route": "/user/dashboard"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 3974, hash: 'c9b4dc091ee4d0a3d30d3abd01352c61e428df275267b5f0c363fd040ddc882f', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1472, hash: '008afa0150c50bb5dc95b3073fcf3e6dfe239071cd09ec5a38da19d00aca28af', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'coach/bookings/index.html': {size: 46740, hash: '5ccc8ff496956b1e5c47ebba43d90c05ed6d83886e409f88e01c99849b30cbe3', text: () => import('./assets-chunks/coach_bookings_index_html.mjs').then(m => m.default)},
    'auth/login-admin/index.html': {size: 96890, hash: '8a3b1e3e5e3c4f00c04ee09a6c35c31ce37f39f73ffdeb0fce3ac2044b1c0ce7', text: () => import('./assets-chunks/auth_login-admin_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 98064, hash: '99edfedaf61dd5ad3f699bca9d255b2c663bc5a4832f33bd7fa72f94294270a5', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'user/dashboard/index.html': {size: 9394, hash: '29cc39836110f11f14df5696825ebf97a7f65959772ce03f481982cd99a257f8', text: () => import('./assets-chunks/user_dashboard_index_html.mjs').then(m => m.default)},
    'auth/forgot-password/index.html': {size: 75187, hash: 'a29133c0422eda16d1ad87d3315aad6cb59bd01976b28f7284ded4c29cc28012', text: () => import('./assets-chunks/auth_forgot-password_index_html.mjs').then(m => m.default)},
    'coach/todo/index.html': {size: 47769, hash: '4ed61b0706a21dffdc7a608bc8246d429c2a56e35d6782519296bae512021665', text: () => import('./assets-chunks/coach_todo_index_html.mjs').then(m => m.default)},
    'coach/calendar/index.html': {size: 132223, hash: '4fee4e69bf07e4c7eb7895e17f640922e8ee2a700f7ded7464b87e02397cc407', text: () => import('./assets-chunks/coach_calendar_index_html.mjs').then(m => m.default)},
    'auth/register/index.html': {size: 50593, hash: 'e0cdb6231eb00a196ec8958a4dc72f49f40660e732750cf799f904520df8c9fa', text: () => import('./assets-chunks/auth_register_index_html.mjs').then(m => m.default)},
    'coach/todo/add/index.html': {size: 20061, hash: 'c97bdd2980a41c5323b6f9860d9be8f334372263bb674139ee81468470051223', text: () => import('./assets-chunks/coach_todo_add_index_html.mjs').then(m => m.default)},
    'coach/index.html': {size: 267, hash: 'e13cdce7436d10b7981f3979ff686ac3b5f3a5684ea96990af7f7d11ea602808', text: () => import('./assets-chunks/coach_index_html.mjs').then(m => m.default)},
    'user/index.html': {size: 267, hash: '7b8c1ea5758be70e03a57056d0c312fea0b822391f8e005360e3d9beb06059c9', text: () => import('./assets-chunks/user_index_html.mjs').then(m => m.default)},
    'coach/profile/index.html': {size: 29698, hash: '8976be6f2ca11dcdda727a2298c0289317e8fef8f334879818a07b60784fc3bf', text: () => import('./assets-chunks/coach_profile_index_html.mjs').then(m => m.default)},
    'coach/Coachees/index.html': {size: 59414, hash: '49f7ea26b731cbaee0837a556340996f1e931301d5f1435b518a54f6c0bfa9e5', text: () => import('./assets-chunks/coach_Coachees_index_html.mjs').then(m => m.default)},
    'styles-TZCYACNA.css': {size: 30400, hash: 'zDAcWRDxNVk', text: () => import('./assets-chunks/styles-TZCYACNA_css.mjs').then(m => m.default)}
  },
};

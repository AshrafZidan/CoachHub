
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
      "chunk-MFTFLWK6.js"
    ],
    "redirectTo": "/auth/login",
    "route": "/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MFTFLWK6.js",
      "chunk-FQVQUKJK.js",
      "chunk-USKT42RN.js",
      "chunk-5U33IFIV.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MFTFLWK6.js",
      "chunk-FQVQUKJK.js",
      "chunk-USKT42RN.js",
      "chunk-5U33IFIV.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/auth/login-admin"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MFTFLWK6.js",
      "chunk-7PI4WMNZ.js",
      "chunk-PUFMDR3I.js",
      "chunk-USKT42RN.js",
      "chunk-5SCBNYLF.js",
      "chunk-7327C537.js",
      "chunk-2ZXIJNCV.js",
      "chunk-NXGEO3SX.js",
      "chunk-XQTMZ65D.js",
      "chunk-GPNZVNE3.js"
    ],
    "route": "/auth/register"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MFTFLWK6.js",
      "chunk-KIDFBVFY.js",
      "chunk-USKT42RN.js",
      "chunk-5U33IFIV.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/auth/forgot-password"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MEYKO42P.js",
      "chunk-XKSMLBF5.js",
      "chunk-G24NR543.js",
      "chunk-RAMFQUEP.js",
      "chunk-5EGCFR5V.js",
      "chunk-MNLRTNNB.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/admin"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MEYKO42P.js",
      "chunk-XKSMLBF5.js",
      "chunk-G24NR543.js",
      "chunk-RAMFQUEP.js",
      "chunk-5EGCFR5V.js",
      "chunk-MNLRTNNB.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/admin/coaches"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MEYKO42P.js",
      "chunk-XKSMLBF5.js",
      "chunk-G24NR543.js",
      "chunk-RAMFQUEP.js",
      "chunk-5EGCFR5V.js",
      "chunk-MNLRTNNB.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/admin/coaches/edit-coach/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MEYKO42P.js",
      "chunk-XKSMLBF5.js",
      "chunk-G24NR543.js",
      "chunk-RAMFQUEP.js",
      "chunk-5EGCFR5V.js",
      "chunk-MNLRTNNB.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/admin/coaches/add-coach"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MEYKO42P.js",
      "chunk-XKSMLBF5.js",
      "chunk-G24NR543.js",
      "chunk-RAMFQUEP.js",
      "chunk-5EGCFR5V.js",
      "chunk-MNLRTNNB.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/admin/booking"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MEYKO42P.js",
      "chunk-XKSMLBF5.js",
      "chunk-G24NR543.js",
      "chunk-RAMFQUEP.js",
      "chunk-5EGCFR5V.js",
      "chunk-MNLRTNNB.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/admin/coupons"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MEYKO42P.js",
      "chunk-XKSMLBF5.js",
      "chunk-G24NR543.js",
      "chunk-RAMFQUEP.js",
      "chunk-5EGCFR5V.js",
      "chunk-MNLRTNNB.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/admin/coupons/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MEYKO42P.js",
      "chunk-XKSMLBF5.js",
      "chunk-G24NR543.js",
      "chunk-RAMFQUEP.js",
      "chunk-5EGCFR5V.js",
      "chunk-MNLRTNNB.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/admin/admins-list"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MEYKO42P.js",
      "chunk-XKSMLBF5.js",
      "chunk-G24NR543.js",
      "chunk-RAMFQUEP.js",
      "chunk-5EGCFR5V.js",
      "chunk-MNLRTNNB.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/admin/admins-List/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MEYKO42P.js",
      "chunk-XKSMLBF5.js",
      "chunk-G24NR543.js",
      "chunk-RAMFQUEP.js",
      "chunk-5EGCFR5V.js",
      "chunk-MNLRTNNB.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/admin/reports"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-MEYKO42P.js",
      "chunk-XKSMLBF5.js",
      "chunk-G24NR543.js",
      "chunk-RAMFQUEP.js",
      "chunk-5EGCFR5V.js",
      "chunk-MNLRTNNB.js",
      "chunk-DX2CGUM3.js",
      "chunk-M6UQBMKI.js",
      "chunk-GS2TUMMI.js",
      "chunk-5X7NI6YB.js"
    ],
    "route": "/admin/forbidden"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-X2BX4TWD.js",
      "chunk-ND2SQ3SK.js",
      "chunk-LSCOUUA3.js",
      "chunk-2ITKUBIQ.js"
    ],
    "route": "/coach"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-X2BX4TWD.js",
      "chunk-ND2SQ3SK.js",
      "chunk-LSCOUUA3.js",
      "chunk-2ITKUBIQ.js"
    ],
    "route": "/coach/bookings"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-X2BX4TWD.js",
      "chunk-ND2SQ3SK.js",
      "chunk-LSCOUUA3.js",
      "chunk-2ITKUBIQ.js"
    ],
    "route": "/coach/calendar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-X2BX4TWD.js",
      "chunk-ND2SQ3SK.js",
      "chunk-LSCOUUA3.js",
      "chunk-2ITKUBIQ.js"
    ],
    "route": "/coach/todo"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-X2BX4TWD.js",
      "chunk-ND2SQ3SK.js",
      "chunk-LSCOUUA3.js",
      "chunk-2ITKUBIQ.js"
    ],
    "route": "/coach/todo/add"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-X2BX4TWD.js",
      "chunk-ND2SQ3SK.js",
      "chunk-LSCOUUA3.js",
      "chunk-2ITKUBIQ.js"
    ],
    "route": "/coach/task-details/*"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-X2BX4TWD.js",
      "chunk-ND2SQ3SK.js",
      "chunk-LSCOUUA3.js",
      "chunk-2ITKUBIQ.js"
    ],
    "route": "/coach/Coachees"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-X2BX4TWD.js",
      "chunk-ND2SQ3SK.js",
      "chunk-LSCOUUA3.js",
      "chunk-2ITKUBIQ.js"
    ],
    "route": "/coach/profile"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-X2BX4TWD.js",
      "chunk-ND2SQ3SK.js",
      "chunk-LSCOUUA3.js",
      "chunk-2ITKUBIQ.js"
    ],
    "route": "/coach/session/*"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-SWDWYPRW.js",
      "chunk-4PQRY4TF.js"
    ],
    "route": "/user"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-SWDWYPRW.js",
      "chunk-4PQRY4TF.js"
    ],
    "route": "/user/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/forbidden"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 6408, hash: 'eb0b7a971310cb8650d4ed361033815f096ad445961d23520721668f6a7ba73a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1472, hash: 'fedf9666cf434e8c0e1c521e91aa3e6980dc6bcd6b43a804de9fbece07361386', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/login-admin/index.html': {size: 98753, hash: 'b1ff1b7456608343281834c159601c03b43d2cb1351991a6a919e100b715539d', text: () => import('./assets-chunks/auth_login-admin_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 100615, hash: '2ea47fd24b2c0300a7de06bc7af0d6adff180523e878de103040f72e5323c21a', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'coach/bookings/index.html': {size: 52921, hash: '34c2ebf7e04c23aea968da3fc397b72ccc41a5e180a003dee0f1a08ebe11dacf', text: () => import('./assets-chunks/coach_bookings_index_html.mjs').then(m => m.default)},
    'coach/calendar/index.html': {size: 52921, hash: '34c2ebf7e04c23aea968da3fc397b72ccc41a5e180a003dee0f1a08ebe11dacf', text: () => import('./assets-chunks/coach_calendar_index_html.mjs').then(m => m.default)},
    'user/dashboard/index.html': {size: 12226, hash: '3c630deda3793c1dc31d604d52a5ffaf9117f8591477193d3338c48c619dcf1c', text: () => import('./assets-chunks/user_dashboard_index_html.mjs').then(m => m.default)},
    'coach/index.html': {size: 267, hash: 'e13cdce7436d10b7981f3979ff686ac3b5f3a5684ea96990af7f7d11ea602808', text: () => import('./assets-chunks/coach_index_html.mjs').then(m => m.default)},
    'user/index.html': {size: 267, hash: '7b8c1ea5758be70e03a57056d0c312fea0b822391f8e005360e3d9beb06059c9', text: () => import('./assets-chunks/user_index_html.mjs').then(m => m.default)},
    'coach/profile/index.html': {size: 20225, hash: 'b3b9853412e2129780fa7153cc458ba882ab252b384a9927d3292e5c8e145fa6', text: () => import('./assets-chunks/coach_profile_index_html.mjs').then(m => m.default)},
    'coach/todo/add/index.html': {size: 52924, hash: '516b3fd7831b77aa8e52f39885cb6d71f3f4eb0253b3ea9f05138e9b8ce989b0', text: () => import('./assets-chunks/coach_todo_add_index_html.mjs').then(m => m.default)},
    'coach/Coachees/index.html': {size: 52924, hash: '516b3fd7831b77aa8e52f39885cb6d71f3f4eb0253b3ea9f05138e9b8ce989b0', text: () => import('./assets-chunks/coach_Coachees_index_html.mjs').then(m => m.default)},
    'auth/forgot-password/index.html': {size: 89751, hash: 'd955e2bce0e43c26da8d40f12817d5206418d5f829860a22e2ba807d9a00495b', text: () => import('./assets-chunks/auth_forgot-password_index_html.mjs').then(m => m.default)},
    'coach/todo/index.html': {size: 52924, hash: '73852b4ce6d3d00969448f45dbbede7960e66620539761c96f7a71087ad40fc0', text: () => import('./assets-chunks/coach_todo_index_html.mjs').then(m => m.default)},
    'auth/register/index.html': {size: 111847, hash: '60d15fa3e31ae65a96b34ca49efe13184f9415eeb7bc5c9198b47e02bfca4476', text: () => import('./assets-chunks/auth_register_index_html.mjs').then(m => m.default)},
    'forbidden/index.html': {size: 82240, hash: '96a35ec9b29982ca46d6439d88d5e09b5ea888766639986040040f912af7175d', text: () => import('./assets-chunks/forbidden_index_html.mjs').then(m => m.default)},
    'styles-SX5DGXTW.css': {size: 40017, hash: 'pigIyEPC9Sw', text: () => import('./assets-chunks/styles-SX5DGXTW_css.mjs').then(m => m.default)}
  },
};

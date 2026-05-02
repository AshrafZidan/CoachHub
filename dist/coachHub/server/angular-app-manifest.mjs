
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
    "route": "/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-PEOHLT2I.js",
      "chunk-FYO77CRL.js",
      "chunk-XUBPGHSU.js",
      "chunk-KFDQKEM5.js",
      "chunk-XXAMKFG5.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-PEOHLT2I.js",
      "chunk-FYO77CRL.js",
      "chunk-XUBPGHSU.js",
      "chunk-KFDQKEM5.js",
      "chunk-XXAMKFG5.js"
    ],
    "route": "/auth/login-admin"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-QSYBWKCH.js",
      "chunk-RSSO2NM2.js",
      "chunk-CMHAOLBJ.js",
      "chunk-7FDX4IAS.js",
      "chunk-KFDQKEM5.js",
      "chunk-XXAMKFG5.js"
    ],
    "route": "/admin"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-QSYBWKCH.js",
      "chunk-RSSO2NM2.js",
      "chunk-CMHAOLBJ.js",
      "chunk-7FDX4IAS.js",
      "chunk-KFDQKEM5.js",
      "chunk-XXAMKFG5.js"
    ],
    "route": "/admin/coaches"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-QSYBWKCH.js",
      "chunk-RSSO2NM2.js",
      "chunk-CMHAOLBJ.js",
      "chunk-7FDX4IAS.js",
      "chunk-KFDQKEM5.js",
      "chunk-XXAMKFG5.js"
    ],
    "route": "/admin/coaches/edit-coach/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-QSYBWKCH.js",
      "chunk-RSSO2NM2.js",
      "chunk-CMHAOLBJ.js",
      "chunk-7FDX4IAS.js",
      "chunk-KFDQKEM5.js",
      "chunk-XXAMKFG5.js"
    ],
    "route": "/admin/booking"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-QSYBWKCH.js",
      "chunk-RSSO2NM2.js",
      "chunk-CMHAOLBJ.js",
      "chunk-7FDX4IAS.js",
      "chunk-KFDQKEM5.js",
      "chunk-XXAMKFG5.js"
    ],
    "route": "/admin/coupons"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-QSYBWKCH.js",
      "chunk-RSSO2NM2.js",
      "chunk-CMHAOLBJ.js",
      "chunk-7FDX4IAS.js",
      "chunk-KFDQKEM5.js",
      "chunk-XXAMKFG5.js"
    ],
    "route": "/admin/coupons/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-QSYBWKCH.js",
      "chunk-RSSO2NM2.js",
      "chunk-CMHAOLBJ.js",
      "chunk-7FDX4IAS.js",
      "chunk-KFDQKEM5.js",
      "chunk-XXAMKFG5.js"
    ],
    "route": "/admin/admins-list"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-QSYBWKCH.js",
      "chunk-RSSO2NM2.js",
      "chunk-CMHAOLBJ.js",
      "chunk-7FDX4IAS.js",
      "chunk-KFDQKEM5.js",
      "chunk-XXAMKFG5.js"
    ],
    "route": "/admin/admins-List/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-QSYBWKCH.js",
      "chunk-RSSO2NM2.js",
      "chunk-CMHAOLBJ.js",
      "chunk-7FDX4IAS.js",
      "chunk-KFDQKEM5.js",
      "chunk-XXAMKFG5.js"
    ],
    "route": "/admin/forbidden"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 3768, hash: '8fa2809d077d023463e3114f1a227a787e7ea25c1a8a5227bb41cccc8bce1396', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1472, hash: '89083cff80c2c101e13feb907b87feb90600a9d4ba2210eef26cb7fa478951b5', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/index.html': {size: 36942, hash: '157507168251277d83d13ae3ff7ab1bccb63232f7882977560e654bb089bdf1a', text: () => import('./assets-chunks/auth_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 94889, hash: 'f3bda27e4d6ebd7bb11de709b61f2ddb2c15c43b3280574160aff692b435a1c4', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'auth/login-admin/index.html': {size: 94895, hash: 'fec365a1197b5b980811735442c23e1c18aed533e3e9a60f26ae87150f2cfec4', text: () => import('./assets-chunks/auth_login-admin_index_html.mjs').then(m => m.default)},
    'styles-FAXJSELC.css': {size: 25098, hash: 'uqOmfQGYf4k', text: () => import('./assets-chunks/styles-FAXJSELC_css.mjs').then(m => m.default)}
  },
};

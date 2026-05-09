
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
      "chunk-EK327WZM.js",
      "chunk-FEMV6SCU.js",
      "chunk-BAEXMWNY.js",
      "chunk-VJ3CIMRR.js",
      "chunk-DWDF5FHL.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-EK327WZM.js",
      "chunk-FEMV6SCU.js",
      "chunk-BAEXMWNY.js",
      "chunk-VJ3CIMRR.js",
      "chunk-DWDF5FHL.js"
    ],
    "route": "/auth/login-admin"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-K7RK2KEL.js",
      "chunk-UBKAKEA6.js",
      "chunk-MJKOYZLJ.js",
      "chunk-TJS24OOI.js",
      "chunk-VJ3CIMRR.js",
      "chunk-DWDF5FHL.js"
    ],
    "route": "/admin"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-K7RK2KEL.js",
      "chunk-UBKAKEA6.js",
      "chunk-MJKOYZLJ.js",
      "chunk-TJS24OOI.js",
      "chunk-VJ3CIMRR.js",
      "chunk-DWDF5FHL.js"
    ],
    "route": "/admin/coaches"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-K7RK2KEL.js",
      "chunk-UBKAKEA6.js",
      "chunk-MJKOYZLJ.js",
      "chunk-TJS24OOI.js",
      "chunk-VJ3CIMRR.js",
      "chunk-DWDF5FHL.js"
    ],
    "route": "/admin/coaches/edit-coach/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-K7RK2KEL.js",
      "chunk-UBKAKEA6.js",
      "chunk-MJKOYZLJ.js",
      "chunk-TJS24OOI.js",
      "chunk-VJ3CIMRR.js",
      "chunk-DWDF5FHL.js"
    ],
    "route": "/admin/booking"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-K7RK2KEL.js",
      "chunk-UBKAKEA6.js",
      "chunk-MJKOYZLJ.js",
      "chunk-TJS24OOI.js",
      "chunk-VJ3CIMRR.js",
      "chunk-DWDF5FHL.js"
    ],
    "route": "/admin/coupons"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-K7RK2KEL.js",
      "chunk-UBKAKEA6.js",
      "chunk-MJKOYZLJ.js",
      "chunk-TJS24OOI.js",
      "chunk-VJ3CIMRR.js",
      "chunk-DWDF5FHL.js"
    ],
    "route": "/admin/coupons/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-K7RK2KEL.js",
      "chunk-UBKAKEA6.js",
      "chunk-MJKOYZLJ.js",
      "chunk-TJS24OOI.js",
      "chunk-VJ3CIMRR.js",
      "chunk-DWDF5FHL.js"
    ],
    "route": "/admin/admins-list"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-K7RK2KEL.js",
      "chunk-UBKAKEA6.js",
      "chunk-MJKOYZLJ.js",
      "chunk-TJS24OOI.js",
      "chunk-VJ3CIMRR.js",
      "chunk-DWDF5FHL.js"
    ],
    "route": "/admin/admins-List/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-K7RK2KEL.js",
      "chunk-UBKAKEA6.js",
      "chunk-MJKOYZLJ.js",
      "chunk-TJS24OOI.js",
      "chunk-VJ3CIMRR.js",
      "chunk-DWDF5FHL.js"
    ],
    "route": "/admin/forbidden"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 3768, hash: '36a2a4539e542e590d5ad638d3c89c407a0cdb1e3a1e65a0129d52b1783ae2b2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1472, hash: 'e072b20306bb9e0c18df64f4422685f0d67a838c395866fd32361449365f65c5', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/index.html': {size: 36942, hash: '1c0b8621d87a4e3b1c30a2bfd133dcaba5ca131aa0166d8aece3e3c7b0ca403b', text: () => import('./assets-chunks/auth_index_html.mjs').then(m => m.default)},
    'auth/login-admin/index.html': {size: 94895, hash: '099269e515053863a193607053115ea5d292fd159daecbada0d15e6f1a0aad6b', text: () => import('./assets-chunks/auth_login-admin_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 94889, hash: '501e405788e13f1db3d6a10ace84716ecb4a61c6981d8538c80cba9c4e121cca', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'styles-LYHHMJGS.css': {size: 25131, hash: 'WY8qjkIA5CE', text: () => import('./assets-chunks/styles-LYHHMJGS_css.mjs').then(m => m.default)}
  },
};

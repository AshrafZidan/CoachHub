
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
      "chunk-S2AEVCHJ.js",
      "chunk-HM6PS3D6.js",
      "chunk-4AAJI7HO.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-S2AEVCHJ.js",
      "chunk-HM6PS3D6.js",
      "chunk-4AAJI7HO.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/auth/login-admin"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ECCJNLVF.js",
      "chunk-57M2STID.js",
      "chunk-AEDFS72Z.js",
      "chunk-5NN2NAF4.js",
      "chunk-OOFQO2P3.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/admin"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ECCJNLVF.js",
      "chunk-57M2STID.js",
      "chunk-AEDFS72Z.js",
      "chunk-5NN2NAF4.js",
      "chunk-OOFQO2P3.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/admin/coaches"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ECCJNLVF.js",
      "chunk-57M2STID.js",
      "chunk-AEDFS72Z.js",
      "chunk-5NN2NAF4.js",
      "chunk-OOFQO2P3.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/admin/coaches/edit-coach/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ECCJNLVF.js",
      "chunk-57M2STID.js",
      "chunk-AEDFS72Z.js",
      "chunk-5NN2NAF4.js",
      "chunk-OOFQO2P3.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/admin/coaches/add-coach"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ECCJNLVF.js",
      "chunk-57M2STID.js",
      "chunk-AEDFS72Z.js",
      "chunk-5NN2NAF4.js",
      "chunk-OOFQO2P3.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/admin/booking"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ECCJNLVF.js",
      "chunk-57M2STID.js",
      "chunk-AEDFS72Z.js",
      "chunk-5NN2NAF4.js",
      "chunk-OOFQO2P3.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/admin/coupons"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ECCJNLVF.js",
      "chunk-57M2STID.js",
      "chunk-AEDFS72Z.js",
      "chunk-5NN2NAF4.js",
      "chunk-OOFQO2P3.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/admin/coupons/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ECCJNLVF.js",
      "chunk-57M2STID.js",
      "chunk-AEDFS72Z.js",
      "chunk-5NN2NAF4.js",
      "chunk-OOFQO2P3.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/admin/admins-list"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ECCJNLVF.js",
      "chunk-57M2STID.js",
      "chunk-AEDFS72Z.js",
      "chunk-5NN2NAF4.js",
      "chunk-OOFQO2P3.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/admin/admins-List/create"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ECCJNLVF.js",
      "chunk-57M2STID.js",
      "chunk-AEDFS72Z.js",
      "chunk-5NN2NAF4.js",
      "chunk-OOFQO2P3.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/admin/reports"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ECCJNLVF.js",
      "chunk-57M2STID.js",
      "chunk-AEDFS72Z.js",
      "chunk-5NN2NAF4.js",
      "chunk-OOFQO2P3.js",
      "chunk-PJIANAUL.js",
      "chunk-Q55XNV6Z.js",
      "chunk-45OW2QD6.js"
    ],
    "route": "/admin/forbidden"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 3915, hash: '65f5ad957f52855b02bb8e56a5ac7f2d7b6587f2826b784ecfda12db4575abd7', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1472, hash: '3d3dfe8643bcf9fcd31bb4354b180b491932f1e7d2b39114f8c8cf19e5815119', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/index.html': {size: 37092, hash: '8ac710f50043a18f871180b0d415b27521053c09f287fececbf438c561ee4bbc', text: () => import('./assets-chunks/auth_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 95091, hash: 'b9e3b2ff5e267fbadd7a5bdf4216c3c22dfa3f2e1e7dfe05772c6ea7d4ee7afe', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'auth/login-admin/index.html': {size: 95097, hash: '39602078ba4a2558f4c055ed4f77b53c0853013da9db63b3e248290e2d39de1e', text: () => import('./assets-chunks/auth_login-admin_index_html.mjs').then(m => m.default)},
    'styles-2QB5QC57.css': {size: 26066, hash: 'FNennTXfIXs', text: () => import('./assets-chunks/styles-2QB5QC57_css.mjs').then(m => m.default)}
  },
};

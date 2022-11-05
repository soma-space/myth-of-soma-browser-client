System.config({
  "baseURL": "/SomaWebSocket",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "js/*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "babel": "npm:babel-core@5.6.1",
    "babel-runtime": "npm:babel-runtime@5.6.1",
    "core-js": "npm:core-js@0.9.18",
    "jquery": "github:components/jquery@2.1.4",
    "jquery-mousewheel": "npm:jquery-mousewheel@3.1.12",
    "text": "github:systemjs/plugin-text@0.0.2",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@5.6.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});


const path = require('path');
const fs = require('fs');

(function () {
  var baseUrlHack = (function () {
    const CH_PERIOD = 46;
    const existsCache = { d: 0 }; delete existsCache.d;
    const baseUrl = __dirname;
    const moduleProto = Object.getPrototypeOf(module);
    const origRequire = moduleProto.require;
    moduleProto.require = function (request) {
      let existsPath = existsCache[request];
      if (existsPath === undefined) {
        existsPath = request;
        if (!path.isAbsolute(request) && request.charCodeAt(0) !== CH_PERIOD) {
          const basedRequestTs = path.join(baseUrl, request + '.ts');
          const basedRequestJs = path.join(baseUrl, request + '.js');
          const basedIndexRequestTs = path.join(baseUrl, request, 'index.ts');
          const basedIndexRequestJs = path.join(baseUrl, request, 'index.js');
          if (fs.existsSync(basedRequestTs)) existsPath = basedRequestTs;
          else if (fs.existsSync(basedRequestJs)) existsPath = basedRequestJs;
          else if (fs.existsSync(basedIndexRequestTs)) existsPath = basedIndexRequestTs;
          else if (fs.existsSync(basedIndexRequestJs)) existsPath = basedIndexRequestJs;
          else existsPath = request;
        }
        existsCache[request] = existsPath;
      }
      try {
        return origRequire.call(this, existsPath);
      } catch (error) {
        throw error;
      }
    }
  });

  module.exports = baseUrlHack;
})()

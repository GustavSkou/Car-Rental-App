const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('wasm');
const rewriteRequestUrl = config.server.rewriteRequestUrl;

config.server.rewriteRequestUrl = (url) => {
  const rewrittenUrl = rewriteRequestUrl ? rewriteRequestUrl(url) : url;
  return rewrittenUrl === '/' ? '/index.html' : rewrittenUrl;
};

const enhanceMiddleware = config.server.enhanceMiddleware;

config.server.enhanceMiddleware = (middleware, server) => {
  const enhancedMiddleware = enhanceMiddleware
    ? enhanceMiddleware(middleware, server)
    : middleware;

  return (request, response, next) => {
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    return enhancedMiddleware(request, response, next);
  };
};

module.exports = config;

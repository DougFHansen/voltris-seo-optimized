const http = require('http');

// Testar algumas rotas
const routes = [
  '/exterior/servicos/formatacao',
  '/exterior/servicos/otimizacao-pc',
  '/exterior/servicos/correcao-erros'
];

routes.forEach(route => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: route,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`${route}: ${res.statusCode}`);
  });

  req.on('error', (error) => {
    console.error(`${route}: ${error.message}`);
  });

  req.end();
});
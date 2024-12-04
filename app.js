const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (_req, res) => res.type('html').send(html));

const WHITE_LIST = [
  'http://localhost:8080',
  'https://pages.git.autodesk.com'
];

app.get('/getToken', async (req, res) => {
  const origin = req.headers.origin;
  
  if (!WHITE_LIST.includes(origin)) {
    return res.status(403).send({success: false, error: 'Origin not allowed'});
  }
  
  const params = new URLSearchParams({
    client_id: '6ca76ff0-854d-4e2f-afaa-95372097eb88',
    client_secret: 'xLC8Q~dEh3NcAWNCkm89AbCvk73idIg5-8-zXbVF',
    grant_type: 'client_credentials',
    scope: 'https://cognitiveservices.azure.com/.default',
  });

  fetch(
    'https://login.microsoftonline.com/autodesk.onmicrosoft.com/oauth2/v2.0/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    }
  ).then((response) => response.json())
  .then((data) => {
    res.send({
      success: true,
      token: data
    });
  }).catch((error) => {
    res.send({success: false, error});
  });
});

app.get("/", (req, res) => res.type('html').send(html));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`

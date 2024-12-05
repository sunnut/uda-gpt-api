var CryptoJS = require("crypto-js");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 3001;

app.get("/", (_req, res) => res.type('html').send(html));

const allowlist = [
  'http://localhost:8080',
  'https://pages.git.autodesk.com'
];

app.get('/getToken', cors(), (req, res) => {
  if (!allowlist.includes(req.headers.origin)) {
    return res.status(403).send({success: false, error: 'Unauthorized domain'});
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

const udaMessages = [
  "if a user wants to know basic info or introduction about uda, reply with {\"type\":\"intro\"}",
  "if a user wants to contact uda, reply with {\"type\":\"contact\"}",
  "if a user wants to use uda quickly, reply with {\"type\":\"quickstarts\"}",
  "if a user wants to create uda project, reply with {\"type\":\"cua\"}",
  "if a user asks for an example of something, reply with {\"type\":\"lowercase of the thing name that removes the 'igation' at the end if it exists\"}",
  "if a user wants to query or search hub data, reply with {\"type\":\"query\",\"payload\":{\"content\":\"hub\"}}",
  "if a user wants to query or search project data, reply with {\"type\":\"query\",\"payload\":{\"content\":\"project\",\"hub\":\"the hub name provided if it exists\",\"keyword\":\"the keyword used to search if it exists\"}}",
  "if a user wants to query or search file or folder data, reply with {\"type\":\"query\",\"payload\":{\"isGranular\":\"(search is granular type ? true : false)\",\"content\":\"fileFolder\",\"range\":\"query or search both 'file' and 'folder' ? all : (only file ? File : Folder)\",\"sortBy\":\"the name sorted by if exists\",\"sortOrder\":\"the expected sort order is descending ? desc : asc if exists\",\"hubName\":\"the hub name provided if it exists\",\"projectName\":\"the project name provided if it exists\",\"folderName\":\"the folder name provided if it exists\",\"keyword\":\"the keyword used to search if it exists\",\"timeRange\":\"is today ? today : days of the time range provided if it exists\",\"fileTypes\":\"The filtered file type array provided if it exists\"}}",
  "if a user wants to create a folder, reply with {\"type\":\"operate\",\"payload\":{\"content\":\"create\",\"hubName\":\"the hub name provided if it exists\",\"projectName\":\"the project name provided if it exists\",\"folderName\":\"the parent folder name provided if it exists\",\"newName\":\"the name of the folder to be created if it exists\"}",
  "if a user wants to rename a file or folder, reply with {\"type\":\"operate\",\"payload\":{\"content\":\"rename\",\"hubName\":\"the hub name provided if it exists\",\"projectName\":\"the project name provided if it exists\",\"oldName\":\"the name of the file or folder to be renamed if it exists\",\"newName\":\"the new name of the file or folder to be renamed if it exists\"}"
];

app.options('/adsk/uda/openai', cors({
  credentials: true,
}));

app.post('/adsk/uda/openai', cors(), (req, res) => {
  const authheader = req.headers.authorization;

  if (!authheader) {
    return res.status(403).send({success: false, error: 'Unauthorized'});
  }

  const payload = req.body;

  if (!payload) {
    return res.status(400).send({success: false, error: 'Bad Request'});
  }

  const { messages } = payload;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).send({success: false, error: 'Bad messages'});
  }

  payload.messages = [
    ...udaMessages.map((msg) => ({
      role: 'user',
      content: `Pls note that ${msg}`
    })),
    ...messages
  ];

  fetch(
    'https://cog-sandbox-dev-westus3-001.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-01',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authheader
      },
      body: JSON.stringify(payload)
    }
  ).then((response) => response.json())
  .then((data) => {
    if (data.error) {
      return res.send({success: false, error: data.error});
    } else {
      res.send({
        success: true,
        answer: CryptoJS.AES.encrypt(data.choices[0].message.content, 'udagpt_key').toString(),
      });
    }
  }).catch((error) => {
    res.send({success: false, error});
  });
});

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

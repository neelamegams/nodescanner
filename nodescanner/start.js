const express = require('express');
const DeviceDetector = require('node-device-detector');
const ClientHints = require('node-device-detector/client-hints')

// init app
const deviceDetector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});
const clientHints = new ClientHints;

const app = express();
const port = 3001;
let os = [];

const hasBotResult = (result) => {
  return result && result.name;
}

// create middleware
const middlewareDetect = (req, res, next) => {
  const useragent = req.headers['user-agent']; 
  const clientHintsData = clientHints.parse(res.headers);

  req.useragent = useragent;
  req.device = deviceDetector.detect(useragent, clientHintsData);
  req.bot = deviceDetector.parseBot(useragent);
  next();
};

// attach middleware
app.use(middlewareDetect);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// // create test route
// app.get('/', (req, res) => {
//    let useragent = req.useragent;
//    let detectResult = req.device;
//    let botResult = req.bot;
//    //res.send(JSON.stringify({useragent, detectResult, botResult, isBot: hasBotResult(botResult)}));
//    console.log(JSON.stringify({useragent, detectResult, botResult, isBot: hasBotResult(botResult)}));
//    res.send(detectResult["os"].name);
// })

app.post('/done', (req, res) => {
  let useragent = req.useragent;
  let detectResult = req.device;
  let botResult = req.bot;
  //res.send(JSON.stringify({useragent, detectResult, botResult, isBot: hasBotResult(botResult)}));
  //console.log(JSON.stringify({useragent, detectResult, botResult, isBot: hasBotResult(botResult)}));
  //res.send(detectResult["os"].name);
  os.push(detectResult["os"].name);
  console.log("pushing to OS array", os);
  res.sendFile(__dirname + '/thankyou.jpeg');
});

app.get('/api', (req, res) => {
  console.log("showing from OS array", os);
  res.json(os);
});

app.get('/reset', (req, res) => {
  os = [];
  console.log("Emptying from OS array", os);
  res.json(os);
});

app.get('/image', (req, res) => {
  res.sendFile(__dirname + '/thankyou.jpeg');
});

app.listen(port, () => {
  console.log('server listen port %s', port);
})

//------1st------
// const express = require('express');
// const app = express();

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

// const port = process.env.PORT || 3000;
// app.listen(port, function () {
//   console.log('myapp listening on port ' + port);
// });


//----2nd-----
// commonJS
// const DeviceDetector = require('node-device-detector');
// // // or ESModule
// // import DeviceDetector from "node-device-detector";
// const express = require('express');
// const app = express();


// const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
// const detector = new DeviceDetector({
//   clientIndexes: true,
//   deviceIndexes: true,
//   deviceAliasCode: false,
// });

// app.get('/', function (req, res) {
//   const result = detector.parseOs(userAgent/*, clientHintData*/);
//   console.log('Result parse os', result);  
//   res.send(result.name);
// });

// const port = process.env.PORT || 3000;
// app.listen(port, function () {
//   console.log('myapp listening on port ' + port);
// });
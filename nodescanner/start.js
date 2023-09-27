// const express = require('express');
// const app = express();

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

// const port = process.env.PORT || 3000;
// app.listen(port, function () {
//   console.log('myapp listening on port ' + port);
// });

// commonJS
const DeviceDetector = require('node-device-detector');
// // or ESModule
// import DeviceDetector from "node-device-detector";
const express = require('express');
const app = express();


const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

app.get('/', function (req, res) {
  const result = detector.parseOs(userAgent/*, clientHintData*/);
  console.log('Result parse os', result);  
  res.send(result.name);
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});
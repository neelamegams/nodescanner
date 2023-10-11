const express = require('express');
const DeviceDetector = require('node-device-detector');
const ClientHints = require('node-device-detector/client-hints')
const cors = require('cors');
const { nanoid }  = require('nanoid')
const allplayersjson = require('./players_fullset.json');

// init app
const deviceDetector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});
const clientHints = new ClientHints;
const app = express();
let os = [];
var count = 0;

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

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/colors', (req, res) => {
  res.sendFile(__dirname + '/colors.html');
});



app.post('/done', (req, res) => {
  let useragent = req.useragent;
  let botResult = req.bot;
  let detectResult = req.device;
  let osName = detectResult["os"].name || "automatedOS";
  let clientName = detectResult["client"].type + ":" + detectResult["client"].name || "automatedClient";
  let deviceName = detectResult["device"].brand + ":" + detectResult["device"].model || "automatedDevice";
  //res.send(JSON.stringify({useragent, detectResult, botResult, isBot: hasBotResult(botResult)}));
  //console.log(JSON.stringify({useragent, detectResult, botResult, isBot: hasBotResult(botResult)}));
  //res.send(detectResult["os"].name);
  console.log(clientName + " - " + deviceName);
  count++;
  os.push({"visitorId": nanoid(5), "osName": osName, "count": count});
  console.log("pushing to OS array", os);
  res.sendFile(__dirname + '/thankyou.jpeg');

});

app.get('/api', (req, res) => {
  console.log("showing from OS array", os);
  res.json(os);
});

//https://buildgame.cfapps.eu11.hana.ondemand.com/players?country_name=India&fullname=Kuldeep Singh
function getPlayerByCountryAndFullname(playerCountryParam, playerFullnameParam){
  let matched = false;
  let matchedPlayer = [];
  allplayersjson.forEach((element) => {
    player_country = element.country_name; 
    player_fullname = element.fullname;
    if (player_country == playerCountryParam & player_fullname == playerFullnameParam) {
      console.log(element);
      matchedPlayer.push(element);
    }
  });
  return matchedPlayer;
}

app.get('/players', (req, res) => {
  var topentries = req.query.top;
  var country_name = req.query.country_name;
  var fullname = req.query.fullname;
  var playersjson = allplayersjson;
  
  if(topentries){
    playersjson = [];
    playersjson = allplayersjson.slice(0, topentries); //return only the sliced players if top is provided
  }

  if(country_name != undefined && fullname != undefined){
    playersjson = [];
    playersjson = getPlayerByCountryAndFullname(country_name, fullname);
  }

  res.json(playersjson); //return all players if "top" is not provided
})

function getPlayerById(playerID){
  let matched = false;
  let matchedPlayer = [];
  allplayersjson.forEach((element) => {
    player_id = element.id; 
    if (player_id == playerID & !matched) {
      console.log(element);
      matched = true;
      matchedPlayer.push(element);
    }
  });
  return matchedPlayer;
}


app.get('/players/:playerid', (req, res) => {
  const playerDetails = getPlayerById(req.params.playerid);
  console.log(playerDetails);
  res.json(playerDetails);
});



app.get('/reset', (req, res) => {
  os = [];
  console.log("Emptying from OS array", os);
  res.json(os);
});

app.get('/image', (req, res) => {
  res.sendFile(__dirname + '/thankyou.jpeg');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('server listen port %s', port);
});

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
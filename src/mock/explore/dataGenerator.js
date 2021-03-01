let mockData = require('./mockData.json')
let trackData = require('./mockTrack.json')
let zoneData = require('./mockZone.json')
let _ = require('lodash')
let fs = require('fs')

let trackWasteData = [];
let zoneWasteData = [];

for(let i=0; i<mockData.length; i++){
  const max1 = (trackData.length)-1;
  const index1 = _.random(0,max1);
  const max2 = (trackData[index1].trackCheckpoints.length)-1;
  const index2 = _.random(0,max2);
  trackWasteData.push({
    identifier:mockData[i].identifier,
    trackRef:trackData[index1].trackId,
    trackName:trackData[index1].trackName,
    trackCheckpointRef:trackData[index1].trackCheckpoints[index2].identifier,
    category:mockData[i].category,
    amount:mockData[i].amount});
}
for(let i=0; i<mockData.length; i++){
  const max1 = (zoneData.length)-1;
  const index1 = _.random(0,max1);
  zoneWasteData.push({
    identifier:mockData[i].identifier,
    zoneRef:zoneData[index1].zoneId,
    zoneName:zoneData[index1].zoneName,
    category:mockData[i].category,
    amount:mockData[i].amount});
}

fs.writeFile('./mockTrackWaste.json',JSON.stringify(trackWasteData), "utf8",function (err) {
  if (err) throw err;
  console.log('Saved!');
}); 

fs.writeFile('./mockZoneWaste.json',JSON.stringify(zoneWasteData), "utf8", function (err) {
  if (err) throw err;
  console.log('Saved!');
}); 
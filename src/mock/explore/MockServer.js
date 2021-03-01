const _ = require('lodash');
const trackData = require('./mockTrack.json');
const zoneData = require('./mockZone.json');
const trackWasteData = require('./mockTrackWaste.json');
const zoneWasteData = require('./mockZoneWaste.json');
const workData  = require("./mockWork.json");
const collectorData = require("./mockCollector.json");
const vehicleData = require("./mockVehicle.json");

export const trackContains  = (td, query) => {
  if(_.includes(td.trackName,query)){
    return true;
  }
  return false;
}
export const zoneContains  = (zd, query) => {
  if(_.includes(zd.zoneName, query) ){
    return true;
  }
  return false;
}

export const getObjects = (query = "") => {
  return new Promise((resolve, reject) => {
    if (query.length === 0) {
      const trackDataResult = trackData;
      const zoneDataResult = zoneData;
      resolve({trackDataResult, zoneDataResult});
    } else {
      const formattedQuery = query.toLowerCase();
      const trackDataResult = _.filter(trackData, td => {
        return trackContains(td, formattedQuery);
      });
      const zoneDataResult = _.filter(zoneData, zd => {
        return zoneContains(zd, formattedQuery);
      });
      resolve({trackDataResult,zoneDataResult});
    }
  });
}

export const chipsFilter = (type, query) => {
  let geoObjectResult = {};
  let resultTrack = [];
  let resultZone = [];
  if(type == "waste condition"){
    const fullTrackData = processChipsByWasteConditon(trackData, query);
    const fullZoneData = processChipsByWasteConditon(zoneData, query);
    if(fullTrackData.length != 0){
      fullTrackData.map((ftd) => {
        const {trackId, trackPoints} = ftd;
        resultTrack.push({trackId, trackPoints});
      });
    }
    if(fullZoneData.length != 0){
      fullZoneData.map((fzd) => {
        const {zoneId, zonePoints} = fzd;
        resultZone.push({zoneId, zonePoints});
      });
    }
  }else if(type == "work status"){
    if(query == "no work"){
      resultTrack = [...resultTrack, ...trackContainsWorkId(trackData, "no work")];
      resultZone = [...resultZone, ...zoneContainsWorkId(zoneData, "no work")];
    }else{
      const fullWorkData = _.filter(workData, (wd) => {
        if(query == wd.workStatus){
          return true;
        }
        return false;
      });
      let resultWorkId = [];
      if(fullWorkData.length != 0){
        fullWorkData.map((fwd) => {
          const {id} = fwd;
          resultWorkId.push(id);
        });
      }
      if(resultWorkId.length != 0){
        resultWorkId.map((wid) => {
          resultTrack = [...resultTrack, ...trackContainsWorkId(trackData, wid)];
          resultZone = [...resultZone, ...zoneContainsWorkId(zoneData, wid)];
        });
      }
    }
  }
  geoObjectResult["resultTrack"] = resultTrack;
  geoObjectResult["resultZone"] = resultZone;
  return new Promise((resolve, reject) => {
    resolve(geoObjectResult);
  });
}
function processChipsByWasteConditon(geoObjectData, query){
  const fullData = _.filter(geoObjectData, (god) => {
    if(_.includes(god.wasteCondition, query)){
      return true;
    }
    return false;
  });
  return fullData;
}
function trackContainsWorkId(geoObjectData, query){
  const fullData = _.filter(geoObjectData, (god)=>{
    if(_.includes(god.workId, query)){
      return true;
    }
    return false;
  });
  const resultGeoObjectId = [];
  if(fullData.length != 0){
    fullData.map((fd)=>{
      const {trackId, trackPoints} = fd;
      resultGeoObjectId.push({trackId, trackPoints});
    });
  }
  return resultGeoObjectId;
}
function zoneContainsWorkId(geoObjectData, query){
  const fullData = _.filter(geoObjectData, (god)=>{
    if(_.includes(god.workId, query)){
      return true;
    }
    return false;
  });
  const resultGeoObjectId = [];
  if(fullData.length != 0){
    fullData.map((fd)=>{
      const {zoneId, zonePoints} = fd;
      resultGeoObjectId.push({zoneId, zonePoints});
    });
  }
  return resultGeoObjectId;
}

export const getWorkData = ( geoObjectId, workDataOf, infoType) => {
  if(infoType == "summary"){
    let fullWorkData = []; 
    let workSummary = {};
    let collectorSummary = {};
    let vehicleSummary = {};

    if(workDataOf == "track"){
      fullWorkData = _.filter(workData, (work) => {
        let isGeoObjectPresent = false;
        work.geoObjectTrackId.map((id)=>{
          if (id == geoObjectId){
            isGeoObjectPresent = true;
          };
        });
        return isGeoObjectPresent;
      });
    }else if(workDataOf == "zone"){
      fullWorkData = _.filter(workData, (work) => {
        let isGeoObjectPresent = false;
        work.geoObjectZoneId.map((id)=>{
          if(id == geoObjectId){
            isGeoObjectPresent = true;
          };
        });
        return isGeoObjectPresent;
      });
    }
    if(fullWorkData.length != 0){
      workSummary = processWorkData(fullWorkData[0], infoType);
      collectorSummary = processCollectorData(collectorData, workSummary.collectorId, infoType);
      vehicleSummary = processVehicleData(vehicleData, workSummary.vehicleId, infoType);
      workSummary = {...workSummary, collectorSummary, vehicleSummary};
    }
    return new Promise((resolve, reject) => {
      resolve({workSummary});
    });
  }
}
function processWorkData(fullWorkData, infoType){
  if(infoType == "summary"){
    const {id, collectorId, vehicleId, workType, workStatus} = fullWorkData;
    const workSummary = {id, collectorId, vehicleId, workType, workStatus};
    return workSummary;
  }
}
function processCollectorData(collectorData, collectorId, infoType){
  if(infoType == "summary"){
    const fullCollectorData = _.filter(collectorData, (c)=>{
      let isCollectorPresent = false;
      if(c.id == collectorId){
        isCollectorPresent = true;
      };
      return isCollectorPresent;
    });
    let collectorSummary = {};
    if(fullCollectorData.length != 0){
      const {firstName, lastName} = fullCollectorData[0];
      collectorSummary["collectorName"] = firstName + lastName;
    }
    return collectorSummary;
  }
}
function processVehicleData(vehicleData, vehicleId, infoType){
  if(infoType == "summary"){
    const fullVehicleData = _.filter(vehicleData, (c)=>{
      let isVehiclePresent = false;
      if(c.id == vehicleId){
        isVehiclePresent = true;
      };
      return isVehiclePresent;
    });
    let vehicleSummary = {};
    if(fullVehicleData.length != 0){
      const {plateNumber} = fullVehicleData[0];
      vehicleData["plateNumber"] = plateNumber;
    }
    return vehicleSummary;
  }
}
export const getWasteData = async(wasteDataOf, ref) => {
  let result = null;
  switch(wasteDataOf){
    case "track":
      result = await getTrackWasteData(ref);
      return result;
    case "zone":
      result = await getZoneWasteData(ref);
      return result;
    default:
      return result;
  }
}

const getTrackWasteData = (trackRef) => {
  //filtering array by track Ref
  filterByTrackID = _.filter(trackWasteData, (t) => {return t.trackRef == trackRef});
  //getting total waste amount by category from given track
  const totalWasteSummary = trackWasteDataProcessor(filterByTrackID, "totalWasteSummary");
  //array for holding references to all occupied checkPoints of a given track
  let checkpointReferences = [];
  //extracting track checkPoint references
  filterByTrackID.map((t) => checkpointReferences.push(t.trackCheckpointRef));
  //removing duplicate checkPoint references
  checkpointReferences = _.clone(_.uniq(checkpointReferences));
  //getting waste summary of all occupied checkPoint of a given track
  const allCheckpointWasteSummary = trackWasteDataProcessor(filterByTrackID, "allCheckpointWasteSummary", checkpointReferences);
  return new Promise((resolve, reject) => {
    resolve({totalWasteSummary, allCheckpointWasteSummary});
  });
}

const trackWasteDataProcessor = (wasteData, ref, checkpointReferences = []) => {
  //total Waste Summary
  if(ref == "totalWasteSummary"){
    let data = _.cloneDeep(wasteData);
    let categories = [];
    let catWithAmount = {};
    //extracting categories
    data.map((d) => categories.push(d.category));
    //removing duplicate categories
    categories = _.clone(_.uniq(categories));
    //creating array with categories and amount
    categories.map((c) => {catWithAmount[c] = 0});
    //summing up amount of same category
    data.map((d) => {
      catWithAmount[d.category] += d.amount;
    });
    return catWithAmount;

  }else if(ref == "allCheckpointWasteSummary" && checkpointReferences.length != 0){
    const allCheckpointWasteSummary = [];
    checkpointReferences.map((cpRef) => {
      const temp = _.cloneDeep(wasteData);
      let data = _.filter(temp, (t) => {return t.trackCheckpointRef == cpRef});
      //console.log("data from trackWasteDataProcessor: ",data);
      let categories = [];
      let catWithAmount = {};
      let result = {trackCheckpointRef:cpRef};
      //extracting categories
      data.map((d) => categories.push(d.category));
      //removing duplicate categories
      categories = _.cloneDeep(_.uniq(categories));
      //creating array with categories and amount
      categories.map((c) => {catWithAmount[c] = 0});
      //summing up amount of same category
      data.map((d) => {
        let index = d.category;
        catWithAmount[index] += d.amount;
      });
      result.wasteSummary = catWithAmount;
      allCheckpointWasteSummary.push(result);
    });
    return allCheckpointWasteSummary;
  }
}

const getZoneWasteData = (zoneRef) => {
  //filtering array by zone Ref
  filterByZoneID = _.filter(zoneWasteData,(z) => {return z.zoneRef == zoneRef});
  //getting total waste amount by category from given zone
  const totalWasteSummary = zoneWasteDataProcessor(filterByZoneID, "totalWasteSummary");  
  return new Promise((resolve, reject) => {
    resolve({totalWasteSummary});
  });
}

const zoneWasteDataProcessor = (wasteData, ref) => {
  //total Waste Summary
  if(ref == "totalWasteSummary"){
    let data = _.cloneDeep(wasteData);
    let categories = [];
    let catWithAmount = {};
    //extracting categories
    data.map((d) => categories.push(d.category));
    //removing duplicate categories
    categories = _.clone(_.uniq(categories));
    //creating array with categories and amount
    categories.map((c) => {catWithAmount[c] = 0});
    //summing up amount of same category
    data.map((d) => {
      let index = d.category;
      catWithAmount[index] += d.amount;
    });
    return catWithAmount;
  }
}


// const main = async() => {
//   let result = null;
//   let testData = [{wasteDataOf:'track',ref:'1594548355362.0.8542844882567979'},{wasteDataOf:'zone',ref:'1594548407730.0.0666919222900284'}];
//   for(let i=0; i<testData.length; i++){
//     result = await getWasteData(testData[i].wasteDataOf,testData[i].ref);
//     const {totalWasteSummary, allCheckpointWasteSummary} = result;
//     console.log("Total waste summary : ",totalWasteSummary);
//     console.log("All checkpoint waste summary: ",allCheckpointWasteSummary);
//   }
// }

// main();
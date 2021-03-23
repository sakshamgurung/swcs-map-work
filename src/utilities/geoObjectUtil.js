const _ = require('lodash');
const trackData = require('mock/explore/mockTrack.json');
const zoneData = require('mock/explore/mockZone.json');
const trackWasteData = require('mock/explore/mockTrackWaste.json');
const workData  = require("mock/explore/mockWork.json");
const collectorData = require("mock/explore/mockCollector.json");
const vehicleData = require("mock/explore/mockVehicle.json");

export const trackContains  = (trackData, query) => {
  if(_.includes(trackData.trackName,query)){
    return true;
  }
  return false;
}
/**
 * get all geoObjects
 */
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
      resolve({trackDataResult});
    }
  });
}

/**
 * chips filter
 */
export const chipsFilter = (type, query) => {
  let geoObjectResult = {};
  let resultTrack = [];
  if(type == "waste condition"){
    const fullTrackData = processChipsByWasteConditon(trackData, query);
    if(fullTrackData.length != 0){
      fullTrackData.map((ftd) => {
        const {trackId, trackPoints} = ftd;
        resultTrack.push({trackId, trackPoints});
      });
    }

  }else if(type == "work status"){
    if(query == "no work"){
      resultTrack = [...resultTrack, ...trackContainsWorkId(trackData, "no work")];
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
        });
      }
    }
  }
  geoObjectResult["resultTrack"] = resultTrack;
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

/**
 * work filter
 */
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

/**
 * waste filter
 */
export const getWasteData = async(wasteDataOf, ref) => {
  let result = null;
  switch(wasteDataOf){
    case "track":
      result = await getTrackWasteData(ref);
      return result;
    default:
      return result;
  }
}

const getTrackWasteData = (trackRef) => {
  //filtering array by track Ref
  filterByTrackID = _.filter(trackWasteData, (t) => {return t.trackRef == trackRef});
  //getting total waste amount by category from given track
  const totalWasteSummary = trackWasteDataProcessor(filterByTrackID);
  return new Promise((resolve, reject) => {
    resolve({totalWasteSummary});
  });
}

const trackWasteDataProcessor = (wasteData) => {
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
}
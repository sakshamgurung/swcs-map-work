let _ = require('lodash');
let trackData = require('./trackMockData.json');
let zoneData = require('./zoneMockData.json');
let trackWasteData = require('./mockTrackWaste.json');
let zoneWasteData = require('./mockZoneWaste.json');

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
      const trackDataResult = _.cloneDeep(trackData);
      const zoneDataResult = _.cloneDeep(zoneData);
      resolve({trackDataResult, zoneDataResult});
    } else {
      const formattedQuery = query.toLowerCase();
      const trackDataResult = _.cloneDeep( _.filter(trackData, td => {
        return trackContains(td, formattedQuery);
      }));
      const zoneDataResult = _.cloneDeep(_.filter(zoneData, zd => {
        return zoneContains(zd, formattedQuery);
      }));
      resolve({trackDataResult,zoneDataResult});
    }
  });
}

// export const getWasteData = () => {
//   return new Promise((resolve, reject) => {
//     resolve(wasteData);
//   });
// }

export const getTrackWasteData = (trackRef) => {
  //filtering array by track trackRef
  filterByTrackID = _.filter(trackWasteData,(t) => {return t.trackRef == trackRef});
  //getting total waste amount by category from given track
  const totalWasteSummary = {trackRef:trackRef};
  totalWasteSummary.totalWasteSummary = trackWasteDataProcessor(filterByTrackID, "1");
  //array for holding references to all occupied checkPoints of a given track
  let checkPointReferences = [];
  //extracting track checkPoint references
  filterByTrackID.map((t) => checkPointReferences.push(t.trackCheckPointRef));
  //removing duplicate checkPoint references
  checkPointReferences = _.clone(_.uniq(checkPointReferences));
  //getting waste summary of all occupied checkPoint of a given track
  const allCheckPointWasteSummary = trackWasteDataProcessor(filterByTrackID, "2", checkPointReferences);
  return new Promise((resolve, reject) => {
    resolve({totalWasteSummary, allCheckPointWasteSummary});
  });
}

const trackWasteDataProcessor = (wasteData, ref, checkPointReferences = []) => {
  if(ref == "1"){
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

  }else if(ref == "2" && checkPointReferences.length != 0){
    const allCheckPointWasteSummary = [];
    checkPointReferences.map((cpRef) => {
      const temp = _.cloneDeep(wasteData);
      let data = _.filter(temp, (t) => {return t.trackCheckPointRef == cpRef});
      //console.log("data from trackWasteDataProcessor: ",data);
      let categories = [];
      let catWithAmount = {};
      let result = {trackCheckPointRef:cpRef};
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
      allCheckPointWasteSummary.push(result);
    });
    return allCheckPointWasteSummary;
  }
}

const getZoneWasteData = () => {
  return new Promise((resolve, reject) => {
    resolve(zoneWasteData);
  });
}

// const main = async() => {
//   const result = await getTrackWasteData('1594548355362.0.8542844882567979');
//   const {totalWasteSummary, allCheckPointWasteSummary} = result;
//   console.log("Total waste summary : ",totalWasteSummary);
//   console.log("All checkpoint waste summary: ",allCheckPointWasteSummary);
// }

// main();
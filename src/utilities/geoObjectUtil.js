const _ = require('lodash');

export const trackContains  = (trackData, query) => {
  return _.includes(trackData.trackName.toLowerCase(), query);
}
/**
 * get all geoObjects
 */
export const getObjects = async(query = "", getState) => {
  if (query.length != 0) {
    const state = getState().explore;
    const formattedQuery = query.toLowerCase();
    const trackDataResult = _.filter(state.track, t => {
      return trackContains(t, formattedQuery);
    });
    return trackDataResult;
  }
}

/**
 * chips filter
 */
export const chipsFilter = (type, query, workData, getState) => {
  let geoObjectResult = {};
  let resultTrack = [];
  const state = getState().explore;

  if(type == "waste condition"){
    const matchedTrack = _.filter(state.track, t => (t.wasteCondition == query));
    matchedTrack.map((t) => {
      resultTrack.push( _.pick(t, ["_id", "trackPoints"]) );
    });
  }else if(type == "work status"){
    if(query == "no work"){
      resultTrack = trackContainsWorkId(state.track, "no work");
    }else{
      let resultWorkId = [];
      workData.map((w) => {
        resultWorkId.push(w._id);
      });
      
      resultWorkId.map((wid) => {
        resultTrack = [...resultTrack, ...trackContainsWorkId(state.track, wid)];
      });
    }
  }

  geoObjectResult["resultTrack"] = resultTrack;
  return geoObjectResult;
}

function trackContainsWorkId(geoObjectData, workId){
  const fullData = _.filter(geoObjectData, god => {
    if(workId == "no work"){
      if(god.hasOwnProperty("workId") && god.workId == ""){
        return true;
      }else if(!god.hasOwnProperty("workId")){
        return true;
      }
      return false;
    }
    return (god.workId == workId);
  });

  const resultGeoObjectId = [];
  fullData.map( fd => {
    resultGeoObjectId.push( _.pick(fd, ["_id", "trackPoints"]) );
  });
  
  return resultGeoObjectId;
}

/**
 * explore screen infoEditFooter
 */
export const processInfoEditFooterData = (workData, wasteData, staffGroupData, vehicleData, dataOf  ) => {
  const totalWasteSummary = processWasteData(wasteData);
  const result = {};

  // if(!_.isEmpty(workData)){
  //   result["workSummary"] = workData[0];
  // }
  
  if(!_.isEmpty(staffGroupData)){
    result["groupName"] = staffGroupData.groupName;
  }
  if(!_.isEmpty(vehicleData)){
    result["plateNo"] = vehicleData.plateNo;
  }
  if(!_.isEmpty(totalWasteSummary)){
    result["totalWasteSummary"] = totalWasteSummary;
  }
  return result;
}

const processWasteData = (wasteData) => {
    let data = _.cloneDeep(wasteData);
    let wasteList = [];
    let wasteListWithAmount = {};
    //extracting wasteList
    data.map(d => wasteList.push(d.wasteListId));
    //removing duplicate wasteList
    wasteList = _.uniq(wasteList);
    //creating array with wasteList and amount
    wasteList.map((wl) => {wasteListWithAmount[wl] = 0});
    //summing up amount of same category
    data.map(d => {
      wasteListWithAmount[d.wasteListId] += calCurrentAmtInKg(0, d.amountUnit, d.amount);
    });
    return wasteListWithAmount;
}

function calCurrentAmtInKg(currentAmount, amountUnit, amount){
  if(amountUnit == "kg" || amountUnit == "litre"){
      currentAmount += amount;
  }else if(wd.amountUnit == "bora"){
      currentAmount = currentAmount + ( amount * 15);//conversion from bora to 15 kg
  }
  return currentAmount;
}
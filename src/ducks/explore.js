import {getObjects, getWorkData, getWasteData, chipsFilter} from "../mock/explore/MockServer";
import axios from 'axios';

import _ from "lodash";
//types
export const types = {
  LOCATION_GRANTED:"explore/locationGranted",
  LOCATION_DENIED:"expolore/locationDenied",
  REGION_CHANGED:"explore/regionChanged",

  MARKER_SELECTED:"explore/markerChanged",
  TRACK_SELECTED:"explore/trackSelected",
  ZONE_SELECTED:"explore/zoneSelected",
  DISMISS_SELECTED_GEO_OBJECT:"explore/dismissSelectedGeoObject",

  CHIPS_SELECTED:"explore/chipsSelected",

  SEARCH_CHANGED:"explore/searchChanged",
  NAME_MODAL_CHANGED:"explore/nameModalChanged",
  TOGGLE_NAME_MODAL:"explore/toggleNameModal",
  
  TOGGLE_SEARCH_BOX:"explore/toggleSearchBox",
  QUERY_CHANGED:"explore/trackQueryChanged",

  LOAD_GEO_OBJECTS:"explore/loadGeoObjects",
  LOAD_GEO_OBJECTS_SUCCESS:"explore/loadGeoObjectsSuccess",
  LOAD_GEO_OBJECTS_FAILURE:"explore/loadGeoObjectsFailure",
  
  LOAD_GEO_OBJECTS_WORK:"explore/loadGeoObjectsWork",
  LOAD_GEO_OBJECTS_WORK_SUCCESS:"explore/loadGeoObjectsWorkSuccess",
  LOAD_GEO_OBJECTS_WORK_FAILURE:"explore/loadGeoObjectsWorkFailure",
  
  LOAD_GEO_OBJECTS_WASTE:"explore/loadGeoObjectsWaste",
  LOAD_GEO_OBJECTS_WASTE_SUCCESS:"explore/loadGeoObjectsWasteSuccess",
  LOAD_GEO_OBJECTS_WASTE_FAILURE:"explore/loadGeoObjectsWasteFailure",
  
  SHOW_DEFAULT_PANEL:"explore/showDefalutPanel",
  SHOW_TRACK_PANEL_1:"explore/showTrackPanel1",
  SHOW_TRACK_PANEL_2:"explore/showTrackPanel2",
  SHOW_ZONE_PANEL:"explore/showZonePanel",
  
  CANCEL_TRACK_PANEL_2:"explore/cancelTrackPanel2",
  DONE_TRACK_PANEL_2:"explore/doneTrackPanel2",
  CANCEL_ZONE_PANEL:"explore/cancelZonePanel",
  DONE_ZONE_PANEL:"explore/doneZonePanel",


  TOGGLE_NAME_MODAL:"explore/toggleNameModal",
  TOGGLE_MAP_SEARCH:"explore/toggleMapSearch",
  TOGGLE_TRACK_PANELS:"explore/toggleTrackPanels",
  CANCEL_NAME_MODAL:"explore/cancelNameModal",

  ADD_ZONE_POINT:"explore/addZonePoint",
  DELETE_ZONE_POINT:"explore/deleteZonePoint",
  ADD_ZONE:"explore/addZone",
  
  ADD_TRACK_POINT:"explore/addTrackPoint",
  DELETE_TRACK_POINT:"explore/deleteTrackPoint",
  ADD_TRACK:"explore/addTrack",
  CHECKPOINTS_PROCESSED:"explore/checkpointsProcessed",
  INTERVAL_CHANGED:"explore/intervalChanged",
}
//initial states
export const initialState = {
  categories: [
    {
      name: 'low waste', query:'low', id: 'c1', type: 'waste condition'
    },
    {
      name: 'medium waste', query:'medium', id: 'c2', type: 'waste condition'
    },
    {
      name: 'high waste', query:'high', id: 'c3', type: 'waste condition'
    },
    {
      name: 'work unconfirmed', query:'unconfirmed', id: 'c4', type: 'work status'
    },
    {
      name: 'work assigned', query:'assigned', id: 'c5', type: 'work status'
    },
    {
      name: 'work on progress', query:'on progress', id: 'c6', type: 'work status'
    },
    {
      name: 'no work', query:'no work', id: 'c7', type: 'work status'
    }
  ],
  region: {},
  errorInfo:"",
  hasMapPermission:false,
  mapSearchVisible:true,
  mapSearchFocused:false,
  searchQuery:"",
  showDefaultPanel:true,
  showZonePanel:false,
  showTrackPanel1:false,
  showTrackPanel2:false,
  nameModalVisible:false,
  nameModalValue:"",
  zone:[],
  zonePoints:[],
  queryZone:[],
  fullQueryZone:[],
  track:[],
  trackPoints:[],
  trackCheckpoints:[],
  interval:150,
  queryTrack:[],
  fullQueryTrack:[],
  currentMarkerId:"",
  selectedTrackIndex:-1,
  selectedZoneIndex:-1,
  workData:{},
  trackWasteData:{},
  zoneWasteData:{},
  selectedChipsId:"",
  chipsFilteredTrack:{},
  chipsFilteredZone:{}
}
//Reducers
export default function reducer(state = initialState, action){
  switch(action.type){
    //location
    case types.LOCATION_GRANTED:{
      const pos = action.payload;
      const region={
        latitude:pos.coords.latitude,
        longitude:pos.coords.longitude, 
        latitudeDelta:0.10,
        longitudeDelta:0.10};
      return {...state, hasMapPermission:true, region };
    }
    case types.LOCATION_DENIED:{
      //handle error
      return {...state, error:action.payload};
    }
    //region
    case types.REGION_CHANGED:{
      return {...state, region:action.payload};
    }
    //current marker
    case types.MARKER_SELECTED:{
      return {...state, currentMarkerId: action.payload};
    }
    //selected geo objects no in use right now
    case types.TRACK_SELECTED:{
      return {...state, selectedTrackIndex:action.payload};
    }
    case types.ZONE_SELECTED:{
      return {...state, selectedZoneIndex:action.payload};
    }
    //chips filetered geo objects
    case types.CHIPS_SELECTED:{
      const {resultTrack, resultZone} = action.payload.chipsFilteredGeoObject;
      const {selectedChipsId} = action.payload;
      return {...state, selectedChipsId, chipsFilteredTrack:resultTrack, chipsFilteredZone:resultZone,
      }
    }
    //dismiss
    case types.DISMISS_SELECTED_GEO_OBJECT:{
      return {...state, selectedTrackIndex:-1, selectedZoneIndex:-1, currentMarkerId:"", chipsFilteredTrack:{},
      chipsFilteredZone:{}, selectedChipsId:""};
    }
    //loading geo objects
    case types.LOAD_GEO_OBJECTS:{
      return {...state};
    }
    case types.LOAD_GEO_OBJECTS_SUCCESS:{
      const {trackDataResult, zoneDataResult} = action.payload;
      return {...state, track:trackDataResult, zone:zoneDataResult,
        queryTrack:trackDataResult, queryZone:zoneDataResult,
        fullQueryTrack:trackDataResult, fullQueryZone:zoneDataResult
      };
    }
    case types.LOAD_GEO_OBJECTS_FAILURE:{
      return {...state, error:action.payload};
    }
    
    //loading geo objects work
    case types.LOAD_GEO_OBJECTS_WORK:{
      return {...state};
    }
    case types.LOAD_GEO_OBJECTS_WORK_SUCCESS:{
      const {response, selectedGeoObjectIndex, workDataOf} = action.payload;
      if(workDataOf == "track"){
        return {...state, workData:response};
      }else if(workDataOf == "zone") {
        return {...state, workData:response};
      }
    }
    case types.LOAD_GEO_OBJECTS_WORK_FAILURE:{
      return {...state, error:action.payload};
    }
    //loading geo objects waste
    case types.LOAD_GEO_OBJECTS_WASTE:{
      return {...state};
    }
    case types.LOAD_GEO_OBJECTS_WASTE_SUCCESS:{
      const {response, selectedGeoObjectIndex, wasteDataOf} = action.payload;
      if(wasteDataOf == "track"){
        return {...state, trackWasteData:response, selectedTrackIndex:selectedGeoObjectIndex,
          currentMarkerId:"", selectedZoneIndex:-1};
      }else if(wasteDataOf == "zone") {
        return {...state, zoneWasteData:response, selectedZoneIndex:selectedGeoObjectIndex,
          selectedTrackIndex:-1};
      }
    }
    case types.LOAD_GEO_OBJECTS_WASTE_FAILURE:{
      return {...state, error:action.payload};
    }
    
    //default panel
    case types.SHOW_DEFAULT_PANEL:{
      return {...state};
    }
    //zone panel
    case types.SHOW_ZONE_PANEL:{
      return {...state, showDefaultPanel:false, mapSearchVisible:false,
        selectedTrackIndex:-1, selectedZoneIndex:-1, currentMarkerId:"", showZonePanel:true};
    }
    //track panel
    case types.SHOW_TRACK_PANEL_1:{
      return {...state, showDefaultPanel:false, mapSearchVisible:false, 
        selectedTrackIndex:-1, selectedZoneIndex:-1, currentMarkerId:"", showTrackPanel1:true};
    }
    case types.SHOW_TRACK_PANEL_2:{
      return {...state, showTrackPanel1:false, showTrackPanel2:true};
    }
    
    //new zone reducers
    case types.ADD_ZONE_POINT:{
      return {...state, zonePoints:action.payload};
    }
    case types.DELETE_ZONE_POINT:{
      const zonePoints = _.cloneDeep(state.zonePoints);
      zonePoints.splice(action.payload,1);
      return {...state, zonePoints};
    }
    case types.DONE_ZONE_PANEL:{
      return {...state, zone:action.payload, zonePoints:[], currentMarkerId:"", nameModalValue:"", 
      nameModalVisible:false, showZonePanel:false, showDefaultPanel:true, mapSearchVisible:true};
    }
    case types.CANCEL_ZONE_PANEL:{
      return {...state, zonePoints:[], showZonePanel:false, currentMarkerId:"", 
      showDefaultPanel:true, mapSearchVisible:true };
    }
    
    //new track reducers
    case types.ADD_TRACK_POINT:{
      return {...state, trackPoints:action.payload};
    }
    case types.DELETE_TRACK_POINT:{
      const trackPoints = _.cloneDeep(state.trackPoints);
      //removing the points using action.payload i.e. removeIndex
      trackPoints.splice(action.payload,1);
      return {...state, trackPoints};
    }
    case types.INTERVAL_CHANGED:{
      return {...state, interval:action.payload};
    }
    case types.CHECKPOINTS_PROCESSED:{
      return {...state, trackCheckpoints:action.payload}
    }
    case types.DONE_TRACK_PANEL_2:{
      return {...state, track:action.payload, trackPoints:[],trackCheckpoints:[], interval:50, currentMarkerId:"",
      nameModalValue:"", nameModalVisible:false, showTrackPanel2:false, showDefaultPanel:true,
      mapSearchVisible:true};
    }
    case types.CANCEL_TRACK_PANEL_2:{
      return {...state, trackPoints:[], trackCheckpoints:[], interval:50, showTrackPanel1:false, 
        showTrackPanel2:false, currentMarkerId:"", showDefaultPanel:true, mapSearchVisible:true};
    }
    case types.TOGGLE_TRACK_PANELS:{
      return {...state, showTrackPanel1:!state.showTrackPanel1, showTrackPanel2:!state.showTrackPanel2, 
        trackCheckpoints:[], interval:50}
    }
    //search box reducers
    case types.TOGGLE_SEARCH_BOX:{
      return {...state, mapSearchFocused:!state.mapSearchFocused,
        mapSearchVisible:!state.mapSearchVisible};
    }

    case types.QUERY_CHANGED:{
      const {trackDataResult, zoneDataResult, formatedQuery} = action.payload;
      return {...state, queryTrack:trackDataResult,
        queryZone:zoneDataResult, searchQuery:formatedQuery}
    }
    
    //name modal reducers
    case types.TOGGLE_NAME_MODAL:{
      return {...state, nameModalVisible:!state.nameModalVisible};
    }
    case types.CANCEL_NAME_MODAL:{
      return {...state, nameModalValue:"", nameModalVisible:false}
    }
    case types.NAME_MODAL_CHANGED:{
      return {...state, nameModalValue:action.payload}
    }
    default:{
      return {...state};
    }
  }
}

//Action creator

//location request action creator
const locationGranted = (position) => {
  console.log(position);
  return ({type:types.LOCATION_GRANTED, payload:position});
}
const locationDenied = (err) => {
  console.log(err);
  return ({type:types.LOCATION_DENIED, payload:err});
}

//region action creator
const changeRegion = (region) => {
  return ({type:types.REGION_CHANGED, payload:region});
}

//marker action creator
const markerSelected = (markerId) => {
  return ({type:types.MARKER_SELECTED, payload:markerId});
}

//geo object selected action creator
const trackSelected = (selectedTrackIndex) => {
  return ({type:types.TRACK_SELECTED, payload:selectedTrackIndex});
}
const zoneSelected = (selectedZoneIndex) => {
  return ({type:types.ZONE_SELECTED, payload:selectedZoneIndex});
}
const chipsSelected = (chipsFilteredGeoObject, selectedChipsId) => {
  return ({type:types.CHIPS_SELECTED, payload:{chipsFilteredGeoObject, selectedChipsId}});
}
//DISMISS action creator
const dismissSelectedGeoObject = () => {
  return ({type:types.DISMISS_SELECTED_GEO_OBJECT});
}

//GEO OBJECT data action creator
const loadGeoObjects = () => {
  return ({type:types.LOAD_GEO_OBJECTS});
}
const loadGeoObjectsSuccess = (response) => {
  return ({type:types.LOAD_GEO_OBJECTS_SUCCESS, payload:response});
}
const loadGeoObjectsFailure = (err) => {
  console.log("err for loadGeoObjectsFailure ",err);
  return ({type:types.LOAD_GEO_OBJECTS_FAILURE, payload:err});
}

//WORK data action creator
const loadGeoObjectsWork = () => {
  return ({type: types.LOAD_GEO_OBJECTS_WORK});
}
const loadGeoObjectsWorkSuccess = (response, selectedGeoObjectIndex, workDataOf) => {
  return ({type: types.LOAD_GEO_OBJECTS_WORK_SUCCESS, payload:{response, selectedGeoObjectIndex, workDataOf}});
}
const loadGeoObjectsWorkFailure = (err) => {
  return ({type: types.LOAD_GEO_OBJECTS_WORK_FAILURE, payload:err});
}

//WASTE data action creator
const loadGeoObjectsWaste = () => {
  return ({type: types.LOAD_GEO_OBJECTS_WASTE});
}
const loadGeoObjectsWasteSuccess = (response, selectedGeoObjectIndex, wasteDataOf) => {
  return ({type: types.LOAD_GEO_OBJECTS_WASTE_SUCCESS, payload:{response, selectedGeoObjectIndex, wasteDataOf}});
}
const loadGeoObjectsWasteFailure = (err) => {
  return ({type: types.LOAD_GEO_OBJECTS_WASTE_FAILURE, payload:err});
}

//ZONE action creator
const togglePanel = (panelType) => {
  return ({type:panelType});
}
const addZonePoint = (zonePoints) => {
  return ({type:types.ADD_ZONE_POINT, payload:zonePoints});
}
const dragZoneMarker = (zonePoints) => {
  return ({type:types.ADD_ZONE_POINT, payload:zonePoints});
}
const deleteZonePoint = (removeIndex) => {
  return ({type:types.DELETE_ZONE_POINT, payload:removeIndex});
}
const doneZonePanel = (zone) => {
  //make api call to save new zone
  return({type:types.DONE_ZONE_PANEL, payload:zone});
}
const cancelZonePanel = () => {
  return({type:types.CANCEL_ZONE_PANEL});
}

//TRACK action creator
const addTrackPoint = (trackPoints) => {
  return ({type:types.ADD_TRACK_POINT, payload:trackPoints});
}
const dragTrackMarker = (trackPoints) => {
  //reusing type
  return ({type: types.ADD_TRACK_POINT, payload:trackPoints});
}
const deleteTrackPoint = (removeIndex) => {
  return ({type:types.DELETE_TRACK_POINT, payload:removeIndex});
}
const intervalChanged = (interval) => {
  return ({type:types.INTERVAL_CHANGED, payload:interval});
}
const checkpointsProcessed = (trackCheckpoints) => {
  return ({type:types.CHECKPOINTS_PROCESSED, payload:trackCheckpoints});
}
const doneTrackPanel2 = (track) => {
  //make api call to save new track
  return({type:types.DONE_TRACK_PANEL_2, payload:track});
}
const cancelTrackPanel2 = () => {
  return({type:types.CANCEL_TRACK_PANEL_2});
}
const toggleTrackPanels = () => {
  return({type:types.TOGGLE_TRACK_PANELS})
}

//search box action creator
const toggleSearchBox = () => {
  return ({type:types.TOGGLE_SEARCH_BOX});
}
const queryChanged = (trackDataResult, zoneDataResult, formatedQuery) => {
  return ({type:types.QUERY_CHANGED, payload:{trackDataResult, zoneDataResult, formatedQuery}});
}

//name modal action creator
const toggleNameModal = () => {
  return ({type:types.TOGGLE_NAME_MODAL});
}
const cancelNameModal = () => {
  return ({type:types.CANCEL_NAME_MODAL});
}
const nameModalChanged = (geoObjectName) => {
  return ({type:types.NAME_MODAL_CHANGED, payload:geoObjectName})
}

//thunk functions
const thunkLoadGeoObjects = (searchQuery) => {
  return (dispatch) => {
    //dispatch(loadGeoObjects());
    getObjects(searchQuery)
    .then((response) => {
      dispatch(loadGeoObjectsSuccess(response));
    })
    .catch(err => {
      console.log("error from geoObjects thunk action: ",err);
      dispatch(loadGeoObjectsFailure(err));
    });
  }
}

const thunkLoadGeoObjectWork = (geoObjectId, selectedGeoObjectIndex, workDataOf, infoType) => {
  return (dispatch) => {
    //dispatch(loadGeoObjectsWork());
    getWorkData( geoObjectId, workDataOf, infoType)
    .then((response) => {
      dispatch(loadGeoObjectsWorkSuccess(response, selectedGeoObjectIndex, workDataOf));
    })
    .catch(err => {
      console.log("error from work thunk action: ",err);
      dispatch(loadGeoObjectsWorkFailure(err));
    });
    //return new Promise((resolve, reject)=> resolve())
  }
}
const thunkChipsSelected = (type, query, id) => {
  return (dispatch) => {
    chipsFilter(type, query)
    .then((response) => {
      dispatch(chipsSelected(response, id));
    });
  }
}
const thunkLoadGeoObjectWaste = (geoObjectId, selectedGeoObjectIndex, wasteDataOf) => {
  return (dispatch) => {
    //dispatch(loadGeoObjectsWaste());
    getWasteData( wasteDataOf, geoObjectId)
    .then((response) => {
      dispatch(loadGeoObjectsWasteSuccess(response, selectedGeoObjectIndex, wasteDataOf));
    })
    .catch(err => {
      console.log("error from waste thunk action: ",err);
      dispatch(loadGeoObjectsWasteFailure(err));
    });
    //return new Promise((resolve, reject)=> resolve())
  }
}

const thunkQueryChanged = (trackDataResult, zoneDataResult, formatedQuery) => {
  return (dispatch) => {
    dispatch(queryChanged(trackDataResult, zoneDataResult, formatedQuery));
    return new Promise((resolve, reject) => resolve());
  }
}
const thunkToggleSearchBox = () => {
  return(dispatch) => {
    dispatch(toggleSearchBox());
    return new Promise((resolve, reject) => resolve());
  }
}
//Exporting action creators
export const actions = {
  locationGranted, locationDenied,
  changeRegion, markerSelected, trackSelected, zoneSelected, chipsSelected, thunkChipsSelected, dismissSelectedGeoObject, 
  loadGeoObjects, loadGeoObjectsSuccess, loadGeoObjectsFailure, thunkLoadGeoObjects,
  loadGeoObjectsWork, loadGeoObjectsWorkSuccess,loadGeoObjectsWorkFailure, thunkLoadGeoObjectWork,
  loadGeoObjectsWaste, loadGeoObjectsWasteSuccess, loadGeoObjectsWasteFailure, thunkLoadGeoObjectWaste,
  togglePanel, toggleNameModal, cancelNameModal, nameModalChanged,
  addZonePoint, deleteZonePoint, dragZoneMarker, doneZonePanel, cancelZonePanel,
  addTrackPoint, deleteTrackPoint, dragTrackMarker, intervalChanged, checkpointsProcessed, doneTrackPanel2, cancelTrackPanel2, toggleTrackPanels,
  toggleSearchBox, thunkToggleSearchBox, queryChanged, thunkQueryChanged
}
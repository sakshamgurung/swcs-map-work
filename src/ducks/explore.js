import {getObjects, getTrackWasteData} from "../mock/explore/MockServer";
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

  SEARCH_CHANGED:"explore/searchChanged",
  NAME_MODAL_CHANGED:"explore/nameModalChanged",
  TOGGLE_NAME_MODAL:"explore/toggleNameModal",
  
  TOGGLE_SEARCH_BOX:"explore/toggleSearchBox",
  QUERY_CHANGED:"explore/trackQueryChanged",
  CLEAR_SEARCH_BOX:"explore/clearSearchBox",

  LOAD_GEO_OBJECTS:"explore/loadGeoObjects",
  LOAD_GEO_OBJECTS_SUCCESS:"explore/loadGeoObjectsSuccess",
  LOAD_GEO_OBJECTS_FAILURE:"explore/loadGeoObjectsFailure",
  
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

  ADD_ZONE_POINT:"explore/addZonePoint",
  DELETE_ZONE_POINT:"explore/deleteZonePoint",
  ADD_ZONE:"explore/addZone",
  
  ADD_TRACK_POINT:"explore/addTrackPoint",
  DELETE_TRACK_POINT:"explore/deleteTrackPoint",
  ADD_TRACK:"explore/addTrack",
  PROCESS_CHECKPOINTS:"explore/processCheckpoints",
  INTERVAL_CHANGED:"explore/intervalChanged",
}
//initial states
export const initialState = {
  categories: [],
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
  interval:50,
  queryTrack:[],
  fullQueryTrack:[],
  currentMarkerId:"",
  selectedTrackIndex:-1,
  selectedZoneIndex:-1,
  trackWasteData:{}
}
//Reducers
export default function reducer(state = initialState, action){
  switch(action.type){
    //location
    case types.LOCATION_GRANTED:
      const pos = action.payload;
      const region={
        latitude:pos.coords.latitude,
        longitude:pos.coords.longitude, 
        latitudeDelta:0.15,
        longitudeDelta:0.15};
      return {...state, hasMapPermission:true, region };
    case types.LOCATION_DENIED://handle error
      return {...state, error:action.payload};
    
    //region
    case types.REGION_CHANGED:
      return {...state, region:action.payload};
    //current marker
    case types.MARKER_SELECTED:
      return {...state, currentMarkerId: action.payload};
    //selected geo objects
    case types.TRACK_SELECTED:
      return {...state, selectedTrackIndex:action.payload};
    case types.ZONE_SELECTED:
      return {...state, selectedZoneIndex:action.payload};
    //dismiss
    case types.DISMISS_SELECTED_GEO_OBJECT:
      return {...state, selectedTrackIndex:-1, selectedZoneIndex:-1, currentMarkerId:""};
    //loading geo objects
    case types.LOAD_GEO_OBJECTS:
      return {...state};
    case types.LOAD_GEO_OBJECTS_SUCCESS:
      return {...state,};
    case types.LOAD_GEO_OBJECTS_FAILURE:
      return {...state, error:action.payload};
    
    //loading geo objects waste
    case types.LOAD_GEO_OBJECTS_WASTE:
      return {...state};
    case types.LOAD_GEO_OBJECTS_WASTE_SUCCESS:
      return {...state,};
    case types.LOAD_GEO_OBJECTS_WASTE_FAILURE:
      return {...state, error:action.payload};
    
    //default panel
    case types.SHOW_DEFAULT_PANEL:
      return {...state};
    //zone panel
    case types.SHOW_ZONE_PANEL:
      return {...state, showDefaultPanel:false, mapSearchVisible:false,
        selectedTrackIndex:-1, selectedZoneIndex:-1, currentMarkerId:"", showZonePanel:true};
    //track panel
    case types.SHOW_TRACK_PANEL_1:
      return {...state, showDefaultPanel:false, mapSearchVisible:false, 
        selectedTrackIndex:-1, selectedZoneIndex:-1, currentMarkerId:"", showTrackPanel1:true};
    case types.SHOW_TRACK_PANEL_2:
      return {...state, showTrackPanel1:false, showTrackPanel2:true};
    
    //new zone reducers
    case types.ADD_ZONE_POINT:
      return {...state, zonePoints:action.zonePoints};
    case types.DELETE_ZONE_POINT:
      const zonePoints = _.cloneDeep(state.zonePoints);
      zonePoints.splice(action.payload,1);
      return {...state, zonePoints};
    case types.DONE_ZONE_PANEL:
      return {...state, zone, zonePoints:[], currentMarkerId:"", nameModalValue:"", 
      nameModalVisible:false, showZonePanel:false, showDefaultPanel:true, mapSearchVisible:true};
    case types.CANCEL_ZONE_PANEL:
      return {...state, points:[], showZonePanel:false, currentMarkerId:"", showDefaultPanel:true, mapSearchVisible:true };
    
    //new track reducers
    case types.ADD_TRACK_POINT:
      return {...state, trackPoints:action.trackPoints};
    case types.DELETE_TRACK_POINT:
      const trackPoints = _.cloneDeep(state.trackPoints);
      trackPoints.splice(action.payload,1);
      return {...state, trackPoints};
    case types.INTERVAL_CHANGED:
        return {...state, interval:action.payload};
    case types.PROCESS_CHECKPOINTS:
      return {...state, trackCheckpoints:action.payload}
    case types.DONE_TRACK_PANEL_2:
      return {...state, track, trackPoints:[],trackCheckPoints:[], interval:50, currentMarkerId:"",
      nameModalValue:"", nameModalVisible:false, showTrackPanel:false, showDefaultPanel:true,
      mapSearchVisible:true};
    case types.CANCEL_TRACK_PANEL_2:
      return {...state, trackPoints:[], trackCheckPoints:[], showTrackPanel:false, currentMarkerId:"",
      showDefaultPanel:true, mapSearchVisible:true};
    
    //search box reducers
    case types.TOGGLE_SEARCH_BOX:
      return {...state, mapSearchFocused:!state.mapSearchFocused,
        mapSearchVisible:!state.mapSearchVisible};
    case types.QUERY_CHANGED:
      return {...state, queryTrack:action.payload.trackDataResult,
        queryZone:action.payload.zoneDataResult}
    case types.CLEAR_SEARCH_BOX:
      return {...state, searchQuery:""}
    
    //name modal reducers
    case types.TOGGLE_NAME_MODAL:
      return {...state, nameModalVisible:!state.nameModalVisible};
    case types.NAME_MODAL_CHANGED:
      return {...state, nameModalValue:action.payload}
    default:
      return state;
  }
}
//Exporting action creators
export const actions = {
  locationGranted, locationDenied,
  changeRegion, markerSelected, trackSelected, zoneSelected, dismissSelectedGeoObject, 
  loadGeoObjects, loadGeoObjectsSuccess, loadGeoObjectsFailure, thunkLoadGeoObjects,
  loadGeoObjectsWaste, loadGeoObjectsWasteSuccess, loadGeoObjectsWasteFailure, thunkLoadGeoObjectWaste,
  togglePanel, toggleNameModal, nameModalChanged,
  addZonePoint, deleteZonePoint,
  addTrackPoint, deleteTrackPoint, dragTrackMarker, intervalChanged, processCheckpoints,
  toggleSearchBox, queryChanged, clearSearchBox, 
}

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
//dismiss action creator
const dismissSelectedGeoObject = () => {
  return ({type:types.DISMISS_SELECTED_GEO_OBJECT});
}
//fetching geo object data action creator
const loadGeoObjects = () => {
  return ({type:types.LOAD_GEO_OBJECTS});
}
const loadGeoObjectsSuccess = (response) => {
  console.log("response: ",response);
  return ({type:types.LOAD_GEO_OBJECTS_SUCCESS, payload:response});
}
const loadGeoObjectsFailure = (err) => {
  console.log("err ",err);
  return ({type:types.LOAD_GEO_OBJECTS_FAILURE, payload:err});
}
//fetching geo object waste data action creator
const loadGeoObjectsWaste = () => {
  return ({type: types.LOAD_GEO_OBJECTS_WASTE});
}
const loadGeoObjectsWasteSuccess = (response) => {
  console.log("response: ",response);
  return ({type: types.LOAD_GEO_OBJECTS_WASTE_SUCCESS, payload:response});
}
const loadGeoObjectsWasteFailure = (err) => {
  console.log("err: ",err);
  return ({type: types.LOAD_GEO_OBJECTS_WASTE_FAILURE, payload:err});
}
//zone action creator
const togglePanel = (panelType) => {
  return ({type:panelType});
}
const addZonePoint = (zonePoints) => {
  return ({type:types.ADD_ZONE_POINT, payload:zonePoints});
}
const deleteZonePoint = (removeIndex) => {
  return ({type:types.DELETE_ZONE_POINT, payload:removeIndex});
}
//track action creator
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
const processCheckpoints = (trackCheckpoints) => {
  return ({type:types.PROCESS_CHECKPOINTS, payload:trackCheckpoints});
}
//search box action creator
const toggleSearchBox = () => {
  return ({type:types.TOGGLE_SEARCH_BOX});
}
const queryChanged = (trackDataResult, zoneDataResult) => {
  return ({type:types.QUERY_CHANGED, payload:{trackDataResult, zoneDataResult}});
}
const clearSearchBox = () => {
  return ({type:types.CLEAR_SEARCH_BOX});
}
//name modal action creator
const toggleNameModal = () => {
  return ({type:types.TOGGLE_NAME_MODAL});
}
const nameModalChanged = (geoObjectName) => {
  return ({type:types.NAME_MODAL_CHANGED, payload:geoObjectName})
}

//thunk functions
const thunkLoadGeoObjects = (searchQuery) => {
  return (dispatch) => {
    dispatch(loadGeoObjects());
    getObjects(searchQuery)
      .then((response) => {
        dispatch(loadGeoObjectsSuccess(response));
      })
      .catch(err => {
        dispatch(loadGeoObjectsFailure(err));
      });
  }
}

const thunkLoadGeoObjectWaste = (refId) => {
  return (dispatch) => {
    dispatch(loadGeoObjectsWaste());
    getTrackWasteData(refId)
      .then((response) => {
        dispatch(loadGeoObjectsWasteSuccess(response));
      })
      .catch(err => {
        dispatch(loadGeoObjectsWasteFailure(err));
      });
  }
}
import {getObjects, getWorkData, getWasteData, chipsFilter, processInfoEditFooterData} from "utilities";
import {loggedInClient, GeoObjectUrl, WorkUrl, WasteDumpUrl, StaffGroupUrl, VehicleUrl} from "api"

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
  TOGGLE_GEO_OBJECTS_DETAIL_MODAL:"explore/toggleGeoObjectsDetailModal",
  Geo_OBJECTS_DETAIL_CHANGED:"explore/geoObjectsDetailChanged",

  TOGGLE_SEARCH_BOX:"explore/toggleSearchBox",
  QUERY_CHANGED:"explore/trackQueryChanged",

  POST_GEO_OBJECTS:"explore/postGeoObjects",
  POST_GEO_OBJECTS_SUCCESS:"explore/postGeoObjectsSuccess",
  POST_GEO_OBJECTS_FAILURE:"explore/postGeoObjectsFailure",
  
  PUT_GEO_OBJECTS:"explore/putGeoObjects",
  PUT_GEO_OBJECTS_SUCCESS:"explore/putGeoObjectsSuccess",
  PUT_GEO_OBJECTS_FAILURE:"explore/putGeoObjectsFailure",
  
  DELETE_GEO_OBJECTS:"explore/deleteGeoObjects",
  DELETE_GEO_OBJECTS_SUCCESS:"explore/deleteGeoObjectsSuccess",
  DELETE_GEO_OBJECTS_FAILURE:"explore/deleteGeoObjectsFailure",

  LOAD_GEO_OBJECTS:"explore/loadGeoObjects",
  LOAD_GEO_OBJECTS_SUCCESS:"explore/loadGeoObjectsSuccess",
  LOAD_GEO_OBJECTS_FAILURE:"explore/loadGeoObjectsFailure",
  
  LOAD_INFO_EDIT_FOOTER_DATA:"explore/loadInfoEditFooterData",
  LOAD_INFO_EDIT_FOOTER_DATA_SUCCESS:"explore/loadInfoEditFooterDataSuccess",
  LOAD_INFO_EDIT_FOOTER_DATA_FAILURE:"explore/loadInfoEditFooterDataFailure",
  
  SHOW_DEFAULT_PANEL:"explore/showDefalutPanel",
  
  SHOW_TRACK_PANEL:"explore/showTrackPanel",
  CLOSE_TRACK_PANEL:"explore/CloseTrackPanel",
  
  SHOW_ZONE_PANEL:"explore/showZonePanel",
  CLOSE_ZONE_PANEL:"explore/closeZonePanel",
  
  SHOW_GEO_OBJECT_EDIT_PANEL:"explore/showGeoObjectEditPanel",
  CLOSE_GEO_OBJECT_EDIT_PANEL:"explore/closeGeoObjectEditPanel",

  TOGGLE_MAP_SEARCH:"explore/toggleMapSearch",
  CANCEL_GEO_OBJECTS_DETAIL_MODAL:"explore/cancelGeoObjectsDetailModal",

  ADD_ZONE_POINT:"explore/addZonePoint",
  DELETE_ZONE_POINT:"explore/deleteZonePoint",
  ADD_ZONE:"explore/addZone",
  
  ADD_TRACK_POINT:"explore/addTrackPoint",
  DELETE_TRACK_POINT:"explore/deleteTrackPoint",
  ADD_TRACK:"explore/addTrack",
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
      name: 'work confirmed', query:'confirmed', id: 'c5', type: 'work status'
    },
    {
      name: 'work on progress', query:'on progress', id: 'c6', type: 'work status'
    },
    {
      name: 'work finished', query:'finished', id: 'c7', type: 'work status'
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
  showTrackPanel:false,
  showGeoObjectEditPanel:false,
  geoObjectsDetailModalVisible:false,
  geoObjectsDetail:{name:"", wasteLimit:"500", wasteLimitUnit:"kg", description:""},
  zone:[],
  zonePoints:[],
  track:[],
  trackPoints:[],
  queryTrack:[],
  fullQueryTrack:[],
  currentMarkerId:"",
  selectedTrackIndex:-1,
  selectedZoneIndex:-1,
  infoEditFooterData:{},
  selectedChipsId:"",
  chipsFilteredTrack:{},
}
//Reducers
export default function reducer(state = initialState, action){
  switch(action.type){
    //location
    case types.LOCATION_GRANTED: {
      const pos = action.payload;
      const region = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        latitudeDelta: 0.10,
        longitudeDelta: 0.10
      };
      return { ...state, hasMapPermission: true, region };
    }
    case types.LOCATION_DENIED: {
    //handle error
      return { ...state, errorInfo: action.payload };
    }
    //region
    case types.REGION_CHANGED: {
      return { ...state, region: action.payload };
    }
    //current marker
    case types.MARKER_SELECTED: {
      return { ...state, currentMarkerId: action.payload };
    }

    case types.TRACK_SELECTED: {
      return { ...state, selectedTrackIndex: action.payload };
    }
    case types.ZONE_SELECTED: {
      return { ...state, selectedZoneIndex: action.payload, selectedTrackIndex: -1};
    }

    case types.CHIPS_SELECTED: {
      const { resultTrack } = action.payload.chipsFilteredGeoObject;
      const { selectedChipsId } = action.payload;
      return {
        ...state, selectedChipsId, chipsFilteredTrack: resultTrack, selectedTrackIndex: -1, selectedZoneIndex: -1
      }
    }

    case types.DISMISS_SELECTED_GEO_OBJECT: {
      return {
        ...state, selectedTrackIndex: -1, selectedZoneIndex: -1, chipsFilteredTrack: {}, selectedChipsId: ""
      };
    }

    case types.LOAD_GEO_OBJECTS: {
      return { ...state };
    }

    case types.LOAD_GEO_OBJECTS_SUCCESS: {
      const { trackDataResult, zoneDataResult } = action.payload;
      return {
        ...state, track: trackDataResult, zone: zoneDataResult,
        queryTrack: trackDataResult, fullQueryTrack: trackDataResult
      };
    }

    case types.LOAD_GEO_OBJECTS_FAILURE: {
      return { ...state, errorInfo: action.payload };
    }

    //loading infoEditFooterData
    case types.LOAD_INFO_EDIT_FOOTER_DATA: {
      return { ...state };
    }

    case types.LOAD_INFO_EDIT_FOOTER_DATA_SUCCESS: {
      const { response, dataOf } = action.payload;
      if (dataOf == "track") {
        return { ...state, infoEditFooterData: response };
      }
    }
    
    case types.LOAD_INFO_EDIT_FOOTER_DATA_FAILURE: {
      return { ...state, errorInfo: action.payload };
    }

    case types.SHOW_DEFAULT_PANEL: {
      return { ...state };
    }

    case types.SHOW_ZONE_PANEL: {
      return {
        ...state, showDefaultPanel: false, mapSearchVisible: false,
        selectedTrackIndex: -1, selectedZoneIndex: -1, showZonePanel: true
      };
    }

    case types.SHOW_TRACK_PANEL: {
      return {
        ...state, showDefaultPanel: false, mapSearchVisible: false,
        selectedTrackIndex: -1, selectedZoneIndex: -1, showTrackPanel: true
      };
    }

    case types.SHOW_GEO_OBJECT_EDIT_PANEL:{
      const {geoObjectType, selectedGeoObjectIndex} = action.payload;
      
      if(geoObjectType == "track"){
        const trackPoints = _.cloneDeep(state.track[selectedGeoObjectIndex].trackPoints);
        return {
          ...state, showDefaultPanel:false, mapSearchVisible:false, showGeoObjectEditPanel:true, trackPoints
        }
      }
    }
    case types.CLOSE_GEO_OBJECT_EDIT_PANEL:{
      const {geoObjectType} = action.payload;
      if(geoObjectType == "track"){
        return {
          ...state, showDefaultPanel:true, mapSearchVisible:true, showGeoObjectEditPanel:false, currentMarkerId:"", trackPoints:[]
        }
      }
    }

    //new zone reducers
    case types.ADD_ZONE_POINT: {
      return { ...state, zonePoints: action.payload };
    }

    case types.DELETE_ZONE_POINT: {
      const zonePoints = _.cloneDeep(state.zonePoints);
      zonePoints.splice(action.payload, 1);
      return { ...state, zonePoints };
    }

    case types.CLOSE_ZONE_PANEL: {
      return {
        ...state, zonePoints: [], showZonePanel: false, currentMarkerId: "", showDefaultPanel: true, mapSearchVisible: true
      };
    }

    //new track reducers
    case types.ADD_TRACK_POINT: {
      return { ...state, trackPoints: action.payload };
    }

    case types.DELETE_TRACK_POINT: {
      const trackPoints = _.cloneDeep(state.trackPoints);
      trackPoints.splice(action.payload, 1);
      return { ...state, trackPoints };
    }

    case types.CLOSE_TRACK_PANEL: {
      return {
        ...state, trackPoints: [], currentMarkerId: "", showTrackPanel: false, showDefaultPanel: true, mapSearchVisible: true
      };
    }

    //posting new geoObjects
    case types.POST_GEO_OBJECTS_SUCCESS: {
      const {geoObjectType, response} = action.payload;
      if(geoObjectType == "track"){
        return {
          ...state, track: response, queryTrack: response, fullQueryTrack: response
        };
      }else if(geoObjectType == "zone"){
        return {
          ...state, zone:response
        }
      }
    }

    case types.POST_GEO_OBJECTS_FAILURE: {
      return {
        ...state, errorInfo:action.payload
      };
    }
    
    //update geoObjects
    case types.PUT_GEO_OBJECTS_SUCCESS:{
      const {geoObjectType, response} = action.payload;
      if(geoObjectType == "track"){
        return {
          ...state, track: response, queryTrack: response, fullQueryTrack: response
        };
      }else if(geoObjectType == "zone"){
        return {
          ...state, zone:response
        }
      }
    }

    case types.PUT_GEO_OBJECTS_FAILURE: {
      return {
        ...state, errorInfo:action.payload
      };
    }

    //delete geoObjects
    case types.DELETE_GEO_OBJECTS_SUCCESS:{
      const {geoObjectType, response} = action.payload;
      if(geoObjectType == "track"){
        return {
          ...state, track: response, queryTrack: response, fullQueryTrack: response
        };
      }else if(geoObjectType == "zone"){
        return {
          ...state, zone:response
        }
      }
    }

    case types.DELETE_GEO_OBJECTS_FAILURE: {
      return {
        ...state, errorInfo:action.payload
      };
    }

    //search box reducers
    case types.TOGGLE_SEARCH_BOX: {
      return {
        ...state, mapSearchFocused: !state.mapSearchFocused,
        mapSearchVisible: !state.mapSearchVisible
      };
    }

    case types.QUERY_CHANGED: {
      const { trackDataResult, formattedQuery } = action.payload;
      return { ...state, queryTrack: trackDataResult, searchQuery: formattedQuery }
    }

    //name modal reducers
    case types.TOGGLE_GEO_OBJECTS_DETAIL_MODAL: {
      return { ...state, geoObjectsDetailModalVisible: !state.geoObjectsDetailModalVisible };
    }
    case types.CANCEL_GEO_OBJECTS_DETAIL_MODAL: {
      return { ...state, geoObjectsDetailModalVisible: false,   geoObjectsDetail:{name:"", wasteLimit:500, wasteLimitUnit:"kg", description:""} }
    }

    case types.Geo_OBJECTS_DETAIL_CHANGED: {
      const {property, value} = action.payload;
      const geoObjectsDetail = _.cloneDeep(state.geoObjectsDetail);
      geoObjectsDetail[`${property}`] = value;
      console.log("geoObjectsDetail:",geoObjectsDetail);
      return {...state, geoObjectsDetail};
    }

    default: {
      return { ...state };
    }
  }
}

/**
 * Action creator
 * */

const locationGranted = (position) => {
  console.log(position);
  return ({type:types.LOCATION_GRANTED, payload:position});
}

const locationDenied = (err) => {
  return ({type:types.LOCATION_DENIED, payload:err});
}

const changeRegion = (region) => {
  return ({type:types.REGION_CHANGED, payload:region});
}

const markerSelected = (markerId) => {
  return ({type:types.MARKER_SELECTED, payload:markerId});
}

const trackSelected = (selectedTrackIndex) => {
  return ({type:types.TRACK_SELECTED, payload:selectedTrackIndex});
}

const zoneSelected = (selectedZoneIndex) => {
  return ({type:types.ZONE_SELECTED, payload:selectedZoneIndex});
}

const chipsSelected = (chipsFilteredGeoObject, selectedChipsId) => {
  return ({type:types.CHIPS_SELECTED, payload:{chipsFilteredGeoObject, selectedChipsId}});
}

const dismissSelectedGeoObject = () => {
  return ({type:types.DISMISS_SELECTED_GEO_OBJECT});
}
/**
 * API request and calls
 */
const loadGeoObjects = () => {
  return ({type:types.LOAD_GEO_OBJECTS});
}

const loadGeoObjectsSuccess = (response) => {
  return ({type:types.LOAD_GEO_OBJECTS_SUCCESS, payload:response});
}

const loadGeoObjectsFailure = (err) => {
  return ({type:types.LOAD_GEO_OBJECTS_FAILURE, payload:err});
}

const loadInfoEditFooterData = () => {
  return ({type: types.LOAD_INFO_EDIT_FOOTER_DATA});
}

const loadInfoEditFooterDataSuccess = (response, dataOf) => {
  return ({type: types.LOAD_INFO_EDIT_FOOTER_DATA_SUCCESS, payload:{response, dataOf}});
}

const loadInfoEditFooterDataFailure = (err) => {
  return ({type: types.LOAD_INFO_EDIT_FOOTER_DATA_FAILURE, payload:err});
}

const postGeoObjects = () => {
  return ({type:types.POST_GEO_OBJECTS});
}

const postGeoObjectsSuccess = (response, geoObjectType) => {
  return ({type:types.POST_GEO_OBJECTS_SUCCESS, payload:{response, geoObjectType}});
}

const postGeoObjectsFailure = (err) => {
  return ({type:types.POST_GEO_OBJECTS_FAILURE, payload:err});
}

const putGeoObjects = () => {
  return ({type:types.PUT_GEO_OBJECTS});
}

const putGeoObjectsSuccess = (response, geoObjectType) => {
  return ({type:types.PUT_GEO_OBJECTS_SUCCESS, payload:{response, geoObjectType}});
}

const putGeoObjectsFailure = (err) => {
  return ({type:types.PUT_GEO_OBJECTS_FAILURE, payload:err});
}

const deleteGeoObjects = () => {
  return ({type:types.DELETE_GEO_OBJECTS});
}

const deleteGeoObjectsSuccess = (response, geoObjectType) => {
  return ({type:types.DELETE_GEO_OBJECTS_SUCCESS, payload:{response, geoObjectType}});
}

const deleteGeoObjectsFailure = (err) => {
  return ({type:types.DELETE_GEO_OBJECTS_FAILURE, payload:err});
}

const showPanel = (panelType) => {
  return ({type:panelType});
}

const showGeoObjectEditPanel = (geoObjectType, selectedGeoObjectIndex) => {
  return ({type:types.SHOW_GEO_OBJECT_EDIT_PANEL, payload:{geoObjectType, selectedGeoObjectIndex}});
}

const closeGeoObjectEditPanel = (geoObjectType) => {
  return ({type:types.CLOSE_GEO_OBJECT_EDIT_PANEL, payload:{geoObjectType}})
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

const closeZonePanel = () => {
  return({type:types.CLOSE_ZONE_PANEL});
}

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

const closeTrackPanel = () => {
  return({type:types.CLOSE_TRACK_PANEL});
}

const toggleSearchBox = () => {
  return ({type:types.TOGGLE_SEARCH_BOX});
}

const queryChanged = (trackDataResult, formattedQuery) => {
  return ({type:types.QUERY_CHANGED, payload:{trackDataResult, formattedQuery}});
}

const toggleGeoObjectsDetailModal = () => {
  return ({type:types.TOGGLE_GEO_OBJECTS_DETAIL_MODAL});
}

const cancelGeoObjectsDetailModal = () => {
  return ({type:types.CANCEL_GEO_OBJECTS_DETAIL_MODAL});
}

const geoObjectsDetailChanged = (geoObjectsDetail) => {
  return ({type:types.Geo_OBJECTS_DETAIL_CHANGED, payload:geoObjectsDetail})
}

/**
 * thunk functions
 * using shorthand notation for:
 * const foo = (para) => {
 *  return (dispatch, getState) => {
 *    //...code
 *  }
 * }
 * */
let companyId = "60465952ed6770392c038261";
//companyId = "604a209488ecec33c4b29050";
const thunkLoadGeoObjects = (searchQuery) => async(dispatch, getState) => {
  //dispatch(loadGeoObjects());
  if(searchQuery.length != 0){
    const trackDataResult = getObjects(searchQuery, getState);
    dispatch(loadGeoObjectsSuccess({trackDataResult}));
  }
  try{
    const [trackRes, zoneRes] = await Promise.all([
      loggedInClient.get(new GeoObjectUrl().getAll(companyId, "track")),
      loggedInClient.get(new GeoObjectUrl().getAll(companyId, "zone"))
    ]);
    
    const trackDataResult = trackRes.data;
    const zoneDataResult = zoneRes.data;
    dispatch(loadGeoObjectsSuccess({trackDataResult, zoneDataResult}));
  }catch(err){
    console.log("Load geo object failed error: \n",err);
    dispatch(loadGeoObjectsFailure("Server error: Load geo object"));
  }
}

const thunkLoadInfoEditFooterData = (geoObjectId, selectedGeoObjectIndex, dataOf) => async(dispatch) => {
  //dispatch(loadInfoEditFooterData());
  dispatch(trackSelected(selectedGeoObjectIndex));
  try {
    const [workRes, wasteRes] = await Promise.all([
      loggedInClient.get(new WorkUrl().getByRef("geoObjectTrackId", geoObjectId)),
      loggedInClient.get(new WasteDumpUrl().getByRef("geoObjectId", geoObjectId)),
    ]);
    //res data is an array
    const workData = workRes.data;
    const wasteData = wasteRes.data;

    if(workData.length !=0){
      const {staffGroupId, vehicleId} = workData[0];
      const [staffGroupRes, vehicleRes] = await Promise.all([
        loggedInClient.get(new StaffGroupUrl().getById(staffGroupId)),
        loggedInClient.get(new VehicleUrl().getById(vehicleId))
      ]);
      //res data is an object
      const staffGroupData = staffGroupRes.data;
      const vehicleData = vehicleRes.data;
      const processedData = processInfoEditFooterData(workData, wasteData, staffGroupData, vehicleData, dataOf);
      dispatch(loadInfoEditFooterDataSuccess(processedData, dataOf));
      
    }else{
      if(wasteData.length != 0){
        const processedData = processInfoEditFooterData([], wasteData, {}, {}, dataOf);
        dispatch(loadInfoEditFooterDataSuccess(processedData, dataOf));
      }else{
        const processedData = processInfoEditFooterData([], [], {}, {}, dataOf);
        dispatch(loadInfoEditFooterDataSuccess({}, dataOf));
      }
    }
  } catch (err) {
    console.log("Load geo object work failed error: \n",err);
    dispatch(loadGeoObjectsFailure("Server error: Load info edit footer data"));
  }
}

const thunkChipsSelected = (type, query, id) => async(dispatch, getState) => {
  dispatch(chipsSelected({ resultTrack:[] }, ""));
  try {
    let workData = [], workStatus = query;
    if(type == "work status"){
      const workRes = await loggedInClient.get(new WorkUrl().getAll("company", companyId), {params:{workStatus}});
      workData = workRes.data;
    }
    const result = chipsFilter(type, query, workData, getState);
    dispatch(chipsSelected(result, id));
  } catch (err) {
    console.log("Chips select failed error: \n",err);
    dispatch(loadGeoObjectsFailure("Server error: Chips select"));
  }
}

const thunkPostGeoObjects = (newGeoObject, geoObjectType) => async(dispatch, getState) => {
  dispatch(cancelGeoObjectsDetailModal());
  if(geoObjectType == "track"){
    dispatch(closeTrackPanel());
  }else if(geoObjectType == "zone"){
    dispatch(closeZonePanel());
  }
  try{
    newGeoObject.companyId = companyId;
    const geoObjectRes = await loggedInClient.post(new GeoObjectUrl().post(geoObjectType), newGeoObject);
    if(geoObjectType == "track"){
      const track =_.cloneDeep(getState().explore.track);
      track.push(geoObjectRes.data);
      dispatch(postGeoObjectsSuccess(track, geoObjectType));

    }else if(geoObjectType == "zone"){
      const zone = [geoObjectRes.data];
      dispatch(postGeoObjectsSuccess(zone, geoObjectType));
    }
  }catch(err){
    console.log("Post geo objects failed error:\n",err);
    dispatch(postGeoObjectsFailure("Server error: Post geo objects"));
  }
}

const thunkPutGeoObjects = (updatedGeoObject, updatedGeoObjectIndex, updatedGeoObjectId , geoObjectType) => async(dispatch, getState) => {
  try{
    await loggedInClient.put(new GeoObjectUrl().put(geoObjectType, updatedGeoObjectId ), updatedGeoObject);
    const track = getState().explore.track;
    track[updatedGeoObjectIndex].trackPoints = updatedGeoObject.trackPoints;
    dispatch(dismissSelectedGeoObject());
    dispatch(closeGeoObjectEditPanel(geoObjectType));
    dispatch(putGeoObjectsSuccess(track, geoObjectType));

  }catch(err){
    console.log("Put geo objects failed error:\n",err);
    dispatch(putGeoObjectsFailure("Server error: Put geo objects"));
  }
}

const thunkDeleteGeoObjects = (deletedGeoObjectIndex, deletedGeoObjectId , geoObjectType) => async(dispatch, getState) => {
  try{
    await loggedInClient.delete(new GeoObjectUrl().delete(geoObjectType, deletedGeoObjectId ));
    const track = getState().explore.track;
    track.splice(deletedGeoObjectIndex, 1);
    dispatch(dismissSelectedGeoObject());
    dispatch(deleteGeoObjectsSuccess(track, geoObjectType));
  }catch(err){
    console.log("Delete geo objects failed error:\n",err);
    dispatch(deleteGeoObjectsFailure("Server error: Delete geo objects"));
  }
}

const thunkQueryChanged = (trackDataResult, formattedQuery) => (dispatch) => {
  dispatch(queryChanged(trackDataResult, formattedQuery));
  return new Promise((resolve, reject) => resolve());
}

const thunkToggleSearchBox = () => (dispatch) => {
  dispatch(toggleSearchBox());
  return new Promise((resolve, reject) => resolve());
}

/**
 * Exporting action creators
 * */
export const actions = {
  locationGranted, locationDenied,
  changeRegion, markerSelected, trackSelected, zoneSelected, chipsSelected, thunkChipsSelected, dismissSelectedGeoObject, 
  loadGeoObjects, loadGeoObjectsSuccess, loadGeoObjectsFailure, thunkLoadGeoObjects,
  loadInfoEditFooterData, loadInfoEditFooterDataSuccess, loadInfoEditFooterDataFailure, thunkLoadInfoEditFooterData,
  showPanel, toggleGeoObjectsDetailModal, cancelGeoObjectsDetailModal, geoObjectsDetailChanged,
  postGeoObjects, postGeoObjectsSuccess, postGeoObjectsFailure, thunkPostGeoObjects,
  putGeoObjects, putGeoObjectsSuccess, putGeoObjectsFailure, thunkPutGeoObjects,
  deleteGeoObjects, deleteGeoObjectsSuccess, deleteGeoObjectsFailure, thunkDeleteGeoObjects,
  showGeoObjectEditPanel, closeGeoObjectEditPanel,
  addZonePoint, deleteZonePoint, dragZoneMarker, closeZonePanel,
  addTrackPoint, deleteTrackPoint, dragTrackMarker, closeTrackPanel,
  toggleSearchBox, thunkToggleSearchBox, queryChanged, thunkQueryChanged
}
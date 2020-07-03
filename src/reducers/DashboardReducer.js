import {
  POST_CHANGED,
  POST_SUCCESS,
  POST_FAIL,
  POST_LOADING
} from 'actions/types'

const INITIAL_STATE = {
  post : '',
  loading : false,
  postMsg : ''
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case POST_CHANGED:
      return {...state, post:action.payload};
    case POST_LOADING:
      return {...state, loading:true};
    case POST_SUCCESS:
      return {...state, loading:false, postMsg:'', post:'' };
    case POST_FAIL:
      return {...state, loading:false, postMsg:'Post fail'};
    default:
      console.log("default")
      return state;
  }
};
import {POST} from 'store/actions/types';

const INITIAL_STATE = {
  post : '',
  loading : false,
  postMsg : ''
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case POST.POST_CHANGED:
      return {...state, post:action.payload};
    case POST.POST_LOADING:
      return {...state, loading:true};
    case POST.POST_SUCCESS:
      return {...state, loading:false, postMsg:'', post:'' };
    case POST.POST_FAIL:
      return {...state, loading:false, postMsg:'Post fail'};
    default:
      console.log("default")
      return state;
  }
};
import {POST} from "./types";

export const postChanged = (text)=>{
  return({
    type: POST.POST_CHANGED,
    payload: text
  });
}

export const posting = (post)=>{
  return (dispatch)=>{
    dispatch({type:POST.POST_LOADING});
    console.log("Post:",post);
    console.log("typeof post:",typeof post);
    const data = {post};
    const body = JSON.stringify(data);
    const config = {headers:{'Content-Type':'application/json'}};
    onPostSuccess(dispatch);
  };
}
const onPostSuccess = (dispatch)=>{
  dispatch({
    type: POST.POST_SUCCESS
  })
}
const onPostFail = ({dispatch})=>{
  console.log("Post failed");
  dispatch({
    type: POST.POST_FAIL
  })
}
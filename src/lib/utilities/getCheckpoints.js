import {getDistance} from 'geolib';
/** 
 * @flow
 * 
*/
type Point = {
  x: number,
  y: number
}


function getDistancexy(p:Point,q:Point):number{
  return getDistance({latitude:p.x,longitude:p.y},{latitude:q.x,longitude:q.y});
}

function getCheckpoints (p:Point[], interval:number):object[]{
  // let totalDistance = getPolylineLength(p);
  // console.log("total distance: ", totalDistance);
  let para = {leftoverDistance:0, checkpoints:[]};
  para.checkpoints.push(p[0]);
  for(let i=0; i<(p.length-1); i++){
    let distxy = getDistancexy(p[i],p[i+1]);
    //console.log(`distxy of ${i} from {${p[i].x},${p[i].y}} to {${p[i+1].x},${p[i+1].y}}`,distxy);
    let dLeft = distxy + para.leftoverDistance;
    //console.log(`dleft = distxy(${distxy}) + para.leftoverDistance(${para.leftoverDistance}) = `,dLeft);
    if(dLeft > interval){
      getPointsAlongLine(p[i],p[i+1],dLeft,interval,para);
    }else if(dLeft < interval){
      para.leftoverDistance += distxy;
    }else if(dLeft == interval){
      para.checkpoints.push(p[i+1]);
    }
  }
  para.checkpoints.push(p[p.length-1]);
  return para.checkpoints;
}

function getPolylineLength (p:Point[]):number{
  let totalDistance = 0;
  for(let i = 0; i<(p.length-1); i++ ){
    totalDistance += getDistancexy(p[i], p[i+1]);
  }
  return totalDistance;
}

function getPointsAlongLine(p:Point, q:Point, d:number, interval:number, para:object){
  let originalInterval = interval;
  let parts = d/originalInterval;
  let limit = Math.floor(parts);
  for(let i=0; i<limit; i++){
    let ratio = 0;
    let r = {x:0,y:0};
    ratio = (interval - para.leftoverDistance)/d;
    r.x = (1-ratio)*p.x + ratio*q.x;
    r.y = (1-ratio)*p.y + ratio*q.y;
    para.checkpoints.push(r);
    interval += originalInterval;
    if(i == limit-1){
      para.leftoverDistance = 0;
      para.leftoverDistance = Math.floor((+((parts%1).toFixed(2)))*originalInterval);
    }
  }
}

export default getCheckpoints;
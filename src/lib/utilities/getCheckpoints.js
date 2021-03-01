import {getDistance} from 'geolib';
/** 
 * @flow
 * 
*/

class Point {
  constructor(c, identifier) {
    this.latitude = c.latitude;
    this.longitude = c.longitude;
    this.identifier = identifier;
  }

  get x(): number {
    return this.latitude;
  }

  set x(value: number) {
    this.latitude = value;
  }

  get y(): number {
    return this.longitude;
  }

  set y(value: number) {
    this.longitude = value;
  }
}

function getCheckpoints (p:Point[], interval:number):Point[]{
  // let totalDistance = getPolylineLength(p);
  // console.log("total distance: ", totalDistance);
  let para = {leftoverDistance:0, checkpoints:[]};
  para.checkpoints.push(p[0]);
  for(let i=0; i<(p.length-1); i++){
    let distxy = getDistance(p[i],p[i+1]);
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
    totalDistance += getDistance(p[i], p[i+1]);
  }
  return totalDistance;
}

function getPointsAlongLine(p:Point, q:Point, d:number, interval:number, para:object){
  let originalInterval = interval;
  let parts = d/originalInterval;
  let limit = Math.floor(parts);
  for(let i=0; i<limit; i++){
    let ratio = 0;
    let cp = {latitude:0,longitude:0};
    ratio = (interval - para.leftoverDistance)/d;
    cp.latitude = (1-ratio)*p.latitude + ratio*q.latitude;
    cp.longitude = (1-ratio)*p.longitude + ratio*q.longitude;
    para.checkpoints.push(new Point(cp, `${ Date.now() }.${ Math.random() }`));
    interval += originalInterval;
    if(i == limit-1){
      para.leftoverDistance = 0;
      para.leftoverDistance = Math.floor((+((parts%1).toFixed(2)))*originalInterval);
    }
  }
}

export default getCheckpoints;

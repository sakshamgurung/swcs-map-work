var _ = require('lodash');
function convexHull(points) {
	const S = points.splice(0);
  const P = sortPoints(S);
	const OMEGA = [];
	OMEGA.push(P[0],P[1]);
	for(let i = 0; i<P.length; ){
		const PT1 = OMEGA[OMEGA.length-1];//point the top of the stack OMEGA
		if(PT1 === P[0]){
			//problem if not clone deeply
			OMEGA.push(_.cloneDeep(P[i]));
			i++;
		}else{
			const PT2 = OMEGA[OMEGA.length-2];//point the next to top of the stack OMEGA
			const PT2isLeft = isLeftCompare(P[i], PT2, PT1);
			if(PT2isLeft<0){
				OMEGA.push(_.cloneDeep(P[i]));
				i++;
			}else{
				OMEGA.pop();
			}
		}
  }
	return OMEGA;
}
function sortPoints(S){
	const P0 = {latitude:0,longitude:0};
	P0.longitude = Math.min.apply(null,S.map(p => p.longitude));
	const longitudePoints = S.filter(p=>p.longitude === P0.longitude);
	P0.latitude = Math.max.apply(null,longitudePoints.map(p=>p.latitude));
	S.sort((a,b)=> angleCompare(P0,a,b));
	return S;
}

function angleCompare(P, A, B){
	const left = isLeftCompare(P, A, B);
	if(left === 0) return distCompare(P, A, B);
	return left;
}

function isLeftCompare(P, A, B){
	return (P.latitude - A.latitude) * (B.longitude - A.longitude) - (P.longitude - A.longitude) * (B.latitude - A.latitude);
}

function distCompare(P, A, B){
	const distAP = Math.pow(P.latitude - A.latitude, 2) + Math.pow(P.longitude - A.longitude, 2);
  const distBP = Math.pow(P.latitude - B.latitude, 2) + Math.pow(P.longitude - B.longitude, 2);
  return distAP - distBP;
}

export default convexHull;
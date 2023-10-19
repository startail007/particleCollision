!function(t){var e={};function i(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(s,n,function(e){return t[e]}.bind(null,n));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=7)}([function(t,e,i){"use strict";i.d(e,"a",(function(){return s})),i.d(e,"b",(function(){return n}));class s{static zero(){return[0,0]}static clone(t){return[...t]}static rotate(t,e){let i=Math.cos(e),s=Math.sin(e);return[t[0]*i-t[1]*s,t[1]*i+t[0]*s]}static dot(t,e){return t[0]*e[0]+t[1]*e[1]}static cross(t,e){return t[0]*e[1]-t[1]*e[0]}static add(t,e){return[t[0]+e[0],t[1]+e[1]]}static sub(t,e){return[t[0]-e[0],t[1]-e[1]]}static mul(t,e){return[t[0]*e[0],t[1]*e[1]]}static div(t,e){return[t[0]/e[0],t[1]/e[1]]}static projection(t,e){var i=s.dot(t,e)/s.dot(e,e);return[e[0]*i,e[1]*i]}static length(t){return Math.sqrt(s.dot(t,t))}static scale(t,e){return[t[0]*e,t[1]*e]}static divScale(t,e){return[t[0]/e,t[1]/e]}static collisionCalc(t,e,i,n){return s.scale(s.add(s.scale(t,i-n),s.scale(e,2*n)),1/(i+n))}static distance(t,e){return s.length(s.sub(t,e))}static normalize(t){const e=s.length(t);return e?s.scale(t,1/e):s.clone(t)}static normal(t){return[-t[1],t[0]]}static negate(t){return[-t[0],-t[1]]}static floor(t){return[Math.floor(t[0]),Math.floor(t[1])]}static ceil(t){return[Math.ceil(t[0]),Math.ceil(t[1])]}static round(t){return[Math.round(t[0]),Math.round(t[1])]}static mix(t,e,i){return s.add(s.scale(t,1-i),s.scale(e,i))}}class n{static set(t,e){return t[0]=e[0],t[1]=e[1],t}static add(t,e){return t[0]+=e[0],t[1]+=e[1],t}static sub(t,e){return t[0]-=e[0],t[1]-=e[1],t}static scale(t,e){return t[0]*=e,t[1]*=e,t}static divScale(t,e){return t[0]/=e,t[1]/=e,t}}},function(t,e,i){"use strict";i.d(e,"a",(function(){return r}));var s=i(0);var n=i(2);class r{constructor({color:t="#000000",pos:e=[0,0],radius:i=10,density:n=1,restitution:r=1}){this.color=t,this.pos=s.a.clone(e),this.linearVel=s.a.zero(),this.density=n,this.radius=i,this.area=this.radius*this.radius*Math.PI,this.mass=this.density*this.area,this.invMass=this.mass?1/this.mass:0,this.restitution=r,this.force=s.a.zero()}update(t){s.b.add(this.linearVel,s.a.scale(this.force,t)),s.b.add(this.pos,s.a.scale(this.linearVel,t)),this.force=s.a.zero()}render(t){t.fillStyle=this.color,t.beginPath(),t.arc(...this.pos,this.radius,0,2*Math.PI),t.fill()}static constraint(t,e,i,r){const a=s.a.sub(i,e),o=s.a.normal(s.a.normalize(a));t.forEach(t=>{const i=s.a.sub(t.pos,e),h=s.a.cross(i,a)/s.a.length(a)-t.radius;if(h<0){s.b.sub(t.pos,s.a.scale(o,Math.abs(h)));const e=n.a.resolveCollisionBasic(t.linearVel,s.a.zero(),t.invMass,0,Math.min(t.restitution,r),o);if(!e)return;s.b.sub(t.linearVel,s.a.scale(e,t.invMass))}})}addForce(t){this.force=t}static collide(t,e){const i=n.a.intersectCircles(t.pos,t.radius,e.pos,e.radius);if(!i)return;const{normal:r,depth:a}=i,o=s.a.scale(r,.5*a);s.b.sub(t.pos,o),s.b.add(e.pos,o);const h=Math.min(t.restitution,e.restitution),c=n.a.resolveCollisionBasic(t.linearVel,e.linearVel,t.invMass,e.invMass,h,r);c&&(s.b.sub(t.linearVel,s.a.scale(c,t.invMass)),s.b.add(e.linearVel,s.a.scale(c,e.invMass)))}}},function(t,e,i){"use strict";i.d(e,"a",(function(){return n}));var s=i(0);class n{static resolveCollisionBasic(t,e,i,n,r,a){const o=s.a.sub(e,t);if(s.a.dot(o,a)>0)return;const h=-(1+r)*s.a.dot(o,a)/(i+n);return s.a.scale(a,h)}static intersectCircles(t,e,i,n){const r=s.a.distance(t,i),a=e+n;if(r>=a)return;return{normal:s.a.normalize(s.a.sub(i,t)),depth:a-r}}}},function(t,e,i){"use strict";i.d(e,"b",(function(){return s})),i.d(e,"a",(function(){return n}));class s{constructor(t,e,i,s){this.x=t,this.y=e,this.width=i,this.height=s}constains(t){return t[0]>=this.x&&t[0]<=this.x+this.width&&t[1]>=this.y&&t[1]<=this.y+this.height}intersect(t){return!(t.x>this.x+this.width||t.x+t.width<this.x||t.y>this.y+this.height||t.y+t.height<this.y)}get center(){return[this.x+.5*this.width,this.y+.5*this.height]}get left(){return this.x}get right(){return this.x+this.width}get top(){return this.y}get bottom(){return this.y+this.height}}class n{constructor(t,e=1,i=4,s=5,n=0){this.corner=["northwest","northeast","southeast","southwest"],this.reset(t,e,i,s,n)}reset(t,e=1,i=4,s=5,n=0){this.clear(),this.boundary=t,this.center=[t.x+.5*t.width,t.y+.5*t.height],this.minRange=e,this.maxPoints=i,this.maxLevel=s,this.level=n,this.points=[],this.divided=!1}subdivide(){const t=.5*this.boundary.width,e=.5*this.boundary.height,i=[[0,0],[t,0],[t,e],[0,e]];this.corner.forEach((r,a)=>{this[r]=new n(new s(this.boundary.x+i[a][0],this.boundary.y+i[a][1],t,e),this.minRange,this.maxPoints,this.maxLevel,this.level+1)})}insertOrientation(t){t.point[0]<this.center[0]?t.point[1]<this.center[1]?this.northwest.insert(t):this.southwest.insert(t):t.point[1]<this.center[1]?this.northeast.insert(t):this.southeast.insert(t)}insert(t){if(this.divided)this.insertOrientation(t);else if(this.points.length<this.maxPoints||this.level>this.maxLevel||this.boundary.width<=this.minRange||this.boundary.height<=this.minRange)this.points.push(t);else{this.divided=!0,this.subdivide();for(let t=0;t<this.points.length;t++)this.insertOrientation(this.points[t]);this.points=[],this.insertOrientation(t)}}query(t,e){if(e||(e=[]),!this.boundary.intersect(t))return e;if(this.divided)this.corner.forEach(i=>{this[i].query(t,e)});else for(let i=0;i<this.points.length;i++)t.constains(this.points[i].point)&&e.push(this.points[i]);return e}queryAndMap(t,e){return this.query(t).map(t=>e[t.key])}clear(){this.points=[],this.divided&&(this.corner.forEach(t=>{this[t].clear(),this[t]=void 0}),this.divided=!1)}render(t){t.strokeStyle="#ffffff",t.beginPath(),t.strokeRect(this.boundary.x,this.boundary.y,this.boundary.width,this.boundary.height),t.stroke(),this.divided&&this.corner.forEach(e=>{this[e].render(t)})}}},function(t,e,i){"use strict";i.d(e,"a",(function(){return s})),i.d(e,"b",(function(){return r}));const s=function(t,e=250){let i=null;return function(){const s=this,n=arguments;clearTimeout(i),i=setTimeout(()=>{t.apply(s,n)},e)}},n=new Array(200);for(let t=0,e=n.length;t<e;t++)n[t]=1-2*Math.random();const r=function(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}},,,function(t,e,i){"use strict";i.r(e);var s=i(1),n=i(3),r=i(4),a=i(0);i(2);const o=document.getElementById("canvas"),h=o.getContext("2d");let c=o.width,l=o.height,u=new n.b(0,0,c,l),d=new n.a(u,10);let f;const p=()=>{o.width=c=window.innerWidth,o.height=l=window.innerHeight,u.width=c,u.height=l,d.reset(u,20),f=new Array(Math.ceil(c*l/1e3));for(let t=0;t<f.length;t++){const e=5+5*Math.random();f[t]=new s.a({color:`hsl(${Math.floor(360*Math.random())},100%,50%)`,radius:e,pos:[e+(c-2*e)*Math.random(),e+(l-2*e)*Math.random()],restitution:1});const i=100,n=2*Math.PI*Math.random();f[t].linearVel=[Math.cos(n)*i,Math.sin(n)*i]}};window.addEventListener("resize",Object(r.a)(p)),p(),o.addEventListener("click",t=>{const e=[t.offsetX,t.offsetY],i=100,s=new n.b(e[0]-i,e[1]-i,200,200);d.query(s).forEach(t=>{const s=a.a.distance(t.point,e);if(s<=i){const n=1e5*(1-s/i),r=a.a.normalize(a.a.sub(f[t.key].pos,e));f[t.key].addForce(a.a.scale(r,n))}})});let b=0;const y=t=>{requestAnimationFrame(y);const e=Math.min(Math.max((t-b)/1e3,.01),.05);b=t,(t=>{h.fillStyle="#000000",h.fillRect(0,0,c,l);const e=t/1;for(let t=0;t<1;t++){for(let t=0;t<f.length;t++)f[t].update(e);d.clear();for(let t=0;t<f.length;t++)d.insert({key:t,point:f[t].pos});for(let t=0;t<f.length;t++){const e=f[t].radius+10,i=f[t].radius+10,r=new n.b(f[t].pos[0]-e,f[t].pos[1]-i,2*e,2*i),a=d.query(r),o=f[t];for(let e=0;e<a.length;e++){const i=a[e].key;if(t===i)continue;const n=f[i];s.a.collide(o,n)}}const t=1;s.a.constraint(f,[c,0],[0,0],t),s.a.constraint(f,[0,l],[c,l],t),s.a.constraint(f,[0,0],[0,l],t),s.a.constraint(f,[c,l],[c,0],t)}for(let t=0;t<f.length;t++)f[t].render(h)})(e),h.font="18px Noto Sans TC",h.textAlign="start",h.textBaseline="hanging",h.fillStyle="#ffffff",h.fillText((1/e).toFixed(1),10,10)};requestAnimationFrame(y)}]);
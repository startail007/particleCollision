!function(t){var e={};function r(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(n,a,function(e){return t[e]}.bind(null,a));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=5)}([function(t,e,r){"use strict";r.d(e,"a",(function(){return n})),r.d(e,"b",(function(){return a}));class n{static zero(){return[0,0]}static clone(t){return[...t]}static rotate(t,e){let r=Math.cos(e),n=Math.sin(e);return[t[0]*r-t[1]*n,t[1]*r+t[0]*n]}static dot(t,e){return t[0]*e[0]+t[1]*e[1]}static cross(t,e){return t[0]*e[1]-t[1]*e[0]}static add(t,e){return[t[0]+e[0],t[1]+e[1]]}static sub(t,e){return[t[0]-e[0],t[1]-e[1]]}static mul(t,e){return[t[0]*e[0],t[1]*e[1]]}static div(t,e){return[t[0]/e[0],t[1]/e[1]]}static projection(t,e){var r=n.dot(t,e)/n.dot(e,e);return[e[0]*r,e[1]*r]}static length(t){return Math.sqrt(n.dot(t,t))}static scale(t,e){return[t[0]*e,t[1]*e]}static divScale(t,e){return[t[0]/e,t[1]/e]}static collisionCalc(t,e,r,a){return n.scale(n.add(n.scale(t,r-a),n.scale(e,2*a)),1/(r+a))}static distance(t,e){return n.length(n.sub(t,e))}static normalize(t){const e=n.length(t);return e?n.scale(t,1/e):n.clone(t)}static normal(t){return[-t[1],t[0]]}static negate(t){return[-t[0],-t[1]]}static floor(t){return[Math.floor(t[0]),Math.floor(t[1])]}static ceil(t){return[Math.ceil(t[0]),Math.ceil(t[1])]}static round(t){return[Math.round(t[0]),Math.round(t[1])]}static mix(t,e,r){return n.add(n.scale(t,1-r),n.scale(e,r))}}class a{static set(t,e){return t[0]=e[0],t[1]=e[1],t}static add(t,e){return t[0]+=e[0],t[1]+=e[1],t}static sub(t,e){return t[0]-=e[0],t[1]-=e[1],t}static scale(t,e){return t[0]*=e,t[1]*=e,t}static divScale(t,e){return t[0]/=e,t[1]/=e,t}}},function(t,e,r){"use strict";r.d(e,"a",(function(){return s}));var n=r(0);var a=r(2);class s{constructor({color:t="#000000",pos:e=[0,0],radius:r=10,density:a=1,restitution:s=1}){this.color=t,this.pos=n.a.clone(e),this.linearVel=n.a.zero(),this.density=a,this.radius=r,this.area=this.radius*this.radius*Math.PI,this.mass=this.density*this.area,this.invMass=this.mass?1/this.mass:0,this.restitution=s,this.force=n.a.zero()}update(t){n.b.add(this.linearVel,n.a.scale(this.force,t)),n.b.add(this.pos,n.a.scale(this.linearVel,t)),this.force=n.a.zero()}render(t){t.fillStyle=this.color,t.beginPath(),t.arc(...this.pos,this.radius,0,2*Math.PI),t.fill()}static constraint(t,e,r,s){const i=n.a.sub(r,e),o=n.a.normal(n.a.normalize(i));t.forEach(t=>{const r=n.a.sub(t.pos,e),c=n.a.cross(r,i)/n.a.length(i)-t.radius;if(c<0){n.b.sub(t.pos,n.a.scale(o,Math.abs(c)));const e=a.a.resolveCollisionBasic(t.linearVel,n.a.zero(),t.invMass,0,Math.min(t.restitution,s),o);if(!e)return;n.b.sub(t.linearVel,n.a.scale(e,t.invMass))}})}addForce(t){this.force=t}static collide(t,e){const r=a.a.intersectCircles(t.pos,t.radius,e.pos,e.radius);if(!r)return;const{normal:s,depth:i}=r,o=n.a.scale(s,.5*i);n.b.sub(t.pos,o),n.b.add(e.pos,o);const c=Math.min(t.restitution,e.restitution),l=a.a.resolveCollisionBasic(t.linearVel,e.linearVel,t.invMass,e.invMass,c,s);l&&(n.b.sub(t.linearVel,n.a.scale(l,t.invMass)),n.b.add(e.linearVel,n.a.scale(l,e.invMass)))}}},function(t,e,r){"use strict";r.d(e,"a",(function(){return a}));var n=r(0);class a{static resolveCollisionBasic(t,e,r,a,s,i){const o=n.a.sub(e,t);if(n.a.dot(o,i)>0)return;const c=-(1+s)*n.a.dot(o,i)/(r+a);return n.a.scale(i,c)}static intersectCircles(t,e,r,a){const s=n.a.distance(t,r),i=e+a;if(s>=i)return;return{normal:n.a.normalize(n.a.sub(r,t)),depth:i-s}}}},,function(t,e,r){"use strict";r.d(e,"a",(function(){return n})),r.d(e,"b",(function(){return s}));const n=function(t,e=250){let r=null;return function(){const n=this,a=arguments;clearTimeout(r),r=setTimeout(()=>{t.apply(n,a)},e)}},a=new Array(200);for(let t=0,e=a.length;t<e;t++)a[t]=1-2*Math.random();const s=function(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}},function(t,e,r){"use strict";r.r(e);var n=r(1),a=r(4);let s,i,o,c;s=document.getElementById("canvas"),i=s.getContext("2d"),o=s.width,c=s.height;const l=!Object(a.b)();let u=[];for(let t=0;t<(l?2e3:1e3);t++){let t=3+3*Math.random();const e=new n.a({color:`hsl(${Math.floor(360*Math.random())},100%,50%)`,pos:[t+(o-2*t)*Math.random(),t+(c-2*t)*Math.random()],radius:t,restitution:1}),r=25,a=2*Math.PI*Math.random();e.linearVel=[Math.cos(a)*r,Math.sin(a)*r],u.push(e)}let d=0,f=function(t){requestAnimationFrame(f);const e=Math.min(Math.max((t-d)/1e3,.01),.05);d=t,function(t){i.fillStyle="#000000",i.fillRect(0,0,o,c);for(let t=0;t<u.length;t++)u[t].update(.1);for(let t=0;t<u.length;t++){const e=u[t];for(let r=0;r<u.length;r++){if(t===r)continue;const a=u[r];n.a.collide(e,a)}}n.a.constraint(u,[o,0],[0,0],1),n.a.constraint(u,[0,c],[o,c],1),n.a.constraint(u,[0,0],[0,c],1),n.a.constraint(u,[o,c],[o,0],1);for(let t=0;t<u.length;t++)u[t].render(i)}(),i.font="18px Noto Sans TC",i.textAlign="start",i.textBaseline="hanging",i.fillStyle="#ffffff",i.fillText((1/e).toFixed(1),10,10)};requestAnimationFrame(f)}]);
!function(t){var e={};function n(r){if(e[r])return e[r].exports;var a=e[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(r,a,function(e){return t[e]}.bind(null,a));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=5)}([function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"b",(function(){return a}));class r{static zero(){return[0,0]}static clone(t){return[...t]}static rotate(t,e){let n=Math.cos(e),r=Math.sin(e);return[t[0]*n-t[1]*r,t[1]*n+t[0]*r]}static dot(t,e){return t[0]*e[0]+t[1]*e[1]}static cross(t,e){return t[0]*e[1]-t[1]*e[0]}static add(t,e){return[t[0]+e[0],t[1]+e[1]]}static sub(t,e){return[t[0]-e[0],t[1]-e[1]]}static projection(t,e){var n=r.dot(t,e)/r.dot(e,e);return[e[0]*n,e[1]*n]}static length(t){return Math.sqrt(r.dot(t,t))}static scale(t,e){return[t[0]*e,t[1]*e]}static collisionCalc(t,e,n,a){return r.scale(r.add(r.scale(t,n-a),r.scale(e,2*a)),1/(n+a))}static distance(t,e){return r.length(r.sub(t,e))}static normalize(t){const e=r.length(t);return e?r.scale(t,1/e):r.clone(t)}static normal(t){return[-t[1],t[0]]}static negate(t){return[-t[0],-t[1]]}}class a{static set(t,e){return t[0]=e[0],t[1]=e[1],t}static add(t,e){return t[0]+=e[0],t[1]+=e[1],t}static sub(t,e){return t[0]-=e[0],t[1]-=e[1],t}static scale(t,e){return t[0]*=e,t[1]*=e,t}}},function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));var r=n(0);var a=n(2);class s{constructor({color:t="#000000",pos:e=[0,0],radius:n=10,density:a=1,restitution:s=1}){this.color=t,this.pos=r.a.clone(e),this.linearVel=r.a.zero(),this.density=a,this.radius=n,this.area=this.radius*this.radius*Math.PI,this.mass=this.density*this.area,this.invMass=this.mass?1/this.mass:0,this.restitution=s,this.force=r.a.zero()}update(t){r.b.add(this.linearVel,r.a.scale(this.force,t)),r.b.add(this.pos,r.a.scale(this.linearVel,t)),this.force=r.a.zero()}render(t){t.fillStyle=this.color,t.beginPath(),t.arc(...this.pos,this.radius,0,2*Math.PI),t.fill()}static constraint(t,e,n,s){const i=r.a.sub(n,e),o=r.a.normal(r.a.normalize(i));t.forEach(t=>{const n=r.a.sub(t.pos,e),c=r.a.cross(n,i)/r.a.length(i)-t.radius;if(c<0){r.b.sub(t.pos,r.a.scale(o,Math.abs(c)));const e=a.a.resolveCollisionBasic(t.linearVel,r.a.zero(),t.invMass,0,Math.min(t.restitution,s),o);if(!e)return;r.b.sub(t.linearVel,r.a.scale(e,t.invMass))}})}addForce(t){this.force=t}static collide(t,e){const n=a.a.intersectCircles(t.pos,t.radius,e.pos,e.radius);if(!n)return;const{normal:s,depth:i}=n,o=r.a.scale(s,.5*i);r.b.sub(t.pos,o),r.b.add(e.pos,o);const c=Math.min(t.restitution,e.restitution),l=a.a.resolveCollisionBasic(t.linearVel,e.linearVel,t.invMass,e.invMass,c,s);l&&(r.b.sub(t.linearVel,r.a.scale(l,t.invMass)),r.b.add(e.linearVel,r.a.scale(l,e.invMass)))}}},function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(0);class a{static resolveCollisionBasic(t,e,n,a,s,i){const o=r.a.sub(e,t);if(r.a.dot(o,i)>0)return;const c=-(1+s)*r.a.dot(o,i)/(n+a);return r.a.scale(i,c)}static intersectCircles(t,e,n,a){const s=r.a.distance(t,n),i=e+a;if(s>=i)return;return{normal:r.a.normalize(r.a.sub(n,t)),depth:i-s}}}},,function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"b",(function(){return s}));const r=function(t,e=250){let n=null;return function(){const r=this,a=arguments;clearTimeout(n),n=setTimeout(()=>{t.apply(r,a)},e)}},a=new Array(200);for(let t=0,e=a.length;t<e;t++)a[t]=1-2*Math.random();const s=function(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}},function(t,e,n){"use strict";n.r(e);var r=n(1),a=n(4);let s,i,o,c;s=document.getElementById("canvas"),i=s.getContext("2d"),o=s.width,c=s.height;const l=!Object(a.b)();let u=[];for(let t=0;t<(l?2e3:1e3);t++){let t=3+3*Math.random();const e=new r.a({color:`hsl(${Math.floor(360*Math.random())},100%,50%)`,pos:[t+(o-2*t)*Math.random(),t+(c-2*t)*Math.random()],radius:t,restitution:1}),n=25,a=2*Math.PI*Math.random();e.linearVel=[Math.cos(a)*n,Math.sin(a)*n],u.push(e)}let d=0,f=function(t){requestAnimationFrame(f);const e=Math.min(Math.max((t-d)/1e3,.01),.05);d=t,function(t){i.fillStyle="#000000",i.fillRect(0,0,o,c);for(let t=0;t<u.length;t++)u[t].update(.1);for(let t=0;t<u.length;t++){const e=u[t];for(let n=0;n<u.length;n++){if(t===n)continue;const a=u[n];r.a.collide(e,a)}}r.a.constraint(u,[o,0],[0,0],1),r.a.constraint(u,[0,c],[o,c],1),r.a.constraint(u,[0,0],[0,c],1),r.a.constraint(u,[o,c],[o,0],1);for(let t=0;t<u.length;t++)u[t].render(i)}(),i.font="18px Noto Sans TC",i.textAlign="start",i.textBaseline="hanging",i.fillStyle="#ffffff",i.fillText((1/e).toFixed(1),10,10)};requestAnimationFrame(f)}]);
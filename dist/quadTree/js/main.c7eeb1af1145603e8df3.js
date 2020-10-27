!function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=7)}([,function(t,e){t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e){function n(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}t.exports=function(t,e,i){return e&&n(t.prototype,e),i&&n(t,i),t}},function(t,e,n){"use strict";n.d(e,"b",(function(){return h})),n.d(e,"a",(function(){return a}));var i=n(1),r=n.n(i),o=n(2),s=n.n(o),h=function(){function t(e,n,i,o){r()(this,t),this.x=e,this.y=n,this.width=i,this.height=o}return s()(t,[{key:"constains",value:function(t){return t[0]>=this.x&&t[0]<=this.x+this.width&&t[1]>=this.y&&t[1]<=this.y+this.height}},{key:"intersect",value:function(t){return!(t.x>this.x+this.width||t.x+t.width<this.x||t.y>this.y+this.height||t.y+t.height<this.y)}}]),t}(),a=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:4,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:5,s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0;r()(this,t),this.corner=["northwest","northeast","southeast","southwest"],this.reset(e,n,i,o,s)}return s()(t,[{key:"reset",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:4,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:5,r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0;this.clear(),this.boundary=t,this.center=[t.x+.5*t.width,t.y+.5*t.height],this.minRange=e,this.maxPoints=n,this.maxLevel=i,this.level=r,this.points=[],this.divided=!1}},{key:"subdivide",value:function(){var e=this,n=.5*this.boundary.width,i=.5*this.boundary.height,r=[[0,0],[n,0],[n,i],[0,i]];this.corner.forEach((function(o,s){e[o]=new t(new h(e.boundary.x+r[s][0],e.boundary.y+r[s][1],n,i),e.minRange,e.maxPoints,e.maxLevel,e.level+1)}))}},{key:"insertOrientation",value:function(t){t.point[0]<this.center[0]?t.point[1]<this.center[1]?this.northwest.insert(t):this.southwest.insert(t):t.point[1]<this.center[1]?this.northeast.insert(t):this.southeast.insert(t)}},{key:"insert",value:function(t){if(this.divided)this.insertOrientation(t);else if(this.points.length<this.maxPoints||this.level>this.maxLevel||this.boundary.width<=this.minRange||this.boundary.height<=this.minRange)this.points.push(t);else{this.divided=!0,this.subdivide();for(var e=0;e<this.points.length;e++)this.insertOrientation(this.points[e]);this.points=[],this.insertOrientation(t)}}},{key:"query",value:function(t,e){var n=this;if(e||(e=[]),!this.boundary.intersect(t))return e;if(this.divided)this.corner.forEach((function(i){n[i].query(t,e)}));else for(var i=0;i<this.points.length;i++)t.constains(this.points[i].point)&&e.push(this.points[i]);return e}},{key:"clear",value:function(){var t=this;this.points=[],this.divided&&(this.corner.forEach((function(e){t[e].clear(),t[e]=void 0})),this.divided=!1)}},{key:"render",value:function(t){var e=this;t.strokeStyle="#ffffff",t.beginPath(),t.strokeRect(this.boundary.x,this.boundary.y,this.boundary.width,this.boundary.height),t.stroke(),this.divided&&this.corner.forEach((function(n){e[n].render(t)}))}}]),t}()},,,,function(t,e,n){"use strict";n.r(e);var i,r,o,s,h=n(3);i=document.getElementById("canvas"),r=i.getContext("2d"),o=i.width,s=i.height;var a=[0,0],u=!1;i.addEventListener("mousedown",(function(t){u=!0})),window.addEventListener("mouseup",(function(t){u=!1})),i.addEventListener("mousemove",(function(t){if(a[0]=t.offsetX,a[1]=t.offsetY,u){var e=[].concat(a);l.push(e),c.insert({key:l.length-1,point:e})}}));for(var f=new h.b(0,0,o,s),l=[],d=0;d<10;d++)l.push([Math.random()*o,Math.random()*s]);var c=new h.a(f,2,4,8);function v(){r.fillStyle="#000000",r.fillRect(0,0,o,s),r.save();for(var t=0;t<l.length;t++)l[t][0]+=1-2*Math.random(),l[t][1]+=1-2*Math.random();c.clear();for(var e=0;e<l.length;e++)c.insert({key:e,point:l[e]});r.lineWidth=.5,c.render(r),r.fillStyle="#00ffff";for(var n=0;n<l.length;n++)r.beginPath(),r.arc(l[n][0],l[n][1],2,0,2*Math.PI),r.fill();var i,u;i=new h.b(a[0]-100,a[1]-100,200,200),u=c.query(i);for(var f=0;f<u.length;f++)r.fillStyle="#ff00ff",r.beginPath(),r.arc(u[f].point[0],u[f].point[1],3,0,2*Math.PI),r.fill();r.strokeStyle="#00ff00",r.lineWidth=3,r.beginPath(),r.strokeRect(i.x,i.y,i.width,i.height),r.stroke(),r.restore()}i.addEventListener("click",(function(t){a[0]=t.offsetX,a[1]=t.offsetY;var e=[].concat(a);l.push(e),c.insert({key:l.length-1,point:e})})),v();var y=Date.now();!function t(){requestAnimationFrame(t);var e=Date.now(),n=(e-y)/1e3;y=e,v(),r.font="bold 18px Noto Sans TC",r.textAlign="start",r.textBaseline="hanging",r.fillStyle="#ffffff",r.fillText((1/n).toFixed(1),10,10)}()}]);
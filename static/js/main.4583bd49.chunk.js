(this["webpackJsonpchant-accumulator"]=this["webpackJsonpchant-accumulator"]||[]).push([[0],{13:function(t,e,n){},14:function(t,e,n){},17:function(t,e,n){"use strict";n.r(e);var c=n(1),r=n.n(c),a=n(7),i=n.n(a),o=(n(13),n(14),n(3)),s=n(2),u=n.n(s),l=n(8),j=n(0),d={log:[],timestamp:null,actionToggle:function(){throw Error("Error: Uninitialized context")}},m=r.a.createContext(d),h=function(t){var e=t.children,n=t.defaultValue,r=Object(c.useState)([]),a=Object(o.a)(r,2),i=a[0],s=a[1],d=Object(c.useState)(n?n.timestamp:null),h=Object(o.a)(d,2),b=h[0],p=h[1];return Object(j.jsx)(m.Provider,{value:{actionToggle:function(){var t=u()().unix();b?(s([].concat(Object(l.a)(i),[{timeIn:b,timeOut:t.toString()}])),p(null)):p(t.toString())},log:i,timestamp:b},children:e})},b=function(){return r.a.useContext(m)},p=function(){var t=function(){var t=b().timestamp,e=u()().set({hour:0,minute:0,second:0,millisecond:0}),n=Object(c.useState)(e),r=Object(o.a)(n,1)[0],a=Object(c.useState)(r),i=Object(o.a)(a,2),s=i[0],l=i[1];return Object(c.useEffect)((function(){var n=setTimeout((function(){l(t?u.a.duration(u()().diff(u.a.unix(parseInt(t)))):e)}),100);return function(){clearTimeout(n)}})),{hour:s.hours(),minute:s.minutes(),seconds:s.seconds(),milliseconds:Math.floor(.1*s.milliseconds())}}(),e=t.hour,n=t.minute,r=t.seconds,a=t.milliseconds;return Object(j.jsxs)("h1",{children:[Object(j.jsx)("span",{children:e.toString().padStart(2,"0")}),":",Object(j.jsx)("span",{children:n.toString().padStart(2,"0")}),":",Object(j.jsx)("span",{children:r.toString().padStart(2,"0")}),":",Object(j.jsx)("small",{children:a.toString().padStart(2,"0")})]})};function O(t,e){var n=new Date(1e3*t),c=new Date(1e3*e),r=Math.abs(c.getTime()-n.getTime()),a=Math.floor(r/1e3/60/60),i=Math.floor(r/1e3/60),o=Math.floor(r/1e3);return a.toString().padStart(2,"0")+":"+i.toString().padStart(2,"0")+":"+o.toString().padStart(2,"0")}var f=function(){var t=b().log;return Object(j.jsx)("ol",{children:t.map((function(t,e){return Object(j.jsx)("li",{children:O(parseInt(t.timeIn),parseInt(t.timeOut))},e)}))})},g=function(){var t=b(),e=t.actionToggle,n=t.timestamp;return Object(j.jsxs)("div",{className:"App",children:[Object(j.jsx)("header",{className:"App-header",children:"time-accumulator "}),Object(j.jsxs)("main",{className:"App-main",children:[Object(j.jsx)(p,{}),Object(j.jsx)(f,{})]}),Object(j.jsx)("button",{onClick:e,children:n?"Stop":"Start"})]})},S=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,18)).then((function(e){var n=e.getCLS,c=e.getFID,r=e.getFCP,a=e.getLCP,i=e.getTTFB;n(t),c(t),r(t),a(t),i(t)}))};i.a.render(Object(j.jsx)(r.a.StrictMode,{children:Object(j.jsx)(h,{children:Object(j.jsx)(g,{})})}),document.getElementById("root")),S()}},[[17,1,2]]]);
//# sourceMappingURL=main.4583bd49.chunk.js.map
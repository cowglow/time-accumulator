(this["webpackJsonptime-accumulator"]=this["webpackJsonptime-accumulator"]||[]).push([[0],{10:function(t,e,n){t.exports={root:"ActionController_root__2kE3f"}},11:function(t,e,n){t.exports={root:"App_root__1Ylx4"}},19:function(t,e,n){"use strict";n.r(e);var o=n(1),r=n.n(o),i=n(8),c=n.n(i),a=n(2),s=n(3),u=n.n(s),l=n(12),d=function(t,e){var n=Object(o.useState)((function(){var n=window.localStorage.getItem(t);return null!==n?JSON.parse(n):e})),r=Object(a.a)(n,2),i=r[0],c=r[1];return window.localStorage.setItem(t,JSON.stringify(i)),[i,c]},j="Error: Uninitialized context",g=n(0),m={log:[],timestamp:!1,actionToggle:function(){throw Error(j)},resetLog:function(){throw Error(j)}},O=r.a.createContext(m),b=function(t){var e=t.children,n=t.defaultValue,o=!!n&&n.timestamp,r=d("LOCALSTORAGE_CHECKIN_KEY",o),i=Object(a.a)(r,2),c=i[0],s=i[1],j=d("LOCALSTORAGE_LOG_KEY",[]),m=Object(a.a)(j,2),b=m[0],h=m[1];return Object(g.jsx)(O.Provider,{value:{actionToggle:function(){var t=u()().unix();c?(h([].concat(Object(l.a)(b),[{timeIn:c,timeOut:t.toString()}])),s(!1)):s(t.toString())},log:b,timestamp:c,resetLog:function(){h([])}},children:e})},h=function(){return r.a.useContext(O)},f=n(9),p=n.n(f),x=function(){var t=function(){var t=h().timestamp,e=u()().set({hour:0,minute:0,second:0,millisecond:0}),n=Object(o.useState)(e),r=Object(a.a)(n,1)[0],i=Object(o.useState)(r),c=Object(a.a)(i,2),s=c[0],l=c[1];return Object(o.useEffect)((function(){var n=setTimeout((function(){l(t?u.a.duration(u()().diff(u.a.unix(parseInt(t)))):e)}),100);return function(){clearTimeout(n)}})),{hour:s.hours(),minute:s.minutes(),seconds:s.seconds(),milliseconds:Math.floor(.1*s.milliseconds())}}(),e=t.hour,n=t.minute,r=t.seconds;return Object(g.jsx)("div",{className:p.a.root,children:Object(g.jsxs)("h1",{children:[Object(g.jsx)("span",{children:e.toString().padStart(2,"0")}),":",Object(g.jsx)("span",{children:n.toString().padStart(2,"0")}),":",Object(g.jsx)("span",{children:r.toString().padStart(2,"0")})]})})},S=["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];function _(t,e){var n=new Date(1e3*t),o=new Date(1e3*e),r=Math.abs(o.getTime()-n.getTime()),i=Math.floor(r/1e3/60/60)%24,c=Math.floor(r/1e3/60)%60,a=Math.floor(r/1e3)%60;return S[o.getDay()]+" "+o.getDate()+" "+i.toString().padStart(2,"0")+":"+c.toString().padStart(2,"0")+":"+a.toString().padStart(2,"0")+" "+o.getUTCHours()+":"+o.getUTCHours()}var v=n(5),C=n.n(v),T=function(){var t=h().log;return Object(g.jsxs)("div",{className:C.a.root,children:[Object(g.jsx)("div",{className:C.a.gradient}),Object(g.jsx)("ol",{children:t.map((function(t,e){return Object(g.jsx)("li",{className:C.a.log,children:_(parseInt(t.timeIn),parseInt(t.timeOut))},e)}))}),Object(g.jsx)("div",{className:C.a.gradient})]})},L=n(10),N=n.n(L),w=function(t){var e=t.children,n=h(),o=n.actionToggle,r=n.timestamp,i=n.resetLog;return Object(g.jsxs)("div",{className:N.a.root,children:[Object(g.jsx)("button",{onClick:i,children:"Reset Log"}),e,Object(g.jsx)("button",{onClick:o,children:r?"Stop":"Start"})]})},E=n(11),D=n.n(E),I=function(){return Object(g.jsxs)("div",{className:D.a.root,children:[Object(g.jsx)("header",{children:Object(g.jsx)(T,{})}),Object(g.jsx)("main",{children:Object(g.jsx)(w,{children:Object(g.jsx)(x,{})})})]})},y=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,20)).then((function(e){var n=e.getCLS,o=e.getFID,r=e.getFCP,i=e.getLCP,c=e.getTTFB;n(t),o(t),r(t),i(t),c(t)}))};c.a.render(Object(g.jsx)(r.a.StrictMode,{children:Object(g.jsx)(b,{children:Object(g.jsx)(I,{})})}),document.getElementById("root")),y()},5:function(t,e,n){t.exports={root:"LogDisplay_root__3Hw-P",gradient:"LogDisplay_gradient__JDCCU",log:"LogDisplay_log__3BSsN"}},9:function(t,e,n){t.exports={root:"ClockDisplay_root__e5YcN"}}},[[19,1,2]]]);
//# sourceMappingURL=main.cc2df8ea.chunk.js.map
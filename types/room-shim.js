/* TYPES 같은 서버 연결 장치
   Claude의 room 기능(presence / onPeers / join ...)과 같은 모양을 공개 중계 서버(MQTT) 두 곳으로 만들어서,
   GitHub 주소에서도 누구나 같이 할 수 있게 해 줌. Claude 안에서 열면 원래 Claude 기능을 그대로 씀. */
(function(){
 if(window.claude&&window.claude.use)return;
 const qs=new URLSearchParams(location.search);
 const GAME=(document.currentScript&&document.currentScript.dataset.game)||'game';
 const ROOM=(qs.get('room')||'main').toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,24)||'main';
 const URLS=window.__MQTT_URLS||['wss://broker.emqx.io:8084/mqtt','wss://broker.hivemq.com:8884/mqtt'];
 const id='p'+Math.random().toString(36).slice(2,10);
 const ROOT='types/v1/'+GAME+'/'+ROOM;
 let clients=[];const handlers=new Map(); // filter -> fn(topic,str)
 const anyUp=()=>clients.some(c=>c.connected);
 const rooms=new Set();
 function match(f,t){const a=f.split('/'),b=t.split('/');if(a.length!==b.length)return false;for(let i=0;i<a.length;i++)if(a[i]!=='+'&&a[i]!==b[i])return false;return true;}
 function makeRoom(path,name){
  const base=path+'/p/',my=base+id;let myPres={},seq=0,sendT=null,lastSend=0,left=false;
  const others=new Map(),peerFns=[],connFns=[];let snap=[],lastConn=false,pend=false;
  const snapshot=()=>{const l=[{peer:id,by:null,isMe:true,sameTab:true,kind:'viewer',guest:false,presence:Object.freeze({...myPres}),updatedAt:Date.now()}];for(const [k,o] of others)l.push({peer:k,by:null,isMe:false,sameTab:false,kind:'viewer',guest:false,presence:o.presence,updatedAt:o.t});return Object.freeze(l);};
  const push=(joined,leftL)=>{if(pend)return;pend=true;setTimeout(()=>{pend=false;const prev=new Set(snap.map(p=>p.peer));snap=snapshot();const ch={peers:snap,joined:snap.filter(p=>!prev.has(p.peer)),left:[],updated:snap};peerFns.forEach(f=>{try{f(ch);}catch(e){console.warn(e);}});},50);};
  const flush=()=>{sendT=null;if(left)return;lastSend=Date.now();const out=JSON.stringify({q:++seq,d:myPres});clients.forEach(c=>{try{if(c.connected)c.publish(my,out);}catch(e){}});};
  const schedule=()=>{if(sendT)return;sendT=setTimeout(flush,Math.max(0,140-(Date.now()-lastSend)));};
  const onMsg=(topic,s)=>{const pid=topic.slice(base.length);if(pid===id||pid.length>20)return;
   if(!s){if(others.delete(pid))push();return;}if(s.length>8000)return;
   try{const m=JSON.parse(s);if(!m||typeof m.d!=='object'||!m.d)return;const o=others.get(pid);if(o&&m.q<=o.q){o.t=Date.now();return;}
    others.set(pid,{presence:Object.freeze(m.d),q:+m.q||0,t:Date.now()});push();}catch(e){}};
  handlers.set(base+'+',onMsg);clients.forEach(c=>{if(c.connected)c.subscribe(base+'+');});
  const r={name,
   tick(now){let ch=false;for(const [k,o] of others)if(now-o.t>10000){others.delete(k);ch=true;}if(ch)push();if(anyUp()&&now-lastSend>2500)flush();const c=anyUp();if(c!==lastConn){lastConn=c;connFns.forEach(f=>{try{f(c);}catch(e){}});if(c)flush();}},
   bye(){clients.forEach(c=>{try{c.publish(my,'');}catch(e){}});},
   api:Object.freeze({name,
    presence(patch){if(!patch||typeof patch!=='object')return Promise.reject({code:'invalid_argument'});for(const k in patch){if(patch[k]===null)delete myPres[k];else myPres[k]=patch[k];}schedule();return Promise.resolve();},
    onPeers(fn){peerFns.push(fn);setTimeout(()=>{snap=snapshot();fn({peers:snap,joined:snap,left:[],updated:[]});},0);return()=>{const i=peerFns.indexOf(fn);if(i>=0)peerFns.splice(i,1);};},
    peers(){return snap.length?snap:snapshot();},
    onConnection(fn){connFns.push(fn);setTimeout(()=>fn(anyUp()),0);return()=>{const i=connFns.indexOf(fn);if(i>=0)connFns.splice(i,1);};},
    connected(){return anyUp();},
    emit(){return Promise.resolve();},on(){return()=>{};},
    join(n){return joinNamed(n);},
    leave(){left=true;r.bye();handlers.delete(base+'+');clients.forEach(c=>{try{if(c.connected)c.unsubscribe(base+'+');}catch(e){}});rooms.delete(r);return Promise.resolve();}
   })};
  rooms.add(r);return r;}
 const named=new Map();
 async function joinNamed(n){n=String(n||'').toLowerCase().replace(/[^a-z0-9_.-]/g,'').slice(0,48);if(!n)throw {code:'invalid_argument'};
  if(named.has(n)&&rooms.has(named.get(n)))return named.get(n).api;const r=makeRoom(ROOT+'/r/'+n,n);named.set(n,r);return r.api;}
 let lobby=null;
 function start(){if(clients.length)return;
  clients=URLS.map(u=>{const c=window.mqtt.connect(u,{clientId:'ty_'+id+'_'+Math.random().toString(36).slice(2,6),clean:true,keepalive:30,reconnectPeriod:2000,connectTimeout:8000});
   c.on('connect',()=>{const fs=[...handlers.keys()];if(fs.length)c.subscribe(fs);});c.on('error',()=>{});
   c.on('message',(topic,buf)=>{const s=buf.toString();for(const [f,fn] of handlers)if(match(f,topic))fn(topic,s);});return c;});
  setInterval(()=>{const now=Date.now();rooms.forEach(r=>r.tick(now));},500);
  addEventListener('pagehide',()=>rooms.forEach(r=>r.bye()));}
 const ready=new Promise(res=>{if(window.mqtt){res();return;}const sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/mqtt@5.16.1/dist/mqtt.min.js';sc.onload=()=>res();sc.onerror=()=>res();document.head.appendChild(sc);});
 window.claude={use:async name=>{if(name!=='room')return null;await ready;if(!window.mqtt)return null;start();if(!lobby)lobby=makeRoom(ROOT+'/lobby','');return lobby.api;}};
 window.__typesRoom=ROOM;
})();

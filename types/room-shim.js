/* TYPES 같은 서버 연결 장치 — Claude의 room 기능과 같은 모양으로, 공개 중계 서버(MQTT)를 써서 누구나 같이 할 수 있게 함 */
(function(){
 if(window.claude&&window.claude.use)return; // Claude 안에서는 원래 기능 사용
 const qs=new URLSearchParams(location.search);
 const GAME=(document.currentScript&&document.currentScript.dataset.game)||'game';
 const ROOM=(qs.get('room')||'main').toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,24)||'main';
 const URLS=window.__MQTT_URLS||['wss://broker.emqx.io:8084/mqtt','wss://broker.hivemq.com:8884/mqtt'];
 const id='p'+Math.random().toString(36).slice(2,10);
 const base='types/v1/'+GAME+'/'+ROOM+'/p/',my=base+id;
 let mq=null,clients=[],myPres={},seq=0,sendT=null,lastSend=0;
 const others=new Map(); // id -> {presence,q,t}
 const peerFns=[],connFns=[];let lastConn=false,peersSnap=[];
 const anyUp=()=>clients.some(c=>c.connected);
 function snapshot(){const list=[{peer:id,by:null,isMe:true,sameTab:true,kind:'viewer',guest:false,presence:Object.freeze({...myPres}),updatedAt:Date.now()}];
  for(const [k,o] of others)list.push({peer:k,by:null,isMe:false,sameTab:false,kind:'viewer',guest:false,presence:o.presence,updatedAt:o.t});return list;}
 let pushPending=false;
 function pushPeers(){if(pushPending)return;pushPending=true;setTimeout(()=>{pushPending=false;const prev=new Set(peersSnap.map(p=>p.peer));peersSnap=snapshot();const now=new Set(peersSnap.map(p=>p.peer));
  const ch={peers:peersSnap,joined:peersSnap.filter(p=>!prev.has(p.peer)),left:[],updated:peersSnap};peerFns.forEach(f=>{try{f(ch);}catch(e){console.warn(e);}});},60);}
 function connCheck(){const c=anyUp();if(c!==lastConn){lastConn=c;connFns.forEach(f=>{try{f(c);}catch(e){}});if(c){lastSend=0;flush();}}}
 function flush(){sendT=null;lastSend=Date.now();const out=JSON.stringify({q:++seq,d:myPres});clients.forEach(c=>{try{if(c.connected)c.publish(my,out);}catch(e){}});}
 function schedule(){if(sendT)return;const wait=Math.max(0,160-(Date.now()-lastSend));sendT=setTimeout(flush,wait);}
 function onMsg(topic,buf){const pid=topic.slice(base.length);if(pid===id||pid.length>20)return;const s=buf.toString();
  if(!s){if(others.delete(pid))pushPeers();return;}if(s.length>8000)return;
  try{const m=JSON.parse(s);if(!m||typeof m!=='object'||typeof m.d!=='object')return;const o=others.get(pid);if(o&&m.q<=o.q){o.t=Date.now();return;}
   others.set(pid,{presence:Object.freeze(m.d||{}),q:+m.q||0,t:Date.now()});pushPeers();}catch(e){}}
 function start(){if(mq)return;mq=window.mqtt;
  clients=URLS.map(u=>{const c=mq.connect(u,{clientId:'ty_'+id+'_'+Math.random().toString(36).slice(2,6),clean:true,keepalive:30,reconnectPeriod:2000,connectTimeout:8000,will:{topic:my,payload:'',qos:0,retain:false}});
   c.on('connect',()=>{c.subscribe(base+'+');connCheck();});c.on('close',connCheck);c.on('error',()=>{});c.on('message',onMsg);return c;});
  setInterval(()=>{const now=Date.now();let ch=false;for(const [k,o] of others)if(now-o.t>10000){others.delete(k);ch=true;}if(ch)pushPeers();if(anyUp()&&now-lastSend>2500)flush();connCheck();},500);
  addEventListener('pagehide',()=>clients.forEach(c=>{try{c.publish(my,'');}catch(e){}}));}
 const ready=new Promise(res=>{if(window.mqtt){res();return;}const sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/mqtt@5.16.1/dist/mqtt.min.js';sc.onload=()=>res();sc.onerror=()=>res();document.head.appendChild(sc);});
 const roomApi=Object.freeze({
  presence(patch){for(const k in patch){if(patch[k]===null)delete myPres[k];else myPres[k]=patch[k];}schedule();return Promise.resolve();},
  onPeers(fn){peerFns.push(fn);setTimeout(()=>{peersSnap=snapshot();fn({peers:peersSnap,joined:peersSnap,left:[],updated:[]});},0);return()=>{const i=peerFns.indexOf(fn);if(i>=0)peerFns.splice(i,1);};},
  peers(){return peersSnap;},
  onConnection(fn){connFns.push(fn);setTimeout(()=>fn(anyUp()),0);return()=>{const i=connFns.indexOf(fn);if(i>=0)connFns.splice(i,1);};},
  connected(){return anyUp();},
  emit(){return Promise.resolve();},on(){return()=>{};},
  join(){return Promise.reject({code:'not_permitted'});}
 });
 window.claude={use:async name=>{if(name!=='room')return null;await ready;if(!window.mqtt)return null;start();return roomApi;}};
 window.__typesRoom=ROOM;
})();

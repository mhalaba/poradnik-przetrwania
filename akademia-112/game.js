const FONT="'Baloo 2','Nunito',sans-serif";
const SKINS=["#fcd34d","#fbbf24","#d97706","#92400e","#78350f","#ffe4c4"];
const HAIRS=["#1e293b","#78350f","#f59e0b","#ef4444","#7c3aed","#0369a1"];
const SHIRTS=["#22d3ee","#f43f5e","#84cc16","#a78bfa","#fb923c","#38bdf8"];
const GEMS=[[420,520],[700,480],[980,700],[1280,430],[1600,620],[510,900],[880,1100],[1400,980],[1750,880],[620,1400],[1100,1500],[1550,1360],[1900,400],[300,700],[2000,1200],[400,1600],[1700,1550],[900,300],[1250,250],[1850,700]];

function blankHero(n,gnd){ return {name:n,skin:SKINS[0],hair:HAIRS[0],shirt:gnd==="dziewczyna"?SHIRTS[3]:SHIRTS[0],cape:true,hat:false,trail:false,gender:gnd}; }
let G={...blankHero("Iskra","chlopak"), xp:0,gems:0,score:0,best:0,done:{},stars:{},coins:{},pair:false};
let G2={...blankHero("Luna","dziewczyna")};
try{ const r=JSON.parse(localStorage.getItem("miastoSercv3")||"null"); if(r){ Object.assign(G,r.G||r); if(r.G2) Object.assign(G2,r.G2);} }catch(e){}
function save(){ try{ localStorage.setItem("miastoSercv3", JSON.stringify({G,G2})); }catch(e){} try{ hud(); }catch(e){} }

const keys=new Set(); let inj=null;
function mkP(x,y){ return {x,y,vx:0,vy:0,z:0,vz:0,yaw:0,speed:0,bob:0}; }
const p1=mkP(1100,980), p2=mkP(1160,980), cam={x:1100,y:980};
let near=null, last=0, running=false, shake=0, parts=[], mgRAF=0, duo=false;
const cvEl=()=>document.getElementById("cv");
let cv=cvEl(), ctx=null;
let WW=innerWidth, HH=innerHeight;
const S=30;
function wx(x){ return x/S; }
function wz(y){ return y/S; }
let W3=null;

const BUILD=[
  {id:"hq",x:980,y:180,w:240,h:160,c:"#ff8a3d",roof:"#ef4444",name:"BAZA 112"},
  {id:"mall",x:1560,y:220,w:280,h:170,c:"#a78bfa",roof:"#7c3aed",name:"GALERIA"},
  {id:"school",x:220,y:260,w:250,h:170,c:"#60a5fa",roof:"#2563eb",name:"SZKOŁA"},
  {id:"gym",x:1680,y:980,w:230,h:160,c:"#34d399",roof:"#059669",name:"HALA"},
  {id:"clinic",x:180,y:1080,w:220,h:150,c:"#fb7185",roof:"#e11d48",name:"KLINIKA"},
  {id:"shop",x:980,y:1280,w:200,h:140,c:"#fbbf24",roof:"#d97706",name:"SKLEP"}
];
const TREES=[[500,400],[760,360],[1320,520],[1480,780],[390,780],[2000,560],[720,1280],[1320,1600],[1880,1480],[260,1500]];
const NPCS=[
  {name:"Kasia",skin:"#fbbf24",shirt:"#38bdf8",gender:"dziewczyna",line:"Wezwanie w parku. Jezdnia = lava. Trawa żyje. Kod 01.",q:"safe",
    x:980,y:620,yaw:0,bob:0,speed:0,wait:0,ri:0,route:[[980,620],[1180,620],[1180,780],[980,780]]},
  {name:"Max",skin:"#d97706",shirt:"#84cc16",gender:"chlopak",line:"Hala. 110 bpm. Trafiaj w beat. Combo. Kod 04.",q:"cpr",
    x:520,y:700,yaw:0,bob:0,speed:0,wait:0.4,ri:0,route:[[520,700],[900,700],[900,860],[520,860]]},
  {name:"Ola",skin:"#fcd34d",shirt:"#a78bfa",gender:"dziewczyna",line:"Galeria. Zielona skrzynia. Słuchaj głosu. Kod 05.",q:"aed",
    x:1480,y:700,yaw:0,bob:0,speed:0,wait:0.8,ri:0,route:[[1480,700],[1680,700],[1680,860],[1480,860]]},
  {name:"Bartek",skin:"#92400e",shirt:"#f43f5e",gender:"chlopak",line:"Trzy kody: krztuszenie, krew, oparzenie. Kod 06.",q:"other",
    x:520,y:1180,yaw:0,bob:0,speed:0,wait:0.2,ri:0,route:[[520,1180],[720,1180],[720,1380],[520,1380]]},
  {name:"Pani Ewa",skin:"#fcd34d",shirt:"#60a5fa",gender:"dziewczyna",line:"Syrena. Winda to pułapka. Schody albo reset. Kod 08.",q:"alarm",
    x:520,y:520,yaw:0,bob:0,speed:0,wait:1,ri:0,route:[[520,520],[700,520],[700,640],[520,640]]},
  {name:"Nina",skin:"#ffe4c4",shirt:"#22d3ee",gender:"dziewczyna",line:"Za kryształy kupisz pelerynę. Żadnych prawdziwych pieniędzy.",q:"shop",
    x:900,y:1480,yaw:0,bob:0,speed:0,wait:0.5,ri:0,route:[[900,1480],[1220,1480],[1220,1600],[900,1600]]}
];
const PADS=[
  {id:"safe",x:720,y:720,label:"1-1 Park",world:"1-1",goal:"Biegnij do flagi. Skacz, zbieraj monety, omijaj auta!",need:null},
  {id:"check",x:820,y:820,label:"1-2 Halo",world:"1-2",goal:"Uderz klocki ? w kolejności: krzyk, ramiona, klatka.",need:"safe"},
  {id:"call",x:1080,y:360,label:"1-3 112",world:"1-3",goal:"Wybierz 1-1-2 i powiedz gdzie-co-zostaję.",need:"check"},
  {id:"cpr",x:1760,y:1180,label:"1-4 Serce",world:"1-4",goal:"Trafiaj w beat jak w bonusie — 110 na minutę!",need:"call"},
  {id:"aed",x:1680,y:420,label:"1-5 AED",world:"1-5",goal:"Powtórz sekwencję skrzynki. P góra, L bok.",need:"cpr"},
  {id:"other",x:280,y:1280,label:"1-6 Klinika",world:"1-6",goal:"Trzy mini-poziomy: krztuszenie, krew, oparzenie.",need:"aed"},
  {id:"seizure",x:360,y:1180,label:"1-7 Klasa",world:"1-7",goal:"Odsuń ostre, kurtka pod głowę. Czas leci!",need:"other"},
  {id:"alarm",x:340,y:480,label:"1-8 Alarm",world:"1-8",goal:"Do flagi SCHODAMI. Czarna rura = reset.",need:"seizure"},
  {id:"quiz",x:1100,y:260,label:"1-9 Zamek",world:"1-9",goal:"Finał: 112, rytm i wstrząs — jak boss.",need:"alarm"}
];

function esc(s){ const m={"&":"&"+"amp;","<":"&"+"lt;",">":"&"+"gt;","\"":"&"+"quot;","'":"&#39;"}; return String(s).replace(/[&<>"']/g,c=>m[c]); }
function toast(m){ const t=document.getElementById("toast"); if(!t) return; t.textContent=m; t.style.display="block"; clearTimeout(t._h); t._h=setTimeout(()=>t.style.display="none",1600); }
function tone(f,d=.1,ty="sine",v=.07){ try{ const c=tone.ac||(tone.ac=new (AudioContext||webkitAudioContext)()); if(c.state==="suspended") c.resume(); const o=c.createOscillator(),g=c.createGain(); o.type=ty;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(c.destination);o.start(); g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d); o.stop(c.currentTime+d);}catch(e){} }
function cvsPos(e,c){
  const t=(e.touches&&e.touches[0])||(e.changedTouches&&e.changedTouches[0])||e;
  const r=c.getBoundingClientRect();
  return {x:t.clientX-r.left, y:t.clientY-r.top};
}
function bindTap(c, fn){
  if(!c) return;
  let last=0;
  const go=ev=>{
    const now=performance.now(); if(now-last<90) return; last=now;
    if(ev.cancelable) ev.preventDefault();
    const p=cvsPos(ev,c); fn(p.x,p.y,ev);
  };
  c.addEventListener("pointerdown", go, {passive:false});
}
function injectMissionPad(){
  if(document.getElementById("mspad")) return;
  const foot=document.querySelector(".ms-foot"); if(!foot) return;
  const box=document.createElement("div"); box.id="mspad";
  box.innerHTML='<b data-dx="0" data-dy="-1" style="grid-column:2;grid-row:1">▲</b><b data-dx="-1" data-dy="0" style="grid-column:1;grid-row:2">◀</b><b data-dx="1" data-dy="0" style="grid-column:3;grid-row:2">▶</b><b data-dx="0" data-dy="1" style="grid-column:2;grid-row:3">▼</b>';
  foot.prepend(box);
  box.querySelectorAll("b").forEach(b=>{
    const down=e=>{ e.preventDefault(); padDir={x:+b.dataset.dx,y:+b.dataset.dy}; b.classList.add("on"); };
    const up=()=>{ padDir={x:0,y:0}; box.querySelectorAll("b").forEach(x=>x.classList.remove("on")); };
    b.addEventListener("pointerdown",down,{passive:false});
    b.addEventListener("touchstart",down,{passive:false});
    ["pointerup","pointerleave","pointercancel","touchend"].forEach(ev=>b.addEventListener(ev,up));
  });
}
function show(id){ document.querySelectorAll(".screen").forEach(s=>s.classList.remove("on")); const el=document.getElementById(id); if(el) el.classList.add("on"); }
function stopMg(){ if(mgRAF){ cancelAnimationFrame(mgRAF); mgRAF=0; } }

function round(x,a,b,w,h,r){ x.beginPath(); x.moveTo(a+r,b); x.arcTo(a+w,b,a+w,b+h,r); x.arcTo(a+w,b+h,a,b+h,r); x.arcTo(a,b+h,a,b,r); x.arcTo(a,b,a+w,b,r); x.closePath(); }
function limb(x,ox,oy,w,h,rad,rot,fill){
  x.save(); x.translate(ox,oy); x.rotate(rot);
  x.fillStyle=fill; round(x,-w/2,0,w,h,rad); x.fill(); x.stroke();
  x.restore();
}
function drawFig(x,px,py,yaw,g,sc,bob,moving){
  if(moving==null) moving=Math.abs(bob)>0.4;
  x.save(); x.translate(px,py);
  const flip=Math.cos(yaw)<0?-1:1; x.scale(flip,1);
  const girl=g.gender==="dziewczyna";
  const amp=moving?1:0.1;
  const swing=Math.sin(bob)*amp;
  const bounce=moving?Math.abs(Math.sin(bob))*6*sc:Math.sin(bob*0.45)*1.4*sc;
  x.strokeStyle="#111"; x.lineWidth=2;
  x.fillStyle="rgba(0,0,0,.2)"; x.beginPath(); x.ellipse(0,6,16*sc,6.5*sc,0,0,7); x.fill();
  x.translate(0,-bounce);
  const hip=-16*sc, sh=-48*sc;
  limb(x, 11*sc, sh, 9*sc, 26*sc, 3,  swing*0.95, g.shirt);
  limb(x,  6*sc, hip, 10*sc, 24*sc, 3, -swing*0.9, "#1e293b");
  if(g.cape){
    x.fillStyle=girl?"#ec4899":"#ef4444";
    x.save(); x.rotate(-swing*0.18);
    round(x,-22*sc,-54*sc,14*sc,44*sc,4); x.fill(); x.stroke();
    x.restore();
  }
  x.fillStyle=g.shirt; round(x,-16*sc,-52*sc,32*sc,36*sc,5); x.fill(); x.stroke();
  limb(x, -6*sc, hip, 10*sc, 24*sc, 3, swing*0.9, "#1e293b");
  limb(x,-12*sc, sh, 9*sc, 26*sc, 3, -swing*0.95, g.shirt);
  x.fillStyle=g.skin; round(x,-16*sc,-84*sc,32*sc,32*sc,6); x.fill(); x.stroke();
  x.fillStyle=g.hair;
  if(girl){
    x.save(); x.rotate(swing*0.08);
    round(x,-22*sc,-94*sc,44*sc,22*sc,8); x.fill(); x.stroke();
    round(x,-24*sc,-78*sc,10*sc,28*sc,5); x.fill(); x.stroke();
    round(x,14*sc,-78*sc,10*sc,28*sc,5); x.fill(); x.stroke();
    x.restore();
  } else {
    round(x,-18*sc,-92*sc,36*sc,16*sc,6); x.fill(); x.stroke();
  }
  if(g.hat){ x.fillStyle="#ef4444"; round(x,-20*sc,-102*sc,40*sc,14*sc,4); x.fill(); x.stroke(); }
  x.fillStyle="#111"; x.fillRect(-8*sc,-74*sc,4*sc,8*sc); x.fillRect(4*sc,-74*sc,4*sc,8*sc);
  if(girl){ x.beginPath(); x.moveTo(-8*sc,-76*sc); x.lineTo(-14*sc,-78*sc); x.moveTo(8*sc,-76*sc); x.lineTo(14*sc,-78*sc); x.stroke(); }
  x.beginPath(); x.arc(0,-64*sc,6*sc,.15*Math.PI,.85*Math.PI); x.stroke();
  x.restore();
}
function drawR6Dom(el,g){ el.innerHTML=""; const c=document.createElement("canvas"); c.width=86; c.height=120; el.appendChild(c); drawFig(c.getContext("2d"),43,96,0,g,1.15,0,false); }

function hud(){
  if(!document.getElementById("hudname")) return;
  document.getElementById("hudname").textContent = duo ? (G.name+" + "+G2.name) : G.name;
  document.getElementById("hudscore").textContent=G.score;
  const ranks=["STAŻ","JUNIOR","RATOWNIK","112"]; document.getElementById("hudlv").textContent=ranks[Math.min(3,Math.floor(G.xp/80))];
  document.getElementById("xpfill").style.width=(G.xp%80)/80*100+"%";
  document.getElementById("hudgem").textContent=G.gems;
  const next=PADS.find(p=>!G.done[p.id] && (!p.need||G.done[p.need]));
  const n=PADS.filter(p=>G.done[p.id]).length;
  const stars=Object.values(G.stars||{}).reduce((a,b)=>a+b,0);
  document.getElementById("questbox").innerHTML=`<b>ŚWIAT ${next?next.world: "1-9"}</b>${next? next.goal:"Zamek zdobyty — super!"}<br><span class="tiny" style="color:#bfdbfe">${G.score} pkt · ⭐ ${stars} · 🪙 ${G.gems}</span>${next?`<button class="btn" data-chap="${next.id}" style="margin-top:8px;width:100%;padding:10px;background:#fbbf24">START ▶ ${next.label}</button>`:""}`;
}

function resize(){
  const vv=window.visualViewport;
  WW=Math.floor((vv&&vv.width)||innerWidth||cv&&cv.clientWidth||800);
  HH=Math.floor((vv&&vv.height)||innerHeight||cv&&cv.clientHeight||600);
  if(!cv) cv=cvEl();
  if(W3 && W3.renderer){
    const w=Math.max(1, cv.clientWidth||WW);
    const h=Math.max(1, cv.clientHeight||HH);
    W3.camera.aspect=w/h;
    W3.camera.updateProjectionMatrix();
    W3.renderer.setSize(w,h,false);
    return;
  }
  if(!ctx) return;
  const d=Math.min(2,devicePixelRatio||1);
  cv.width=WW*d; cv.height=HH*d; cv.style.width=WW+"px"; cv.style.height=HH+"px";
  ctx.setTransform(d,0,0,d,0,0);
}
function blocked(nx,ny){ if(nx<40||ny<40||nx>2160||ny>1760) return true; return BUILD.some(b=>nx>b.x+8&&nx<b.x+b.w-8&&ny>b.y+24&&ny<b.y+b.h-4); }
function steer(p,ix,iy,jump,dt){
  const mag=Math.hypot(ix,iy);
  if(mag<0.22){ ix=0; iy=0; p.vx=0; p.vy=0; p.speed=0; p.bob+=dt*2; }
  else { ix/=mag; iy/=mag; const sp=230; p.vx=ix*sp; p.vy=iy*sp; p.speed=sp; p.yaw=Math.atan2(-p.vx,-p.vy); p.bob+=dt*14; }
  let nx=p.x+p.vx*dt, ny=p.y+p.vy*dt;
  if(!blocked(nx,p.y)) p.x=nx; if(!blocked(p.x,ny)) p.y=ny;
  if(jump && p.z<=0){ p.vz=280; tone(520,.07,"square",.04); }
  p.vz-=900*dt; p.z+=p.vz*dt; if(p.z<0){ p.z=0; p.vz=0; }
}

function nearPad(x,y){ return PADS.some(p=>Math.hypot(x-p.x,y-p.y)<78); }
function walkNpc(n,dt){
  if(n.wait>0){ n.wait-=dt; n.speed=0; n.bob+=dt*2; return; }
  const tgt=n.route[n.ri];
  let dx=tgt[0]-n.x, dy=tgt[1]-n.y, d=Math.hypot(dx,dy);
  if(d<10){ n.ri=(n.ri+1)%n.route.length; n.wait=0.35+Math.random()*1.1; n.speed=0; return; }
  const sp=78; dx/=d; dy/=d;
  let nx=n.x+dx*sp*dt, ny=n.y+dy*sp*dt;
  if(nearPad(nx,ny)||blocked(nx,ny)){ n.ri=(n.ri+1)%n.route.length; n.wait=0.2; return; }
  n.x=nx; n.y=ny; n.yaw=Math.atan2(-dx,-dy); n.speed=sp; n.bob+=dt*11;
}

function loop(t){
  try{
  const live=cvEl();
  if(live && live!==cv){ cv=live; ctx=null; W3=null; window.__noWebGL=false; resize(); }
  if(!cv){ requestAnimationFrame(function(n){ (window.__bohaterTick||loop)(n); }); return; }
  if(!running){ draw(); requestAnimationFrame(loop); return; }
  const dt=Math.min(.1,(t-(last||t))/1000); last=t;
  const busy=document.getElementById("modal")?.classList.contains("on");
  if(!busy){
    const held=inj||keys;
    let ix=0,iy=0;
    if(held.has("KeyW")||(!duo&&held.has("ArrowUp"))) iy-=1;
    if(held.has("KeyS")||(!duo&&held.has("ArrowDown"))) iy+=1;
    if(held.has("KeyA")||(!duo&&held.has("ArrowLeft"))) ix-=1;
    if(held.has("KeyD")||(!duo&&held.has("ArrowRight"))) ix+=1;
    if(stickV){ ix+=stickV.x; iy+=stickV.y; }
    if(padDir){ ix+=padDir.x; iy+=padDir.y; }
    const mag=Math.hypot(ix,iy);
    if(mag>0.15){
      const fx=Math.sin(camYaw), fz=Math.cos(camYaw);
      const rx=Math.cos(camYaw), rz=-Math.sin(camYaw);
      const wxm=rx*ix + fx*(-iy);
      const wzm=rz*ix + fz*(-iy);
      steer(p1, wxm, wzm, held.has("Space")||jumpHeld, dt);
    } else {
      steer(p1, 0, 0, held.has("Space")||jumpHeld, dt);
    }
    if(duo){
      let jx=0,jy=0;
      if(held.has("ArrowUp")) jy-=1; if(held.has("ArrowDown")) jy+=1;
      if(held.has("ArrowLeft")) jx-=1; if(held.has("ArrowRight")) jx+=1;
      steer(p2,jx,jy,held.has("ShiftLeft")||held.has("ShiftRight"),dt);
    }
    NPCS.forEach(n=>walkNpc(n,dt));
    const tx=duo?(p1.x+p2.x)/2:p1.x, ty=duo?(p1.y+p2.y)/2:p1.y;
    const k=8; cam.x+=(tx-cam.x)*(1-Math.exp(-k*dt)); cam.y+=(ty-40-cam.y)*(1-Math.exp(-k*dt));
    if(shake>0) shake=Math.max(0,shake-dt*3);
    const bodies=duo?[p1,p2]:[p1];
    GEMS.forEach((g,i)=>{
      if(G.coins[i]) return;
      if(bodies.some(p=>Math.hypot(p.x-g[0],p.y-g[1])<28)){ G.coins[i]=1; G.gems++; G.score+=15; G.xp+=4; save(); tone(880,.1); burst(g[0],g[1],"#60a5fa"); toast("+15 pkt"); }
    });
    near=null; let best=90;
    const dmin=(x,y)=>Math.min(...bodies.map(p=>Math.hypot(p.x-x,p.y-y)));
    PADS.forEach(p=>{ const d=dmin(p.x,p.y); if(d<best){ best=d; near={type:"pad",obj:p}; }});
    NPCS.forEach(n=>{ const d=dmin(n.x,n.y); if(d<56&&d<best){ best=d; near={type:"npc",obj:n}; }});
    const pr=document.getElementById("prompt");
    const act=document.body.classList.contains("phone")?"AKCJA":(duo?"E albo Enter":"Naciśnij E");
    if(near){ pr.style.display="block"; pr.textContent = near.type==="npc"
        ? (act+" — pogadaj z "+near.obj.name)
        : (act+" — zacznij: "+near.obj.label); }
    else pr.style.display="none";
    parts=parts.filter(q=>{ q.x+=q.vx*dt; q.y+=q.vy*dt; q.life-=dt; return q.life>0; });
  }
  draw();
  }catch(err){ console.error(err); }
  requestAnimationFrame(function(n){ (window.__bohaterTick||loop)(n); });
}
window.__bohaterTick=loop;
function burst(x,y,col){ for(let i=0;i<12;i++) parts.push({x,y,vx:(Math.random()-.5)*140,vy:-50-Math.random()*90,life:.45+Math.random()*.4,col}); }

function makeLabel(text,x,y,z){
  const c=document.createElement("canvas"); c.width=256; c.height=64;
  const g=c.getContext("2d");
  g.fillStyle="rgba(15,23,42,.82)"; g.fillRect(0,0,256,64);
  g.fillStyle="#f8fafc"; g.font="800 26px Baloo 2,sans-serif"; g.textAlign="center"; g.textBaseline="middle";
  g.fillText(text,128,32);
  const tex=new THREE.CanvasTexture(c);
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex, transparent:true, depthTest:false}));
  spr.position.set(x,y,z); spr.scale.set(5.2,1.3,1);
  return spr;
}
function makeR6(g){
  const T=THREE, group=new T.Group();
  const mat=col=>new T.MeshLambertMaterial({color:col});
  const box=(w,h,d,m,x,y,z)=>{ const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),m); mesh.position.set(x,y,z); mesh.castShadow=true; group.add(mesh); return mesh; };
  const skin=mat(g.skin), shirt=mat(g.shirt), pants=mat("#1e293b"), hair=mat(g.hair);
  box(1.35,1.55,0.72,shirt,0,2.35,0);
  box(1.05,1.05,1.05,skin,0,3.52,0);
  box(1.18,0.4,1.18,hair,0,4.12,0);
  if(g.gender==="dziewczyna"){ box(0.28,1.15,0.28,hair,-0.72,3.35,0); box(0.28,1.15,0.28,hair,0.72,3.35,0); }
  const ll=box(0.42,1.45,0.5,pants,-0.38,0.72,0);
  const rl=box(0.42,1.45,0.5,pants,0.38,0.72,0);
  const la=box(0.36,1.38,0.36,shirt,-0.95,2.22,0);
  const ra=box(0.36,1.38,0.36,shirt,0.95,2.22,0);
  if(g.cape) box(0.1,2.05,1.15, mat(g.gender==="dziewczyna"?"#ec4899":"#ef4444"), 0, 2.35, -0.52);
  if(g.hat) box(1.35,0.3,1.35, mat("#ef4444"), 0, 4.38, 0);
  const face=box(0.18,0.18,0.08, mat("#111"), -0.22, 3.55, 0.54);
  box(0.18,0.18,0.08, mat("#111"), 0.22, 3.55, 0.54);
  group.userData={ll,rl,la,ra};
  return group;
}
function animR6(mesh,bob,moving){
  const u=mesh.userData; if(!u||!u.ll) return;
  const a=moving?Math.sin(bob)*0.85:0;
  u.ll.rotation.x=a; u.rl.rotation.x=-a; u.la.rotation.x=-a*0.75; u.ra.rotation.x=a*0.75;
}
function init3D(){
  if(!window.THREE||!cv||window.__noWebGL) return;
  if(W3 && W3.renderer && W3.renderer.domElement===cv) return;
  if(W3){ try{ W3.renderer.dispose(); }catch(e){} W3=null; }
  try{
  const T=THREE;
  const scene=new T.Scene();
  scene.background=new T.Color(0x6ec8ff);
  scene.fog=new T.Fog(0xa8dcff, 48, 130);
  const camera=new T.PerspectiveCamera(70, WW/Math.max(1,HH), 0.1, 220);
  const mobile=isPhone();
  const renderer=new T.WebGLRenderer({canvas:cv, antialias:!mobile, alpha:false, powerPreference:mobile?"low-power":"default", failIfMajorPerformanceCaveat:false});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1, mobile?1.25:2));
  renderer.setSize(Math.max(1,cv.clientWidth||WW), Math.max(1,cv.clientHeight||HH), false);
  renderer.shadowMap.enabled=!mobile;
  if(T.SRGBColorSpace && renderer.outputColorSpace!==undefined) renderer.outputColorSpace=T.SRGBColorSpace;
  cv.addEventListener("webglcontextlost", e=>{ e.preventDefault(); W3=null; }, {once:true});
  cv.addEventListener("webglcontextrestored", ()=>{ W3=null; window.__noWebGL=false; init3D(); }, {once:true});
  scene.add(new T.HemisphereLight(0xc8ecff, 0x3d8c4a, 1.05));
  const sun=new T.DirectionalLight(0xfff1c2, 1.35);
  sun.position.set(40,55,22); sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);
  const sc=sun.shadow.camera; sc.left=-60; sc.right=60; sc.top=60; sc.bottom=-60;
  scene.add(sun);

  const ground=new T.Mesh(new T.PlaneGeometry(110,95), new T.MeshLambertMaterial({color:0x4caf50}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true;
  ground.position.set(wx(1100),0,wz(900)); scene.add(ground);

  const pathMat=new T.MeshLambertMaterial({color:0xe7d3a1});
  function path(x,y,w,h){
    const m=new T.Mesh(new T.BoxGeometry(w/S,0.07,h/S), pathMat);
    m.position.set(wx(x+w/2),0.04,wz(y+h/2)); m.receiveShadow=true; scene.add(m);
  }
  path(980,360,240,900); path(240,700,1700,90); path(240,420,90,900);

  BUILD.forEach(b=>{
    const h=9.5+b.h/28;
    const mesh=new T.Mesh(new T.BoxGeometry(b.w/S,h,b.h/S), new T.MeshLambertMaterial({color:b.c}));
    mesh.position.set(wx(b.x+b.w/2), h/2, wz(b.y+b.h/2));
    mesh.castShadow=true; mesh.receiveShadow=true; scene.add(mesh);
    const roof=new T.Mesh(new T.BoxGeometry(b.w/S+0.4,0.45,b.h/S+0.4), new T.MeshLambertMaterial({color:b.roof}));
    roof.position.set(mesh.position.x, h+0.22, mesh.position.z); scene.add(roof);
    const win=new T.MeshLambertMaterial({color:0x7dd3fc});
    for(let row=0; row<3; row++){
      for(let i=0;i<3;i++){
        const ww=new T.Mesh(new T.BoxGeometry(0.7,0.8,0.1), win);
        ww.position.set(mesh.position.x-1.4+i*1.4, 2.2+row*2.4, mesh.position.z + b.h/S/2 + 0.06);
        scene.add(ww);
      }
    }
    scene.add(makeLabel(b.name, mesh.position.x, h+1.5, mesh.position.z));
  });
  TREES.forEach(([x,y])=>{
    const trunk=new T.Mesh(new T.CylinderGeometry(0.16,0.22,1.25,6), new T.MeshLambertMaterial({color:0x78350f}));
    trunk.position.set(wx(x),0.62,wz(y)); trunk.castShadow=true; scene.add(trunk);
    const leaf=new T.Mesh(new T.SphereGeometry(1.15,8,6), new T.MeshLambertMaterial({color:0x15803d}));
    leaf.position.set(wx(x),1.85,wz(y)); leaf.castShadow=true; scene.add(leaf);
  });
  const pads={};
  PADS.forEach(p=>{
    const cyl=new T.Mesh(new T.CylinderGeometry(1.15,1.15,0.18,16), new T.MeshLambertMaterial({color:0xfde68a}));
    cyl.position.set(wx(p.x),0.1,wz(p.y)); scene.add(cyl);
    const pole=new T.Mesh(new T.BoxGeometry(0.12,3.1,0.12), new T.MeshLambertMaterial({color:0x111827}));
    pole.position.set(wx(p.x),1.55,wz(p.y)); scene.add(pole);
    const flag=new T.Mesh(new T.BoxGeometry(1.7,0.72,0.08), new T.MeshLambertMaterial({color:0x22d3ee}));
    flag.position.set(wx(p.x)+0.85,2.85,wz(p.y)); scene.add(flag);
    scene.add(makeLabel(p.label, wx(p.x), 3.55, wz(p.y)));
    pads[p.id]={cyl,flag};
  });
  const p1m=makeR6(G); scene.add(p1m);
  const npcs=NPCS.map(n=>{ const m=makeR6(n); scene.add(m); return m; });
  const gems=GEMS.map(([x,y],i)=>{
    const m=new T.Mesh(new T.OctahedronGeometry(0.32), new T.MeshLambertMaterial({color:0x38bdf8, emissive:0x0284c7, emissiveIntensity:0.45}));
    m.position.set(wx(x),0.85,wz(y)); scene.add(m); return m;
  });
  camera.position.set(wx(p1.x)-Math.sin(0.9)*4.6, 3.2, wz(p1.y)-Math.cos(0.9)*4.6);
  W3={scene,camera,renderer,p1m,p2m:null,npcs,pads,gems};
  }catch(err){
    console.warn("WebGL", err);
    window.__noWebGL=true; W3=null;
    try{ ctx=cv.getContext("2d"); }catch(e){}
  }
}

function draw3D(){
  if(!W3) init3D();
  if(!W3) return;
  const {scene,camera,renderer,p1m,npcs,pads,gems}=W3;
  p1m.position.set(wx(p1.x), (p1.z||0)/55, wz(p1.y));
  if(p1.speed>1) p1m.rotation.y=Math.atan2(p1.vx, p1.vy);
  animR6(p1m, p1.bob, p1.speed>1);
  if(duo){
    if(!W3.p2m){ W3.p2m=makeR6(G2); scene.add(W3.p2m); }
    W3.p2m.position.set(wx(p2.x),(p2.z||0)/55,wz(p2.y));
    if(p2.speed>1) W3.p2m.rotation.y=Math.atan2(p2.vx,p2.vy);
    animR6(W3.p2m,p2.bob,p2.speed>1);
  }
  NPCS.forEach((n,i)=>{
    npcs[i].position.set(wx(n.x),0,wz(n.y));
    npcs[i].rotation.y=n.yaw+Math.PI;
    animR6(npcs[i], n.bob, n.speed>1);
  });
  const t=performance.now();
  gems.forEach((m,i)=>{
    m.visible=!G.coins[i];
    m.rotation.y+=0.04;
    m.position.y=0.85+Math.sin(t/350+i)*0.18;
  });
  PADS.forEach(p=>{
    const done=!!G.done[p.id], open=!p.need||G.done[p.need];
    pads[p.id].cyl.material.color.setHex(done?0x4ade80:open?0xfacc15:0x94a3b8);
    pads[p.id].flag.material.color.setHex(done?0x22c55e:open?0x22d3ee:0x64748b);
  });
  const dist=camDist;
  const px=wx(p1.x), py=(p1.z||0)/40, pz=wz(p1.y);
  const cp=camPitch, cy=camYaw;
  const tx=px - Math.sin(cy)*Math.cos(cp)*dist;
  const ty=2.05 + Math.sin(cp)*dist + py;
  const tz=pz - Math.cos(cy)*Math.cos(cp)*dist;
  camera.position.x+=(tx-camera.position.x)*0.28;
  camera.position.y+=(ty-camera.position.y)*0.28;
  camera.position.z+=(tz-camera.position.z)*0.28;
  camera.lookAt(px, 1.75+py, pz);
  renderer.render(scene,camera);
}

function draw(){
  try{
    if(window.THREE && !window.__noWebGL){ draw3D(); if(W3) return; }
  }catch(e){ window.__noWebGL=true; W3=null; }
  if(!ctx){ try{ ctx=cv.getContext("2d"); if(ctx) resize(); }catch(e){} }
  if(!ctx) return;
  draw2D();
}
function draw2D(){
  const ox=WW/2-cam.x+(Math.random()-.5)*shake*8, oy=HH/2-cam.y+(Math.random()-.5)*shake*8;
  ctx.clearRect(0,0,WW,HH);
  const gr=ctx.createLinearGradient(0,0,0,HH); gr.addColorStop(0,"#7ad7ff"); gr.addColorStop(1,"#b8ecff");
  ctx.fillStyle=gr; ctx.fillRect(0,0,WW,HH);
  ctx.fillStyle="#5cd65c"; ctx.fillRect(ox,oy,2200,1800);
  ctx.fillStyle="#4caf50";
  for(let y=0;y<1800;y+=48) for(let x=0;x<2200;x+=48) if(((x+y)/48)%2) ctx.fillRect(ox+x,oy+y,48,48);
  ctx.fillStyle="#e2c48a"; ctx.fillRect(ox+980,oy+360,240,900); ctx.fillRect(ox+240,oy+700,1700,90); ctx.fillRect(ox+240,oy+420,90,900);
  ctx.font="800 15px "+FONT; ctx.textAlign="center";
  BUILD.forEach(b=>{
    ctx.fillStyle=b.c; ctx.strokeStyle="#1b2430"; ctx.lineWidth=3;
    ctx.fillRect(ox+b.x,oy+b.y,b.w,b.h); ctx.strokeRect(ox+b.x,oy+b.y,b.w,b.h);
    ctx.fillStyle=b.roof; ctx.beginPath(); ctx.moveTo(ox+b.x-8,oy+b.y); ctx.lineTo(ox+b.x+b.w/2,oy+b.y-36); ctx.lineTo(ox+b.x+b.w+8,oy+b.y); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle="#7dd3fc"; ctx.fillRect(ox+b.x+18,oy+b.y+28,28,28); ctx.fillRect(ox+b.x+58,oy+b.y+28,28,28);
    ctx.fillStyle="#1b2430"; ctx.fillText(b.name, ox+b.x+b.w/2, oy+b.y+b.h+20);
  });
  ctx.fillStyle="#16a34a"; ctx.fillRect(ox+1520,oy+250,36,50);
  ctx.fillStyle="#fff"; ctx.font="800 12px "+FONT; ctx.fillText("AED",ox+1538,oy+280);
  TREES.forEach(([x,y])=>{ ctx.fillStyle="#166534"; ctx.beginPath(); ctx.arc(ox+x,oy+y-18,22,0,7); ctx.fill(); ctx.strokeStyle="#1b2430"; ctx.stroke(); ctx.fillStyle="#78350f"; ctx.fillRect(ox+x-5,oy+y-4,10,18); });
  PADS.forEach(p=>{
    const done=!!G.done[p.id], open=!p.need||G.done[p.need];
    ctx.beginPath(); ctx.arc(ox+p.x,oy+p.y,28,0,7);
    ctx.fillStyle=done?"#86efac":open?"#fde68a":"#cbd5e1"; ctx.fill(); ctx.lineWidth=3; ctx.strokeStyle="#1b2430"; ctx.stroke();
    if(open&&!done){ ctx.beginPath(); ctx.arc(ox+p.x,oy+p.y,36+Math.sin(performance.now()/200)*5,0,7); ctx.strokeStyle="rgba(250,204,21,.8)"; ctx.stroke(); }
  });
  GEMS.forEach((g,i)=>{ if(G.coins[i]) return; const s=6+Math.sin(performance.now()/200+i)*2; ctx.save(); ctx.translate(ox+g[0],oy+g[1]); ctx.rotate(performance.now()/400+i); ctx.fillStyle="#38bdf8"; ctx.beginPath(); ctx.moveTo(0,-s*1.4); ctx.lineTo(s,0); ctx.lineTo(0,s*1.4); ctx.lineTo(-s,0); ctx.closePath(); ctx.fill(); ctx.strokeStyle="#1b2430"; ctx.lineWidth=2; ctx.stroke(); ctx.restore(); });
  const sprites=[];
  NPCS.forEach(n=>sprites.push({y:n.y, kind:"npc", n}));
  sprites.push({y:p1.y, kind:"p", p:p1, g:G});
  if(duo) sprites.push({y:p2.y, kind:"p", p:p2, g:G2});
  sprites.sort((a,b)=>a.y-b.y);
  sprites.forEach(s=>{
    if(s.kind==="npc"){
      const n=s.n;
      drawFig(ctx,ox+n.x,oy+n.y,n.yaw,{skin:n.skin,hair:"#1e293b",shirt:n.shirt,cape:false,hat:false,gender:n.gender},1,n.bob,n.speed>12);
      tag(ctx,ox+n.x,oy+n.y-112,n.name);
    } else {
      const p=s.p, g=s.g;
      if(g.trail&&p.speed>20){ ctx.fillStyle="rgba(56,189,248,.35)"; ctx.beginPath(); ctx.arc(ox+p.x,oy+p.y,18,0,7); ctx.fill(); }
      drawFig(ctx,ox+p.x,oy+p.y-p.z*.12,p.yaw,g,1.05,p.bob,p.speed>12);
      tag(ctx,ox+p.x,oy+p.y-p.z*.12-114,g.name);
    }
  });
  PADS.forEach(p=>{
    const done=!!G.done[p.id], open=!p.need||G.done[p.need];
    const fx=ox+p.x+32, fy=oy+p.y;
    ctx.strokeStyle="#1b2430"; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(fx,fy); ctx.lineTo(fx,fy-82); ctx.stroke();
    ctx.fillStyle=done?"#86efac":open?"#fde68a":"#e2e8f0";
    ctx.beginPath(); ctx.moveTo(fx,fy-82); ctx.lineTo(fx+92,fy-66); ctx.lineTo(fx,fy-50); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle="#1b2430"; ctx.font="800 13px "+FONT; ctx.textAlign="left";
    ctx.fillText(p.label, fx+8, fy-60);
  });
  parts.forEach(q=>{ ctx.globalAlpha=Math.max(0,q.life); ctx.fillStyle=q.col; ctx.fillRect(ox+q.x,oy+q.y,6,6); }); ctx.globalAlpha=1;
}
function tag(ctx,x,y,t){ ctx.font="800 13px "+FONT; ctx.textAlign="center"; const w=ctx.measureText(t).width+16; ctx.fillStyle="#fff"; ctx.strokeStyle="#1b2430"; ctx.lineWidth=2; ctx.fillRect(x-w/2,y,w,20); ctx.strokeRect(x-w/2,y,w,20); ctx.fillStyle="#1b2430"; ctx.fillText(t,x,y+15); }

function interact(){ if(!near) return; if(near.type==="npc"){ if(near.obj.q==="shop") openShop(); else openTalk(near.obj); return; } startPad(near.obj); }
function openTalk(n){ modal(`<h2>${esc(n.name)}</h2><p>${esc(n.line)}</p><div class="row"><button class="btn teal" id="oktalk">Dobra, lecę</button></div>`); document.getElementById("oktalk").onclick=closeModal; }
function openShop(){
  const items=[{k:"cape",n:"Peleryna",c:0},{k:"hat",n:"Kask 112",c:8},{k:"trail",n:"Smuga",c:12}];
  modal(`<h2>Sklep Niny</h2><p class="tiny">${G.gems} 💎 · ${G.score} pkt · rekord ${G.best}</p>`+items.map(it=>`<button class="choice buy" data-k="${it.k}" data-c="${it.c}">${it.n} · ${it.c||"gratis"} 💎</button>`).join("")+`<div class="row"><button class="btn ghost" id="xshop">Wróć</button></div>`);
  document.getElementById("xshop").onclick=closeModal;
  document.querySelectorAll(".buy").forEach(b=>b.onclick=()=>{ const k=b.dataset.k,c=+b.dataset.c; if(G[k]){ G[k]=false; G2[k]=false; save(); openShop(); return;} if(G.gems<c){ toast("Za mało kryształów!"); return;} G.gems-=c; G[k]=true; G2[k]=true; save(); tone(700,.1); openShop(); });
}
function modal(html){ stopMg(); const pr=document.getElementById("prompt"); if(pr) pr.style.display="none"; const m=document.getElementById("modal"), b=document.getElementById("mbody"); if(!m||!b) return; b.innerHTML=html; m.classList.add("on"); }
function closeModal(){ stopMg(); const m=document.getElementById("modal"); if(m) m.classList.remove("on"); }
function startPad(p){
  if(p.need&&!G.done[p.need]){ toast("Najpierw wcześniejszy kod."); return; }
  const B=BRIEF[p.id];
  if(B) brief(B, ()=>MISSIONS[p.id]&&MISSIONS[p.id]());
  else MISSIONS[p.id]&&MISSIONS[p.id]();
}
const BRIEF={
  safe:{color:"#1d4ed8",loc:"ŚWIAT 1-1",title:"PARK",who:"🍄",say:"Let's-a-go! Biegnij w prawo, skacz, zbieraj złote monety. Auta i dziury resetują. Na mecie Toad zapyta o pasy.",doit:"SKOK = spacja / ▲ / tap. Cel: zielona flaga.",of:2},
  check:{color:"#0369a1",loc:"ŚWIAT 1-2",title:"3 KLOCKI",who:"🍄",say:"Uderz klocki ? od dołu: 1 krzyk, 2 ramiona, 3 klatka. Potem flaga.",doit:"Kolejność jak w bonusie Mario — nie mieszaj numerów.",of:2},
  call:{color:"#c2410c",loc:"ŚWIAT 1-3",title:"KOD 112",who:"🍄",say:"Wklep 1-1-2 jak kod do zamku. Potem jedna odpowiedź dla Toada na linii.",doit:"Numer Europy: 112.",of:2},
  cpr:{color:"#be123c",loc:"ŚWIAT 1-4",title:"SERCE",who:"🍄",say:"Trafiaj w żółty pierścień w rytm 110. Combo = ranga S jak w bonusie.",doit:"Klik albo spacja w beat.",of:1},
  aed:{color:"#15803d",loc:"ŚWIAT 1-5",title:"AED",who:"🍄",say:"Simon mówi. Powtórz sekwencję skrzynki. P góra, L bok.",doit:"Patrz, zapamiętaj, kliknij to samo.",of:2},
  other:{color:"#9d174d",loc:"ŚWIAT 1-6",title:"KLINIKA",who:"🍄",say:"Trzy mini-poziomy: krztuszenie, krew, oparzenie. Cel zawsze na kółku.",doit:"Jedna scena po drugiej.",of:3},
  seizure:{color:"#6d28d9",loc:"ŚWIAT 1-7",title:"KLASA",who:"🍄",say:"Odsuń ostre. Kurtka pod głowę. Nic do ust. Zegar leci.",doit:"Przeciągnij na brzeg.",of:1},
  alarm:{color:"#b91c1c",loc:"ŚWIAT 1-8",title:"SYRENA",who:"🍄",say:"Czarna rura = winda = reset. Skacz po półkach jak po schodach. Flaga = zbiórka.",doit:"W prawo, do flagi, bez czarnych rur.",of:2},
  quiz:{color:"#ea580c",loc:"ŚWIAT 1-9",title:"ZAMEK",who:"🍄",say:"Boss: 112, osiem beatów, wstrząs. Cały łańcuch bez pauzy.",doit:"112 → rytm → WSTRZĄS.",of:1}
};
function brief(o, then){
  msShell({color:o.color,loc:o.loc,title:o.title,who:o.who,say:o.say,doit:o.doit,step:0,of:o.of||1,body:`<div class="ms-pad">
    <p style="text-align:center;color:#fde68a;font-weight:800;margin:8px 0 12px;font-size:18px">LET'S-A-GO!</p>
    <div class="bar" style="margin:0 8px 16px;height:14px;background:#1e293b"><i id="brfill" style="background:#fbbf24"></i></div>
    <div class="row"><button class="btn" id="brgo" style="min-width:72%;height:64px;font-size:20px;background:#fbbf24">START ▶</button></div>
  </div>`});
  let done=false, t0=performance.now();
  const READ=4500;
  const go=()=>{ if(done)return; done=true; stopMg(); then(); };
  const b=document.getElementById("brgo"); if(b) b.onclick=go;
  const tick=now=>{
    if(done) return;
    const k=Math.min(1,(now-t0)/READ);
    const el=document.getElementById("brfill"); if(el) el.style.width=(k*100)+"%";
    const left=Math.ceil((READ-(now-t0))/1000);
    if(b && left>0) b.textContent="PRZYJMIJ WEZWANIE  ·  "+left+"s";
    if(k>=1) go(); else mgRAF=requestAnimationFrame(tick);
  };
  mgRAF=requestAnimationFrame(tick);
}
function dots(step,of){ return `<div class="dots">${Array.from({length:of},(_,i)=>`<i class="dot${i===step?" on":""}"></i>`).join("")}</div>`; }
function msShell(o){
  modal(`<div class="ms">
    <div class="ms-hero" style="background:${o.color}">
      <div><div class="ms-loc">${o.loc}</div><h2>${o.title}</h2></div>
      <div class="ms-sc" id="mgsc">0 pkt</div>
    </div>
    ${dots(o.step||0,o.of||3)}
    <div class="ms-say"><div class="ms-ava">${o.who}</div><div id="mssay">${o.say}</div></div>
    <div class="ms-do" id="msdo">${o.doit}</div>
    ${o.body||'<div class="ms-stage"><canvas id="mg"></canvas></div>'}
    <div class="ms-foot"><span class="train-mini">to tylko trening · w życiu dorosły + 112</span>
      <button class="btn ghost" id="mgskip" style="padding:6px 12px;font-size:14px">Wyjdź</button></div>
  </div>`);
  document.getElementById("mgskip").onclick=closeModal;
  if(!document.getElementById("mg")) return {w:0,h:0,x:null,c:null};
  document.getElementById("mbody").offsetHeight;
  return mgFit(o.h||280);
}
function mgFit(h){
  const c=document.getElementById("mg"), x=c.getContext("2d");
  const box=c.parentElement||c;
  const d=Math.min(2,devicePixelRatio||1);
  const w=Math.max(1, Math.floor(box.clientWidth||640));
  const hh=Math.max(200, Math.floor(box.clientHeight||h||220));
  c.width=w*d; c.height=hh*d;
  x.setTransform(d,0,0,d,0,0);
  return {w,h:hh,x,c};
}
function setDo(t){ const e=document.getElementById("msdo"); if(e) e.innerHTML=t; }
function setSay(t){ const e=document.getElementById("mssay"); if(e) e.innerHTML=t; }
function setSc(n){ const e=document.getElementById("mgsc"); if(e) e.textContent=n+" pkt"; }
function shuffle(a){ const b=a.slice(); for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b; }
function inputXY(){
  const held=inj||keys; let x=0,y=0;
  if(held.has("KeyW")||held.has("ArrowUp")) y-=1;
  if(held.has("KeyS")||held.has("ArrowDown")) y+=1;
  if(held.has("KeyA")||held.has("ArrowLeft")) x-=1;
  if(held.has("KeyD")||held.has("ArrowRight")) x+=1;
  if(typeof stickV!=="undefined" && stickV){ x+=stickV.x; y+=stickV.y; }
  if(typeof padDir!=="undefined" && padDir){ x+=padDir.x; y+=padDir.y; }
  return [x,y];
}
function radioPick(o, opts, onWin){
  let done=false, pts=80, t0=performance.now(), phase="read";
  const READ=5000, ANSWER=20000;
  msShell(Object.assign({body:'<div class="ms-pad" id="rp"></div><div class="bar" style="margin:8px 14px;height:10px;background:#1e293b"><i id="rt" style="background:#22d3ee"></i></div>'}, o));
  const btns=[];
  shuffle(opts).forEach(op=>{
    const b=document.createElement("button"); b.className="choice lock"; b.textContent=op.t;
    b.onclick=()=>{
      if(done||phase==="read"||b.dataset.used) return;
      if(op.ok){ done=true; b.classList.add("good"); pts+=90; tone(820,.1); setTimeout(()=>onWin(pts),220); }
      else { b.dataset.used=1; b.classList.add("bad"); pts=Math.max(0,pts-35); toast("Nie to. Czytaj jeszcze raz."); tone(140,.08,"square"); }
      setSc(pts);
    };
    document.getElementById("rp").appendChild(b); btns.push(b);
  });
  setSc(pts);
  setDo("Czytaj pytanie. Przyciski odblokują się za chwilę.");
  const tick=now=>{
    if(done) return;
    const el=document.getElementById("rt");
    if(phase==="read"){
      const k=Math.min(1,(now-t0)/READ);
      if(el) el.style.width=(k*100)+"%";
      setDo("Czytaj pytanie… "+Math.max(1,Math.ceil((READ-(now-t0))/1000))+" s");
      if(k>=1){ phase="ans"; t0=now; btns.forEach(b=>b.classList.remove("lock")); setDo("Wybierz. Masz 20 sekund."); }
    } else {
      const left=1-(now-t0)/ANSWER;
      if(el) el.style.width=Math.max(0,left)*100+"%";
      if(left<=0){ done=true; onWin(Math.max(15,pts-50)); return; }
    }
    mgRAF=requestAnimationFrame(tick);
  };
  mgRAF=requestAnimationFrame(tick);
}
function runObby(opt, map, onWin){
  const {w,h,x,c}=msShell(opt);
  const rows=map.length, cols=map[0].length;
  let sr=0,sc=0,gr=0,gc=0;
  for(let r=0;r<rows;r++) for(let col=0;col<cols;col++){
    const ch=map[r][col];
    if(ch==="@"){sr=r;sc=col;}
    if(ch==="M"||ch==="T"){gr=r;gc=col;}
  }
  let pr=sr, pc=sc, cd=0, dead=0, flash=0, pts=240, over=false, last=performance.now(), freeze=1.6;
  const trap=ch=>ch==="R"||ch==="W"||ch==="E";
  const wall=ch=>ch==="#";
  function tryMove(dr,dc){
    if(over) return;
    const nr=pr+dr, nc=pc+dc;
    if(nr<0||nc<0||nr>=rows||nc>=cols) return;
    const ch=map[nr][nc];
    if(wall(ch)) return;
    if(trap(ch)){
      dead++; pts=Math.max(0,pts-45); flash=1; pr=sr; pc=sc; tone(110,.12,"square");
      toast(ch==="R"?"JEZDNIA — reset":ch==="W"?"PRĄD — reset":"WINDA — reset");
      return;
    }
    pr=nr; pc=nc;
    if(nr===gr&&nc===gc){ over=true; stopMg(); onWin(pts, dead); }
  }
  c.onclick=null;
  bindTap(c,(mx,my)=>{
    if(freeze>0||over) return;
    const tw=w/cols, th=h/rows;
    const col=Math.floor(mx/tw), row=Math.floor(my/th);
    const dc=Math.sign(col-pc), dr=Math.sign(row-pr);
    if(dc===0&&dr===0) return;
    if(Math.abs(col-pc)>=Math.abs(row-pr)) tryMove(0,dc); else tryMove(dr,0);
  });
  injectMissionPad();
  const tick=now=>{
    if(over) return;
    const dt=Math.min(.05,(now-last)/1000); last=now;
    freeze=Math.max(0,freeze-dt);
    cd-=dt; flash=Math.max(0,flash-dt*4);
    const [ix,iy]=inputXY();
    if(freeze<=0 && cd<=0 && (Math.abs(ix)>0.5||Math.abs(iy)>0.5)){
      if(Math.abs(ix)>=Math.abs(iy)) tryMove(0, ix>0?1:-1); else tryMove(iy>0?1:-1, 0);
      cd=0.12;
    }
    const tw=w/cols, th=h/rows;
    x.fillStyle="#052e16"; x.fillRect(0,0,w,h);
    if(flash>0){ x.fillStyle="rgba(239,68,68,"+(flash*0.35)+")"; x.fillRect(0,0,w,h); }
    for(let r=0;r<rows;r++) for(let col=0;col<cols;col++){
      const ch=map[r][col], px=col*tw, py=r*th;
      if(ch==="R"){ x.fillStyle="#334155"; x.fillRect(px,py,tw,th); x.fillStyle="#facc15"; if((col+Math.floor(now/180))%2===0) x.fillRect(px+tw*0.45,py,3,th); }
      else if(ch==="W"){ x.fillStyle="#854d0e"; x.fillRect(px,py,tw,th); x.strokeStyle="#facc15"; x.lineWidth=2; x.beginPath(); x.moveTo(px+6,py+4); x.lineTo(px+tw*0.4,py+th*0.5); x.lineTo(px+tw-6,py+th-4); x.stroke(); }
      else if(ch==="E"){ x.fillStyle="#0f172a"; x.fillRect(px+4,py+4,tw-8,th-8); x.fillStyle="#64748b"; x.font="800 11px "+FONT; x.textAlign="center"; x.fillText("WINDA", px+tw/2, py+th/2); }
      else if(ch==="#"){ x.fillStyle="#1e293b"; x.fillRect(px,py,tw,th); }
      else { x.fillStyle=(r+col)%2?"#16a34a":"#22c55e"; x.fillRect(px,py,tw,th); }
      if(ch==="M"||ch==="T"){ x.strokeStyle="#fde68a"; x.lineWidth=3; x.strokeRect(px+3,py+3,tw-6,th-6); }
    }
    if(map[gr][gc]==="M") lie(x, gc*tw+tw*0.25, gr*th+th*0.55);
    else { x.fillStyle="#fde68a"; x.font="800 16px "+FONT; x.textAlign="center"; x.fillText("ZBÓRKA", gc*tw+tw/2, gr*th+th*0.6); }
    drawFig(x, pc*tw+tw/2, pr*th+th*0.82, 0, G, Math.min(tw,th)/90, now/80, true);
    x.fillStyle="#f8fafc"; x.font="800 13px "+FONT; x.textAlign="left";
    x.fillText("RESETÓW "+dead, 8, 16);
    if(freeze>0){
      x.fillStyle="rgba(2,6,23,.55)"; x.fillRect(0,0,w,h);
      x.fillStyle="#fde68a"; x.font="800 22px "+FONT; x.textAlign="center";
      x.fillText("CZYTAJ MAPĘ  "+freeze.toFixed(1)+"s", w/2, h/2);
    }
    setSc(pts);
    mgRAF=requestAnimationFrame(tick);
  };
  mgRAF=requestAnimationFrame(tick);
}

function sky(x,w,h,a,b){ const g=x.createLinearGradient(0,0,0,h); g.addColorStop(0,a); g.addColorStop(1,b); x.fillStyle=g; x.fillRect(0,0,w,h); }
function cloud(x,cx,cy,s){ x.fillStyle="rgba(255,255,255,.92)"; x.beginPath(); x.arc(cx,cy,s,0,7); x.arc(cx+s*.9,cy+3,s*.75,0,7); x.arc(cx-s*.7,cy+5,s*.65,0,7); x.fill(); }
function tree2(x,tx,ty){ x.fillStyle="#166534"; x.beginPath(); x.arc(tx,ty-18,20,0,7); x.fill(); x.strokeStyle="#1b2430"; x.lineWidth=2; x.stroke(); x.fillStyle="#78350f"; x.fillRect(tx-5,ty-4,10,18); }
function car2(x,cx,cy,col){
  x.fillStyle="#1b2430"; x.beginPath(); x.arc(cx+14,cy+26,8,0,7); x.arc(cx+50,cy+26,8,0,7); x.fill();
  x.fillStyle=col; round(x,cx,cy,64,22,7); x.fill(); x.strokeStyle="#1b2430"; x.lineWidth=2; x.stroke();
  x.fillStyle="#fdba74"; round(x,cx+12,cy-14,38,16,5); x.fill(); x.stroke();
  x.fillStyle="#7dd3fc"; x.fillRect(cx+16,cy-10,12,10); x.fillRect(cx+32,cy-10,12,10);
}
function lie(x,px,py){
  x.fillStyle="#fb7185"; round(x,px+8,py-10,52,20,8); x.fill(); x.strokeStyle="#1b2430"; x.lineWidth=2; x.stroke();
  x.fillStyle="#fcd34d"; x.beginPath(); x.arc(px,py,14,0,7); x.fill(); x.stroke();
  x.fillStyle="#111"; x.fillRect(px-8,py-4,5,5); x.fillRect(px-1,py-4,5,5);
}
function spark(x,px,py,t){
  x.strokeStyle="#facc15"; x.lineWidth=3; x.beginPath();
  x.moveTo(px,py); x.lineTo(px+8,py+10+Math.sin(t)*3); x.lineTo(px-4,py+18); x.lineTo(px+10,py+30);
  x.stroke(); x.fillStyle="#fef08a"; x.font="800 12px "+FONT; x.fillText("PRĄD", px-8, py-6);
}

const STORY={
  safe:{color:"#0f766e",loc:"KOD 01 · PARK"},
  check:{color:"#0369a1",loc:"KOD 02 · CHECK"},
  call:{color:"#c2410c",loc:"KOD 03 · 112"},
  cpr:{color:"#be123c",loc:"KOD 04 · RYTM"},
  aed:{color:"#15803d",loc:"KOD 05 · AED"},
  other:{color:"#9d174d",loc:"KOD 06 · TRIO"},
  seizure:{color:"#6d28d9",loc:"KOD 07 · DRGAWKI"},
  alarm:{color:"#b91c1c",loc:"KOD 08 · ALARM"},
  quiz:{color:"#ea580c",loc:"KOD 09 · FINAŁ"}
};

function win(id, stars, pts, tip){
  G.done[id]=true; G.stars[id]=Math.max(G.stars[id]||0,stars); G.xp+=20+stars*8; G.gems+=5+stars; G.score+=pts; G.best=Math.max(G.best,G.score); save();
  shake=.7; burst(p1.x,p1.y,"#fbbf24"); tone(523,.1); tone(659,.12); tone(784,.2);
  postScore();
  const S=STORY[id]||{color:"#1d4ed8",loc:"ŚWIAT"};
  const pad=PADS.find(p=>p.id===id);
  modal(`<div class="ms">
    <div class="ms-hero" style="background:${S.color}"><div><div class="ms-loc">${pad?("ŚWIAT "+pad.world):S.loc}</div><h2>COURSE CLEAR!</h2></div><div class="ms-sc">+${pts}</div></div>
    <p style="font-size:42px;text-align:center;margin:18px 0 6px;color:#fbbf24">${"★".repeat(stars)}${"☆".repeat(3-stars)}</p>
    <p style="text-align:center;font-size:22px;font-weight:800;color:#fde68a">SCORE ${G.score}</p>
    <p class="ms-do" style="margin-top:8px">${tip}</p>
    <div class="row" style="padding-bottom:16px">
      <button class="btn" id="okwin" style="background:#fbbf24;min-width:50%">DALEJ ▶</button>
      <button class="btn ghost" id="okboard">Ranking</button>
    </div>
    <p class="train-mini" style="text-align:center;padding-bottom:12px">to gra · w życiu dorosły + 112</p>
  </div>`);
  document.getElementById("okwin").onclick=closeModal;
  document.getElementById("okboard").onclick=()=>showBoard();
}

async function loadBoard(){
  let rows=[];
  try{ const r=await fetch("/api/scores"); if(r.ok) rows=await r.json(); }catch(e){}
  if(!Array.isArray(rows)) rows=[];
  try{
    const local=JSON.parse(localStorage.getItem("miastoBoard")||"[]");
    local.forEach(a=>{ if(!rows.some(b=>b.nick===a.nick && b.score>=a.score)) rows.push(a); });
  }catch(e){}
  rows.sort((a,b)=>(b.score-a.score)||(b.stars-a.stars));
  const seen=new Set(); const out=[];
  rows.forEach(r=>{ if(!seen.has(r.nick)){ seen.add(r.nick); out.push(r);} });
  return out.slice(0,12);
}
async function postScore(){
  const stars=Object.values(G.stars||{}).reduce((a,b)=>a+b,0);
  const payload={nick:G.name||"Bohater",score:G.score,stars};
  try{
    const local=JSON.parse(localStorage.getItem("miastoBoard")||"[]");
    const i=local.findIndex(x=>x.nick===payload.nick);
    if(i<0) local.push(payload); else if(local[i].score<payload.score) local[i]=payload;
    localStorage.setItem("miastoBoard", JSON.stringify(local.slice(-30)));
  }catch(e){}
  try{
    await fetch("/api/scores",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  }catch(e){}
}
async function showBoard(){
  const rows=await loadBoard();
  const me=G.name||"Bohater";
  modal(`<div class="ms">
    <div class="ms-hero" style="background:#0e7490"><div><div class="ms-loc">KOD 112</div><h2>RANKING</h2></div></div>
    <p class="ms-do">TWÓJ SCORE: ${G.score} · BEST ${G.best}</p>
    <ol class="board">${rows.length?rows.map((r,i)=>`<li class="${r.nick===me?"me":""}"><span>${i+1}. ${esc(r.nick)}</span><span>${r.score}</span></li>`).join(""):"<li>Pusto — zalicz kod.</li>"}</ol>
    <div class="row" style="padding-bottom:16px"><button class="btn teal" id="okwin">OK</button></div>
  </div>`);
  document.getElementById("okwin").onclick=closeModal;
}

function runMario(opt, L, onWin){
  const pack=msShell(Object.assign({body:'<div class="ms-stage"><canvas id="mg"></canvas></div>'}, opt));
  const {w,h,x,c}=pack;
  if(!c||!x) return;
  injectMissionPad();
  const Gnd=h-52;
  let px=70, py=Gnd-10, vx=0, vy=0, onG=true, camX=0;
  const coins=(L.coins||[]).map(o=>({x:o.x,y:typeof o.y==="number"?o.y:Gnd-70,got:false}));
  const blocks=(L.blocks||[]).map(o=>({x:o.x,y:o.y,fact:o.fact||"+ moneta!",used:false,need:o.need,bounce:0}));
  const cars=(L.cars||[]).map(o=>({x:o.x,y:Gnd-10,w:70,dead:false,dir:o.dir||1,min:o.min||o.x-80,max:o.max||o.x+180}));
  const pits=L.pits||[];
  const plats=L.plats||[];
  const pipes=L.pipes||[];
  let seqi=0, pts=0, dead=0, over=false, freeze=1.35, last=performance.now();
  const flagX=L.flagX||1700;
  function jump(){ if(onG){ vy=-660; onG=false; tone(720,.05,"square",.04); } }
  bindTap(c,()=>{ if(freeze<=0) jump(); });
  const kd=e=>{ if(["Space","ArrowUp","KeyW"].includes(e.code)){ e.preventDefault(); if(freeze<=0) jump(); } };
  addEventListener("keydown",kd);
  const tick=now=>{
    if(over) return;
    const dt=Math.min(.033,(now-last)/1000); last=now;
    freeze=Math.max(0,freeze-dt);
    if(freeze<=0){
      const [ix,iy]=inputXY();
      if(iy<-0.35||jumpHeld) jump();
      vx=ix*340;
      vy+=1900*dt;
      px+=vx*dt; py+=vy*dt;
      onG=false;
      let gy=Gnd;
      plats.forEach(p=>{ if(px>p.x && px<p.x+p.w && py<=p.y+10 && py>=p.y-28 && vy>=0) gy=p.y; });
      if(py>=gy-10 && vy>=0){ py=gy-10; vy=0; onG=true; }
      pits.forEach(p=>{ if(px>p.x && px<p.x+p.w && py>=Gnd-18){ dead++; pts=Math.max(0,pts-25); px=70; py=Gnd-10; vy=0; toast("Do trawy! Jezdnia resetuje."); tone(120,.1,"square"); }});
      pipes.forEach(p=>{ if(Math.abs(px-p.x)<30 && py>p.y-50 && py<Gnd){ if(p.bad){ dead++; px=70; py=Gnd-10; vy=0; toast("Winda/rura — reset. Idź schodami!"); tone(110,.1,"square"); } else { px-=Math.sign(vx||1)*24; } }});
      cars.forEach(car=>{
        if(car.dead) return;
        car.x+=car.dir*70*dt;
        if(car.x<car.min) car.dir=1; if(car.x>car.max) car.dir=-1;
        if(Math.abs(px-car.x)<42 && Math.abs(py-car.y)<34){
          if(vy>80 && py<car.y){ car.dead=true; vy=-380; pts+=70; tone(900,.08); toast("W grze skok. W życiu: STOP, pasy."); }
          else { dead++; px=70; py=Gnd-10; vy=0; toast("Auto! Reset."); tone(110,.1,"square"); }
        }
      });
      coins.forEach(co=>{ if(!co.got && Math.hypot(px-co.x,py-co.y)<28){ co.got=true; pts+=10; G.gems++; tone(980,.05); }});
      blocks.forEach(b=>{
        b.bounce*=0.82;
        if(!b.used && Math.abs(px-b.x)<28 && py<b.y+26 && py>b.y-12 && vy<0){
          if(b.need!=null && b.need!==seqi){ toast("Nie ten klocek — kolejność jak w Mario!"); vy=160; return; }
          b.used=true; b.bounce=16; vy=150; pts+=45; if(b.need!=null) seqi++; toast(b.fact); tone(523,.09);
        }
      });
      if(px>=flagX){
        over=true; removeEventListener("keydown",kd); stopMg();
        const got=coins.filter(c=>c.got).length;
        onWin(pts+got*8, dead, got, coins.length);
        return;
      }
      if(px<36) px=36;
    }
    camX+=(px-w*0.34-camX)*0.14; if(camX<0) camX=0;
    const grd=x.createLinearGradient(0,0,0,h); grd.addColorStop(0,"#5c94fc"); grd.addColorStop(1,"#9adcff");
    x.fillStyle=grd; x.fillRect(0,0,w,h);
    for(let i=0;i<7;i++) cloud(x, ((i*260-camX*0.35)%(w+220)), 36+(i%3)*26, 20);
    const sx=v=>v-camX;
    x.fillStyle="#5c9400"; x.fillRect(0,Gnd-8,w,8);
    x.fillStyle="#c84c0c"; x.fillRect(0,Gnd,w,h-Gnd);
    for(let gx=Math.floor(camX/32)*32; gx<camX+w+40; gx+=32){ x.strokeStyle="#8b3a0a"; x.strokeRect(sx(gx), Gnd, 32, 28); }
    pits.forEach(p=>{ x.fillStyle="#5c94fc"; x.fillRect(sx(p.x), Gnd-10, p.w, h-Gnd+10); });
    plats.forEach(p=>{ x.fillStyle="#c84c0c"; x.fillRect(sx(p.x), p.y, p.w, 16); x.fillStyle="#fcfc54"; x.fillRect(sx(p.x), p.y, p.w, 4); });
    pipes.forEach(p=>{ x.fillStyle=p.bad?"#1e1b4b":"#00b800"; x.fillRect(sx(p.x-20), p.y, 40, Gnd-p.y); x.fillRect(sx(p.x-26), p.y-14, 52, 20); });
    blocks.forEach(b=>{
      const by=b.y-b.bounce;
      x.fillStyle=b.used?"#c84c0c":"#fcbc3c"; x.fillRect(sx(b.x-16), by-16, 32, 32);
      x.strokeStyle="#1b2430"; x.lineWidth=2; x.strokeRect(sx(b.x-16), by-16, 32, 32);
      x.fillStyle="#1b2430"; x.font="800 20px "+FONT; x.textAlign="center";
      x.fillText(b.used?" ": (b.need!=null?String(b.need+1):"?"), sx(b.x), by+7);
    });
    coins.forEach(co=>{ if(co.got) return; x.fillStyle="#fcbc3c"; x.beginPath(); x.ellipse(sx(co.x), co.y, 7, 11, 0,0,7); x.fill(); x.strokeStyle="#fcfc54"; x.stroke(); });
    cars.forEach(car=>{ if(!car.dead) car2(x, sx(car.x-32), car.y-26, "#ef4444"); });
    x.fillStyle="#1b2430"; x.fillRect(sx(flagX), Gnd-132, 6, 132);
    x.fillStyle="#21c000"; x.beginPath(); x.moveTo(sx(flagX)+6, Gnd-130); x.lineTo(sx(flagX)+56, Gnd-112); x.lineTo(sx(flagX)+6, Gnd-94); x.fill();
    x.fillStyle="#fcfc54"; x.font="800 12px "+FONT; x.textAlign="left"; x.fillText("META", sx(flagX)+10, Gnd-110);
    drawFig(x, sx(px), py, vx>=0?0:Math.PI, G, 0.82, now/70, Math.abs(vx)>18||!onG);
    x.fillStyle="#fff"; x.font="800 15px "+FONT; x.textAlign="left";
    x.fillText("🪙 "+coins.filter(c=>c.got).length+"/"+coins.length+"   ★ "+pts+"   ×"+Math.max(0,3-dead), 10, 22);
    if(freeze>0){
      x.fillStyle="rgba(0,0,0,.4)"; x.fillRect(0,0,w,h);
      x.fillStyle="#fcfc54"; x.font="800 26px "+FONT; x.textAlign="center"; x.fillText("LET'S-A-GO!", w/2, h/2-8);
      x.fillStyle="#fff"; x.font="800 15px "+FONT; x.fillText("W prawo · SKOK · monety · flaga", w/2, h/2+22);
    }
    setSc(pts);
    mgRAF=requestAnimationFrame(tick);
  };
  mgRAF=requestAnimationFrame(tick);
}

const MISSIONS={};

MISSIONS.safe=function(){
  runMario({color:"#1d4ed8",loc:"ŚWIAT 1-1",title:"PARK",who:"🍄",say:"Biegnij w prawo jak w Mario. Auta i dziury resetują. Klocki ? uczą pasów.",doit:"SKOK = spacja / ▲ / tap. Zbierz monety. Flaga = meta.",step:0,of:2},
    {flagX:1680, coins:[{x:220},{x:260},{x:300},{x:520},{x:780},{x:820},{x:1100},{x:1280}],
      blocks:[{x:400,y:160,fact:"Stop. Lewo. Prawo. Potem pasy."},{x:900,y:150,fact:"Jezdnia to lava. Trawa żyje."}],
      cars:[{x:620,min:540,max:760},{x:1180,min:1080,max:1320}],
      pits:[{x:980,w:70}]},
    (pts,dead,got,need)=>{
      radioPick({color:"#1d4ed8",loc:"ŚWIAT 1-1",title:"TOAD PYTA",who:"🍄",say:"COURSE CLEAR prawie! Jak przejść ulicę naprawdę?",doit:"Wybierz jedną. Masz czas.",step:1,of:2},[
        {t:"Stop. Lewo. Prawo. Pasy, gdy pusto.",ok:true},
        {t:"Sprint między autami — tak szybciej.",ok:false},
        {t:"Idę środkiem jezdni, widać mnie.",ok:false}
      ], p2=>win("safe", dead===0&&got>=5?3:dead<2?2:1, pts+p2, "W grze skaczesz nad autem. W życiu: STOP i pasy. Monety "+got+"/"+need+"."));
    });
};

MISSIONS.check=function(){
  runMario({color:"#0369a1",loc:"ŚWIAT 1-2",title:"3 KLOCKI",who:"🍄",say:"Uderz klocki od dołu w kolejności 1-2-3: KRZYK, RAMIONA, KLATKA.",doit:"Podskocz pod żółty klocek. Potem flaga.",step:0,of:2},
    {flagX:1500, coins:[{x:180},{x:420},{x:700},{x:980}],
      blocks:[
        {x:280,y:150,need:0,fact:"1 KRZYK — głośno wołaj."},
        {x:560,y:140,need:1,fact:"2 RAMIONA — delikatnie potrząśnij."},
        {x:860,y:150,need:2,fact:"3 KLATKA — czy się rusza?"}
      ],
      plats:[{x:240,y:210,w:90},{x:520,y:200,w:90},{x:820,y:210,w:90}]},
    (pts,dead)=>{
      radioPick({color:"#0369a1",loc:"ŚWIAT 1-2",title:"CZY ŻYJE?",who:"🍄",say:"Klatka stoi. Co robisz?",doit:"Jedna dobra odpowiedź.",step:1,of:2},[
        {t:"Nie oddycha? Wołam dorosłego i 112.",ok:true},
        {t:"Czekam 10 minut i nagrywam film.",ok:false},
        {t:"Wleję wodę do ust.",ok:false}
      ], p2=>win("check", dead===0?3:2, pts+p2, "Kolejność CHECK: krzyk → ramiona → klatka. Brak oddechu = 112."));
    });
};

MISSIONS.call=function(){
  let typed="", pts=0;
  msShell({color:"#c2410c",loc:"ŚWIAT 1-3",title:"WYBIERZ 112",who:"🍄",say:"Bonus: wklep numer jak kod do zamku. Europa to 1-1-2.",doit:"Wklep 112. Połącz.",step:0,of:2,body:`<div class="ms-pad"><div style="background:#020617;border:2px solid #fbbf24;border-radius:20px;padding:14px;max-width:280px;margin:0 auto"><div id="num" style="background:#022c22;color:#4ade80;border-radius:10px;padding:12px;font-size:28px;font-weight:800;text-align:center;letter-spacing:.3em">•••</div><div id="dial" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px"></div></div></div>`});
  const box=document.getElementById("dial");
  [1,2,3,4,5,6,7,8,9,"⌫",0,"C"].forEach(n=>{
    const b=document.createElement("button"); b.className="btn ghost"; b.style.cssText="padding:10px;font-size:18px;background:#1e293b;color:#fff;border-color:#334155"; b.textContent=n;
    b.onclick=()=>{ if(n==="⌫") typed=typed.slice(0,-1); else if(n==="C") typed=""; else if(typed.length<3) typed+=String(n); document.getElementById("num").textContent=typed||"•••"; tone(420,.04); };
    box.appendChild(b);
  });
  const c=document.createElement("button"); c.className="btn teal"; c.style.gridColumn="span 3"; c.textContent="POŁĄCZ";
  c.onclick=()=>{ if(typed==="112"){ pts+=120; talk(); } else { toast("1-1-2"); tone(140,.08,"square"); } };
  box.appendChild(c);
  function talk(){
      radioPick({color:"#c2410c",loc:"ŚWIAT 1-3",title:"TOAD NA LINII",who:"🎧",say:"Mów krótko. Przeczytaj wszystkie odpowiedzi.",doit:"Co powiesz pierwsze?",step:1,of:2},[
      {t:"Park przy bazie 112. Leży, nie oddycha. Zostaję.",ok:true},
      {t:"Chcę pizzę i rozłączam się.",ok:false},
      {t:"Nie wiem gdzie jestem i milczę.",ok:false}
    ], p=>win("call",3,pts+p,"112: gdzie, co, czy oddycha. Nie rozłączaj się."));
  }
};

MISSIONS.cpr=function(){
  const {w,h,x,c}=msShell({color:"#be123c",loc:"ŚWIAT 1-4",title:"110 BPM",who:"🍄",say:"Bonus sercowy! Trafiaj w pierścień jak w beat-blocku.",doit:"Klik / spacja w beat. Combo = ranga S.",step:0,of:1});
  const iv=60000/110; let t0=performance.now(), hits=0, combo=0, best=0, pts=0, n=0;
  const hit=()=>{
    const t=performance.now()-t0, beat=(t%iv)/iv, good=beat>0.72||beat<0.14;
    if(good){ hits++; combo++; best=Math.max(best,combo); pts+=28+combo*4; tone(250,.05,"triangle"); }
    else { combo=0; tone(130,.05,"square"); }
    n++;
  };
  bindTap(c,()=>hit()); const kd=e=>{ if(["Space","Enter","KeyE"].includes(e.code)){ e.preventDefault(); hit(); } }; addEventListener("keydown",kd);
  const tick=now=>{
    const t=now-t0, beat=(t%iv)/iv, pulse=0.75+Math.sin(beat*Math.PI*2)*0.2;
    sky(x,w,h,"#3f0d19","#0f172a");
    x.fillStyle="#1e293b"; x.beginPath(); x.ellipse(w/2,h*0.72,120,40,0,0,7); x.fill();
    const s=42*pulse;
    x.strokeStyle=beat>0.72||beat<0.14?"#facc15":"#334155"; x.lineWidth=7;
    x.beginPath(); x.arc(w/2,h*0.46, 28+beat*56,0,7); x.stroke();
    x.fillStyle="#ef4444"; x.beginPath();
    x.moveTo(w/2, h*0.46+s*0.3);
    x.bezierCurveTo(w/2-s,h*0.46-s*0.6,w/2-s*0.3,h*0.46-s,w/2,h*0.46-s*0.25);
    x.bezierCurveTo(w/2+s*0.3,h*0.46-s,w/2+s,h*0.46-s*0.6,w/2,h*0.46+s*0.3); x.fill();
    const rank=combo>12?"S":combo>7?"A":combo>3?"B":"C";
    x.fillStyle="#f8fafc"; x.font="800 22px "+FONT; x.textAlign="left"; x.fillText("COMBO "+combo+"  "+rank, 14, 28);
    x.textAlign="right"; x.fillText(hits+" HIT", w-14, 28);
    setSc(pts);
    if(t>20*iv+600){ removeEventListener("keydown",kd); const a=hits/20; win("cpr",a>.7?3:a>.4?2:1,pts,"W życiu dorosły pompował. Ty: 112, AED, liczenie. Best combo "+best+"."); return; }
    mgRAF=requestAnimationFrame(tick);
  };
  mgRAF=requestAnimationFrame(tick);
};

MISSIONS.aed=function(){
  let pts=0, placed={P:0,L:0};
  const seq=["WŁĄCZ","NAKLEJ","ODSUŃ","WSTRZĄS"];
  let si=0, lit=0, t0=0;
  const {w,h,x,c}=msShell({color:"#15803d",loc:"KOD 05 · AED",title:"GŁOS SKRZYNKI",who:"📡",say:"Simon mówi. Powtórz sekwencję urządzenia.",doit:"Klikaj przyciski w tej samej kolejności.",step:0,of:2});
  const btns=seq.map((s,i)=>({s, x: w*(0.18+i*0.21), y:h*0.62}));
  let input=[], lock=false, show=true, stepShow=0;
  const playSeq=()=>{
    show=true; lock=true; stepShow=0; input=[];
    const id=setInterval(()=>{
      lit=stepShow; tone(400+stepShow*80,.08);
      stepShow++;
      if(stepShow>si+1){ clearInterval(id); lit=-1; lock=false; show=false; }
    }, 420);
  };
  setTimeout(playSeq, 300);
  bindTap(c,(mx,my)=>{
    if(lock) return;
    btns.forEach((b,i)=>{
      if(Math.hypot(mx-b.x, my-b.y)<44){
        input.push(i); lit=i; tone(400+i*80,.06);
        const need=[...Array(si+1).keys()];
        if(input[input.length-1]!==need[input.length-1]){ toast("Zła sekwencja."); input=[]; pts=Math.max(0,pts-20); setTimeout(playSeq,400); }
        else if(input.length===need.length){
          si++; pts+=70; setSc(pts);
          if(si>=4) setTimeout(pads,200);
          else setTimeout(playSeq,400);
        }
      }
    });
  });
  const tick=()=>{
    if(si>=4) return;
    sky(x,w,h,"#022c22","#0f172a");
    x.fillStyle="#14532d"; round(x,w*0.5-80,20,160,70,12); x.fill();
    x.fillStyle="#fff"; x.font="800 22px "+FONT; x.textAlign="center"; x.fillText("AED", w/2, 64);
    btns.forEach((b,i)=>{
      x.fillStyle=lit===i?"#facc15":"#1e293b";
      x.beginPath(); x.arc(b.x,b.y,34,0,7); x.fill();
      x.strokeStyle="#22c55e"; x.lineWidth=3; x.stroke();
      x.fillStyle="#fff"; x.font="800 11px "+FONT; x.fillText(b.s, b.x, b.y+4);
    });
    x.fillStyle="#94a3b8"; x.font="800 13px "+FONT; x.fillText("SEKWENCJA "+(si+1)+"/4", w/2, h-14);
    setSc(pts); mgRAF=requestAnimationFrame(tick);
  };
  mgRAF=requestAnimationFrame(tick);
  function pads(){
    msShell({color:"#15803d",loc:"KOD 05 · ELEKTRODY",title:"NAKLEJKI",who:"📡",say:"P góra klatki. L bok. Potem odsuń i wstrząs.",doit:"Kliknij P/L, potem ramkę.",step:1,of:2,body:`<div id="torso" style="position:relative;width:260px;height:220px;margin:8px auto">
      <div style="position:absolute;left:90px;top:4px;width:80px;height:56px;background:#fcd34d;border:3px solid #22d3ee;border-radius:18px"></div>
      <div style="position:absolute;left:60px;top:44px;width:140px;height:160px;background:#fdba74;border:3px solid #22d3ee;border-radius:14px"></div>
      <button id="tP" class="bin" style="position:absolute;left:72px;top:80px;width:54px;height:42px;min-height:42px;padding:0;background:#022c22;color:#4ade80">P</button>
      <button id="tL" class="bin" style="position:absolute;left:148px;top:148px;width:54px;height:42px;min-height:42px;padding:0;background:#022c22;color:#4ade80">L</button>
      <button id="pP" class="btn teal" style="position:absolute;left:0;top:36px;padding:8px 12px">P</button>
      <button id="pL" class="btn" style="position:absolute;left:196px;top:36px;padding:8px 12px">L</button>
    </div>
    <div class="row"><button class="btn" id="h1" style="min-width:44%;height:64px">ODSUŃ</button><button class="btn" id="sh" style="background:#f97316;min-width:44%;height:64px" disabled>WSTRZĄS</button></div>
    <div class="bar" style="margin:8px 16px;height:10px"><i id="hb"></i></div>`});
    let sel=null, hold=0, down=false, ready=false;
    const pick=id=>{ sel=id; document.getElementById("pP").style.outline=id==="P"?"3px solid #facc15":""; document.getElementById("pL").style.outline=id==="L"?"3px solid #facc15":""; };
    document.getElementById("pP").onclick=()=>pick("P");
    document.getElementById("pL").onclick=()=>pick("L");
    const drop=slot=>{
      if(sel!==slot){ toast(sel?"Zła strona.":"Najpierw P albo L."); return; }
      placed[slot]=1; pts+=50; setSc(pts); document.getElementById("t"+slot).classList.add("on"); document.getElementById("p"+slot).style.display="none"; sel=null; tone(800,.08);
    };
    document.getElementById("tP").onclick=()=>drop("P");
    document.getElementById("tL").onclick=()=>drop("L");
    const b1=document.getElementById("h1"), sh=document.getElementById("sh");
    ["mousedown","touchstart"].forEach(e=>b1.addEventListener(e,ev=>{ev.preventDefault();down=true;},{passive:false}));
    ["mouseup","mouseleave","touchend"].forEach(e=>b1.addEventListener(e,()=>down=false));
    sh.onclick=()=>{ if(!ready||!placed.P||!placed.L){ toast("Najpierw naklejki i ODSUŃ."); return; } shake=.8; tone(110,.2,"sawtooth",.05); pts+=90; win("aed",3,pts,"AED samo mówi. Nie dotykaj przy wstrząsie. Potem znowu uciski."); };
    const loop=()=>{ hold+=down?0.028:-0.04; hold=Math.max(0,Math.min(1,hold)); const el=document.getElementById("hb"); if(!el) return; el.style.width=hold*100+"%";
      if(hold>=1&&!ready){ ready=true; sh.disabled=false; pts+=40; setSc(pts); }
      mgRAF=requestAnimationFrame(loop);
    }; mgRAF=requestAnimationFrame(loop);
  }
};

MISSIONS.other=function(){
  let stage=0, pts=0;
  function choke(){
    const {w,h,x,c}=msShell({color:"#9d174d",loc:"KOD 06 · 1/3",title:"KRZTUSZENIE",who:"📡",say:"Nie kaszle. 5 w plecy, 5 w brzuch. Dorosły prowadzi.",doit:"Wpadaj w czerwone kółko.",step:0,of:3});
    let n=0;
    bindTap(c,(mx,my)=>{
      const ty=n<5?h*0.38:h*0.62;
      if(Math.hypot(mx-w*0.58, my-ty)<52){ n++; pts+=24; tone(420,.04); if(n>=10) bleed(); }
      setSc(pts);
    });
    const tick=()=>{
      if(n>=10) return;
      sky(x,w,h,"#1e293b","#0f172a");
      x.fillStyle="#fdba74"; x.beginPath(); x.arc(w*0.42,h*0.4,34,0,7); x.fill(); x.fillRect(w*0.42-18,h*0.4,36,78);
      const ty=n<5?h*0.38:h*0.62;
      x.strokeStyle="#ef4444"; x.lineWidth=5; x.beginPath(); x.arc(w*0.58, ty, 24+Math.sin(performance.now()/80)*5,0,7); x.stroke();
      x.fillStyle="#e2e8f0"; x.font="800 18px "+FONT; x.textAlign="center";
      x.fillText(n<5?("PLECY "+(n+1)+"/5"):("BRZUCH "+(n-4)+"/5"), w/2, 28);
      mgRAF=requestAnimationFrame(tick);
    }; mgRAF=requestAnimationFrame(tick);
  }
  function bleed(){
    const {w,h,x,c}=msShell({color:"#9d174d",loc:"KOD 06 · 2/3",title:"KRWAWIENIE",who:"📡",say:"Mocno. Nie zaglądasz.",doit:"TRZYMAJ ranę. Pasek na 100.",step:1,of:3});
    let hold=0, down=false;
    const on=e=>{ down=true; e.preventDefault(); }, off=()=>down=false;
    c.addEventListener("mousedown",on); c.addEventListener("mouseup",off); c.addEventListener("mouseleave",off);
    c.addEventListener("touchstart",on,{passive:false}); c.addEventListener("touchend",off);
    const tick=()=>{
      hold+= down?0.012:-0.008; hold=Math.max(0,Math.min(1,hold));
      sky(x,w,h,"#1e293b","#3f0d19");
      x.fillStyle="#fdba74"; round(x,w*0.28,h*0.42,w*0.48,34,12); x.fill();
      x.fillStyle="#ef4444"; x.beginPath(); x.arc(w*0.55,h*0.5,16,0,7); x.fill();
      x.fillStyle="#1e293b"; round(x,40,h-36,w-80,14,8); x.fill();
      x.fillStyle="#22c55e"; round(x,40,h-36,(w-80)*hold,14,8); x.fill();
      x.fillStyle="#e2e8f0"; x.font="800 16px "+FONT; x.textAlign="center"; x.fillText(down?"TRZYMASZ":"WCIŚNIJ I NIE PUSZCZAJ", w/2, 32);
      setSc(pts);
      if(hold>=1){ pts+=110; burn(); return; }
      mgRAF=requestAnimationFrame(tick);
    }; mgRAF=requestAnimationFrame(tick);
  }
  function burn(){
    const {w,h,x,c}=msShell({color:"#9d174d",loc:"KOD 06 · 3/3",title:"OPARZENIE",who:"📡",say:"Woda. Nie masło. Nie lód.",doit:"Trzymaj niebieski kursor na ranie.",step:2,of:3});
    let fx=80, fy=80, down=false, cool=0;
    const pos=e=>{ const r=c.getBoundingClientRect(); const p=e.touches?e.touches[0]:e; fx=p.clientX-r.left; fy=p.clientY-r.top; };
    c.addEventListener("mousedown",e=>{down=1;pos(e);}); c.addEventListener("mousemove",e=>{ if(down) pos(e); }); c.addEventListener("mouseup",()=>down=0);
    c.addEventListener("touchstart",e=>{down=1;pos(e);e.preventDefault();},{passive:false});
    c.addEventListener("touchmove",e=>{pos(e);e.preventDefault();},{passive:false}); c.addEventListener("touchend",()=>down=0);
    const tick=()=>{
      const over=Math.hypot(fx-w*0.6,fy-h*0.55)<50;
      if(down&&over) cool+=0.011; else cool=Math.max(0,cool-0.005);
      sky(x,w,h,"#1e293b","#431407");
      x.fillStyle="#fb923c"; x.beginPath(); x.arc(w*0.6,h*0.55,38,0,7); x.fill();
      x.fillStyle="rgba(56,189,248,.9)"; x.beginPath(); x.arc(fx,fy,18,0,7); x.fill();
      x.fillStyle="#1e293b"; round(x,40,h-34,w-80,12,8); x.fill();
      x.fillStyle="#22d3ee"; round(x,40,h-34,(w-80)*cool,12,8); x.fill();
      setSc(pts);
      if(cool>=1){ pts+=110; win("other",3,pts,"5+5. Przyciskaj krew. Woda na oparzenie — nigdy masło."); return; }
      mgRAF=requestAnimationFrame(tick);
    }; mgRAF=requestAnimationFrame(tick);
  }
  choke();
};

MISSIONS.seizure=function(){
  const {w,h,x,c}=msShell({color:"#6d28d9",loc:"KOD 07 · KLASA",title:"20 SEKUND",who:"📡",say:"Odsuń ostre. Kurtka pod głowę. Nic do ust.",doit:"Drag na brzeg. Kurtka na głowę. Zegar leci.",step:0,of:1});
  let items=[{id:"fork",x:w*0.28,y:h*0.62,ok:0},{id:"glass",x:w*0.7,y:h*0.5,ok:0},{id:"phone",x:w*0.48,y:h*0.74,ok:0}], coat={x:50,y:46,on:0}, drag=null, pts=80, t0=performance.now();
  const pick=e=>{ const r=c.getBoundingClientRect(); const p=e.touches?e.touches[0]:e; const mx=p.clientX-r.left,my=p.clientY-r.top; [...items,coat].forEach(it=>{ if(Math.hypot(mx-it.x,my-it.y)<32) drag=it; }); };
  const move=e=>{ if(!drag) return; const r=c.getBoundingClientRect(); const p=e.touches?e.touches[0]:e; drag.x=p.clientX-r.left; drag.y=p.clientY-r.top; };
  const up=()=>{ if(!drag) return; if(drag.id){ if(drag.x<46||drag.x>w-46||drag.y<36||drag.y>h-24){ drag.ok=1; pts+=60; tone(700,.08);} } else if(Math.hypot(drag.x-w*0.5,drag.y-h*0.42)<46){ coat.on=1; pts+=90; tone(800,.1);} drag=null; };
  c.addEventListener("mousedown",pick); c.addEventListener("mousemove",move); c.addEventListener("mouseup",up);
  c.addEventListener("touchstart",e=>{pick(e);e.preventDefault();},{passive:false});
  c.addEventListener("touchmove",e=>{move(e);e.preventDefault();},{passive:false}); c.addEventListener("touchend",up);
  const tick=now=>{
    const left=Math.max(0, 20-(now-t0)/1000);
    sky(x,w,h,"#1e1b4b","#0f172a");
    x.fillStyle="#334155"; round(x,24,28,w-48,h-48,12); x.fill();
    lie(x,w*0.48,h*0.5);
    const ic={fork:"🍴",glass:"🥛",phone:"📱"};
    x.textAlign="left"; items.forEach(it=>{ if(it.ok) return; x.font="32px "+FONT; x.fillText(ic[it.id], it.x-14, it.y+12); });
    x.font="32px "+FONT; if(!coat.on) x.fillText("🧥", coat.x-14, coat.y+12); else x.fillText("🧥", w*0.42, h*0.38);
    x.fillStyle=left<5?"#f87171":"#fde68a"; x.font="800 18px "+FONT; x.textAlign="center";
    x.fillText(left.toFixed(1)+"s  ·  "+items.filter(i=>i.ok).length+"/3  ·  kurtka "+(coat.on?"OK":"—"), w/2, 22);
    setSc(pts);
    if(items.every(i=>i.ok)&&coat.on){ win("seizure", left>8?3:2, pts+Math.floor(left*8), "Nic do ust. Czas. 112 gdy długo / pierwszy raz."); return; }
    if(left<=0){ win("seizure",1, pts, "Za wolno, ale zasada: nic do ust, odsuń ostre."); return; }
    mgRAF=requestAnimationFrame(tick);
  }; mgRAF=requestAnimationFrame(tick);
};

MISSIONS.alarm=function(){
  runMario({color:"#b91c1c",loc:"ŚWIAT 1-8",title:"SYRENA",who:"🍄",say:"Czarna rura = winda = reset. Zielone rury omijaj. Platformy = schody. Flaga = zbiórka.",doit:"W prawo, skacz na półki. Nie wchodź w czarne.",step:0,of:2},
    {flagX:1600, coins:[{x:200},{x:460},{x:720},{x:1000},{x:1300}],
      plats:[{x:300,y:200,w:120},{x:520,y:150,w:120},{x:760,y:200,w:140},{x:1080,y:160,w:130}],
      pipes:[{x:640,y:180,bad:true},{x:900,y:190,bad:false}],
      blocks:[{x:380,y:130,fact:"Schody. Nigdy winda przy alarmie."}]},
    (pts,dead)=>{
      radioPick({color:"#111827",loc:"ŚWIAT 1-8",title:"ZGASŁ PRĄD",who:"🍄",say:"Boss pytanie: co bierzesz, gdy nie ma prądu?",doit:"Jedna dobra odpowiedź.",step:1,of:2},[
        {t:"Latarka / telefon + dorosły. Kabel i świeczka — nie.",ok:true},
        {t:"Sam ze świeczką, podnoszę iskrzący kabel.",ok:false},
        {t:"Otwieram lodówkę co chwilę i wracam po telefon.",ok:false}
      ], p2=>win("alarm", dead===0?3:2, pts+p2, "Schody, zbiórka, zero windy. Prąd: latarka, nie kabel."));
    });
};

MISSIONS.quiz=function(){
  let pts=0, hits=0;
  const {w,h,x,c}=msShell({color:"#ea580c",loc:"KOD 09 · FINAŁ",title:"CAŁY ŁAŃCUCH",who:"📡",say:"Jeden strzał: 112 → rytm → wstrząs. Bez pauzy.",doit:"Wklep 112, potem 8 beatów, potem WSTRZĄS.",step:0,of:1});
  let phase="dial", typed="", t0=performance.now(), combo=0;
  const iv=60000/110;
  const kd=e=>{
    if(phase==="dial"){
      if(e.key>="0"&&e.key<="9"&&typed.length<3) typed+=e.key;
      if(e.code==="Backspace") typed=typed.slice(0,-1);
      if((e.code==="Enter"||e.code==="KeyE") && typed==="112"){ pts+=100; phase="cpr"; t0=performance.now(); tone(800,.1); }
    } else if(phase==="cpr"){
      if(["Space","Enter","KeyE"].includes(e.code)){
        const t=performance.now()-t0, beat=((t%iv)/iv); const good=beat>0.7||beat<0.14;
        if(good){ hits++; combo++; pts+=20+combo*2; tone(250,.04,"triangle"); } else combo=0;
        if(hits>=8){ phase="shock"; }
      }
    }
  };
  addEventListener("keydown",kd);
  bindTap(c,(mx,my)=>{
    if(phase==="shock"){ const ok=mx>w*0.3&&mx<w*0.7&&my>h*0.35&&my<h*0.7; if(ok){ removeEventListener("keydown",kd); pts+=80; finish(); } }
    if(phase==="cpr"){ const t=performance.now()-t0, beat=((t%iv)/iv); const good=beat>0.7||beat<0.14; if(good){ hits++; combo++; pts+=20; } if(hits>=8) phase="shock"; }
    if(phase==="dial"){
      const col=Math.floor((mx-w/2+90)/60); const row=Math.floor((my-h*0.4)/40);
      const keys=[["1","2","3"],["4","5","6"],["7","8","9"],["","0",""]];
      if(keys[row]&&keys[row][col]) { typed=(typed+keys[row][col]).slice(0,3); if(typed==="112"){ pts+=100; phase="cpr"; t0=performance.now(); } }
    }
  });
  function finish(){
    G.done.quiz=true; G.score+=pts; G.best=Math.max(G.best,G.score); G.xp+=50; G.gems+=15; save(); postScore();
    const names=duo?`${esc(G.name)} + ${esc(G2.name)}`:`${esc(G.name)}`;
    modal(`<div class="ms"><div class="ms-hero" style="background:#ea580c"><div><div class="ms-loc">ZMIANA ZAKOŃCZONA</div><h2>DRUŻYNA 112</h2></div></div>
      <p style="text-align:center;font-size:22px;font-weight:800;padding:12px">${names}</p>
      <p style="text-align:center;font-size:36px;font-weight:800">${G.score}</p>
      <p class="ms-do">W życiu: dorosły + 112. To nie kurs.</p>
      <div class="row" style="padding-bottom:16px"><button class="btn teal" id="okwin">MIASTO</button><button class="btn ghost" id="okboard">Ranking</button></div></div>`);
    document.getElementById("okwin").onclick=closeModal;
    document.getElementById("okboard").onclick=()=>showBoard();
  }
  const tick=now=>{
    if(phase==="done") return;
    sky(x,w,h,"#0f172a","#1c1917");
    x.fillStyle="#e2e8f0"; x.font="800 18px "+FONT; x.textAlign="center";
    if(phase==="dial"){
      x.fillText("NUMER", w/2, 36);
      x.fillStyle="#4ade80"; x.font="800 40px "+FONT; x.fillText(typed.padEnd(3,"•"), w/2, 90);
      x.fillStyle="#1e293b";
      [[1,2,3],[4,5,6],[7,8,9],["",0,""]].forEach((row,ri)=>row.forEach((n,ci)=>{
        if(n==="") return;
        round(x, w/2-90+ci*60, h*0.4+ri*40, 50, 34, 8); x.fill();
        x.fillStyle="#fff"; x.font="800 16px "+FONT; x.fillText(n, w/2-65+ci*60, h*0.4+ri*40+22); x.fillStyle="#1e293b";
      }));
    } else if(phase==="cpr"){
      const t=now-t0, beat=(t%iv)/iv;
      x.strokeStyle="#facc15"; x.lineWidth=6; x.beginPath(); x.arc(w/2,h*0.5, 24+beat*50,0,7); x.stroke();
      x.fillStyle="#ef4444"; x.beginPath(); x.arc(w/2,h*0.5, 28,0,7); x.fill();
      x.fillStyle="#fff"; x.fillText("BEAT  "+hits+"/8", w/2, 36);
    } else {
      x.fillStyle="#f97316"; round(x,w*0.3,h*0.35,w*0.4,h*0.32,16); x.fill();
      x.fillStyle="#fff"; x.font="800 28px "+FONT; x.fillText("WSTRZĄS", w/2, h*0.54);
    }
    setSc(pts); mgRAF=requestAnimationFrame(tick);
  };
  mgRAF=requestAnimationFrame(tick);
};

/* creator */
function paintCreator(){
  try{
  const prev=document.getElementById("prev"); if(prev) drawR6Dom(prev,G);
  const boot=document.getElementById("bootfig"); if(boot) drawR6Dom(boot,G);
  const prev2=document.getElementById("prev2"); if(prev2) drawR6Dom(prev2,G2);
  const mk=(arr,id,obj,key)=>{
    const box=document.getElementById(id); if(!box) return; box.innerHTML="";
    arr.forEach(c=>{ const d=document.createElement("div"); d.className="sw"+(obj[key]===c?" on":""); d.style.background=c; d.onclick=()=>{ obj[key]=c; paintCreator(); }; box.appendChild(d); });
  };
  mk(SKINS,"skins",G,"skin"); mk(HAIRS,"hairs",G,"hair"); mk(SHIRTS,"shirts",G,"shirt");
  mk(SKINS,"skins2",G2,"skin"); mk(HAIRS,"hairs2",G2,"hair"); mk(SHIRTS,"shirts2",G2,"shirt");
  const set= (id, on)=>{ const el=document.getElementById(id); if(el) el.className="opt"+(on?" on":""); };
  set("optCape", G.cape); set("optHat", G.hat); set("optTrail", G.trail);
  set("modeSolo", !duo); set("modePair", duo);
  const p2box=document.getElementById("p2box"); if(p2box) p2box.style.display=duo?"block":"none";
  const av=document.getElementById("avcols"); if(av) av.className="cols"+(duo?" duo":"");
  document.querySelectorAll("[data-g]").forEach(o=>{
    const who=o.dataset.who, g=o.dataset.g, obj=who==="2"?G2:G;
    o.className="opt"+(obj.gender===g?" on":"");
  });
  }catch(e){ console.warn(e); }
}
function bindUI(){
  const on=(id,fn)=>{ const el=document.getElementById(id); if(el) el.onclick=fn; };
  on("goStart", ()=>{ show("s-create"); paintCreator(); });
  on("goQuick", ()=>{ const a=document.getElementById("agree"); if(a) a.checked=true; duo=false; G.pair=false; enterWorldNow(); });
  on("goAbout", ()=>show("s-about"));
  on("backBoot", ()=>show("s-boot"));
  on("modeSolo", ()=>{ duo=false; G.pair=false; paintCreator(); });
  on("modePair", ()=>{ duo=true; G.pair=true; paintCreator(); });
  on("optCape", ()=>{ G.cape=!G.cape; G2.cape=G.cape; paintCreator(); });
  on("optHat", ()=>{ G.hat=!G.hat; G2.hat=G.hat; paintCreator(); });
  on("optTrail", ()=>{ G.trail=!G.trail; G2.trail=G.trail; paintCreator(); });
  document.querySelectorAll("[data-g]").forEach(o=>{ o.onclick=()=>{ const obj=o.dataset.who==="2"?G2:G; obj.gender=o.dataset.g; paintCreator(); }; });
  on("enterWorld", ()=>{
    const nEl=document.getElementById("pname"); const n=nEl&&nEl.value.trim(); if(n) G.name=n;
    const n2El=document.getElementById("pname2"); const n2=n2El&&n2El.value.trim(); if(n2) G2.name=n2;
    const ag=document.getElementById("agree"); if(ag && !ag.checked){ toast("Zaznacz kratkę"); return; }
    duo=!!G.pair; save(); enterWorldNow();
  });
  on("btnboard", ()=>showBoard());
  on("btnmenu", ()=>{
    modal(`<h2 style="padding:16px 16px 0">Menu</h2>
      <p style="padding:0 16px">Punkty: <b>${G.score}</b> · rekord <b>${G.best}</b></p>
      <p class="tiny" style="padding:0 16px">Telefon: D-pad + AKCJA. Komputer: WASD + E, skok = spacja. Zoom: +/− albo kółko.</p>
      <p class="train" style="margin:8px 16px">TO TYLKO TRENING. W życiu: dorosły + 112.</p>
      <div class="row" style="padding-bottom:16px">
        <button class="btn teal" id="resum">Wznów</button>
        <button class="btn ghost" id="showb">Wyniki</button>
      </div>`);
    const r=document.getElementById("resum"); if(r) r.onclick=closeModal;
    const s=document.getElementById("showb"); if(s) s.onclick=()=>showBoard();
  });
  const zi=document.getElementById("btnzoomin"), zo=document.getElementById("btnzoomout");
  if(zi) zi.onclick=()=>zoomBy(-1.8);
  if(zo) zo.onclick=()=>zoomBy(1.8);
}
addEventListener("keydown",e=>{
  keys.add(e.code);
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code)) e.preventDefault();
  if((e.code==="KeyE"||e.code==="Enter") && running) interact();
});
addEventListener("keyup",e=>keys.delete(e.code));
addEventListener("blur",()=>keys.clear());
addEventListener("resize",()=>{ resize(); showPhoneUI(); });
if(window.visualViewport) visualViewport.addEventListener("resize",()=>{ resize(); showPhoneUI(); });

let stickV=null, padDir={x:0,y:0}, jumpHeld=false, camYaw=0.85, camPitch=0.2, camDist=6.4;
function zoomBy(d){ camDist=Math.max(3.2, Math.min(24, camDist+d)); }
function isPhone(){
  try{ if(window.matchMedia && matchMedia("(pointer:coarse)").matches) return true; }catch(e){}
  if(("ontouchstart" in window) || (navigator.maxTouchPoints|0)>0) return true;
  return innerWidth<900;
}
function showPhoneUI(){
  document.body.classList.toggle("phone", isPhone());
}
function setupTouch(){
  showPhoneUI();
  const st=document.getElementById("stick"), kn=document.getElementById("knob");
  const zone=document.getElementById("movezone");
  const dpad=document.getElementById("dpad");
  if(window.__touchBound===zone) return;
  window.__touchBound=zone;
  let stickId=null, ox=0, oy=0, lookId=null, lx=0, ly=0;
  const maxR=64;
  function knobReset(){
    if(!st||!kn) return;
    const mid=(st.clientWidth-kn.offsetWidth)/2;
    kn.style.left=mid+"px"; kn.style.top=mid+"px";
    st.style.left=""; st.style.top=""; st.style.bottom="";
  }
  function applyStick(x,y){
    let dx=x-ox, dy=y-oy, m=Math.hypot(dx,dy);
    if(m>maxR){ dx=dx/m*maxR; dy=dy/m*maxR; m=maxR; }
    if(kn){
      const mid=(st.clientWidth-kn.offsetWidth)/2;
      kn.style.left=(mid+dx*(st.clientWidth*0.32/maxR))+"px";
      kn.style.top=(mid+dy*(st.clientWidth*0.32/maxR))+"px";
    }
    const mag=m/maxR;
    if(mag<0.18){ stickV=null; return; }
    let sx=dx/maxR, sy=dy/maxR;
    const a=Math.atan2(sy,sx), n=Math.PI/4, k=Math.round(a/n)*n;
    stickV={x:Math.cos(k)*mag, y:Math.sin(k)*mag};
  }
  function startStick(id,x,y){
    stickId=id; ox=x; oy=y; stickV=null;
    if(st){
      st.classList.add("live");
      const s=st.offsetWidth||168;
      st.style.left=Math.max(8, x-s/2)+"px";
      st.style.top=Math.max(8, y-s/2)+"px";
      st.style.bottom="auto";
    }
    applyStick(x,y);
  }
  function endStick(id){
    if(stickId==null || (id!=null && id!==stickId)) return;
    stickId=null; stickV=null; knobReset(); if(st) st.classList.remove("live");
  }
  function pt(e){
    if(e.touches && e.touches.length) return {id:e.touches[0].identifier, x:e.touches[0].clientX, y:e.touches[0].clientY};
    if(e.changedTouches && e.changedTouches.length) return {id:e.changedTouches[0].identifier, x:e.changedTouches[0].clientX, y:e.changedTouches[0].clientY};
    return {id:e.pointerId, x:e.clientX, y:e.clientY};
  }
  function inZone(x,y){
    if(document.getElementById("modal")?.classList.contains("on")) return false;
    if(!running) return false;
    const el=document.elementFromPoint(x,y);
    if(el && el.closest && el.closest("#actbtn,#jmpbtn,#dpad,.chip,.quest,button.btn,#btnmenu,#btnboard")) return false;
    const r=zone?zone.getBoundingClientRect():{left:0,right:innerWidth*0.52,top:innerHeight*0.38,bottom:innerHeight};
    return x>=r.left && x<=r.right && y>=r.top && y<=r.bottom;
  }
  const onDown=e=>{
    const p=pt(e);
    if(stickId==null && inZone(p.x,p.y)){
      startStick(p.id,p.x,p.y);
      if(e.cancelable) e.preventDefault();
      return;
    }
  };
  const onLookDown=e=>{
    const p=pt(e);
    const busy=document.getElementById("modal")?.classList.contains("on");
    const el=document.elementFromPoint(p.x,p.y);
    if(busy||!running||lookId!=null) return;
    if(el&&el.closest&&el.closest("#actbtn,#jmpbtn,#dpad,.chip,.quest,button.btn,#btnmenu,#btnboard,.screen,.zoom,#btnzoomin,#btnzoomout")) return;
    if(p.x>innerWidth*0.48){
      lookId=p.id; lx=p.x; ly=p.y;
      if(e.cancelable) e.preventDefault();
    }
  };
  const onMove=e=>{
    if(e.touches && e.touches.length>=2){
      const a=e.touches[0], b=e.touches[1];
      const d=Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
      if(window.__pinch0) zoomBy((window.__pinch0-d)*0.035);
      window.__pinch0=d;
      if(e.cancelable) e.preventDefault();
      return;
    }
    window.__pinch0=null;
    if(lookId!=null){
      let x,y;
      if(e.touches){
        let t=null; for(const k of e.touches){ if(k.identifier===lookId) t=k; }
        if(t){ x=t.clientX; y=t.clientY; }
      } else if(e.pointerId===lookId){ x=e.clientX; y=e.clientY; }
      if(x!=null){
        camYaw -= (x-lx)*0.0075;
        camPitch = Math.max(0.12, Math.min(1.15, camPitch+(y-ly)*0.005));
        lx=x; ly=y;
        if(e.cancelable) e.preventDefault();
      }
    }
    if(stickId==null) return;
    let x,y;
    if(e.touches){
      let t=null; for(const k of e.touches){ if(k.identifier===stickId) t=k; }
      if(!t) return; x=t.clientX; y=t.clientY;
    } else { if(e.pointerId!==stickId) return; x=e.clientX; y=e.clientY; }
    applyStick(x,y);
    if(e.cancelable) e.preventDefault();
  };
  const onUp=e=>{
    if(lookId!=null){
      if(e.changedTouches){ for(const t of e.changedTouches){ if(t.identifier===lookId) lookId=null; } }
      else if(e.pointerId===lookId) lookId=null;
    }
    if(stickId==null) return;
    if(e.changedTouches){
      for(const t of e.changedTouches){ if(t.identifier===stickId) endStick(stickId); }
    } else endStick(e.pointerId);
  };
  const surf=zone||document;
  const pe={passive:false};
  ["pointerdown","touchstart"].forEach(ev=>surf.addEventListener(ev,onDown,pe));
  ["pointerdown","touchstart"].forEach(ev=>document.addEventListener(ev,onLookDown,pe));
  ["pointermove","touchmove"].forEach(ev=>document.addEventListener(ev,onMove,pe));
  ["pointerup","pointercancel","touchend","touchcancel"].forEach(ev=>document.addEventListener(ev,onUp,pe));

  if(dpad){
    dpad.querySelectorAll("b").forEach(b=>{
      const down=e=>{ e.preventDefault(); e.stopPropagation(); padDir={x:+b.dataset.dx, y:+b.dataset.dy}; dpad.querySelectorAll("b").forEach(x=>x.classList.remove("on")); b.classList.add("on"); };
      const up=()=>{ padDir={x:0,y:0}; dpad.querySelectorAll("b").forEach(x=>x.classList.remove("on")); };
      b.addEventListener("pointerdown",down,pe);
      b.addEventListener("touchstart",down,pe);
      ["pointerup","pointerleave","pointercancel","touchend"].forEach(ev=>b.addEventListener(ev,up));
    });
  }
  const jb=document.getElementById("jmpbtn");
  if(jb){
    jb.addEventListener("pointerdown",e=>{ e.preventDefault(); e.stopPropagation(); jumpHeld=true; },pe);
    jb.addEventListener("touchstart",e=>{ e.preventDefault(); e.stopPropagation(); jumpHeld=true; },pe);
    ["pointerup","pointerleave","pointercancel","touchend"].forEach(ev=>jb.addEventListener(ev,()=>jumpHeld=false));
  }
  const ab=document.getElementById("actbtn");
  if(ab){
    let t=0;
    const fire=e=>{ e.preventDefault(); e.stopPropagation(); const n=performance.now(); if(n-t<200) return; t=n; interact(); };
    ab.addEventListener("pointerdown",fire,pe);
  }
  addEventListener("pointerdown",()=>{ try{ const a=tone.ac||(tone.ac=new (AudioContext||webkitAudioContext)()); if(a.state==="suspended") a.resume(); }catch(e){} }, {passive:true});
}
function enterWorldNow(){
  try{
    cv=document.getElementById("cv")||cv;
    if(!cv){ setTimeout(enterWorldNow, 80); return; }
    ctx=null;
    if(W3 && W3.renderer && W3.renderer.domElement!==cv){
      try{ W3.renderer.dispose(); }catch(e){}
      W3=null;
    }
    running=true;
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("on"));
    const hudEl=document.getElementById("hudui");
    if(hudEl) hudEl.style.display="block";
    hud(); showPhoneUI(); resize();
    if(window.THREE) init3D();
    else setTimeout(function(){ if(window.THREE) init3D(); else window.__noWebGL=true; }, 120);
    resize();
    try{ cv&&cv.focus(); }catch(e){}
    if(!window.__bohaterRO && cv && window.ResizeObserver){
      window.__bohaterRO=new ResizeObserver(()=>resize());
      window.__bohaterRO.observe(cv);
    }
  }catch(err){
    const t=document.getElementById("toast");
    if(t){ t.style.display="block"; t.textContent="Błąd: "+(err&&err.message?err.message:err); }
    console.error(err);
  }
}
window.__bohaterStart=function(){
  bindUI();
  setupTouch();
  const qb=document.getElementById("questbox");
  if(qb && !qb.__wired){ qb.__wired=1; qb.addEventListener("click",e=>{ const b=e.target.closest("[data-chap]"); if(!b) return; const p=PADS.find(x=>x.id===b.dataset.chap); if(p) startPad(p); }); }
  document.querySelectorAll("input").forEach(i=>{ i.style.cssText="font:800 18px 'Baloo 2',Nunito,sans-serif;border:3px solid #1b2430;border-radius:12px;padding:8px 12px;width:200px;text-align:center"; });
  const a=document.getElementById("agree"); if(a) a.checked=true;
  const zi=document.getElementById("btnzoomin"), zo=document.getElementById("btnzoomout");
  if(zi) zi.onclick=()=>zoomBy(-1.8);
  if(zo) zo.onclick=()=>zoomBy(1.8);
  if(!window.__zoomWired){
    window.__zoomWired=1;
    addEventListener("wheel", e=>{
      if(!running) return;
      if(document.getElementById("modal") && document.getElementById("modal").classList.contains("on")) return;
      if(e.cancelable) e.preventDefault();
      zoomBy(e.deltaY>0?1.15:-1.15);
    }, {passive:false});
    addEventListener("keydown", e=>{
      if(e.code==="Equal"||e.code==="NumpadAdd"||e.code==="BracketRight") zoomBy(-1.6);
      if(e.code==="Minus"||e.code==="NumpadSubtract"||e.code==="BracketLeft") zoomBy(1.6);
      if(e.code==="Digit0") camDist=6.4;
    });
  }
  if(!window.__cvWatch && window.MutationObserver){
    window.__cvWatch=1;
    new MutationObserver(()=>{
      const live=document.getElementById("cv");
      if(live && live!==cv){ window.__touchBound=null; bindUI(); setupTouch(); }
    }).observe(document.body,{childList:true,subtree:true});
  }
  enterWorldNow();
};

window.__controlsTest={ getYaw:()=>p1.yaw, getSpeed:()=>p1.speed, setKeys:(codes)=>{ inj=codes&&codes.length?new Set(codes):null; } };
window.__game={startPad,PADS,MISSIONS,p1,enterWorldNow};

resize();
if(!window.__bohaterLoopOn){ window.__bohaterLoopOn=true; requestAnimationFrame(loop); }
window.__bohaterStart();

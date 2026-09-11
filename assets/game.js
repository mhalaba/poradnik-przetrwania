/* ===== Gra 3D „Miasteczko” v2 – Poradnik przetrwania (Three.js r128) =====
   Questy fabularne z rodziną Nowaków, zadania wykonywane w świecie 3D, wskaźnik spokoju,
   tryb nocny z latarką, deszcz, powódź. Wersja dzieci (?wersja=dzieci) i dorośli. */
(function(){
'use strict';
const params=new URLSearchParams(location.search);
const KIDS=params.get('wersja')==='dzieci';
if(KIDS) document.body.classList.add('kids');
const DATA=KIDS?window.ROZDZIALY_DZIECI:window.ROZDZIALY;
const KEY='pp_game2_'+(KIDS?'dzieci':'dorosli');
let state={done:{},score:0,calm:80};
try{ state=Object.assign(state,JSON.parse(localStorage.getItem(KEY)||'{}')); }catch(e){}
const save=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(state)); }catch(e){} };
document.querySelectorAll('.buy').forEach(a=>a.href=KSIAZKA.sklep);
{ const mp=document.getElementById('modePill'); mp.textContent=KIDS?'🧒 Dzieci ⇄':'🧭 Dorośli ⇄'; mp.style.cursor='pointer'; mp.title='Przełącz wersję gry'; mp.onclick=()=>location.href='gra.html?wersja='+(KIDS?'dorosli':'dzieci'); }
const $=s=>document.querySelector(s);
const TR=(n,d)=>{ try{ (window.track||function(){})(n,d||{}); }catch(e){} };
let soundOn=true; $('#soundBtn').onclick=()=>{ soundOn=!soundOn; $('#soundBtn').textContent=soundOn?'🔊 Dźwięk':'🔇 Dźwięk'; };
const T=(a,k)=>KIDS?k:a;

/* ---------- AUDIO ---------- */
let actx=null; function audio(){ if(!actx) actx=new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==='suspended') actx.resume(); return actx; }
function beep(f=880,d=.12,type='sine',vol=.2){ if(!soundOn) return; const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type=type; o.frequency.value=f; g.gain.value=vol; o.connect(g); g.connect(a.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+d); o.stop(a.currentTime+d); }
function good(){ beep(660,.1); setTimeout(()=>beep(880,.15),100); setTimeout(()=>beep(1320,.2),200); }
function bad(){ beep(220,.25,'sawtooth',.12); }
function pick(){ beep(1200,.08,'triangle',.15); }
function siren(kind,seconds=4){ if(!soundOn) return; const a=audio(),o=a.createOscillator(),g=a.createGain(); o.type='sawtooth'; g.gain.value=.07; o.connect(g); g.connect(a.destination); const t0=a.currentTime; o.start(t0);
  if(kind==='mod'){ for(let t=0;t<seconds;t+=1){ o.frequency.setValueAtTime(400,t0+t); o.frequency.linearRampToValueAtTime(800,t0+t+.5); o.frequency.linearRampToValueAtTime(400,t0+t+1);} }
  else if(kind==='cont'){ o.frequency.setValueAtTime(600,t0); }
  else { o.frequency.setValueAtTime(600,t0); for(let t=0;t<seconds;t+=.6){ g.gain.setValueAtTime(.07,t0+t); g.gain.setValueAtTime(.0001,t0+t+.3);} }
  g.gain.setValueAtTime(g.gain.value,t0+seconds-.05); g.gain.linearRampToValueAtTime(.0001,t0+seconds); o.stop(t0+seconds); }
function bang(){ if(!soundOn) return; const a=audio(); const b=a.createBuffer(1,a.sampleRate*.6,a.sampleRate); const d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3); const s=a.createBufferSource(); s.buffer=b; const g=a.createGain(); g.gain.value=KIDS?.2:.45; s.connect(g); g.connect(a.destination); s.start(); }

/* ---------- RENDERER / SCENA ---------- */
const canvas=$('#c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=KIDS?1.0:.95; renderer.outputEncoding=THREE.sRGBEncoding;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(66,1,.1,600);
const skyUniforms={top:{value:new THREE.Color(KIDS?0x5fb8ff:0x35507f)},bottom:{value:new THREE.Color(KIDS?0xdff4ff:0xe4c6a4)}};
const sky=new THREE.Mesh(new THREE.SphereGeometry(450,24,12),new THREE.ShaderMaterial({uniforms:skyUniforms,side:THREE.BackSide,depthWrite:false,fog:false,
  vertexShader:'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float h=normalize(vP).y; float t=smoothstep(-0.05,0.6,h); gl_FragColor=vec4(mix(bottom,top,t),1.0);}'}));
scene.add(sky);
const DAY={fog:KIDS?0xd6f0ff:0xc9bda8,hemiI:KIDS?.9:.75,sunI:KIDS?1.1:1.05,top:KIDS?0x5fb8ff:0x35507f,bottom:KIDS?0xdff4ff:0xe4c6a4};
const NIGHT={fog:0x0b1020,hemiI:.12,sunI:.05,top:0x05070f,bottom:0x151b33};
scene.fog=new THREE.Fog(DAY.fog,KIDS?95:80,KIDS?330:270);
const hemi=new THREE.HemisphereLight(0xdfe8ff,0x4a6a3a,DAY.hemiI); scene.add(hemi);
const sun=new THREE.DirectionalLight(KIDS?0xfff4d6:0xffd2a0,DAY.sunI); sun.position.set(50,70,30); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); sun.shadow.bias=-.0005;
Object.assign(sun.shadow.camera,{left:-70,right:70,top:70,bottom:-70,near:1,far:220}); scene.add(sun);
const sunTarget=new THREE.Object3D(); scene.add(sunTarget); sun.target=sunTarget;
const camTmp=new THREE.Vector3(); let frame=0;
/* kamera nie wchodzi w budynki – jak w grach survivalowych: podjeżdża bliżej, gdy coś zasłania gracza */
const camRay=new THREE.Raycaster(), camFrom=new THREE.Vector3(), camDirV=new THREE.Vector3();
function camClear(px,py,pz,cosP,desired){
  camFrom.set(px,py+1.6,pz);
  camDirV.set(Math.sin(camYaw)*cosP,Math.sin(pitch),Math.cos(camYaw)*cosP).normalize();
  camRay.set(camFrom,camDirV); camRay.near=0; camRay.far=desired+.6;
  const hit=camRay.intersectObjects(solids,false)[0];
  return hit?Math.max(3,hit.distance-1):desired;
}
const torch=new THREE.SpotLight(0xfff1c8,0,45,.6,.5,1); scene.add(torch); scene.add(torch.target);
const glow=new THREE.PointLight(0xffd9a0,0,14,2); scene.add(glow);

/* ---------- TEKSTURY PROCEDURALNE ---------- */
function tex(w,h,fn,rep=1){ const cv=document.createElement('canvas'); cv.width=w; cv.height=h; fn(cv.getContext('2d'),w,h); const t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(rep,rep); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; return t; }
const grassT=tex(256,256,(c,w,h)=>{ c.fillStyle=KIDS?'#7fd36a':'#5f8a45'; c.fillRect(0,0,w,h); for(let i=0;i<2600;i++){ c.fillStyle=`hsl(${KIDS?100:95},${40+Math.random()*30}%,${(KIDS?45:32)+Math.random()*18}%)`; c.fillRect(Math.random()*w,Math.random()*h,2,3);} },60);
const roadT=tex(256,256,(c,w,h)=>{ c.fillStyle=KIDS?'#8d93a6':'#4b4f5a'; c.fillRect(0,0,w,h); for(let i=0;i<900;i++){ c.fillStyle=`rgba(255,255,255,${Math.random()*.08})`; c.fillRect(Math.random()*w,Math.random()*h,2,2);} },1);
const roofT=tex(128,128,(c,w,h)=>{ c.fillStyle='#c9c9c9'; c.fillRect(0,0,w,h); c.strokeStyle='rgba(0,0,0,.35)'; for(let y=0;y<h;y+=16){ c.beginPath(); c.moveTo(0,y); c.lineTo(w,y); c.stroke(); for(let x=(y/16%2)*16;x<w;x+=32){ c.beginPath(); c.moveTo(x,y); c.lineTo(x,y+16); c.stroke(); } } },2);
const wallT=tex(128,128,(c,w,h)=>{ c.fillStyle='#ffffff'; c.fillRect(0,0,w,h); for(let i=0;i<500;i++){ c.fillStyle=`rgba(0,0,0,${Math.random()*.07})`; c.fillRect(Math.random()*w,Math.random()*h,3,3);} },2);
const brickT=tex(128,128,(c,w,h)=>{ c.fillStyle='#e8e8e8'; c.fillRect(0,0,w,h); c.fillStyle='rgba(0,0,0,.14)'; for(let y=0;y<h;y+=12){ for(let x=(y/12%2)*12;x<w;x+=24) c.fillRect(x,y,22,10);} },3);

const M=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.85,metalness:.02},o));
const P=KIDS?{roof:0xff6b6b,roof2:0xffb347,roof3:0x6bcbff,wall:0xfff4d6,wall2:0xffe0ec,water:0x4fc3f7,trunk:0xa0673f,leaf:0x39b54a,leaf2:0x6ad46a,block:0xd7d2ff}
            :{roof:0x9b4034,roof2:0x7a5a3a,roof3:0x4a5a7a,wall:0xe8dcc2,wall2:0xc9bfae,water:0x2e6f9e,trunk:0x5a3d24,leaf:0x2f6b32,leaf2:0x4f8a3a,block:0xa4a8b5};
const world=new THREE.Group(); scene.add(world);
const colliders=[]; const emissiveWindows=[]; const solids=[];
/* Miejsca, gdzie nie rozsiewamy drzew ani trawy, ale gracz moze po nich chodzic
   (np. rozeta kompasu wkopana w ziemie). colliders blokowaloby ruch. */
const bezRoslin=[];
function box(w,h,d,c,x,y,z,opts){ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c,opts)); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; world.add(m); return m; }
const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),M(0xffffff,{map:grassT})); ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; world.add(ground);
const hill=new THREE.Mesh(new THREE.ConeGeometry(24,9,32,4),M(0xffffff,{map:grassT})); hill.position.set(-60,0,-60); hill.castShadow=true; hill.receiveShadow=true; world.add(hill); solids.push(hill);
const riverGeo=new THREE.PlaneGeometry(500,16,120,6);
const river=new THREE.Mesh(riverGeo,M(P.water,{transparent:true,opacity:.88,roughness:.25,metalness:.1})); river.rotation.x=-Math.PI/2; river.position.set(0,.06,45); world.add(river);
const riverBase=riverGeo.attributes.position.array.slice();
box(500,.4,2,0xa08a6a,0,.1,36.5); box(500,.4,2,0xa08a6a,0,.1,53.5);
function road(w,d,x,z){ const mt=M(0xffffff,{map:roadT.clone()}); mt.map.needsUpdate=true; mt.map.repeat.set(w/8,d/8); const r=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mt); r.rotation.x=-Math.PI/2; r.position.set(x,.03,z); r.receiveShadow=true; world.add(r);
  const horiz=w>d; const n=Math.floor((horiz?w:d)/6); for(let i=0;i<n;i++){ const s=new THREE.Mesh(new THREE.PlaneGeometry(horiz?3:.3,horiz?.3:3),new THREE.MeshBasicMaterial({color:0xf0e6c0})); s.rotation.x=-Math.PI/2; s.position.set(horiz?x-w/2+3+i*6:x,.04,horiz?z:z-d/2+3+i*6); world.add(s);} }
road(6,200,0,-20); road(160,6,0,-10); road(6,70,-40,15); road(70,6,40,20); road(6,40,-60,-30);
box(9,.5,20,KIDS?0xc9a36b:0x6b5a45,0,.25,45); box(.4,1.2,20,0x8a7a60,-4.3,.9,45); box(.4,1.2,20,0x8a7a60,4.3,.9,45); colliders.push({x:-5,z:35,w:1,d:20},{x:4,z:35,w:1,d:20});

const labels=[];
function makeLabel(text,x,y,z,size=1,bg='rgba(10,16,30,.62)',maxDist=55){
  const FONT=f=>'bold '+f+'px Nunito, Inter, sans-serif';
  const mier=document.createElement('canvas').getContext('2d');
  // Najpierw zmniejszamy pismo, dopiero potem poszerzamy tabliczke. Dzieki temu dlugie
  // nazwy misji miesza sie w calosci, a nie robia sie olbrzymie w swiecie.
  let f=46; mier.font=FONT(f); let w=mier.measureText(text).width;
  while(w>452 && f>30){ f-=2; mier.font=FONT(f); w=mier.measureText(text).width; }
  const W=Math.min(1280,Math.max(512,Math.ceil(w+56))), H=112;
  const cv=document.createElement('canvas'); cv.width=W; cv.height=H;
  const cx=cv.getContext('2d');
  cx.fillStyle=bg;
  if(cx.roundRect){ cx.beginPath(); cx.roundRect(2,2,W-4,H-4,38); cx.fill(); } else cx.fillRect(0,0,W,H);
  cx.strokeStyle='rgba(255,255,255,.25)'; cx.lineWidth=3; if(cx.roundRect) cx.stroke();
  cx.fillStyle='#fff'; cx.font=FONT(f); cx.textAlign='center'; cx.textBaseline='middle';
  cx.fillText(text,W/2,H/2+2,W-44);
  const t=new THREE.CanvasTexture(cv);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));
  sp.position.set(x,y,z); sp.scale.set(6.4*size*(W/512),1.4*size,1);
  sp.userData={maxDist,base:1}; world.add(sp); labels.push(sp); return sp;
}
const labTmp=new THREE.Vector3();
function fadeLabels(){ for(const l of labels){ const md=l.userData.maxDist, d=l.getWorldPosition(labTmp).distanceTo(camera.position); let o=d>md?0:(d>md*.72?1-(d-md*.72)/(md*.28):1); o*=l.userData.base; l.material.opacity=o; l.visible=o>.03; } }
function house(x,z,rot,wall,roof,scale=1,name){
  const g=new THREE.Group();
  const b=new THREE.Mesh(new THREE.BoxGeometry(8*scale,5*scale,7*scale),M(wall,{map:wallT})); b.position.y=2.5*scale; b.castShadow=true; b.receiveShadow=true; g.add(b); solids.push(b);
  const r=new THREE.Mesh(new THREE.ConeGeometry(6.6*scale,3.4*scale,4),M(roof,{map:roofT})); r.position.y=6.7*scale; r.rotation.y=Math.PI/4; r.castShadow=true; g.add(r); solids.push(r);
  const ch=new THREE.Mesh(new THREE.BoxGeometry(.8*scale,2*scale,.8*scale),M(0x7a5a4a)); ch.position.set(2.2*scale,7.2*scale,-1.5*scale); g.add(ch);
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.4*scale,2.4*scale,.2),M(0x5a3d24)); door.position.set(0,1.2*scale,3.55*scale); g.add(door);
  for(const dx of [-2.4,2.4]){ const w=new THREE.Mesh(new THREE.BoxGeometry(1.4*scale,1.2*scale,.2),M(0x9fd0ff,{emissive:0xffc866,emissiveIntensity:0})); w.position.set(dx*scale,3*scale,3.55*scale); g.add(w); emissiveWindows.push(w); }
  for(let i=-5;i<=5;i++){ if(Math.abs(i)<1) continue; const f=new THREE.Mesh(new THREE.BoxGeometry(.25,1,.25),M(0xd9c9a8)); f.position.set(i*scale,.5,5.5*scale); g.add(f);} const rail=new THREE.Mesh(new THREE.BoxGeometry(11*scale,.15,.15),M(0xd9c9a8)); rail.position.set(0,.8,5.5*scale); g.add(rail);
  g.position.set(x,0,z); g.rotation.y=rot; world.add(g); colliders.push({x:x-4.5*scale,z:z-4*scale,w:9*scale,d:8*scale}); if(name) makeLabel(name,x,9*scale,z,.75,undefined,42); return g; }
function block(x,z){ const b=new THREE.Mesh(new THREE.BoxGeometry(12,18,9),M(P.block,{map:brickT})); b.position.set(x,9,z); b.castShadow=true; b.receiveShadow=true; world.add(b); solids.push(b); for(let f=0;f<5;f++)for(let i=-2;i<=2;i++){ const w=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.4,.2),M(0x9fd0ff,{emissive:0xffc866,emissiveIntensity:0})); w.position.set(x+i*2.2,2.5+f*3.4,z+4.6); world.add(w); emissiveWindows.push(w);} colliders.push({x:x-6.5,z:z-5,w:13,d:10}); }
function tree(x,z,s=1){ const t=new THREE.Mesh(new THREE.CylinderGeometry(.25*s,.4*s,2.2*s,7),M(P.trunk)); t.position.set(x,1.1*s,z); t.castShadow=true; world.add(t); const lc=Math.random()<.5?P.leaf:P.leaf2; if(KIDS){ const c=new THREE.Mesh(new THREE.SphereGeometry(1.9*s,10,8),M(lc)); c.position.set(x,3.4*s,z); c.castShadow=true; world.add(c);} else { for(let i=0;i<3;i++){ const c=new THREE.Mesh(new THREE.ConeGeometry((1.9-i*.4)*s,2.2*s,8),M(lc)); c.position.set(x,(2.6+i*1.1)*s,z); c.castShadow=true; world.add(c);} } }
function lamp(x,z){ box(.22,6,.22,0x484d55,x,3,z); const l=new THREE.Mesh(new THREE.SphereGeometry(.45,10,8),new THREE.MeshBasicMaterial({color:0xfff2b0})); l.position.set(x,6.2,z); world.add(l); return l; }
function building(w,h,d,c,x,z,label,map){ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c,map?{map}:{})); b.position.set(x,h/2,z); b.castShadow=true; b.receiveShadow=true; world.add(b); solids.push(b); const roof=new THREE.Mesh(new THREE.BoxGeometry(w+.6,.5,d+.6),M(0x555)); roof.position.set(x,h+.25,z); world.add(roof); colliders.push({x:x-w/2-.5,z:z-d/2-.5,w:w+1,d:d+1}); if(label) makeLabel(label,x,h+2.5,z,1,undefined,110); return b; }

/* ---------- DODATKOWE GRY W MIASTECZKU ----------
   Dwa obiekty prowadzą do osobnych gier: karetka pod ratownictwo, hala-drukarka pod druk 3D.
   Wpisz adres, pod którym dana gra stoi w internecie. Dopóki pole jest puste, obiekt stoi
   w miasteczku i tłumaczy, że gra jeszcze nie ruszyła – nikt nie trafia w martwy link. */
const GRY={
  akademia112:{ key:'akademia112', url:'akademia-112/', x:50, z:30, r:4.6, btn:'🚑 Akademia 112',
    tytul:'🚑 Akademia 112',
    opis:'Osobna gra o pierwszej pomocy i bezpieczeństwie. Uczysz się rozpoznać zatrzymanie krążenia, uciskać klatkę w rytmie 100–120 na minutę, zatamować krwotok, zachować się przy podejrzanej paczce i przy dymie w budynku. Są też sygnały alarmowe i ewakuacja. Dla dzieci 10–14 lat, do grania razem.',
    cta:'Wsiadam do karetki →' },
  kompas:{ key:'stacja_kompas', stacja:'kompas', x:-30, z:-50, r:5.4, btn:'🧭 Stacja kompasu',
    tytul:'🧭 Stacja kompasu',
    opis:'Wielka róża wiatrów wkopana w ziemię. Igła w środku naprawdę pokazuje północ tego świata. Nauczysz się czytać azymut, liczyć drogę powrotną, poprawiać deklinację i przejdziesz odcinek na azymut w terenie — z kompasem w rogu ekranu, bez znacznika na mapie.',
    cta:'Staję przy róży wiatrów →' },
  elektronika:{ key:'stacja_elektronika', stacja:'elektronika', x:-60, z:-24, r:6.4, btn:'⚡ Warsztat elektroniki',
    tytul:'⚡ Warsztat elektroniki',
    opis:'Wiata z ławą warsztatową, panelem słonecznym i wielkim rezystorem przy wejściu. Prawo Ohma, liczenie zapasu energii w watogodzinach, łączenie ogniw szeregowo i równolegle, składanie obwodu, który nie spali diody, oraz zasady, dzięki którym agregat nie zabije nikogo czadem.',
    cta:'Wchodzę do warsztatu →' },
  laptop:{ key:'stacja_weryfikacji', stacja:'dezinformacja', x:32, z:10, r:5.8, btn:'💻 Stacja weryfikacji',
    tytul:'💻 Stacja weryfikacji',
    opis:'Wielki laptop przy drodze do sklepu. Uczysz się rozpoznawać manipulację po technice, a nie po temacie: pośpiech, podszycie się pod źródło, wyrwane z kontekstu zdjęcie, podstawiony ekspert. Wchodzimy przez oszustwa i pieniądze, nie przez politykę. Potem prowadzisz komunikację gminy w czasie fałszywego alarmu i poznajesz rozmowę, w której ktoś proponuje nastolatkowi „łatwe zlecenie”. Na końcu — jak potwierdzić, że coś naprawdę jest prawdą.',
    cta:'Siadam do laptopa →' },
  dysza:{ key:'akademia_dyszy', url:'akademia-dyszy/', x:24, z:-46, r:6.2, btn:'🖨️ Akademia Dyszy',
    tytul:'🖨️ Akademia Dyszy',
    opis:'Osobna gra-kampus o druku 3D. Lekcje o drukarce, filamencie, fizyce i matematyce wydruku, laboratoria (zużycie nitki, wysokość warstwy, skala, układ współrzędnych), quizy, egzamin i dyplom. Dla uczniów 10–14 lat, program STEAM.',
    cta:'Wchodzę do hali →' }
};
const AMB=GRY.akademia112, DYSZA=GRY.dysza, KOMP=GRY.kompas, ELEK=GRY.elektronika, LAPTOP=GRY.laptop;
if(!state.stacje) state.stacje={};

const HOME=[-20,-30];
house(HOME[0],HOME[1],0,P.wall,P.roof,1,T('Dom Nowaków','Twój dom'));
house(-36,-30,0,P.wall2,P.roof2,.9,T('Pani Krysia (82 l.)','Pani Krysia'));
house(18,-30,Math.PI,P.wall,P.roof3,1,T('Pan Marek (agregat)','Pan Marek'));
house(32,-30,Math.PI,P.wall2,P.roof,.9);
house(-20,8,Math.PI,P.wall2,P.roof2,1);
house(-58,-30,0,P.wall,P.roof3,.9,'Kowalscy');
house(18,34,Math.PI,P.wall,P.roof2,1,T('Dom po powodzi','Zalany dom'));
block(-20,-62); block(20,-62);
building(20,7,10,KIDS?0xffd166:0xc9a45a,45,-45,'SZKOŁA',wallT);
building(16,9,10,KIDS?0xcdb4ff:0x8f86a8,-50,10,'URZĄD GMINY',brickT);
building(14,5,10,KIDS?0xa0e7a0:0x7a9a72,45,0,'SKLEP',wallT);
building(12,6,10,KIDS?0xff7b7b:0xa83a3a,-52,-60,'OSP / SCHRON',brickT);
building(12,7,10,KIDS?0xb3e5fc:0x6a8697,62,-15,'BANK',wallT);
building(14,6,10,0xf4f4f4,62,20,'PUNKT MEDYCZNY',wallT); box(1.6,4,.3,0xe53935,62,3.5,25.3); box(4,1.6,.3,0xe53935,62,3.5,25.3);
box(1.5,16,1.5,0x666,0,8,-75); box(3,1.5,3,0xff3d3d,0,16.5,-75); makeLabel('SYRENA',0,19,-75,1,undefined,110);
building(10,6,8,0x777788,-75,-10,'STACJA ENERGETYCZNA'); box(1.2,14,1.2,0x555,-79,7,-6); box(1.2,14,1.2,0x555,-71,7,-6);
building(10,4,6,KIDS?0xffe0b2:0x8f7f6f,72,45,'KAFEJKA / WI-FI'); box(.8,18,.8,0x999,72,9,45);
const car=new THREE.Group(); { const cb=new THREE.Mesh(new THREE.BoxGeometry(4.2,1.2,2),M(KIDS?0x4fc3f7:0x8a1c2b,{roughness:.4,metalness:.3})); cb.position.y=.9; cb.castShadow=true; car.add(cb); const ct=new THREE.Mesh(new THREE.BoxGeometry(2.4,1,1.8),M(0x9fd0ff,{roughness:.2})); ct.position.set(-.2,1.9,0); car.add(ct); [[1.4,.9],[-1.4,.9],[1.4,-.9],[-1.4,-.9]].forEach(([x,z])=>{ const w=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.4,12),M(0x222)); w.rotation.x=Math.PI/2; w.position.set(x,.45,z); car.add(w);}); car.position.set(-12,0,-24); world.add(car); colliders.push({x:-14.5,z:-25.5,w:5,d:3}); }
/* ---------- KARETKA: wejście do gry „Akademia 112” ---------- */
const ambLights=[];
{ const g=new THREE.Group();
  const t112=tex(256,128,(c,w,h)=>{ c.fillStyle='#f4f7fa'; c.fillRect(0,0,w,h); c.fillStyle='#d62828'; c.fillRect(0,h*.66,w,h*.14); c.fillStyle='#0b1b2e'; c.font='bold 74px Inter, Nunito, sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('112',w/2,h*.36); });
  const body=new THREE.Mesh(new THREE.BoxGeometry(5.4,2.2,2.4),M(0xf4f7fa,{roughness:.45})); body.position.set(-.6,1.7,0); body.castShadow=true; g.add(body);
  [-1.21,1.21].forEach(z=>{ const s2=new THREE.Mesh(new THREE.PlaneGeometry(5.2,2),new THREE.MeshStandardMaterial({map:t112,roughness:.5})); s2.position.set(-.6,1.7,z); s2.rotation.y=z>0?0:Math.PI; g.add(s2); });
  const cab=new THREE.Mesh(new THREE.BoxGeometry(2.2,1.6,2.3),M(0xf4f7fa,{roughness:.45})); cab.position.set(3.1,1.4,0); cab.castShadow=true; g.add(cab);
  const glass=new THREE.Mesh(new THREE.BoxGeometry(.3,1,2.05),M(0x24425e,{roughness:.12,metalness:.45})); glass.position.set(4.15,1.65,0); g.add(glass);
  const bar=new THREE.Mesh(new THREE.BoxGeometry(2,.3,1.7),M(0x1b2430)); bar.position.set(.6,2.95,0); g.add(bar);
  [-.55,.55].forEach((x,i)=>{ const l=new THREE.Mesh(new THREE.BoxGeometry(.7,.34,1.5),M(i?0xff4d4d:0x4d7dff,{emissive:i?0xff2020:0x2050ff,emissiveIntensity:.6})); l.position.set(.6+x,3.05,0); g.add(l); ambLights.push(l); });
  const krzyz=(x,y,z,ry)=>{ const c1=new THREE.Mesh(new THREE.BoxGeometry(.9,.26,.06),M(0xd62828)); const c2=new THREE.Mesh(new THREE.BoxGeometry(.26,.9,.06),M(0xd62828)); [c1,c2].forEach(m=>{ m.position.set(x,y,z); m.rotation.y=ry; g.add(m); }); };
  krzyz(-3.32,1.9,0,Math.PI/2);
  [[1.7,1.1],[-1.9,1.1],[1.7,-1.1],[-1.9,-1.1]].forEach(([x,z])=>{ const w=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.42,14),M(0x1b1b1b)); w.rotation.x=Math.PI/2; w.position.set(x,.5,z); g.add(w); });
  g.position.set(AMB.x,0,AMB.z); g.rotation.y=Math.PI; world.add(g);
  colliders.push({x:AMB.x-3.6,z:AMB.z-1.7,w:7.2,d:3.4});
  makeLabel('🚑 AKADEMIA 112',AMB.x,5.4,AMB.z,1,'rgba(140,20,20,.72)',120);
}

/* ---------- HALA W KSZTAŁCIE DRUKARKI 3D: wejście do gry „Akademia Dyszy” ---------- */
let dyszaHead=null, dyszaGantry=null;
{ const g=new THREE.Group();
  const stal=M(0x99a2ad,{metalness:.55,roughness:.32});
  const baza=new THREE.Mesh(new THREE.BoxGeometry(10,2.6,9),M(0x2c3441,{roughness:.6})); baza.position.y=1.3; baza.castShadow=true; baza.receiveShadow=true; g.add(baza);
  const drzwi=new THREE.Mesh(new THREE.BoxGeometry(2.2,2.1,.2),M(0x11161f,{emissive:0xffc866,emissiveIntensity:.12})); drzwi.position.set(0,1.05,4.55); g.add(drzwi);
  const prog=new THREE.Mesh(new THREE.BoxGeometry(3,.2,1.2),M(0x5b6473)); prog.position.set(0,.1,5.2); g.add(prog);
  [[-4.4,-3.9],[4.4,-3.9],[-4.4,3.9],[4.4,3.9]].forEach(([x,z])=>{ const c=new THREE.Mesh(new THREE.BoxGeometry(.6,9.4,.6),stal); c.position.set(x,7.3,z); c.castShadow=true; g.add(c); });
  [[0,-3.9,10,'x'],[0,3.9,10,'x'],[-4.4,0,8.4,'z'],[4.4,0,8.4,'z']].forEach(([x,z,len,os])=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(os==='x'?len:.6,.6,os==='x'?.6:len),stal); b.position.set(x,11.9,z); g.add(b); });
  const stol=new THREE.Mesh(new THREE.BoxGeometry(7.6,.4,6.6),M(0x1d2733,{roughness:.25,metalness:.3})); stol.position.y=3.1; g.add(stol);
  const szyba=new THREE.Mesh(new THREE.BoxGeometry(7.2,.12,6.2),M(0x7fd4e8,{transparent:true,opacity:.55,roughness:.1,metalness:.2})); szyba.position.y=3.36; g.add(szyba);
  for(let i=0;i<7;i++){ const w=new THREE.Mesh(new THREE.BoxGeometry(2.6-i*.18,.34,2.6-i*.18),M(0xff8b3d,{roughness:.7})); w.position.set(0,3.6+i*.34,0); w.castShadow=true; g.add(w); }
  dyszaGantry=new THREE.Mesh(new THREE.BoxGeometry(9.4,.5,.5),stal); dyszaGantry.position.set(0,7.6,0); g.add(dyszaGantry);
  dyszaHead=new THREE.Group();
  const blok=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.3,1.2),M(0x39424f,{metalness:.4})); blok.position.y=-.1; dyszaHead.add(blok);
  const dysza=new THREE.Mesh(new THREE.ConeGeometry(.32,.7,10),M(0xd9a441,{metalness:.7,roughness:.25})); dysza.position.y=-1.05; dysza.rotation.x=Math.PI; dyszaHead.add(dysza);
  const went=new THREE.Mesh(new THREE.BoxGeometry(.3,1,1),M(0x1f2731)); went.position.set(.85,-.1,0); dyszaHead.add(went);
  dyszaHead.position.set(0,7.4,0); g.add(dyszaHead);
  { const uch=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,1.2,10),stal); uch.rotation.z=Math.PI/2; uch.position.set(5.3,9.4,0); g.add(uch);
    const szp=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,.9,22),M(0x2fb673,{roughness:.75})); szp.rotation.z=Math.PI/2; szp.position.set(5.9,9.4,0); szp.castShadow=true; g.add(szp);
    [-.5,.5].forEach(d=>{ const t=new THREE.Mesh(new THREE.CylinderGeometry(1.65,1.65,.12,22),M(0x1b2430)); t.rotation.z=Math.PI/2; t.position.set(5.9+d*.5,9.4,0); g.add(t); }); }
  const napis=tex(256,64,(c,w,h)=>{ c.fillStyle='#131b26'; c.fillRect(0,0,w,h); c.fillStyle='#ffc857'; c.font='bold 34px Inter, Nunito, sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('OMNI 200',w/2,h/2); });
  const tab=new THREE.Mesh(new THREE.PlaneGeometry(4.4,1.1),new THREE.MeshStandardMaterial({map:napis,roughness:.6,emissive:0x3a2c08,emissiveIntensity:.35})); tab.position.set(0,2.1,4.62); g.add(tab);
  g.position.set(DYSZA.x,0,DYSZA.z); world.add(g);
  colliders.push({x:DYSZA.x-5.2,z:DYSZA.z-4.7,w:10.4,d:9.4});
  makeLabel('🖨️ AKADEMIA DYSZY',DYSZA.x,13.6,DYSZA.z,1,'rgba(20,40,70,.72)',130);
}

/* ---------- STACJA KOMPASU: rozeta wiatrow wkopana w ziemie ---------- */
let kompasIgla=null;
{ const g=new THREE.Group();
  const kamien=M(0xb9b3a6,{roughness:.9});
  const plyta=new THREE.Mesh(new THREE.CylinderGeometry(6.6,6.8,.4,48),kamien); plyta.position.y=.2; plyta.receiveShadow=true; g.add(plyta);
  const obrecz=new THREE.Mesh(new THREE.TorusGeometry(5.4,.2,8,48),M(0x2c3441,{metalness:.4,roughness:.5})); obrecz.rotation.x=Math.PI/2; obrecz.position.y=.42; g.add(obrecz);
  // promienie rozy wiatrow: 4 glowne dlugie, 4 posrednie krotsze
  for(let i=0;i<8;i++){
    const glowny=i%2===0, dl=glowny?5:3.2;
    const r=new THREE.Mesh(new THREE.BoxGeometry(.5,.06,dl),M(glowny?0x1d2733:0x8d99a8));
    r.position.set(Math.sin(i*Math.PI/4)*dl/2,.42,-Math.cos(i*Math.PI/4)*dl/2);
    r.rotation.y=i*Math.PI/4; g.add(r);
  }
  // litery kierunkow na kamieniach, obrocone do srodka
  [['N',0,0xd63a3a],['E',90,0x2c3441],['S',180,0x2c3441],['W',270,0x2c3441]].forEach(([lit,st,kol])=>{
    const t=tex(128,128,(c,w,h)=>{ c.fillStyle='#efeae0'; c.fillRect(0,0,w,h); c.fillStyle='#'+kol.toString(16).padStart(6,'0');
      c.font='bold 92px Nunito, Inter, sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(lit,w/2,h/2+4); });
    const a=st*Math.PI/180;
    const sl=new THREE.Mesh(new THREE.BoxGeometry(1.5,1.7,.22),[M(0xefeae0),M(0xefeae0),M(0xefeae0),M(0xefeae0),new THREE.MeshStandardMaterial({map:t,roughness:.8}),M(0xefeae0)]);
    sl.position.set(Math.sin(a)*7.7,.85,-Math.cos(a)*7.7); sl.rotation.y=a+Math.PI; sl.castShadow=true; g.add(sl);
  });
  // igla: czerwony grot na polnoc, bialy na poludnie. W tym swiecie polnoc to -Z.
  kompasIgla=new THREE.Group();
  const pn=new THREE.Mesh(new THREE.ConeGeometry(.55,4.6,4),M(0xd63a3a,{roughness:.4}));
  pn.rotation.x=-Math.PI/2; pn.position.z=-2.3; kompasIgla.add(pn);
  const pd=new THREE.Mesh(new THREE.ConeGeometry(.55,4.6,4),M(0xe8eef7,{roughness:.4}));
  pd.rotation.x=Math.PI/2; pd.position.z=2.3; kompasIgla.add(pd);
  kompasIgla.position.y=1.15; g.add(kompasIgla);
  const os=new THREE.Mesh(new THREE.CylinderGeometry(.5,.7,1.3,16),M(0x39424f,{metalness:.5,roughness:.4})); os.position.y=.6; os.castShadow=true; g.add(os);
  g.position.set(KOMP.x,0,KOMP.z); world.add(g);
  // po rozecie mozna chodzic, wiec nie dodajemy kolizji - tylko blokujemy roslinnosc
  bezRoslin.push({x:KOMP.x-8.5,z:KOMP.z-8.5,w:17,d:17});
  colliders.push({x:KOMP.x-.9,z:KOMP.z-.9,w:1.8,d:1.8});
  makeLabel('🧭 STACJA KOMPASU',KOMP.x,4.6,KOMP.z,1,'rgba(30,50,80,.72)',130);
}

/* ---------- WARSZTAT ELEKTRONIKI: wiata z lawa, panelem i wielkim rezystorem ---------- */
let elekZarowka=null, elekIskra=null;
{ const g=new THREE.Group();
  const beton=M(0x9aa1a8,{roughness:.95}), stal=M(0x8a929c,{metalness:.5,roughness:.35});
  const plyta=new THREE.Mesh(new THREE.BoxGeometry(12,.4,10),beton); plyta.position.y=.2; plyta.receiveShadow=true; g.add(plyta);
  [[-5.2,-4.2],[5.2,-4.2],[-5.2,4.2],[5.2,4.2]].forEach(([x,z])=>{ const sl=new THREE.Mesh(new THREE.BoxGeometry(.5,5,.5),stal); sl.position.set(x,2.9,z); sl.castShadow=true; g.add(sl); });
  const dach=new THREE.Mesh(new THREE.BoxGeometry(12.6,.4,10.6),M(0x4a5360,{roughness:.7})); dach.position.y=5.6; dach.rotation.z=.12; dach.castShadow=true; g.add(dach);
  // panel sloneczny na dachu
  const panelT=tex(128,128,(c,w,h)=>{ c.fillStyle='#16305a'; c.fillRect(0,0,w,h); c.strokeStyle='rgba(160,200,255,.55)'; c.lineWidth=3;
    for(let i=0;i<=4;i++){ c.beginPath(); c.moveTo(i*w/4,0); c.lineTo(i*w/4,h); c.stroke(); c.beginPath(); c.moveTo(0,i*h/4); c.lineTo(w,i*h/4); c.stroke(); } });
  const panel=new THREE.Mesh(new THREE.BoxGeometry(7,.25,4.4),new THREE.MeshStandardMaterial({map:panelT,roughness:.25,metalness:.35}));
  panel.position.set(-1,6.35,-1.4); panel.rotation.z=.12; panel.rotation.x=-.28; panel.castShadow=true; g.add(panel);
  // lawa warsztatowa
  const lawa=new THREE.Mesh(new THREE.BoxGeometry(7.5,.35,2.6),M(0x8b5a2b,{roughness:.8})); lawa.position.set(0,2.05,2.4); lawa.castShadow=true; g.add(lawa);
  [-3.3,3.3].forEach(x=>{ const n=new THREE.Mesh(new THREE.BoxGeometry(.35,1.9,2.2),stal); n.position.set(x,1.05,2.4); g.add(n); });
  // akumulator i przewody na lawie
  const akum=new THREE.Mesh(new THREE.BoxGeometry(1.9,1.2,1.2),M(0x1f2731)); akum.position.set(-2.4,2.8,2.4); akum.castShadow=true; g.add(akum);
  [[-2.9,0xd63a3a],[-1.9,0x2c3441]].forEach(([x,kol])=>{ const b=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.35,10),M(kol)); b.position.set(x,3.55,2.4); g.add(b); });
  // zarowka pod dachem, pulsuje jak dzialajacy uklad
  elekZarowka=new THREE.Mesh(new THREE.SphereGeometry(.6,14,12),new THREE.MeshStandardMaterial({color:0xfff3c4,emissive:0xffcc55,emissiveIntensity:1,roughness:.3}));
  elekZarowka.position.set(2.6,4.4,2.2); g.add(elekZarowka);
  const opr=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.9,10),stal); opr.position.set(2.6,5.1,2.2); g.add(opr);
  elekIskra=new THREE.PointLight(0xffcc66,1.1,12,2); elekIskra.position.set(2.6,4.4,2.2); g.add(elekIskra);
  // wielki rezystor przy wejsciu: 470 om, kod paskowy zolty-fioletowy-brazowy-zloty
  { const r=new THREE.Group();
    const korpus=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.05,4.4,20),M(0xf0e6cf,{roughness:.75}));
    korpus.rotation.z=Math.PI/2; korpus.castShadow=true; r.add(korpus);
    // kod paskowy 470 om: zolty-fioletowy-brazowy, zloty pasek tolerancji
    [[-1.3,0xd99000],[-.5,0x4b1f6e],[.3,0x3d2410],[1.5,0xb8860b]].forEach(([x,kol])=>{
      const p=new THREE.Mesh(new THREE.CylinderGeometry(1.16,1.16,.7,20),M(kol,{roughness:.45}));
      p.rotation.z=Math.PI/2; p.position.x=x; r.add(p); });
    // tabliczka z wartoscia - kod paskowy przestaje byc zagadka
    { const t=tex(256,128,(c,w,h)=>{ c.fillStyle='#12202f'; c.fillRect(0,0,w,h);
        c.fillStyle='#ffc857'; c.font='bold 62px Nunito, Inter, sans-serif'; c.textAlign='center'; c.textBaseline='middle';
        c.fillText('470 Ω',w/2,h/2-14);
        c.fillStyle='#9fb2d4'; c.font='600 26px Nunito, Inter, sans-serif';
        c.fillText('żółty-fiolet-brąz',w/2,h/2+34); });
      const tab=new THREE.Mesh(new THREE.PlaneGeometry(3,1.5),new THREE.MeshStandardMaterial({map:t,roughness:.7}));
      tab.position.set(0,-1.9,1.15); r.add(tab); }
    [-3.1,3.1].forEach(x=>{ const d=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,1.8,10),M(0xb9bec7,{metalness:.6,roughness:.3}));
      d.rotation.z=Math.PI/2; d.position.x=x; r.add(d); });
    [-2.2,2.2].forEach(x=>{ const n=new THREE.Mesh(new THREE.BoxGeometry(.3,2.6,.3),stal); n.position.set(x,-1.3,0); r.add(n); });
    r.position.set(0,3.1,6.6); g.add(r);
  }
  g.position.set(ELEK.x,0,ELEK.z); world.add(g);
  colliders.push({x:ELEK.x-6.2,z:ELEK.z-5.2,w:12.4,d:10.4});
  makeLabel('⚡ WARSZTAT ELEKTRONIKI',ELEK.x,8.4,ELEK.z,1,'rgba(70,50,10,.74)',130);
}

/* ---------- STACJA WERYFIKACJI: wielki laptop ---------- */
let laptopEkran=null, laptopSwiatlo=null, laptopDioda=null;
{ const g=new THREE.Group();
  const obudowa=M(0x9ba3ad,{metalness:.45,roughness:.35}), ciemny=M(0x1b2330,{roughness:.5});
  const cokol=new THREE.Mesh(new THREE.BoxGeometry(11,.5,8),M(0x8f979f,{roughness:.95}));
  cokol.position.y=.25; cokol.receiveShadow=true; g.add(cokol);
  // dolna część z klawiaturą, lekko pochylona do gracza
  const dol=new THREE.Group(); dol.position.set(0,.95,.6); dol.rotation.x=-.05;
  const spod=new THREE.Mesh(new THREE.BoxGeometry(9.4,.55,6.4),obudowa); spod.castShadow=true; dol.add(spod);
  const wglebienie=new THREE.Mesh(new THREE.BoxGeometry(8.4,.12,4.4),ciemny); wglebienie.position.set(0,.3,-.4); dol.add(wglebienie);
  for(let r=0;r<4;r++) for(let k=0;k<14;k++){
    const kl=new THREE.Mesh(new THREE.BoxGeometry(.5,.14,.42),M(0x2b3442,{roughness:.6}));
    kl.position.set(-3.9+k*.6, .4, -1.7+r*.62); dol.add(kl);
  }
  const gladzik=new THREE.Mesh(new THREE.BoxGeometry(2.6,.1,1.5),M(0x39424f,{roughness:.4,metalness:.2}));
  gladzik.position.set(0,.34,1.9); dol.add(gladzik);
  laptopDioda=new THREE.Mesh(new THREE.SphereGeometry(.13,10,8),new THREE.MeshBasicMaterial({color:0x7fe3c0}));
  laptopDioda.position.set(4.2,.38,2.5); dol.add(laptopDioda);
  g.add(dol);
  // ekran, odchylony do tyłu jak w otwartym laptopie
  const gora=new THREE.Group(); gora.position.set(0,1.2,-2.4); gora.rotation.x=-1.28;
  const plecy=new THREE.Mesh(new THREE.BoxGeometry(9.4,6.2,.35),obudowa); plecy.position.y=3.1; plecy.castShadow=true; gora.add(plecy);
  const ekranT=tex(512,352,(c,w,h)=>{
    c.fillStyle='#0d1626'; c.fillRect(0,0,w,h);
    // pasek przeglądarki
    c.fillStyle='#1b2740'; c.fillRect(0,0,w,62);
    [26,52,78].forEach((x,i)=>{ c.beginPath(); c.arc(x,31,8,0,6.2832); c.fillStyle=['#e05c5c','#e8c05c','#5ce07f'][i]; c.fill(); });
    c.fillStyle='#0d1626'; if(c.roundRect){ c.beginPath(); c.roundRect(104,14,w-128,34,17); c.fill(); } else c.fillRect(104,14,w-128,34);
    c.fillStyle='#7fe3c0'; c.font='bold 22px Nunito, Inter, sans-serif'; c.textAlign='left'; c.textBaseline='middle';
    c.fillText('🔒  sprawdz-zrodlo', 124, 32);
    // lupa
    c.strokeStyle='#ffc857'; c.lineWidth=13; c.lineCap='round';
    c.beginPath(); c.arc(236,176,58,0,6.2832); c.stroke();
    c.beginPath(); c.moveTo(278,218); c.lineTo(324,264); c.stroke();
    // znaczniki tak/nie
    c.font='bold 46px Nunito, Inter, sans-serif'; c.textAlign='center';
    c.fillStyle='#5ce07f'; c.fillText('✓', 372, 150);
    c.fillStyle='#e05c5c'; c.fillText('✗', 372, 210);
    // podpis
    c.fillStyle='#e8eefc'; c.font='bold 34px Nunito, Inter, sans-serif';
    c.fillText('STACJA WERYFIKACJI', w/2, 306);
  });
  laptopEkran=new THREE.Mesh(new THREE.PlaneGeometry(8.6,5.6),new THREE.MeshBasicMaterial({map:ekranT}));
  laptopEkran.position.set(0,3.1,.19); gora.add(laptopEkran);
  g.add(gora);
  const zawias=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,9.4,14),M(0x6f7883,{metalness:.5,roughness:.4}));
  zawias.rotation.z=Math.PI/2; zawias.position.set(0,1.2,-2.4); g.add(zawias);
  laptopSwiatlo=new THREE.PointLight(0x9fd0ff,.9,16,2); laptopSwiatlo.position.set(0,3.4,2.4); g.add(laptopSwiatlo);
  g.position.set(LAPTOP.x,0,LAPTOP.z); g.rotation.y=-.35; world.add(g);
  colliders.push({x:LAPTOP.x-5.8,z:LAPTOP.z-4.4,w:11.6,d:8.8});
  makeLabel('💻 STACJA WERYFIKACJI',LAPTOP.x,8.6,LAPTOP.z,1,'rgba(20,35,60,.76)',130);
}
box(6,.6,.6,0x6b5a45,24,.3,38).rotation.y=.5; box(5,.6,.6,0x6b5a45,14,.3,40).rotation.y=-.4; { const mud=new THREE.Mesh(new THREE.CircleGeometry(9,24),M(0x5a4a3a)); mud.rotation.x=-Math.PI/2; mud.position.set(18,.035,40); world.add(mud); }
{ const plaza=new THREE.Mesh(new THREE.CircleGeometry(9,28),M(KIDS?0xffe9c2:0x9a9384)); plaza.rotation.x=-Math.PI/2; plaza.position.set(-20,.035,30); world.add(plaza); box(2.4,.5,.8,0x8b5a2b,-24,.7,30); box(2.4,.5,.8,0x8b5a2b,-16,.7,30); makeLabel('PLAC SĄSIEDZKI – MIEJSCE A',-20,5,30,.85,undefined,70); }
for(let i=0;i<8;i++) tree(38+Math.cos(i*.8)*9,55+Math.sin(i*.8)*8,1+Math.random()*.4);
for(let i=0;i<90;i++){ const x=(Math.random()-.5)*230,z=(Math.random()-.5)*230; if(Math.abs(z-45)<11||Math.abs(x)<5&&z<60||Math.abs(z+10)<5||Math.abs(x+40)<5&&z>-20&&z<50) continue; if(Math.hypot(x+60,z+60)<26) continue; if(colliders.some(c=>x>c.x-3&&x<c.x+c.w+3&&z>c.z-3&&z<c.z+c.d+3)) continue; if(bezRoslin.some(c=>x>c.x-3&&x<c.x+c.w+3&&z>c.z-3&&z<c.z+c.d+3)) continue; tree(x,z,.8+Math.random()*.8); }
for(let i=0;i<8;i++) tree(-60+Math.cos(i*.8)*12,-60+Math.sin(i*.8)*12,.6);
makeLabel('WZGÓRZE – BEZPIECZNE MIEJSCE',-60,13,-60,1.2,undefined,150);
const lamps=[]; for(let z=-70;z<=30;z+=20){ lamps.push(lamp(4,z)); lamps.push(lamp(-4,z+10)); } for(let x=-70;x<=70;x+=20) lamps.push(lamp(x,-6));
/* dekoracje terenu */
const freeSpot=(x,z)=>{ if(Math.abs(z-45)<12) return false; if(Math.abs(x)<4.5&&z<60) return false; if(Math.abs(z+10)<4.5) return false; if(Math.abs(x+40)<4.5&&z>-20&&z<50) return false; if(Math.hypot(x+60,z+60)<26) return false; if(bezRoslin.some(c=>x>c.x-2&&x<c.x+c.w+2&&z>c.z-2&&z<c.z+c.d+2)) return false;
  return !colliders.some(c=>x>c.x-2&&x<c.x+c.w+2&&z>c.z-2&&z<c.z+c.d+2); };
function scatter(geo,color,count,y){ const mesh=new THREE.InstancedMesh(geo,M(color),count); const d=new THREE.Object3D(); let n=0,guard=0; while(n<count&&guard<count*40){ guard++; const x=(Math.random()-.5)*210,z=(Math.random()-.5)*210; if(!freeSpot(x,z)) continue; d.position.set(x,y,z); d.rotation.y=Math.random()*6.28; d.scale.setScalar(.7+Math.random()*.8); d.updateMatrix(); mesh.setMatrixAt(n++,d.matrix); } mesh.count=n; mesh.instanceMatrix.needsUpdate=true; mesh.receiveShadow=true; world.add(mesh); return mesh; }
[[0xffffff,80],[0xffe066,80],[KIDS?0xff8fb1:0xc98fa8,55]].forEach(([c,n])=>scatter(new THREE.ConeGeometry(.16,.5,5),c,n,.25));
scatter(new THREE.SphereGeometry(.85,7,6),KIDS?0x4fb84f:0x39602f,50,.6);
scatter(new THREE.DodecahedronGeometry(.5),0x8d8779,25,.25);
function bench(x,z,rot){ const g=new THREE.Group(); const s=new THREE.Mesh(new THREE.BoxGeometry(2.4,.18,.7),M(0x8b5a2b)); s.position.y=.62; s.castShadow=true; g.add(s); const b=new THREE.Mesh(new THREE.BoxGeometry(2.4,.7,.15),M(0x8b5a2b)); b.position.set(0,1.02,-.3); b.castShadow=true; g.add(b); [-1,1].forEach(d=>{ const l=new THREE.Mesh(new THREE.BoxGeometry(.15,.62,.6),M(0x5a5f6a)); l.position.set(d,.31,0); g.add(l); }); g.position.set(x,0,z); g.rotation.y=rot||0; world.add(g); }
bench(33,52,.4); bench(44,59,-1.1); bench(50,-36,Math.PI);
/* plac zabaw przy szkole */
box(.3,3.2,.3,0x8899aa,37,1.6,-36); box(.3,3.2,.3,0x8899aa,42,1.6,-36); box(5.6,.3,.3,0x8899aa,39.5,3.2,-36);
box(1.1,.16,.5,KIDS?0xffb347:0xa9793f,38.2,1.3,-36); box(1.1,.16,.5,KIDS?0x6bcbff:0x6f8f9a,40.8,1.3,-36);
const clouds=[]; for(let i=0;i<16;i++){ const c=new THREE.Group(); for(let j=0;j<5;j++){ const s=new THREE.Mesh(new THREE.SphereGeometry(3+Math.random()*3.5,10,8),new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:KIDS?.95:.75})); s.position.set(j*4-8,Math.random()*2,Math.random()*3); c.add(s);} c.position.set((Math.random()-.5)*320,45+Math.random()*15,(Math.random()-.5)*320); c.userData.v=.4+Math.random(); scene.add(c); clouds.push(c); }
/* tarcza słońca / księżyca i gwiazdy */
const discTex=tex(64,64,(c)=>{ const g=c.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.32,'rgba(255,246,214,.92)'); g.addColorStop(1,'rgba(255,230,170,0)'); c.fillStyle=g; c.fillRect(0,0,64,64); });
const sunSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:discTex,transparent:true,depthWrite:false,fog:false})); sunSprite.scale.set(60,60,1); scene.add(sunSprite);
const SUNDIR=new THREE.Vector3(.55,.62,.28).normalize();
const starPos=new Float32Array(700*3); for(let i=0;i<700;i++){ const th=Math.random()*Math.PI*2,ph=Math.acos(Math.random()*.92+.04); starPos[i*3]=Math.sin(ph)*Math.cos(th)*380; starPos[i*3+1]=Math.cos(ph)*380; starPos[i*3+2]=Math.sin(ph)*Math.sin(th)*380; }
const starGeo=new THREE.BufferGeometry(); starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));
const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xffffff,size:2,sizeAttenuation:false,transparent:true,opacity:0,fog:false})); scene.add(stars);
const flood=new THREE.Mesh(new THREE.PlaneGeometry(500,500),M(KIDS?0x4fc3f7:0x3b6f8e,{transparent:true,opacity:.78,roughness:.3})); flood.rotation.x=-Math.PI/2; flood.position.y=-1; flood.visible=false; scene.add(flood);
const RN=2200; const rainGeo=new THREE.BufferGeometry(); const rp=new Float32Array(RN*3); for(let i=0;i<RN;i++){ rp[i*3]=(Math.random()-.5)*120; rp[i*3+1]=Math.random()*40; rp[i*3+2]=(Math.random()-.5)*120; } rainGeo.setAttribute('position',new THREE.BufferAttribute(rp,3));
const rain=new THREE.Points(rainGeo,new THREE.PointsMaterial({color:0xcfe4ff,size:.25,transparent:true,opacity:.7})); rain.visible=false; scene.add(rain);

/* ---------- POSTACIE ---------- */
function human(col,skin=0xffdbac,hair=0x3a2a1a,scale=1){ const g=new THREE.Group(); const mk=(geo,c,x,y,z)=>{ const m=new THREE.Mesh(geo,M(c)); m.position.set(x,y,z); m.castShadow=true; g.add(m); return m; };
  const legL=mk(new THREE.BoxGeometry(.32,.9,.32),0x2c3e6b,-.2,.45,0), legR=mk(new THREE.BoxGeometry(.32,.9,.32),0x2c3e6b,.2,.45,0);
  mk(new THREE.BoxGeometry(.9,1.1,.5),col,0,1.45,0);
  const armL=mk(new THREE.BoxGeometry(.24,.9,.24),col,-.6,1.45,0), armR=mk(new THREE.BoxGeometry(.24,.9,.24),col,.6,1.45,0);
  mk(new THREE.BoxGeometry(.7,.7,.7),skin,0,2.45,0); mk(new THREE.BoxGeometry(.74,.25,.74),hair,0,2.72,0);
  mk(new THREE.BoxGeometry(.1,.1,.05),0x222,-.15,2.5,.36); mk(new THREE.BoxGeometry(.1,.1,.05),0x222,.15,2.5,.36);
  g.scale.setScalar(scale); g.userData={legL,legR,armL,armR}; return g; }
function dog(){ const g=new THREE.Group(); const mk=(geo,c,x,y,z)=>{ const m=new THREE.Mesh(geo,M(c)); m.position.set(x,y,z); m.castShadow=true; g.add(m); return m; }; mk(new THREE.BoxGeometry(1.2,.5,.5),0xc08a4a,0,.6,0); mk(new THREE.BoxGeometry(.5,.45,.5),0xc08a4a,.75,.85,0); mk(new THREE.BoxGeometry(.15,.3,.1),0x8a5a2a,.7,1.15,-.15); mk(new THREE.BoxGeometry(.15,.3,.1),0x8a5a2a,.7,1.15,.15); [[-.4,.15],[-.4,-.15],[.4,.15],[.4,-.15]].forEach(([x,z])=>mk(new THREE.BoxGeometry(.15,.4,.15),0xa07040,x,.2,z)); g.userData.tail=mk(new THREE.BoxGeometry(.1,.1,.5),0xa07040,-.7,.8,0); return g; }
const player=human(KIDS?0xff6b9d:0xf5b400); { const pk=new THREE.Mesh(new THREE.BoxGeometry(.7,.9,.4),M(KIDS?0x4fc3f7:0x5a6b3a)); pk.position.set(0,1.5,-.45); player.add(pk); } player.position.set(HOME[0],0,HOME[1]+8); scene.add(player);
const NPC={}; const npcs=[];
function addNpc(id,name,x,z,col,o={}){ const g=o.dog?dog():human(col,o.skin||0xffdbac,o.hair||0x3a2a1a,o.scale||1); g.position.set(x,0,z); g.rotation.y=o.rot||0; scene.add(g); const lab=makeLabel(name,0,0,0,.5,'rgba(20,30,60,.72)',24); world.remove(lab); lab.position.set(0,o.dog?1.9:3.4*(o.scale||1),0); g.add(lab); const n={id,name,mesh:g,emoji:o.emoji||'🙂'}; NPC[id]=n; npcs.push(n); return n; }
addNpc('ania',T('Ania (żona)','Mama Ania'),HOME[0]+3,HOME[1]+9,0xd94f70,{emoji:'👩',hair:0x6b3a1a,rot:Math.PI});
addNpc('zosia',T('Zosia (8 l.)','Zosia'),HOME[0]-3,HOME[1]+9,0x4fc3f7,{emoji:'👧',scale:.65,hair:0xe0b060,rot:Math.PI});
addNpc('dziadek','Dziadek Józef',HOME[0]+1,HOME[1]+12,0x6b7a8a,{emoji:'👴',hair:0xdddddd,rot:Math.PI});
addNpc('burek','Burek',HOME[0]-5,HOME[1]+12,0,{dog:true,emoji:'🐕'});
addNpc('krysia','Pani Krysia',-36,-22,0x8a4fb0,{emoji:'👵',hair:0xeeeeee,rot:Math.PI});
addNpc('marek','Pan Marek',18,-22,0x2e7d32,{emoji:'👨‍🔧',hair:0x222,rot:Math.PI});
addNpc('strazak','Strażak Piotr',-52,-52,0xd32f2f,{emoji:'👨‍🚒',hair:0x111,rot:Math.PI});
addNpc('urzednik',T('Urzędniczka','Pani z urzędu'),-50,17,0x3f51b5,{emoji:'👩‍💼',hair:0x4a2a1a,rot:Math.PI});
addNpc('ratownik','Ratowniczka Ola',62,28,0xffffff,{emoji:'👩‍⚕️',hair:0x8a5a2a,rot:Math.PI});
addNpc('sasiad','Kowalski',-58,-22,0x795548,{emoji:'🧔',hair:0x222,rot:Math.PI});
addNpc('ofiara',T('Poszkodowany','Ktoś się przewrócił'),38,55,0x7a6a5a,{emoji:'🤕'}); NPC.ofiara.mesh.rotation.z=Math.PI/2; NPC.ofiara.mesh.position.y=.5;

/* ---------- PRZEDMIOTY ---------- */
const pickups=[];
function spawnPickups(list){ clearPickups(); list.forEach(it=>{ const g=new THREE.Group(); const col=it.good?(KIDS?0xff6b9d:0xf5b400):0x9fb0cc; const cube=new THREE.Mesh(new THREE.OctahedronGeometry(.5),M(col,{emissive:col,emissiveIntensity:.5})); cube.position.y=1; g.add(cube); const lab=makeLabel(it.name,0,0,0,.5,'rgba(20,30,60,.72)',30); world.remove(lab); lab.position.y=2.2; g.add(lab); g.position.set(it.x,0,it.z); scene.add(g); pickups.push(Object.assign({},it,{mesh:g,taken:false})); }); }
function clearPickups(){ pickups.forEach(p=>{ scene.remove(p.mesh); const i=labels.indexOf(p.mesh.children[1]); if(i>=0) labels.splice(i,1); }); pickups.length=0; }

/* ---------- MISJE ---------- */
const MISSIONS=[
 {id:0,icon:'🏫',name:T('Wstęp: rozmowa w szkole','Start: Mały Strażnik'),pos:[45,-37]},
 {id:1,icon:'🔍',name:'Analiza ryzyka',pos:[HOME[0],HOME[1]+8]},
 {id:2,icon:'📋',name:'Rodzinny plan awaryjny',pos:[-20,14]},
 {id:3,icon:'🥫',name:'Zapasy – sklep',pos:[45,7]},
 {id:4,icon:'🏠',name:'Bezpieczny dom – mapa mediów',pos:[HOME[0]+6,HOME[1]+8]},
 {id:5,icon:'💰',name:'Bank nie działa',pos:[62,-8]},
 {id:6,icon:'📢',name:'Syreny – dźwięki ochrony',pos:[0,-69]},
 {id:7,icon:'🎒',name:'Ewakuacja – zostać czy jechać?',pos:[0,33]},
 {id:8,icon:'🚪',name:'Schronienie – pokój bezpieczeństwa',pos:[-20,-55]},
 {id:9,icon:'🔦',name:'Blackout – noc bez prądu',pos:[-75,-4]},
 {id:10,icon:'🛡️',name:T('Sytuacja wojenna – padnij i osłoń się','Wielki huk – „żółw”'),pos:[-52,-50]},
 {id:11,icon:'🌊',name:'Powódź – na wzgórze!',pos:[-8,36]},
 {id:12,icon:'🚑',name:'Pierwsza pomoc w parku',pos:[38,50]},
 {id:13,icon:'🧼',name:'Zdrowie i higiena',pos:[62,29]},
 {id:14,icon:'🕵️',name:'Łowca fake newsów',pos:[72,40]},
 {id:15,icon:'🤝',name:'Sąsiedzka drużyna',pos:[-20,30]},
 {id:16,icon:'⚖️',name:'Prawo – rekwizycja auta',pos:[-50,18]},
 {id:17,icon:'🌱',name:'Odbudowa po powodzi',pos:[18,42]},
 {id:18,icon:'🏆',name:'Finał: wyjście w 5 minut',pos:[HOME[0]-6,HOME[1]+8]}
];
MISSIONS.forEach(m=>{ const g=new THREE.Group(); const col=KIDS?0xff6b9d:0xf5b400; const cyl=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,6,16,1,true),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false})); cyl.position.y=3; g.add(cyl); const ring=new THREE.Mesh(new THREE.TorusGeometry(1.4,.12,8,28),new THREE.MeshBasicMaterial({color:col})); ring.rotation.x=Math.PI/2; ring.position.y=.2; g.add(ring); const lab=makeLabel(m.icon+' '+m.id+'. '+m.name,0,0,0,.6,undefined,46); world.remove(lab); lab.position.set(0,6.8,0); g.add(lab); const strz=new THREE.Mesh(new THREE.ConeGeometry(.85,2,4),new THREE.MeshBasicMaterial({color:col})); strz.rotation.x=Math.PI; strz.position.y=9.2; strz.visible=false; g.add(strz); m.strzalka=strz; g.position.set(m.pos[0],0,m.pos[1]); scene.add(g); m.mesh=g; m.ring=ring; m.cyl=cyl; m.lab=lab; });
function refreshBeacons(){ MISSIONS.forEach(m=>{ const d=!!state.done[m.id]; const next=!d&&MISSIONS.filter(x=>x.id<m.id).every(x=>state.done[x.id]); const c=d?0x2fd27a:next?(KIDS?0xff6b9d:0xf5b400):0x8899aa; m.cyl.material.color.set(c); m.ring.material.color.set(c); m.cyl.material.opacity=next?.35:.15; m.lab.userData.base=next||d?1:.5; // nazwe biezacego celu widac z drugiego konca miasteczka, reszte dopiero z bliska
    m.lab.userData.maxDist=next?170:46; if(m.strzalka) m.strzalka.visible=next; }); $('#missionPill').textContent='🎯 '+Object.keys(state.done).length+'/'+MISSIONS.length; $('#scorePill').textContent=(KIDS?'⭐ ':'🏅 ')+state.score; updateCalm(0); }
const vignette=document.createElement('div'); vignette.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:3;background:radial-gradient(ellipse at center,transparent 50%,rgba(120,0,0,.55) 100%);opacity:0;transition:opacity .8s'; document.body.appendChild(vignette);
function updateCalm(d){ state.calm=Math.max(0,Math.min(100,state.calm+d)); const c=state.calm; const e=c>70?'😌':c>40?'😐':'😰'; let el=$('#calmPill'); if(!el){ el=document.createElement('span'); el.className='pill'; el.id='calmPill'; $('#scorePill').after(el);} el.textContent=e+' Spokój '+Math.round(c)+'%'; el.style.borderColor=c>70?'#2fd27a':c>40?'#f5b400':'#ff5a5a'; vignette.style.opacity=c<40?(40-c)/60:0; if(d) save(); }

/* ---------- STEROWANIE I KAMERA ---------- */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const CAM={min:6,max:46,def:17,defPitch:.75,minPitch:.18,maxPitch:1.3};
let yaw=0,camYaw=0,pitch=CAM.defPitch,camDist=CAM.def,camDistT=CAM.def,camCur=CAM.def,walkT=0;
function zoom(d){ camDistT=clamp(camDistT+d,CAM.min,CAM.max); const el=$('#zoomLevel'); if(el) el.textContent=Math.round(camDistT)+' m'; }
function resetCam(){ camDistT=CAM.def; pitch=CAM.defPitch; zoom(0); }
const keys={};
addEventListener('keydown',e=>{ keys[e.code]=true;
  if(e.code==='KeyE'&&!panelOpen) interact();
  if(e.code==='Space'){ if(dropWait){ e.preventDefault(); dropHit(); } if(tapMode){ e.preventDefault(); tapHit(); } }
  if(panelOpen) return;
  if(e.code==='Equal'||e.code==='NumpadAdd'||e.code==='KeyZ') zoom(-2.5);
  if(e.code==='Minus'||e.code==='NumpadSubtract'||e.code==='KeyX') zoom(2.5);
  if(e.code==='Digit0'||e.code==='Numpad0') resetCam();
});
addEventListener('keyup',e=>keys[e.code]=false);
canvas.addEventListener('wheel',e=>{ if(panelOpen) return; e.preventDefault(); zoom(e.deltaY*(e.deltaMode===1?.6:.02)); },{passive:false});
/* jeden palec / mysz – obrót kamery, dwa palce – szczypanie (zoom) */
const ptrs=new Map(); let pinchD=0;
const ptrDist=()=>{ const v=[...ptrs.values()]; return Math.hypot(v[0].x-v[1].x,v[0].y-v[1].y); };
canvas.addEventListener('pointerdown',e=>{ if(e.pointerType==='touch'&&e.clientX<220&&e.clientY>innerHeight-220) return; try{ canvas.setPointerCapture(e.pointerId); }catch(_){} ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY}); if(ptrs.size===2) pinchD=ptrDist(); if(dropWait) dropHit(); });
canvas.addEventListener('pointermove',e=>{ const p=ptrs.get(e.pointerId); if(!p) return; const dx=e.clientX-p.x,dy=e.clientY-p.y; p.x=e.clientX; p.y=e.clientY;
  if(ptrs.size>=2){ const d=ptrDist(); if(pinchD) zoom((pinchD-d)*.07); pinchD=d; }
  else { camYaw-=dx*.005; pitch=clamp(pitch+dy*.003,CAM.minPitch,CAM.maxPitch); } });
const ptrUp=e=>{ ptrs.delete(e.pointerId); if(ptrs.size<2) pinchD=0; };
addEventListener('pointerup',ptrUp); addEventListener('pointercancel',ptrUp);
const zi=$('#zin'),zo=$('#zout'),zr=$('#zreset');
if(zi) zi.onclick=()=>zoom(-3); if(zo) zo.onclick=()=>zoom(3); if(zr) zr.onclick=resetCam;
zoom(0);
const joy=$('#joy'),knob=joy.querySelector('i'); let jx=0,jy=0,jid=null;
joy.addEventListener('pointerdown',e=>{ jid=e.pointerId; joy.setPointerCapture(jid); });
joy.addEventListener('pointermove',e=>{ if(e.pointerId!==jid) return; const r=joy.getBoundingClientRect(); let dx=e.clientX-(r.left+60),dy=e.clientY-(r.top+60); const l=Math.hypot(dx,dy); if(l>45){dx*=45/l;dy*=45/l;} jx=dx/45; jy=dy/45; knob.style.left=(35+dx)+'px'; knob.style.top=(35+dy)+'px'; });
const joyEnd=e=>{ if(e.pointerId!==jid) return; jid=null; jx=jy=0; knob.style.left='35px'; knob.style.top='35px'; };
joy.addEventListener('pointerup',joyEnd); joy.addEventListener('pointercancel',joyEnd);
$('#actBtn').onclick=()=>interact();
function collides(x,z){ if(Math.abs(z-45)<8&&Math.abs(x)>4&&!floodMode) return true; for(const c of colliders){ if(x>c.x&&x<c.x+c.w&&z>c.z&&z<c.z+c.d) return true; } return false; }

/* ---------- STAN ---------- */
let near=null,nearPick=null,nearNpc=null,nearGame=null,panelOpen=false,floodMode=false,floodLevel=-1,floodT=0,dropWait=false,tapMode=false,night=false,last=performance.now();
let quest=null,target=null,timedRun=false,timedT=0,timedStep=null,timedIdx=0;
/* Marsz na azymut ze stacji kompasu. Gracz idzie po kompasie w rogu ekranu,
   bez znacznika na mapie, i sam decyduje, kiedy jest na miejscu. */
const marsz={aktywny:false,az:0,dyst:0,cx:0,cz:0,lx:0,lz:0,przeszedl:0,then:null};
let kompasBox=null,kompasCv=null,kompasCtx=null,kompasInfo=null;
function kursGracza(){ return ((180-yaw*180/Math.PI)%360+360)%360; }
function budujKompas(){
  if(kompasBox) return;
  kompasBox=document.createElement('div');
  kompasBox.style.cssText='position:fixed;left:14px;top:50%;transform:translateY(-50%);z-index:6;display:none;text-align:center;pointer-events:none';
  kompasCv=document.createElement('canvas'); kompasCv.width=132; kompasCv.height=132;
  kompasCv.style.cssText='display:block;filter:drop-shadow(0 6px 18px rgba(0,0,0,.45))';
  kompasInfo=document.createElement('div');
  kompasInfo.style.cssText='margin-top:6px;background:rgba(10,18,32,.86);color:#e8eefc;border:1px solid rgba(255,255,255,.16);border-radius:10px;padding:5px 9px;font:700 .78rem/1.35 Nunito,Inter,sans-serif;white-space:nowrap';
  kompasBox.appendChild(kompasCv); kompasBox.appendChild(kompasInfo);
  document.body.appendChild(kompasBox);
  kompasCtx=kompasCv.getContext('2d');
}
function startMarsz(cfg,then){
  budujKompas();
  const px=player.position.x, pz=player.position.z, a=cfg.azymut*Math.PI/180;
  marsz.aktywny=true; marsz.az=cfg.azymut; marsz.dyst=cfg.dystans; marsz.then=then;
  marsz.cx=px+Math.sin(a)*cfg.dystans; marsz.cz=pz-Math.cos(a)*cfg.dystans;
  marsz.lx=px; marsz.lz=pz; marsz.przeszedl=0;
  kompasBox.style.display='block';
  close();
  pokazCel('🧭 '+cfg.opis+'<br><b>'+T('Gdy uznasz, że jesteś na miejscu, wciśnij E.','Na miejscu wciśnij E albo przycisk na dole.')+'</b>');
  toast(T('Obróć się tak, żeby żółta strzałka stanęła na samej górze kompasu.','Kręć się, aż żółta strzałka będzie na górze!'));
}
function konczMarsz(){
  const blad=Math.hypot(player.position.x-marsz.cx,player.position.z-marsz.cz);
  marsz.aktywny=false; if(kompasBox) kompasBox.style.display='none';
  celHtml=null; pokazCel('');
  const f=marsz.then; marsz.then=null; if(f) f(blad);
}
function rysujKompasHud(){
  if(!kompasCtx||!window.KOMPAS_RYSUJ) return;
  const kurs=kursGracza();
  window.KOMPAS_RYSUJ(kompasCtx,132,{kurs:kurs,cel:marsz.az,marsz:true});
  kompasInfo.innerHTML='azymut <b>'+marsz.az+'°</b> · idziesz <b>'+Math.round(kurs)+'°</b><br>przeszedłeś <b>'+Math.round(marsz.przeszedl)+' m</b> z '+marsz.dyst+' m';
}
const objEl=document.createElement('div'); objEl.style.cssText='position:fixed;left:14px;top:110px;z-index:5;max-width:min(380px,80vw);pointer-events:none'; document.body.appendChild(objEl);
let celHtml=null;
function pokazCel(html){ if(html===celHtml) return; celHtml=html; objEl.innerHTML=html?'<div class="pill" style="display:block;white-space:normal;line-height:1.35;border-left:4px solid var(--accent)">'+html+'</div>':''; }
function setObjective(text){ const h=$('#hint'); if(h) h.style.display=(text||quest)?'none':''; pokazCel(text?'🎯 '+text:''); }
/* Wskazowka, dokad isc miedzy misjami. Wczesniej byl tylko krotki toast po starcie:
   znikal po kilku sekundach i gracz, ktory rozgladal sie po miasteczku, nie zdazyl go przeczytac.
   Teraz stoi na ekranie, sama sie aktualizuje i wraca po kazdej ukonczonej misji. */
function nastepnaMisja(){ return MISSIONS.find(m=>!state.done[m.id]&&MISSIONS.filter(x=>x.id<m.id).every(x=>state.done[x.id]))||null; }
const ROZA=['na północ','na północny wschód','na wschód','na południowy wschód','na południe','na południowy zachód','na zachód','na północny zachód'];
function kierunek(dx,dz){ const a=Math.atan2(dx,-dz); return ROZA[((Math.round(a/(Math.PI/4))%8)+8)%8]; }
let celTik=0;
function wskazowka(){
  if(quest||panelOpen) return;
  const m=nastepnaMisja();
  if(!m){ pokazCel('🏁 '+T('Wszystkie misje zrobione. Zajrzyj do podsumowania w „Lista misji”.','Wszystkie misje zrobione! Jesteś Małym Strażnikiem.')); return; }
  const dx=m.pos[0]-player.position.x, dz=m.pos[1]-player.position.z, d=Math.round(Math.hypot(dx,dz));
  pokazCel(d<3.4
    ? '🎯 '+T('Misja ','Misja ')+m.id+': '+m.name+'<br><b>'+T('Jesteś na miejscu – wciśnij E','Stoisz tu! Wciśnij E albo przycisk na dole')+'</b>'
    : '🎯 '+T('Następna misja ','Teraz misja ')+m.id+': '+m.name+'<br><b>'+kierunek(dx,dz)+', '+d+' m</b> · '+T('idź do złotego znacznika z gwiazdką na mapie','szukaj gwiazdki na mapce'));
}
const arrowGeo=new THREE.ConeGeometry(.45,1.4,10); arrowGeo.rotateX(Math.PI/2); const arrow=new THREE.Mesh(arrowGeo,new THREE.MeshBasicMaterial({color:KIDS?0xff6b9d:0xf5b400})); arrow.visible=false; scene.add(arrow);
const toastEl=document.createElement('div'); toastEl.style.cssText='position:fixed;left:50%;top:150px;transform:translateX(-50%);z-index:7;max-width:min(520px,90vw);pointer-events:none;transition:opacity .3s;opacity:0'; document.body.appendChild(toastEl); let toastT=null;
const hintEl=$('#hint'); let hintHidden=false; setTimeout(()=>{ if(hintEl&&!hintHidden){ hintHidden=true; hintEl.style.transition='opacity .8s'; hintEl.style.opacity='0'; setTimeout(()=>hintEl.style.display='none',900); } },18000);
/* ---------- MINIMAPA ---------- */
const mm=$('#mm'), mmc=mm?mm.getContext('2d'):null, MMR=95;
const MM_ROADS=[[6,200,0,-20],[160,6,0,-10],[6,70,-40,15],[70,6,40,20],[6,40,-60,-30]];
function gwiazdka(c,x,y,r,kolor){ if(r<=0) return; c.save(); c.translate(x,y); c.beginPath();
  for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, p=(i%2?r*.45:r); c.lineTo(Math.cos(a)*p,Math.sin(a)*p); }
  c.closePath(); c.fillStyle=kolor; c.fill(); c.strokeStyle='rgba(0,0,0,.7)'; c.lineWidth=1.5; c.stroke(); c.restore(); }
function drawMinimap(){ if(!mmc) return; const S=mm.width, C=S/2, px=player.position.x, pz=player.position.z, k=C/MMR;
  const X=x=>C+(x-px)*k, Z=z=>C+(z-pz)*k;
  mmc.clearRect(0,0,S,S); mmc.save(); mmc.beginPath(); mmc.arc(C,C,C-2,0,6.2832); mmc.clip();
  mmc.fillStyle=night?'#14251a':(KIDS?'#7fd36a':'#4f7440'); mmc.fillRect(0,0,S,S);
  mmc.fillStyle=night?'#16324a':'#2e6f9e'; mmc.fillRect(0,Z(37),S,16*k);
  mmc.fillStyle=night?'#2a2f38':'#585d68'; MM_ROADS.forEach(([w,d,x,z])=>mmc.fillRect(X(x-w/2),Z(z-d/2),w*k,d*k));
  mmc.fillStyle=night?'#5b6270':'#d3c4a6'; colliders.forEach(b=>mmc.fillRect(X(b.x),Z(b.z),b.w*k,b.d*k));
  mmc.fillStyle=night?'#2f6b3a':'#6aa05a'; mmc.beginPath(); mmc.arc(X(-60),Z(-60),24*k,0,6.2832); mmc.fill();
  pickups.forEach(p=>{ if(p.taken) return; mmc.fillStyle='#fff'; mmc.fillRect(X(p.x)-2,Z(p.z)-2,4,4); });
  MISSIONS.forEach(m=>{ const done=state.done[m.id], next=!done&&MISSIONS.filter(x=>x.id<m.id).every(x=>state.done[x.id]);
    if(next) return;
    mmc.fillStyle=done?'#2fd27a':'rgba(160,175,195,.75)';
    mmc.beginPath(); mmc.arc(X(m.pos[0]),Z(m.pos[1]),3.2,0,6.2832); mmc.fill(); });
  { // cel biezacy rysujemy na koncu i jako pulsujaca gwiazdke, zeby nie ginal wsrod kropek
    const m=nastepnaMisja();
    if(m){ const puls=1+Math.sin(performance.now()/240)*.22, col=KIDS?'#ff2d78':'#ffcc33';
      let gx=X(m.pos[0]), gz=Z(m.pos[1]);
      const poza=Math.hypot(m.pos[0]-px,m.pos[1]-pz)>MMR-6;
      if(poza){ const a=Math.atan2(gx-C,gz-C), r=C-11; gx=C+Math.sin(a)*r; gz=C+Math.cos(a)*r;
        mmc.save(); mmc.translate(gx,gz); mmc.rotate(-a);
        mmc.fillStyle=col; mmc.strokeStyle='rgba(0,0,0,.65)'; mmc.lineWidth=1.5;
        mmc.beginPath(); mmc.moveTo(0,-9); mmc.lineTo(6,4); mmc.lineTo(-6,4); mmc.closePath(); mmc.fill(); mmc.stroke();
        mmc.restore();
      } else {
        mmc.strokeStyle='rgba(255,255,255,.85)'; mmc.lineWidth=2;
        mmc.beginPath(); mmc.arc(gx,gz,10*puls,0,6.2832); mmc.stroke();
      }
      gwiazdka(mmc,gx,gz,poza?0:8,col);
    }
  }
  if(target){ mmc.strokeStyle='#fff'; mmc.lineWidth=2; mmc.beginPath(); mmc.arc(X(target.x),Z(target.z),7,0,6.2832); mmc.stroke(); }
  mmc.restore();
  const dx=Math.sin(yaw),dz=Math.cos(yaw);
  mmc.fillStyle=KIDS?'#ff2d78':'#ffffff'; mmc.strokeStyle='rgba(0,0,0,.6)'; mmc.lineWidth=1.5;
  mmc.beginPath(); mmc.moveTo(C+dx*8,C+dz*8); mmc.lineTo(C-dz*5-dx*4,C+dx*5-dz*4); mmc.lineTo(C+dz*5-dx*4,C-dx*5-dz*4); mmc.closePath(); mmc.fill(); mmc.stroke();
  mmc.fillStyle='rgba(255,255,255,.85)'; mmc.font='bold 11px Inter,sans-serif'; mmc.textAlign='center'; mmc.fillText('N',C,12); }

function toast(t){ toastEl.innerHTML='<div class="pill" style="display:block;white-space:normal;line-height:1.35;font-size:1rem">'+t+'</div>'; toastEl.style.opacity=1; clearTimeout(toastT); toastT=setTimeout(()=>toastEl.style.opacity=0,3800); }

function resize(){ renderer.setSize(innerWidth,innerHeight,true); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); } addEventListener('resize',resize); addEventListener('orientationchange',()=>setTimeout(resize,120)); resize();
function loop(now){ requestAnimationFrame(loop); if(canvas.width!==Math.floor(innerWidth*renderer.getPixelRatio())) resize(); const dt=Math.min(.05,(now-last)/1000); last=now; const t=now/1000; let moving=false;
  if(!panelOpen){
    let mx=0,mz=0; if(keys.KeyW||keys.ArrowUp) mz-=1; if(keys.KeyS||keys.ArrowDown) mz+=1; if(keys.KeyA||keys.ArrowLeft) mx-=1; if(keys.KeyD||keys.ArrowRight) mx+=1; if(keys.KeyQ) camYaw+=1.8*dt; mx+=jx; mz+=jy;
    const len=Math.hypot(mx,mz); if(len>0){ moving=true; mx/=len; mz/=len; const s=(floodMode||timedRun?9.5:7.5)*dt; const sin=Math.sin(camYaw),cos=Math.cos(camYaw); const dx=(mx*cos+mz*sin)*s,dz=(-mx*sin+mz*cos)*s; const nx=player.position.x+dx,nz=player.position.z+dz; if(!collides(nx,player.position.z)) player.position.x=Math.max(-200,Math.min(200,nx)); if(!collides(player.position.x,nz)) player.position.z=Math.max(-200,Math.min(200,nz)); yaw=Math.atan2(dx,dz); player.rotation.y=yaw; }
    const dh=Math.hypot(player.position.x+60,player.position.z+60); player.position.y=dh<24?(1-dh/24)*9:0;
    near=null; nearPick=null; nearNpc=null;
    if(!quest){ for(const m of MISSIONS){ if(Math.hypot(player.position.x-m.pos[0],player.position.z-m.pos[1])<3.4){ near=m; break; } } }
    else { const st=quest.steps[quest.i]; if(st&&(st.type==='collect'||timedRun)){ for(const p of pickups){ if(!p.taken&&Math.hypot(player.position.x-p.x,player.position.z-p.z)<2.2){ nearPick=p; break; } } } if(st&&(st.type==='goto'||st.type==='talk')&&target&&Math.hypot(player.position.x-target.x,player.position.z-target.z)<target.r) nearNpc=st; }
    nearGame=null; if(!quest&&!near&&!marsz.aktywny){ for(const k in GRY){ const gg=GRY[k]; if(Math.hypot(player.position.x-gg.x,player.position.z-gg.z)<gg.r){ nearGame=gg; break; } } }
    const ab=$('#actBtn'); if(marsz.aktywny){ ab.style.display='block'; ab.textContent=T('📍 Tu jestem (E)','📍 Jestem na miejscu (E)'); } else if(near){ ab.style.display='block'; const locked=!state.done[near.id]&&!MISSIONS.filter(x=>x.id<near.id).every(x=>state.done[x.id]); ab.textContent=locked?'🔒 Najpierw poprzednie misje':(state.done[near.id]?'🔁 Powtórz: ':'▶ ')+near.name+' (E)'; } else if(nearPick){ ab.style.display='block'; ab.textContent='✋ '+nearPick.name+' (E)'; } else if(nearNpc){ ab.style.display='block'; ab.textContent=(nearNpc.type==='talk'?'💬 Rozmawiaj':'✅ '+(nearNpc.action||'Wykonaj'))+' (E)'; } else if(nearGame){ ab.style.display='block'; const gwS=nearGame.stacja?(state.stacje[nearGame.stacja]||0):0; ab.textContent=nearGame.btn+(gwS?' '+'⭐'.repeat(gwS):'')+' (E)'; } else ab.style.display='none';
  }
  if(marsz.aktywny){ const mdx=player.position.x-marsz.lx, mdz=player.position.z-marsz.lz;
    marsz.przeszedl+=Math.hypot(mdx,mdz); marsz.lx=player.position.x; marsz.lz=player.position.z; rysujKompasHud(); }
  if(!quest&&!panelOpen&&!marsz.aktywny){ celTik+=dt; if(celTik>.3){ celTik=0; wskazowka(); } }
  if(moving&&hintEl&&!hintHidden){ hintHidden=true; hintEl.style.transition='opacity .6s'; hintEl.style.opacity='0'; setTimeout(()=>{ if(hintHidden) hintEl.style.display='none'; },700); }
  walkT+=dt*(moving?10:0); const u=player.userData; const sw=moving?Math.sin(walkT)*.6:0; u.legL.rotation.x=sw; u.legR.rotation.x=-sw; u.armL.rotation.x=-sw; u.armR.rotation.x=sw;
  npcs.forEach((n,i)=>{ if(n.mesh.userData.tail) n.mesh.userData.tail.rotation.y=Math.sin(t*8)*.5; else if(n.id!=='ofiara'){ n.mesh.position.y=Math.sin(t*2+i)*.03; n.mesh.userData.armL.rotation.x=Math.sin(t*1.5+i)*.15; } });
  MISSIONS.forEach((m,i)=>{ m.ring.rotation.z=t*2; m.lab.position.y=6.8+Math.sin(t*2+i)*.2; if(m.strzalka&&m.strzalka.visible){ m.strzalka.position.y=9.2+Math.sin(t*3)*.5; m.strzalka.rotation.y=t*1.6; } });
  pickups.forEach((p,i)=>{ if(!p.taken){ p.mesh.children[0].rotation.y=t*2; p.mesh.children[0].position.y=1+Math.sin(t*3+i)*.15; } });
  { const bl=(Math.sin(t*7)+1)/2; ambLights.forEach((l,i)=>{ l.material.emissiveIntensity=(i?bl:1-bl)*1.6+.15; }); }
  if(elekZarowka){ const puls=.75+Math.sin(t*2.2)*.25; elekZarowka.material.emissiveIntensity=puls*1.4; if(elekIskra) elekIskra.intensity=puls*1.3; }
  if(laptopSwiatlo){ laptopSwiatlo.intensity=.75+Math.sin(t*1.7)*.2; if(laptopDioda) laptopDioda.visible=(t%2)<1.4; }
  if(dyszaHead){ dyszaHead.position.x=Math.sin(t*.9)*3.4; dyszaHead.position.z=Math.sin(t*.37)*2.6; if(dyszaGantry) dyszaGantry.position.z=dyszaHead.position.z; }
  clouds.forEach(c=>{ c.position.x+=c.userData.v*dt*2; if(c.position.x>180) c.position.x=-180; });
  const pa=riverGeo.attributes.position.array; for(let i=0;i<pa.length;i+=3){ pa[i+2]=Math.sin(riverBase[i]*.15+t*1.5)*.18+Math.cos(riverBase[i+1]*.4+t)*.08; } riverGeo.attributes.position.needsUpdate=true;
  if(rain.visible){ const r=rainGeo.attributes.position.array; for(let i=0;i<RN;i++){ r[i*3+1]-=dt*28; if(r[i*3+1]<0){ r[i*3+1]=40; r[i*3]=player.position.x+(Math.random()-.5)*120; r[i*3+2]=player.position.z+(Math.random()-.5)*120; } } rainGeo.attributes.position.needsUpdate=true; }
  if(floodMode){ floodT+=dt; floodLevel=Math.min(7,-1+floodT*.22); flood.position.y=floodLevel; flood.visible=true; const remain=Math.max(0,40-floodT); setObjective('🌊 Woda się podnosi! Biegnij na WZGÓRZE (północny zachód, za stacją energetyczną). Zostało '+Math.ceil(remain)+' s'); if(player.position.y>4.5) endFlood(true); else if(floodLevel>player.position.y+.9||remain<=0) endFlood(false); }
  if(timedRun){ timedT-=dt; if(timedT<=0) endTimed(false); else { const tp=$('#timerPill'); if(tp) tp.textContent='⏱ '+Math.ceil(timedT)+' s'; } }
  if(target){ arrow.visible=true; const ang=Math.atan2(target.x-player.position.x,target.z-player.position.z); arrow.position.set(player.position.x+Math.sin(ang)*2.2,player.position.y+3.3+Math.sin(t*4)*.15,player.position.z+Math.cos(ang)*2.2); arrow.lookAt(target.x,arrow.position.y,target.z); } else arrow.visible=false;
  camDist+=(camDistT-camDist)*Math.min(1,dt*7);
  const cosP=Math.cos(pitch),px=player.position.x,py=player.position.y,pz=player.position.z;
  const want=camClear(px,py,pz,cosP,camDist);
  camCur+=(want-camCur)*Math.min(1,dt*(want<camCur?26:4));
  const cx=px+Math.sin(camYaw)*camCur*cosP,cz=pz+Math.cos(camYaw)*camCur*cosP,cy=Math.max(py+1.5,py+1.9+camCur*Math.sin(pitch));
  camera.position.lerp(camTmp.set(cx,cy,cz),.16); camera.lookAt(px,py+1.6,pz);
  sun.position.set(px+55,80,pz+35); sunTarget.position.set(px,0,pz);
  sunSprite.position.copy(camera.position).addScaledVector(SUNDIR,320); stars.position.copy(camera.position);
  fadeLabels(); if((frame++&1)===0) drawMinimap();
  torch.position.set(player.position.x,player.position.y+2.2,player.position.z); glow.position.set(player.position.x,player.position.y+2,player.position.z); torch.target.position.set(player.position.x+Math.sin(yaw)*10,player.position.y,player.position.z+Math.cos(yaw)*10);
  sky.position.copy(camera.position); renderer.render(scene,camera); }
requestAnimationFrame(loop);
function setNight(on){ night=on; const L=on?NIGHT:DAY; hemi.intensity=L.hemiI; sun.intensity=L.sunI; sun.color.set(on?0x9fb6d6:(KIDS?0xfff4d6:0xffd2a0)); scene.fog.color.set(L.fog); scene.fog.near=on?30:(KIDS?95:80); scene.fog.far=on?150:(KIDS?330:270); skyUniforms.top.value.set(L.top); skyUniforms.bottom.value.set(L.bottom); torch.intensity=on?2.6:0; glow.intensity=on?1.3:0; stars.material.opacity=on?.85:0; sunSprite.material.color.set(on?0xc9d8ff:0xffffff); sunSprite.scale.setScalar(on?26:60); emissiveWindows.forEach(w=>w.material.emissiveIntensity=on?.55:0); lamps.forEach(l=>l.material.color.set(on?0xfff2b0:0xd8d2b8)); renderer.toneMappingExposure=on?.8:(KIDS?1.0:.95); }
function setDusk(){ night=false; hemi.intensity=.4; sun.intensity=.5; sun.color.set(0xffa060); emissiveWindows.forEach(w=>w.material.emissiveIntensity=.9); skyUniforms.top.value.set(0x1d2a4d); skyUniforms.bottom.value.set(0xff9a5c); scene.fog.color.set(0xd08a6a); scene.fog.near=50; scene.fog.far=200; torch.intensity=0; glow.intensity=0; stars.material.opacity=.25; sunSprite.material.color.set(0xffb070); sunSprite.scale.setScalar(70); }

/* ---------- PANEL ---------- */
const panel=$('#panel'),pbox=$('#panelBox');
function open(html){ pbox.innerHTML=html; panel.style.display='flex'; panelOpen=true; Object.keys(keys).forEach(k=>keys[k]=false); }
function close(){ panel.style.display='none'; panelOpen=false; }
/* Ksiazka ma byc tlem, nie reklama. Wzmianka pokazuje sie najwyzej raz na 30 minut,
   a nie po kazdej misji - wczesniej wracala co chwile i mylila graczy. */
function wzmiankaOksiazce(){ try{ const k='pp_ksiazka_ts', t=Date.now(), o=+(localStorage.getItem(k)||0); if(t-o<1800000) return false; localStorage.setItem(k,String(t)); return true; }catch(e){ return false; } }
function head(m){ const ch=DATA[m.id]; return '<div style="color:var(--accent);font-weight:800;font-size:.8rem;text-transform:uppercase">'+m.icon+' Misja '+m.id+' · '+ch.nr+'</div><h2 style="margin-bottom:6px">'+ch.tytul+'</h2>'; }
function npcLine(id,text){ const n=NPC[id]||{emoji:'🙂',name:''}; return '<div class="msg" style="display:flex;gap:12px;align-items:flex-start"><div style="font-size:2rem;line-height:1">'+n.emoji+'</div><div><b>'+n.name+'</b><br>'+text+'</div></div>'; }

/* ---------- SILNIK QUESTU ---------- */
function abortQuest(){ quest=null; target=null; clearPickups(); setObjective(''); const h=$('#hint'); if(h) h.style.display=''; rain.visible=false; floodMode=false; flood.visible=false; timedRun=false; const tp=$('#timerPill'); if(tp) tp.textContent=''; if(night) setNight(false); }
function startMission(m){ const locked=!state.done[m.id]&&!MISSIONS.filter(x=>x.id<m.id).every(x=>state.done[x.id]); if(locked){ toast('🔒 Misje odblokowują się po kolei – zacznij od złotego znacznika.'); return; } audio(); TR('misja_start',{misja_id:m.id,misja:m.name,powtorka:!!state.done[m.id]}); quest={mission:m,steps:buildSteps(m),i:0,ok:0,total:0,stars:3}; runStep(); }
function nextStep(){ if(!quest) return; quest.i++; runStep(); }
function runStep(){ const st=quest.steps[quest.i]; target=null; if(!timedRun) clearPickups(); if(!st) return;
  switch(st.type){
    case 'talk': target={x:st.x,z:st.z,r:3.5}; setObjective(st.obj||('Porozmawiaj: '+(NPC[st.npc]?NPC[st.npc].name:''))); if(st.auto||Math.hypot(player.position.x-st.x,player.position.z-st.z)<3.5) showTalk(st); break;
    case 'goto': target={x:st.x,z:st.z,r:st.r||3}; setObjective(st.obj); break;
    case 'collect': spawnPickups(st.items); quest.got=0; setObjective(st.obj+' (0/'+st.items.filter(i=>i.good).length+')'); break;
    case 'panel': setObjective(''); st.run(); break;
    case 'flood': runFlood(st); break;
    case 'drop': runDrop(st); break;
    case 'timed': runTimed(st); break;
    case 'night': setNight(st.on); nextStep(); break;
    case 'dusk': setDusk(); nextStep(); break;
    case 'rain': rain.visible=st.on; nextStep(); break;
    case 'end': finishQuest(st); break;
  } }
function interact(){ if(marsz.aktywny){ konczMarsz(); return; } if(nearGame&&!quest&&!near){ showGra(nearGame); return; } if(near&&!quest){ startMission(near); return; } if(!quest) return; const st=quest.steps[quest.i]; if(!st) return;
  if(timedRun&&nearPick){ const p=nearPick; const want=timedStep.points[timedIdx]; if(p.idx===timedIdx){ p.taken=true; scene.remove(p.mesh); pick(); toast('✅ '+want.name+(want.why?' – '+want.why:'')); timedIdx++; if(timedIdx>=timedStep.points.length) endTimed(true); else setObjective('Krok '+(timedIdx+1)+'/'+timedStep.points.length+': '+timedStep.points[timedIdx].name); } else { bad(); updateCalm(-4); timedT-=5; toast('❌ Nie ta kolejność! Teraz: '+want.name+' (−5 s)'); } return; }
  if(st.type==='collect'&&nearPick){ const p=nearPick; p.taken=true; scene.remove(p.mesh); const need=st.items.filter(i=>i.good).length; if(p.good){ quest.got++; pick(); setObjective(st.obj+' ('+quest.got+'/'+need+')'); toast('✅ '+p.name+(p.why?' – '+p.why:'')); if(quest.got>=need) setTimeout(nextStep,600); } else { bad(); updateCalm(-3); toast('🚫 '+p.name+': '+p.why); quest.stars=Math.max(1,quest.stars-1); } }
  else if(st.type==='goto'&&nearNpc){ good(); if(st.msg) toast(st.msg); nextStep(); }
  else if(st.type==='talk'&&nearNpc) showTalk(st); }
function gwiazdkiHtml(n){ return '<div class="stars">'+'⭐'.repeat(n)+'☆'.repeat(3-n)+'</div>'; }
/* Ekran koncowy stacji: zapis najlepszego wyniku, punkty i to, co zostaje w glowie. */
function koniecStacji(id,gw,html){
  const stara=state.stacje[id]||0, pierwsze=!stara;
  state.stacje[id]=Math.max(stara,gw);
  const zdobyte=pierwsze?80+gw*30:Math.round((80+gw*30)/4);
  state.score+=zdobyte; updateCalm(4); save(); refreshBeacons(); good();
  TR('stacja_koniec',{stacja:id,gwiazdki:gw,pierwsze_przejscie:pierwsze});
  open('<h2>'+T('✅ Stacja zaliczona','🎉 Stacja zaliczona!')+'</h2>'+gwiazdkiHtml(gw)+html
    +'<p><b>+'+zdobyte+' pkt</b>'+(pierwsze?'':' '+T('(powtórka)','(powtórka)'))+'</p>'
    +'<div class="navbtns" style="justify-content:center"><button class="btn primary" id="wrotGra">Wracam do miasteczka</button>'
    +'<button class="btn ghost" id="jeszczeRaz">Jeszcze raz</button></div>');
  $('#wrotGra').onclick=()=>{ close(); wskazowka(); };
  $('#jeszczeRaz').onclick=()=>uruchomStacje(id);
}
function uruchomStacje(id){
  const f=window.STACJE_GRY&&window.STACJE_GRY[id];
  if(!f){ toast('Ta stacja jeszcze nie ma gry.'); return; }
  f({ open:open, close:close, T:T, KIDS:KIDS, beep:beep, good:good, bad:bad, toast:toast,
      marsz:startMarsz, koniec:koniecStacji });
}
function showGra(g){ TR('dodatkowa_gra',{gra:g.key,dostepna:!!(g.url||g.stacja)});
  const wroc='<button class="btn ghost" id="wrotGra">Wracam do miasteczka</button>';
  if(g.stacja){
    const gw=state.stacje[g.stacja]||0;
    open('<h2>'+g.tytul+'</h2><p>'+g.opis+'</p>'
      +(gw?'<div class="msg good"><b>Zaliczona.</b> Najlepszy wynik: '+'⭐'.repeat(gw)+'. Możesz powtórzyć – zadania losują się na nowo.</div>':'')
      +'<p class="small">'+T('Ćwiczenie zostaje w miasteczku – nic się nie otwiera w nowej karcie.','Wszystko dzieje się tutaj, w miasteczku.')+'</p>'
      +'<div class="navbtns" style="justify-content:center"><button class="btn primary" id="startStacji">'+g.cta+'</button>'+wroc+'</div>');
    $('#startStacji').onclick=()=>uruchomStacje(g.stacja);
    $('#wrotGra').onclick=close;
    return;
  }
  open('<h2>'+g.tytul+'</h2><p>'+g.opis+'</p>'+(g.url
    ? '<p class="small">Gra otworzy się w nowej karcie. Miasteczko zostaje tu, gdzie jesteś.</p><div class="navbtns" style="justify-content:center"><a class="btn primary" href="'+g.url+'" target="_blank" rel="noopener">'+g.cta+'</a>'+wroc+'</div>'
    : '<div class="msg"><b>Ta gra jeszcze nie stoi w internecie.</b> Kod jest gotowy, brakuje adresu. Gdy tylko będzie, ten obiekt zacznie do niej prowadzić.</div><div class="navbtns" style="justify-content:center">'+wroc+'</div>'));
  const b=$('#wrotGra'); if(b) b.onclick=close; }
function showTalk(st){ let i=0; const lines=st.lines; const step=()=>{ const l=lines[i]; if(!l){ close(); nextStep(); return; }
  if(l.choice){ open(head(quest.mission)+npcLine(l.npc,l.text)+'<div class="qitem" style="margin-top:10px">'+l.choice.map((c,ci)=>'<button class="opt" data-c="'+ci+'">'+c.t+'</button>').join('')+'</div><div id="why"></div>'); pbox.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{ const c=l.choice[+b.dataset.c]; quest.total++; if(c.ok){ quest.ok++; b.classList.add('correct'); beep(880,.1); updateCalm(c.calm||3); } else { b.classList.add('wrong'); bad(); updateCalm(c.calm||-8); const g=l.choice.findIndex(x=>x.ok); if(g>=0) pbox.querySelector('.opt[data-c="'+g+'"]').classList.add('correct'); } pbox.querySelectorAll('.opt').forEach(x=>x.onclick=null); $('#why').innerHTML='<div class="msg '+(c.ok?'good':'badm')+'">'+(c.ok?'✅ ':'💡 ')+c.why+'</div><div class="navbtns" style="justify-content:flex-end"><button class="btn primary" id="nx">Dalej →</button></div>'; $('#nx').onclick=()=>{ i++; step(); }; }); }
  else { open(head(quest.mission)+npcLine(l.npc,l.text)+'<div class="navbtns" style="justify-content:flex-end"><button class="btn primary" id="nx">'+(l.btn||'Dalej →')+'</button></div>'); $('#nx').onclick=()=>{ i++; step(); }; } }; step(); }
function finishQuest(st){ const m=quest.mission,ch=DATA[m.id]; let stars=quest.stars; if(quest.total>0){ const r=quest.ok/quest.total; if(r<.5) stars=Math.min(stars,1); else if(r<.85) stars=Math.min(stars,2); } const first=!state.done[m.id]; const score=60+stars*40+Math.round(state.calm/5);
  TR('misja_koniec',{misja_id:m.id,misja:m.name,gwiazdki:stars,spokoj:Math.round(state.calm),pierwsze_przejscie:first,ukonczone_razem:Object.keys(state.done).length+(first?1:0)}); const gained=first?score:Math.round(score/4); state.done[m.id]=Math.max(state.done[m.id]||0,stars); state.score+=gained; updateCalm(5); save(); refreshBeacons(); good(); abortQuest();
  const learn=KIDS?ch.punkty.slice(0,3):ch.sekcje[0].p.slice(0,3);
  open('<h2>'+(KIDS?'🎉 Misja ukończona!':'✅ Misja zaliczona')+'</h2><div class="stars">'+'⭐'.repeat(stars)+'☆'.repeat(3-stars)+'</div><p>'+(st.summary||'')+'</p><p><b>+'+gained+' pkt</b>'+(KIDS?' · odznaka '+ch.odznaka:'')+'</p>'+(st.plan?'<div class="tip"><b>'+T('🧠 Twój plan „jeśli–to”:','🧠 Zapamiętaj:')+'</b> '+st.plan+'<br><label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="checkbox" id="commit" style="width:20px;height:20px"> '+T('Zobowiązuję się – wdrożę to w tym tygodniu (+20 pkt)','Obiecuję, że to zapamiętam! (+20)')+'</label></div>':'')+'<div class="msg"><b>📌 '+T('Zapamiętaj z tej misji','Zapamiętaj')+'</b><ul>'+learn.map(p=>'<li>'+p+'</li>').join('')+'</ul>'+'<a class="btn sm ghost" href="szkolenie.html?wersja='+(KIDS?'dzieci':'dorosli')+'&r='+m.id+'" target="_blank">'+T('Szerzej w szkoleniu','Więcej w szkoleniu')+'</a>'+(wzmiankaOksiazce()?'<p class="small" style="margin-top:12px;opacity:.7">Scenariusze misji powstały na podstawie '+ch.nr.toLowerCase()+' książki „'+KSIAZKA.tytul+'”.</p>':'')+'</div><div class="navbtns" style="justify-content:center"><button class="btn primary" id="okBtn">Wracam do miasteczka →</button></div>'+(Object.keys(state.done).length===MISSIONS.length?'<p style="text-align:center"><button class="btn ghost" id="endBtn">🏁 Podsumowanie gry</button></p>':''));
  $('#okBtn').onclick=()=>{ const c=$('#commit'); if(c&&c.checked){ state.score+=20; save(); refreshBeacons(); TR('zobowiazanie',{misja_id:m.id}); toast('💪 +20 pkt za zobowiązanie. Wpisz to do kalendarza!'); } close(); wskazowka(); }; const e=$('#endBtn'); if(e) e.onclick=showEnd; }
function failStep(msg,retry){ bad(); updateCalm(-6); open('<h2>'+T('💡 Jeszcze raz – z podpowiedzią','🙂 Spróbuj jeszcze raz')+'</h2><p>'+msg+'</p><p class="small">'+T('Błąd w grze to najtańszy błąd. Prawdziwy trening polega na powtarzaniu.','Każdy bohater ćwiczy, aż mu wyjdzie!')+'</p><div class="navbtns"><button class="btn ghost" id="cl">Przerwij misję</button><button class="btn primary" id="rt">🔁 Spróbuj ponownie</button></div>'); $('#cl').onclick=()=>{ TR('misja_przerwana',{misja_id:quest?quest.mission.id:-1,powod:'po_bledzie'}); abortQuest(); close(); }; $('#rt').onclick=()=>{ TR('misja_powtorka',{misja_id:quest?quest.mission.id:-1}); close(); if(retry) retry(); else runStep(); }; }

/* ---------- MINI-GRY PANELOWE ---------- */
const nextBtn=(id)=>'<div class="navbtns" style="justify-content:flex-end"><button class="btn primary" id="'+id+'">Dalej →</button></div>';
function quizPanel(qs,intro,then){ let i=0,ok=0; const step=()=>{ if(i>=qs.length){ then(ok,qs.length); return; } const q=qs[i]; open(head(quest.mission)+(intro?'<p class="small">'+intro+'</p>':'')+'<div class="qitem"><div class="q">'+(i+1)+'/'+qs.length+': '+q.q+'</div>'+q.o.map((o,oi)=>'<button class="opt" data-o="'+oi+'">'+o+'</button>').join('')+'</div><div id="fb"></div>');
  pbox.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{ const c=+b.dataset.o===q.a; b.classList.add(c?'correct':'wrong'); quest.total++; if(c){ok++;quest.ok++;beep(880,.1);} else { bad(); pbox.querySelector('.opt[data-o="'+q.a+'"]').classList.add('correct'); } pbox.querySelectorAll('.opt').forEach(x=>x.onclick=null);
    $('#fb').innerHTML='<div class="msg '+(c?'good':'badm')+'"><b>'+(c?'✅ Dobrze. ':'💡 Zapamiętaj: ')+'</b>'+(q.w||'Poprawna odpowiedź jest podświetlona na zielono.')+'</div>'+nextBtn('nxq');
    $('#nxq').onclick=()=>{ i++; step(); }; }); }; step(); }

/* ---------- ĆWICZENIA, KTÓRE UCZĄ PRZEZ DZIAŁANIE ---------- */
/* rachunek: gracz sam liczy, a po dwóch próbach dostaje rozpisane rozwiązanie */
function calcPanel(cfg,then){ let tries=0,counted=false;
  open(head(quest.mission)+'<div class="tip"><b>📐 Zasada:</b> '+cfg.rule+'</div><p><b>'+cfg.question+'</b></p><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:14px 0"><input id="ans" type="number" inputmode="decimal" placeholder="wpisz liczbę" style="flex:1;min-width:150px;padding:13px 16px;font-size:1.25rem;font-weight:800;border-radius:12px;border:2px solid var(--line);background:var(--card2);color:var(--text);font-family:inherit"><span style="font-weight:800">'+cfg.unit+'</span><button class="btn primary" id="okc">Sprawdź</button></div><div id="fb"></div>');
  const inp=$('#ans'); try{ inp.focus(); }catch(e){}
  const finish=()=>{ const nb=$('#nxc'); if(nb) nb.onclick=then; };
  const check=()=>{ const v=parseFloat(String(inp.value||'').replace(',','.'));
    if(isNaN(v)){ $('#fb').innerHTML='<div class="msg">Wpisz liczbę i naciśnij „Sprawdź”.</div>'; return; }
    const okv=Math.abs(v-cfg.answer)<=(cfg.tol||0);
    if(!counted){ counted=true; quest.total++; if(okv) quest.ok++; }
    if(okv){ good(); $('#fb').innerHTML='<div class="msg good"><b>✅ Zgadza się. </b>'+cfg.solution+'</div>'+nextBtn('nxc'); finish(); return; }
    tries++; bad();
    if(tries<2){ $('#fb').innerHTML='<div class="msg badm"><b>💡 Jeszcze nie. </b>'+cfg.hint+'</div>'; }
    else { quest.stars=Math.max(1,quest.stars-1); $('#fb').innerHTML='<div class="msg badm"><b>Rozwiązanie krok po kroku: </b>'+cfg.solution+' Zapamiętaj sposób liczenia, nie sam wynik.</div>'+nextBtn('nxc'); finish(); } };
  $('#okc').onclick=check; inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); check(); } }; }

/* samoocena: gracz sprawdza własne przygotowanie i dostaje listę zadań */
function selfCheckPanel(then){
  const qs=KIDS?[{q:'Wiesz, gdzie w domu leżą latarki?',fix:'Poproś rodzica, żeby pokazał ci latarki. Sprawdź baterie.'},
    {q:'Znasz na pamięć numer 112?',fix:'Powtórz dziś trzy razy: sto dwanaście. To numer do straży, pogotowia i policji.'},
    {q:'Wiesz, gdzie się spotykacie, gdyby trzeba było szybko wyjść z domu?',fix:'Ustalcie dziś jedno miejsce przed domem. Pokaż je palcem.'},
    {q:'Macie w domu zapas wody w butelkach?',fix:'Policz butelki z rodzicem. Powinno być 3 litry na osobę na dzień.'},
    {q:'Wiesz, co robić, gdy poczujesz dym?',fix:'Nisko przy podłodze, chusteczka na buzię, wołaj dorosłego i wychodźcie.'}]
  :[{q:'Przetrwasz 72 godziny w domu bez prądu, gazu i bieżącej wody?',fix:'Zacznij od wody: 3 l na osobę na dzień × 3 dni. To najtańszy i najważniejszy zakup.'},
    {q:'Masz zapas leków na stałe przynajmniej na 7 dni?',fix:'Poproś lekarza o receptę z zapasem. Zrób listę leków i dawek na papierze.'},
    {q:'Potrafisz opuścić mieszkanie z rodziną w 10 minut?',fix:'Spakuj plecak 72 h i postaw go w jednym, stałym miejscu przy drzwiach.'},
    {q:'Masz źródło informacji działające bez prądu i internetu?',fix:'Kup radio na baterie lub korbkę. Sprawdź, gdzie w twojej okolicy słychać Program I.'},
    {q:'Twoi bliscy znają miejsce spotkania poza domem i numer łącznika z innego miasta?',fix:'Ustalcie punkt A i punkt B oraz jedną osobę spoza województwa, do której dzwonią wszyscy.'}];
  let i=0; const no=[];
  const step=()=>{ if(i>=qs.length){
      const score=qs.length-no.length;
      open(head(quest.mission)+'<h3 style="margin-top:0">Twój wynik: '+score+' / '+qs.length+'</h3><p>'+(no.length===0?T('Jesteś przygotowany lepiej niż większość gospodarstw w Polsce. Utrzymaj to: przegląd co pół roku.','Świetnie! Wiesz już bardzo dużo.'):T('To nie jest ocena, tylko lista zakupów i zadań na najbliższy tydzień:','Oto twoje zadania na ten tydzień:'))+'</p>'+(no.length?'<div class="steps">'+no.map(n=>'<div class="step"><h3>'+n.q+'</h3><ul><li>'+n.fix+'</li></ul></div>').join('')+'</div>':'')+nextBtn('nxs'));
      $('#nxs').onclick=then; return; }
    const q=qs[i];
    open(head(quest.mission)+'<p class="small">'+T('Szczera samoocena. Nikt tego nie widzi, a wynik pokaże, od czego zacząć.','Odpowiedz szczerze. To nie jest sprawdzian!')+' ('+(i+1)+'/'+qs.length+')</p><div class="msg"><b>'+q.q+'</b></div><div class="navbtns" style="justify-content:center"><button class="btn primary" data-v="1">✅ Tak</button><button class="btn ghost" data-v="0">❌ Jeszcze nie</button></div>');
    pbox.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{ if(b.dataset.v==='0') no.push(q); beep(700,.06); i++; step(); }); };
  step(); }

/* budżet: gracz układa zestaw w ramach kwoty i uczy się kolejności priorytetów */
function budgetPanel(then){
  const BUD=KIDS?150:500;
  const items=KIDS?[{n:'💧 Woda w butelkach',p:20,k:1},{n:'🔦 Latarka i baterie',p:35,k:2},{n:'🥫 Konserwy i batony',p:30,k:3},{n:'🩹 Plastry i bandaże',p:25,k:4},{n:'📻 Radio na baterie',p:40,k:5},{n:'🧻 Mydło i papier',p:15,k:6},{n:'🎮 Nowa gra',p:120,k:9},{n:'🍬 Wielki worek cukierków',p:60,k:9}]
  :[{n:'💧 Woda 30 l + tabletki uzdatniające',p:60,k:1},{n:'🔦 Latarka czołowa + baterie',p:70,k:2},{n:'🕯️ Świece i zapalniczki',p:20,k:2},{n:'🥫 Żywność trwała na 3 dni',p:120,k:3},{n:'🍫 Batony energetyczne',p:30,k:3},{n:'🩹 Apteczka podstawowa',p:80,k:4},{n:'📻 Radio na korbkę',p:90,k:5},{n:'🔌 Powerbank 20 000 mAh',p:100,k:5},{n:'🧻 Higiena: papier, mydło, chusteczki',p:40,k:6},{n:'⚙️ Agregat prądotwórczy',p:1200,k:9},{n:'📺 Telewizor przenośny',p:400,k:9}];
  const LAD=T('Kolejność z książki: woda i uzdatnianie → światło i ciepło → żywność → apteczka → komunikacja i dokumenty.','Kolejność: woda → światło → jedzenie → apteczka → radio.');
  const sel=new Set();
  const draw=()=>{ const spent=[...sel].reduce((a,i)=>a+items[i].p,0);
    open(head(quest.mission)+'<div class="tip"><b>📐 Zasada:</b> '+LAD+'</div><p>'+T('Masz '+BUD+' zł na pierwszy zestaw. Ułóż go tak, żeby zamknąć wszystkie pięć szczebli. Drogi sprzęt kupuje się później.','Masz '+BUD+' zł. Kup najważniejsze rzeczy!')+'</p><div class="timer">Wydane: <span style="color:'+(spent>BUD?'var(--bad)':'var(--ok)')+'">'+spent+' zł</span> / '+BUD+' zł</div><div class="items">'+items.map((it,i)=>'<div class="item'+(sel.has(i)?' sel':'')+'" data-i="'+i+'"><span class="e">'+it.n.slice(0,2)+'</span>'+it.n.slice(2)+'<br><b>'+it.p+' zł</b></div>').join('')+'</div><div class="navbtns" style="justify-content:flex-end"><button class="btn primary" id="okb">✅ Kupuję</button></div><div id="fb"></div>');
    pbox.querySelectorAll('.item').forEach(el=>el.onclick=()=>{ const i=+el.dataset.i; sel.has(i)?sel.delete(i):sel.add(i); beep(650,.05); draw(); });
    $('#okb').onclick=()=>{ const cover=new Set([...sel].map(i=>items[i].k).filter(k=>k<=5));
      const over=spent>BUD; quest.total++;
      if(!over&&cover.size===5){ quest.ok++; good(); $('#fb').innerHTML='<div class="msg good"><b>✅ Dobry zestaw za '+spent+' zł.</b> Zamknąłeś wszystkie pięć szczebli. Resztę budżetu odkładaj na plan 52 tygodni: co tydzień jedna rzecz.</div>'+nextBtn('nxb'); $('#nxb').onclick=then; }
      else { bad(); quest.stars=Math.max(1,quest.stars-1);
        const brak=[1,2,3,4,5].filter(k=>!cover.has(k)).map(k=>['','woda','światło','żywność','apteczka','komunikacja'][k]);
        $('#fb').innerHTML='<div class="msg badm">'+(over?'<b>Przekroczyłeś budżet o '+(spent-BUD)+' zł.</b> Agregat i telewizor to zakupy na później, nie na pierwszy zestaw. ':'')+(brak.length?'<b>Brakuje szczebli:</b> '+brak.join(', ')+'. ':'')+'Zestaw za '+BUD+' zł da się zamknąć: '+T('woda 60 + świece 20 + batony 30 + apteczka 80 + radio 90 = 280 zł.','woda + latarka + jedzenie + plastry + radio.')+'</div><div class="navbtns"><button class="btn ghost" id="againb">🔁 Poprawiam</button><button class="btn primary" id="nxb">Dalej →</button></div>';
        $('#nxb').onclick=then; $('#againb').onclick=draw; } }; };
  draw(); }

/* rotacja zapasów: FEFO – pierwsze wychodzi to, co najkrócej zdatne */
function fifoPanel(then){
  const rounds=[{t:T('Trzy produkty z twojej spiżarni. Który zjadasz jako pierwszy?','Co zjadamy najpierw?'),i:[{n:'🥫 Konserwa mięsna',b:'kupiona 11.2024',e:'ważna do 11.2026'},{n:'💧 Woda 5 l',b:'kupiona 01.2025',e:'ważna do 01.2026'},{n:'🍚 Ryż pakowany próżniowo',b:'kupiony 02.2024',e:'ważny do 02.2029'}],a:1,
      w:T('Decyduje data ważności, nie data zakupu. To zasada FEFO: pierwsze wychodzi to, co najszybciej traci ważność. Woda kończy się w 01.2026, choć kupiłeś ją najpóźniej.','Patrzymy na datę ważności, nie na to, co kupiliśmy najdawniej.')},
    {t:T('Teraz uwaga na pułapkę. Który produkt idzie do kuchni bieżącej?','Który produkt bierzemy teraz?'),i:[{n:'🍝 Makaron',b:'kupiony 03.2023',e:'ważny do 12.2027'},{n:'🥛 Mleko UHT',b:'kupione 06.2025',e:'ważne do 03.2026'},{n:'🫘 Fasola w puszce',b:'kupiona 01.2024',e:'ważna do 08.2028'}],a:1,
      w:T('Makaron leży najdłużej, ale ma termin do 2027. Mleko UHT kończy się pierwsze, więc to ono wchodzi do bieżącego gotowania, a na półkę wraca świeżo kupione.','Mleko kończy się najwcześniej, więc pijemy je pierwsze.')}];
  let r=0; const step=()=>{ if(r>=rounds.length){ then(); return; } const R=rounds[r];
    open(head(quest.mission)+'<div class="tip"><b>📐 Zasada:</b> '+T('FIFO to kolejność wkładania na półkę, FEFO to kolejność zjadania. W kryzysie liczy się FEFO.','Najpierw zjadamy to, co najszybciej się przeterminuje.')+'</div><p><b>'+R.t+'</b></p><ul class="ord" id="ff">'+R.i.map((it,i)=>'<li data-i="'+i+'"><span class="n">'+(i+1)+'</span><div>'+it.n+'<br><span class="small">'+it.b+' · <b>'+it.e+'</b></span></div></li>').join('')+'</ul><div id="fb"></div>');
    pbox.querySelectorAll('#ff li').forEach(li=>li.onclick=()=>{ const i=+li.dataset.i, c=i===R.a; quest.total++; if(c){ quest.ok++; good(); } else { bad(); }
      pbox.querySelectorAll('#ff li').forEach(x=>{ x.onclick=null; x.style.borderColor=+x.dataset.i===R.a?'var(--ok)':'var(--line)'; });
      li.style.borderColor=c?'var(--ok)':'var(--bad)';
      $('#fb').innerHTML='<div class="msg '+(c?'good':'badm')+'"><b>'+(c?'✅ Tak. ':'💡 Nie to. ')+'</b>'+R.w+'</div>'+nextBtn('nxf'); $('#nxf').onclick=()=>{ r++; step(); }; }); };
  step(); }
function orderPanel(intro,steps,tip,then){ const idx=steps.map((s,i)=>i).sort(()=>Math.random()-.5); const labels=idx.map(i=>steps[i]); const correct=idx.map((v,pos)=>pos).sort((a,b)=>idx[a]-idx[b]); let picked=[]; open(head(quest.mission)+'<p>'+intro+'</p><ul class="ord" id="ord">'+labels.map((l,i)=>'<li data-i="'+i+'"><span class="n"></span>'+l+'</li>').join('')+'</ul><div class="navbtns"><button class="btn ghost" id="undo">↶ Cofnij</button></div>'); const lis=[...pbox.querySelectorAll('#ord li')]; const paint=()=>lis.forEach(li=>{ const p=picked.indexOf(+li.dataset.i); li.classList.toggle('sel',p>=0); li.querySelector('.n').textContent=p>=0?p+1:''; }); lis.forEach(li=>li.onclick=()=>{ const i=+li.dataset.i; if(picked.includes(i)) return; picked.push(i); beep(500+picked.length*80,.06); paint(); if(picked.length===labels.length){ let ok=0; picked.forEach((v,pos)=>{ if(v===correct[pos]) ok++; }); quest.total+=labels.length; quest.ok+=ok; setTimeout(()=>{ if(ok>=labels.length-1) then(ok); else failStep('Na miejscu: '+ok+'/'+labels.length+'. Poprawna kolejność:<ol>'+correct.map(i=>'<li>'+labels[i]+'</li>').join('')+'</ol>'+tip); },500); } }); $('#undo').onclick=()=>{picked.pop();paint();}; }
function packPanel(cfg,then){ const items=cfg.good.map(t=>({t,g:true})).concat(cfg.bad.map(t=>({t,g:false}))).sort(()=>Math.random()-.5); let tleft=cfg.time,sel=new Set(),timer; open(head(quest.mission)+'<p>'+cfg.intro+'</p><div class="timer">⏱ <span id="tm">'+tleft+'</span> s</div><div class="items">'+items.map((it,i)=>'<div class="item" data-i="'+i+'"><span class="e">'+it.t.slice(0,2)+'</span>'+it.t.slice(2)+'</div>').join('')+'</div><div class="navbtns" style="justify-content:flex-end"><button class="btn primary" id="ok">✅ Gotowe</button></div>'); pbox.querySelectorAll('.item').forEach(el=>el.onclick=()=>{ const i=+el.dataset.i; if(sel.has(i)){sel.delete(i);el.classList.remove('sel');} else {sel.add(i);el.classList.add('sel');} beep(600,.05); }); const done=()=>{ clearInterval(timer); let ok=0,wrong=0; items.forEach((it,i)=>{ const el=pbox.querySelector('.item[data-i="'+i+'"]'); if(it.g){ if(sel.has(i)) ok++; el.classList.add('good'); } else if(sel.has(i)){ wrong++; el.classList.add('badx'); } }); const goodN=cfg.good.length; quest.total+=goodN; quest.ok+=Math.max(0,ok-wrong); setTimeout(()=>{ if(ok>=Math.ceil(goodN*.7)&&wrong<=1) then(ok,wrong); else failStep('Trafione: '+ok+'/'+goodN+', błędne: '+wrong+'. '+cfg.tip); },1400); }; $('#ok').onclick=done; timer=setInterval(()=>{ tleft--; const e=$('#tm'); if(e) e.textContent=tleft; if(tleft<=5) beep(1000,.05); if(tleft<=0) done(); },1000); }
function breathPanel(then){ let phase=0,cnt=0; const phases=[['Wdech przez nos',4],['Zatrzymaj oddech',7],['Powolny wydech ustami',8]]; open(head(quest.mission)+'<p>'+T('Technika 4–7–8 z książki: wdech 4 s, zatrzymanie 7 s, wydech 8 s. Zrób jeden pełny cykl razem z kółkiem.','Oddech „na gorącą zupę”: wdech… zatrzymaj… i długi wydech. Zrób to razem z kółkiem!')+'</p><div style="text-align:center;padding:20px"><div id="circ" style="width:120px;height:120px;border-radius:50%;background:var(--accent);margin:0 auto;transition:transform 1s linear;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:2rem;color:#1a1200">4</div><h3 id="ph" style="margin-top:16px">Wdech przez nos</h3></div>'); const circ=$('#circ'),ph=$('#ph'); const tick=()=>{ if(!panelOpen) return; const [name,len]=phases[phase]; ph.textContent=name; circ.textContent=len-cnt; circ.style.transform='scale('+(phase===0?1+cnt/len*.6:phase===1?1.6:1.6-cnt/len*.6)+')'; cnt++; if(cnt>len){ cnt=0; phase++; if(phase>=phases.length){ updateCalm(15); good(); then(); return; } } setTimeout(tick,1000); }; tick(); }
function sirenPanel(then){ const kinds=[{k:'mod',n:T('ZACZYNA alarm – dźwięk modulowany (falujący), 3 min','ALARM – zaczyna się (dźwięk falujący)')},{k:'cont',n:T('KOŃCZY alarm – dźwięk ciągły (równy), 3 min','KONIEC ALARMU (dźwięk równy)')},{k:'test',n:T('Test syren – krótkie przerywane','TEST (krótkie, przerywane)')}]; const seq=kinds.slice().sort(()=>Math.random()-.5); let i=0,ok=0; const step=()=>{ if(i>=seq.length){ if(ok>=2) then(ok); else failStep('Rozpoznane: '+ok+'/3. Falujący zaczyna zagrożenie, równy je kończy, krótkie przerywane to tylko test.'); return; } const cur=seq[i]; open(head(quest.mission)+'<p>'+T('Sygnał '+(i+1)+'/3. Reakcja: alarm → plan i schronienie, odwołanie → można wyjść, test → okazja do ćwiczeń.','Posłuchaj „dźwięku ochrony” '+(i+1)+'/3 i powiedz, co znaczy.')+'</p><div style="text-align:center"><button class="btn primary" id="play">🔊 Odtwórz</button></div><div class="qitem" style="margin-top:14px">'+kinds.map(k=>'<button class="opt" data-k="'+k.k+'">'+k.n+'</button>').join('')+'</div>'); $('#play').onclick=()=>siren(cur.k,4); setTimeout(()=>siren(cur.k,4),300); pbox.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{ const c=b.dataset.k===cur.k; quest.total++; b.classList.add(c?'correct':'wrong'); if(c){ok++;quest.ok++;beep(880,.1);} else { bad(); pbox.querySelector('.opt[data-k="'+cur.k+'"]').classList.add('correct'); } pbox.querySelectorAll('.opt').forEach(x=>x.onclick=null); setTimeout(()=>{i++;step();},1100); }); }; step(); }
function fakePanel(msgs,then){ let i=0,ok=0; const step=()=>{ if(i>=msgs.length){ if(ok>=msgs.length-1) then(ok); else failStep('Rozpoznane: '+ok+'/'+msgs.length+'. Fake: brak źródła, CAPS LOCK, „podaj dalej”, emocje. Prawda: oficjalne konto, data, konkret. Schemat SWIAT.'); return; } const c=msgs[i]; open(head(quest.mission)+'<p class="small">Wiadomość '+(i+1)+'/'+msgs.length+'. Zanim klikniesz: kto to napisał? kiedy? kto na tym zyskuje?</p><div class="msg" style="font-family:monospace">'+c.t+'</div><div class="navbtns" style="justify-content:center"><button class="btn primary" data-f="false">✅ Wiarygodne</button><button class="btn primary" data-f="true">🚫 Fake – nie podaję dalej</button></div><div id="why"></div>'); pbox.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{ const c2=(b.dataset.f==='true')===c.f; quest.total++; if(c2){ok++;quest.ok++;beep(880,.1);} else { bad(); updateCalm(-5); } $('#why').innerHTML='<div class="msg '+(c2?'good':'badm')+'">'+(c2?'✅ ':'❌ ')+c.why+'</div>'; pbox.querySelectorAll('[data-f]').forEach(x=>x.disabled=true); setTimeout(()=>{i++;step();},2100); }); }; step(); }
function sosPanel(then){ const targetSeq='SSSLLLSSS'; let seq='',down=0; open(head(quest.mission)+'<p>'+T('Nadaj SOS latarką: 3 krótkie, 3 długie, 3 krótkie błyski. Krótki = kliknięcie poniżej 0,35 s, długi = przytrzymaj.','Nadaj SOS latarką! 3 krótkie, 3 długie, 3 krótkie błyski. Krótko klikaj albo przytrzymaj.')+'</p><div style="text-align:center"><button class="btn primary" id="lamp" style="font-size:2rem;padding:30px 40px">🔦</button><div id="seq" style="font-size:1.6rem;letter-spacing:6px;margin-top:14px;min-height:2rem"></div><button class="btn ghost sm" id="rs">Od nowa</button></div>'); const lamp=$('#lamp'),sq=$('#seq'); const paint=()=>sq.textContent=seq.split('').map(c=>c==='S'?'·':'—').join(''); lamp.addEventListener('pointerdown',e=>{ e.preventDefault(); down=performance.now(); lamp.style.background='#fff'; }); const en=e=>{ e.preventDefault(); if(!down) return; const d=performance.now()-down; down=0; lamp.style.background=''; seq+=d<350?'S':'L'; beep(d<350?900:600,d<350?.1:.3); paint(); if(seq.length>=9){ if(seq===targetSeq){ quest.total++; quest.ok++; good(); then(); } else { seq=''; paint(); bad(); toast('Nie tak – spróbuj: · · · — — — · · ·'); } } }; lamp.addEventListener('pointerup',en); lamp.addEventListener('pointerleave',en); $('#rs').onclick=()=>{seq='';paint();}; }
let tapT=[]; function tapHit(){ if(!tapMode) return; tapT.push(performance.now()); beep(300,.05,'square',.15); const c=$('#cnt'); if(c) c.textContent=tapT.length; }
function rkoPanel(then){ tapT=[]; tapMode=true; open(head(quest.mission)+'<p>'+T('Resuscytacja: uciskaj klatkę w tempie 100–120 na minutę przez 15 sekund. Klikaj przycisk lub SPACJĘ w tym rytmie – jak refren „Stayin’ Alive”.','Uciskaj klatkę piersiową jak ratownik: klikaj szybko i równo (2 razy na sekundę) przez 15 sekund!')+'</p><div style="text-align:center"><button class="btn primary" id="tap" style="font-size:2rem;padding:30px 50px">❤️ UCISK</button><div class="timer" style="margin-top:12px">Uciśnięć: <span id="cnt">0</span> · ⏱ <span id="tl">15</span> s</div></div>'); $('#tap').onpointerdown=e=>{ e.preventDefault(); tapHit(); }; let left=15; const tick=()=>{ left--; const e=$('#tl'); if(e) e.textContent=left; if(left<=0){ tapMode=false; const bpm=tapT.length*4; quest.total+=2; if(bpm>=95&&bpm<=130){ quest.ok+=2; then(bpm); } else if(bpm>=80&&bpm<=145){ quest.ok+=1; then(bpm); } else failStep('Tempo: '+bpm+'/min. Cel: 100–120/min (2 uciśnięcia na sekundę). Głębokość 5–6 cm.'); return; } setTimeout(tick,1000); }; setTimeout(tick,1000); }

/* ---------- 3D: POWÓDŹ, PADNIJ, BIEG NA CZAS ---------- */
let floodStep=null; function runFlood(st){ floodStep=st; open(head(quest.mission)+npcLine('strazak',T('Wał przerwany! Woda dojdzie tu za minutę. Nie w stronę rzeki – na wzgórze, za stację energetyczną. Biegiem, ale bez paniki. Masz 40 sekund.','Woda się podnosi! Biegnij na zieloną górkę za stacją energetyczną. Nie w stronę rzeki! Masz 40 sekund.'))+'<div class="navbtns" style="justify-content:center"><button class="btn primary" id="go">🏃 Biegnę!</button></div>'); $('#go').onclick=()=>{ close(); floodMode=true; floodT=0; floodLevel=-1; rain.visible=true; siren('mod',3); }; }
function endFlood(win){ floodMode=false; flood.visible=false; setObjective(''); if(win){ if(floodT>28) quest.stars=Math.min(quest.stars,2); good(); nextStep(); } else { player.position.set(HOME[0],0,HOME[1]+8); failStep(T('Woda cię dogoniła. Szukaj przewyższenia trasy: omijaj doliny, podziemia i mosty, biegnij od razu na wzgórze.','Woda była szybsza. Biegnij od razu w stronę górki – z dala od rzeki!'),()=>runFlood(floodStep)); } }
let dropRound=0,dropOk=0,dropTimer=null,dropStart=0,dropStep=null;
function runDrop(st){ dropStep=st; dropRound=0; dropOk=0; open(head(quest.mission)+npcLine('strazak',T('Ćwiczenie refleksu. Przy błysku i huku natychmiast SPACJA lub dotknięcie ekranu – „padnij i osłoń się”. Masz 2 sekundy. 3 próby. To ma wejść w nawyk jak zapięcie pasów.','Zabawa „Żółw”: gdy usłyszysz WIELKI HUK i ekran błyśnie – szybko naciśnij SPACJĘ albo dotknij ekranu. 3 razy!'))+'<div class="navbtns" style="justify-content:center"><button class="btn primary" id="go">Zaczynam</button></div>'); $('#go').onclick=()=>{ close(); setObjective(T('⚠️ Czekaj na błysk… SPACJA / dotknij = padnij i osłoń się','🐢 Czekaj na huk… SPACJA / dotknij = żółw!')); nextDrop(); }; }
function nextDrop(){ if(dropRound>=3){ dropWait=false; setObjective(''); quest.total+=3; quest.ok+=dropOk; if(dropOk>=2){ if(dropOk<3) quest.stars=Math.min(quest.stars,2); nextStep(); } else failStep('Reakcje na czas: '+dropOk+'/3. Ćwicz reakcję co tydzień – 5–15 sekund ratuje życie.',()=>runDrop(dropStep)); return; } dropWait=false; dropTimer=setTimeout(()=>{ bang(); flash(); dropWait=true; dropStart=performance.now(); dropTimer=setTimeout(()=>{ if(dropWait){ dropWait=false; dropRound++; toast('Za późno! Następna próba…'); setTimeout(nextDrop,1200);} },2000); },1500+Math.random()*3500); }
function dropHit(){ if(!dropWait) return; dropWait=false; clearTimeout(dropTimer); const rt=Math.round(performance.now()-dropStart); dropOk++; dropRound++; player.rotation.z=Math.PI/2; setTimeout(()=>{player.rotation.z=0;},800); toast('✅ Padnij! Reakcja: '+rt+' ms'); beep(880,.1); setTimeout(nextDrop,1200); }
function flash(){ const f=document.createElement('div'); f.style.cssText='position:fixed;inset:0;background:#fff;opacity:.9;z-index:9;pointer-events:none;transition:opacity .5s'; document.body.appendChild(f); requestAnimationFrame(()=>f.style.opacity='0'); setTimeout(()=>f.remove(),600); }
function runTimed(st){ timedStep=st; open(head(quest.mission)+npcLine('ania',st.intro)+'<ol>'+st.points.map(p=>'<li>'+p.name+'</li>').join('')+'</ol><p class="small">Kolejność ma znaczenie. Masz '+st.time+' s.</p><div class="navbtns" style="justify-content:center"><button class="btn primary" id="go">⏱ Start!</button></div>'); $('#go').onclick=()=>{ close(); timedRun=true; timedT=st.time; timedIdx=0; let tp=$('#timerPill'); if(!tp){ tp=document.createElement('span'); tp.className='pill'; tp.id='timerPill'; $('#missionPill').after(tp);} spawnPickups(st.points.map((p,i)=>({name:(i+1)+'. '+p.name,x:p.x,z:p.z,good:true,why:p.why,idx:i}))); setObjective('Krok 1/'+st.points.length+': '+st.points[0].name); siren('mod',2); }; }
function endTimed(win){ timedRun=false; const tp=$('#timerPill'); if(tp) tp.textContent=''; clearPickups(); setObjective(''); if(win){ if(timedT<timedStep.time*.25) quest.stars=Math.min(quest.stars,2); good(); nextStep(); } else { player.position.set(HOME[0],0,HOME[1]+8); failStep(T('Czas minął. Kolejność: hasło → buty i kurtka → plecak → dokumenty → leki → zwierzę → media → kartka → miejsce A. Plecak ZAWSZE stoi w jednym miejscu.','Czas minął! Pamiętaj kolejność: buty, plecak, dokumenty, leki, Burek, kartka na drzwiach, miejsce A.'),()=>runTimed(timedStep)); } }

/* ---------- DEFINICJE QUESTÓW (rozdział po rozdziale) ---------- */
const H=HOME; const at=(dx,dz)=>({x:H[0]+dx,z:H[1]+dz});
function buildSteps(m){ const ch=DATA[m.id]; const D=[];
 switch(m.id){
 case 0: D.push({type:'talk',npc:'zosia',x:45,z:-37,auto:true,lines:[
   {npc:'zosia',text:T('Tato, w szkole mówili, że ponad 60% Polaków nie ma zapasów nawet na 3 dni, a 78% nie ma planu ewakuacji. A my mamy?','Cześć! Dziś w szkole mówili o „przygotowaniu”. Co to znaczy?')},
   {npc:'dziadek',text:T('W 1997 widziałem, jak woda zabiera wszystko w godzinę. Ludzie nie panikowali nie dlatego, że byli odważni – tylko dlatego, że wiedzieli, co robić.','Przygotowanie to nie strach, tylko mądrość. Jak zapinanie pasów w aucie – nie boisz się jechać, po prostu je zapinasz.')},
   {npc:'ania',text:T('Zróbmy to po kolei, rozdział po rozdziale. Od dziś to ty jesteś naszym koordynatorem. Pierwsze zadanie: sprawdź, co naprawdę nam grozi.','Zostaniesz Małym Strażnikiem Bezpieczeństwa? Twoja pierwsza rola: Strażnik Latarek – pilnujesz, żeby latarki miały baterie!'),choice:[{t:T('Dobrze. Zaczynam od analizy ryzyka – bez paniki, z planem.','Tak! Zostaję Strażnikiem Latarek!'),ok:true,why:T('Przygotowanie nie oznacza paniki. Oznacza odpowiedzialność.','Super! Przygotowana rodzina jest spokojna, bo wie, co robić.')},{t:T('Po co? U nas nic się nie zdarzy.','Nie chcę, to nudne.'),ok:false,why:T('To najczęstsza pułapka. Powodzie 1997/2010, blackout 2021, pandemia – to doświadczenia z ostatnich lat, nie science fiction.','Szkoda! Strażnik ma najfajniejsze zadania – zobaczysz.')}]}]});
  D.push({type:'panel',run:()=>selfCheckPanel(()=>nextStep())});
  D.push({type:'panel',run:()=>quizPanel(ch.quiz,T('Trzy pytania o zasady, nie o książkę. Po każdej odpowiedzi zobaczysz wyjaśnienie.','Trzy pytania. Po każdym powiem ci, dlaczego tak jest.'),()=>nextStep())});
  D.push({type:'end',summary:T('Wiesz już, gdzie masz luki i od czego zacząć. Teraz krok po kroku.','Jesteś Strażnikiem Latarek!'),plan:T('Jeśli myślę „u nas nic się nie zdarzy”, to przypominam sobie 1997, 2010 i 2021.','Jeśli zgaśnie światło, to wiem, gdzie są latarki.')}); break;
 case 1: D.push({type:'talk',npc:'dziadek',...at(0,8),auto:true,lines:[{npc:'dziadek',text:T('Zanim kupisz latarkę – zadaj sobie pytanie: czego naprawdę się obawiam? Dom stoi 300 m od rzeki, ja mam 79 lat i leki na serce, Zosia ma 8 lat. Obejdź dom i zaznacz słabe punkty.','Detektyw zagrożeń najpierw patrzy i myśli. Obejdź dom i znajdź 4 miejsca, na które trzeba uważać.')}]});
  D.push({type:'collect',obj:T('Znajdź słabe punkty domu (podatność)','Znajdź 4 miejsca „uwaga!” wokół domu'),items:[{name:'Piwnica – może zalać',...at(-6,2),good:true,why:'300 m od rzeki'},{name:'Stare bezpieczniki',...at(6,2),good:true,why:'blackout'},{name:'Leki dziadka w lodówce',...at(3,10),good:true,why:'bez prądu tylko 4 h'},{name:'Jedna droga wyjazdu',...at(0,16),good:true,why:'most może być zamknięty'},{name:'Trawnik',...at(-8,12),good:false,why:T('to nie jest podatność – nie rozpraszaj się','tu nic nie grozi')}]});
  D.push({type:'panel',run:()=>KIDS?quizPanel(ch.quiz,null,()=>nextStep()):orderPanel('Każde zagrożenie oceń dwoma liczbami w skali 1–5: P – jak prawdopodobne jest u Ciebie, S – jak mocno uderzy w Twoją rodzinę. Ułóż od najwyższego iloczynu P × S do najniższego.',['Powódź – P=4 (dom 300 m od rzeki), S=5 (strata domu) = 20','Cyberatak na bank – P=5 (zdarza się często), S=3 (kilka dni bez karty) = 15','Blackout – P=3, S=4 (bez prądu, wody i ogrzewania) = 12','Zamieszki – P=2 (mała miejscowość), S=5 = 10'],'Iloczyn 12 i więcej to obszar krytyczny: tym się zajmujesz najpierw. Zwróć uwagę, że cyberatak jest bardziej prawdopodobny niż powódź, a mimo to powódź wygrywa – bo skutki są nieodwracalne.',()=>nextStep())});
  D.push({type:'panel',run:()=>breathPanel(()=>nextStep())});
  D.push({type:'end',summary:T('Powódź i blackout to wasze priorytety. Oddech 4-7-8 obniżył stres – tak samo zadziała w kryzysie.','Znasz słabe punkty domu i umiesz się uspokoić oddechem.'),plan:T('Jeśli gmina ogłosi ostrzeżenie hydrologiczne, to sprawdzam piwnicę i wynoszę dokumenty na piętro.','Jeśli się boję, to oddycham jak na gorącą zupę.')}); break;
 case 2: D.push({type:'talk',npc:'ania',x:-20,z:14,auto:true,lines:[{npc:'ania',text:T('Alarm chemiczny w fabryce. Ty w pracy, ja na zakupach, Zosia w szkole. Gdzie się spotkamy? Ustalmy to TERAZ, a nie w panice.','Jak zgubimy się w kryzysie, gdzie się spotkamy? Ustalmy to razem!'),choice:[{t:T('Dwa miejsca: A – plac sąsiedzki, B – dom cioci w Gliwicach.','Dwa miejsca: plac z ławkami i dom babci.'),ok:true,why:'Miejsce A blisko domu (pożar), B poza okolicą (ewakuacja).'},{t:T('Po prostu do siebie zadzwonimy.','Zadzwonię do mamy.'),ok:false,why:'Sieci komórkowe zapychają się w pierwszych minutach. Dlatego plan łączności ma cztery poziomy: podstawowy (telefon), zapasowy (SMS), awaryjny (radio) i ostateczny (umówione miejsce). Ostatni działa bez prądu i bez zasięgu.'}]},
   {npc:'zosia',text:'A jak ktoś obcy powie, że mama go przysłała po mnie?',choice:[{t:T('Ustalamy HASŁO BEZPIECZEŃSTWA. Bez hasła nie idziesz z nikim.','Mamy tajne hasło rodzinne! Bez hasła nie idziesz z nikim.'),ok:true,why:'Hasło bezpieczeństwa to stały punkt rodzinnego planu awaryjnego. Ustalcie jedno słowo, powtórzcie je dziecku i nie zmieniajcie bez potrzeby. Nikt bez hasła – nawet znajomy.'},{t:T('Zosia jest mądra, pozna po człowieku.','Idziesz, jeśli jest miły.'),ok:false,why:'Dzieci są celem manipulacji. Hasło to prosta, sprawdzalna reguła.'}]},
   {npc:'dziadek',text:'Kto co robi, gdy padnie komenda? Przydziel role.',choice:[{t:T('Ania – apteczka i leki, ja – dokumenty i zakręcenie mediów (gaz, woda, prąd), Zosia – Burek i pudełko z zabawkami, dziadek – radio i kontakt z ciocią.','Mama – apteczka, tata – dokumenty, ja – Burek i pudełko z zabawkami, dziadek – radio.'),ok:true,why:T('Każdy ma rolę – nikt nie jest bezradny. Dziecko z zadaniem panikuje mniej.','Dziecko z zadaniem czuje się silne!')},{t:T('Ja zrobię wszystko, reszta niech się nie stresuje.','Dorośli zrobią wszystko.'),ok:false,why:'Bezradność potęguje panikę. Nadaj rolę nawet 8-latce.'}]}]});
  D.push({type:'goto',x:-20,z:30,r:4,obj:T('Sprawdź fizycznie miejsce zbiórki A (plac sąsiedzki)','Idź na miejsce zbiórki A – plac z ławkami'),action:'To nasze miejsce A',msg:T('Zapisz je na karcie w portfelu i w plecaku Zosi.','Zapamiętane! Tu się spotykamy.')});
  D.push({type:'panel',run:()=>quizPanel(ch.quiz.slice(0,3),null,()=>nextStep())});
  D.push({type:'end',summary:T('Plan zapisany: 2 miejsca, hasło, role, łącznik poza miastem.','Macie plan: 2 miejsca, hasło i role!'),plan:T('Jeśli usłyszymy syrenę i nie ma telefonu, to każdy idzie do miejsca A i wysyła SMS „JESTEM BEZPIECZNY”.','Jeśli się zgubimy, to idę na plac z ławkami.')}); break;
 case 3: D.push({type:'talk',npc:'ania',x:45,z:7,auto:true,lines:[{npc:'ania',text:T('Prognoza: nawałnica i możliwy blackout od jutra. Sklep zaraz będzie oblegany. Masz 45 sekund – priorytety z książki: woda → światło i ciepło → żywność → apteczka → komunikacja.','Idziemy po zapasy! Wybierz mądre rzeczy. Masz 45 sekund.')}]});
  D.push({type:'panel',run:()=>calcPanel({rule:T('Licz 3 litry wody na osobę na dobę: picie i gotowanie razem.','Na jeden dzień potrzebujesz 3 litry wody.'),
    question:T('Nowakowie to 4 osoby. Ile litrów wody musicie mieć na 3 dni?','Ile litrów wody potrzeba na jeden dzień dla 3 osób?'),
    unit:'litrów', answer:KIDS?9:36, tol:0,
    hint:T('Pomnóż: liczba osób × liczba dni × 3 litry.','Pomnóż: 3 osoby × 3 litry.'),
    solution:T('4 osoby × 3 dni × 3 l = 36 litrów, czyli sześć baniaków po 6 litrów. Na tydzień potrzeba już 84 litrów.','3 osoby × 3 litry = 9 litrów, czyli sześć dużych butelek.')},()=>nextStep())});
  D.push({type:'panel',run:()=>packPanel({intro:T('Zestaw na 72 h dla 4 osób i psa.','Wybierz to, co powinno być w zapasach.'),time:45,tip:'Priorytety: woda i uzdatnianie, światło i ciepło, żywność, apteczka, komunikacja. Paliwo max 60 l.',good:['💧 Woda 3,8 l/os./dzień','🥫 Konserwy','🥫 Otwieracz do puszek','🔦 Latarka czołowa','🔋 Baterie','🩹 Apteczka','📻 Radio na korbkę','🔌 Powerbank','🐕 Karma 7 dni','🍯 Miód, suszone owoce','🧻 Papier (2 rolki/os./tydz.)','💊 Leki dziadka na 7 dni'],bad:['🍦 Lody','📺 Telewizor','🥛 Świeże mleko','🎮 Konsola','🌹 Perfumy','⛽ 200 l benzyny']},()=>nextStep())});
  D.push({type:'panel',run:()=>budgetPanel(()=>nextStep())});
  D.push({type:'goto',...at(-6,2),r:3.5,obj:T('Zanieś zapasy do domu i oznacz pudełka kolorami','Zanieś zapasy do domu'),action:'Oznaczam pudełka',msg:T('Zielony – spożywcze, czerwony – apteczka, niebieski – higiena, żółty – energia. Daty na opakowaniach, FIFO co 3–6 miesięcy.','Zielone – jedzenie, czerwone – apteczka, niebieskie – mydło, żółte – baterie!')});
  D.push({type:'panel',run:()=>fifoPanel(()=>nextStep())});
  D.push({type:'end',summary:T('Umiesz policzyć zapas, zmieścić się w budżecie i rotować produkty. To trzy rzeczy, na których wykłada się większość domowych spiżarni.','Spiżarnia superbohatera gotowa!'),plan:T('Jeśli robię cotygodniowe zakupy, to dokładam jeden element zestawu awaryjnego.','Jeśli mama idzie do sklepu, to przypominam o jednej rzeczy do zapasów.')}); break;
 case 4: D.push({type:'talk',npc:'marek',...at(6,8),auto:true,lines:[{npc:'marek',text:T('W stresie pamięć mięśniowa zawodzi. Zrób mapę mediów: zawór gazu (żółty), wody (niebieski), wyłącznik prądu (czerwony). I sprawdź czujniki.','Zróbmy „obchód twierdzy”: znajdź czujnik dymu, gaśnicę, zawór gazu i wyłącznik prądu.')}]});
  D.push({type:'collect',obj:T('Obchód twierdzy: punkty odcięcia mediów i sprzęt ppoż.','Obchód twierdzy: znajdź 5 ważnych rzeczy'),items:[{name:'🟡 Zawór gazu (klucz przy zaworze)',...at(7,-2),good:true,why:'żółty na mapie'},{name:'🔴 Wyłącznik prądu („w dół = wyłączone”)',...at(-7,-2),good:true,why:'czerwony na mapie'},{name:'🔵 Zawór wody',...at(-7,4),good:true,why:'niebieski na mapie'},{name:'🚨 Czujnik dymu i czadu',...at(0,-6),good:true,why:'ratuje życie'},{name:'🧯 Gaśnica proszkowa 4 kg',...at(7,4),good:true,why:'widoczne miejsce'},{name:'🕯️ Świeca pod firanką',...at(3,14),good:false,why:'źródło pożaru – zabierz stąd'},{name:'⛽ Kanister w salonie',...at(-3,14),good:false,why:'paliwo tylko w atestowanych bańkach, poza mieszkaniem'}]});
  D.push({type:'talk',npc:'zosia',...at(0,8),auto:true,lines:[{npc:'zosia',text:'Ćwiczenie „pożar nocą”! Jak wychodzimy?',choice:[{t:'Nisko przy podłodze, chusteczka na twarz, nie otwieramy gorących drzwi, spotykamy się w miejscu A.',ok:true,why:'Gorące gazy zbierają się pod sufitem. Ćwiczcie z zasłoniętymi oczami – dym = zero widoczności.'},{t:'Biegiem po rzeczy i dokumenty na piętro.',ok:false,why:'Nie wracaj po przedmioty. Najpierw ludzie.'}]}]});
  D.push({type:'end',summary:T('Mapa mediów wisi na lodówce. Kwartalnie test czujników, co pół roku zapasy, raz w roku ewakuacja.','Twierdza sprawdzona!'),plan:T('Jeśli poczuję gaz, to otwieram okna, zakręcam żółty zawór i wychodzę.','Jeśli czujnik piszczy, to wychodzę nisko przy podłodze.')}); break;
 case 5: D.push({type:'talk',npc:'ania',x:62,z:-8,auto:true,lines:[{npc:'ania',text:T('Bankomat nie działa, terminal też. „Płatność tylko gotówką”. Za nami narasta kolejka. Co robisz?','Bankomat i karty nie działają! Co robimy?'),choice:[{t:T('Płacę z koperty awaryjnej – małe nominały, 1–2 tygodnie kosztów życia.','Mamy gotówkę w kopercie na czarną godzinę!'),ok:true,why:'Rezerwa w nominałach 10–50 zł, w dwóch miejscach.',calm:5},{t:T('Krzyczę na kasjerkę, że to skandal.','Płaczę i krzyczę.'),ok:false,why:'Oddziel decyzje logiczne od emocjonalnych.',calm:-12},{t:T('Biorę szybką chwilówkę online.','Pożyczam od obcego.'),ok:false,why:'Nie zaciągaj pożyczek konsumpcyjnych w kryzysie.'}]},
   {npc:'dziadek',text:T('A dokumenty? Po pożarze u Kowalskich całe „papierowe życie” zniknęło.','Gdzie są nasze ważne papiery?'),choice:[{t:'3 kopie: oryginały w wodoodpornej teczce, skany na szyfrowanym pendrivie, kopia w chmurze z 2FA.',ok:true,why:'Zasada 3-2-1 z aneksu „Cyfrowa twierdza”.'},{t:'W szufladzie, jak zawsze.',ok:false,why:'Ogień i woda nie pytają o szufladę.'}]}]});
  D.push({type:'panel',run:()=>calcPanel(KIDS
    ?{rule:'W kryzysie liczymy pieniądze na spokojnie, zanim wejdziemy do sklepu.',question:'Masz 20 zł. Chleb kosztuje 5 zł, woda 3 zł, baterie 9 zł. Ile złotych ci zostanie?',unit:'zł',answer:3,tol:0,hint:'Najpierw dodaj ceny, potem odejmij od 20.',solution:'5 + 3 + 9 = 17 zł, a 20 − 17 = 3 zł. Zostaną 3 zł na zapas.'}
    :{rule:'Rezerwa gotówkowa to koszty życia na 1–2 tygodnie, w nominałach 10–50 zł, w dwóch miejscach.',question:'Wasze tygodniowe koszty życia to 900 zł. Ile złotych trzymać w kopercie awaryjnej jako minimum?',unit:'zł',answer:900,tol:0,hint:'Minimum to koszty jednego tygodnia, wariant bezpieczniejszy to dwa tygodnie.',solution:'900 zł to dolna granica, 1800 zł to wariant na dwa tygodnie. Nie trzymaj tego w jednym miejscu ani w jednym nominale.'},()=>nextStep())});
  D.push({type:'panel',run:()=>packPanel({intro:T('Skompletuj finansowy zestaw awaryjny.','Co pomaga, gdy karty nie działają?'),time:40,tip:'Gotówka w małych nominałach, dokumenty w 3 kopiach, dywersyfikacja.',good:['💵 Gotówka w małych nominałach','💶 Trochę euro/dolarów','💳 Karta prepaid','📁 Dokumenty w wodoodpornej kopercie','🔐 Szyfrowany pendrive','📸 Zdjęcia mienia','☁️ Kopia w chmurze z 2FA','📝 Lista kont dla zaufanej osoby'],bad:['🛏️ Wszystkie oszczędności pod łóżkiem','🏦 Jedna karta w jednym banku','🗒️ Hasła na kartce przy komputerze','🛍️ Nowy kredyt na zakupy']},()=>nextStep())});
  D.push({type:'end',summary:T('Gotówka, prepaid, 3 kopie dokumentów, fundusz na 3 miesiące w planie.','Skarbonka na czarną godzinę gotowa!'),plan:T('Jeśli dostaję wypłatę, to 10% idzie automatycznie na fundusz awaryjny.','Jeśli dostanę kieszonkowe, to część idzie do skarbonki.')}); break;
 case 6: D.push({type:'talk',npc:'strazak',x:0,z:-69,auto:true,lines:[{npc:'strazak',text:T('Sobota, cisza – i nagle syrena. Większość ludzi zamiera albo dzwoni do wszystkich. Ty masz rozpoznać sygnał w 10 sekund i działać według planu. Panika bywa groźniejsza niż sam kryzys.','Syrena to „dźwięk ochrony”. Nie straszy – ostrzega. Naucz się, co mówi.')}]});
  D.push({type:'panel',run:()=>sirenPanel(()=>nextStep())});
  D.push({type:'talk',npc:'zosia',x:0,z:-69,auto:true,lines:[{npc:'zosia',text:'Słyszę alarm! Co robimy?',choice:[{t:T('Bez paniki: radio na baterie, Alert RCB, pokój schronienia, fraza „jestem przygotowany”.','Idę do dorosłego, słuchamy radia, idziemy do bezpiecznego pokoju.'),ok:true,why:'Działanie według planu + technika oddechowa.'},{t:T('Wybiegam na ulicę zobaczyć, co się dzieje.','Wybiegam na ulicę!'),ok:false,why:'Odłamki szkła lecą daleko. Najpierw schronienie, potem informacja.',calm:-10},{t:T('Wrzucam na Facebooka „PANIKA, uciekajcie!”.','Dzwonię do wszystkich kolegów.'),ok:false,why:'Lawina paniki i fałszywych alarmów. Weryfikuj na rcb.gov.pl.'}]}]});
  D.push({type:'end',summary:T('Falujący przez 3 minuty ZACZYNA zagrożenie – chowasz się. Równy przez 3 minuty je KOŃCZY – można wyjść. Krótkie przerywane to test w pierwszy poniedziałek miesiąca.','Znasz dźwięki ochrony: falujący – chowaj się, równy – już bezpiecznie!'),plan:T('Jeśli słyszę syrenę modulowaną, to włączam radio, sprawdzam RCB i idę do pokoju schronienia.','Jeśli słyszę syrenę, to idę do dorosłego i słucham.')}); break;
 case 7: D.push({type:'dusk'}); D.push({type:'talk',npc:'strazak',x:0,z:33,auto:true,lines:[{npc:'strazak',text:T('Pukam o 2 w nocy: wał przerwany, za godzinę woda zaleje osiedle. Zgierz 2018: ludzie pakowali się dopiero, gdy zadzwoniła córka z Warszawy. Służby przyszły 3 godziny później.','Uwaga: woda może zalać osiedle za godzinę. Trzeba zdecydować: zostajemy czy wychodzimy?')}]});
  D.push({type:'panel',run:()=>{ const sc=KIDS?[{s:'W domu pali się kuchnia i jest dużo dymu.',a:'go',why:'Ogień w domu = wychodzimy natychmiast.'},{s:'Wieje bardzo mocny wiatr, ale dom jest cały i mamy zapasy.',a:'stay',why:'Dom bezpieczny + zapasy = zostajemy w pokoju bez okien.'},{s:'Policjant mówi, że za godzinę woda zaleje osiedle.',a:'go',why:'Ostrzeżenie o powodzi = plecak i wychodzimy według planu.'},{s:'Zgasło światło w mieście, mamy latarki, wodę i jedzenie.',a:'stay',why:'Blackout z zapasami = zostajemy.'}]:[{s:'Wyciek toksycznej substancji, ewakuacja w promieniu 5 km. Mieszkasz 2 km od zakładu.',a:'go',why:'Zagrożenie w twojej strefie – natychmiast, pod wiatr, maska FFP3.'},{s:'Wichura, drogi zablokowane przez drzewa. Dom bez uszkodzeń, zapasy na tydzień.',a:'stay',why:'Ewakuacja zwiększa ryzyko – shelter-in-place.'},{s:'Wał przerwany, za godzinę woda. Auto z ½ baku, plecaki gotowe.',a:'go',why:'Zagrożenie strukturze domu – ewakuacja planowa.'},{s:'Blackout od 6 h zimą. Piecyk z czujnikiem CO, woda, jedzenie, brak komunikatów.',a:'stay',why:'Brak nakazu + zasoby = zostajesz.'},{s:'Ostrzał w mieście, syreny. Jesteś w bloku z piwnicą.',a:'stay',why:'Ewakuacja pod ostrzałem zwiększa ryzyko – piwnica, dwie ściany.'},{s:'Pożar lasu idzie na dom, dym już w ogrodzie.',a:'go',why:'Wyjście natychmiastowe, prostopadle do wiatru.'}]; let i=0; const step=()=>{ if(i>=sc.length){ nextStep(); return; } const c=sc[i]; open(head(m)+'<p class="small">Scenariusz '+(i+1)+'/'+sc.length+' – drzewo decyzyjne „zostaję czy uciekam”.</p><div class="msg"><b>'+c.s+'</b></div><div class="navbtns" style="justify-content:center"><button class="btn primary" data-a="stay">🏠 Zostaję</button><button class="btn primary" data-a="go">🎒 Ewakuuję się</button></div><div id="why"></div>'); pbox.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{ const c2=b.dataset.a===c.a; quest.total++; if(c2){quest.ok++;beep(880,.1);} else { bad(); updateCalm(-5);} $('#why').innerHTML='<div class="msg '+(c2?'good':'badm')+'">'+(c2?'✅ ':'❌ ')+c.why+'</div>'; pbox.querySelectorAll('[data-a]').forEach(x=>x.disabled=true); setTimeout(()=>{i++;step();},2000); }); }; step(); }});
  D.push({type:'talk',npc:'ania',x:0,z:33,auto:true,lines:[{npc:'ania',text:T('Jedziemy do cioci. Którą trasą? Główna droga prowadzi przez most.','Którą drogą jedziemy do babci?'),choice:[{t:T('Alternatywną przez wzgórza – omijam most i dolinę, mam papierową mapę.','Górą, z dala od rzeki – mam mapę!'),ok:true,why:'Główna trasa + 2 alternatywne. Omijaj mosty, wiadukty, doliny. Papierowa mapa, bo bez prądu Google Maps nie pomoże.'},{t:'Mostem, bo najszybciej.',ok:false,why:'Most może być zamknięty lub podmyty. Nie wjeżdżaj na zalane drogi.'}]}]});
  D.push({type:'night',on:false});
  D.push({type:'end',summary:T('Decyzja na czas, trasa bez mostu, kartka na drzwiach: „Ewakuowano 4 osoby + pies, kierunek Gliwice”.','Wiesz, kiedy zostać, a kiedy wyjść!'),plan:T('Jeśli służby ogłaszają ewakuację, to nie czekam biernie: szykuję torby, planuję wyjście, przygotowuję dzieci.','Jeśli dorośli mówią „wychodzimy”, to biorę plecak i Burka.')}); break;
 case 8: D.push({type:'talk',npc:'krysia',x:-20,z:-55,auto:true,lines:[{npc:'krysia',text:T('Radio mówi: „nie wychodź, zamknij okna, wyłącz wentylację” – skażenie po pożarze składowiska. Jestem sama w bloku. Który pokój? Co zabrać?','W radiu mówią: zostańcie w domu, zamknijcie okna. Pomóż mi wybrać bezpieczny pokój!')}]});
  D.push({type:'panel',run:()=>{ const rooms=[{n:'🛋️ Salon z dużymi oknami na ulicę',ok:false,why:'Okna = odłamki i skażenie.'},{n:'🛁 Łazienka bez okien w środku mieszkania',ok:true,why:'Bez okien, centrum, grube ściany.'},{n:'🌤️ Balkon',ok:false,why:'Na zewnątrz.'},{n:'🪜 Piwnica bloku (2 ściany nośne, wyjście zapasowe)',ok:true,why:'Zasada dwóch ścian.'},{n:'🛏️ Sypialnia na ostatnim piętrze przy oknie',ok:false,why:'Wysoko, przy oknie.'}].sort(()=>Math.random()-.5); let picked=new Set(); open(head(m)+'<p>'+T('Zaznacz pomieszczenia spełniające kryteria: bez okien, środek budynku, zasada dwóch ścian.','Wybierz najbezpieczniejsze miejsca na bazę.')+'</p><ul class="ord" id="rooms">'+rooms.map((r,i)=>'<li data-i="'+i+'"><span class="n">?</span>'+r.n+'</li>').join('')+'</ul><div class="navbtns" style="justify-content:flex-end"><button class="btn primary" id="ok">✅ Wybieram</button></div>'); pbox.querySelectorAll('#rooms li').forEach(li=>li.onclick=()=>{ const i=+li.dataset.i; if(picked.has(i)){picked.delete(i);li.classList.remove('sel');} else {picked.add(i);li.classList.add('sel');} }); $('#ok').onclick=()=>{ let ok=0,wrong=0; rooms.forEach((r,i)=>{ const li=pbox.querySelector('#rooms li[data-i="'+i+'"]'); li.querySelector('.n').textContent=r.ok?'✓':'✗'; li.style.borderColor=r.ok?'var(--ok)':'var(--bad)'; li.innerHTML+='<span class="small" style="margin-left:auto">'+r.why+'</span>'; if(r.ok&&picked.has(i)) ok++; if(!r.ok&&picked.has(i)) wrong++; }); quest.total+=2; quest.ok+=Math.max(0,ok-wrong); setTimeout(()=>{ if(ok>=1&&wrong<=1) nextStep(); else failStep('Kryteria: bez okien, środek budynku, minimum dwie ściany nośne.'); },2300); }; }});
  D.push({type:'collect',obj:T('Zanieś do pokoju schronienia zestaw na 48 h','Zbuduj bazę: zbierz rzeczy do bezpiecznego pokoju'),items:[{name:'🧣 Koce i materac',x:-26,z:-52,good:true},{name:'💧 Woda i jedzenie na 48 h',x:-14,z:-52,good:true},{name:'📻 Radio + latarka + baterie',x:-26,z:-46,good:true},{name:'🩹 Apteczka i leki',x:-14,z:-46,good:true},{name:'🎨 Kredki, gra, dziennik',x:-20,z:-44,good:true,why:T('rytuały i zajęcie obniżają stres','żeby nie było nudno!')},{name:'🌀 Klimatyzacja WŁĄCZ',x:-30,z:-49,good:false,why:'przy skażeniu wyłącz wentylację i uszczelnij okna taśmą'},{name:'📱 Telefon przy oknie',x:-10,z:-49,good:false,why:'z dala od okien; oszczędzaj baterię'}]});
  D.push({type:'panel',run:()=>breathPanel(()=>nextStep())});
  D.push({type:'end',summary:T('Pokój bezpieczeństwa gotowy, okna uszczelnione, dzień liczony w godzinach. Zosia jest „Strażnikiem światła”.','Baza gotowa! Jesteś Strażnikiem Światła.'),plan:T('Jeśli komunikat mówi „zostań w domu”, to idę do łazienki, wyłączam wentylację i uszczelniam drzwi taśmą.','Jeśli mamy zostać w domu, to budujemy bazę w pokoju bez okien.')}); break;
 case 9: D.push({type:'talk',npc:'marek',x:-75,z:-4,auto:true,lines:[{npc:'marek',text:T('Stacja padła. Prąd nie wróci przez kilka dni: nie ma hydroforu, ogrzewania, sieci. Idzie noc. Bierz latarkę – zbierzemy wodę i zorganizujemy dom.','Zgasło światło w całym mieście! Weź latarkę – idziemy po wodę i światło.')}]});
  D.push({type:'night',on:true});
  D.push({type:'collect',obj:T('Noc bez prądu: zbierz źródła wody i światła (latarka pokazuje drogę)','Noc bez prądu: znajdź wodę i światło z latarką'),items:[{name:'🌧️ Deszczówka z rynny',x:-30,z:-20,good:true,why:'techniczna; do picia po przegotowaniu'},{name:'🏺 Studnia u Kowalskich',x:-58,z:-20,good:true,why:'przegotuj 5 min'},{name:'🔦 Latarka + butelka = lampa',x:-20,z:-18,good:true,why:'latarka butelkowa rozprasza światło'},{name:'🪵 Drewno na kuchenkę rakietową',x:-45,z:-5,good:true,why:'1,5 kg na 3 posiłki dla 2 osób'},{name:'⚙️ Generator w salonie',x:-24,z:-10,good:false,why:'tlenek węgla zabija – tylko na zewnątrz!'},{name:'🕯️ Świece w całym domu bez nadzoru',x:-10,z:-15,good:false,why:'tylko pod nadzorem'}]});
  D.push({type:'panel',run:()=>orderPanel(T('Woda z rynny i studni: ułóż procedurę uzdatniania.','Co robimy z wodą z nieznanego miejsca? Ułóż po kolei.'),['Zbierz wodę','Odstaw, aby osady opadły','Przefiltruj: tkanina → węgiel → piasek → żwir','Gotuj min. 5 minut lub tabletka (chlor/jod)','Przelej do pojemnika „pitna”'],'Po filtracji ZAWSZE gotuj lub tabletka.',()=>nextStep())});
  D.push({type:'panel',run:()=>calcPanel({rule:T('Na trzy posiłki dziennie dla 2 osób zużyjesz około 1,5 kg drewna.','Na gotowanie dla 2 osób na jeden dzień trzeba około 1,5 kg drewna.'),
    question:T('Ile kilogramów drewna przygotować na 3 dni gotowania dla 4 osób?','Ile kilogramów drewna trzeba na 2 dni dla 2 osób?'),
    unit:'kg', answer:KIDS?3:9, tol:0,
    hint:T('Najpierw policz jeden dzień dla 4 osób, czyli dwa razy tyle co dla 2. Potem pomnóż przez liczbę dni.','1,5 kg na jeden dzień, więc na dwa dni dwa razy tyle.'),
    solution:T('1,5 kg × 2 (bo osób jest dwa razy więcej) = 3 kg dziennie, × 3 dni = 9 kg. Drewno trzymaj pod dachem, mokre nie da rady zagotować wody.','1,5 kg × 2 dni = 3 kg.')},()=>nextStep())});
  D.push({type:'panel',run:()=>sosPanel(()=>nextStep())});
  D.push({type:'night',on:false});
  D.push({type:'end',summary:T('Dom działa w blokach: rano woda i gotowanie, wieczorem czerwone światło i planszówki. SOS nadany poprawnie.','Poradziliście sobie jak na biwaku, a SOS nadany!'),plan:T('Jeśli prąd nie wraca po 2 godzinach, to przełączam dom na tryb blackout: woda, światło, kuchenka na zewnątrz, generator nigdy w domu.','Jeśli nie ma prądu, to robię latarkę butelkową i gramy w planszówki.')}); break;
 case 10: D.push({type:'talk',npc:'strazak',x:-52,z:-50,auto:true,lines:[{npc:'strazak',text:T('Nikt nie chce tego rozdziału. Ale w 2022 nasi sąsiedzi obudzili się w innym świecie w jeden poranek. Cywil przeżywa dzięki nawykom: „padnij i osłoń się”, zasada dwóch ścian, 5–15 sekund reakcji.','Czasem jest bardzo głośno – jak przy burzy. Wtedy robimy „żółwia”: kładziemy się na boku i chowamy głowę w ręce. Poćwiczmy jak zabawę!')}]});
  D.push({type:'drop'});
  D.push({type:'talk',npc:'zosia',x:-52,z:-50,auto:true,lines:[{npc:'zosia',text:'Znalazłam na ulicy fajną zabawkę i jakiś telefon!',choice:[{t:T('Nie dotykaj! Oznaczamy miejsce taśmą i zgłaszamy służbom.','Nie dotykaj! Mówimy dorosłemu.'),ok:true,why:T('Ukraina 2022: „Zamienili zabawkę mojego syna w pułapkę”. Nigdy nie dotykaj porzuconego sprzętu, paczek, telefonów.','Dziwne rzeczy na ulicy mogą być niebezpieczne. Zawsze mów dorosłemu.')},{t:'Weź, zobaczymy w domu.',ok:false,why:'Porzucone przedmioty mogą być pułapką.',calm:-10}]}].concat(KIDS?[]:[{npc:'dziadek',text:'Kontrola wojskowa na drodze. Jak się zachować?',choice:[{t:'Neutralnie: dokumenty w przezroczystej koszulce, krótkie spokojne odpowiedzi, bez emocji.',ok:true,why:'Nie patrz wyzywająco, nie spuszczaj wzroku, nie grzeb w plecaku bez pytania.'},{t:'Filmuję ich telefonem, żeby mieć dowód.',ok:false,why:'Nie wychylaj się, nie prowokuj. Dokumentuj dyskretnie.'}]}])});
  D.push({type:'end',summary:T('Nawyk „padnij i osłoń się” w budowie. Zawsze działaj tak, jakbyś miał wrócić do swojego życia po wojnie.','Umiesz robić „żółwia” i wiesz, że dziwnych rzeczy nie dotykamy.'),plan:T('Jeśli słyszę huk, to padam, osłaniam głowę i liczę do 10, zanim się ruszę.','Jeśli jest wielki huk, to robię żółwia.')}); break;
 case 11: D.push({type:'rain',on:true}); D.push({type:'flood'}); D.push({type:'rain',on:false});
  D.push({type:'talk',npc:'dziadek',x:-60,z:-58,auto:true,lines:[{npc:'dziadek',text:T('Zdążyliśmy. Bogatynia 2010: „Zabraliśmy tylko dzieci i dokumenty. Po godzinie nie było już nic”. Woda opada – wracamy?','Udało się! Woda opada. Wracamy do domu?'),choice:[{t:T('Nie, dopóki władze nie potwierdzą. Dom wymaga oceny technicznej – pleśń, zawalenie, prąd.','Nie, czekamy, aż dorośli i strażacy sprawdzą dom.'),ok:true,why:'Opole 1997: „Po dwóch tygodniach dom zaczął się rozpadać od środka”.'},{t:T('Tak, sprawdzę piwnicę.','Tak, chcę zobaczyć!'),ok:false,why:'Nie wchodź do domu bez oceny technicznej. 15 cm wody porywa dorosłego.'}]}]});
  D.push({type:'end',summary:T('Ewakuacja na wzgórze zaliczona. 15 cm wody porywa, nie przejeżdżaj zalanych dróg, powrót po ocenie.','Uciekłeś przed wodą na wzgórze!'),plan:T('Jeśli IMGW ogłasza stan alarmowy, to worki, odłączenie prądu i dokumenty w workach strunowych.','Jeśli woda się podnosi, to biegnę na górkę, nie do wody.')}); break;
 case 12: D.push({type:'goto',x:38,z:52,r:4,obj:T('Po burzy: ktoś leży w parku pod gałęzią. Podejdź bezpiecznie.','Ktoś się przewrócił w parku. Podejdź!'),action:'Sprawdzam bezpieczeństwo i podchodzę',msg:T('Bez wiszących przewodów. Wołasz o pomoc, dzwonisz 112, zaczynasz ABCDE.','Wołasz dorosłego i dzwonisz 112: kto, gdzie, co się stało.')});
  D.push({type:'panel',run:()=>orderPanel(T('Ułóż algorytm ABCDE.','Ułóż po kolei, co robisz.'),KIDS?['Sprawdź, czy bezpiecznie, zawołaj dorosłego','Zadzwoń 112: kto, gdzie, co','Przyciśnij ranę czystą szmatką','Przykryj kocem','Zostań, aż przyjedzie pomoc']:['A – Airway: udrożnij drogi oddechowe','B – Breathing: sprawdź oddech (10 s)','C – Circulation: zatamuj krwotok, tętno','D – Disability: świadomość, źrenice','E – Exposure: obejrzyj ciało, folia NRC'],'Ratuj życie, nie diagnozuj.',()=>nextStep())});
  D.push({type:'panel',run:()=>rkoPanel(bpm=>{ toast('Tempo: '+bpm+'/min'); nextStep(); })});
  D.push({type:'talk',npc:'ratownik',x:38,z:52,auto:true,lines:[{npc:'ratownik',text:T('Krwawi z przedramienia, jasna pulsująca krew. Nie masz opatrunku.','Rana na ręce krwawi. Nie masz bandaża. Co robisz?'),choice:[{t:T('Ucisk bezpośredni czystą koszulką; jeśli masywny – opaska z paska, zapisuję godzinę.','Przyciskam czystą szmatką i wołam pomoc.'),ok:true,why:'Krwotok tętniczy: ucisk → opatrunek uciskowy → staza (zapisz godzinę!). NIE taśma izolacyjna. Podpaski to świetny materiał chłonny.'},{t:T('Taśma izolacyjna mocno wokół ręki.','Zawiązuję sznurek bardzo mocno.'),ok:false,why:'Taśma przecina skórę. Zamiast stazy: pas, szalik – i zapisz godzinę.'}]}]});
  D.push({type:'end',summary:T('ABCDE, RKO 30:2 w tempie 100–120, tamowanie krwotoku. Zapisz się na prawdziwy kurs.','Jesteś Małym Ratownikiem!'),plan:T('Jeśli ktoś nie oddycha, to 30 uciśnięć i 2 wdechy, aż przyjadą służby.','Jeśli ktoś jest ranny, to wołam dorosłego i dzwonię 112.')}); break;
 case 13: D.push({type:'talk',npc:'ratownik',x:62,z:29,auto:true,lines:[{npc:'ratownik',text:T('Dzień dziesiąty bez wody w kranie. Zosia ma gorączkę, dziadek kończy leki. Adrenalina minęła – teraz liczy się rutyna i higiena.','Dziesiąty dzień bez wody w kranie. Trzeba dbać o czyste ręce i dobry humor!')}]});
  D.push({type:'panel',run:()=>calcPanel(KIDS
    ?{rule:'Lekarstwa liczymy w dniach, nie w butelkach.',question:'Jedna butelka syropu wystarcza na 5 dni. Ile butelek trzeba na 15 dni?',unit:'butelki',answer:3,tol:0,hint:'Podziel 15 dni przez 5 dni z jednej butelki.',solution:'15 ÷ 5 = 3 butelki. Tak samo liczy się zapas dla całej rodziny.'}
    :{rule:'Zapas leków liczymy w dniach terapii, nigdy w opakowaniach.',question:'Dziadek bierze 2 tabletki dziennie, w opakowaniu jest 30 tabletek. Na ile dni starczą 3 opakowania?',unit:'dni',answer:45,tol:0,hint:'Policz najpierw wszystkie tabletki, potem podziel przez dawkę dobową.',solution:'3 × 30 = 90 tabletek, 90 ÷ 2 = 45 dni. Przy chorobie przewlekłej celuj w 90 dni i pilnuj dat ważności.'},()=>nextStep())});
  D.push({type:'panel',run:()=>packPanel({intro:T('Wybierz działania zgodne z zasadami zdrowia w długim kryzysie.','Co pomaga być zdrowym?'),time:40,tip:'Przegotowana woda, osobne pojemniki, leki tylko z lekarzem, izolacja chorego.',good:['🫧 Mydło i żel','💧 Przegotowana woda do picia','🪣 Pojemniki: pitna / techniczna','🌡️ Termometr i notatnik zdrowia','📋 Wydrukowana lista leków','🎗️ Kolorowa taśma – rzeczy chorego','🧹 Toaleta sucha','🎭 Teatr cieni – zabawa bez prądu','🏃 Pajacyki i rozciąganie'],bad:['🥤 Woda z kałuży','🍺 Alkohol na stres','💊 Leki „na zapas” bez lekarza','🥛 Wspólny kubek z chorym','📵 Cały dzień w wiadomościach']},()=>nextStep())});
  D.push({type:'talk',npc:'zosia',x:62,z:29,auto:true,lines:[{npc:'zosia',text:T('Nie chcę nic mówić. Chcę tylko siedzieć.','Jest mi smutno i nie chcę się bawić.'),choice:[{t:T('Siadam obok w ciszy. Potem proponuję wspólne rysowanie zwierząt.','Siadam obok i rysujemy razem zwierzaki.'),ok:true,why:'Bucza 2022: „Dziecko nie mówiło przez tydzień. Dopiero kiedy zaczęliśmy rysować razem zwierzęta, zaczęła mówić”. Cisza jako przestrzeń bezpieczeństwa – nie każ mówić, bądź.'},{t:T('„Nie ma czasu na fochy, wszyscy mają ciężko”.','„Nie marudź”.'),ok:false,why:'Regres i wycofanie to objawy stresu, nie fochy. Rytm dnia, przytulenie, bezpieczna przestrzeń.',calm:-8}]}]});
  D.push({type:'end',summary:T('Rutyna, higiena punktowa, 2–3 l wody na osobę, rozpoznane objawy stresu u dziecka.','Czyste ręce i dobry humor – misja zaliczona!'),plan:T('Jeśli kryzys trwa dłużej niż 3 dni, to wprowadzam stały rytm dnia i godzinę ciszy informacyjnej.','Jeśli komuś jest smutno, to siadam obok i rysujemy.')}); break;
 case 14: D.push({type:'talk',npc:'ania',x:72,z:40,auto:true,lines:[{npc:'ania',text:T('Telefon eksploduje: „samolot z chemikaliami”, „skażona woda”, „ostrzelają przedszkola”. Zanim cokolwiek podasz dalej – SWIAT: Sprawdź źródło, Wyszukaj, Ile osób udostępnia, Autor, Treść.','W internecie ktoś pisze nieprawdę, żeby straszyć. Łowca fake newsów zawsze sprawdza: kto, kiedy i czy inni też o tym mówią.')}]});
  D.push({type:'panel',run:()=>fakePanel(KIDS?[{t:'UWAGA!!! WODA W KRANACH ZATRUTA!!! PODAJ DALEJ!!! (bez podpisu)',f:true,why:'Wielkie litery, wykrzykniki, „podaj dalej”, brak źródła.'},{t:'Alert RCB: Dziś od 18:00 silne burze i grad. Zabezpiecz rzeczy na balkonie.',f:false,why:'Oficjalne źródło, konkret, bez straszenia.'},{t:'Kolega: „Wujek mówił, że jutro nie ma szkoły, bo będzie wojna!!”',f:true,why:'Plotka bez źródła. Sprawdź u dorosłych.'},{t:'Straż Pożarna (oficjalny profil): Test syren w poniedziałek o 12:00.',f:false,why:'Oficjalne konto, zapowiedź testu.'},{t:'Film „na żywo”: „Tama pękła!” – w rogu data sprzed 3 lat i inny kraj.',f:true,why:'Stare nagranie udaje nowe. Sprawdź datę!'}]:[{t:'„PILNE!!! Rozbił się samolot z chemikaliami pod miastem, wyjeżdżajcie! Tajne źródła w wojsku. PODAJ DALEJ!”',f:true,why:'„Tajne źródła”, caps lock, wezwanie do natychmiastowej reakcji.'},{t:'Alert RCB (SMS): „Uwaga! Dziś (05.09) silne burze z gradem. Możliwe przerwy w dostawie prądu.”',f:false,why:'Oficjalny kanał, data, konkret, zalecane działanie.'},{t:'TikTok: film „na żywo” ze skażonej wody w twoim mieście. Wyszukiwanie wsteczne: nagranie z innego kraju z 2019 r.',f:true,why:'Stare nagranie z innego kraju.'},{t:'IMGW-PIB (oficjalny profil): ostrzeżenie hydrologiczne 2. stopnia dla dorzecza Odry.',f:false,why:'Oficjalna instytucja, standardowy komunikat.'},{t:'WhatsApp: „Będą ostrzeliwać przedszkola, zabierajcie dzieci NATYCHMIAST” – bez nadawcy.',f:true,why:'Mechanizm z Ukrainy 2022. Kto na tym zyskuje?'},{t:'Urząd Gminy (BIP): „Punkt wydawania wody: OSP, ul. Strażacka 3, 8–20. Własne pojemniki.”',f:false,why:'Lokalne oficjalne źródło, weryfikowalne.'}],()=>nextStep())});
  D.push({type:'talk',npc:'dziadek',x:72,z:40,auto:true,lines:[{npc:'dziadek',text:T('Czuję, że tonę w wiadomościach. Serce wali.','Za dużo wiadomości, kręci mi się w głowie.'),choice:[{t:T('Zasada „zamrożenia”: godzina bez ekranu, coś fizycznego, 2–3 zaufane źródła dziennie.','Wyłączamy telefon na godzinę i idziemy na spacer.'),ok:true,why:'Przeciążenie poznawcze wyłącza myślenie. Cisza informacyjna 1 h dziennie.',calm:10},{t:T('Sprawdzam jeszcze 5 portali, żeby mieć pewność.','Czytam dalej, żeby wszystko wiedzieć.'),ok:false,why:'„Powtarzalność = prawda” to mechanizm propagandy. Ogranicz źródła.',calm:-8}]}]});
  D.push({type:'end',summary:T('Tarcza informacyjna: RCB, 2–3 źródła, Signal/Briar, cisza informacyjna.','Jesteś Łowcą fake newsów!'),plan:T('Jeśli wiadomość wzbudza silne emocje i każe „podać dalej”, to najpierw sprawdzam źródło i datę.','Jeśli wiadomość krzyczy wykrzyknikami, to pytam dorosłego, zanim ją wyślę.')}); break;
 case 15: D.push({type:'talk',npc:'sasiad',x:-20,z:30,auto:true,lines:[{npc:'sasiad',text:T('Trzeci dzień bez prądu. Państwo nie przyjdzie pierwsze – przyjdzie sąsiad. Obejdź ulicę: kto co ma, kto czego potrzebuje. Potem podzielimy role.','Trzeci dzień bez prądu. Pierwszy pomaga sąsiad! Obejdź ulicę i sprawdź, kto co ma i kto potrzebuje pomocy.')}]});
  D.push({type:'goto',x:-36,z:-22,r:4,obj:T('Sprawdź panią Krysię (82 l., sama, leki nasercowe)','Odwiedź panią Krysię – jest sama'),action:'Pukam i pytam o leki',msg:T('Nie wychodziła od 2 dni. Zapisujesz: leki nasercowe na 3 dni, potrzebna woda. Przypisujesz jej stałego opiekuna.','Pani Krysia potrzebuje wody i leków. Będziemy do niej zaglądać codziennie!')});
  D.push({type:'goto',x:18,z:-22,r:4,obj:T('Pan Marek – ma agregat i zna się na elektryce','Pan Marek ma agregat!'),action:'Wpisuję na mapę zasobów',msg:T('Agregat 2 kW – ładowanie telefonów i lodówka na leki, 2 godziny dziennie na zmianę.','Agregat naładuje telefony i schłodzi leki.')});
  D.push({type:'goto',x:-58,z:-22,r:4,obj:'Kowalscy – studnia i auto',action:'Wpisuję na mapę zasobów',msg:T('Studnia: woda techniczna dla ulicy, do picia po przegotowaniu.','Woda ze studni – po przegotowaniu do picia.')});
  D.push({type:'talk',npc:'sasiad',x:-20,z:30,auto:true,lines:[{npc:'sasiad',text:'Mamy mapę zasobów. Jak dzielimy wodę i prąd z agregatu?',choice:[{t:'Transparentnie: codzienne podsumowanie, rotacja osób, priorytet dzieci–chorzy–seniorzy, wszystko zapisane.',ok:true,why:'Wrocław 1997: spokój wrócił, gdy pojawiły się patrole i opaski. Unikaj podziału „na gębę”.'},{t:'Kto pierwszy, ten lepszy.',ok:false,why:'Prosta droga do konfliktu. Priorytety i zapis, kto co dostał.',calm:-6}]},
   {npc:'sasiad',text:'Role: koordynator, dystrybutor, patrol (2 osoby, czerwona latarka), pomoc medyczna. Kto ty?',choice:[{t:T('Koordynator – komunikacja: tablica na klatce, radio PMR kanał 3, dyżury.','Pomagam koordynatorowi – roznoszę kartki z informacjami.'),ok:true,why:'Skrzynka „Pomoc sąsiedzka” z listą zadań – każdy bierze i wraca po wykonaniu.'},{t:T('Ja nie, mam własne sprawy.','Nie chcę, wolę się bawić.'),ok:false,why:'Wspólnota to twój najważniejszy zasób. Każdy daje, ile może.'}]}]});
  D.push({type:'end',summary:T('POD z 5 domów, mapa zasobów, role, patrole, priorytety.','Sąsiedzka drużyna gotowa!'),plan:T('Jeśli kryzys trwa drugi dzień, to sprawdzam, kto na ulicy nie zgłasza się od 24 h.','Jeśli sąsiadka jest sama, to zaglądamy do niej codziennie.')}); break;
 case 16: D.push({type:'talk',npc:'urzednik',x:-50,z:18,auto:true,lines:[{npc:'urzednik',text:T('Wojewoda ogłosił stan klęski żywiołowej. Decyzja: pański samochód zostaje zarekwirowany do akcji ratunkowej. Proszę podstawić auto.','W kryzysie strażacy mogą pożyczyć wasze auto do ratowania ludzi. Trzeba je oddać, ale mądrze!'),choice:[{t:T('Rozumiem. Zanim oddam – proszę o imię, nazwisko, jednostkę i decyzję na piśmie. Idę sfotografować auto.','Dobrze! Ale najpierw zrobimy zdjęcia auta i zapiszemy, kto je bierze.'),ok:true,why:'Sandomierz 2010: „Kazali oddać łódź. Bez papierów – nic nie zrobisz”. Decyzje ustne – zapisuj, nagrywaj.'},{t:T('Odmawiam, to moja własność!','Nie oddam!'),ok:false,why:'Nieposłuszeństwo w stanie nadzwyczajnym: mandat, areszt lub przymus. Masz prawo do odszkodowania – jeśli masz dokumentację.',calm:-8}]}]});
  D.push({type:'goto',x:-12,z:-20,r:4,obj:T('Idź do auta i zrób dokumentację przed przekazaniem','Idź do auta i zrób zdjęcia'),action:'📸 Fotografuję: przebieg, paliwo, wyposażenie, data',msg:T('Zdjęcia z datą i GPS, numer VIN, stan baku – jedyny dowód do odszkodowania.','Zdjęcia zrobione – to dowód, żeby auto wróciło!')});
  D.push({type:'panel',run:()=>quizPanel(ch.quiz,T('Trzy stany nadzwyczajne: klęski żywiołowej, wyjątkowy, wojenny.','Ważne dokumenty w 3 kopiach!'),()=>nextStep())});
  D.push({type:'end',summary:T('Rekwizycja z dokumentacją, dokumenty w 3 kopiach, arkusz „co jeśli mnie zabraknie”.','Wiesz, co wolno, i masz zdjęcia jako dowód.'),plan:T('Jeśli ktoś wydaje mi polecenie w stanie nadzwyczajnym, to proszę o imię, nazwisko, jednostkę i zapisuję godzinę.','Jeśli coś oddajemy, to najpierw robimy zdjęcie.')}); break;
 case 17: D.push({type:'goto',x:18,z:42,r:5,obj:T('Powrót po dwóch tygodniach. Podejdź do zalanego domu – z zewnątrz.','Wracamy do zalanego domu. Najpierw patrzymy z zewnątrz.'),action:'Oglądam z zewnątrz: pęknięcia, zapach gazu',msg:T('Pęknięcie na ścianie, zapach wilgoci. Nie wchodzisz sam – wołasz Kowalskiego.','Ściana pęknięta. Nie wchodzimy sami – wołamy dorosłego!')});
  D.push({type:'talk',npc:'sasiad',x:18,z:42,auto:true,lines:[{npc:'sasiad',text:T('W środku kałuże, skrzynka elektryczna była pod wodą. Podłączamy prąd do osuszaczy?','W domu jest woda. Włączamy prąd?'),choice:[{t:T('Nie. Najpierw przegląd instalacji przez elektryka. Generator na zewnątrz, 6 m od domu.','Nie! Najpierw sprawdzi elektryk.'),ok:true,why:'Zalany dom – nie podłączaj prądu bez przeglądu. Tlenek węgla z generatora jest niewidoczny i śmiertelny.'},{t:T('Tak, szybciej wyschnie.','Tak, żeby było światło.'),ok:false,why:'Zwarcie i pożar po powodzi to klasyczne zagrożenie wtórne.'}]}]});
  D.push({type:'panel',run:()=>orderPanel('Ułóż kolejność usuwania skutków.',['Ocena stanu z dokumentacją fotograficzną','Usuwanie wody, błota, zawalonych fragmentów (maska, rękawice)','Suszenie: wentylacja, nagrzewnice, osuszacze','Dezynfekcja – środki przeciwgrzybicze','Odbudowa: instalacje → ściany → wykończenie'],'Wyrzuć wszystko, co miało kontakt z wodą powodziową.',()=>nextStep())});
  D.push({type:'talk',npc:'zosia',x:18,z:42,auto:true,lines:[{npc:'zosia',text:T('Od tygodnia budzę się w nocy i sprawdzam, czy pada. Mój pluszak zniknął w wodzie.','Boję się deszczu. I mój pluszak zniknął w wodzie.'),choice:[{t:T('To normalne po tym, co przeszłaś. Wracamy do rytmu dnia, rozmawiamy, jutro pomagamy sąsiadom. Jeśli po miesiącu nie minie – psycholog (116 123).','To normalne. Możesz mi o tym mówić, kiedy chcesz. Jutro razem sadzimy kwiaty z sąsiadami.'),ok:true,why:'Głuchołazy 1997: matka przez dwa lata sprawdzała prognozy 3 razy dziennie. PTSD może pojawić się po tygodniach – u dzieci też. Zaangażowanie przywraca sprawczość.'},{t:T('Nie ma czego się bać, przecież już po wszystkim.','Nie bądź beksa.'),ok:false,why:'Bagatelizowanie pogłębia lęk. Rytm dnia, rozmowa, zaangażowanie.',calm:-8}]}]});
  D.push({type:'end',summary:T('Ocena, dokumentacja, osuszanie, wniosek do gminy, wsparcie dla Zosi.','Dom wraca do życia, a Zosia może o wszystkim opowiedzieć.'),plan:T('Jeśli wracam do zniszczonego domu, to najpierw zdjęcia, potem elektryk, potem sprzątanie w masce.','Jeśli wracamy po powodzi, to najpierw dorośli sprawdzają, czy jest bezpiecznie.')}); break;
 case 18: D.push({type:'night',on:true}); D.push({type:'talk',npc:'ania',...at(-6,8),auto:true,lines:[{npc:'ania',text:T('Egzamin. 2:40 w nocy, komenda „ALARM WYJŚCIE”. Wszystko, czego się nauczyliśmy, w 90 sekund i w kolejności. Plecaki stoją tam, gdzie zawsze.','Wielki finał! Hasło „ALARM WYJŚCIE” – zrób wszystko po kolei, zanim minie czas. Plecak stoi tam, gdzie zawsze!')}]});
  D.push({type:'timed',time:KIDS?150:90,intro:T('Procedura last minute – wyjście w 5 minut. Zbierz punkty W KOLEJNOŚCI:','Zbierz po kolei:'),points:[{name:'Buty i kurtka',...at(2,5),why:'buty to najważniejszy element ubioru'},{name:'Plecaki 72 h',...at(-5,3),why:'zawsze w jednym miejscu'},{name:'Teczka dokumentów / pendrive',...at(6,1),why:'3 kopie'},{name:'Leki z lodówki do torby termicznej',...at(-6,-3),why:'półka ratunkowa'},{name:'Burek – smycz i transporter',...at(-4,12),why:'karta „Mój zwierzak”'},{name:'Zawór gazu i prąd (jeśli bezpieczne)',...at(7,-2),why:'mapa mediów'},{name:'Kartka na drzwiach: godzina i kierunek',...at(0,5),why:'dla służb i rozdzielonej rodziny'},{name:'Miejsce zbiórki A',x:-20,z:30,why:'potem SMS „JESTEM BEZPIECZNY”'}]});
  D.push({type:'night',on:false});
  D.push({type:'end',summary:T('Cała rodzina na placu przed czasem. SMS do łącznika w innym województwie wysłany. Jesteś gotowy.','Wszyscy na miejscu! Jesteś prawdziwym Małym Strażnikiem Bezpieczeństwa!'),plan:T('Jeśli minie 6 miesięcy, to robimy próbną ewakuację z pełnym pakowaniem.','Jeśli mama powie „ćwiczymy”, to wiem, gdzie stoi mój plecak.')}); break;
 }
 return D; }

/* ---------- LISTA / INTRO / KONIEC ---------- */
function missionList(){ return '<div class="missions">'+MISSIONS.map(m=>'<div class="'+(state.done[m.id]?'ok':'')+'">'+m.icon+' '+m.id+'. '+m.name+(state.done[m.id]?' '+'⭐'.repeat(state.done[m.id]):'')+'</div>').join('')+'</div>'; }
$('#listBtn').onclick=()=>{ if(quest){ open('<h2>Trwa misja</h2><p>'+quest.mission.name+'</p><div class="navbtns"><button class="btn ghost" id="ab">Przerwij misję</button><button class="btn primary" id="cl">Kontynuuj</button></div>'); $('#cl').onclick=close; $('#ab').onclick=()=>{ abortQuest(); close(); }; return; } open('<h2>📋 Misje – rozdziały książki</h2><p class="small">Misje odblokowują się po kolei (złoty znacznik = następna). Zielone – ukończone.</p>'+missionList()+'<div class="navbtns"><button class="btn ghost" id="rs">Zeruj postępy</button><button class="btn primary" id="cl">Zamknij</button></div>'); $('#cl').onclick=close; $('#rs').onclick=()=>{ if(confirm('Wyzerować postępy gry?')){ state={done:{},score:0,calm:80}; save(); refreshBeacons(); close(); } }; };
function showIntro(){ open('<div id="intro"><div style="font-size:3rem">'+(KIDS?'🧒🎮':'🧭🎮')+'</div><h2>'+T('Rodzina Nowaków: 19 misji przetrwania','Miasteczko Małego Strażnika')+'</h2><p>'+T('Jesteś koordynatorem rodziny: Ania, Zosia (8 l.), dziadek Józef (79 l.) i pies Burek. Dom 300 m od rzeki. Przejdziesz przez wszystkie rozdziały poradnika: od analizy ryzyka, przez zapasy, syreny, ewakuację, blackout i powódź, aż po odbudowę. Każde zadanie wykonujesz naprawdę: idziesz, szukasz, decydujesz, ćwiczysz refleks i oddech.','Mieszkasz z mamą Anią, dziadkiem Józefem i psem Burkiem. Zostaniesz Małym Strażnikiem Bezpieczeństwa: pakujesz plecak, słuchasz syren, budujesz bazę, uciekasz przed wodą na górkę i łapiesz fake newsy. Za każdą misję – gwiazdki i odznaka!')+'</p><p class="small"><b>Wskaźnik spokoju:</b> '+T('złe decyzje podnoszą stres, oddech 4-7-8 go obniża. Panika bywa groźniejsza niż kryzys.','gdy się boisz, oddychaj jak na gorącą zupę – wskaźnik rośnie!')+'</p><p class="small"><b>Sterowanie:</b> WASD / strzałki – ruch · przeciągnij myszą lub Q – obrót kamery · <b>kółko myszy, klawisze + / − lub przyciski z boku – przybliżanie</b> (0 = widok domyślny) · E lub przycisk – działanie.<br>Telefon: joystick po lewej, przeciąganie – kamera, <b>szczypanie dwoma palcami – zoom</b>.</p>'+'<div class="msg"><b>'+T('🧭 Pięć stacji poza misjami','🧭 Pięć stacji do odwiedzenia')+'</b> <ul><li><b>Stacja kompasu</b> – róża wiatrów na południowym zachodzie: azymuty, droga powrotna i marsz w terenie.</li><li><b>Warsztat elektroniki</b> – wiata przy stacji energetycznej: prawo Ohma, zapas energii, budowa obwodu.</li><li><b>Stacja weryfikacji</b> – wielki laptop przy drodze do sklepu: jak rozpoznać manipulację i oszustwo.</li><li><b>Karetka</b> przy punkcie medycznym i <b>hala-drukarka</b> obok szkoły – osobne gry.</li></ul><span class="small">Podejdź i wciśnij E. Stacje działają w dowolnym momencie, niezależnie od misji.</span></div>'+missionList()+'<p class="small" style="opacity:.55;text-align:center;margin-top:14px">Miasteczko '+(window.WERSJA_SERWISU||'')+' · <a href="https://github.com/mhalaba/poradnik-przetrwania/blob/main/CHANGELOG.md" target="_blank" rel="noopener">historia zmian</a></p><div class="navbtns" style="justify-content:center"><button class="btn primary" id="st">▶ Graj</button><a class="btn ghost" href="szkolenie.html?wersja='+(KIDS?'dzieci':'dorosli')+'">📚 Najpierw szkolenie</a></div></div>'); $('#st').onclick=()=>{ audio(); TR('gra_start',{ukonczone:Object.keys(state.done).length}); close(); wskazowka(); }; }
function showEnd(){ const stars=Object.values(state.done).reduce((a,b)=>a+b,0); TR('gra_ukonczona',{gwiazdki:stars,punkty:state.score,spokoj:Math.round(state.calm)}); open('<div style="text-align:center"><div style="font-size:3.5rem">🏆</div><h2>'+T('Rodzina Nowaków jest gotowa. Ty też.','Jesteś Małym Strażnikiem Bezpieczeństwa!')+'</h2><p>Punkty: <b>'+state.score+'</b> · Gwiazdki: <b>'+stars+'/'+(MISSIONS.length*3)+'</b> · Spokój: <b>'+Math.round(state.calm)+'%</b></p><p>'+T('PRZYGOTOWANIE NIE OZNACZA PANIKI. OZNACZA ODPOWIEDZIALNOŚĆ. Wydrukuj plan rodziny i kartę ICE – wersja cyfrowa to za mało bez prądu.','Pamiętaj: przygotowanie to mądrość i odwaga. Proszenie o pomoc to oznaka siły!')+'</p><p class="small" style="margin-top:22px">Scenariusze misji pochodzą z książki „'+KSIAZKA.tytul+'” '+KSIAZKA.autor+'. Pełne listy kontrolne i szablony są <a href="'+KSIAZKA.sklep+'" target="_blank" rel="noopener">w wydaniu Bezdroży</a>.</p><div class="ad-slot" data-ad="bottom"></div><div class="navbtns" style="justify-content:center"><button class="btn ghost" id="cl">Wracam do miasteczka</button><a class="btn ghost" href="szkolenie.html?wersja='+(KIDS?'dzieci':'dorosli')+'">📚 Szkolenie i certyfikat</a></div></div>'); $('#cl').onclick=close; if(window.renderAds) window.renderAds(); }
{ const hb=$('#helpBtn'); if(hb) hb.onclick=()=>showIntro(); }
refreshBeacons(); setNight(false); showIntro();
window.__pp={startMission,MISSIONS,player,camera,close,nextStep,setNight,setDusk,startMarsz,uruchomStacje,GRY,get quest(){return quest;},state,pickups,interact,solids,debug:()=>({camCur:+camCur.toFixed(2),camDist:+camDist.toFixed(2),pitch:+pitch.toFixed(2),camYaw:+camYaw.toFixed(2),camPos:camera.position.toArray().map(n=>+n.toFixed(2)),hit:(()=>{const h=camClear(player.position.x,player.position.y,player.position.z,Math.cos(pitch),camDist);return +h.toFixed(2);})()})};
})();

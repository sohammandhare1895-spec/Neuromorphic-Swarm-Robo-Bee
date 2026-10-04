import data from "./mockData.js";
import {TelemetryEngine} from "./telemetryEngine.js";
import {CompoundEyeEngine} from "./compoundEyeEngine.js";

const state={mode:"RGB",stream:null,logs:[...data.initialLogs],engines:[]};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function log(level,message){
  state.logs.push({timestamp:Date.now(),level,message});
  if(state.logs.length>70)state.logs.shift();
  $("#missionTerminal").innerHTML=state.logs.map(x=>`<div class="log-line"><span class="log-time">[${new Date(x.timestamp).toLocaleTimeString("en-IN",{hour12:false})}]</span> <span class="log-${x.level.toLowerCase()}">[${x.level}]</span> <span class="log-message">${escapeHTML(x.message)}</span></div>`).join("");
  $("#missionTerminal").scrollTop=$("#missionTerminal").scrollHeight;
}
function escapeHTML(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}

async function startWebcam(){
  try{
    state.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}},audio:false});
    $$(".webcam-feed").forEach(v=>{v.srcObject=state.stream;v.play().catch(()=>{})});
    $("#cameraStatus").textContent="CONNECTED · 06 VIEWS";
    log("SUCCESS","Browser webcam granted. Six CCTV panels are now synchronized to the live camera.");
  }catch(err){
    $("#cameraStatus").textContent="CAMERA BLOCKED / DEMO";
    log("WARNING","Webcam permission unavailable. Enable camera access or serve the project from localhost/HTTPS.");
  }
}

function initOptics(){
  $$(".camera-card").forEach(card=>{
    const canvas=document.createElement("canvas");
    canvas.className="hidden-engine";
    card.querySelector(".camera-screen").appendChild(canvas);
    state.engines.push(new CompoundEyeEngine(canvas));
  });
}

function setMode(mode){
  state.mode=mode;
  document.body.classList.toggle("uv-mode",mode==="UV");
  $$(".vision-btn").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
  log("INFO",`Compound vision switched to ${mode} spectral mode.`);
}
$$(".vision-btn").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));

function clock(){
  const t=new Date().toLocaleTimeString("en-IN",{hour12:false});
  $$(".cam-time").forEach(x=>x.textContent=t);
}
setInterval(clock,1000);clock();

const map=$("#navigationCanvas"),ctx=map.getContext("2d");
function resizeMap(){const r=map.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);map.width=r.width*d;map.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);map._w=r.width;map._h=r.height}
addEventListener("resize",resizeMap);resizeMap();

function hex(x,y,r){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/3*i+Math.PI/6,p=[x+Math.cos(a)*r,y+Math.sin(a)*r];i?ctx.lineTo(...p):ctx.moveTo(...p)}ctx.closePath();ctx.stroke()}
function drawMap(nodes){
  const w=map._w,h=map._h;ctx.clearRect(0,0,w,h);ctx.strokeStyle="rgba(245,158,11,.08)";
  const r=18,dx=Math.sqrt(3)*r,dy=1.5*r;let row=0;
  for(let y=-r;y<h+r;y+=dy,row++)for(let x=-dx;x<w+dx;x+=dx)hex(x+(row%2?dx/2:0),y,r);
  data.floralTargets.forEach(f=>{const x=f.x/300*w,y=f.y/240*h;ctx.fillStyle=f.locked?"#eab308":"#8b5cf6";ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0});
  nodes.forEach((n,i)=>{const x=n.targetCoords.x/300*w,y=n.targetCoords.y/240*h;const col=["#f59e0b","#22d3ee","#84cc16"][i];ctx.strokeStyle=col;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-n.velocity.dx*20,y-n.velocity.dy*20);ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();ctx.font="7px JetBrains Mono";ctx.fillText(n.id,x+7,y-7)});
}
function initTelemetry(){
  const engine=new TelemetryEngine(data.nodes);
  engine.on("telemetry",s=>{
    $("#meshLatency").textContent=s.meshLatency.toFixed(0);
    $("#activeNodes").textContent=`${String(s.activeNodes).padStart(2,"0")} / 03`;
    $("#pollinatedCount").textContent=s.flowersPollinated;
    s.nodes.forEach((n,i)=>{
      const card=$(`.camera-card:nth-child(${i+1})`);
      card.querySelector(".alt").textContent=n.altitude.toFixed(1);
      card.querySelector(".bat").textContent=n.battery.toFixed(0);
      card.querySelector(".force").textContent=n.contactForce.toFixed(1);
      $(`#beeBattery${i+1}`).style.width=`${n.battery}%`;
      $(`#beeBatteryText${i+1}`).textContent=`${n.battery.toFixed(0)}%`;
    });
    const force=s.nodes.reduce((a,n)=>a+n.contactForce,0)/s.nodes.length;
    $("#mainForce").textContent=force.toFixed(1);
    $("#forceNeedle").style.left=`${Math.min(100,force*10)}%`;
    $("#forceStatus").textContent=force>=5?"ALERT":"SAFE";
    $("#forceStatus").style.color=force>=5?"#ef4444":"#a3e635";
    const n=s.nodes[0];$("#mapX").textContent=n.targetCoords.x.toFixed(1);$("#mapY").textContent=n.targetCoords.y.toFixed(1);$("#mapZ").textContent=n.altitude.toFixed(1);
    drawMap(s.nodes);
  });
  engine.on("pollination",e=>log("SUCCESS",`${e.node.id} confirmed flower contact / pollination count ${e.total}.`));
  engine.on("log",e=>log(e.level,e.message));
  engine.start();
}
initOptics();startWebcam();initTelemetry();log("INFO","YOLOv8 square detection overlay armed on all six CCTV views.");log("INFO","Bee banner loaded as mission-control header.");

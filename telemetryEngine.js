export class TelemetryEngine{
  constructor(nodes){this.nodes=structuredClone(nodes);this.listeners={telemetry:[],pollination:[],log:[]};this.flowers=127;this.timer=null}
  on(type,fn){(this.listeners[type]||[]).push(fn)}
  emit(type,data){(this.listeners[type]||[]).forEach(fn=>fn(data))}
  start(){if(this.timer)return;this.timer=setInterval(()=>this.update(),700)}
  update(){
    for(const n of this.nodes){
      n.battery=Math.max(5,n.battery-.004-Math.random()*.004);
      n.latency=Math.max(3,Math.min(12,n.latency+(Math.random()-.5)*2));
      n.altitude=Math.max(8,Math.min(55,n.altitude+(Math.random()-.5)*.8));
      n.contactForce=Math.max(.5,Math.min(7,n.contactForce+(Math.random()-.5)*.65));
      n.targetCoords.x+=n.velocity.dx+(Math.random()-.5)*1.1;
      n.targetCoords.y+=n.velocity.dy+(Math.random()-.5)*1.1;
      if(n.targetCoords.x<20)n.targetCoords.x=285;if(n.targetCoords.x>285)n.targetCoords.x=20;
      if(n.targetCoords.y<20)n.targetCoords.y=225;if(n.targetCoords.y>225)n.targetCoords.y=20;
      n.status=n.battery<20?"LOW_BATTERY":n.contactForce>5?"SEARCHING":"TARGET_LOCK";
    }
    this.emit("telemetry",{timestamp:Date.now(),meshLatency:this.nodes.reduce((a,n)=>a+n.latency,0)/this.nodes.length,activeNodes:this.nodes.filter(n=>n.battery>10).length,flowersPollinated:this.flowers,nodes:this.nodes});
    if(Math.random()<.015){const n=this.nodes[Math.floor(Math.random()*this.nodes.length)];this.flowers++;n.pollinationCount++;n.status="POLLINATING";this.emit("pollination",{node:n,total:this.flowers})}
  }
  getNodes(){return this.nodes}
}

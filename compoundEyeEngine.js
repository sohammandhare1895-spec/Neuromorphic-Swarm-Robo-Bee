export class CompoundEyeEngine{
  constructor(canvas){
    this.canvas=canvas;this.ctx=canvas.getContext("2d");this.t=Math.random()*100;this.resize();
    addEventListener("resize",()=>this.resize());
    requestAnimationFrame(()=>this.loop());
  }
  resize(){
    const r=this.canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
    this.w=r.width;this.h=r.height;this.canvas.width=this.w*d;this.canvas.height=this.h*d;this.ctx.setTransform(d,0,0,d,0,0);
  }
  loop(){
    const c=this.ctx;c.clearRect(0,0,this.w,this.h);this.t++;
    const g=c.createRadialGradient(this.w/2,this.h/2,10,this.w/2,this.h/2,this.w*.7);
    g.addColorStop(0,"rgba(245,158,11,.02)");g.addColorStop(1,"rgba(2,6,23,.5)");
    c.fillStyle=g;c.fillRect(0,0,this.w,this.h);
    c.strokeStyle="rgba(245,158,11,.11)";c.lineWidth=.5;
    const r=16,dx=Math.sqrt(3)*r,dy=1.5*r;
    let row=0;
    for(let y=-r;y<this.h+r;y+=dy,row++)for(let x=-dx;x<this.w+dx;x+=dx)this.hex(x+(row%2?dx/2:0),y,r);
    c.strokeStyle="rgba(34,211,238,.10)";c.beginPath();const sy=(this.t*.7)%(this.h+40)-20;c.rect(0,sy,this.w,18);c.stroke();
    requestAnimationFrame(()=>this.loop());
  }
  hex(x,y,r){
    const c=this.ctx;c.beginPath();
    for(let i=0;i<6;i++){const a=Math.PI/3*i+Math.PI/6,p=[x+Math.cos(a)*r,y+Math.sin(a)*r];i?c.lineTo(...p):c.moveTo(...p)}
    c.closePath();c.stroke();
  }
}

export const nodes=[
{id:"BEE-01",name:"NECTAR-01",battery:97,altitude:24.8,contactForce:2.4,latency:5,targetCoords:{x:142.4,y:87.6,z:24.8},velocity:{dx:.42,dy:-.18,dz:.03},spectrumMode:"RGB",status:"TARGET_LOCK",currentTarget:"FLOWER-07",pollinationCount:49},
{id:"BEE-02",name:"NECTAR-02",battery:89,altitude:18.7,contactForce:1.8,latency:6,targetCoords:{x:94.2,y:132.1,z:18.7},velocity:{dx:-.25,dy:.36,dz:.02},spectrumMode:"RGB",status:"POLLINATING",currentTarget:"FLOWER-03",pollinationCount:42},
{id:"BEE-03",name:"NECTAR-03",battery:78,altitude:34.5,contactForce:3.6,latency:7,targetCoords:{x:188.8,y:74.3,z:34.5},velocity:{dx:.31,dy:.24,dz:-.02},spectrumMode:"RGB",status:"SEARCHING",currentTarget:"FLOWER-21",pollinationCount:36}
];

export const floralTargets=[
["FLOWER-03",94,132,98.1,"STIGMA",true],["FLOWER-07",142,88,96.4,"STIGMA",true],
["FLOWER-09",164,152,91.7,"NECTAR",false],["FLOWER-12",76,177,94.8,"ANTHER",false],
["FLOWER-17",205,116,95.2,"ANTHER",false],["FLOWER-21",188,74,97.6,"STIGMA",true],
["FLOWER-26",232,163,87.3,"NECTAR",false],["FLOWER-31",121,214,90.5,"STIGMA",false],
["FLOWER-36",269,92,83.8,"ANTHER",false]
].map(([flowerId,x,y,uvSignatureScore,targetType,locked])=>({flowerId,x,y,uvSignatureScore,targetType,locked,nectarDensity:85,pollenDensity:82,pollenStatus:"AVAILABLE"}));

export const initialLogs=[
{timestamp:Date.now()-15000,level:"INFO",message:"ESP-NOW mesh initialized / 3 nodes discovered."},
{timestamp:Date.now()-12000,level:"SUCCESS",message:"Webcam optical bus ready / six views linked to one browser camera stream."},
{timestamp:Date.now()-9000,level:"INFO",message:"YOLOv8 floral target detector armed."},
{timestamp:Date.now()-6000,level:"SUCCESS",message:"BEE-01 acquired FLOWER-07 UV signature."}
];

export default {nodes,floralTargets,initialLogs};

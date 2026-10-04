export type SpectrumMode = "RGB" | "UV";
export type LogLevel = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface Coordinates { x:number; y:number; z:number; }

export interface BeeNode {
  id:string;
  name:string;
  battery:number;
  altitude:number;
  contactForce:number;
  latency:number;
  targetCoords:Coordinates;
  spectrumMode:SpectrumMode;
  status:"ONLINE"|"SEARCHING"|"TARGET_LOCK"|"POLLINATING"|"LOW_BATTERY";
  currentTarget:string|null;
  pollinationCount:number;
}

export interface SpectralTarget {
  flowerId:string;
  x:number;
  y:number;
  uvSignatureScore:number;
  nectarDensity:number;
  pollenDensity:number;
  pollenStatus:"AVAILABLE"|"COLLECTED"|"DEPLETED";
  targetType:"STIGMA"|"ANTHER"|"NECTAR";
  locked:boolean;
}

export interface MeshLog {
  timestamp:number;
  level:LogLevel;
  message:string;
}

// EXACT Native WebGL Shader from spicylyrics.org
export class WebCanvas {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private animationId: number | null = null;
  private startTime: number = performance.now();
  private speed: number = 1;

  // EXACT parameters from saved HTML page
  private readonly params = {
    color1: [0.933, 0.247, 0.349], // #ee3f59
    color2: [0.157, 0.518, 0.902], // #2884e6  
    color3: [0.694, 0.620, 0.937], // #B19EEF
    timeSpeed: 0.7,
    colorBalance: 0.0,
    warpStrength: 1.4,
    warpFrequency: 6.1,
    warpSpeed: 3.0,
    warpAmplitude: 50.0,
    blendAngle: 0.0,
    blendSoftness: 0.05,
    rotationAmount: 500.0,
    noiseScale: 2.0,
    grainAmount: 0.1,
    grainScale: 2.0,
    grainAnimated: 0.0,
    contrast: 1.5,
    gamma: 1.0,
    saturation: 1.0,
    centerX: 0.0,
    centerY: 0.0,
    zoom: 0.9,
  };

  constructor(canvas: HTMLCanvasElement, imageUrl: string) {
    this.canvas = canvas;
    this.initWebGL();
    window.addEventListener('resize', () => this.resize());
  }

  private initWebGL() {
    // Try WebGL 2 first
    this.gl = this.canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    }) as WebGL2RenderingContext;
    
    if (!this.gl) {
      console.error('❌ WebGL 2.0 not supported');
      return;
    }

    console.log('✅ WebGL 2.0 initialized with high-performance GPU');
    this.resize();
    this.createShaderProgram();
    this.start();
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    if (this.gl) {
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private createShaderProgram() {
    if (!this.gl) return;

    const vertexShaderSource = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

    const fragmentShaderSource = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a){
  float s=sin(a),c=cos(a);
  return mat2(c,-s,s,c);
}

vec2 hash(vec2 p){
  p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));
  return fract(sin(p)*43758.5453);
}

float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  float n=mix(
    mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),
        dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),
    mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),
        dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);
  return 0.5+0.5*n;
}

void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){
    grainUv+=vec2(iTime*0.05);
  }
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);

  o=vec4(col,1.0);
}

void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}`;

    const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    this.program = this.gl.createProgram()!;
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('❌ Program link failed:', this.gl.getProgramInfoLog(this.program));
      return;
    }
    
    console.log('✅ Native shader compiled successfully');

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(this.program, 'position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  private compileShader(source: string, type: number): WebGLShader | null {
    if (!this.gl) return null;
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('❌ Shader compile failed:', this.gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  public setSpeed(speed: number) {
    this.speed = Math.max(0.1, Math.min(speed, 3.0));
  }

  public start() {
    const render = () => {
      if (!this.gl || !this.program) return;

      const time = ((performance.now() - this.startTime) * 0.001 * this.speed);

      this.gl.useProgram(this.program);

      const setUniform = (name: string, value: any) => {
        const location = this.gl!.getUniformLocation(this.program!, name);
        if (location === null) return;
        
        if (typeof value === 'number') {
          this.gl!.uniform1f(location, value);
        } else if (Array.isArray(value)) {
          if (value.length === 2) this.gl!.uniform2f(location, value[0], value[1]);
          else if (value.length === 3) this.gl!.uniform3f(location, value[0], value[1], value[2]);
        }
      };

      setUniform('iResolution', [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]);
      setUniform('iTime', time);
      setUniform('uTimeSpeed', this.params.timeSpeed);
      setUniform('uColorBalance', this.params.colorBalance);
      setUniform('uWarpStrength', this.params.warpStrength);
      setUniform('uWarpFrequency', this.params.warpFrequency);
      setUniform('uWarpSpeed', this.params.warpSpeed);
      setUniform('uWarpAmplitude', this.params.warpAmplitude);
      setUniform('uBlendAngle', this.params.blendAngle);
      setUniform('uBlendSoftness', this.params.blendSoftness);
      setUniform('uRotationAmount', this.params.rotationAmount);
      setUniform('uNoiseScale', this.params.noiseScale);
      setUniform('uGrainAmount', this.params.grainAmount);
      setUniform('uGrainScale', this.params.grainScale);
      setUniform('uGrainAnimated', this.params.grainAnimated);
      setUniform('uContrast', this.params.contrast);
      setUniform('uGamma', this.params.gamma);
      setUniform('uSaturation', this.params.saturation);
      setUniform('uCenterOffset', [this.params.centerX, this.params.centerY]);
      setUniform('uZoom', this.params.zoom);
      setUniform('uColor1', this.params.color1);
      setUniform('uColor2', this.params.color2);
      setUniform('uColor3', this.params.color3);

      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
      this.animationId = requestAnimationFrame(render);
    };

    render();
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public destroy() {
    this.stop();
    window.removeEventListener('resize', () => this.resize());
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}

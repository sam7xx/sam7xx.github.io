(()=>{let E=`
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,F=`
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + offset;
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);

      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(
        tris(seed * 34.0 + uTime * uSpeed / 10.0),
        tris(seed * 38.0 + uTime * uSpeed / 30.0)
      ) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      col += star * size * base;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
  vec2 mouseNorm = uMouse - vec2(0.5);

  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = smoothstep(0.0, 0.3, length(col));
    gl_FragColor = vec4(col, min(alpha, 1.0));
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`,n={focal:[.5,.5],rotation:[1,0],starSpeed:2,density:2,hueShift:140,speed:.5,glowIntensity:.2,saturation:.1,mouseRepulsion:!0,twinkleIntensity:.1,rotationSpeed:.1,repulsionStrength:.1,autoCenterRepulsion:0,transparent:!0};function r(e){return"number"==typeof e&&Number.isFinite(e)}function i(e,t){return r(e)&&0<=e?e:t}function a(e,t){return"boolean"==typeof e?e:t}function u(e,t,o){return Array.isArray(e)&&2===e.length&&r(e[0])&&r(e[1])?o?e.map(function(e){return Math.max(0,Math.min(1,e))}):e.slice():t.slice()}function t(e){var t,o,e=e&&"object"==typeof e&&!Array.isArray(e)?e:{};return{focal:u(e.focal,n.focal,!0),rotation:u(e.rotation,n.rotation,!1),starSpeed:i(e.starSpeed,n.starSpeed),density:i(e.density,n.density),hueShift:(t=e.hueShift,o=n.hueShift,r(t)?(t%360+360)%360:o),speed:i(e.speed,n.speed),glowIntensity:i(e.glowIntensity,n.glowIntensity),saturation:i(e.saturation,n.saturation),mouseRepulsion:a(e.mouseRepulsion,n.mouseRepulsion),twinkleIntensity:i(e.twinkleIntensity,n.twinkleIntensity),rotationSpeed:(t=e.rotationSpeed,o=n.rotationSpeed,r(t)?t:o),repulsionStrength:i(e.repulsionStrength,n.repulsionStrength),autoCenterRepulsion:i(e.autoCenterRepulsion,n.autoCenterRepulsion),transparent:a(e.transparent,n.transparent)}}function C(e,t,o){t=e.createShader(t);if(e.shaderSource(t,o),e.compileShader(t),e.getShaderParameter(t,e.COMPILE_STATUS))return t;throw o=e.getShaderInfoLog(t)||"Unknown shader compilation error",e.deleteShader(t),new Error(o)}function o(S){if(S&&"true"!==S.dataset.galaxyMounted){let v=S.parentElement,h=S.closest(".wiki-hero")||v;if(v&&h){let m=(e=>{if(!(e=e.getAttribute("data-galaxy-params")))return t({});try{return t(JSON.parse(e))}catch(e){return t({})}})(S),p;try{p=S.getContext("webgl",{alpha:m.transparent,antialias:!1,premultipliedAlpha:!1,powerPreference:"high-performance"})}catch(e){return}if(p){let o;try{o=(e=>{var t=C(e,e.VERTEX_SHADER,E),o=C(e,e.FRAGMENT_SHADER,F),n=e.createProgram();if(e.attachShader(n,t),e.attachShader(n,o),e.linkProgram(n),e.deleteShader(t),e.deleteShader(o),e.getProgramParameter(n,e.LINK_STATUS))return n;throw t=e.getProgramInfoLog(n)||"Unknown WebGL program link error",e.deleteProgram(n),new Error(t)})(p)}catch(e){var g=p.getExtension("WEBGL_lose_context");return void(g&&g.loseContext())}S.dataset.galaxyMounted="true";let n=((t,o)=>{let n={};return["uTime","uResolution","uFocal","uRotation","uStarSpeed","uDensity","uHueShift","uSpeed","uMouse","uGlowIntensity","uSaturation","uMouseRepulsion","uTwinkleIntensity","uRotationSpeed","uRepulsionStrength","uMouseActiveFactor","uAutoCenterRepulsion","uTransparent"].forEach(function(e){n[e]=t.getUniformLocation(o,e)}),n})(p,o);g=p.getAttribLocation(o,"position");let r=p.createBuffer(),i=(p.bindBuffer(p.ARRAY_BUFFER,r),p.bufferData(p.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),p.STATIC_DRAW),p.enableVertexAttribArray(g),p.vertexAttribPointer(g,2,p.FLOAT,!1,0,0),p.useProgram(o),p.enable(p.BLEND),p.blendFunc(p.SRC_ALPHA,p.ONE_MINUS_SRC_ALPHA),p.clearColor(0,0,0,0),p.uniform2f(n.uFocal,m.focal[0],m.focal[1]),p.uniform2f(n.uRotation,m.rotation[0],m.rotation[1]),p.uniform1f(n.uDensity,m.density),p.uniform1f(n.uHueShift,m.hueShift),p.uniform1f(n.uSpeed,m.speed),p.uniform1f(n.uGlowIntensity,m.glowIntensity),p.uniform1f(n.uSaturation,m.saturation),p.uniform1i(n.uMouseRepulsion,m.mouseRepulsion?1:0),p.uniform1f(n.uTwinkleIntensity,m.twinkleIntensity),p.uniform1f(n.uRotationSpeed,m.rotationSpeed),p.uniform1f(n.uRepulsionStrength,m.repulsionStrength),p.uniform1f(n.uAutoCenterRepulsion,m.autoCenterRepulsion),p.uniform1i(n.uTransparent,m.transparent?1:0),{x:.5,y:.5}),t={x:.5,y:.5},a=0,u=0,s=null,l=!0,f=!1,c=(h.addEventListener("mousemove",b),h.addEventListener("mouseleave",T),document.addEventListener("visibilitychange",L),null),d=(window.ResizeObserver?(c=new window.ResizeObserver(y)).observe(v):window.addEventListener("resize",y),null);function y(){var e=v.getBoundingClientRect(),t=Math.max(1,Math.round(e.width)),e=Math.max(1,Math.round(e.height));S.width===t&&S.height===e||(S.width=t,S.height=e,p.viewport(0,0,t,e),p.uniform3f(n.uResolution,t,e,t/e))}function R(){return!f&&l&&!document.hidden}function w(e){s=null,R()&&(e=.001*e,t.x+=.05*(i.x-t.x),t.y+=.05*(i.y-t.y),u+=.05*(a-u),p.uniform1f(n.uTime,e),p.uniform1f(n.uStarSpeed,e*m.starSpeed/10),p.uniform2f(n.uMouse,t.x,t.y),p.uniform1f(n.uMouseActiveFactor,u),p.clear(p.COLOR_BUFFER_BIT),p.drawArrays(p.TRIANGLES,0,3),s=window.requestAnimationFrame(w))}function x(){R()&&null===s&&(s=window.requestAnimationFrame(w))}function A(){null!==s&&(window.cancelAnimationFrame(s),s=null)}function b(e){var t=v.getBoundingClientRect();t.width<=0||t.height<=0||(i.x=(e.clientX-t.left)/t.width,i.y=1-(e.clientY-t.top)/t.height,a=1)}function T(){a=0}function L(){(document.hidden?A:x)()}window.IntersectionObserver&&(d=new window.IntersectionObserver(function(e){((l=e[0].isIntersecting)?x:A)()})).observe(v),window.addEventListener("pagehide",function e(){var t;f||(f=!0,A(),h.removeEventListener("mousemove",b),h.removeEventListener("mouseleave",T),document.removeEventListener("visibilitychange",L),window.removeEventListener("resize",y),window.removeEventListener("pagehide",e),c&&c.disconnect(),d&&d.disconnect(),p.deleteBuffer(r),p.deleteProgram(o),(t=p.getExtension("WEBGL_lose_context"))&&t.loseContext(),delete S.dataset.galaxyMounted)}),y(),x()}}}}window.stellar=window.stellar||{},window.stellar.galaxy={mountAll:function(e){Array.prototype.forEach.call(e||[],o)}}})();
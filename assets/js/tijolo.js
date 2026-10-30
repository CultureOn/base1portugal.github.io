(function(){
var hero=document.getElementById('hero'),canvas=document.getElementById('brick');
if(!window.THREE){hero.classList.add('nogl');return;}
var renderer;
try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:false,alpha:false});}catch(e){hero.classList.add('nogl');return;}
var GROUND=0xFFFFFF,INK=0x111111;
renderer.setClearColor(GROUND,1);

// Perfil do tijolo: 3 x 2 letras B, medidas tiradas do SVG original (unidades do SVG, y para baixo).
// Construído como uma só forma (contorno + vazios) para não haver juntas entre peças.
var BW=83.39,BH=127.79,COLS=3,ROWS=2,TW=BW*COLS,TH=BH*ROWS;
function brickShape(){
  function P(o){var q={};
    q.M=function(x,y){o.moveTo(x,-y);return q;};
    q.L=function(x,y){o.lineTo(x,-y);return q;};
    q.C=function(a,b,c,d,e,g){o.bezierCurveTo(a,-b,c,-d,e,-g);return q;};
    return q;}
  // troços do lado direito de um B com origem em (x,y)
  function topR(q,x,y){q.L(x+56.45,y).C(x+72.06,y,x+83.39,y+11.42,x+83.39,y+27.15);}
  function waist(q,x,y){q.L(x+83.39,y+41.58).C(x+83.39,y+54.98,x+74.62,y+61.74,x+72.04,y+63.43).C(x+74.64,y+64.97,x+83.39,y+71.05,x+83.39,y+83.14);}
  function botR(q,x,y){q.L(x+83.39,y+100.64).C(x+83.39,y+116.37,x+72.07,y+127.79,x+56.46,y+127.79);}
  function topRfromBottom(q,x,y){q.C(x+72.06,y,x+83.39,y+11.42,x+83.39,y+27.15);} // a partir de (x+56.45,y)
  function botRrev(q,x,y){q.C(x+72.07,y+127.79,x+83.39,y+116.37,x+83.39,y+100.64);} // a partir de (x+56.46,y+127.79)
  var s=new THREE.Shape(),q=P(s),c,r,x,y;
  // contorno exterior
  q.M(0,0);
  for(c=0;c<COLS;c++){x=c*BW;topR(q,x,0);if(c<COLS-1)q.L(x+BW,0);}
  x=(COLS-1)*BW;
  for(r=0;r<ROWS;r++){y=r*BH;if(r>0)topRfromBottom(q,x,y);waist(q,x,y);botR(q,x,y);}
  for(c=COLS-2;c>=0;c--){x=c*BW;q.L(x+BW,TH).L(x+BW,TH-27.15);
    // curva de baixo da coluna c, percorrida de cima para baixo: (x+83.39,TH-27.15) -> (x+56.46,TH)
    q.C(x+83.39,TH-11.42,x+72.07,TH,x+56.46,TH);}
  q.L(0,TH).L(0,0);
  // vazios: miolos dos B
  for(c=0;c<COLS;c++)for(r=0;r<ROWS;r++){x=c*BW;y=r*BH;
    var h1=new THREE.Path(),a=P(h1);
    a.M(x+12.31,y+57.08).L(x+55.81,y+57.08).C(x+66.19,y+57.08,x+70.43,y+52.53,x+70.43,y+41.37).L(x+70.43,y+25.4).C(x+70.43,y+18.89,x+65.33,y+11.65,x+58.0,y+11.65).L(x+12.31,y+11.65).L(x+12.31,y+57.08);
    var h2=new THREE.Path(),b=P(h2);
    b.M(x+12.31,y+116.36).L(x+57.98,y+116.36).C(x+65.1,y+116.36,x+70.42,y+109.1,x+70.42,y+102.61).L(x+70.42,y+85.33).C(x+70.42,y+73.7,x+66.5,y+68.95,x+56.89,y+68.95).L(x+12.31,y+68.95).L(x+12.31,y+116.36);
    s.holes.push(h1,h2);}
  // vazios entre colunas: cintura de cada B e encontro entre linhas
  for(c=0;c<COLS-1;c++){x=c*BW;var X=x+BW;
    for(r=0;r<ROWS;r++){y=r*BH;var w=new THREE.Path(),k=P(w);
      k.M(X,y+41.58).C(X,y+54.98,x+74.62,y+61.74,x+72.04,y+63.43).C(x+74.64,y+64.97,X,y+71.05,X,y+83.14).L(X,y+41.58);s.holes.push(w);}
    for(r=0;r<ROWS-1;r++){y=r*BH;var j=new THREE.Path(),m=P(j);
      m.M(X,y+100.64).C(X,y+116.37,x+72.07,y+127.79,x+56.46,y+127.79).C(x+72.06,y+BH,X,y+BH+11.42,X,y+BH+27.15).L(X,y+100.64);s.holes.push(j);}
  }
  return s;
}
var DEPTH=387; // comprimento do tijolo (era 290, +1/3)
var geo=new THREE.ExtrudeGeometry(brickShape(),{depth:DEPTH,bevelEnabled:false,curveSegments:18});
var capMat=new THREE.MeshBasicMaterial({color:INK}),sideMat=new THREE.MeshBasicMaterial({color:GROUND});
var brick=new THREE.Group(),inner=new THREE.Mesh(geo,[capMat,sideMat]);
inner.position.set(-TW/2,TH/2,-DEPTH/2);
brick.add(inner);brick.scale.setScalar(0.01);
// Linhas na face lateral, como no desenho original: ao nível dos miolos de cada B e da junta entre linhas
var LINE_Y=[57.08,68.95,116.36,127.79,139.44,184.87,196.74];
var lineMat=new THREE.MeshBasicMaterial({color:INK,side:THREE.DoubleSide});
var strips=[];
LINE_Y.forEach(function(y){
  var g=new THREE.PlaneGeometry(DEPTH,1);
  var m=new THREE.Mesh(g,lineMat);
  m.rotation.y=Math.PI/2;                // plano vertical, ao longo da profundidade
  m.position.set(-0.6,-y,DEPTH/2);       // encostado à face esquerda (x=0), um pouco por fora
  inner.add(m);strips.push(m);
});
var LINE_PX=1.1; // espessura das linhas em px de ecrã
function stripWidth(){var hPx=canvas.clientHeight,units=(cam.top-cam.bottom)/0.01;var w=LINE_PX*units/hPx;strips.forEach(function(m){m.scale.y=w;});}

var scene=new THREE.Scene();scene.add(brick);

var cam=new THREE.OrthographicCamera(-1,1,1,-1,0.1,50);cam.position.set(0,0,10);

// Passagem de normais + profundidade para desenhar as linhas
var normMat=new THREE.ShaderMaterial({
  vertexShader:'varying vec3 vN;varying float vD;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.0);vD=-mv.z;gl_Position=projectionMatrix*mv;}',
  fragmentShader:'varying vec3 vN;varying float vD;void main(){gl_FragColor=vec4(normalize(vN),vD);}'
});
var rtOpts={type:THREE.HalfFloatType,minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter};
var rtColor=new THREE.WebGLRenderTarget(2,2,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter});
var rtNorm=new THREE.WebGLRenderTarget(2,2,rtOpts);
var post=new THREE.ShaderMaterial({
  uniforms:{tC:{value:rtColor.texture},tN:{value:rtNorm.texture},px:{value:new THREE.Vector2()},ink:{value:new THREE.Color(INK)}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',
  fragmentShader:[
  'uniform sampler2D tC;uniform sampler2D tN;uniform vec2 px;uniform vec3 ink;varying vec2 vUv;',
  'vec4 N(vec2 u){vec4 a=texture2D(tN,u);if(a.w>0.001)return a;',
  ' vec4 l=texture2D(tN,u-vec2(px.x,0.0)),r=texture2D(tN,u+vec2(px.x,0.0));',
  ' if(l.w>0.001&&r.w>0.001)return (l+r)*0.5;',
  ' vec4 d=texture2D(tN,u-vec2(0.0,px.y)),t=texture2D(tN,u+vec2(0.0,px.y));',
  ' if(d.w>0.001&&t.w>0.001)return (d+t)*0.5;return a;}',
  'vec3 Cc(vec2 u){vec4 a=texture2D(tN,u);if(a.w>0.001)return texture2D(tC,u).rgb;',
  ' vec4 l=texture2D(tN,u-vec2(px.x,0.0)),r=texture2D(tN,u+vec2(px.x,0.0));',
  ' if(l.w>0.001&&r.w>0.001)return texture2D(tC,u-vec2(px.x,0.0)).rgb;',
  ' vec4 d=texture2D(tN,u-vec2(0.0,px.y)),t=texture2D(tN,u+vec2(0.0,px.y));',
  ' if(d.w>0.001&&t.w>0.001)return texture2D(tC,u-vec2(0.0,px.y)).rgb;return texture2D(tC,u).rgb;}',
  'float e(vec4 a,vec4 b){',
  ' float ia=step(0.001,a.w),ib=step(0.001,b.w);',
  ' if(ia!=ib) return 1.0; if(ia<0.5) return 0.0;',
  ' if(dot(normalize(a.xyz),normalize(b.xyz))<0.82) return 1.0;',
  ' if(abs(a.w-b.w)>0.09) return 1.0; return 0.0;}',
  'void main(){vec4 n=N(vUv);float k=0.0;',
  ' k=max(k,e(n,N(vUv+vec2(px.x,0.0))));k=max(k,e(n,N(vUv-vec2(px.x,0.0))));',
  ' k=max(k,e(n,N(vUv+vec2(0.0,px.y))));k=max(k,e(n,N(vUv-vec2(0.0,px.y))));',
  ' vec3 c=Cc(vUv); gl_FragColor=vec4(mix(c,ink,k),1.0);}'
  ].join('\n'),depthTest:false,depthWrite:false
});
var quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),post),postScene=new THREE.Scene(),postCam=new THREE.Camera();
postScene.add(quad);quad.frustumCulled=false;

function resize(){
  var w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(Math.max(window.devicePixelRatio||1,2),3);
  renderer.setPixelRatio(dpr);renderer.setSize(w,h,false);
  var W=Math.round(w*dpr),H=Math.round(h*dpr);rtColor.setSize(W,H);rtNorm.setSize(W,H);
  post.uniforms.px.value.set(1/W,1/H);
  var half=2.85,a=w/h;
  if(a>=1){cam.left=-half*a;cam.right=half*a;cam.top=half;cam.bottom=-half;}
  else{cam.left=-half;cam.right=half;cam.top=half/a;cam.bottom=-half/a;}
  cam.updateProjectionMatrix();stripWidth();
}

// Posição inicial parecida com o desenho: vê-se a frente, o topo e o lado esquerdo
var start=new THREE.Quaternion().setFromEuler(new THREE.Euler(0.42,0.62,0,'XYZ'));
brick.quaternion.copy(start);

var dragging=false,last=null,vel=new THREE.Vector2(),idle=0,X=new THREE.Vector3(),Q=new THREE.Quaternion();
function rot(dx,dy){var l=Math.hypot(dx,dy);if(!l)return;X.set(dy/l,dx/l,0);Q.setFromAxisAngle(X,l*0.0085);brick.quaternion.premultiply(Q);}
canvas.addEventListener('pointerdown',function(e){dragging=true;last={x:e.clientX,y:e.clientY};vel.set(0,0);try{canvas.setPointerCapture(e.pointerId);}catch(_){} hideHint();});
canvas.addEventListener('pointermove',function(e){if(!dragging)return;var dx=e.clientX-last.x,dy=e.clientY-last.y;last={x:e.clientX,y:e.clientY};rot(dx,dy);vel.set(dx,dy);idle=0;});
function up(){dragging=false;}
canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
canvas.addEventListener('dblclick',function(){brick.quaternion.copy(start);vel.set(0,0);});
canvas.addEventListener('keydown',function(e){var k={ArrowLeft:[-14,0],ArrowRight:[14,0],ArrowUp:[0,-14],ArrowDown:[0,14]}[e.key];if(k){e.preventDefault();rot(k[0],k[1]);idle=0;hideHint();}});
var hint=hero.querySelector('.hint');function hideHint(){hint.style.opacity='0';}

var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var prev=performance.now();
function frame(t){
  var dt=Math.min((t-prev)/16.67,3);prev=t;
  if(!dragging){
    if(vel.lengthSq()>0.01){rot(vel.x*dt,vel.y*dt);vel.multiplyScalar(Math.pow(0.94,dt));}
    else if(!reduce){idle+=dt;if(idle>90){Q.setFromAxisAngle(new THREE.Vector3(0,1,0),0.0035*dt*Math.min(1,(idle-90)/60));brick.quaternion.premultiply(Q);}}
  }
  renderer.setRenderTarget(rtColor);renderer.clear();renderer.render(scene,cam);
  scene.overrideMaterial=normMat;renderer.setClearColor(0x000000,0);
  renderer.setRenderTarget(rtNorm);renderer.clear();renderer.render(scene,cam);
  scene.overrideMaterial=null;renderer.setClearColor(GROUND,1);
  renderer.setRenderTarget(null);renderer.render(postScene,postCam);
  requestAnimationFrame(frame);
}
resize();window.addEventListener('resize',resize);
requestAnimationFrame(frame);
})();

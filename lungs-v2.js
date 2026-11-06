/* V2: minh họa SVG nhiều giai đoạn, không phải ảnh chụp hoặc chẩn đoán y khoa. */
'use strict';
(() => {
const days=[0,1,2,3,4,6,8,10,12,14,18,21,24,28,32,45,60,90,120,180,270,365,730,1825];
const labels=['Bắt đầu','24 giờ','48 giờ','72 giờ','Ngày 4','Ngày 6','Ngày 8','Ngày 10','Ngày 12','2 tuần','Ngày 18','3 tuần','Ngày 24','4 tuần','Ngày 32','45 ngày','2 tháng','3 tháng','4 tháng','6 tháng','9 tháng','1 năm','2 năm','5 năm'];
const notes=[
 'Bắt đầu hành trình không thuốc. Hình ảnh tối mang tính biểu tượng.',
 'Ngày đầu tiên: một bước quyết định.',
 'Hai ngày kiên trì, vẫn còn nhiều thử thách.',
 'Ba ngày: tiếp tục vượt qua cảm giác thèm thuốc.',
 'Bốn ngày: xây dựng nhịp sống mới.',
 'Gần một tuần: hãy ghi nhận thành quả.',
 'Hơn một tuần kiên trì không thuốc.',
 'Mười ngày: những thói quen mới đang hình thành.',
 'Tiếp tục bảo vệ những ngày không hút.',
 'Hai tuần: tuần hoàn có thể dần cải thiện.',
 'Mỗi ngày là một lần chọn không hút.',
 'Ba tuần: giữ vững nhịp sống mới.',
 'Duy trì sự kiên định trong từng hoàn cảnh.',
 'Bốn tuần: đừng chủ quan với cơn thèm.',
 'Hơn một tháng không hút liên tục.',
 'Sáu tuần: hãy nhìn lại chặng đường đã đi.',
 'Hai tháng: tiếp tục giữ gìn sức khỏe.',
 'Ba tháng: chức năng phổi có thể cải thiện ở một số người.',
 'Bốn tháng: thêm nhiều ngày không khói thuốc.',
 'Sáu tháng: triệu chứng hô hấp có thể cải thiện dần.',
 'Chín tháng: hành trình lâu dài đáng trân trọng.',
 'Một năm: nhiều nguy cơ sức khỏe đã giảm so với tiếp tục hút.',
 'Hai năm: lợi ích sức khỏe tiếp tục tích lũy.',
 'Năm năm: nguy cơ bệnh liên quan thuốc lá tiếp tục giảm.'
];
const svg=document.getElementById('lungIllustration');
const timeline=document.getElementById('lungTimeline');
const photo=document.getElementById('lungPhoto'), healthy=document.getElementById('lungPhotoHealthy');
const level=document.getElementById('lungVisualLevel');
if(photo){const sample=new Image();sample.onload=()=>photo.classList.add('loaded');sample.onerror=()=>console.warn('Ảnh phổi không tải được, dùng hình dự phòng');sample.src='lung-reference-original.webp?v=5';}
if(!svg||!timeline)return;
const NS='http://www.w3.org/2000/svg';
const left='M307 148 C275 119 225 118 192 137 C150 161 118 205 107 270 C91 361 114 448 164 464 C203 477 267 458 293 419 C309 391 307 346 305 302 L305 211 Z';
const right='M333 148 C365 119 415 118 448 137 C490 161 522 205 533 270 C549 361 526 448 476 464 C437 477 373 458 347 419 C331 391 333 346 335 302 L335 211 Z';
function lerp(a,b,t){return Math.round(a+(b-a)*t)}
function color(a,b,t){return '#'+a.map((v,i)=>lerp(v,b[i],t).toString(16).padStart(2,'0')).join('')}
const s=(tag,attrs={},parent=svg)=>{const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);parent.appendChild(el);return el};
const defs=s('defs');
const makeGradient=(id,stops)=>{const g=s('radialGradient',{id,cx:'40%',cy:'28%',r:'78%'},defs);for(const [offset,c,op] of stops)s('stop',{offset,'stop-color':c,'stop-opacity':op??1},g)};
makeGradient('lungGlow', [['0%','#ffffff',.2],['55%','#bfc6da',.035],['100%','#000000',0]]);
const gradL=s('linearGradient',{id:'lungLeft',x1:'0%',x2:'100%',y1:'0%',y2:'90%'},defs);
const gradR=s('linearGradient',{id:'lungRight',x1:'100%',x2:'0%',y1:'0%',y2:'90%'},defs);
const stopsL=[s('stop',{offset:'0%'},gradL),s('stop',{offset:'45%'},gradL),s('stop',{offset:'100%'},gradL)];
const stopsR=[s('stop',{offset:'0%'},gradR),s('stop',{offset:'45%'},gradR),s('stop',{offset:'100%'},gradR)];
for(const [id,path] of [['leftClip',left],['rightClip',right]]){const cp=s('clipPath',{id},defs);s('path',{d:path},cp)}
const backdrop=s('g',{class:'lung-backdrop'});s('ellipse',{cx:320,cy:280,rx:245,ry:225,fill:'url(#lungGlow)'},backdrop);
for(let i=0;i<4;i++)s('ellipse',{cx:320,cy:282,rx:160+i*28,ry:150+i*24,fill:'none',stroke:'#a8f7e2','stroke-opacity':.09-i*.018},backdrop);
const anatomy=s('g',{class:'breathing-lungs'});
const flesh=s('g',{},anatomy);
const lungShapes=[s('path',{d:left,fill:'url(#lungLeft)',stroke:'#f6c0a8','stroke-width':2.1},flesh),s('path',{d:right,fill:'url(#lungRight)',stroke:'#f6c0a8','stroke-width':2.1},flesh)];
const shadows=[];
for(const [n,clip] of [['L','leftClip'],['R','rightClip']]){
 const g=s('g',{'clip-path':`url(#${clip})`},anatomy);
 const side=n==='L'?-1:1;
 s('ellipse',{cx:320+side*112,cy:310,rx:105,ry:190,fill:'#190f19',opacity:.09},g);
 for(let i=0;i<64;i++){
   const t=i*2.399963,rad=Math.sqrt((i+.5)/64),x=320+side*(104+Math.cos(t)*78*rad),y=297+Math.sin(t)*162*rad;
   const size=5+(i*19%23),alpha=.15+(i*11%10)/42;
   const blob=s('ellipse',{cx:x,cy:y,rx:size*1.5,ry:size*.76,transform:`rotate(${(i*31)%160-80} ${x} ${y})`,fill:i%4?'#211923':'#462e35',opacity:alpha},g);
   shadows.push({el:blob,i,alpha,size});
 }
 for(let i=0;i<18;i++){
  let x=320+side*(71+(i*17)%88),y=164+(i*23)%267;
  s('path',{d:`M ${x} ${y} q ${side*23} 12 ${side*18} 42`,fill:'none',stroke:'#f5b4a8','stroke-opacity':.16,'stroke-width':1.5},g)
 }
}
const bronchi=s('g',{},anatomy);
s('path',{d:'M320 68 L320 164 Q320 183 307 195 L276 224 M320 164 Q320 183 333 195 L364 224',fill:'none',stroke:'#633d42','stroke-width':34,'stroke-linecap':'round','stroke-linejoin':'round'},bronchi);
s('path',{d:'M320 68 L320 164 Q320 183 307 195 L276 224 M320 164 Q320 183 333 195 L364 224',fill:'none',stroke:'#e7a99d','stroke-width':27,'stroke-linecap':'round','stroke-linejoin':'round'},bronchi);
s('path',{d:'M320 68 L320 163',fill:'none',stroke:'#fae0cf','stroke-width':7,'stroke-opacity':.52,'stroke-linecap':'round'},bronchi);
for(const [sx,sg] of [[-1,1],[1,1]]){
 const branches=s('g',{stroke:'#c1857d','stroke-width':8,'stroke-linecap':'round',fill:'none',opacity:.55},anatomy);
 s('path',{d:`M ${320+sx*44} 200 Q ${320+sx*105} 247 ${320+sx*113} 332 M ${320+sx*91} 269 L ${320+sx*154} 236 M ${320+sx*107} 312 L ${320+sx*169} 348 M ${320+sx*115} 349 L ${320+sx*158} 411`},branches);
}
const nameEl=document.getElementById('lungStageLabel');
const hintEl=document.getElementById('lungStageNote');
const actualEl=document.getElementById('lungActual');
const labelEl=document.getElementById('lungPreviewLabel');
const reset=document.getElementById('lungBackNow');
let currentDays=0,preview=-1,rendered=-1;
const fmt=n=>n<1?'Mới bắt đầu':n<30?`${Math.floor(n)} ngày`:`${Math.floor(n)} ngày`;
function indexAt(day){let i=0;for(let j=1;j<days.length;j++){if(day>=days[j])i=j;else break}return i}
function render(index){
 const i=Math.max(0,Math.min(days.length-1,index));
 if(rendered===i)return;rendered=i;
 const t=i/(days.length-1);
 if(healthy)healthy.style.opacity=String(Math.min(1,Math.pow(t,.74)));
 if(level)level.textContent='Mức minh họa '+(i+1)+'/24';
 if(photo)photo.style.setProperty('--lung-stage',String(i));
 const start=[65,48,54],end=[230,149,148];
 const mid=color(start,end,t);
 const light=color([103,75,80],[255,206,184],t);
 const dark=color([30,30,38],[173,95,109],t);
 for(const stops of [stopsL,stopsR]){stops[0].setAttribute('stop-color',light);stops[1].setAttribute('stop-color',mid);stops[2].setAttribute('stop-color',dark)}
 for(const p of lungShapes)p.setAttribute('stroke',color([115,78,83],[255,211,198],t));
 for(const v of shadows){
  const visible=((v.i*13+i*5)%71)<(67-i*2.15);
  v.el.style.opacity=visible?Math.max(.035,v.alpha*(1-t*.91)):0;
  v.el.setAttribute('rx',Math.max(1,v.size*(1.6-t*.8)));
 }
 nameEl.textContent=labels[i]+' · Giai đoạn '+(i+1)+'/'+days.length;
 hintEl.textContent=notes[i];
 labelEl.textContent='Đang xem: '+labels[i];
 [...timeline.children].forEach((b,j)=>{b.classList.toggle('active',j===i);b.classList.toggle('reached',days[j]<=currentDays);b.setAttribute('aria-pressed',String(j===i))});
}
days.forEach((d,i)=>{
 const b=document.createElement('button');b.type='button';b.className='lung-step';b.textContent=labels[i];b.title=notes[i];b.addEventListener('click',()=>{preview=i;rendered=-1;render(i);reset.hidden=false});
 timeline.appendChild(b);
});
reset.addEventListener('click',()=>{preview=-1;rendered=-1;render(indexAt(currentDays));reset.hidden=true});
window.setLungProgress=hours=>{
 currentDays=Math.max(0,(Number(hours)||0)/24);
 actualEl.textContent='Hiện tại: '+fmt(currentDays)+' không hút liên tục';
 render(preview>=0?preview:indexAt(currentDays));
 if(preview<0)reset.hidden=true;
};
window.setLungProgress(0);
})();
/* Subtle interaction: a pseudo-3D parallax tilt without changing medical anatomy. */
(() => {
const stage=document.getElementById('lungStage'),photo=document.getElementById('lungPhoto');
if(!stage||!photo)return;
let dragging=false,startX=0,startY=0;
stage.addEventListener('pointerdown',ev=>{dragging=true;startX=ev.clientX;startY=ev.clientY;stage.setPointerCapture?.(ev.pointerId)});
stage.addEventListener('pointermove',ev=>{if(!dragging)return;const dx=Math.max(-60,Math.min(60,ev.clientX-startX)),dy=Math.max(-60,Math.min(60,ev.clientY-startY));photo.style.setProperty('--lung-tilt',(dx*.18).toFixed(2)+'deg');photo.style.setProperty('--lung-tilt-x',(-dy*.11).toFixed(2)+'deg')});
const end=()=>{dragging=false;photo.style.setProperty('--lung-tilt','0deg');photo.style.setProperty('--lung-tilt-x','0deg')};
stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);stage.addEventListener('lostpointercapture',end);
})();

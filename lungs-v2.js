/* V6 — 24 symbolic stages, using two distinct user-provided medical-style lung images. */
'use strict';
(() => {
 const days=[0,1,2,3,4,6,8,10,12,14,18,21,24,28,32,45,60,90,120,180,270,365,730,1825];
 const labels=['Bắt đầu','24 giờ','48 giờ','72 giờ','Ngày 4','Ngày 6','Ngày 8','Ngày 10','Ngày 12','2 tuần','Ngày 18','3 tuần','Ngày 24','4 tuần','Ngày 32','45 ngày','2 tháng','3 tháng','4 tháng','6 tháng','9 tháng','1 năm','2 năm','5 năm'];
 const notes=[
  'Ngày đầu tiên không thuốc. Hình ảnh phổi nặng chỉ mang tính biểu tượng.',
  '24 giờ: anh đã chủ động vượt qua ngày đầu tiên.',
  '48 giờ: thêm một ngày không khói thuốc.',
  '72 giờ: tiếp tục vượt qua các cơn thèm.',
  'Ngày thứ tư: cố gắng giữ vững quyết định.',
  'Sáu ngày: một tuần đã rất gần.',
  'Tám ngày: hành trình đã qua một tuần.',
  'Mười ngày: duy trì thói quen không thuốc.',
  'Mười hai ngày: những lựa chọn mới tiếp tục được củng cố.',
  'Hai tuần: giữ vững động lực.',
  'Ngày mười tám: một mốc đáng ghi nhận.',
  'Ba tuần: tiếp tục xây dựng cuộc sống không thuốc.',
  'Ngày hai mươi tư: tiến gần tròn một tháng.',
  'Bốn tuần: vượt qua một chặng đường quan trọng.',
  'Ngày ba mươi hai: một tháng không khói thuốc.',
  '45 ngày: sức khỏe cần được chăm sóc lâu dài.',
  'Hai tháng: tiếp tục kiên trì.',
  'Ba tháng: những lợi ích cai thuốc có thể tích lũy theo thời gian.',
  'Bốn tháng: giữ nếp sống không thuốc.',
  'Sáu tháng: tiến thêm một chặng đường dài.',
  'Chín tháng: tiếp tục tránh thuốc lá và khói thuốc.',
  'Một năm: một cột mốc lớn của sự kiên trì.',
  'Hai năm: bền bỉ bảo vệ sức khỏe.',
  'Năm năm: tiếp tục sống không khói thuốc.'
 ];
 const stage=document.getElementById('lungStage');
 const photo=document.getElementById('lungPhoto');
 const healthy=document.getElementById('lungPhotoHealthy');
 const fallback=document.getElementById('lungIllustration');
 const timeline=document.getElementById('lungTimeline');
 const level=document.getElementById('lungVisualLevel');
 const title=document.getElementById('lungStageLabel');
 const note=document.getElementById('lungStageNote');
 const actual=document.getElementById('lungActual');
 const previewLabel=document.getElementById('lungPreviewLabel');
 const reset=document.getElementById('lungBackNow');
 if(!photo||!healthy||!timeline)return;
 let day=0,preview=-1,last=-1;
 const imagePaths=['lung-bad-v6.avif','lung-good-v6.avif'];
 Promise.all(imagePaths.map(path=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src=path;})))
 .then(()=>{photo.classList.add('loaded');if(fallback)fallback.style.display='none';})
 .catch(()=>{if(fallback)fallback.style.display='block';console.warn('Unable to load V6 image pair')});
 function stageAt(d){let i=0;for(let n=1;n<days.length;n++){if(d>=days[n])i=n;else break}return i}
 function updateStage(i){
   i=Math.max(0,Math.min(23,i));
   if(last===i)return;last=i;
   const blend=Math.pow(i/23,.83); // Artistic crossfade only, NOT a medical recovery estimate
   healthy.style.opacity=String(blend);
   if(level)level.textContent='Giai đoạn '+(i+1)+'/24';
   title.textContent=labels[i]+' · Giai đoạn '+(i+1)+'/24';
   note.textContent=notes[i];
   previewLabel.textContent='Đang xem: '+labels[i];
   [...timeline.children].forEach((b,j)=>{b.classList.toggle('active',i===j);b.classList.toggle('reached',days[j]<=day);b.setAttribute('aria-pressed',String(i===j))});
 }
 days.forEach((d,i)=>{
   const button=document.createElement('button');button.type='button';button.className='lung-step';button.textContent=labels[i];
   button.addEventListener('click',()=>{preview=i;last=-1;updateStage(i);reset.hidden=false});
   timeline.appendChild(button);
 });
 reset.addEventListener('click',()=>{preview=-1;last=-1;updateStage(stageAt(day));reset.hidden=true});
 window.setLungProgress=hours=>{
   day=Math.max(0,Number(hours)||0)/24;
   actual.textContent='Hiện tại: '+(day<1?'Mới bắt đầu':Math.floor(day)+' ngày')+' không hút liên tục';
   updateStage(preview>=0?preview:stageAt(day));
 };
 window.setLungProgress(0);
 let dragging=false,startX=0,startY=0;
 stage.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;startY=e.clientY});
 stage.addEventListener('pointermove',e=>{if(!dragging)return;
   const dx=Math.max(-60,Math.min(60,e.clientX-startX));const dy=Math.max(-50,Math.min(50,e.clientY-startY));
   photo.style.setProperty('--lung-tilt',(dx*.14).toFixed(1)+'deg');
   photo.style.setProperty('--lung-tilt-x',(-dy*.09).toFixed(1)+'deg');
 });
 const end=()=>{dragging=false;photo.style.setProperty('--lung-tilt','0deg');photo.style.setProperty('--lung-tilt-x','0deg')};
 stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);stage.addEventListener('pointerleave',end);
})();
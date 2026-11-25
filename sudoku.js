(()=>{'use strict';
const $=id=>document.getElementById(id), dlg=$('sudokuDialog'), board=$('sudokuBoard');
let puzzle=[],solution=[],entries=[],selected=-1,started=0,timer=null;const difficulty=$('sudokuDifficulty'),levelName=$('sudokuLevelName');
let activeCraving=false;
const player=new URLSearchParams(location.search).get('player')||'nathan',storeKey='sudoku_cravings_'+player;
const today=()=>new Date().toLocaleDateString('en-CA');
let state={saved:null,events:[],records:{},next:null};
try{const s=JSON.parse(localStorage.getItem(storeKey)||'null');if(s&&Array.isArray(s.events)){state.events=s.events;state.records=s.records||{};state.next=s.next||null;if(s.saved&&[s.saved.puzzle,s.saved.solution,s.saved.entries].every(a=>Array.isArray(a)&&a.length===81))state.saved=s.saved}}catch(e){console.warn(e)}
const levels=['easy','medium','hard','expert','master','extreme'], names={easy:'Dễ',medium:'Trung bình',hard:'Khó',expert:'Chuyên gia',master:'Bậc thầy',extreme:'Cực khó'};
let gameLevel='medium', hints=0, finished=false;
function rating(input){
 const b=input.slice(), units=Array.from({length:27},(_,u)=>Array.from({length:9},(_,k)=>u<9?u*9+k:u<18?k*9+u-9:(Math.floor((u-18)/3)*3+Math.floor(k/3))*9+(u-18)%3*3+k%3));
 const peers=Array.from({length:81},(_,i)=>[...new Set(units.filter(u=>u.includes(i)).flat())].filter(j=>j!==i));
 const c=b.map((v,i)=>v?[]:[1,2,3,4,5,6,7,8,9].filter(n=>valid(b,i,n)));
 let rank=0;
 function place(i,n){b[i]=n;c[i]=[];for(const j of peers[i])c[j]=c[j].filter(x=>x!==n)}
 while(b.includes(0)){
 let i=c.findIndex(a=>a.length===1);if(i>=0){place(i,c[i][0]);continue}
 let changed=false;
 for(const u of units){for(let n=1;n<=9;n++){const a=u.filter(j=>c[j].includes(n));if(a.length===1){place(a[0],n);rank=Math.max(rank,1);changed=true;break}}if(changed)break}if(changed)continue;
 for(const u of units){for(const i of u){if(c[i].length!==2)continue;const pair=u.filter(j=>c[j].join()===c[i].join());if(pair.length!==2)continue;for(const j of u)if(!pair.includes(j)){const a=c[j].filter(n=>!c[i].includes(n));if(a.length!==c[j].length){c[j]=a;changed=true}}}}if(changed){rank=Math.max(rank,2);continue}
 for(const u of units){for(let n=1;n<=9;n++){const a=u.filter(j=>c[j].includes(n));if(a.length<2)continue;for(const v of units){if(v===u||!a.every(j=>v.includes(j)))continue;for(const j of v)if(!u.includes(j)&&c[j].includes(n)){c[j]=c[j].filter(x=>x!==n);changed=true}}}}if(changed){rank=Math.max(rank,2);continue}
 for(let n=1;n<=9;n++)for(const transpose of [false,true]){const idx=(r,k)=>transpose?k*9+r:r*9+k;const rows=Array.from({length:9},(_,r)=>Array.from({length:9},(_,k)=>k).filter(k=>c[idx(r,k)].includes(n)));for(let a=0;a<9;a++)for(let d=a+1;d<9;d++)if(rows[a].length===2&&rows[a].join()===rows[d].join())for(let r=0;r<9;r++)if(r!==a&&r!==d)for(const k of rows[a]){const j=idx(r,k);if(c[j].includes(n)){c[j]=c[j].filter(x=>x!==n);changed=true}}}if(changed){rank=Math.max(rank,3);continue}
 // Remaining puzzles are graded by unresolved cells, not a full advanced-technique solver.
 return b.filter(v=>!v).length>=35?5:4;
 }return rank;
}
function recordStats(){const el=$('sudokuRecords');if(!el)return;el.textContent=levels.map(k=>{const a=state.records[k]||{};return names[k]+': '+(a.wins||0)+' ván · Kỷ lục '+(a.best==null?'—':Math.floor(a.best/60)+':'+String(a.best%60).padStart(2,'0'))}).join(' | ')}
function complete(){if(finished)return;finished=true;clearInterval(timer);state.saved=null;const a=state.records[gameLevel]||(state.records[gameLevel]={wins:0,streak:0});a.wins++;if(!hints){const sec=Math.max(1,Math.floor((Date.now()-started)/1000));a.best=a.best==null?sec:Math.min(a.best,sec);a.streak++;}else a.streak=0;let msg='🎉 Hoàn thành Sudoku!';if(a.streak>=5&&levels.indexOf(gameLevel)<5){state.next=levels[levels.indexOf(gameLevel)+1];a.streak=0;msg+=' Lần sau tự nâng lên '+names[state.next]+'.'}if(activeCraving){event('overcome');activeCraving=false}persist();stats();recordStats();$('sudokuMessage').textContent=msg;$('sudokuMessage').style.color='#91efcc'}
function persist(){try{localStorage.setItem(storeKey,JSON.stringify(state));return true}catch(e){alert('Không lưu được dữ liệu trên thiết bị.');return false}}
function stats(){const events=state.events.filter(e=>e.day===today());const el=$('crapStats');if(el)el.textContent='Cơn thèm hôm nay: '+events.filter(e=>e.type==='start').length+' · Đã vượt qua: '+events.filter(e=>e.type==='overcome').length+(state.saved?' · Có Sudoku đang lưu':'')}
function event(type){state.events.push({day:today(),at:new Date().toISOString(),type});persist();stats()}
function snapshot(){state.saved={puzzle:puzzle.slice(),solution:solution.slice(),entries:entries.slice(),difficulty:gameLevel,hints,elapsed:Math.max(0,Date.now()-started)};return persist()}
function resume(){const s=state.saved;if(!s)return false;puzzle=s.puzzle.slice();solution=s.solution.slice();entries=s.entries.slice();difficulty.value=levels.includes(s.difficulty)?s.difficulty:'medium';gameLevel=difficulty.value;hints=s.hints||0;finished=false;started=Date.now()-Math.max(0,s.elapsed||0);selected=-1;levelName.textContent=names[difficulty.value]||'Trung bình';$('sudokuMessage').textContent='Đã mở lại Sudoku đã lưu.';paint();clearInterval(timer);time();timer=setInterval(time,1000);if(!dlg.open)dlg.showModal();return true}
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function valid(b,pos,n){const r=Math.floor(pos/9),c=pos%9;for(let k=0;k<9;k++){if(b[r*9+k]===n||b[k*9+c]===n)return false;const p=(Math.floor(r/3)*3+Math.floor(k/3))*9+Math.floor(c/3)*3+k%3;if(b[p]===n)return false}return true}
function solveCount(b,limit=2){let best=-1,opts=null;for(let i=0;i<81;i++)if(!b[i]){let o=[];for(let n=1;n<=9;n++)if(valid(b,i,n))o.push(n);if(!o.length)return 0;if(!opts||o.length<opts.length){best=i;opts=o;if(o.length===1)break}}if(best<0)return 1;let count=0;for(const n of opts){b[best]=n;count+=solveCount(b,limit-count);if(count>=limit)break}b[best]=0;return count}
function candidate(){const rows=shuffle([0,1,2]), bands=shuffle([0,1,2]);const order=bands.flatMap(b=>rows.map(r=>b*3+r));const cols=shuffle([0,1,2]).flatMap(b=>shuffle([0,1,2]).map(c=>b*3+c));const nums=shuffle([1,2,3,4,5,6,7,8,9]);solution=Array.from({length:81},(_,i)=>nums[(order[Math.floor(i/9)]*3+Math.floor(order[Math.floor(i/9)]/3)+cols[i%9])%9]);puzzle=solution.slice();let removed=0;for(const i of shuffle(Array.from({length:81},(_,i)=>i))){if(removed>=({easy:35,medium:43,hard:51,expert:54,master:57,extreme:60}[difficulty.value]||43))break;const old=puzzle[i];puzzle[i]=0;if(solveCount(puzzle.slice())!==1)puzzle[i]=old;else removed++}entries=puzzle.slice();selected=-1;started=Date.now()}
function generate(){const target=levels.indexOf(difficulty.value);let best=null;for(let t=0;t<30;t++){candidate();const rank=rating(puzzle),delta=Math.abs(rank-target);if(!best||delta<best.delta)best={p:puzzle.slice(),s:solution.slice(),rank,delta};if(!delta)break}puzzle=best.p;solution=best.s;entries=puzzle.slice();selected=-1;started=Date.now();gameLevel=levels[best.rank];difficulty.value=gameLevel;levelName.textContent=names[gameLevel];hints=0;finished=false;return best.delta===0}

function time(){const s=Math.floor((Date.now()-started)/1000);$('sudokuTime').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function paint(){board.replaceChildren();const completed=Array.from({length:9},(_,n)=>entries.filter(v=>v===n+1).length===9);document.querySelectorAll('[data-sdk-number]').forEach(b=>{const done=completed[Number(b.dataset.sdkNumber)-1];b.classList.toggle('sdk-complete',done);b.setAttribute('aria-label','Số '+b.dataset.sdkNumber+(done?' đã điền đủ 9 ô':''))});for(let i=0;i<81;i++){const cell=document.createElement('button');cell.type='button';const sr=Math.floor(selected/9),sc=selected%9,cr=Math.floor(i/9),cc=i%9;cell.className='sdk-cell'+(puzzle[i]?' fixed':'')+(i===selected?' chosen':selected>=0&&(cr===sr||cc===sc)?' sdk-related':'')+(selected>=0&&i!==selected&&entries[selected]&&entries[i]===entries[selected]?' sdk-same':'');cell.textContent=entries[i]||'';cell.setAttribute('aria-label','Hàng '+(Math.floor(i/9)+1)+', cột '+(i%9+1)+', '+(entries[i]||'trống'));cell.style.borderRightWidth=i%3===2&&i%9!==8?'3px':'1px';cell.style.borderBottomWidth=Math.floor(i/9)%3===2&&i<72?'3px':'1px';if(!puzzle[i]&&entries[i]&&!valid(entries.slice().map((v,j)=>j===i?0:v),i,entries[i]))cell.classList.add('wrong');cell.onclick=()=>{selected=i;paint()};board.append(cell)}}
function set(n){if(finished||selected<0||puzzle[selected])return;entries[selected]=n;paint();if(entries.every((v,i)=>v===solution[i]))complete()}
function openNew(){levelName.textContent=names[difficulty.value]||'Trung bình';const exact=generate();$('sudokuMessage').textContent=exact?'Tập trung vào từng ô.':'Đã chọn đề gần nhất theo mức độ thực tế.';$('sudokuMessage').style.color='';paint();clearInterval(timer);time();timer=setInterval(time,1000);if(!dlg.open)dlg.showModal()}
$('crapSudoku').onclick=()=>{event('start');activeCraving=true;if(!resume()){if(levels.includes(state.next)){difficulty.value=state.next;state.next=null;persist()}openNew()}};
difficulty.onchange=()=>{if(dlg.open){state.saved=null;persist();openNew()}};
$('sudokuNew').onclick=()=>{if(confirm('Tạo một bảng Sudoku mới? Bảng hiện tại sẽ mất.')){state.saved=null;persist();openNew()}};
$('sudokuClose').onclick=()=>dlg.close();
$('sudokuSave').onclick=()=>{if(finished){dlg.close();return}if(snapshot()){if(activeCraving){event('overcome');activeCraving=false}dlg.close();stats();alert('Đã lưu Sudoku để chơi tiếp và ghi nhận vượt qua cơn thèm!')}};
$('sudokuErase').onclick=()=>set(0);
$('sudokuHint').onclick=()=>{if(finished)return;const blanks=entries.map((v,i)=>!puzzle[i]&&v!==solution[i]?i:-1).filter(i=>i>=0);if(!blanks.length)return;const i=blanks[Math.floor(Math.random()*blanks.length)];hints++;entries[i]=solution[i];selected=i;paint();$('sudokuMessage').textContent='Đã gợi ý một ô.';if(entries.every((v,j)=>v===solution[j]))complete()};
document.querySelectorAll('[data-sdk-number]').forEach(b=>b.onclick=()=>set(Number(b.dataset.sdkNumber)));
document.addEventListener('keydown',e=>{if(!dlg.open)return;if(/^[1-9]$/.test(e.key))set(Number(e.key));if(e.key==='Backspace'||e.key==='Delete')set(0)});
dlg.addEventListener('close',()=>{clearInterval(timer);activeCraving=false});
stats();recordStats();document.addEventListener('visibilitychange',()=>{if(!document.hidden)stats()});
})();
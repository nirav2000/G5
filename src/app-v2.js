import {lessons} from "./course.js";
import {initPlatform} from "./platform.js";
import {drawStave,playTones} from "./staff.js";
import {read,persist,record,reviewStatus,mockQuestions,mockResult,blank} from "./engine.js";

let shared=null;
let state=read(),active=0,step=0,hints=0,done=false,mock=null;
const $=id=>document.getElementById(id);
const topicCaptions={
 rhythm:"Find the beat",staff:"Meet the notes",keys:"Unlock the sharps",
 intervals:"Leap between notes",metre:"Feel the pulse",chords:"Build a harmony",
 transposition:"A change of key",cadences:"Musical full stops",terms:"Read the directions",voices:"Explore the orchestra"
};
function safeSave(){try{persist(state)}catch{$("notice").textContent="Device storage unavailable: progress may not be saved."}}
function localDay(iso){const d=new Date(iso);return Number.isFinite(+d)?new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime():null}
function practiceStreak(events,now=new Date()){
 const days=new Set(events.map(e=>localDay(e.at)).filter(x=>x!==null));
 const today=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();
 let day=days.has(today)?today:today-86400000,count=0;
 while(days.has(day)){count++;day-=86400000}
 return count;
}
function todayCount(events,now=new Date()){
 const day=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();
 return events.filter(e=>localDay(e.at)===day).length
}
function firstReviewIndex(){
 const i=lessons.findIndex(l=>state.events.some(e=>e.lessonId===l.id)&&reviewStatus(state.events,l.id).due);
 if(i>=0)return i;
 const newOne=lessons.findIndex(l=>!state.events.some(e=>e.lessonId===l.id));
 return newOne>=0?newOne:lessons.findIndex(l=>reviewStatus(state.events,l.id).due)
}
function progress(){
 const doneIds=new Set(state.events.filter(e=>e.correct).map(e=>e.lessonId));
 const dueIds=new Set(lessons.filter(l=>state.events.some(e=>e.lessonId===l.id)&&reviewStatus(state.events,l.id).due).map(l=>l.id));
 const today=todayCount(state.events),streak=practiceStreak(state.events);
 $("progress").textContent=doneIds.size+" / "+lessons.length;
 $("heroCount").textContent=doneIds.size+" / "+lessons.length;
 $("attempts").textContent=String(state.events.length);
 $("reviews").textContent=String(dueIds.size);
 $("streak").textContent=streak+" "+(streak===1?"day":"days");
 $("dailySummary").textContent=today>=5
  ?"You've answered "+today+" questions today. Beautiful consistency!"
  :today+" of 5 questions answered today. Every try counts.";
 $("dailyFill").style.width=Math.min(100,today/5*100)+"%";
 $("dailyTrack").setAttribute("aria-valuenow",String(Math.min(5,today)));
 $("heroNext").textContent=dueIds.size?dueIds.size+" topic"+(dueIds.size===1?"":"s")+" ready for another listen":"Follow your curiosity today";
 $("topics").replaceChildren(...lessons.map((l,i)=>{
  const b=document.createElement("button");b.type="button";
  b.className="topic"+(i===active?" chosen":"")+(doneIds.has(l.id)?" done":"");
  b.setAttribute("aria-pressed",String(i===active));
  b.setAttribute("aria-label",l.title+", grade "+l.grade+(dueIds.has(l.id)?", due for review":""));
  const symbol=document.createElement("span");symbol.className="topic-symbol";symbol.textContent=l.icon;symbol.setAttribute("aria-hidden","true");
  const copy=document.createElement("span");copy.className="topic-copy";
  const name=document.createElement("span");name.className="topic-name";name.textContent=l.title;
  const caption=document.createElement("span");caption.className="topic-caption";caption.textContent=topicCaptions[l.id]||"Discover music";
  copy.append(name,caption);
  const tag=document.createElement("span");tag.className="topic-meta";
  tag.textContent=dueIds.has(l.id)?"↺ Review":doneIds.has(l.id)?"✓ Tried":"G"+l.grade;
  b.append(symbol,copy,tag);
  b.addEventListener("click",()=>open(i,true));return b
 }))
}
function show(view){
 for(const id of ["learn","mock","results","resources","account"])$(id).hidden=id!==view;
 document.querySelectorAll("[data-view]").forEach(b=>b.setAttribute("aria-current",b.dataset.view===view?"page":"false"));
 document.body.classList.toggle("is-mock",view==="mock");
 if(view==="results")showResults()
}
function demo(l){
 const box=$("notation");box.replaceChildren();
 if(["staff","interval","chord","keys","transposition","voices"].includes(l.demo)){
  drawStave(box,{notes:l.demo==="chord"?[{step:0,label:"C"},{step:2,label:"E"},{step:4,label:"G"}]:[{step:0,label:"E"},{step:4,label:"B"}]})
 }else{
  const div=document.createElement("div");div.className="visual";
  div.textContent=l.demo==="rhythm"?"♩ + ♪ = ♩.      ♩. = ♪ ♪ ♪":"p     <     f";
  box.append(div)
 }
}
function open(i,scroll=false){
 active=i;step=0;hints=0;done=false;show("learn");render();
 if(scroll)$("lessonWorkspace").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"})
}
function render(){
 const l=lessons[active];
 $("lessonTitle").textContent=l.title;
 $("lessonSymbol").textContent=l.icon;
 $("grade").textContent="Chapter "+(active+1)+" · Foundation Grade "+l.grade;
 $("intro").textContent=l.intro;
 const teaching=step<l.steps.length;
 $("lessonStep").textContent=teaching?l.steps[step]:"Now try it yourself. You've got this!";
 $("stage").textContent=teaching?"Listen · learn · "+(step+1)+" of "+l.steps.length:"Your turn · Guided question";
 $("continue").hidden=!teaching;
 $("practice").hidden=teaching;
 $("hint").hidden=teaching;
 $("lessonFeedback").textContent="";
 $("hintText").textContent="";
 const ticks=[...$("lessonSteps").children];
 ticks.forEach((el,i)=>{el.className=i<step?"complete":i===step?"active":""});
 $("lessonSteps").setAttribute("aria-label","Lesson step "+(step+1)+" of "+(l.steps.length+1));
 $("lessonAnswers").replaceChildren();
 if(!teaching)l.choices.forEach((choice,i)=>{
  const b=document.createElement("button");b.type="button";
  b.textContent=choice;b.disabled=done;
  b.addEventListener("click",()=>answer(i));$("lessonAnswers").append(b)
 });
 $("question").textContent=teaching?"":l.question;demo(l);progress()
}
function answer(i){
 if(done)return;
 done=true;const l=lessons[active],correct=i===l.answer;
 state=record(state,{lessonId:l.id,correct,hints,mode:hints?"guided":"practice"});
 safeSave();
 shared?.record({concept:l.id,correct,hints,mode:hints?"guided":"practice"});
 $("lessonFeedback").textContent=(correct?"That sounds right! ":"A useful discovery. ")+l.why;
 $("lessonFeedback").className=correct?"good":"learn-more";
 $("lessonAnswers").querySelectorAll("button").forEach((b,j)=>{b.disabled=true;if(j===l.answer)b.dataset.correct="true"});
 progress()
}
function startMock(){mock={questions:mockQuestions(),answers:[],index:0};show("mock");renderMock();window.scrollTo({top:0,behavior:"instant"})}
function renderMock(){
 const q=mock.questions[mock.index],n=mock.index;
 $("mockCount").textContent="Question "+(n+1)+" of "+mock.questions.length+" · "+q.section;
 $("mockProgress").style.width=(n/mock.questions.length*100)+"%";
 $("mockQuestion").textContent=q.question;
 $("mockAnswers").replaceChildren(...q.choices.map((choice,i)=>{
  const b=document.createElement("button");b.textContent=choice;b.type="button";
  b.addEventListener("click",()=>{
   mock.answers.push(i);mock.index++;
   if(mock.index===mock.questions.length)finishMock();else renderMock()
  });return b
 }))
}
function finishMock(){
 const result=mockResult(mock.answers,mock.questions);
 state.mocks.push({at:new Date().toISOString(),...result});safeSave();
 mock=null;show("results");window.scrollTo({top:0,behavior:"instant"})
}
function showResults(){
 const answered=state.events.length,independent=state.events.filter(e=>e.correct&&e.hints===0).length;
 $("progressNarrative").textContent=answered
  ?answered+" learning attempts recorded, including "+independent+" correct answers without hints. Asking for help is part of learning, too."
  :"Every attempt teaches you something, including the ones where you ask for help.";
 const result=state.mocks.at(-1);
 $("resultHeading").textContent=result?result.score+" / "+result.total+" · "+result.band:"No practice paper completed yet";
 $("resultDetails").replaceChildren(...(result?Object.entries(result.sections).map(([name,v])=>{
  const p=document.createElement("p");p.textContent=name+": "+v.correct+" / "+v.total;return p
 }):[]))
}
$("continue").addEventListener("click",()=>{step=Math.min(step+1,lessons[active].steps.length);render()});
$("hint").addEventListener("click",()=>{hints++;$("hintText").textContent=lessons[active].hint});
$("retry").addEventListener("click",()=>{step=lessons[active].steps.length;hints=0;done=false;render()});
$("sound").addEventListener("click",()=>playTones(lessons[active].demo==="interval"?[261.63,311.13]:[261.63,329.63,392]));
$("nextLesson").addEventListener("click",()=>open((active+1)%lessons.length,true));
$("heroContinue").addEventListener("click",()=>open(firstReviewIndex()>=0?firstReviewIndex():active,true));
$("reviewNow").addEventListener("click",()=>open(firstReviewIndex()>=0?firstReviewIndex():active,true));
$("startMock").addEventListener("click",startMock);
$("exitMock").addEventListener("click",()=>{mock=null;show("learn")});
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.view)));
$("export").addEventListener("click",()=>{
 const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="g5-progress.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
});
$("reset").addEventListener("click",()=>{
 if(!confirm("Delete G5 practice history on this device? This cannot be undone."))return;
 state=blank();safeSave();open(0);showResults()
});
open(0);
initPlatform(message=>{$("notice").textContent=message;$("syncState").textContent=message},
 user=>{
  $("accountState").textContent=user?"Signed in: "+(user.email||"account"):"Guest practice";
  $("logout").hidden=!user;$("importGuest").hidden=!user;
  $("login").hidden=!!user;$("register").hidden=!!user
 },
 (data,owner)=>{$("syncState").textContent=(owner==="guest"?"Device":"Account")+" history: "+data.events.length+" learning events"}
).then(result=>{shared=result}).catch(e=>{$("accountError").textContent=e.message});
for(const [id,method] of [["login","signIn"],["register","register"],["google","google"],["logout","signOut"],["resetPassword","resetPassword"],["importGuest","importGuest"]]){
 $(id).addEventListener("click",async()=>{
  try{
   if(!shared)throw Error("Account services still loading");
   if(id==="importGuest"&&!confirm("Copy guest learning history into this signed-in account?"))return;
   const email=$("email").value.trim(),password=$("password").value;
   if(["login","register"].includes(id)&&(!email||password.length<8))throw Error("Enter an email and password of at least eight characters");
   await (["login","register"].includes(id)?shared[method](email,password):id==="resetPassword"?shared[method](email):shared[method]());
   $("accountError").textContent=id==="resetPassword"?"If the account exists, a reset email will be sent.":""
  }catch(e){$("accountError").textContent=e.message}
 })
}

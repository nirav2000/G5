// G5-only shared services. All failures leave offline lessons usable.
const ROOT="https://nirav2000.github.io/Apps/";
const addScript=url=>new Promise((ok,fail)=>{const s=document.createElement("script");s.src=url;s.onload=ok;s.onerror=()=>fail(Error("Unable to load shared platform"));document.head.append(s)});
export async function initPlatform(onStatus=()=>{}){
 const r={installed:[],failed:[],services:{},cloud:false};
 try{
  await addScript(ROOT+"platform/v1/index.js");
  const p=window.AppsPlatformV1;
  if(!p||p.version!=="1.7.0")throw Error("Unsupported Apps Platform version");
  const install=async(name,options={})=>{try{const service=await p.loadCapability(name,options,{appId:"g5"});r.services[name]=service;r.installed.push(name);return service}catch(e){r.failed.push(name+": "+e.message);return null}};
  await install("auth",{mode:"shadow"});
  const learning=await install("learning");
  if(learning)r.services.learningStore=learning.createLearningStore({appId:"g5",learnerId:"guest"});
  const sync=await install("learningSync");
  if(sync)r.services.sync=sync.create({appId:"g5",learnerId:"guest",accountId:"guest"});
  await install("notes",{ui:false,reviewFeed:false,appVersion:"0.3.1"});
  const pwa=await install("pwa");
  if(pwa)try{await pwa.initPWA({scope:"/G5/",serviceWorkerUrl:"/G5/sw.js"})}catch(e){r.failed.push("pwa registration: "+e.message)}
  for(const name of ["account","privacy","monitor","firebaseUsage"])await install(name);
  onStatus("Shared libraries: "+r.installed.join(", ")+(r.failed.length?"; unavailable: "+r.failed.join("; "):"")+". Cloud storage not configured.");
 }catch(e){r.failed.push("platform: "+e.message);onStatus("Local learning mode: "+e.message)}
 r.record=({concept,correct,hints,mode})=>{try{if(!r.services.learningStore)return;const store=r.services.learningStore;store.record({concept,correct,hints,mode});r.services.sync?.capture(store.getState())}catch(e){onStatus("Shared learning record unavailable: "+e.message)}};
 window.G5Shared=r;return r;
}

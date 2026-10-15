// Explicit G5-only shared capability installation. Cloud writes are disabled until secured transport is configured.
const ROOT="https://nirav2000.github.io/Apps/";
const loadScript=url=>new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=url;s.onload=resolve;s.onerror=()=>reject(Error("Shared platform unavailable"));document.head.append(s)});
export async function initPlatform(onStatus=()=>{}){
 const status=message=>{onStatus(message);document.dispatchEvent(new CustomEvent("g5:platform-status",{detail:message}))};
 const result={installed:[],failed:[],services:{},cloud:false};
 try{
  await loadScript(ROOT+"platform/v1/index.js");
  const p=window.AppsPlatformV1;
  if(!p||p.version!=="1.7.0")throw Error("Unexpected shared platform version");
  // Isolate failures: a single capability must not block novice practice.
  const configs=[["auth",{mode:"shadow"}],["learning",true],["learningSync",true],["notes",{ui:false,appVersion:"0.3.0",reviewFeed:false}],["pwa",true],["account",false],["privacy",false],["monitor",false],["firebaseUsage",false]];
  for(const [name,options] of configs){if(options===false)continue;try{
   if(name==="pwa"){const module=await p.loadCapability(name,{}, {appId:"g5"});result.services.pwa=module;await module.initPWA({serviceWorkerUrl:"/G5/sw.js",scope:"/G5/"});}
   else if(name==="learning"){result.services.learning=await p.loadCapability(name,{}, {appId:"g5"});result.services.learningStore=result.services.learning.createLearningStore({appId:"g5",learnerId:"guest"});}
   else if(name==="learningSync"){result.services.learningSync=await p.loadCapability(name,{}, {appId:"g5"});result.services.sync=result.services.learningSync.create({appId:"g5",learnerId:"default",accountId:"guest"});}
   else result.services[name]=await p.loadCapability(name,options,{appId:"g5"});
   result.installed.push(name);
  }catch(e){result.failed.push(name+": "+e.message)}}
  // Account/privacy/monitor are intentionally not loaded: they require consent and tested identity wiring.
  status("Shared libraries: "+result.installed.join(", ")+(result.failed.length?"; unavailable: "+result.failed.join("; "):"")+" · Cloud sync not enabled.");
 }catch(e){result.failed.push("platform: "+e.message);status("Local mode · "+e.message)}
 window.G5Shared=result;return result;
}

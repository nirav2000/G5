import {connectFirebase} from "./firebase.js";
const ROOT="https://nirav2000.github.io/Apps/";
const load=url=>new Promise((ok,fail)=>{const s=document.createElement("script");s.src=url;s.onload=ok;s.onerror=()=>fail(Error("Shared platform unavailable"));document.head.append(s)});
export async function initPlatform(onStatus=()=>{},onAccount=()=>{},onSnapshot=()=>{}){
 const r={installed:[],failed:[],services:{},cloud:false,user:null,store:null,sync:null,ready:false};
 const status=message=>onStatus(message);
 try{
  await load(ROOT+"platform/v1/index.js");const p=window.AppsPlatformV1;
  if(p?.version!=="1.7.0")throw Error("Unsupported Apps Platform");
  const add=async(name,options={})=>{try{const s=await p.loadCapability(name,options,{appId:"g5"});r.services[name]=s;r.installed.push(name);return s}catch(e){r.failed.push(name+": "+e.message);return null}};
  await add("auth",{mode:"shadow"});
  const learning=await add("learning"),syncSDK=await add("learningSync");
  if(learning)r.store=learning.createLearningStore({appId:"g5",learnerId:"guest"});
  if(syncSDK)r.sync=syncSDK.create({appId:"g5",learnerId:"guest",accountId:"guest",onSnapshot});
  await add("notes",{ui:false,reviewFeed:false,appVersion:"0.4.0"});
  const pwa=await add("pwa");if(pwa)try{await pwa.initPWA({scope:"/G5/",serviceWorkerUrl:"/G5/sw.js"})}catch(e){r.failed.push("pwa registration: "+e.message)}
  for(const name of ["account","privacy","monitor","firebaseUsage"])await add(name);
  try{
   const fb=await connectFirebase();r.firebase=fb;
   r.services.account?.bindFirebase?.({auth:fb.auth,authMod:fb.authSDK,app:"G5"});
   fb.authSDK.onAuthStateChanged(fb.auth,async user=>{
    r.user=user||null;r.ready=false;onAccount(user||null);r.cloud=false;
    if(!learning||!syncSDK)return;
    r.sync?.dispose?.();
    const owner=user?.uid||"guest";
    r.store=learning.createLearningStore({appId:"g5",learnerId:owner});
    const transport=user?syncSDK.firestore({db:fb.db,auth:fb.auth,sdk:fb.firestoreSDK}):null;
    r.sync=syncSDK.create({appId:"g5",learnerId:"guest",accountId:owner,transport,onSnapshot});
    try{r.sync.capture(r.store.getState());if(user){await r.sync.sync();r.cloud=true;status("Cloud learning synchronised.")}else status("Guest learning is saved on this device.");}
    catch(e){status("Local learning saved; cloud sync unavailable: "+e.message)}
    finally{r.ready=true}
   });
  }catch(e){r.failed.push("firebase: "+e.message);r.ready=true;status("Device-only mode: "+e.message)}
  status("Shared libraries: "+r.installed.join(", ")+(r.failed.length?"; unavailable: "+r.failed.join("; "):""));
 }catch(e){r.failed.push("platform: "+e.message);r.ready=true;status("Device-only mode: "+e.message)}
 r.record=({concept,correct,hints,mode})=>{try{if(!r.ready||!r.store)return;const state=r.store.record({concept,correct,hints,mode});r.sync?.capture(state);if(r.cloud)r.sync.sync().catch(e=>status("Cloud retry pending: "+e.message))}catch(e){status("Shared learning error: "+e.message)}};
 r.signIn=(email,password)=>{if(!r.firebase)throw Error("Account service unavailable");return r.services.account?.signIn?.(email,password)||r.firebase.authSDK.signInWithEmailAndPassword(r.firebase.auth,email,password)};
 r.register=(email,password)=>{if(!r.firebase)throw Error("Account service unavailable");return r.firebase.authSDK.createUserWithEmailAndPassword(r.firebase.auth,email,password)};
 r.google=()=>{if(!r.firebase)throw Error("Account service unavailable");return r.firebase.authSDK.signInWithPopup(r.firebase.auth,new r.firebase.authSDK.GoogleAuthProvider())};
 r.signOut=()=>{if(!r.firebase)throw Error("Account service unavailable");return r.firebase.authSDK.signOut(r.firebase.auth)};
 r.resetPassword=email=>{if(!r.firebase)throw Error("Account service unavailable");return r.firebase.authSDK.sendPasswordResetEmail(r.firebase.auth,email)};
 r.importGuest=async()=>{if(!r.user||!r.sync)throw Error("Sign in first");r.sync.importGuest({approved:true});await r.sync.sync();status("Guest learning copied into signed-in account.")};
 window.G5Shared=r;return r;
}

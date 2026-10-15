// Uses the public web configuration endpoint already maintained by Apps Monitor.
// The Auth and Firestore clients must share the kk-syllabus Firebase app.
export async function connectFirebase(){
 const url="https://apps-monitor-api.nirav2000-github.workers.dev/notifications/public-config?app=g5";
 const response=await fetch(url);if(!response.ok)throw Error("Firebase public config unavailable");
 const payload=await response.json();const config=payload.webPush?.firebaseConfig;
 if(config?.projectId!=="kk-syllabus"||!config.apiKey||!config.appId)throw Error("kk-syllabus configuration unavailable");
 const [appSDK,authSDK,firestoreSDK]=await Promise.all(["firebase-app","firebase-auth","firebase-firestore"].map(name=>import("https://www.gstatic.com/firebasejs/12.18.0/"+name+".js")));
 const app=appSDK.getApps().find(a=>a.name==="g5")||appSDK.initializeApp(config,"g5");
 const auth=authSDK.getAuth(app);await authSDK.setPersistence(auth,authSDK.browserLocalPersistence);
 return {app,auth,db:firestoreSDK.getFirestore(app),authSDK,firestoreSDK};
}

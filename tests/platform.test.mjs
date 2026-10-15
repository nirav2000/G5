import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
test("G5 loads shared capabilities without breaking local mode",()=>{
 const s=readFileSync("src/platform.js","utf8");
 for(const name of ["auth","learning","learningSync","notes","pwa","account","privacy","monitor","firebaseUsage"])assert.match(s,new RegExp(name));
 assert.match(s,/appId:"g5"/);
 assert.match(s,/cloud:false/);
});
test("service worker caches current version and app-local assets only",()=>{
 const s=readFileSync("sw.js","utf8");
 assert.match(s,/g5-v0\.5\.0/);
 assert.match(s,/studio\.css/);
 assert.doesNotMatch(s,/\/Apps\/firebase-messaging-sw/);
});

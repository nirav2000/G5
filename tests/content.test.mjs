import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const html=readFileSync("index.html","utf8"),js=readFileSync("src/app-v2.js","utf8"),css=readFileSync("studio.css","utf8");
test("redesigned teaching studio has the same live functional controls",()=>{
 for(const id of ["topics","lessonTitle","grade","stage","lessonStep","notation","sound","continue","practice","hint","lessonAnswers","lessonFeedback","retry","nextLesson","startMock","mockAnswers","mockCount","exitMock","export","reset","account","login","logout","importGuest"]){
  assert.match(html,new RegExp('id="'+id+'"'));
 }
 assert.match(html,/aria-live="polite"/);
 assert.match(html,/v0\.5\.0/);
 assert.match(html,/src\/app-v2\.js/);
 assert.match(html,/studio\.css/);
 assert.match(js,/drawStave/);assert.match(js,/reviewStatus/);assert.match(js,/startMock/);
});
test("responsive, keyboard-accessible studio and quiet practice view",()=>{
 for(const text of ["prefers-reduced-motion","focus-visible","max-width:680px","\\.studio-layout","\\.topic\\.chosen","#mock"])assert.match(css,new RegExp(text));
 for(const id of ["heroContinue","reviewNow","dailyFill","mockProgress"])assert.match(js,new RegExp(id));
 assert.match(js,/aria-pressed/);
 assert.match(js,/data\.events/);
});

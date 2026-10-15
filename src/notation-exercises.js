import {drawStave} from "./staff.js";
export const clefBottomLine={treble:"E",bass:"G",alto:"F",tenor:"D"};
export function mountNoteFinder(host,{clef="treble",onAnswer=()=>{}}={}){if(!Object.hasOwn(clefBottomLine,clef))throw Error("Unknown clef");drawStave(host,{interactive:true,notes:[],onPick:step=>{const letters="CDEFGAB";const start=letters.indexOf(clefBottomLine[clef]);onAnswer(letters[(start+step)%7],step)}})}
export function intervalNumber(a,b){const letters="CDEFGAB";const x=letters.indexOf(a[0].toUpperCase()),y=letters.indexOf(b[0].toUpperCase());if(x<0||y<0)throw Error("Invalid note");return ((y-x+7)%7)+1}
export function transposeChromatic(note,semitones){const names=["C","C♯","D","E♭","E","F","F♯","G","A♭","A","B♭","B"];const n=names.indexOf(note);if(n<0)throw Error("Unsupported spelling");return names[((n+semitones)%12+12)%12]}

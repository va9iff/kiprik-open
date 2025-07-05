
///** @type {any} */
export let data = {
    at: 0,
"slides": 
    [ { "content": { 
    //i: {
    //is: "img",
    //src: "https://images.pexels.com/photos/12146871/pexels-photo-12146871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    //},
//"k": { "is": "rect", "text": "hi", "x": 84, "y": 20 } 
    } }, { "content": { "k": { "is": "rect", "text": "bye", "borderRadius": 13, "x": 100, "y": 30 } } }, { "content": { "k": { "is": "rect", "text": "BB", "x": 30, "y": 80 }, "h": { "is": "rect", "text": "hihi", "x": 40, "y": 80 } } } ]
}
data.slides[-1] = { content: {} }

export const setData = d => {
    data = d
    renewNums()
}


export const n = i => `calc(var(--r) * ${i})`
export const state = {} // persistent storage for aparat methods to store stuff at
export const plate = /** @type HTMLDivElement */ (document.querySelector(".slide"))
export const currentSlide = () => data.slides[data.at]
export const magic = 450


import { edits } from "./panel.js"
import { addFrame, resizeDotFor } from './edit.js'
import { renewNums } from "./botrow.js"
import { panel } from "./panel.js"
import { gallery, showGallery } from "./gallery.js"
import { byClass } from "./utils.js"
import { activeRecord, recordDur } from "./play.js"
import { noteField, renewNote } from "./notes.js"

// the currently editing item (prolly on panel)
export let editing = ""
/** @description only for when you cycle to a slide where 
 * there is an item with the same key that you were editing */
let lastEditing = ""
/** @description it just sets the `editing` id */
export const setEditing = (s) => {
    if (s) lastEditing = s
    editing = s
}
export const noEditing = () => {
    editing = ""
    lastEditing = ""
}
export const ids = {} // id (from pay.is): keyof<aparat>
import { aparat } from "./items/aparat.js"
/** @param {number} i */
export function go(i) {
    //console.log(data)
    if (!data.slides.length) addFrame()
    if (activeRecord) recordDur.innerText = activeRecord[i]?.duration ?? "-"
    data.at = i // experimental: might have broke something?
    // it was on the bottom of go() function.
    const slideContent = data.slides[i].content
    for (const id in slideContent) {
        const pay = slideContent[id]
        if (ids[id]) {
            aparat[ids[id]].apply(pay, id, true)
        }
        else {
            aparat[pay.is].init(pay, id)
            ids[id] = pay.is
        }
        if (id === lastEditing) edits(pay, lastEditing)
    }
    for (const id in ids) {
        if (!(slideContent[id])) {
            if (id === lastEditing) {
                setEditing("")
                showGallery()
                resizeDotFor(null)
            }
            aparat[ids[id]].die(id)
            delete ids[id]
        }
    }
    renewNums()
    renewNote()
}

const { backPlate } = byClass

backPlate.addEventListener("click", e => {
    showGallery()
    resizeDotFor(null)
})


resizeDotFor(null)

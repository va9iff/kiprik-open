import { editing, go } from "./coore.js";
import { data } from "./coore.js";
import { addFrame, addItem } from "./edit.js";

import { activeRecord, setIsRecording, recordPoint, resetRecordDur, recordingIntervalId, endRecord } from "./play.js";
import { showNotes } from "./notes.js";
import { renewNums } from "./botrow.js";
import { undo, redo } from "./undo.js";

const parseCopy = obj => JSON.parse(JSON.stringify(obj))

const back = () => {
    const prevSlide = data.at - 1
    if (prevSlide >= 0) {
        if (data.slides[prevSlide]?.content[editing]) {
            go(prevSlide)
            return
        }
        if (editing) {
            go(prevSlide)
            return
        }
        if (!editing) {
            go(prevSlide)
            return
        }
    }
    return
}

let copied = null
let copiedKey = 'clipboard'



/** @description inspired from vim names */
const word = () => {
    const nextSlide = data.at + 1
    if (nextSlide < data.slides.length) {
        if (data.slides[nextSlide]?.content[editing]) {
            go(nextSlide)
            return
        }
        if (editing) {
            go(nextSlide)
            return
        }
        if (!editing) {
            go(nextSlide)
            return
        }
    }
    return // if las tslide, just do nothing. you need W for it
}
document.addEventListener("keydown", e => {
        if (e.key === 'c' && e.ctrlKey) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return
            }
            copiedKey = editing
            copied = data.slides[data.at]?.content[editing]
            return
        }
        console.log(e)
        if (e.key === 'v' && e.ctrlKey) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return
            }
            if (!editing) console.warn("no editing to paste")
            if (!copied) console.warn("nothing copied to paste")
            if (data.slides[data.at]?.content[copiedKey]) {
                return alert('couldn\'t paste, name "' + 
                    copiedKey + '". item with the same name already exists.')
            }
            data.slides[data.at].content[copiedKey] = parseCopy(copied)
            go(data.at)
            return
        }
        if (e.key === 'd' && e.ctrlKey) {
            e.preventDefault()
            addFrame(parseCopy(data.slides[data.at].content), data.at+1)
            go(data.at+1)
            return
        }
        if (
            e.key === 'ArrowRight' && e.ctrlKey && e.shiftKey ||
            e.key === 'w' && e.altKey
        ) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return
            }
            if (data.at >= data.slides.length-1) return null
            const stored = data.slides[data.at]
            data.slides[data.at] = data.slides[data.at + 1]
            data.slides[data.at + 1] = stored
            go(data.at + 1)
            return
        }
        if (
            e.key === 'ArrowLeft' && e.ctrlKey && e.shiftKey ||
            e.key === 'b' && e.altKey
        ) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return
            }
            if (data.at <= 0) return null
            const stored = data.slides[data.at]
            data.slides[data.at] = data.slides[data.at - 1]
            data.slides[data.at - 1] = stored
            go(data.at - 1)
            return
        }
        if (e.key === "D") {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return
            }
            if (data.slides.length === 1) return
            data.slides.splice(data.at, 1)
            if (data.at >= data.slides.length - 1)
                data.at = data.slides.length - 2
            go(data.at)
            renewNums()
            return
        }

    if (e.key === 'z' && e.ctrlKey) {
        console.log('?')
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return
        }
        undo()
        return
    }

    if (e.key === 'Z' && e.ctrlKey) {
        console.log('zozo')
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return
        }
        redo()
        return
    }
})

document.addEventListener("keypress", e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return
    }
    if (e.key === "W") {
        const nextSlide = data.at + 1
        // at the end of the slide, add one
        if (nextSlide >= data.slides.length) {
            addFrame()
        }
        if (editing) {
            addItem(nextSlide, parseCopy(data.slides[data.at].content[editing]), editing)
        }
        go(nextSlide)
        return
    }
    if (e.key === "N") {
        showNotes(true)
    }
    if (e.key === 'w' || 
        e.key === 'ü'
    )
    {
        word()
    }
    if (e.key === 'b') {
        back()
    }
    if (e.key === 'n' && recordingIntervalId) {
        recordPoint()
    }
    if (e.key === 'p' && recordingIntervalId) {
        setIsRecording(false)
        resetRecordDur()
        back()
    }
    if (e.key === 'N' && recordingIntervalId) {
        endRecord()
    }
})

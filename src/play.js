// @ts-check

/**
you start a recording by picking the record file's name.
instantly you go to the previous slide, waiting for you to press n.
when you press n, you go to the next slide (the one you started recording in)
and the counter starts counting milliseconds.
when you press n again, the duration on the counter is assigned as the duration of the slide.
the counter resets to 0 and starts again for the next slide.
preserving the natural flow with your speech.

so
- you enter recording mode
- press n to start
- press n to end the current then start the next
- press N to end (or n at the last slide)

- if you hold the slide for too long or your tounge slippered, press p.
this will go to previous slide, resetting and stopping counter.
when you press n again, you'll go to the next slide (the one you pressed p at) and 
the counter will start again, 
like the previous one never happened and you came here in a row.
giving you the ability to "re-record" the flawed slide.

a behavior some may consider bug: when you start recording in slide 0, it don't go back
and then when you press n it jumps to slide 1. so you don't have time in slide 0.
but it is a feature. the slide 0 is like the beginning state. so when you have animation
and stuff, you just define the initial state in slide 0 then applying slide 1 creates 
the animations. nice.

*/

import { elements } from "./elements.js"
const { div, button, img } = elements
import { on, c, set, style, byClass } from "./utils.js"
import { dir, getdir } from "./dir.js"
import {  data, go, setEditing } from "./coore.js"
import { panel } from "./panel.js"
import { icon } from "./builtens.js"
import { Dirv } from "./dirv.js"
import { resizeDotFor } from "./edit.js"

export const trackAudio = /** @type HTMLAudioElement */
    (document.querySelector("audio.trackAudio"))

export let activeRecord = /** @type any */ (null)
let activeRecordName = "main-record"
let lastNow = null

const immerse = () => {
    document.body.classList.add("immersed")
}

const unimmerse = () => {
    document.body.classList.remove("immersed")
}

let trackFileName = "vo.mp3"
export const setTrackFileName = (/** @type string */ generatedUrl) => {
    console.log(generatedUrl)
    trackFileName = generatedUrl 
    trackAudio.src = trackFileName
}

const slideTimeouts = []
export const playButton = button(
    style({display: 'flex'}),
    icon.play(), 
    c.btn,
    on.click(async () => {
        const recordName = 
            window.prompt("type the name of your previous record to play",  "main-record")
        if (!recordName) throw new Error("bro didn't pick a record name")

        const fromSlide = data.at
        const recordsDir = await (await getdir()).cd('records', true)
        const recordString = await recordsDir.read(recordName)

        /**
         * @type {({
         *   slides: ({
         *     duration: number,
         *   })[]
         * } | null)}
         */
        const records = (JSON.parse(recordString) ?? {slides: []})
        immerse()
        go(fromSlide)
        slideTimeouts.length = 0
        let accumilatedTime = 0
        //trackAudio.src = trackFileName
        // do it in setTrackFileName
        let playFrom = (records?.slides[fromSlide]?.duration ?? 0) / 1000
        trackAudio.currentTime = playFrom
        for (const [i, record] of records?.slides.entries() ?? []) {
            if (i < fromSlide) continue
            if (!record) continue
            console.log(i, record)
            slideTimeouts.push(setTimeout(() => {
                go(i)
            }, accumilatedTime))
            accumilatedTime += record.duration

        }
        trackAudio.play()
        setTimeout(() => {
            unimmerse()
            recordDur.innerText = "~"
            trackAudio.pause()
        }, accumilatedTime + 1000)
    }),
)

/** @type {undefined | number} */
export let recordingIntervalId = undefined

export const { recordDur, recordEndBtn } = byClass

export const recordButton = button(
    style({display: 'flex'}),
    icon.camera(), 
    c.btn,
    on.click(async () => {
        isRecording = false
        const recordName = 
            window.prompt("type the name of your previous record to continue, " + 
            "or type a brand new name to create an empty one.", "main-record")
        if (!recordName) throw new Error("bro didn't pick a record name")

        const records = await (await getdir()).cd('records', true)
        const recordString = await records.either(recordName, '{"slides": []}')


        lastNow = Date.now()
        if (recordingIntervalId) clearInterval(recordingIntervalId)
        activeRecord = JSON.parse(recordString)
        const currentTime = activeRecord.slides[data.at] ?? 0
        if (data.at - 1 >= 0) go(data.at - 1)
        recordingIntervalId = setInterval(() => {
            recordDur.innerText = !isRecording ? `rec${(Math.floor((Date.now() / 500)) % 2) ? '~' : '-'}` :
                (((Date.now() - lastNow) / 1000).toFixed(2)).toString()
        }, 500)

        activeRecordName = recordName
        trackAudio.src = trackFileName
        trackAudio.currentTime = currentTime
    }),
)

export const resetRecordDur = () => {
    lastNow = Date.now()
}

export let isRecording = false
export const setIsRecording = (b = false) => isRecording = b
export const recordPoint = (i = data.at) => {
    if (i === data.slides.length - 1) endRecord()
    if (!isRecording) {
        isRecording = true
        const playFrom = ((activeRecord?.slides[i]?.duration) / 1000) || 0
        trackAudio.currentTime = playFrom
        trackAudio.play()
        if (i + 1 < data.slides.length) go(i + 1)
        lastNow = Date.now()
        resetRecordDur()
        return 
    }
    activeRecord.slides[i] = {
        duration: Date.now() - lastNow
    }
    resetRecordDur()
    if (i + 1 < data.slides.length) go(i + 1)
}

export const endRecord = async () => {
    trackAudio.pause()
    trackAudio.currentTime = 0
    clearInterval(recordingIntervalId)
    recordingIntervalId = undefined
    recordDur.innerText = "||"
    const records = await (await getdir()).cd('records', true)
    records.write(activeRecordName, JSON.stringify(activeRecord))
    //activeRecord = null
}

recordEndBtn.onclick = async () => {
    await endRecord()
}

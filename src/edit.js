import { byClass } from "./utils.js"
import { magic, n } from "./coore.js"
import { data } from "./coore.js"
import { renewNums } from "./botrow.js"
import { aparat } from "./items/aparat.js"
import { dragonfly } from "./utils.js"
import { editing } from "./coore.js"
import { plate } from "./coore.js"
import { edits } from "./panel.js"
import { checkpoint } from "./undo.js"

const { dot } = byClass

let dotDragon = () => {}

export const resizeDotFor = (/** @type any */pay, hard = true) => {
    if (!pay) {
        resizerPlate.classList.add('noshow')
        return
    }
    resizerPlate.classList.remove('noshow')
    dot.style.left = `calc(${n(pay.x + pay.width / (pay.centered ? 2 : 1))})`
    dot.style.top  = `calc(${n(pay.y + pay.height / (pay.centered ? 2 : 1))})`
    if (hard) {
        dotDragon()
        dotDragon = dragonfly(dot, ()=>{
            const initialWidth = pay.width
            const initialHeight = pay.height
            return (dx, dy) => {

                const magic = +getComputedStyle(document.documentElement).getPropertyValue('--magic')
                const fract = 1 / plate.offsetWidth * magic

                dx *= fract
                dy *= fract

                const width = initialWidth + dx
                const height = initialHeight + dy
                pay.width = width
                pay.height = height
                aparat[pay.is].apply(pay, editing) // editing is kinda hack but okay
                resizeDotFor(pay, false)
                console.log(pay.is)
            }}, () => {
                checkpoint()
                edits(pay, editing) // another hack here
            }
        )
    }
}

export const emptyFrame = (babaji = {}) => 
    JSON.parse(JSON.stringify(({ content: {}, ...babaji})))

export const addFrame = (content = {}, i = -1) => {
    if (i==-1) i = data.slides.length 
    data.slides.splice(i, 0, emptyFrame({ content }))
    //go(i)
    renewNums()
    return i
}

/** @description if slide `i` has no neighbouring slide containing 
 * an item on `id` with different type, then add. otherwise return null as fail indicator */
export const addItem = (i, pay, id = "k" + ("" + Math.random()).slice(2, 4)) => {
    for (const offset of [1, -1]) {
        const target = i + offset
        const slide = data.slides[target]
        if (!slide?.content[id]) continue
        console.log(slide.content[id])
        if (slide.content[id] && (slide.content[id].is !== pay.is)) {
            alert(
                `Neighbouring slides can't have different types of items with the same ID.\n\n` +
                `Type "${pay.is}" in slide ${i} with ID "${id}" mismatches the ` + 
                `type "${data.slides[target].content[id].is}" in slide ${target} with the same ID `
            )
            return null
        }
    }
    data.slides[i].content[id] = pay
    return id
}

const { resizerPlate } = byClass


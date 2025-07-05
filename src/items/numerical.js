// @ts-check

import { curvesFor } from "../curves.js"
import { elements } from "../elements.js"
const { div, button, input, span, h1, img } = elements
import { on, c, set, dragonfly  } from "../utils.js"

export const numerical = (/** @type string */ nam, /** @type number */ initial, ons = {}, /** @type any */opts = {}) => {
    const onneds = []
    for (const key in ons) {
        onneds.push(on[key](e => ons[key](+e.target.value)))
    }
    const slider = span(nam)
    if (opts.ctxClick)
        slider.oncontextmenu = e => {
            e.preventDefault()
            opts.ctxClick()

        }
    const bubble = input( ...onneds, set({ type: 'number', value: initial }), ...(opts.bubble ?? []))
    dragonfly(slider, () => {
        const initial = +bubble.value
        bubble.focus()
        return dx => {
            const newVal = initial + dx
            bubble.value = newVal + ''
            const returned = ons.input?.(newVal) // if has a input handler, call, since it's already an eager listener
            bubble.value = returned ?? bubble.value
        }
    }, () => {
        const returned = ons.change?.(+bubble.value) 
        bubble.value = returned ?? bubble.value
    })
    return div(
        c.numeric, 
        c.row, 
        c.cen,
        slider,
        bubble
    )
}

export const numeric = new Proxy(/** @type Record<string, (initial: number, ons: Record<string, (v: number) => any>, opts?: any) => any> */ ({}), {
    get(_, /** @type string */ prop) {
        return (/** @type {number} */ initial, 
                /** @type {Record<string, (v: number)=>{}>}> */ ons, /** @type any */ opts = {}) => 
            numerical(prop, initial, ons, opts)
    }
})


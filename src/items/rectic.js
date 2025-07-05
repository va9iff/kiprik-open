// @ts-check

import { byClass, dragonfly, grab } from "../utils.js"
import { edits } from "../panel.js"
import { magic, n, plate } from "../coore.js"
import { resizeDotFor } from "../edit.js"
import { checkpoint } from "../undo.js"

/** @import { rectPay } from "../types.d.ts" */

const getDefaultTransition = () => ({all: [200, 0, 0, 1, 1]})

/**
 * @description it's a side-effect function
 * that is called on pays, that's it. you don't 
 * manage its dragons, it manages it on pay's keys.
 * but you have to store its return value 
 * (which is a pay) to pass it on the next call 
 * for its cleanup.
 */
export const rectic = (
    prev, 
    /** @type {HTMLElement} */ el, 
    /** @type rectPay */ pay, 
    /** @type string */ id, 
    hard = false,
    opts = {}
) => {
    pay.x ??= 0
    pay.y ??= 0
    pay.zIndex ??= 10
    pay.width ??= 40
    pay.height ??= 40
    pay.borderRadius ??= 13
    const { removeDragon } = prev
    if (hard) { // when it's an apply is from go()
        removeDragon?.()
        prev.removeDragon = dragonfly(el, () => {
            rectic(prev, el, pay, id, false)
            const initialX = pay.x
            const initialY = pay.y
            resizeDotFor(pay)
            return (dx, dy) => {
                const magic = +getComputedStyle(document.documentElement).getPropertyValue('--magic')

                const fract = 1 / plate.offsetWidth * magic
                pay.x = initialX + dx * fract
                pay.y = initialY + dy * fract
                rectic(prev, el, pay, id, false)
                resizeDotFor(null)
            }
        }, () => {
            rectic(prev, el, pay, id, false)
            checkpoint()
            edits(pay, id)
        })
        // the [0] is wasted since I store it in scaleIn as separate value
        const scaleInT = pay.transitions?.scaleIn
        if (pay.scaleIn) {
            el.animate([
                {
                    scale: 0,
                },
                {
                    scale: 1,
                }
            ], {
                duration: pay.scaleIn,
                easing: scaleInT ? `cubic-bezier(${scaleInT[1]}, ${scaleInT[2]}, ${scaleInT[3]}, ${scaleInT[4]})` : 'ease'
            })
        }
    }
    const passingTransitions = ['scaleIn', 'position']

    let transitions = "all 300ms ease"
    if (pay.transitions?.position) {
        const [dur, c1, c2, c3, c4] = pay.transitions.position
        transitions += `, left ${dur}ms cubic-bezier(${c1}, ${c2}, ${c3}, ${c4})`
        transitions += `, top ${dur}ms cubic-bezier(${c1}, ${c2}, ${c3}, ${c4})`
    }
    for (const [key, [dur, c1, c2, c3, c4]] of Object.entries(pay.transitions ?? getDefaultTransition())) {
        if (passingTransitions.includes(key)) continue
        transitions += `, ${key} ${dur}ms cubic-bezier(${c1}, ${c2}, ${c3}, ${c4})`
    }

    let transform = pay.centered ? "translate(-50%, -50%)" : "translate(0, 0)"
    //transform += `, some stuff`

    el.style.opacity = (pay.opacity ?? 1) +''
    el.style.scale = (pay.scale ?? 1) +''
    el.style.rotate = (pay.rotate ?? 0) +'deg'

    el.style.transition = transitions
    el.style.transform = transform
    el.style.left = n(pay.x )
    el.style.top = n(pay.y )
    el.style.zIndex = pay.zIndex + ''
    el.style.width = n(pay.width )
    el.style.height = n(pay.height )
    el.style.borderRadius = pay.radiusPercent ? pay.borderRadius + "%" : n(pay.borderRadius)
    el.style.borderStyle = pay.borderStyle ?? "solid"
    el.style.boxSizing = 'border-box'
    el.style.borderWidth = n(pay.borderWidth ?? 0)
    el.style.borderColor = pay.borderColor + ""

    return prev
}


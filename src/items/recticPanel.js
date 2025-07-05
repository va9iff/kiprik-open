// @ts-check

import { numeric } from "./numerical.js"
import { resizeDotFor } from "../edit.js"
import { col, elements } from "../elements.js"
const { button, input, span, div } = elements
import { row } from "../elements.js"
import { dragonfly, set, on, c, style } from "../utils.js"
import { state } from "../coore.js"
import { curves } from "../curves.js"
import { checkpoint } from "../undo.js"

const colorPicker = (/** @type Object */ obj, /** @type string */ prop, opts = {}) => {
    let cola = obj[prop] ?? "#ffffffff"
    let opa = 255
    if (cola.length > 7) {
        opa = parseInt(cola.slice(-2), 16) 
        cola = cola.slice(0, -2) // order matters lol :d
    }
    console.log(obj[prop], cola, opa)
    return row(
            span(
                opts.title??prop,
                style({ minWidth: "40px" })
            ),
            input(
                c.colorPick,
                set({ type: 'color', value: cola }),
                on.input(e => {
                    cola = e.target.value
                    obj[prop] = cola + (opa).toString(16).padStart(2, '0')
                    opts.oninput?.()
                    console.log(obj[prop], cola, opa)
                })
            ),
            input(
                style({ flexGrow: 1+'' }),
                set({ type: 'range', step: 1, min: 0, max: 255, value: opa,  }),
                on.input((e) => {
                    opa = +e.target.value
                    console.log(opa)
                    obj[prop] = cola + opa.toString(16).padStart(2, '0')
                    opts.oninput?.()
    console.log(obj[prop], cola, opa)
                })
            ),

    )
}

export const recticPanel = (item, pay,id, el) => {
    const j = {}
    return [
        col(
        row(
            span( 'opacity', 
                on.click(() => {
                    pay.opacity = 1
                    item.apply(pay, id)
                }),
                on.contextmenu(e => {
                    e.preventDefault()
                    pay.transitions ??= {}
                    curves(pay.transitions, 'opacity', 'opacity')
                })
            ),
            input(
                style({ flexGrow: 1+'' }),
                set({ type: 'range', step: 0.01, value: pay.opacity +'', min: 0, max: 1 }),
                on.input((e) => {
                    pay.opacity = e.target.value
                    item.apply(pay, id)
                })
            ),
        ),
        row(
            span('scale', 
                on.click(() => {
                    pay.scale = 1
                    item.apply(pay, id)
                }),
                on.contextmenu(e => {
                    e.preventDefault()
                    pay.transitions ??= {}
                    curves(pay.transitions, 'scale', 'scale')
                })
            ), 
            input(
                style({ flexGrow: 1+'' }),
                set({ type: 'range', step: 0.01, value: pay.scale ?? 1, min: 0, max: 2 }),
                on.input(({ target }) => {
                    pay.scale = +target.value
                    item.apply(pay, id)
                })
            )),
        ),
        row(
            numeric.index(
            pay.zIndex ?? 10, 
            {
                input: v => {
                    if (v < 9) v = 9
                    pay.zIndex = v
                    item.apply(pay, id)
                    resizeDotFor(pay)
                    return v
                }
            })
        ),
        col(
            'in/out',
            numeric.scaleIn(pay.scaleIn, {
                input: v => {
                    if (v < 0) v = 0
                    pay.scaleIn = v
                    item.apply(pay, id, true)
                    resizeDotFor(pay)
                    return v
                }
            }, {
                ctxClick: e => {
                    pay.transitions ??= {}
                    curves(pay.transitions, 'scaleIn', 'scale in')
                }
            })
        ),
        row(
            input(set({ type: 'checkbox', checked: pay.centered }), on.change(e => {
                pay.centered = !!e.target.checked
                item.apply(pay, id)
                resizeDotFor(pay)
            })),
            button("position", b => {

                dragonfly(b, () => {
                    const initialX = pay.x
                    const initialY = pay.y
                    const magic = +getComputedStyle(document.documentElement).getPropertyValue('--magic')
                    const fract = 1 / Math.min(window.innerWidth, window.innerHeight) * magic
                    return (dx, dy) => {
                        dx *= fract
                        dy *= fract
                        const x = initialX + dx
                        const y = initialY + dy
                        pay.x = x
                        pay.y = y
                        item.apply(pay, id)
                    }
                }, () => checkpoint())
            }, on.contextmenu(e=> {
                e.preventDefault()
                pay.transitions ??= {}
                curves(pay.transitions, 'position', 'position')
            })
            ),
            numeric.x(pay.x ?? 0, {
                input: v => {
                    pay.x = v
                    item.apply(pay, id)
                    resizeDotFor(pay)
                }
            }, 
            {
                ctxClick: e => {
                    pay.transitions ??= {}
                    curves(pay.transitions, 'left', 'left')
                }
            }),
            numeric.y(pay.y ?? 0, {
                input: v => {
                    pay.y = v
                    item.apply(pay, id)
                    resizeDotFor(pay)
                }
            }, {
                ctxClick: e => {
                    pay.transitions ??= {}
                    curves(pay.transitions, 'top', 'top')
                }
            }),
        ),
        row(
            numeric.width(
            pay.width ?? 0, 
            {
                input: v => {
                    if (v < 0) v = 0
                    pay.width = v
                    item.apply(pay, id)
                    resizeDotFor(pay)
                    return v
                }
            },
            {
                ctxClick: e => {
                    pay.transitions ??= {}
                    curves(pay.transitions, 'width', 'width')
                }
            }),
            numeric.height(pay.height ?? 0, {
                input: v => {
                    if (v < 0) v = 0
                    pay.height = v
                    item.apply(pay, id)
                    resizeDotFor(pay)
                    return v
                }
            }, {
                ctxClick: e => {
                    pay.transitions ??= {}
                    curves(pay.transitions, 'height', 'height')
                }
            }),
        ),
        row(
            numeric.radius(pay.borderRadius ?? 12, {
                input: v => {
                    if (v < 0) v = 0
                    pay.borderRadius = v
                    item.apply(pay, id)
                    resizeDotFor(pay)
                    return v
                }
            }, {
                ctxClick: e => {
                    pay.transitions ??= {}
                    curves(pay.transitions, 'border-radius', 'radius')
                }
            }),
            input(set({ type: 'checkbox', checked: pay.radiusPercent }), on.change(e => {
                pay.radiusPercent = !!e.target.checked
                item.apply(pay, id)
                resizeDotFor(pay)
            })),

        ),
        row(
            numeric.rotate(pay.rotate ?? 0, {
                input: v => {
                    pay.rotate = v
                    item.apply(pay, id)
                    resizeDotFor(pay)
                    return v
                }
            }, {
                ctxClick: e => {
                    pay.transitions ??= {}
                    curves(pay.transitions, 'rotate', 'rotate')
                }
            }),

        ),
        colorPicker(
            pay, 
            'backgroundColor',
            {
                title: 'bg',
                oninput: () => {
                    item.apply(pay, id)
                }
            }
        ),
        colorPicker(pay, 'borderColor', {
            title: 'br',
            oninput: () => {
                item.apply(pay, id)
            }
        }),
        row(
            numeric.border(pay.borderWidth ?? 0, {
                input: v => {
                    if (v < 0) v = 0
                    pay.borderWidth = v
                    item.apply(pay, id)
                    return v
                }
            }, {
                ctxClick: e => {
                    pay.transitions ??= {}
                    curves(pay.transitions, 'border-width', 'radius')
                }
            }),
            input(
                c.colorPick,
                set({ type: 'color', value: pay.backgroundColor }),
                on.input(e => {
                    pay.borderColor = e.target.value
                    item.apply(pay, id)
                })
            ),

        )

    ]
}



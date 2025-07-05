// @ts-check
import { data, go,  n, plate, state } from "../coore.js"
import { aparat } from "./aparat.js"
import { rectic } from "./rectic.js"
import { edits } from "../panel.js"
import { elements, row, col } from "../elements.js"
const { div, button, pre, select, option, input, textarea, span, h1, img } = elements
import { on, c, set, dragonfly, style  } from "../utils.js"
import { numeric } from "./numerical.js"
import { addItem, resizeDotFor } from "../edit.js"
import { editing } from "../coore.js"
import { recticPanel } from "./recticPanel.js"
import { renamer } from "./renamer.js"
import { icon } from "../builtens.js"
import { checkpoint } from "../undo.js"
/** @import {rectPay} from "../types.d.ts" */

export const rect =  {
    init(pay, /** @type string */ id) {
        const el = pre(c.rect, pay.text)
        el.addEventListener("dblclick", () => {
            const ta = /** @type {HTMLTextAreaElement} */ (document.querySelector('.panel .textareal'))
            //ta.focus()
            ta.select();
            ta.scrollIntoView({behavior: 'smooth'})

        })
        plate.appendChild(el)
        el.id = id // for css. ## from its css textbox will be replaced with #itsId and added to dom as a style tag
        state[id] = { el, r: {} }
        rect.apply(pay, id, true)
    },
    die(/** @type string */ id) {
        const { el } = state[id]
        // insta for now
        el.remove()
        el.style.scale = 0.1
        setTimeout(() => el?.remove(), 1000)
        delete state[id]
    },
    apply(pay, /** @type string */ id, hard = false) {
        /**
         * @type {{ el: HTMLElement, r: any }}
         */
        const { el, r } = state[id]
        if (hard) {
            pay.fontSize ??= 12
            pay.fontFamily ??= 'Poppins'
            pay.alignItems ??= 'center'
            pay.justifyContent ??= 'center'
            //pay.justifyContent ??= 'start'
            pay.backgroundColor ??= '#EFD789'
            pay.color ??= '#2C3434'
        }

        state[id].r = rectic(r, el, pay, id, hard)

        el.innerText = pay.text
        el.style.fontSize = n((pay.fontSize))
        el.style.fontFamily = pay.fontFamily
        el.style.alignItems = pay.alignItems
        el.style.justifyContent = pay.justifyContent
        el.style.backgroundColor = pay.backgroundColor // ?? theme.bg2
        el.style.color = pay.color // ?? theme.color
    },

    panel: (pay,/** @type string */ id) => {
        let el
        try {
            ;({ el } = state[id])
        } catch (err) {
            console.error("KIPRIK: rect.panel with incomplete state." + 
                "probable cause - call of panel before init." + 
                "usual fix - go() to the slide to create state/elements." +
                "whole error messages are as follows:"
            )
            console.error(err)
        }
        //console.log(el)
        return div(
            c.floatingPanel,
            renamer(pay, id, (newId) => {
                edits(pay, newId)
            }),
            ...recticPanel(rect, pay, id, el),
            row(
                c.cen,
                'bg',
                input(
                    c.colorPick,
                    set({ type: 'color', value: pay.backgroundColor }),
                    on.input(e => {
                        pay.backgroundColor = e.target.value
                        rect.apply(pay, id)
                    }),
                    on.change(() => checkpoint())
                ),
                'fg',
                input(
                    c.colorPick,
                    set({ type: 'color', value: pay.color }),
                    on.input(e => {
                        pay.color = e.target.value
                        rect.apply(pay, id)
                    }),
                    on.change(() => checkpoint())
                ),
            ),
            row(
                numeric['font size'](pay.fontSize ?? 0, {
                    input: v => {
                        pay.fontSize = v
                        rect.apply(pay, id)
                    }
                }, {
                    bubble: [style({ width: '100px' })]
                }),
                select(on.change(e => {
                    const size = +e.target.value
                    pay.fontSize = size
                    rect.apply(pay, id)
                    edits(pay, id)
                }), ...([ 8, 12, 16, 20, 22, 24, 26, 32, 36].map(v => 
                    option(v, set({
                        value: v,
                        selected: v === pay.fontSize
                    }))
                )))
            ),
            row( 
                select(on.change(e => {
                    const family = e.target.value
                    pay.fontFamily = family
                    rect.apply(pay, id, true)
                    edits(pay, id)
                }), ...(['Poppins', 'Quicksand', '"JetBrains Mono"'].map(v => 
                    option(v, set({
                        value: v,
                        selected: v === pay.fontFamily
                    }))
                )))
            ),
            col(
                row(
                    c.radiorow,
                    span('align'),
                    input(set({ type: 'radio', name: 'align', checked: pay.alignItems ===  'start' }), on.change(
                        () => {
                            pay.alignItems = 'start'
                            rect.apply(pay, id)
                        }
                    )),
                    input(set({ type: 'radio', name: 'align', checked: pay.alignItems ===  'center' }), on.change(
                        () => {
                            pay.alignItems = 'center'
                            rect.apply(pay, id)
                        }
                    )),
                    input(set({ type: 'radio', name: 'align', checked: pay.alignItems ===  'end' }), on.change(
                        () => {
                            pay.alignItems = 'end'
                            rect.apply(pay, id)
                        }
                    )),
                ),
                row(
                    c.radiorow,
                    span('justify'),
                    input(set({ type: 'radio', name: 'justify' }), on.change(
                        () => {
                            pay.justifyContent = 'start'
                            rect.apply(pay, id)
                        }
                    )),
                    input(set({ type: 'radio', name: 'justify' }), on.change(
                        () => {
                            pay.justifyContent = 'center'
                            rect.apply(pay, id)
                        }
                    )),
                    input(set({ type: 'radio', name: 'justify' }), on.change(
                        () => {
                            pay.justifyContent = 'end'
                            rect.apply(pay, id)
                        }
                    )),
                ),
                textarea(
                    c.textareal,
                    set({ value: pay.text }),
                    on.input((e) => {
                        pay.text = e.target.value
                        rect.apply(pay, id)
                    }),
                    on.change(() => checkpoint())
                )
            ),
        )
    }
}

export const addRectBtn = button(
    icon.rect(), style({display: 'flex'}),
    c.btn,
    on.click(() => {
        const id = addItem(data.at, {
            "x": 84, "y": 20,
            is: 'rect', 
            backgroundColor: "#00000000",
            text: "-"
        })
        setTimeout(() => {
            // @ts-ignore
            document.body.querySelector("textarea.textareal")?.focus()
        }, 30)

        checkpoint()
        go(data.at)
        edits(data.slides[data.at].content[id], id)
    }),
)

aparat['rect'] = rect

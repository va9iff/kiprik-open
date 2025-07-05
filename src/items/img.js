import { aparat } from "./aparat.js"
import { elements } from "../elements.js"
const { img, button, input, div } = elements
import { rectic } from "./rectic.js"
import { plate, state } from "../coore.js"
import { set, c, on, style } from "../utils.js"
import { go } from "../coore.js"
import { data } from "../coore.js"
import { edits } from "../panel.js"
import { resizeDotFor } from "../edit.js"
import { recticPanel } from "./recticPanel.js"
import { renamer } from "./renamer.js"
import { fileUrls } from "../gallery.js"
import { row } from "../elements.js"

aparat.img = {
    init(pay, id) {
        const el = img(
            //set({ src: pay.src })
        )
        plate.appendChild(el)
        state[id] = { el, r: {} }            //this.apply(pay, id)
        aparat.img.apply(pay, id, true)
    },
    apply(pay, id, hard) {
        const { el, r } = /** @type {{ el: HTMLImageElement }} */ (state[id]);
        if (pay.file) {
            el.src = fileUrls[pay.file]
        }
        el.style.objectFit = pay.fit ? 'contain' : "cover"
        state[id].r = rectic(r, el, pay, id, hard)
    },
    die(id){
        const { el, r } = state[id]
        el.remove()
        delete state[id]
    },
    panel(pay, id) {
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
        return div(
            c.floatingPanel,
            renamer(pay, id, (newId) => {
                edits(pay, newId)
            }),
            row(
                'fit',
                input(set({ type: 'checkbox', checked: pay.fit }), on.change(e => {
                    pay.fit = !!e.target.checked
                    aparat.img.apply(pay, id)
                    resizeDotFor(pay)
                })),
            ),
            ...recticPanel(aparat.img, pay, id, el)
        )
    }
}


import { setEditing, ids } from "./coore.js"
import { aparat } from "./items/aparat.js"
import {  inside, place } from "./utils.js"
import { editing } from "./coore.js"
import { resizeDotFor } from "./edit.js"
import { byClass } from "./utils.js"

export const { homePanel } = byClass
export const panel = place(homePanel)

export const edits = (pay, id) => {
    setEditing(id)
    panel.set(aparat[ids[id]].panel(pay, id))

    if (id === editing)
        switch (ids[id]) {
            case 'rect':
            case 'img':
                resizeDotFor(pay)
                break
            default:
                resizeDotFor(null)
        }
}


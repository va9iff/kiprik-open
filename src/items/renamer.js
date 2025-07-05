import { elements } from "../elements.js"
const { input, select, option } = elements
import { c, on, style, set } from "../utils.js"
import { col, row } from "../elements.js"
import { data, go } from "../coore.js"
import { edits } from "../panel.js"
import { addItem } from "../edit.js"

const rename = (pay, id, newId) => {
    if (data.slides[data.at].content[newId]) {
        return alert("name \"" + newId + "\" already exists" + 
            " in slide " + data.at +
            " as " + data.slides[data.at].content[newId].is)
    }
    if (null !== addItem(data.at, pay, newId)) {
        delete data.slides[data.at].content[id] 
        go(data.at) // old.die, new.init
    } else return null
}

export const renamer = (pay, id, post = (_newId="") => {}) => col(
    row(
        select(c.prevNames,
            ...[[null, {}], ...Object.entries(data.slides[data.at - 1]?.content ?? {})].map(([key, value]) => 
            option(key ?? ">", set({
                disabled: key === null,
                selected: key === null,
                value: key ?? ">"
            }))), on.change(e => {
                const newId = e.target.value
                if (rename(pay, id, newId) !== null) {
                    edits(pay, newId)
                } else e.target.value = ''
                //e.target.value = ">"
            })),
        input(c.bubble,
            style({ 
                width: '300px',
                flexGrow: 1
            }),
            on.change((e) => {
                const newId = e.target.value
                if (rename(pay, id, newId) !== null) {
                    post(newId)
                } else e.target.value = ''
            }),
            set({ placeholder: id })
        )
    )
)

// @ts-check

import { col, elements, row } from "./elements.js"
const { div, button, img, br, textarea } = elements
import { on, c, set, style } from "./utils.js"
import { continueLastProject, getdir, loadProject } from "./dir.js"
import {  data, go, noEditing, setEditing } from "./coore.js"
import { panel } from "./panel.js"
import { icon } from "./builtens.js"
import { Dirv } from "./dirv.js"
import { resizeDotFor } from "./edit.js"

export const escable = (/** @type HTMLElement */ el) => {
    el.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            // @ts-ignore
            e.target.blur()
        }
    })
}

export const noteField = textarea(
    escable,
    style({
        resize: 'none',
        minHeight: '400px',
        borderRadius: '25px',
        padding: '10px',
        fontSize: '16px',
        fontFamily: 'Quicksand, Sans-Serif'
    }),
    on.input(e => {
        data.slides[data.at].note = e.target.value
    })
)

export const renewNote = () => {
    noteField.value = data.slides[data.at].note
}

export const notesPanel = col(
    c.floatingPanel, 
    style({
        border: 'none'
    }),
    noteField
)

export const showNotes = (focus) => {
    noEditing()
    panel.set(notesPanel)
    if (focus) setTimeout(() => {
        noteField.focus()
    }, 30)
    
}

export const openNotesBtn = button(
    style({display: 'flex'}),
    icon.note(), 
    c.btn,
    on.click(async () => {
        showNotes()
    })
)



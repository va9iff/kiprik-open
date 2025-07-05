// @ts-check
import { elements } from "./elements.js"
import { toprow, selectBtn } from "./ui.js"
import { aparat } from "./items/aparat.js"
import "./file.js"
import { renewGallery, gallery, openGalleryBtn, showGallery } from "./gallery.js"
import { renewNums } from "./botrow.js"
import { on, c, set, dragonfly, byClass, style  } from "./utils.js"
import { Dirv } from "./dirv.js"
import { rect, addRectBtn } from "./items/rect.js"
import "./items/img.js"
import "./keymaps.js"
import { addFrame, emptyFrame } from "./edit.js"
import './curves.js'

import { data, setData, n, magic, plate, currentSlide, editing, state, go, setEditing } from "./coore.js"

/** @import {rectPay} from "./types.d.ts" */

const { div, button, input, span, h1, img } = elements

import { dir, getdir, selectDir, saveProject, loadProject, continueLastProject } from './dir.js'

import { openNotesBtn } from "./notes.js"
go(1)

// _tmp_
selectBtn.onclick = () => {
    loadProject()
    go(0)
    showGallery()
}

import { playButton, recordButton } from "./play.js"
import { icon } from "./builtens.js"

toprow.appendChild(playButton)
toprow.appendChild(recordButton)

toprow.appendChild(addRectBtn)

toprow.appendChild(button(icon.trash(), c.btn,
    style({display: 'flex'}),
    on.click(() => {
        delete currentSlide().content[editing]
        go(data.at)
    }),
))

import { openLayersBtn } from "./layers.js"
toprow.appendChild(openLayersBtn)

toprow.appendChild(button(
    icon.add(), style({display: 'flex'}), 
    c.btn,
    on.click(() => {
        go(addFrame())
    }),
))

toprow.appendChild(openGalleryBtn)
toprow.appendChild(openNotesBtn)

// _tmp_
console.log(document.querySelector('.continueProjectBtn'))
const { continueProjectBtn, saveButton } = byClass
style({ display: 'flex' })(saveButton)
saveButton.appendChild(icon.save())

console.log(continueProjectBtn)
continueProjectBtn.addEventListener("click", async () => {
    await continueLastProject()
})

saveButton.addEventListener("click", async () => {
    await saveProject()
})

;((async () => {
    const fontsLoaderStyle = /** @type {HTMLLinkElement} */ (document.createElement("link"))
    fontsLoaderStyle.rel = "stylesheet" 
    // url is relative to index.html
    fontsLoaderStyle.href = "./src/fonts.css"
    document.head.appendChild(fontsLoaderStyle)
})());

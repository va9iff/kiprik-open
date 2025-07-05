// @ts-check

import { col, elements, row } from "./elements.js"
const { div, button, img, br, textarea } = elements
import { on, c, set, style } from "./utils.js"
import {  data, go, noEditing, setEditing } from "./coore.js"
import { edits, panel } from "./panel.js"
import { icon } from "./builtens.js"

export const layersField = col()

export const renewLayers = () => {
    layersField.innerHTML = ''
    for(const key of Object.keys(data.slides[data.at].content)) {
        layersField.appendChild(
            button(key, on.click(()=>{
                edits(data.slides[data.at].content[key], key)
            }))
        )
    }
}

export const layersPanel = col(
    c.floatingPanel, 
    style({
        border: 'none'
    }),
    layersField
)

export const showLayers = () => {
    noEditing()
    renewLayers()
    panel.set(layersPanel)
    
}

export const openLayersBtn = button(
    style({display: 'flex'}),
    icon.layers(), 
    c.btn,
    on.click(async () => {
        showLayers()
    })
)




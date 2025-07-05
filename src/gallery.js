// @ts-check

import { elements } from "./elements.js"
const { div, button, img, br } = elements
import { on, c, set, style } from "./utils.js"
import { continueLastProject, getdir, loadProject } from "./dir.js"
import {  data, go, setEditing } from "./coore.js"
import { panel } from "./panel.js"
import { icon } from "./builtens.js"
import { Dirv } from "./dirv.js"
import { resizeDotFor } from "./edit.js"
import { checkpoint } from "./undo.js"

const filetypes = {
    svg: `image/svg+xml`,
    jpeg: `image/jpeg` 
}

export const fileUrls = {}

// TODO: maybe separate it
/** @description you have to run it to have dynamic urls mapped
 *  this won't update the element on the panel. you should call 
 *  showGallery afterwards to see the latest gallery.
 */
export const renewGallery = async (/** @type Dirv? */ dir) => {
    if (!dir) {
        if (confirm(
            "Gallery is only available with a Kiprik project folder. \n\n" + 
            "Pick now?")) 
            dir = await getdir()
    }
    if (!dir) throw new Error("aborted gallery renewal due to nonexistent dir")
    const msg = div("Waiting for images...")
    gallery = div(msg, c.gallery, c.floatingPanel)
     
    gallery.appendChild(msg)
    const imgs = await dir.cd('imgs', true)
    for (const handle of await imgs._ls()) {
        const file = await handle.getFile()
        const filename = file.name
        const extension = filename.split(".").at(-1)
        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: filetypes[extension] });
        const url = URL.createObjectURL(blob);
        fileUrls[filename] = url
        const preview = img(c.galleryItem, set({ src: url }))
        preview.onclick = () => {
            console.log('joio')
            const insertedImgId = 'iii'
            const pay = {
                is: "img",
                file: filename,
                //src: fileUrls[filename]  // dough you still put the dynamic one in pay :D
            }
            data.slides[data.at].content[insertedImgId] = pay
            setEditing(insertedImgId)
            checkpoint()
            go(data.at) // go auto edits() the `editing`
        }
        gallery.appendChild(preview)
    }
    msg.remove()
    return gallery
}

export let gallery = 
    div("You have no images! Select project to have gallery.", c.col, c.cen, style({gap: '30px'}), 
        br(),
        button(c.continueProjectBtn, c.btn, "Continue last", on.click(
            async () => {
                await continueLastProject()
}
        )),
        button(c.selectBtn, c.btn, "Load project", on.click(async () => {
            loadProject()
            go(0)
            showGallery()
        }))
)

export const showGallery = (reload = false) => {
    setEditing("")
    resizeDotFor(null)
    panel.set(gallery)
}

export const openGalleryBtn = button(
    style({display: 'flex'}),
    icon.image(), 
    c.btn,
    on.click(async () => {
        const d = await getdir()
        console.log(d)
        setEditing("")
        showGallery()
    })
)


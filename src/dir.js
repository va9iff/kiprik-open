import { Dirv } from "./dirv.js";

import { data, setData, go, setEditing } from "./coore.js";
import { emptyFrame, resizeDotFor } from "./edit.js";

/** @type {Dirv?} */
export let dir = null

import { homePanel } from "./panel.js";
import { renewGallery, showGallery } from "./gallery.js";
import { checkpoint } from "./undo.js";

export const getdir = async () => {
    if (!dir) {
        if (confirm(
            "Pick previous project with a kiprik.json file or " + 
            "an empty directory to start a new project. "
        )) dir = await Dirv.pick()
    }
    if (!dir) throw new Error("getdir called but no directory was picked")
    //renewGallery(dir) // why??? delete these
    //showGallery()
    return /** @type {Dirv} */ (dir)
}

export const selectDir = async () => {
    dir = await Dirv.pick()

    try { 
        dir.saveSession('ki')
    } 
    catch(err) { console.error(err) }

    return dir
}

export const saveProject = async () => {
    if (!dir) dir = await selectDir()
    const tosave = JSON.stringify(data)
    await dir.write("kiprik.json", tosave)
    await renewGallery(dir)
    showGallery()
}

import { setTrackFileName } from "./play.js";

async function playMP3FromDirectory(dirHandle, fileName) {
    // Get the file handle from the directory
    const fileHandle = await dirHandle.getFileHandle(fileName);

    // Get the File object
    const file = await fileHandle.getFile();

    // Create an object URL
    const url = URL.createObjectURL(file);

    setTrackFileName(url)

    //// Create and play the audio
    //const audio = new Audio(url);
    //audio.play();

    //// Optional: clean up the object URL when done
    //audio.onended = () => URL.revokeObjectURL(url);

}

export const setupTrack = async (/** @type Dirv */ dir) => {
    try {
        playMP3FromDirectory(dir.dir, 'track.mp3')

    } catch(err) {
        console.error('failed track setup', err)
    }

}

export const loadProject = async () => {
    if (!dir) dir = await selectDir()
    const stri = await dir.either("kiprik.json", JSON.stringify(data))
    setEditing("")
    resizeDotFor(null)
    setData({slides: []})
    go(0)
    await renewGallery(dir)
    showGallery()
    setData(JSON.parse(stri))
    go(0)
    data[-1] = emptyFrame()
    checkpoint()
    await setupTrack(dir)
}


export const continueLastProject = async () => { 
    try {
        const toDir = await Dirv.want('ki')
        if (!toDir) throw new Error("couldn't continue")
        dir = toDir
        const stri = await dir.either("kiprik.json", JSON.stringify(data))
        setEditing("")
        resizeDotFor(null)
        setData({slides: []})
        go(0)
        await renewGallery(dir)
        showGallery()
        setData(JSON.parse(stri))
        go(0)
        await setupTrack(dir)
    } catch (err) {
        console.error("could not open the previous Kiprik project")
        if (confirm("Couldn't locate the last project. You'll need to pick " + 
            "the directory yourself. Proceed?")) loadProject()
    }
}


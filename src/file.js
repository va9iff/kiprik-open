// @ts-check

import { Dirv } from "./dirv.js"
import { dir, getdir } from "./dir.js"
import { renewGallery, showGallery } from "./gallery.js";

//const dropArea = /** @type HTMLDivElement */ (document.querySelector('.slide'))
// you'll need to aim for non element part of the slide. that's why back.
// when it was just slide, the back was in front of the slide, so we had to 
// aim for the children of slide. slide itself is now unreachable, back is backPlate.
const dropArea = /** @type HTMLDivElement */ (document.querySelector('.backPlate'))

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((/** @type string */ eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

// Remove highlight when item is no longer dragging over the drop area
;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

// Prevent default behavior (Prevent file from being opened)
function preventDefaults(/** @type Event */ e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight the drop area
function highlight() {
    dropArea.classList.add('dropping');
}

// Remove highlight
function unhighlight() {
    dropArea.classList.remove('dropping');
}

// Handle dropped files
function handleDrop(/** @type {DragEvent} */ e) {
    const dt = e.dataTransfer;
    if (!dt) throw new Error("e.dataTransfer is null")
    const files = dt.files;
    handleFiles(files);
}

// Process the files
function handleFiles(/** @type {FileList} */ files) {
    const fileArray = Array.from(files);
    fileArray.forEach(handleFile);
}
const notnull = (/** @type any */ arg) => {
}

async function handleFile(/** @type {FileList[number]} */ file) {
    let dir = await getdir()
    console.log(file.name)
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async function(event) {
            if (event.target === null) throw new Error("should not be null!")
            if (event.target.result === null) throw new Error("should not be null!")

            const blob = new Blob([event.target.result], { type: file.type });

            const url = URL.createObjectURL(blob);
            const textContent = /** @type {string} */ (event.target.result);
            if (textContent === null) throw new Error("problem with textual content")
            console.log(textContent)
            const imgs = await dir.cd("imgs", true)
            // @ts-ignore
            await imgs.write(`${file.name}`, new Blob([event.target.result]))
            await renewGallery(dir)
            showGallery()
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('Please drop an image file.');
    }
}


// @ts-check

// file that uses stuff from built/ folder.
// built/ folder is built by build/ folder.

import { svgs } from "./built/svgs.js";
import { elements } from "./elements.js";
const { img } = elements

const svgUrls = {}

for (const svgName in svgs) {
    const svgString = svgs[svgName]

    // Create a Blob from the SVG string
    const blob = new Blob([svgString], { type: 'image/svg+xml' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    svgUrls[svgName] = url
}

export const icon = new Proxy(
    /** @type {{[key in keyof svgs]: (...args: Parameters<img>) => HTMLImageElement }} */({}), {
    get(_, prop) {
        return (/** @type Parameters<img> */ ...args) => {
            const result = img(...args)

            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgs[prop], "image/svg+xml");
            const svgElement = svgDoc.documentElement;
            svgElement.classList.add("icon")
            svgElement.removeAttribute('width')
            svgElement.removeAttribute('height')
            return svgElement

            //result.classList.add("icon")
            //result.src = svgUrls[prop]
            //return result
        }
    }
})


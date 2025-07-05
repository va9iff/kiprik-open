import { elements } from "./elements.js"
import { on, c, set, dragonfly, byClass  } from "./utils.js"
const { div, button, input, span, h1, img } = elements
import { getdir, } from "./dir.js"
import { data, go } from "./coore.js"


const botside = document.querySelector(".botside")

const slideRoller = (/** @type {WheelEvent} */ e) => {
    let direction = -1
    const delta = e.deltaY * direction
    if (delta > 0) {
        if (data.at >= data.slides.length - 1)
            return
        go(data.at + 1)

    }
    if (delta < 0)  {
        if (data.at <= 0)
            return
        go(data.at - 1)
    }
}

const { currentNum, totalNum } = byClass
const { nums } = byClass // that holds both

const renewNums = () => {
    currentNum.innerText = data.at
    totalNum.innerText = data.slides.length - 1
}

botside.addEventListener("wheel", slideRoller)

export { nums, renewNums }





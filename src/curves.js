// @ts-check
import { col, row, elements } from "./elements.js"
const { img, button, input, select, option, div, canvas, h3 } = elements
import { set, c, on, style } from "./utils.js"
import { editing, go } from "./coore.js"
import { data } from "./coore.js"
import { edits, panel } from "./panel.js"

const width = 300
const height = 400
let scale = 0.2

const defaultEntry = () => [1000, 0, 0, 1, 1, 0.2]

const loger = div()
const slider = input(
    set({ type: 'range', max: 1, min: 0, step: 0.01 }),
    on.input(e => {
        scale = +e.target.value
        transitionsObj[transitionsProp] ??= defaultEntry()
        transitionsObj[transitionsProp][5] = +e.target.value
        updateCurves()
    })
)

const setTransDur = val => {
    transitionsObj[transitionsProp] ??= defaultEntry()
    transitionsObj[transitionsProp][0] = val
    transDurSlider.value = val + ''
    transDurBubble.value = val + ''
}
const transDurBubble = input(
    c.bubble,
    set({
        type: 'number'
    }),
    on.input(e => {
        setTransDur(+e.target.value)
    })
)
const transDurSlider = input(
    set({ type: 'range', max: 1000, min: 0, step: 1 }),
    on.input(e => {
        setTransDur(+e.target.value)
    })
)

const setFor = (controlPoint, x, y) => {
        controlPoint.x = x
        controlPoint.y = y
}

const rebaseData = (entry) => {
    const d = defaultEntry()
    entry ??= d
    scale = entry[5] ?? d[5]
    const offScale = (1 - scale) / 2
    setTransDur(entry[0] ?? d[1])
    setFor(cp1, 
        ((entry[1] ?? d[1])) * width * scale + width * offScale, 
        (1- (entry[2] ?? d[2])) * height * scale + height * offScale
    )
    setFor(cp2, 
        ((entry[3] ?? d[3])) * width * scale + width * offScale, 
        (1- (entry[4] ?? d[4])) * height * scale + height * offScale
    )
    updateCurves()
}

const canvasel = canvas(
    set({
        width,
        height,
    }),
    style({
        padding: '0',
        boxSizing: 'border-box',
        alignSelf: 'center',
        border: '2px solid red',

    }),
    on.wheel((/** @type {WheelEvent} */ e) => {
        if (!e.ctrlKey) return null
        e.preventDefault()
        scale += e.deltaY * -0.001
        scale = Math.min(Math.max(scale, 0.01), 1)
        slider.value = scale + ''
        updateCurves()
    }),
    // @ts-ignore
    on.mousemove((/** @type {MouseEvent} */ e) => {
        if (!mb) return
        let targa = 
            mb === 'left' ?
            cp1 :
            mb === 'right' ?
            cp2 :
            null
        if (!targa) return console.warn('no button was pressed')
        setFor(targa, e.offsetX, e.offsetY)
        updateCurves()
    }),
    on.contextmenu(e => e.preventDefault()),
    on.mousedown((/** @type MouseEvent */ e) => {
        e.preventDefault()
        if (e.button == 0) {
            mb = 'left'
            setFor(cp1, e.offsetX, e.offsetY)
        }
        if (e.button == 2) {
            mb = 'right'
            setFor(cp2, e.offsetX, e.offsetY)
        }
        updateCurves()
    }),
    on.mouseup(() => {
        mb = ''
    })
)
let mb = ''

const ctx = canvasel.getContext("2d");
if (!ctx) throw new Error("couldn't get the canvas context")

// Define the points as {x, y}
let start = { x: 0, y: 100 };
let cp1 = { x: 30, y: 70 };
let cp2 = { x: 80, y: 80 };
let end = { x: 100, y: 0 };

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvasel.width, canvasel.height);
}

//clearCanvas()

const updateCurvePath = () => {
    ctx.strokeStyle = 'red'
    ctx.lineWidth = Math.max(1, 10 * scale); // Set the stroke width to 10 pixels
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.stroke();
}

//updateCurvePath()

// Start and end points
const updateStartEndPoints = () => {
    const offScale = (1 - scale) / 2

    start.x = width * offScale
    end.x   = width * offScale + width * scale

    end.y   = height * offScale 
    start.y = height * offScale + height * scale 

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(start.x, start.y, 5, 0, 2 * Math.PI); // Start point
    ctx.arc(end.x, end.y, 5, 0, 2 * Math.PI); // End point
    ctx.fill();
}
//updateStartEndPoints()

const updateControlPoints = () => {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(cp1.x, cp1.y, 5, 0, 2 * Math.PI); // Control point one
    ctx.arc(cp2.x, cp2.y, 5, 0, 2 * Math.PI); // Control point two
    ctx.fill();
}
//updateControlPoints()

/** @type {any} */
let transitionsObj = {}
let transitionsProp = "all"
const updateCurves = () => {
    const offScale = (1 - scale) / 2
    cp1.x = Math.min(Math.max(cp1.x, offScale * width), (offScale + scale) * width)
    cp2.x = Math.min(Math.max(cp2.x, offScale * width), (offScale + scale) * width)
    transitionsObj[transitionsProp] ??= defaultEntry()
    const curvesArray = transitionsObj[transitionsProp]
    clearCanvas()
    updateStartEndPoints()
    updateControlPoints()
    updateCurvePath()
    //const offScale = (1 - scale) / 2
    curvesArray[1] = +((cp1.x - offScale * width) / (scale * width) ).toFixed(2)
    curvesArray[2] = +(((height - cp1.y) - offScale * height) / (scale * height) ).toFixed(2)
    curvesArray[3] = +((cp2.x - offScale * width) / (scale * width) ).toFixed(2)
    curvesArray[4] = +(((height - cp2.y) - offScale * height) / (scale * height) ).toFixed(2)
    loger.innerHTML = 
        `cubic-bezier(
        ${curvesArray[1]}, 
        ${curvesArray[2]}, 
        ${curvesArray[3]}, 
        ${curvesArray[4]}, 
`
}
updateCurves()

window.ji = [ 200, 0, 0, 1, 1 ]

export const curvesFor = (/** @type object */ obj, /** @type string */ prop, title = '~') => {
    transitionsObj = obj
    transitionsProp = prop
    curvesTitle.innerText = title
    rebaseData(transitionsObj[transitionsProp])
    updateCurves()
}

const template = {
    'premades': defaultEntry(),
    'linear': [600, 0, 0, 1, 1, 1],
    'smooth': [300, 0.3, 0.5, 0.7, 0.5, 1],
    'slide-in-bounce': [777, 0.54, 0.57, 0.17, 1.35, 0.77],
    'jump':   [400, 0, 1, 0, 1, 1],
    //'smack':   [350, 0.72, -1.84, 0.57, 2, 0.3],
    'smack':   [450, 1, -1.69, 0, 3.11, 0.09],
}

export const curves = (/** @type object */ obj, /** @type string */ prop, title = '~') => {
    curvesFor(/** @type object */ obj, /** @type string */ prop, title = '~')

    panel.set(
        col(
            row(
                curvesTitle,
                button('delete', on.click(() => {
                    delete obj[prop]
                    edits(data.slides[data.at].content[editing], editing)
                })),
            ),
            select(
                on.change(e => {
                    const k = e.target.value
                    obj[prop] = [...template[k]]
                    curves(obj, prop, title)
                }),
                ...Object.keys(template).map(k => 
                option(k, set({value: k}))
            )),
            row(
                transDurBubble,
                transDurSlider,
            ),
            c.floatingPanel,
            canvasel,
            slider,
            loger
        )
    )

}

const curvesTitle = h3("hiiii", style({
    fontSize: "29px"
}))

//window.onload = e => panel.set(
//)
curvesFor(window, 'ji', 'for window.ji')

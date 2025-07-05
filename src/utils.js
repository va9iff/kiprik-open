// @ts-check

export const inside = (/** @type HTMLElement */ el) => el.appendChild(document.createTextNode("~place"))
export const grab = (/** @type string */ s) => /** @type HTMLElement */ (document.querySelector(s))

export const place = (/** @type HTMLElement */ el) => {
    return {
        set(/** @type {HTMLElement} */ nova) {
            if (!nova) throw new Error("? " + nova)
            el.replaceWith(nova)
            el = nova
        },
        get el() {
            return el
        }
    }
}

export const on = new Proxy(/**
    @type {{ 
        click: (cb: (e: Event) => any) => any,
        [key: string]: (func: ((e: any) => any)) => any
        }}
    */({}), {
    get(_, prop) {
        return (/** @type any */ cb) => (/** @type any */ el) => el.addEventListener(prop, cb)
    }
})

export const c = new Proxy(/** @type {{[key: string]: any}} */ ({}), {
    get(_, /** @type string */ prop) {
        return (/** @type {HTMLElement}*/el) => el.classList.add(prop) 
    }
})

export const set = (/** @type {any} */ arg) => (/** @type {HTMLElement} */ el) => {
    for (const key in arg) el[key] = arg[key]
}

export const style = (/** @type {Partial<HTMLElement['style']>} */ styles) => {
    return (/** @type HTMLElement */ el) => {
        for (const s in styles) 
            el.style[s] = /** @type string */(styles[s])
    }
}

/** @param {(ix: number, iy: number, ie: MouseEvent)=>(dx: number, dy: number, e: MouseEvent)=>undefined} fun 
    @param {HTMLElement} el
    @param {() => void} ender
*/
export function dragonfly(el, fun, ender = () => {}) {
    const flyer = (/** @type MouseEvent */ eDown) => {
        eDown.preventDefault()
        const initialX = eDown.clientX
        const initialY = eDown.clientY
        const dragonReturn = fun(initialX, initialY, eDown)
        /** @param {MouseEvent} eMove */
        const moveFun = eMove => {
            eMove.preventDefault()
            const currentX = eMove.clientX
            const currentY = eMove.clientY
            const dx = currentX - initialX 
            const dy = currentY - initialY 
            dragonReturn(dx, dy, eMove)
        }
        document.body.addEventListener('mousemove', moveFun)
        const remover = () => {
            document.body.removeEventListener('mousemove', moveFun)
            document.body.removeEventListener('mouseup', remover)
            ender()
        }
        document.body.addEventListener('mouseup', remover)
    }
    el.addEventListener('mousedown', flyer)
    return () => el.removeEventListener('mousedown', flyer)
}

export const byClass = new Proxy(/** @type {{[key: string]: HTMLElement}} */ ({}), {
    get(_, /** @type string */ prop) {
        return document.querySelector(`.${prop}`)
    }
})


// @ts-check

/** @import { ElementsProxy, inner } from "./elemtypes.d.ts" */

export const elements = new Proxy(
    /** @type {ElementsProxy} */ 
    ({}), 
    {
    /** @param {string} prop */
    get(_, prop) {
        /** @param {inner[]} ions */
        return function(...ions) {
            const element = document.createElement(prop)
            for (const ion of ions) 
                if (typeof ion === 'string'|| typeof ion === 'number')
                    element.appendChild(document.createTextNode(ion + ''))
                else if ('put' in ion) 
                    element.appendChild(ion.put(element))
                else if (typeof ion === 'function')
                    ion(element)
                else
                    element.appendChild(ion)
            return element
        }
     }
})

const { div } = elements

/** @template {Parameters<elements[string]>} V
 * @param {V} args */
export const row = (...args) => {
    const el = div(...args)
    el.style.display = 'flex'
    el.style.flexDirection = 'row'
    return el
}

/** @template {Parameters<elements[string]>} V
 * @param {V} args */
export const col = (...args) => {
    const el = div(...args)
    el.style.display = 'flex'
    el.style.flexDirection = 'column'
    return el
}



export type appendable = HTMLElement | DocumentFragment | Comment | Text

export type Ion = {
    get?: () => any,
    set: (value: any) => any,
    die?: () => void,
    put?: (parent?: HTMLElement) => appendable | void,
}

export type gettable = { get: () => any }
export type settable = { set: (value: any) => any }

export type inner = { put: (parent?: HTMLElement) => appendable } | 
    HTMLElement | number | string | ((parent: HTMLElement) => void | undefined)

export type ElementsProxy = 
    { 
        [key in keyof HTMLElementTagNameMap] : 
            (...ions: inner[]) => 
                HTMLElementTagNameMap[key] 
    } & 
    {
        [x: string]: (...ions: inner[]) => HTMLElement
    }



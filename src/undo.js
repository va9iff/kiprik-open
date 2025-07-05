import { data, setData, go  } from "./coore.js"

const undoList = []
let undoIndex = -1

export const checkpoint = () => {
    console.log(undoIndex, undoList)
    undoList.splice(++undoIndex, 99, JSON.stringify(data))
}

export const undo = () => {
    console.log(undoIndex, undoList)
    if (undoIndex <= 0) return
    undoIndex--
    const parsed = JSON.parse(undoList[undoIndex])
    setData(parsed)
    go(data.at)
}

export const redo = () => {
    if (undoIndex+1 >= undoList.length) return
    undoIndex++
    const parsed = JSON.parse(undoList[undoIndex])
    setData(parsed)
    go(data.at)
}


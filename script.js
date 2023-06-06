const ulBtnNav = document.querySelector(getDataId("ul-footer"))

const slide = (toLeft = false) => {
  const back1 = toLeft === true ? '' : "-back"
  // const back2 = back1 === '' ? "-back" : ''

  const elementToShow = document.querySelector(`:is(.slide-out, .slide-back-out)`)
  const elementToHide = document.querySelector(`:is(.slide-in, .slide-back-in)`)

  elementToShow.classList.remove("slide-in", "slide-back-in", "slide-out", "slide-back-out")
  elementToHide.classList.remove("slide-in", "slide-back-in", "slide-out", "slide-back-out")

  elementToShow.classList.add(`slide${back1}-in`)
  elementToHide.classList.add(`slide${back1}-out`)
}

const slideToRight  = () => slide()
const slideToLeft   = () => slide(true)

const verifyDataset = dataset => ({
  "btn-left"    : slideToLeft,
  "btn-right"   : slideToRight,
})[dataset] || false

const startAfterClick = e => {
  const navButton = e.target

  const funcToCall = verifyDataset(navButton.dataset.js)

  if (!funcToCall)
    return
  
  funcToCall()
}

const verifyKey = key => ({
  "ArrowRight"  : slideToRight,
  "ArrowLeft"   : slideToLeft,
})[key] || false

const startAfterKeyup = e => {
  const key = e.key

  const funcToCall = verifyKey(key)

  if (!funcToCall)
    return
  
  funcToCall()
}

const mountThead = (thead, items = {}, attr = {}) => {
  Object.keys(items).forEach((key, i) => {
    if (i === 0) {
      const tr = getNewElement("tr")
      thead.append(tr)
    }

    const th = getNewElement("th", { ...attr, class: "text-center" })
    th.innerText = getFormattedKey(key)
    thead.firstElementChild.append(th)
  })
}

const mountTbody = (tbody, items = {}, attr = {}) => {
  items.forEach(item => {
    const tr = getNewElement("tr")

    Object.entries(item).forEach(([ key, value ], i) => {
      const elementType = i === 0 ? "th" : "td"
      const trChild = i === 0
      ? getNewElement(elementType, { ...attr, class: "text-center" })
      : getNewElement(elementType, { class: "text-center" })

      const formattedValue = getFormattedValue(key, value)
      trChild.innerText = formattedValue

      tr.append(trChild)
    })

    tbody.append(tr)
  })
}

const editTableValuesBeforeAppend = obj => {
  const table = getBaseTable()
  const [ thead, tbody ] = table.children
  
  mountThead(thead, obj.at(0), { scope: "col" })
  mountTbody(tbody, obj, { scope: "row" })

  return table
}

const mountTableOne = () => {
  const obj = getArrayOfObjects()
  const divSlide1 = document.querySelector(getDataId("slide-1"))
  
  const table = editTableValuesBeforeAppend(obj);
  
  divSlide1.append(table)
}

const mountTableTwo = () => {
  const obj = getPlaceholderArrayOfObjects()
  const divSlide2 = document.querySelector(getDataId("slide-2"))
  
  const table = editTableValuesBeforeAppend(obj);
  
  divSlide2.append(table)
}

const init = () => {
  mountTableOne()
  mountTableTwo()
}

ulBtnNav.addEventListener("click", startAfterClick)
document.addEventListener("keyup", startAfterKeyup)

document.addEventListener("DOMContentLoaded", init)
const ulBtnNav = document.querySelector(`[data-js="ul-footer"]`)

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
      const tr = createElement("tr")
      thead.append(tr)
    }

    const th = createElement("th", { ...attr })
    th.innerText = getFormattedKey(key)
    thead.firstElementChild.append(th)
  })
}

const mountTbody = (tbody, items = {}, attr = {}) => {
  items.forEach(item => {
    const tr = createElement("tr")

    Object.entries(item).forEach(([ key, value ], i) => {
      const elementType = i === 0 ? "th" : "td"
      const trChild = i === 0 ? createElement(elementType, { ...attr }) : createElement(elementType)

      const formattedValue = getFormattedValue(key, value)
      trChild.innerText = formattedValue

      tr.append(trChild)
    })

    tbody.append(tr)
  })
}

const mountTableOne = async () => {
  const obj = getPlaceholderArrayOfObjects()

  const divSlide2 = document.querySelector(`[data-js="slide-2"]`)
  const table = getBaseTable()
  const [ thead, tbody ] = table.children
  
  await mountThead(thead, obj.at(0), { scope: "col" })
  
  await mountTbody(tbody, obj, { scope: "row" }, 0)
  
  divSlide2.append(table)
}

const mountTableTwo = async () => {
  const obj6 = await getArrayOfObjects()

  const divSlide1 = document.querySelector(`[data-js="slide-1"]`)
  const table = getBaseTable()
  const [ thead, tbody ] = table.children

  await mountThead(thead, obj6.at(0))
  
  await mountTbody(tbody, obj6)
  
  divSlide1.append(table)
}

const init = () => {
  mountTableOne()
  mountTableTwo()
}

ulBtnNav.addEventListener("click", startAfterClick)
document.addEventListener("keyup", startAfterKeyup)

document.addEventListener("DOMContentLoaded", init)
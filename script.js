const main = document.querySelector(getDataId('main'))
const ulBtnNav = document.querySelector(getDataId('ul-footer'))

const slideNow = (elementToShow, elementToHide, toLeft) => {
  const back1 = toLeft === true ? '' : '-back'
  
  // const elementToShow = document.querySelector(`:is(.slide-out, .slide-back-out)`)
  // const elementToHide = document.querySelector(`:is(.slide-in, .slide-back-in)`)

  // elementToShow.classList.remove('slide-in', 'slide-back-in', 'slide-out', 'slide-back-out')
  elementToHide.classList.remove('slide-in', 'slide-back-in', 'slide-out', 'slide-back-out')

  elementToShow.append(toLeft === true
    ? editTableValuesBeforeAppend(getInfos())
    : editTableValuesBeforeAppend(getPlaceholderArrayOfObjects())
  )

  elementToShow.hidden = false
  elementToShow.classList.add(`slide${back1}-in`)
  elementToHide.classList.add(`slide${back1}-out`)

  // setTimeout(() =>
    elementToHide.remove()
  // , 1000)
}

const slide = (toLeft = false) => {
  const elementAtScreen = document.querySelector(`.container > main > :nth-child(2)`)
  const placeholderDiv = toLeft === true ? elementAtScreen.previousElementSibling : elementAtScreen.nextElementSibling
  const clonePlaceholderDiv = placeholderDiv.cloneNode(true)

  if (toLeft === true)
    placeholderDiv.after(clonePlaceholderDiv)
  else
    placeholderDiv.before(clonePlaceholderDiv)

  slideNow(clonePlaceholderDiv, elementAtScreen, toLeft)
}

const slideToRight  = () => slide()
const slideToLeft   = () => slide(true)

const getObjToCallByEvent = (funcToCall, argument = null) => ({ funcToCall, argument });

const verifyDatasetToGetArgument = (element, dataId) => ({
  'table-restricoes'  : element.closest('th')
})[dataId] || null

const verifyDatasetToGetFunction = dataId => ({
  'btn-left'          : slideToLeft,
  'btn-right'         : slideToRight, 
  'table-restricoes'  : Utils.sortTableByColumn,
})[dataId] || false

const startAfterClick = e => {
  const element = e.target
  const { dataset: { id: dataId } } = element.closest('table:has(> thead :scope)') ?? element

  const funcToCall = verifyDatasetToGetFunction(dataId)
  const argToSet = verifyDatasetToGetArgument(element, dataId)

  if (!funcToCall)
    return
  
  funcToCall(argToSet)
}

const verifyKey = key => ({
  'ArrowRight'  : slideToRight,
  'ArrowLeft'   : slideToLeft,
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
    if (key === 'preco_venda')
      return
    
    if (i === 0) {
      const tr = getNewElement('tr')
      thead.append(tr)
    }

    const th = getNewElement('th', { ...attr, class: 'text-center align-middle' })
    th.innerText = getFormattedKey(key)
    thead.firstElementChild.append(th)
  })
}

const mountTbody = (tbody, items = {}, attr = {}) => {
  items.forEach(item => {
    const tr = getNewElement('tr')

    Object.entries(item).forEach(([ key, value ], i) => {
      if (key === 'preco_venda')
        return

      const elementType = i === 0 ? 'th' : 'td'
      const trChild = i === 0
      ? getNewElement(elementType, { ...attr, class: 'text-center align-middle' })
      : getNewElement(elementType, { class: 'text-center align-middle' })

      const formattedValue = getFormattedValue(key, value)
      trChild.innerText = formattedValue

      tr.append(trChild)
    })

    tbody.append(tr)
  })
}

const editTableValuesBeforeAppend = obj => {
  const table = getBaseTable({ 'data-id': 'table-restricoes' })
  const [ thead, tbody ] = table.children
  
  mountThead(thead, obj.at(0), { scope: 'col' })
  mountTbody(tbody, obj, { scope: 'row' })

  return table
}

const mountTableOne = () => {
  // const obj = getArrayOfObjects()
  const obj = getInfos()
  const divSlide1 = document.querySelector(getDataId('slide-1'))
  
  const table = editTableValuesBeforeAppend(obj);
  
  divSlide1.append(table)
}

// const mountTableTwo = () => {
//   const obj = getPlaceholderArrayOfObjects()
//   const divSlide2 = document.querySelector(getDataId('slide-2'))
  
//   const table = editTableValuesBeforeAppend(obj);
  
//   divSlide2.append(table)
// }

const init = () => {
  mountTableOne()
  // mountTableTwo()
  const arr = getInfos()
}

main.addEventListener('click', startAfterClick)
document.addEventListener('keyup', startAfterKeyup)

document.addEventListener('DOMContentLoaded', init)
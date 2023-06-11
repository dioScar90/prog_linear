String.prototype.ucFirst = function() {
  const notThis = ['di','da','das','do','dos','de','e','von','van','le','la','du','des','del','della','der','al']
  const allWords = this.toLowerCase().replace(/\s+/g, ' ').trim().split(' ')
  return allWords.map(word => notThis.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const is = value => Object.prototype.toString.call(value)
const isArray = value => is(value) === '[object Array]'
const isFunction = value => is(value) === '[object Function]'
const isObject = value => is(value) === '[object Object]'
const isNull = value => is(value) === '[object Null]'

const Utils = (() => {
  getTextToCompare = (row, qs) => row.querySelector(qs).innerText.trim().toLowerCase()

  sortTableByDiferentColumn = (colNum, desc = false, thead) => {
    const fragmentToBeReplacedWith = document.createDocumentFragment()
    const tbody = thead.nextElementSibling

    const nthChild = `:is(td, th):nth-child(${colNum})`
    const thClickedColumn = thead.querySelector(`tr > ${nthChild}`)
    
    const rowsToBeSorted = [...tbody.children].map(row => row.cloneNode(true))
    
    rowsToBeSorted.sort((row1, row2) => {
      const text1 = getTextToCompare(row1, nthChild)
      const text2 = getTextToCompare(row2, nthChild)

      const options = [ undefined, { numeric: true } ]
      
      return desc === true ? text2.localeCompare(text1, ...options) : text1.localeCompare(text2, ...options)
    })
    
    rowsToBeSorted.forEach(row => fragmentToBeReplacedWith.append(row))
    tbody.replaceChildren(fragmentToBeReplacedWith)
    
    const iconType = desc === true ? 'down' : 'up'
    const newThContent =
      `<i class="fas fa-sort-amount-${iconType}-alt"></i><span>&nbsp;&nbsp;</span>${thClickedColumn.innerHTML}`

    thClickedColumn.innerHTML = newThContent
    thClickedColumn.classList.add('bg-primary')
  }

  sortTableByColumn = thisTh => {
    const index = thisTh.cellIndex
    const thead = thisTh.closest('thead')
    const allTh = thead.querySelectorAll('tr > th')
    const asc = allTh[index].toggleAttribute('data-order-by')

    allTh.forEach((th, i) => {
      const iFontAwesome = th.querySelector('i')
      th.classList.remove('bg-primary')

      if (iFontAwesome !== null) {
        iFontAwesome.nextElementSibling.remove()
        iFontAwesome.remove()
      }

      if (i !== index && th.dataset.orderBy)
        delete th.dataset.orderBy
    })
    
    sortTableByDiferentColumn((index + 1), !asc, thead)
  }

  getUrlId = id => new URL(location).searchParams.get(id)

  return { sortTableByColumn, getUrlId }
})()

const getNewElement = (type, object = {}) => {
  const newElement = document.createElement(type)

  for (const key in object)
    newElement.setAttribute(key, object[key])
  
  return newElement
}

const getFragment = () => document.createDocumentFragment()
const getTemplate = () => getNewElement('template')

const getDataId = dataId => `[data-id="${dataId}"]`

const getBaseTable = (attr = {}) => {
  const table = getNewElement('table', { ...attr, class: 'table mb-0 table-bordered table-striped table-dark overflow-hidden' })
  const thead = getNewElement('thead', { class: 'bg-primary bg-gradient' })
  const tbody = getNewElement('tbody')
  
  table.append(thead)
  table.append(tbody)

  return table
}

const imgUrls = imgName => ({
  custo_minimo    : `images/custo_minimo.png`,
  canto_noroeste  : `images/canto_noroeste.png`,
  vogel           : `images/vogel.png`,
  hyundai_hr      : `images/hyundai_hr.png`,
})[imgName] || ''

const getImgUrl = imgName => imgUrls(imgName)

const checkIfWordMustBeChanged = word => ({
  elastico: 'elástico',
  botoes  : 'botões',
  algodao : 'algodão',
  // carcaca: 'subconjunto carcaca preta',
  carcaca: 'carcaça',
  kit_reparo: 'kit reparo',
  conjunto_magnetico: 'conjunto magnético',
  // nucleo_toroidal: 'núcleo de ferrite toroidal 25,3x14,8x20,0mm coated',
  nucleo_toroidal: 'núcleo toroidal',
  indutor: 'indutor',
  // nucleo_carretel: 'núcleo ferrite carretel dr2w10x12 d30 10,0x12,0x5,5mm without coat',
  nucleo_carretel: 'núcleo carretel',
  placa: 'placa',
  capacitor_poliester: 'cap. poliéster',
  // capacitor_eletrolitico: 'capacitor pth eletrolítico radial 470uf 50v 85g +/- 20% 10x20mm (p.5,0mm) fitado',
  capacitor_eletrolitico: 'cap. eletrolítico',
  tempo: 'tempo',
  custo: 'custo',
  preco_venda: 'preço de venda',
})[word] || word

const getFormattedKey = key => checkIfWordMustBeChanged(key).ucFirst()

const getUnitOfMeasurement = type => ({
  linha   : 'm',
  tecido  : 'm',
  elastico: 'm',
  botoes  : 'un',
  estampa :	'm',
  corante :	'kg',
  bolso   : 'm',
  algodao : 'm',
  seda    : 'm',
  // tempo   : 'min',
  tempo   : 'dia',
  carcaca: 'kit',
  kit_reparo: 'kit',
  conjunto_magnetico: 'kit',
})[type.toLowerCase()] || 'un'

const getMultiplier = factor => value => value * factor
const multiplyByHundred = getMultiplier(100)
const multiplyByThousand = getMultiplier(1000)

const getFormattedMoney = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const getFormattedHourByMinutes = minutes => Math.floor(minutes / 60) + ' h ' + (minutes % 60).toString().padStart(2, '0')

const getFormattedValue = (key, value) => {
  const unitOfMeasurement = getUnitOfMeasurement(key)
  const isCentimeter = unitOfMeasurement === 'm' && value > 0 && value < 1
  const isGram = unitOfMeasurement === 'kg' && value > 0 && value < 1
  const isHour = unitOfMeasurement === 'min' && value > 60
  const isZeroOrProdutoKey = value === 0 || key === 'produto'
  const isKitOrDia = ['kit', 'dia'].includes(unitOfMeasurement)

  if (['valor', 'custo', 'preco_venda'].includes(key))
    return getFormattedMoney(value)
  
  if (isCentimeter)
    return multiplyByHundred(value) + ' cm'

  if (isGram)
    return multiplyByThousand(value) + ' g'

  if (isHour)
    return getFormattedHourByMinutes(value)

  if (isZeroOrProdutoKey)
    return value
  
  if (isKitOrDia)
    return value.toLocaleString('pt-BR') + ' ' + unitOfMeasurement + (value > 1 ? 's' : '')

  return value.toLocaleString('pt-BR') + ' ' + unitOfMeasurement
}
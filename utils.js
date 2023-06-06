String.prototype.ucFirst = function() {
  const notThis = ["di","da","das","do","dos","de","e","von","van","le","la","du","des","del","della","der","al"]
  const allWords = this.toLowerCase().replace(/\s+/g, ' ').trim().split(' ')
  return allWords.map(word => notThis.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const is = value => Object.prototype.toString.call(value);
const isArray = value => is(value) === "[object Array]";
const isFunction = value => is(value) === "[object Function]";
const isObject = value => is(value) === "[object Object]";
const isNull = value => is(value) === "[object Null]";

class Utils {
  static #getTextToCompare = (row, qs) => row.querySelector(qs).innerText.trim().toLowerCase()

  static #sortTableByColumnDiferente = (colNum, desc = false, thead) => {
    const fragmentToBeReplacedWith = document.createDocumentFragment();
    const tbody = thead.nextElementSibling;

    const nthChild = `:is(td, th):nth-child(${colNum})`;
    const thClickedColumn = thead.querySelector(`tr > ${nthChild}`);
    
    const rowsToBeSorted = [...tbody.children].map(row => row.cloneNode(true));
    
    rowsToBeSorted.sort((row1, row2) => {
      const text1 = this.#getTextToCompare(row1, nthChild);
      const text2 = this.#getTextToCompare(row2, nthChild);
      
      const options = [ undefined, { numeric: true } ]
      
      return desc === true ? text2.localeCompare(text1, ...options) : text1.localeCompare(text2, ...options);
    });
    
    rowsToBeSorted.forEach(row => fragmentToBeReplacedWith.append(row))
    tbody.replaceChildren(fragmentToBeReplacedWith)
    
    const iconType = desc === true ? "down" : "up";
    const newThContent =
      `<i class="fas fa-sort-amount-${iconType}-alt"></i><span>&nbsp;&nbsp;</span>${thClickedColumn.innerHTML}`;

    thClickedColumn.innerHTML = newThContent;
    thClickedColumn.classList.add("bg-primary");
  }

  static sortTableByColumn = thisTh => {
    const index = thisTh.cellIndex;
    const thead = thisTh.closest("thead");
    const allTh = thead.querySelectorAll("tr > th");
    const asc = allTh[index].toggleAttribute("data-order-by");

    allTh.forEach((th, i) => {
      const iFontAwesome = th.querySelector('i');
      th.classList.remove("bg-primary");

      if (iFontAwesome !== null) {
        iFontAwesome.nextElementSibling.remove();
        iFontAwesome.remove();
      }

      if (i !== index && th.dataset.orderBy)
        delete th.dataset.orderBy;
    })
    
    this.#sortTableByColumnDiferente((index + 1), !asc, thead);
  }
}

const getNewElement = (type, object = {}) => {
  const newElement = document.createElement(type)

  for (const key in object)
    newElement.setAttribute(key, object[key])
  
  return newElement
}

const getFragment = () => document.createDocumentFragment()
const getTemplate = () => getNewElement("template")

const getDataId = dataId => `[data-js="${dataId}"]`

const getBaseTable = (attr = {}) => {
  const table = getNewElement("table", { ...attr, class: "table mb-0 table-bordered table-striped table-dark overflow-hidden" })
  const thead = getNewElement("thead", { class: "bg-primary bg-gradient" })
  const tbody = getNewElement("tbody")
  
  table.append(thead)
  table.append(tbody)

  return table
}

const checkIfWordMustBeChanged = word => ({
  elastico: "elástico",
  botoes  : "botões",
  algodao : "algodão",
})[word] || word

const getFormattedKey = key => checkIfWordMustBeChanged(key).ucFirst()

const getUnitOfMeasurement = type => ({
  linha   : "m",
  tecido  : "m",
  elastico: "m",
  botoes  : "un",
  estampa :	"m",
  corante :	"kg",
  bolso   : "m",
  algodao : "m",
  seda    : "m",
  tempo   : "min",
})[type.toLowerCase()] || ''

const getMultiplier = factor => value => value * factor
const multiplyByHundred = getMultiplier(100)
const multiplyByThousand = getMultiplier(1000)

const getFormattedMoney = value => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
const getFormattedHourByMinutes = minutes => Math.floor(minutes / 60) + " h " + (minutes % 60).toString().padStart(2, '0')

const getFormattedValue = (key, value) => {
  const unitOfMeasurement = getUnitOfMeasurement(key)
  const isCentimeter = unitOfMeasurement === "m" && value > 0 && value < 1
  const isGram = unitOfMeasurement === "kg" && value > 0 && value < 1
  const isHour = unitOfMeasurement === "min" && value > 60
  const isZero = value === 0

  if (key === "valor")
    return getFormattedMoney(value)
  
  if (isCentimeter)
    return multiplyByHundred(value) + " cm"

  if (isGram)
    return multiplyByThousand(value) + " g"

  if (isHour)
    return getFormattedHourByMinutes(value)

  if (isZero)
    return value

  return value.toLocaleString("pt-BR") + ' ' + unitOfMeasurement
}

const getPlaceholderArrayOfObjects = () => ([
  {
    "#": 1,
    first: "Mark",
    last: "Otto",
    handle: "@mdo"
  },
  {
    "#": 2,
    first: "Jacob",
    last: "Thornton",
    handle: "@fat"
  },
  {
    "#": 3,
    first: "Larry",
    last: "the Bird",
    handle: "@twitter"
  },
])

const getArrayOfObjects = () => ([
  {
    produtos: "x1 = Regata",
    linha   : 4,
    tecido  : 2.5,
    elastico: 1,
    botoes  : 0,
    estampa : 0,
    corante : 0,
    bolso   : 0,
    algodao : 0,
    seda    : 0,
    tempo   : 2,
    valor   : 25,
  },
  {
    produtos: "x2 = Lisa",
    linha   : 7,
    tecido  : 3,
    elastico: 1.2,
    botoes  : 0,
    estampa : 0,
    corante : 0,
    bolso   : 0,
    algodao : 0,
    seda    : 0,
    tempo   : 3,
    valor   : 30,
  },
  {
    produtos: "x3 = Manga Longa",
    linha   : 8,
    tecido  : 3.5,
    elastico: 1.4,
    botoes  : 0,
    estampa : 0,
    corante : 0,
    bolso   : 0,
    algodao : 0,
    seda    : 0,
    tempo   : 4,
    valor   : 40,
  },
  {
    produtos: "x4 = Polo",
    linha   : 8,
    tecido  : 3.3,
    elastico: 0,
    botoes  : 3,
    estampa : 0,
    corante : 0,
    bolso   : 0,
    algodao : 0,
    seda    : 0,
    tempo   : 4,
    valor   : 45,
  },
  {
    produtos: "x5 = Social",
    linha   : 10,
    tecido  : 0,
    elastico: 0,
    botoes  : 7,
    estampa : 0,
    corante : 0,
    bolso   : 0.1,
    algodao : 4,
    seda    : 0,
    tempo   : 6,
    valor   : 55,
  },
  {
    produtos: "x6 = Gola V",
    linha   : 6,
    tecido  : 2.8,
    elastico: 1,
    botoes  : 0,
    estampa : 0,
    corante : 0,
    bolso   : 0,
    algodao : 0,
    seda    : 0,
    tempo   : 3,
    valor   : 30,
  },
  {
    produtos: "x7 = Portuguesa",
    linha   : 6,
    tecido  : 0,
    elastico: 1.8,
    botoes  : 3,
    estampa : 0,
    corante : 0,
    bolso   : 0,
    algodao : 0,
    seda    : 3,
    tempo   : 5,
    valor   : 55,
  },
  {
    produtos: "x8 = Estampa",
    linha   : 7,
    tecido  : 3,
    elastico: 1.2,
    botoes  : 0,
    estampa : 0.25,
    corante : 0.2,
    bolso   : 0,
    algodao : 0,
    seda    : 0,
    tempo   : 7,
    valor   : 50,
  },
  {
    produtos: "Total",
    linha   : 600,
    tecido  : 200,
    elastico: 50,
    botoes  : 200,
    estampa : 200,
    corante : 6,
    bolso   : 50,
    algodao : 50,
    seda    : 50,
    tempo   : 480,
    valor   : 330,
  },
])
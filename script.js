const ulBtnNav = document.querySelector(`[data-js="ul-footer"]`);

const slide = (toLeft = false) => {
  const back = toLeft === true ? "-back" : '';

  const elementToShow = document.querySelector(`:is(.slide-out, .slide-back-out)`);
  const elementToHide = document.querySelector(`:is(.slide-in, .slide-back-in)`);

  elementToShow.classList.remove("slide-in", "slide-back-in", "slide-out", "slide-back-out");
  elementToHide.classList.remove("slide-in", "slide-back-in", "slide-out", "slide-back-out");

  elementToHide.classList.add(`slide${back}-out`);
  elementToShow.classList.add(`slide${back}-in`);
}

const slideToRight  = () => slide();
const slideToLeft   = () => slide(true);

const verifyDataset = dataset => ({
  "btn-left"    : slideToRight,
  "btn-right"   : slideToLeft,
})[dataset?.js] || false

const startAfterClick = e => {
  const navButton = e.target;

  const funcToCall = verifyDataset(navButton.dataset.js);

  if (!funcToCall)
    return;
  
  funcToCall();
}

const verifyKey = key => ({
  "ArrowRight"  : slideToRight,
  "ArrowLeft"   : slideToLeft,
})[key] || false

const startAfterKeyup = e => {
  const key = e.key;

  const funcToCall = verifyKey(key);

  if (!funcToCall)
    return;
  
  funcToCall();
}

const init = () => {
  const obj6 = getObject();
  const tabela = document.querySelector(`[data-js="tabela-1"]`);
  const theadTrFragment = document.createDocumentFragment();
  const tbodyFragment = document.createDocumentFragment();

  Object.keys(obj6.at(0)).forEach(key => {
    const th = document.createElement("th");
    th.innerText = getFormattedKey(key);
    theadTrFragment.append(th);
  })

  obj6.forEach(obj => {
    const tr = document.createElement("tr");

    Object.entries(obj).forEach(([ key, value ], i) => {
      const elementType = i === 0 ? "th" : "td";
      const trChild = document.createElement(elementType);

      const formattedValue = getFormattedValue(key, value);
      trChild.innerText = formattedValue;

      tr.append(trChild);
    })

    tbodyFragment.append(tr);
  })

  tabela.firstElementChild.firstElementChild.append(theadTrFragment);
  tabela.lastElementChild.append(tbodyFragment);
}

ulBtnNav.addEventListener("click", startAfterClick);
document.addEventListener("keyup", startAfterKeyup);

document.addEventListener("DOMContentLoaded", init);
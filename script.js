const ulBtnNav = document.querySelector(`[data-js="ul-footer"]`);

const slide = (toLeft = false) => {
  const back = toLeft === true ? "-back" : '';

  const btnToShow = document.querySelector(`:is(.slide-out, .slide-back-out)`);
  const btnToHide = document.querySelector(`:is(.slide-in, .slide-back-in)`);

  btnToShow.classList.remove("slide-in", "slide-back-in", "slide-out", "slide-back-out");
  btnToHide.classList.remove("slide-in", "slide-back-in", "slide-out", "slide-back-out");

  btnToHide.classList.add(`slide${back}-out`);
  btnToShow.classList.add(`slide${back}-in`);
}

const slideToRight  = () => slide();
const slideToLeft   = () => slide(true);

const verifyDataset = dataset => ({
  "btn-left"    : slideToRight,
  "btn-right"   : slideToLeft,
})[dataset?.js] || false

const startAfterClick = e => {
  const navButton = e.target;

  const funcToCall = verifyDataset(navButton.dataset);

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

ulBtnNav.addEventListener("click", startAfterClick);
document.addEventListener("keyup", startAfterKeyup);
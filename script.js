const button = document.querySelector(`[data-js="button-slide-in"]`);

const reloadSlide = e => {
    button.classList.remove("slide-in");
    setTimeout(() => button.classList.add("slide-out"), 50);
}

button.addEventListener("click", reloadSlide);
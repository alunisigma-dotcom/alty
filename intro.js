button.addEventListener("click", () => {
  button.disabled = true;

  document.dispatchEvent(new CustomEvent("alty:enter"));

  intro.style.transition = "opacity .8s ease";
  intro.style.opacity = "0";

  setTimeout(() => {
    intro.remove();
  }, 800);
});
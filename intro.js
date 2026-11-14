
document.addEventListener("DOMContentLoaded", () => {
  const template = document.querySelector("template");
  if (!template) return;

  document.body.appendChild(template.content.cloneNode(true));

  const button = document.getElementById("enterBtn");
  const intro = document.getElementById("introScreen");

  if (!button || !intro) return;

  button.addEventListener("click", () => {
    button.disabled = true;
   
   document.dispatchEvent(new CustomEvent("alty:enter"));

    // Uruchom okienka bezpośrednio podczas kliknięcia.
    document.dispatchEvent(new CustomEvent("alty:enter"));

    intro.style.transition = "opacity .8s ease";
    intro.style.opacity = "0";

    setTimeout(() => {
      intro.remove();
    }, 800);
  });
});

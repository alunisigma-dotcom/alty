document.addEventListener("DOMContentLoaded", () => {
  const template = document.querySelector("template");
  if (!template) return;

  document.body.appendChild(template.content.cloneNode(true));

  const button = document.getElementById("enterBtn");
  const intro = document.getElementById("introScreen");

  if (!button || !intro) return;

  button.addEventListener("click", () => {
    button.disabled = true;
    intro.style.transition = "opacity .8s ease";
    intro.style.opacity = "0";

    setTimeout(() => {
      intro.remove();
    }, 800);
  });
});
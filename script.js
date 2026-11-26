const view = document.getElementById("view");
const gallery = document.getElementById("gallery");
const plan = document.getElementById("plan");
const feedback = document.getElementById("feedback");
const results = document.getElementById("results");
const player = document.getElementById("player");
const accept = document.getElementById("accept");
const variants = new Map([
  ["ash", "Пепельный закат"],
  ["ice", "Ледниковый свет"],
  ["night", "Ночной перевал"]
]);

function figureFor(look) {
  return look === "night" ? "images/coraline-wave.svg" : "images/coraline.svg";
}

for (const [look, name] of variants) {
  const link = document.createElement("a");
  link.className = "choice";
  link.href = "#" + look;
  link.setAttribute("aria-label", "Открыть вариант «" + name + "»");

  const miniature = document.createElement("div");
  miniature.className = "scene";
  miniature.dataset.look = look;
  miniature.setAttribute("aria-hidden", "true");
  const message = document.createElement("div");
  message.className = "message";
  const title = document.createElement("p");
  title.className = "headline";
  title.innerHTML = document.getElementById("question").innerHTML;
  const buttonLabel = document.createElement("span");
  buttonLabel.className = "action";
  buttonLabel.textContent = accept.textContent;
  message.append(title, buttonLabel);
  const figure = view.querySelector(".figure").cloneNode();
  figure.setAttribute("src", figureFor(look));
  miniature.append(message, figure);
  const label = document.createElement("span");
  label.className = "choice-name";
  label.textContent = name;
  link.append(miniature, label);
  gallery.querySelector(".choices").append(link);
}

function showRoute() {
  const route = location.hash.slice(1);
  gallery.hidden = route !== "variants";
  plan.hidden = route !== "plan";
  view.hidden = !gallery.hidden || !plan.hidden;
  if (results.open) results.close();
  if (!view.hidden) {
    view.dataset.look = variants.has(route) ? route : "night";
    view.querySelector(".figure").setAttribute("src", figureFor(view.dataset.look));
  }
  document.getElementById("back").href = "#" + view.dataset.look;
  if (plan.hidden) {
    player.replaceChildren();
  } else {
    openReel();
    document.getElementById("plan-title").focus({preventScroll: true});
  }
  window.scrollTo(0, 0);
  document.title = !gallery.hidden ? "Три вида Арарата" : !plan.hidden ? "План на субботу" : "В субботу вечером";
}

accept.addEventListener("click", () => {
  location.hash = "plan";
});

function openReel() {
  const frame = document.createElement("iframe");
  frame.title = "Рецепт ужина в Instagram";
  frame.src = "https://www.instagram.com/p/DgGg__7ReDK/embed/";
  frame.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
  frame.allowFullscreen = true;
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  player.replaceChildren(frame);
}

function updateCustomFields() {
  for (const group of feedback.querySelectorAll("fieldset")) {
    const custom = group.querySelector(".custom-answer");
    const input = custom.querySelector("input");
    const active = group.querySelector('input[value="other"]').checked;
    custom.hidden = !active;
    input.disabled = !active;
    input.required = active;
  }
}

feedback.addEventListener("change", updateCustomFields);
window.addEventListener("pageshow", updateCustomFields);
feedback.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(feedback);
  const answers = document.getElementById("answers");
  answers.replaceChildren();
  const fields = [["dish", "Блюдо"], ["drink", "Напиток"], ["movie", "Смотрим"], ["time", "Время встречи"]];
  for (const [key, label] of fields) {
    const choice = data.get(key);
    const value = choice === "other" ? data.get(key + "Text") : choice;
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value.trim();
    answers.append(term, description);
  }
  results.showModal();
  results.scrollTop = 0;
});

window.addEventListener("hashchange", showRoute);
showRoute();

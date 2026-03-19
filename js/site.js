const projects = [
  {
    title: "Finger Lickin' Good",
    tags: "Creative Coding, Procedural Animation, p5.js",
    date: "2024",
    image: "assets/gifs/finger_lickin_good.gif",
    link: "project.html?project=finger-lickin-good"
  },
  {
    title: "Typewriter Vision",
    tags: "Interactive Storytelling, p5.js, WebGL",
    date: "2024",
    image: "assets/gifs/typewriter_vision.gif",
    link: "project.html?project=typewriter-vision"
  },
  {
    title: "Case I-70",
    tags: "Interactive Storytelling / Illustration / p5.js",
    date: "2024",
    image: "assets/gifs/case_I-70.gif",
    link: "project.html?project=case-i-70"
  }
];

const grid = document.getElementById("workGrid");

if (grid) {
  grid.innerHTML = projects
    .map(
      (project) => `
        <article class="work-card">
          <img class="work-card__media" src="${project.image}" alt="${project.title} thumbnail" loading="lazy">
          <a class="work-card__link" href="${project.link}" aria-label="Open ${project.title}">
            <div class="work-meta">
              <h3>${project.title}</h3>
              <p>${project.tags}</p>
              <span class="work-date">${project.date}</span>
            </div>
          </a>
        </article>
      `
    )
    .join("");
}

const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.getElementById("site-menu");
const topbar = document.querySelector(".topbar");

if (menuToggle && menuPanel && topbar) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.classList.toggle("is-open", !isOpen);
    topbar.classList.toggle("is-open", !isOpen);
    menuPanel.setAttribute("aria-hidden", String(isOpen));
  });
}

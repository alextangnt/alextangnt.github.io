const projectLibrary = window.projectLibrary || {};
const projects = Object.values(projectLibrary).map((project) => ({
  title: project.title,
  tags: project.tag,
  date: project.year,
  image: project.image,
  link: project.link
}));

const grid = document.getElementById("workGrid");

if (grid && projects.length) {
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

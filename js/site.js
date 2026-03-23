const projectLibrary = window.projectLibrary || {};
const projectEntries = Object.entries(projectLibrary);
const projects = projectEntries.map(([slug, project]) => ({
  slug,
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
        <article class="work-card${project.slug === "finger-lickin-good" ? " work-card--finger-lickin-good" : ""}">
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

const heroGif = document.getElementById("heroGif");

if (heroGif) {
  const gifSources = [
    ...new Set(
      projectEntries
        .map(([, project]) => project.image)
        .filter((src) => typeof src === "string" && src.toLowerCase().endsWith(".gif"))
    )
  ];

  if (gifSources.length) {
    let currentIndex = Math.floor(Math.random() * gifSources.length);
    heroGif.src = gifSources[currentIndex];

    const swapGif = () => {
      if (gifSources.length < 2) {
        return;
      }
      let nextIndex = currentIndex;
      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * gifSources.length);
      }
      currentIndex = nextIndex;
      const nextSrc = gifSources[currentIndex];
      heroGif.src = `${nextSrc}${nextSrc.includes("?") ? "&" : "?"}v=${Date.now()}`;
    };

    window.setInterval(swapGif, 7000);
  }
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

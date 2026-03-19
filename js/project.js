const projectLibrary = window.projectLibrary || {};

const urlParams = new URLSearchParams(window.location.search);
const projectKey = urlParams.get("project") || "finger-lickin-good";
const projectContent = projectLibrary[projectKey] || projectLibrary["finger-lickin-good"];
const projectKeys = Object.keys(projectLibrary);
const currentIndex = Math.max(0, projectKeys.indexOf(projectKey));

const frame = document.getElementById("projectFrame");
const title = document.getElementById("projectTitle");
const tag = document.getElementById("projectTag");
const summary = document.getElementById("projectSummary");
const tools = document.getElementById("projectTools");
const role = document.getElementById("projectRole");
const date = document.getElementById("projectDate");
const description = document.getElementById("projectDescription");
const prevLink = document.getElementById("projectPrev");
const nextLink = document.getElementById("projectNext");
const infoBar = document.getElementById("projectInfoBar");
const toggles = Array.from(document.querySelectorAll(".view-toggle"));

function renderView(key) {
  const view = projectContent.views[key];
  if (!frame || !view) return;

  frame.innerHTML = "";

  if (view.type === "iframe") {
    const iframe = document.createElement("iframe");
    iframe.src = view.src;
    iframe.title = `${projectContent.title} view`;
    iframe.loading = "lazy";
    iframe.allow = "fullscreen";
    frame.appendChild(iframe);
  }

  if (view.type === "video") {
    const video = document.createElement("video");
    video.controls = true;
    video.src = view.src;
    if (view.poster) video.poster = view.poster;
    frame.appendChild(video);
  }

  if (view.type === "image") {
    const img = document.createElement("img");
    img.src = view.src;
    img.alt = projectContent.title;
    frame.appendChild(img);
  }

  if (view.type === "embed") {
    const iframe = document.createElement("iframe");
    iframe.src = view.src;
    iframe.title = `${projectContent.title} embed`;
    iframe.loading = "lazy";
    iframe.allow = "fullscreen; autoplay; encrypted-media";
    frame.appendChild(iframe);
  }
}

if (title) title.textContent = projectContent.title;
if (tag) tag.textContent = projectContent.tag;
if (summary) summary.textContent = projectContent.summary;
if (tools) tools.textContent = projectContent.tools || "p5.js";
if (role) role.textContent = projectContent.role || "Concept, Design, Development";
if (date) date.textContent = projectContent.year || "2024";
if (description) {
  description.textContent =
    projectContent.description ||
    projectContent.summary ||
    "Longer description of the project goes here.";
}

if (prevLink && nextLink) {
  const prevIndex = (currentIndex - 1 + projectKeys.length) % projectKeys.length;
  const nextIndex = (currentIndex + 1) % projectKeys.length;
  prevLink.href = `project.html?project=${projectKeys[prevIndex]}`;
  nextLink.href = `project.html?project=${projectKeys[nextIndex]}`;
}

if (infoBar) {
  infoBar.addEventListener("click", () => {
    const isOpen = infoBar.classList.contains("is-open");
    infoBar.classList.toggle("is-open", !isOpen);
    infoBar.setAttribute("aria-expanded", String(!isOpen));
  });
}

if (toggles.length) {
  const available = new Set(Object.keys(projectContent.views));
  toggles.forEach((toggle) => {
    const key = toggle.dataset.view;
    if (!available.has(key)) {
      toggle.disabled = true;
      toggle.classList.remove("is-active");
    }
    toggle.addEventListener("click", () => {
      if (!available.has(key)) return;
      toggles.forEach((btn) => btn.classList.remove("is-active"));
      toggle.classList.add("is-active");
      renderView(key);
    });
  });
}

renderView("p5");

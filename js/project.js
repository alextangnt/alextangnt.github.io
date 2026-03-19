(() => {
const projectLibrary = window.projectLibrary || {};

const urlParams = new URLSearchParams(window.location.search);
const rawProjectKey = urlParams.get("project") || "finger-lickin-good";
const projectKey = rawProjectKey.trim().toLowerCase().replace(/\s+/g, "-");
const projectKeys = Object.keys(projectLibrary);
const resolvedKey =
  (projectLibrary[projectKey] && projectKey) ||
  (projectLibrary["finger-lickin-good"] && "finger-lickin-good") ||
  projectKeys[0];
const projectContent = projectLibrary[resolvedKey];
const currentIndex = Math.max(0, projectKeys.indexOf(resolvedKey));

const frame = document.getElementById("projectFrame");
const title = document.getElementById("projectTitle");
const tag = document.getElementById("projectTag");
const tools = document.getElementById("projectTools");
const role = document.getElementById("projectRole");
const date = document.getElementById("projectDate");
const description = document.getElementById("projectDescription");
const prevLink = document.getElementById("projectPrev");
const nextLink = document.getElementById("projectNext");
const infoBar = document.getElementById("projectInfoBar");
const pageBody = document.body;
const pageHtml = document.documentElement;
const detailsSection = document.getElementById("projectDetails");
const galleryGrid = document.getElementById("projectGallery");
const bodyContainer = document.getElementById("projectBody");
const linksContainer = document.getElementById("projectLinks");

// Scroll locking is handled by the project-scroll container and body classes.
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
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
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

  if (view.type === "html") {
    frame.innerHTML = view.html;
    const hasEmbedStyle =
      projectContent.embedStyle && projectContent.embedStyle.background;
    if (hasEmbedStyle) {
      frame.style.background = projectContent.embedStyle.background;
      frame.style.display = "flex";
      frame.style.alignItems = "center";
      frame.style.justifyContent = "center";
      frame.style.padding = "24px";
    }
    const iframes = frame.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      if (!hasEmbedStyle) {
        iframe.setAttribute("width", "100%");
        iframe.setAttribute("height", "100%");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
      } else {
        iframe.style.maxWidth = "100%";
      }
      iframe.style.border = "none";
      iframe.style.margin = "0 auto";
    });
  }
}

if (!projectContent) {
  console.warn("No project data found. Check js/project-data.js and URL params.");
} else if (title) {
  title.textContent = projectContent.title;
}
if (projectContent) {
  if (tag) tag.textContent = projectContent.tag;
  if (tools) tools.textContent = projectContent.tools || "p5.js";
  if (role) role.textContent = projectContent.role || "Concept, Design, Development";
  if (date) date.textContent = projectContent.year || "2024";
if (description) {
  description.textContent =
    projectContent.description ||
    "Longer description of the project goes here.";
}

if (galleryGrid) {
  galleryGrid.innerHTML = (projectContent.gallery || [])
    .map((src) => `<img src="${src}" alt="${projectContent.title} gallery image">`)
    .join("");
}

if (bodyContainer) {
  bodyContainer.innerHTML = (projectContent.body || [])
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

if (linksContainer) {
  linksContainer.innerHTML = (projectContent.links || [])
    .map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer noopener">${link.label}</a>`)
    .join("");
}
}

if (projectContent && prevLink && nextLink && projectKeys.length) {
  const prevIndex = (currentIndex - 1 + projectKeys.length) % projectKeys.length;
  const nextIndex = (currentIndex + 1) % projectKeys.length;
  prevLink.href = `project.html?project=${projectKeys[prevIndex]}`;
  nextLink.href = `project.html?project=${projectKeys[nextIndex]}`;
}

if (infoBar) {
  infoBar.addEventListener("click", () => {
    const isOpen = infoBar.classList.contains("is-open");
    const nowOpen = !isOpen;
    infoBar.classList.toggle("is-open", nowOpen);
    infoBar.setAttribute("aria-expanded", String(nowOpen));
    if (pageBody) {
      pageBody.classList.toggle("is-scroll", nowOpen);
    }
    if (pageHtml) {
      pageHtml.classList.toggle("is-scroll", nowOpen);
    }
    if (pageBody && pageHtml) {
      pageHtml.style.overflowY = "hidden";
      pageHtml.style.height = "100%";
      pageBody.style.overflowY = "hidden";
      pageBody.style.height = "100%";
    }
    if (nowOpen && detailsSection) {
      detailsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

if (projectContent) {
  const viewKeys = Object.keys(projectContent.views || {});
  const preferredOrder = ["html", "embed", "video", "image", "p5"];
  const defaultKey =
    preferredOrder.find((key) => viewKeys.includes(key)) || viewKeys[0];
  if (defaultKey) {
    renderView(defaultKey);
  }
}
})();

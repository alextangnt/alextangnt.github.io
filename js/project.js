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
const display = document.querySelector(".project-display");
const title = document.getElementById("projectTitle");
const tag = document.getElementById("projectTag");
const tools = document.getElementById("projectTools");
const role = document.getElementById("projectRole");
const date = document.getElementById("projectDate");
const description = document.getElementById("projectDescription");
const prevLink = document.getElementById("projectPrev");
const nextLink = document.getElementById("projectNext");
const infoBar = document.getElementById("projectInfoBar");
let suppressTitleHover = false;
const infoTitle = document.querySelector(".project-info-bar__title");
const pageBody = document.body;
const pageHtml = document.documentElement;
const detailsSection = document.getElementById("projectDetails");
const backToTop = document.getElementById("backToTop");
const galleryGrid = document.getElementById("projectGallery");
const bodyContainer = document.getElementById("projectBody");
const linksContainer = document.getElementById("projectLinks");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxVideo = document.getElementById("lightboxVideo");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
let lightboxIndex = 0;
let lightboxItems = [];
const projectScroll = document.getElementById("projectScroll");
const viewToggle = document.getElementById("viewToggle");
const viewKeys = Object.keys(projectContent?.views || {});
const hasP5View = viewKeys.some((key) => key.toLowerCase() === "p5");

const updateInfoBarHeight = () => {
  if (!infoBar) return;
  if (infoBar.classList.contains("is-open") || infoBar.classList.contains("is-title-hover")) {
    return;
  }
  const currentHeight = infoBar.getBoundingClientRect().height;
  if (!currentHeight) return;
  infoBar.dataset.collapsedHeight = String(currentHeight);
  document.documentElement.style.setProperty("--info-bar-height", `${currentHeight}px`);
};

// Scroll locking is handled by the project-scroll container and body classes.
const toggles = Array.from(document.querySelectorAll(".view-toggle"));

function getViewKind(view) {
  if (!view) return null;
  if (view.html) return "html";
  if (view.site) return "iframe";
  if (view.src) {
    const src = view.src.toLowerCase();
    if (
      src.includes("video.wixstatic.com") ||
      src.endsWith(".mp4") ||
      src.endsWith(".mov") ||
      src.endsWith(".webm")
    ) {
      return "video";
    }
    if (
      src.includes("static.wixstatic.com/media") ||
      src.endsWith(".png") ||
      src.endsWith(".jpg") ||
      src.endsWith(".jpeg") ||
      src.endsWith(".gif") ||
      src.endsWith(".webp") ||
      src.endsWith(".svg")
    ) {
      return "image";
    }
    return "iframe";
  }
  return null;
}

function renderView(key) {
  const view = projectContent.views[key];
  if (!frame || !view) return;
  const kind = getViewKind(view);
  const src = view.site || view.src;

  frame.innerHTML = "";
  if (display) {
    const isVideoView =
      hasP5View && (key.toLowerCase() === "video" || kind === "video");
    display.classList.toggle("is-video-contained", isVideoView);
    if (projectContent.fullPage === false) {
      display.classList.add("is-contained");
      document.body.classList.add("project-contained");
    } else if (!display.classList.contains("is-video-contained")) {
      display.classList.remove("is-contained");
      document.body.classList.remove("project-contained");
    }
  }

  if (kind === "iframe") {
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = `${projectContent.title} view`;
    iframe.loading = "lazy";
    iframe.allow = "fullscreen";
    frame.appendChild(iframe);
  }

  if (kind === "video") {
    const video = document.createElement("video");
    video.controls = true;
    video.src = src;
    if (view.poster) video.poster = view.poster;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    frame.appendChild(video);
  }

  if (kind === "image") {
    const img = document.createElement("img");
    img.src = src;
    img.alt = projectContent.title;
    frame.appendChild(img);
  }

  if (kind === "html") {
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
  if (role) {
    if (projectContent.role) {
      role.textContent = projectContent.role;
      const roleRow = role.closest("p");
      if (roleRow) roleRow.style.display = "";
    } else {
      const roleRow = role.closest("p");
      if (roleRow) roleRow.style.display = "none";
    }
  }
  if (date) date.textContent = projectContent.year || "2024";
const renderDescription = (text, useMarkdown = false) => {
  if (!description) return;
  if (useMarkdown && window.marked) {
    description.innerHTML = window.marked.parse(text);
  } else {
    description.textContent = text;
  }
};

if (description) {
  const rawDescription =
    projectContent.description ||
    "Longer description of the project goes here.";

  if (
    typeof rawDescription === "string" &&
    rawDescription.trim().toLowerCase().endsWith(".md")
  ) {
    fetch(rawDescription)
      .then((response) => (response.ok ? response.text() : Promise.reject(response)))
      .then((markdown) => renderDescription(markdown, true))
      .catch(() => renderDescription(rawDescription, false));
  } else {
    const shouldParse =
      typeof rawDescription === "string" &&
      window.marked &&
      /[#*_`\\[]/.test(rawDescription);
    renderDescription(rawDescription, shouldParse);
  }
}

if (galleryGrid) {
  const isVideo = (src) =>
    /video\\.wixstatic\\.com|\\.mp4$|\\.mov$|\\.webm$/i.test(src || "");
  lightboxItems = (projectContent.gallery || []).map((src) => ({
    src,
    type: isVideo(src) ? "video" : "image"
  }));
  if (!lightboxItems.length) {
    const gallerySection = galleryGrid.closest(".project-details__gallery");
    if (gallerySection) gallerySection.style.display = "none";
  }
  galleryGrid.innerHTML = lightboxItems
    .map((item, index) => {
      if (item.type === "video") {
        return `<button class="project-gallery__item project-gallery__item--video" type="button" data-index="${index}"><video src="${item.src}" muted playsinline autoplay loop preload="auto"></video></button>`;
      }
      return `<button class="project-gallery__item" type="button" data-index="${index}"><img src="${item.src}" alt="${projectContent.title} gallery image"></button>`;
    })
    .join("");

  const galleryVideos = galleryGrid.querySelectorAll("video");
  galleryVideos.forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";
    video.play().catch(() => {});
  });
}

const renderBody = (html, baseUrl = null) => {
  if (!bodyContainer) return;
  bodyContainer.innerHTML = html;

  const images = Array.from(bodyContainer.querySelectorAll("img"));
  images.forEach((img) => {
    if (img.closest("figure")) return;
    const caption = (img.getAttribute("alt") || "").trim();
    if (!caption) return;
    const figure = document.createElement("figure");
    figure.className = "project-body__figure";
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = caption;
    img.parentNode.insertBefore(figure, img);
    figure.appendChild(img);
    figure.appendChild(figcaption);
  });

  if (baseUrl) {
    images.forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!src) return;
      if (/^(https?:|data:|\/)/i.test(src)) return;
      try {
        const resolved = new URL(src, baseUrl).toString();
        img.setAttribute("src", resolved);
      } catch {
        return;
      }
    });
  }
};

if (bodyContainer) {
  const rawBody = projectContent.body;

  if (typeof rawBody === "string") {
    if (rawBody.trim().toLowerCase().endsWith(".md")) {
      const baseUrl = new URL(rawBody, window.location.href);
      fetch(rawBody)
        .then((response) => (response.ok ? response.text() : Promise.reject(response)))
        .then((markdown) =>
          renderBody(
            window.marked ? window.marked.parse(markdown) : `<p>${markdown}</p>`,
            baseUrl
          )
        )
        .catch(() => renderBody(`<p>${rawBody}</p>`));
    } else if (window.marked && /[#*_`\\[]/.test(rawBody)) {
      renderBody(window.marked.parse(rawBody));
    } else {
      renderBody(`<p>${rawBody}</p>`);
    }
  } else {
    renderBody(
      (rawBody || [])
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join("")
    );
  }
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
    if (!nowOpen) {
      infoBar.classList.add("is-collapsing");
      infoBar.classList.remove("is-title-hover");
      infoBar.classList.add("is-hover-suppressed");
      suppressTitleHover = true;
      window.setTimeout(() => {
        infoBar.classList.remove("is-collapsing");
      }, 250);
    } else {
      infoBar.classList.remove("is-hover-suppressed");
    }
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
    if (!nowOpen) {
      window.setTimeout(() => {
        requestAnimationFrame(updateInfoBarHeight);
      }, 260);
    }
  });
}

if (backToTop) {
  backToTop.addEventListener("click", () => {
    if (projectScroll) {
      projectScroll.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

if (infoBar && infoTitle) {
  infoTitle.addEventListener("mouseenter", () => {
    if (suppressTitleHover) return;
    if (infoBar.classList.contains("is-open")) return;
    infoBar.classList.add("is-title-hover");
  });
}

if (infoBar) {
  infoBar.addEventListener("mouseenter", () => {
    if (suppressTitleHover) return;
    if (infoBar.classList.contains("is-open")) return;
    infoBar.classList.remove("is-collapsing");
    infoBar.classList.remove("is-hover-suppressed");
    if (!infoBar.classList.contains("is-open")) {
      infoBar.classList.add("is-title-hover");
    }
  });
  infoBar.addEventListener("mouseleave", () => {
    suppressTitleHover = false;
    if (infoBar.classList.contains("is-open")) return;
    infoBar.classList.add("is-collapsing");
    infoBar.classList.remove("is-title-hover");
    window.setTimeout(() => {
      infoBar.classList.remove("is-collapsing");
      infoBar.classList.add("is-hover-suppressed");
      requestAnimationFrame(updateInfoBarHeight);
    }, 250);
  });
}

updateInfoBarHeight();
window.addEventListener("resize", () => {
  requestAnimationFrame(updateInfoBarHeight);
});


function openLightbox(index) {
  if (!lightbox || !lightboxItems.length) return;
  lightboxIndex = index;
  const item = lightboxItems[lightboxIndex];
  if (item.type === "video") {
    if (lightboxVideo) {
      lightboxVideo.src = item.src;
      lightboxVideo.style.display = "block";
    }
    if (lightboxImage) {
      lightboxImage.style.display = "none";
    }
  } else {
    if (lightboxImage) {
      lightboxImage.src = item.src;
      lightboxImage.style.display = "block";
    }
    if (lightboxVideo) {
      lightboxVideo.style.display = "none";
      lightboxVideo.removeAttribute("src");
    }
  }
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  if (lightboxVideo) {
    lightboxVideo.pause();
  }
}

function showLightbox(delta) {
  if (!lightboxItems.length) return;
  lightboxIndex = (lightboxIndex + delta + lightboxItems.length) % lightboxItems.length;
  openLightbox(lightboxIndex);
}

if (galleryGrid) {
  galleryGrid.addEventListener("click", (event) => {
    const target = event.target.closest(".project-gallery__item");
    if (!target) return;
    const index = Number(target.dataset.index || 0);
    openLightbox(index);
  });
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", () => showLightbox(-1));
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", () => showLightbox(1));
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
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
  if (display && projectContent.fullPage === false) {
    display.classList.add("is-contained");
    document.body.classList.add("project-contained");
  }
  const ranked = viewKeys
    .map((key) => {
      const kind = getViewKind(projectContent.views[key]);
      const order = ["html", "video", "image", "iframe"];
      const score = order.indexOf(kind);
      return { key, score: score === -1 ? 99 : score };
    })
    .sort((a, b) => a.score - b.score);
  const videoKey =
    viewKeys.find((key) => key.toLowerCase() === "video") ||
    viewKeys.find((key) => getViewKind(projectContent.views[key]) === "video");
  const defaultKey = ranked[0] ? ranked[0].key : null;
  const initialKey = hasP5View && videoKey ? videoKey : defaultKey;
  if (initialKey) renderView(initialKey);

  if (viewToggle) {
    const p5Key = viewKeys.find((key) => key.toLowerCase() === "p5");

    if (p5Key) {
      let currentKey = initialKey === p5Key ? p5Key : videoKey || p5Key;
      const hasVideo = Boolean(videoKey);
      viewToggle.disabled = !hasVideo;
      viewToggle.textContent = currentKey === videoKey ? "VIEW P5" : "VIEW VIDEO";
      viewToggle.classList.remove("is-hidden");
      viewToggle.style.display = "inline-flex";
      viewToggle.setAttribute("aria-disabled", String(!hasVideo));
      viewToggle.classList.toggle("is-disabled", !hasVideo);
      if (hasVideo) {
        viewToggle.addEventListener("click", () => {
          currentKey = currentKey === videoKey ? p5Key : videoKey;
          renderView(currentKey);
          viewToggle.textContent = currentKey === videoKey ? "VIEW P5" : "VIEW VIDEO";
        });
      }
    } else {
      viewToggle.classList.add("is-hidden");
      viewToggle.style.display = "none";
    }
  }
}
})();

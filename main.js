(function () {
  const projects = window.PROJECTS || [];

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  document.getElementById("projects").innerHTML = projects
    .map((p) => {
      const pic = p.image
        ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`
        : `<div class="noimg" aria-hidden="true">${esc(p.title)}</div>`;
      const name = p.url
        ? `<a href="${esc(p.url)}">${esc(p.title)}</a>`
        : `<strong>${esc(p.title)}</strong>`;
      const media = p.url ? `<a href="${esc(p.url)}" tabindex="-1">${pic}</a>` : pic;
      return `<article class="project">${media}<p>${name} ${esc(p.blurb)}</p></article>`;
    })
    .join("");

  document.getElementById("year").textContent = new Date().getFullYear();
})();

(function () {
  const projects = window.PROJECTS || [];

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  document.getElementById("projects").innerHTML = projects
    .map((p) => {
      const img = p.image
        ? `<img src="${esc(p.image)}" alt="" loading="lazy">`
        : `<div class="noimg"></div>`;
      const inner = `${img}<h2>${esc(p.title)}</h2><p>${esc(p.blurb)}</p>`;
      return p.url
        ? `<li><a href="${esc(p.url)}">${inner}</a></li>`
        : `<li>${inner}</li>`;
    })
    .join("");
})();

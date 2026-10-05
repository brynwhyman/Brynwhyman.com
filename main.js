(function () {
  const projects = window.PROJECTS || [];
  const list = document.getElementById("projects");
  const chips = document.querySelectorAll(".chip");

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function card(p, i) {
    const n = String(projects.length - i).padStart(3, "0");
    const thumb = p.image
      ? `<img src="${esc(p.image)}" alt="" loading="lazy">`
      : `<span class="glyph" aria-hidden="true">${esc(p.glyph || "✦")}</span>`;
    const tags = (p.tags || []).map((t) => `<li>${esc(t)}</li>`).join("");
    const inner = `
      <div class="thumb" style="--tile:${esc(p.color || "var(--accent-soft)")}">${thumb}</div>
      <div class="meta">
        <span class="num">№ ${n}</span>
        <span class="status status-${esc(p.status)}">${esc(p.status)}</span>
        <span class="year">${esc(p.year)}</span>
      </div>
      <h2>${esc(p.title)}</h2>
      <p>${esc(p.blurb)}</p>
      <ul class="tags">${tags}</ul>`;
    const body = p.url
      ? `<a class="card" href="${esc(p.url)}">${inner}<span class="arrow" aria-hidden="true">↗</span></a>`
      : `<div class="card">${inner}</div>`;
    return `<li data-status="${esc(p.status)}">${body}</li>`;
  }

  list.innerHTML = projects.map(card).join("");

  // Counts on filter chips
  const counts = { all: projects.length };
  projects.forEach((p) => (counts[p.status] = (counts[p.status] || 0) + 1));
  document.querySelectorAll("[data-count]").forEach((el) => {
    el.textContent = counts[el.dataset.count] || 0;
  });

  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => {
        c.classList.toggle("is-active", c === chip);
        c.setAttribute("aria-pressed", c === chip);
      });
      list.querySelectorAll("li[data-status]").forEach((li) => {
        li.hidden = f !== "all" && li.dataset.status !== f;
      });
    })
  );

  document.getElementById("surprise").addEventListener("click", () => {
    const visible = [...list.querySelectorAll("li[data-status]:not([hidden])")];
    if (!visible.length) return;
    const pick = visible[Math.floor(Math.random() * visible.length)];
    list.querySelectorAll(".picked").forEach((el) => el.classList.remove("picked"));
    pick.classList.add("picked");
    pick.scrollIntoView({ behavior: "smooth", block: "center" });
    pick.querySelector(".card").focus({ preventScroll: true });
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();

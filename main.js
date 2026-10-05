(function () {
  const projects = window.PROJECTS || [];
  const list = document.getElementById("projects");
  const ghost = document.getElementById("ghost");
  const root = document.documentElement;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const statusNote = { live: "", tinkering: "still tinkering", retired: "retired" };

  list.innerHTML = projects
    .map((p, i) => {
      const note = statusNote[p.status] ? `<em class="note">(${statusNote[p.status]})</em>` : "";
      const tag = p.url ? "a" : "div";
      const href = p.url ? ` href="${esc(p.url)}"` : "";
      return `<li><${tag} class="row"${href} data-i="${i}">
        <span class="yr">${esc(p.year)}</span>
        <span class="name">${esc(p.title)}</span>
        <span class="blurb">${esc(p.blurb)} ${note}</span>
      </${tag}></li>`;
    })
    .join("");

  document.getElementById("tally").textContent =
    String(projects.length).padStart(2, "0") + " things";
  document.getElementById("year").textContent = "© " + new Date().getFullYear();

  // Hover floods the page with the project's colour and floats a preview by the cursor.
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function show(i) {
    const p = projects[i];
    root.style.setProperty("--flood", p.color || "#fff");
    document.body.classList.add("flooded");
    ghost.innerHTML = p.image
      ? `<img src="${esc(p.image)}" alt="">`
      : `<span>${esc(p.glyph || "*")}</span>`;
    ghost.classList.add("on");
  }
  function hide() {
    document.body.classList.remove("flooded");
    ghost.classList.remove("on");
  }

  list.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("mouseenter", () => show(+row.dataset.i));
    row.addEventListener("focus", () => show(+row.dataset.i));
    row.addEventListener("blur", hide);
  });
  list.addEventListener("mouseleave", hide);

  if (fine) {
    window.addEventListener("mousemove", (e) => {
      ghost.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }
})();

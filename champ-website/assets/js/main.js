(() => {
  "use strict";
  const content = window.CHAMP_CONTENT || { members: [], events: [] };
  const grid = document.querySelector("#member-grid");
  const search = document.querySelector("#member-search");
  const school = document.querySelector("#school-filter");
  const count = document.querySelector("#member-count");
  const noResults = document.querySelector("#member-empty");
  const members = Array.isArray(content.members) ? content.members : [];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function safeLink(value) {
    try {
      const url = new URL(value, window.location.href);
      return ["https:", "http:"].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }

  function createMember(member) {
    const card = element("article", "member-card");
    const photoWrap = element("div", "member-photo-wrap");
    const photo = element("img", "member-photo");
    photo.src = member.image;
    photo.alt = `Portrait of ${member.name}`;
    photo.width = 400;
    photo.height = 400;
    photo.loading = "lazy";
    photo.decoding = "async";
    photo.addEventListener("error", () => {
      const initials = member.name.replace(/^A\.\s*/, "").split(/\s+/).filter(Boolean).map(part => part[0]).slice(0, 2).join("");
      const fallback = element("span", "member-initials", initials);
      fallback.setAttribute("role", "img");
      fallback.setAttribute("aria-label", `Portrait unavailable for ${member.name}`);
      photo.replaceWith(fallback);
    }, { once: true });
    photoWrap.append(photo);
    if (member.role) photoWrap.append(element("span", "cochair-badge", member.role));
    const meta = element("div", "member-meta");
    meta.append(element("h3", "", member.name));
    meta.append(element("p", "member-title", member.title));
    meta.append(element("p", "member-school", member.school));
    const profileUrl = safeLink(member.profile);
    if (profileUrl) {
      const link = element("a", "member-profile", "University profile");
      link.href = profileUrl;
      link.setAttribute("aria-label", `View ${member.name}'s university profile`);
      const arrow = element("span", "", "↗");
      arrow.setAttribute("aria-hidden", "true");
      link.append(arrow);
      meta.append(link);
    }
    card.append(photoWrap, meta);
    return card;
  }

  function renderMembers() {
    const query = search.value.trim().toLocaleLowerCase();
    const selected = school.value;
    const visible = members.filter(member => {
      const text = [member.name, member.title, member.school, member.unit, member.role || ""].join(" ").toLocaleLowerCase();
      return (selected === "all" || member.unit === selected) && text.includes(query);
    });
    grid.replaceChildren(...visible.map(createMember));
    count.textContent = `${visible.length} ${visible.length === 1 ? "member" : "members"}`;
    noResults.hidden = visible.length !== 0;
  }

  if (members.length) {
    [...new Set(members.map(member => member.unit))].sort().forEach(unit => {
      const option = element("option", "", unit);
      option.value = unit;
      school.append(option);
    });
    document.querySelector("#member-tools").hidden = false;
    search.addEventListener("input", renderMembers);
    school.addEventListener("change", renderMembers);
    renderMembers();
  }

  const zone = "America/New_York";
  const isoWithOffset = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})$/;
  const events = (Array.isArray(content.events) ? content.events : []).map(event => {
    if (!isoWithOffset.test(event.start || "") || (event.end && !isoWithOffset.test(event.end))) return null;
    const start = new Date(event.start);
    const end = event.end ? new Date(event.end) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < start) return null;
    return { ...event, startDate: start, endDate: end };
  }).filter(event => event && event.endDate >= new Date()).sort((a, b) => a.startDate - b.startDate);

  const datePart = (date, options) => new Intl.DateTimeFormat("en-US", { timeZone: zone, ...options }).format(date);
  if (events.length) {
    const nodes = events.map(event => {
      const card = element("article", "event-card");
      const date = element("time", "event-date");
      date.dateTime = event.start;
      date.setAttribute("aria-label", datePart(event.startDate, { dateStyle: "full" }));
      date.append(element("span", "month", datePart(event.startDate, { month: "short" })));
      date.append(element("span", "day", datePart(event.startDate, { day: "numeric" })));
      date.append(element("span", "year", datePart(event.startDate, { year: "numeric" })));
      const info = element("div", "event-info");
      info.append(element("h3", "", event.title));
      const timeText = datePart(event.startDate, { weekday: "long", hour: "numeric", minute: "2-digit", timeZoneName: "short" });
      info.append(element("p", "event-meta", `${timeText}${event.location ? " · " + event.location : ""}`));
      if (event.description) info.append(element("p", "", event.description));
      const eventUrl = safeLink(event.url);
      if (event.url && eventUrl) {
        const link = element("a", "text-link", `${event.linkLabel || "Event details"} ↗`);
        link.href = eventUrl;
        info.append(link);
      }
      card.append(date, info);
      return card;
    });
    document.querySelector("#events-list").replaceChildren(...nodes);
  }

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  window.matchMedia("(min-width: 801px)").addEventListener("change", event => {
    if (event.matches) closeMenu();
  });

  if ("IntersectionObserver" in window) {
    const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-15% 0px -65% 0px" });
    document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
  }
  document.querySelector("#copyright-year").textContent = new Date().getFullYear();
})();

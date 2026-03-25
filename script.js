const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleLabel = document.querySelector(".theme-toggle-label");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealElements = document.querySelectorAll(".reveal");
const currentYear = document.getElementById("current-year");

body.classList.add("js-enabled");

const storedTheme = localStorage.getItem("portfolio-theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");

const setTheme = (theme, persist = true) => {
  body.setAttribute("data-theme", theme);
  const label = theme === "dark" ? "Light mode" : "Dark mode";
  if (themeToggleLabel) {
    themeToggleLabel.textContent = label;
  }

  if (persist) {
    localStorage.setItem("portfolio-theme", theme);
  }
};

if (themeToggle && themeToggleLabel) {
  setTheme(storedTheme || (systemPrefersDark ? "dark" : "light"), Boolean(storedTheme));

  themeToggle.addEventListener("click", () => {
    const nextTheme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

themeMedia.addEventListener("change", (event) => {
  if (!localStorage.getItem("portfolio-theme")) {
    setTheme(event.matches ? "dark" : "light", false);
  }
});

const closeMenu = () => {
  if (!navToggle || !siteNav) {
    return;
  }

  navToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
};

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 760) {
      closeMenu();
    }
  });
});

document.addEventListener("click", (event) => {
  if (!siteNav || !navToggle) {
    return;
  }

  if (!siteNav.contains(event.target) && !navToggle.contains(event.target) && siteNav.classList.contains("is-open")) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (!siteNav) {
    return;
  }

  if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
    closeMenu();
  }
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

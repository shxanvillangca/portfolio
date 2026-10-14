document.addEventListener("DOMContentLoaded", function () {
  var menuToggle = document.getElementById("menu-toggle");
  var mainNav = document.getElementById("main-nav");
  var themeToggle = document.getElementById("theme-toggle");
  var root = document.documentElement;

  function toggleMenu() {
    var isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  }

  function closeMenu() {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function applyTheme(theme) {
    var next = theme === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", theme);
    themeToggle.textContent = next === "dark" ? "Dark mode" : "Light mode";
    themeToggle.setAttribute("aria-label", "Switch to " + next + " mode");
  }

  function getStartingTheme() {
    try {
      var saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    } catch (error) {
      return "dark";
    }
    return "dark";
  }

  function toggleTheme() {
    var newTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      return;
    }
  }

  menuToggle.addEventListener("click", toggleMenu);
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  applyTheme(getStartingTheme());
  themeToggle.addEventListener("click", toggleTheme);

  var progressBar = document.getElementById("scroll-progress");
  var revealItems = document.querySelectorAll(".detail-block, .card, .section-title, .section-note, .footer-inner");

  function updateProgress() {
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progressBar.style.width = percent + "%";
  }

  function showItem(item) {
    item.classList.add("visible");
  }

  revealItems.forEach(function (item) {
    var position = Array.prototype.indexOf.call(item.parentElement.children, item);
    item.style.setProperty("--delay", position * 0.12 + "s");
    item.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          showItem(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(showItem);
  }

  document.querySelectorAll(".card, .detail-block").forEach(function (item) {
    item.addEventListener("mousemove", function (event) {
      var rect = item.getBoundingClientRect();
      item.style.setProperty("--mx", event.clientX - rect.left + "px");
      item.style.setProperty("--my", event.clientY - rect.top + "px");
    });
    item.addEventListener("mouseleave", function () {
      item.style.removeProperty("--mx");
      item.style.removeProperty("--my");
    });
  });

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
});
const hero = document.querySelector(".hero-wrapper");
const header = document.querySelector(".site-header");
const headerAvatar = document.querySelector(".header-avatar");
const headerTitle = document.querySelector(".header-title");

const TRANSITION_DISTANCE = window.innerHeight * 0.6;

function updateOnScroll() {
  const scrollY = window.scrollY;
  const progress = Math.min(scrollY / TRANSITION_DISTANCE, 1);

  document.documentElement.style.setProperty("--scroll-progress", progress);

  const showHeader = progress > 0.85;
  header.classList.toggle("scrolled", showHeader);
  headerAvatar.classList.toggle("visible", showHeader);
  headerTitle.classList.toggle("visible", showHeader);

  hero.style.pointerEvents = progress > 0.5 ? "none" : "auto";
}

window.addEventListener("scroll", updateOnScroll, { passive: true });
updateOnScroll();

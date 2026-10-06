document.addEventListener("DOMContentLoaded", () => {

  const nav = document.querySelector(".site-nav");
  const links = document.querySelectorAll(".nav-link");
  const sections = [
    ...document.querySelectorAll("main section[id]")
  ];

  // --------------------------------
  // Sticky Navbar
  // --------------------------------
  function updateNavbar() {
    if (window.scrollY > 30) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    // Active menu item
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;

      if (window.scrollY >= sectionTop) {
        currentSection = section.id;
      }
    });

    links.forEach((link) => {
      link.classList.remove("active");

      if (
        link.getAttribute("href") === `#${currentSection}`
      ) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );

  updateNavbar();


  // --------------------------------
  // Smooth Scroll
  // --------------------------------
  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener("click", function (event) {

        const target = document.querySelector(
          this.getAttribute("href")
        );

        if (!target) return;

        event.preventDefault();

        const navbarHeight = nav.offsetHeight;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          navbarHeight -
          8;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });


        // Close mobile Bootstrap menu
        const mobileMenu =
          document.querySelector(".navbar-collapse");

        if (mobileMenu.classList.contains("show")) {

          const collapse =
            bootstrap.Collapse.getOrCreateInstance(
              mobileMenu
            );

          collapse.hide();
        }

      });

    });


  // --------------------------------
  // Current Year
  // --------------------------------
  const yearElement =
    document.getElementById("year");

  if (yearElement) {
    yearElement.textContent =
      new Date().getFullYear();
  }


  // --------------------------------
  // Scroll Reveal Animation
  // --------------------------------
  const revealElements =
    document.querySelectorAll(
      ".story-card, " +
      ".region-card, " +
      ".word-card, " +
      ".vocab-panel, " +
      ".grammar-card, " +
      ".example-card, " +
      ".meaning-card, " +
      ".explain-card"
    );


  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "revealed"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.08
      }
    );


  revealElements.forEach(
    (element, index) => {

      const delay =
        Math.min(index % 4, 3) * 70;

      element.style.setProperty(
        "--delay",
        `${delay}ms`
      );

      revealObserver.observe(
        element
      );

    }
  );

});
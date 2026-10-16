document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".site-nav");
  const links = [...document.querySelectorAll(".site-nav .nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];

  function pageKey(pathname) {
    const normalized = new URL(pathname, window.location.href).pathname
      .replace(/\/index\.html$/i, "/");
    return normalized.replace(/\/+$/, "") || "/";
  }

  function updateNavbar() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 30);

    const readingLine = (nav?.offsetHeight || 0) + 150;
    let currentSection = "";
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= readingLine) currentSection = section.id;
    }

    const currentPage = pageKey(window.location.pathname);
    for (const link of links) {
      const target = new URL(link.href, window.location.href);
      const isSamePage = pageKey(target.pathname) === currentPage;
      const isCurrentSection = Boolean(target.hash) && target.hash.slice(1) === currentSection;
      const isCurrentPage = !target.hash && isSamePage;
      const isActive = (isSamePage && isCurrentSection) || isCurrentPage;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", target.hash ? "location" : "page");
      else link.removeAttribute("aria-current");
    }
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  window.addEventListener("hashchange", updateNavbar);
  updateNavbar();

  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener("click", function (event) {
      const targetUrl = new URL(this.href, window.location.href);
      if (!targetUrl.hash || pageKey(targetUrl.pathname) !== pageKey(window.location.pathname)) return;

      const target = document.getElementById(decodeURIComponent(targetUrl.hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", targetUrl.hash);
      const navbarHeight = nav?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 8;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: targetPosition, behavior: reducedMotion ? "auto" : "smooth" });

      const mobileMenu = document.querySelector(".navbar-collapse");
      if (mobileMenu?.classList.contains("show")) {
        if (window.bootstrap?.Collapse) window.bootstrap.Collapse.getOrCreateInstance(mobileMenu).hide();
        else mobileMenu.classList.remove("show");
      }
    });
  });

  const yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  const revealElements = document.querySelectorAll(
    ".story-card, .region-card, .word-card, .vocab-panel, .grammar-card, " +
    ".example-card, .meaning-card, .explain-card"
  );
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!reducedMotionQuery.matches && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealElements.forEach((element, index) => {
      element.style.setProperty("--delay", Math.min(index % 4, 3) * 70 + "ms");
      revealObserver.observe(element);
    });
  }

  // Desktop-only motion layer. All added classes and elements are removed when
  // the viewport, pointer capability, or motion preference no longer qualifies.
  const desktopMotionQuery = window.matchMedia(
    "(min-width: 1200px) and (hover: hover) and (pointer: fine)"
  );
  let stopDesktopMotion = null;

  function startDesktopMotion() {
    const root = document.documentElement;
    root.classList.add("motion-enabled");

    const spotlights = [...document.querySelectorAll(
      ".hero-card, .language-hero-card, .story-card.large, .puadhi-feature-card, " +
      ".contact-email-card, .contact-info-card, .support-card, .same-sentence-card, .language-story-card"
    )];
    const tiltCards = [...document.querySelectorAll(
      ".hero-card, .language-hero-card, .story-card.large, .puadhi-feature-card, .support-card"
    )];
    const magneticButtons = [...document.querySelectorAll(
      ".hero-actions .btn-primary, .site-nav .nav-cta, .contact-email-button, .coffee-button"
    )];
    const headings = [...document.querySelectorAll(
      ".hero h1, .language-hero h1, .contact-hero h1, .section-heading h2, .kurali-title, " +
      ".archive-inner h2, .language-archive-inner h2, .contact-closing-inner h2"
    )];
    const vocabularySelector = [
      ".word-card strong", ".vocab-row b", ".nature-strip strong", ".grammar-card b",
      ".meaning-top span", ".dialect-table b", ".language-card-main strong",
      ".dialect-name-list b", ".dialect-word"
    ].join(",");
    const ornaments = [];
    const orbitTargets = [];
    const decoratedSections = [];

    spotlights.forEach((card) => {
      card.classList.add("motion-spotlight");
      const darkSurface = card.matches(".puadhi-feature-card, .support-card") ||
        Boolean(card.closest(".section-dark, .direction-card"));
      card.dataset.motionTone = darkSurface ? "dark" : "light";
    });
    tiltCards.forEach((card) => {
      card.classList.add("motion-tilt");
      if (card.matches(".hero-card, .language-hero-card")) {
        card.style.setProperty("--motion-base-rotation", "-1deg");
      }
    });
    magneticButtons.forEach((button) => button.classList.add("motion-magnetic"));
    headings.forEach((heading) => heading.classList.add("motion-heading"));

    const heroHosts = [...document.querySelectorAll(".hero, .language-hero, .contact-hero")];
    const orbitHosts = [...heroHosts, ...document.querySelectorAll(".support-card")];
    orbitHosts.forEach((host) => {
      const ornament = document.createElement("span");
      ornament.className = "motion-orbit";
      ornament.setAttribute("aria-hidden", "true");
      const innerRotor = document.createElement("span");
      innerRotor.className = "motion-orbit-rotor motion-orbit-rotor--inner";
      const innerDot = document.createElement("span");
      innerDot.className = "motion-orbit-dot motion-orbit-dot--inner";
      innerRotor.append(innerDot);
      ornament.append(innerRotor);
      host.prepend(ornament);
      ornaments.push(ornament);

      if (heroHosts.includes(host)) {
        const outerOrbit = document.createElement("span");
        outerOrbit.className = "motion-outer-orbit";
        outerOrbit.setAttribute("aria-hidden", "true");
        const outerRotor = document.createElement("span");
        outerRotor.className = "motion-orbit-rotor motion-orbit-rotor--outer";
        const outerDot = document.createElement("span");
        outerDot.className = "motion-orbit-dot motion-orbit-dot--outer";
        outerRotor.append(outerDot);
        outerOrbit.append(outerRotor);
        host.prepend(outerOrbit);
        ornaments.push(outerOrbit);
      }
      orbitTargets.push(host);
    });

    [
      [document.querySelector("#daily"), "motion-decoration-vocabulary"],
      [document.querySelector("#relations"), "motion-decoration-family"],
      [document.querySelector("#grammar"), "motion-decoration-dark"],
      [document.querySelector("#variation"), "motion-decoration-dark"],
      [document.querySelector("#differences"), "motion-decoration-comparison"],
      [document.querySelector(".contact-main"), "motion-decoration-contact"],
      [document.querySelector(".contact-closing"), "motion-decoration-closing"]
    ].forEach(([section, decorationClass]) => {
      if (!section) return;
      section.classList.add("motion-section-decoration", decorationClass);
      decoratedSections.push({ section, decorationClass });
    });

    const cursorDot = document.createElement("span");
    const cursorRing = document.createElement("span");
    cursorDot.className = "motion-cursor-dot";
    cursorRing.className = "motion-cursor-ring";
    cursorDot.setAttribute("aria-hidden", "true");
    cursorRing.setAttribute("aria-hidden", "true");
    document.body.append(cursorRing, cursorDot);

    let pointerX = 0;
    let pointerY = 0;
    let pointerTarget = null;
    let frameId = 0;
    let activeSpotlight = null;
    let activeMagnet = null;
    let activeOrbitHost = null;
    let revealObserver = null;
    let cursorState = "";
    let lastCursorTarget = null;

    function closestElement(target, selector) {
      return target instanceof Element ? target.closest(selector) : null;
    }

    function updateCursorState(target) {
      if (target === lastCursorTarget) return;
      lastCursorTarget = target;
      const stateClasses = ["is-link", "is-button", "is-card", "is-word", "is-dark"];
      const word = closestElement(target, vocabularySelector);
      const button = closestElement(target, "button, [role='button'], .btn");
      const link = closestElement(target, "a[href]");
      const card = closestElement(target, ".motion-spotlight");
      const lightSurface = closestElement(target,
        ".hero-card, .language-hero-card, .story-card, .region-card, .word-card, .vocab-panel, " +
        ".contact-email-card, .contact-info-card, .meaning-card, .explain-card, .difference-card, " +
        ".culture-card, .regional-card, .language-story-card, .same-sentence-card"
      );
      const darkSurface = !lightSurface && closestElement(target,
        ".hero, .language-hero, .contact-hero, .section-dark, .support-card, .archive-section, " +
        ".language-archive-cta, .site-footer, .puadhi-feature-card, .direction-card, .grammar-card"
      );
      const nextState = [];

      if (word) nextState.push("is-word");
      else if (button) nextState.push("is-button");
      else if (link) nextState.push("is-link");
      else if (card) nextState.push("is-card");
      if (darkSurface) nextState.push("is-dark");
      const nextStateKey = nextState.join(" ");
      if (nextStateKey === cursorState) return;

      cursorState = nextStateKey;
      cursorDot.classList.remove(...stateClasses);
      cursorRing.classList.remove(...stateClasses);
      cursorDot.classList.add(...nextState);
      cursorRing.classList.add(...nextState);
    }

    function resetCard(card) {
      if (!card) return;
      card.style.removeProperty("--motion-pointer-x");
      card.style.removeProperty("--motion-pointer-y");
      card.style.removeProperty("--motion-tilt-x");
      card.style.removeProperty("--motion-tilt-y");
      card.style.removeProperty("--motion-lift");
    }

    function resetMagnet(button) {
      if (!button) return;
      button.style.removeProperty("--motion-magnet-x");
      button.style.removeProperty("--motion-magnet-y");
    }

    function resetOrbit(host) {
      if (!host) return;
      host.style.removeProperty("--motion-orbit-shift-x");
      host.style.removeProperty("--motion-orbit-shift-y");
    }

    function paintPointer() {
      frameId = 0;
      cursorDot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      cursorRing.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      cursorDot.classList.add("is-visible");
      cursorRing.classList.add("is-visible");

      const card = closestElement(pointerTarget, ".motion-spotlight");
      if (activeSpotlight && activeSpotlight !== card) resetCard(activeSpotlight);
      activeSpotlight = card;
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--motion-pointer-x", `${pointerX - rect.left}px`);
        card.style.setProperty("--motion-pointer-y", `${pointerY - rect.top}px`);
        if (card.classList.contains("motion-tilt")) {
          const x = Math.max(0, Math.min(1, (pointerX - rect.left) / rect.width));
          const y = Math.max(0, Math.min(1, (pointerY - rect.top) / rect.height));
          card.style.setProperty("--motion-tilt-x", `${(0.5 - y) * 4}deg`);
          card.style.setProperty("--motion-tilt-y", `${(x - 0.5) * 4}deg`);
          card.style.setProperty("--motion-lift", "-3px");
        }
      }

      const button = closestElement(pointerTarget, ".motion-magnetic");
      if (activeMagnet && activeMagnet !== button) resetMagnet(activeMagnet);
      activeMagnet = button;
      if (button) {
        const rect = button.getBoundingClientRect();
        const dx = Math.max(-3, Math.min(3, (pointerX - (rect.left + rect.width / 2)) * 0.08));
        const dy = Math.max(-2, Math.min(2, (pointerY - (rect.top + rect.height / 2)) * 0.08));
        button.style.setProperty("--motion-magnet-x", `${dx}px`);
        button.style.setProperty("--motion-magnet-y", `${dy}px`);
      }

      const orbitHost = closestElement(pointerTarget, ".hero, .language-hero, .contact-hero, .support-card");
      if (activeOrbitHost && activeOrbitHost !== orbitHost) resetOrbit(activeOrbitHost);
      activeOrbitHost = orbitHost;
      if (orbitHost) {
        const rect = orbitHost.getBoundingClientRect();
        const offsetX = ((pointerX - rect.left) / rect.width - 0.5) * 8;
        const offsetY = ((pointerY - rect.top) / rect.height - 0.5) * 8;
        orbitHost.style.setProperty("--motion-orbit-shift-x", `${Math.max(-4, Math.min(4, offsetX))}px`);
        orbitHost.style.setProperty("--motion-orbit-shift-y", `${Math.max(-4, Math.min(4, offsetY))}px`);
      }
    }

    function onPointerMove(event) {
      if (event.pointerType === "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerTarget = event.target;
      updateCursorState(pointerTarget);
      if (!window.getSelection()?.toString() && !frameId) {
        frameId = window.requestAnimationFrame(paintPointer);
      }
    }

    function onPointerOut(event) {
      const nextTarget = event.relatedTarget;
      if (!nextTarget) {
        cursorDot.classList.remove("is-visible");
        cursorRing.classList.remove("is-visible");
        resetCard(activeSpotlight);
        resetMagnet(activeMagnet);
        resetOrbit(activeOrbitHost);
        activeSpotlight = null;
        activeMagnet = null;
        activeOrbitHost = null;
        return;
      }
      pointerTarget = nextTarget;
      updateCursorState(nextTarget);
    }

    function onSelectionChange() {
      if (window.getSelection()?.toString()) {
        cursorDot.classList.remove("is-visible");
        cursorRing.classList.remove("is-visible");
      }
    }

    function onWindowBlur() {
      cursorDot.classList.remove("is-visible");
      cursorRing.classList.remove("is-visible");
      resetCard(activeSpotlight);
      resetMagnet(activeMagnet);
      resetOrbit(activeOrbitHost);
      activeSpotlight = null;
      activeMagnet = null;
      activeOrbitHost = null;
    }

    function onVisibilityChange() {
      root.classList.toggle("motion-paused", document.hidden);
      if (document.hidden) onWindowBlur();
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);

    if ("IntersectionObserver" in window && headings.length) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("motion-pending");
            entry.target.classList.add("motion-revealed");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
      headings.forEach((heading) => {
        heading.classList.add("motion-pending");
        revealObserver.observe(heading);
      });
    }

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      revealObserver?.disconnect();
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
      root.classList.remove("motion-enabled", "motion-paused");
      spotlights.forEach((card) => {
        card.classList.remove("motion-spotlight");
        delete card.dataset.motionTone;
        resetCard(card);
      });
      tiltCards.forEach((card) => {
        card.classList.remove("motion-tilt");
        card.style.removeProperty("--motion-base-rotation");
      });
      magneticButtons.forEach((button) => {
        button.classList.remove("motion-magnetic");
        resetMagnet(button);
      });
      orbitTargets.forEach(resetOrbit);
      decoratedSections.forEach(({ section, decorationClass }) => {
        section.classList.remove("motion-section-decoration", decorationClass);
      });
      headings.forEach((heading) => heading.classList.remove("motion-heading", "motion-pending", "motion-revealed"));
      ornaments.forEach((ornament) => ornament.remove());
      cursorDot.remove();
      cursorRing.remove();
    };
  }

  function syncDesktopMotion() {
    if (stopDesktopMotion) {
      stopDesktopMotion();
      stopDesktopMotion = null;
    }
    if (desktopMotionQuery.matches && !reducedMotionQuery.matches) {
      stopDesktopMotion = startDesktopMotion();
    }
  }

  if (desktopMotionQuery.addEventListener) desktopMotionQuery.addEventListener("change", syncDesktopMotion);
  else desktopMotionQuery.addListener(syncDesktopMotion);
  if (reducedMotionQuery.addEventListener) reducedMotionQuery.addEventListener("change", syncDesktopMotion);
  else reducedMotionQuery.addListener(syncDesktopMotion);
  syncDesktopMotion();
});

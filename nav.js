document.addEventListener('DOMContentLoaded', function () {
  // Mobile dropdown toggles — click to expand/collapse
  document.querySelectorAll('.nav-dropdown-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        this.closest('.nav-dropdown').classList.toggle('expanded');
      }
    });
  });

  // Collapse all dropdowns when the hamburger closes the nav
  document.querySelectorAll('.nav-hamburger').forEach(function (hamburger) {
    hamburger.addEventListener('click', function () {
      var nav = this.closest('.nav');
      // After the inline onclick toggles mobile-open, check if nav is now closed
      setTimeout(function () {
        if (!nav.classList.contains('mobile-open')) {
          nav.querySelectorAll('.nav-dropdown.expanded').forEach(function (d) {
            d.classList.remove('expanded');
          });
        }
      }, 0);
    });
  });
});

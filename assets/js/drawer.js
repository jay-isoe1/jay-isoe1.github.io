(function () {
  function init() {
    const hamburger = document.getElementById('jsHamburger');
    const drawer    = document.getElementById('jsDrawer');
    const overlay   = document.getElementById('jsOverlay');

    if (!hamburger || !drawer || !overlay) return;

    const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let lastFocused = null;

    function forceClosed(){
      drawer.setAttribute('aria-hidden','true');
      drawer.setAttribute('inert','');
      hamburger.setAttribute('aria-expanded','false');
      hamburger.classList.remove('is-open');
      overlay.hidden = true;
      overlay.classList.remove('is-open');
      document.body.classList.remove('drawer-open');
    }

    function openDrawer(){
      lastFocused = document.activeElement;
      drawer.removeAttribute('inert');
      drawer.setAttribute('aria-hidden','false');
      hamburger.setAttribute('aria-expanded','true');
      hamburger.classList.add('is-open');
      overlay.hidden = false;
      overlay.classList.add('is-open');
      document.body.classList.add('drawer-open');

      const first = drawer.querySelector(FOCUSABLE);
      if (first) first.focus();

      document.addEventListener('keydown', onKeydown);
    }

    function closeDrawer(){
      (lastFocused || hamburger).focus();
      drawer.setAttribute('inert','');
      drawer.setAttribute('aria-hidden','true');
      hamburger.setAttribute('aria-expanded','false');
      hamburger.classList.remove('is-open');
      overlay.classList.remove('is-open');
      overlay.hidden = true;
      document.body.classList.remove('drawer-open');
      document.removeEventListener('keydown', onKeydown);
    }

    function onKeydown(e){
      if (e.key === 'Escape'){ closeDrawer(); return; }
      if (e.key !== 'Tab') return;
      const focusables = drawer.querySelectorAll(FOCUSABLE);
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first){ last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last){ first.focus(); e.preventDefault(); }
    }

    hamburger.addEventListener('click', () => {
      const open = hamburger.getAttribute('aria-expanded') === 'true';
      open ? closeDrawer() : openDrawer();
    });

    overlay.addEventListener('click', closeDrawer);

    // 드로어 안 링크 클릭하면 닫기
    drawer.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (a) closeDrawer();
    });

    window.addEventListener('pageshow', forceClosed);
    forceClosed();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

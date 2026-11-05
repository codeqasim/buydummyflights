/* THE ONLY HAND-WRITTEN CLIENT SCRIPT. ALPINE CSP BUILD: NO INLINE EXPRESSIONS, EVERY COMPONENT IS REGISTERED HERE. */
document.addEventListener('alpine:init', function () {
  var A = window.Alpine;

  A.data('theme', function () {
    return {
      toggle: function () {
        var d = document.documentElement;
        var dark = d.classList.toggle('dark');
        try { localStorage.setItem('bdf.theme', dark ? 'dark' : 'light'); } catch (e) {}
      },
    };
  });

  A.data('header', function () {
    return {
      onScroll: function () { this.$el.classList.toggle('is-scrolled', window.scrollY > 8); },
      init: function () { this.onScroll(); },
    };
  });

  A.data('menu', function () {
    return { close: function () { this.$el.removeAttribute('open'); } };
  });

  // DESKTOP DROPDOWN (NATIVE <details>): CLOSE ON ESCAPE, ON A CLICK OUTSIDE, AND AFTER PICKING A LINK.
  A.data('dropdown', function () {
    return {
      close: function () { this.$el.removeAttribute('open'); },
      away: function (e) { if (!this.$el.contains(e.target)) this.$el.removeAttribute('open'); },
    };
  });

  A.data('reveal', function () {
    return { show: function () { this.$el.classList.add('is-in'); } };
  });

  A.data('faqItem', function () {
    return {
      init: function () { this.$el.querySelector('button').setAttribute('aria-expanded', 'false'); },
      toggle: function () {
        var root = this.$root;
        var open = root.classList.toggle('is-open');
        root.querySelector('button').setAttribute('aria-expanded', open ? 'true' : 'false');
      },
    };
  });

  A.data('flightForm', function () {
    return {
      trip: 'return', from: '', to: '',
      get isReturn() { return this.trip === 'return'; },
      swap: function () { var t = this.from; this.from = this.to; this.to = t; },
      onSubmit: function () {},
    };
  });

  A.data('orderForm', function () {
    return {
      message: '', busy: false,
      get hasMessage() { return this.message !== ''; },
      submit: async function (e) {
        var form = e.target;
        if (this.busy) return;
        this.busy = true; this.message = '';
        try {
          var body = {};
          new FormData(form).forEach(function (v, k) { body[k] = v; });
          var res = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
          var data = await res.json();
          this.message = data.ok ? 'Order received (preview). Payments are not connected yet. Reference: ' + data.reference : 'Please check your details and try again.';
        } catch (err) { this.message = 'Please check your details and try again.'; }
        this.busy = false;
      },
    };
  });
});

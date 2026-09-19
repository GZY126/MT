/* =========================================================
   技能环 SkillLoop · 交互逻辑
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- 1. 滚动揭示 ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  function initReveal() {
    [
      '.sec-head',
      '.pain-card',
      '.formula-box', '.calc-box', '.insight-conclusion',
      '.mech', '.mech-sm', '.funnel-row',
      '.card-me', '.match-panel',
      '.tl-item', '.flow-warn',
      '.fw-svg', '.fw-card',
      '.end-item'
    ].forEach(sel => {
      $$(sel).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (i % 4) * 80 + 'ms';
        io.observe(el);
      });
    });
  }

  /* ---------- 2. 导航平滑滚动（避开 sticky 导航） ---------- */
  function initNav() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', ev => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const t = document.querySelector(id);
        if (!t) return;
        ev.preventDefault();
        const y = t.getBoundingClientRect().top + window.scrollY - 68;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  /* ---------- 3. 匹配模拟器 ---------- */
  const btnMatch = $('#btnMatch');
  const btnReset = $('#btnReset');
  const panel = $('.match-panel');
  const coinEl = $('#coinNum');
  let running = false;
  const COIN_START = 3;

  function resetMatch() {
    panel.classList.remove('has-result');
    ['#mpL1', '#mpL2', '#mpL3'].forEach(s => $(s).classList.remove('show'));
    coinEl.textContent = COIN_START;
    btnMatch.disabled = false;
    btnMatch.textContent = '开始匹配';
    running = false;
  }

  async function runMatch() {
    if (running) return;
    running = true;
    btnMatch.disabled = true;

    // 重置
    ['#mpL1', '#mpL2', '#mpL3'].forEach(s => $(s).classList.remove('show'));
    panel.classList.add('has-result');
    coinEl.textContent = COIN_START;

    const steps = [
      { sel: '#mpL1', label: '检索 L1 精准互匹…', wait: 700 },
      { sel: '#mpL2', label: '扩展 L2 技能币匹配…', wait: 900 },
      { sel: '#mpL3', label: '尝试 L3 技能环撮合…', wait: 900 }
    ];

    // 让结果区进入视野
    const panelTop = panel.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: panelTop, behavior: 'smooth' });
    await sleep(420);

    for (let i = 0; i < steps.length; i++) {
      const st = steps[i];
      btnMatch.textContent = st.label;
      await sleep(st.wait);
      $(st.sel).classList.add('show');
      // L2 演示技能币消费
      if (st.sel === '#mpL2') {
        const from = COIN_START;
        for (let c = from; c > 1; c--) {
          coinEl.textContent = c - 1;
          coinEl.style.transform = 'scale(1.35)';
          coinEl.style.color = '#EF4444';
          setTimeout(() => {
            coinEl.style.transform = 'scale(1)';
            coinEl.style.color = '';
          }, 220);
          await sleep(260);
        }
      }
      await sleep(160);
    }

    btnMatch.textContent = '重新匹配';
    btnMatch.disabled = false;
    running = false;
  }

  /* ---------- 4. 漏斗可视宽度（按真实比例收敛） ---------- */
  function initFunnelAnim() {
    const io2 = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const bar = e.target.querySelector('i');
        const w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => { bar.style.transition = 'width .9s ease'; bar.style.width = w; }, 120);
        io2.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    $$('.funnel-rate').forEach(el => io2.observe(el));
  }

  /* ---------- 5. 初始化 ---------- */
  function init() {
    initReveal();
    initNav();
    initFunnelAnim();

    if (btnMatch) btnMatch.addEventListener('click', runMatch);
    if (btnReset) btnReset.addEventListener('click', resetMatch);

    resetMatch();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

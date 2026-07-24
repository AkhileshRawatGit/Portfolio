const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1500)));

  const auditData = await page.evaluate(() => {
    const selectorsToInspect = [
      'html',
      'body',
      'main',
      'section',
      '.hero',
      '.hero__grid',
      '.container',
      '.code-window',
      '.code-sidebar',
      '.header',
      '.mobile-nav',
      'canvas',
      '#particles',
      '#preloader',
      '.preloader'
    ];

    const elementsToAudit = new Set();

    selectorsToInspect.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => elementsToAudit.add(el));
    });

    // Add wrapper divs and divs with overflow settings
    document.querySelectorAll('div').forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.overflow !== 'visible' || style.overflowY !== 'visible' || style.overflowX !== 'visible') {
        elementsToAudit.add(el);
      }
      if (el.children.length > 0) {
        elementsToAudit.add(el);
      }
    });

    const report = [];

    elementsToAudit.forEach(el => {
      const style = window.getComputedStyle(el);
      const computedOverflow = style.overflow + ' (x: ' + style.overflowX + ', y: ' + style.overflowY + ')';
      const clientHeight = el.clientHeight;
      const scrollHeight = el.scrollHeight;
      const offsetHeight = el.offsetHeight;
      const clientWidth = el.clientWidth;
      const scrollWidth = el.scrollWidth;
      const offsetWidth = el.offsetWidth;

      const hasVerticalScrollbar = (scrollHeight > clientHeight) && 
        (style.overflowY === 'auto' || style.overflowY === 'scroll' || style.overflow === 'auto' || style.overflow === 'scroll' || el.tagName === 'HTML' || el.tagName === 'BODY');
      
      let whyItScrolls = 'Does not scroll independently';
      if (hasVerticalScrollbar) {
        whyItScrolls = 'Vertical Scrollbar Active! scrollHeight (' + scrollHeight + 'px) > clientHeight (' + clientHeight + 'px), computed overflowY = ' + style.overflowY;
      } else if (scrollHeight > clientHeight) {
        whyItScrolls = 'Content height (' + scrollHeight + 'px) exceeds clientHeight (' + clientHeight + 'px), computed overflowY = ' + style.overflowY;
      }

      let elName = el.tagName.toLowerCase();
      if (el.id) elName += '#' + el.id;
      if (el.className && typeof el.className === 'string' && el.className.trim()) {
        elName += '.' + el.className.trim().split(/\s+/).join('.');
      }

      report.push({
        element: elName,
        computedOverflow,
        clientHeight,
        scrollHeight,
        offsetHeight,
        clientWidth,
        scrollWidth,
        offsetWidth,
        hasVerticalScrollbar,
        whyItScrolls
      });
    });

    return report;
  });

  console.log('=== RUNTIME DOM INSPECTION REPORT ===');
  console.log(JSON.stringify(auditData, null, 2));

  // Test mutating overflow on elements with scrollbars to see what happens
  const testResults = await page.evaluate(() => {
    const results = [];
    const htmlStyle = window.getComputedStyle(document.documentElement);
    const bodyStyle = window.getComputedStyle(document.body);

    results.push({
      element: 'html',
      overflow: htmlStyle.overflow,
      overflowY: htmlStyle.overflowY,
      clientHeight: document.documentElement.clientHeight,
      scrollHeight: document.documentElement.scrollHeight,
      windowInnerHeight: window.innerHeight,
      windowOuterHeight: window.outerHeight
    });

    results.push({
      element: 'body',
      overflow: bodyStyle.overflow,
      overflowY: bodyStyle.overflowY,
      clientHeight: document.body.clientHeight,
      scrollHeight: document.body.scrollHeight
    });

    // Check every element in document to see if its getBoundingClientRect or scrollHeight causes scrollbars
    const all = Array.from(document.querySelectorAll('*'));
    all.forEach(el => {
      const s = window.getComputedStyle(el);
      if (s.overflowY === 'auto' || s.overflowY === 'scroll' || s.overflow === 'auto' || s.overflow === 'scroll') {
        results.push({
          element: el.tagName + (el.id ? '#'+el.id : '') + (el.className ? '.'+el.className.split(' ').join('.') : ''),
          overflowY: s.overflowY,
          clientHeight: el.clientHeight,
          scrollHeight: el.scrollHeight,
          isScrolling: el.scrollHeight > el.clientHeight
        });
      }
    });

    return results;
  });

  console.log('\n=== DETAILED SCROLLBAR DIAGNOSTIC ===');
  console.log(JSON.stringify(testResults, null, 2));

  await browser.close();
})();

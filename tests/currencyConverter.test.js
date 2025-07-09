const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

test('shows validation message for invalid amount', async () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  const { window } = dom;
  // Extract script containing convertCurrency
  const script = Array.from(window.document.querySelectorAll('script'))
    .map(s => s.textContent)
    .find(t => t.includes('convertCurrency'));
  window.eval(script);
  window.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));
  const amount = window.document.getElementById('amount');
  amount.value = '';
  await window.convertCurrency();
  expect(window.document.getElementById('currency-result').textContent)
    .toBe('Please enter a valid amount.');
});

module.exports = {
  testDir: '../tests',
  timeout: 60000,
  retries: 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    browserName: 'chromium',
    viewport: { width: 390, height: 844 },
    screenshot: 'on',
    trace: 'retain-on-failure'
  }
};

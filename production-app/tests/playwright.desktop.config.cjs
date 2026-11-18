module.exports = {
  testDir: '../tests',
  timeout: 60000,
  retries: 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    browserName: 'chromium',
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET ? {
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
      'x-vercel-set-bypass-cookie': 'true'
    } : {},
    viewport: { width: 1440, height: 900 },
    screenshot: 'on',
    trace: 'retain-on-failure'
  }
};

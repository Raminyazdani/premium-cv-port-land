#!/usr/bin/env node

/**
 * CI Smoke Test Script
 * 
 * This script performs HTTP-based smoke tests against a running server.
 * It validates that all three language routes (EN/DE/FA) respond correctly
 * with proper HTTP status and basic content.
 * 
 * Note: RTL/language attribute verification requires JavaScript execution
 * and is handled by Playwright tests (e2e/visual-proof.spec.ts), not here.
 * This script only verifies the server is responding with valid HTML.
 * 
 * Usage: npm run ci:smoke
 * 
 * Environment:
 *   CI_BASE_URL - Base URL to test (default: http://localhost:4173)
 * 
 * Exit codes:
 *   0 - All tests passed
 *   1 - One or more tests failed
 */

const BASE_URL = process.env.CI_BASE_URL || 'http://localhost:4173';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

/**
 * Fetch a URL and return response with content
 */
async function fetchUrl(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'CI-Smoke-Test/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      content: text
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message
    };
  }
}

/**
 * Wait for server to be ready
 */
async function waitForServer(url, maxAttempts = 30, interval = 2000) {
  log(colors.blue, `\n⏳ Waiting for server at ${url}...`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        log(colors.green, `✅ Server is ready! (attempt ${attempt}/${maxAttempts})`);
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }
    
    if (attempt < maxAttempts) {
      log(colors.yellow, `   Attempt ${attempt}/${maxAttempts} - waiting ${interval/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  
  log(colors.red, `❌ Server not ready after ${maxAttempts} attempts`);
  return false;
}

/**
 * Test a specific language route
 */
async function testLanguageRoute(lang) {
  const url = `${BASE_URL}/?lang=${lang}`;
  log(colors.cyan, `\n📋 Testing ${lang.toUpperCase()}: ${url}`);
  
  const result = await fetchUrl(url);
  const errors = [];
  const passed = [];
  
  // Check HTTP status
  if (!result.ok) {
    errors.push(`HTTP ${result.status}: ${result.error || 'Failed'}`);
    log(colors.red, `   ❌ HTTP Status: ${result.status}`);
    return { lang, passed: false, errors, passedChecks: passed };
  }
  passed.push(`HTTP 200 OK`);
  log(colors.green, `   ✅ HTTP Status: 200`);
  
  const content = result.content;
  
  // Check for undefined/null strings in HTML (these would be rendering bugs)
  if (content.includes('>undefined<') || content.includes('>null<')) {
    errors.push('Contains "undefined" or "null" strings in HTML');
    log(colors.red, `   ❌ Contains undefined/null strings`);
  } else {
    passed.push('No undefined/null strings');
    log(colors.green, `   ✅ No undefined/null strings`);
  }
  
  // Check for basic HTML structure
  if (!content.includes('<!DOCTYPE html>') && !content.includes('<!doctype html>')) {
    errors.push('Missing DOCTYPE - not a valid HTML page');
  } else {
    passed.push('Valid HTML DOCTYPE');
    log(colors.green, `   ✅ Valid HTML DOCTYPE`);
  }
  
  // Check that page has React root
  if (!content.includes('id="root"') && !content.includes("id='root'")) {
    errors.push('Missing React root element');
  } else {
    passed.push('React root element present');
    log(colors.green, `   ✅ React root element present`);
  }
  
  // Check content length (should have substantial content)
  if (content.length < 1000) {
    errors.push(`Content too short (${content.length} chars, expected > 1000)`);
    log(colors.red, `   ❌ Content length: ${content.length} chars (too short)`);
  } else {
    passed.push(`Content length OK (${content.length} chars)`);
    log(colors.green, `   ✅ Content length: ${content.length} chars`);
  }
  
  // Check that JavaScript bundle is included
  if (!content.includes('.js"') && !content.includes(".js'")) {
    errors.push('No JavaScript bundle found');
  } else {
    passed.push('JavaScript bundle included');
    log(colors.green, `   ✅ JavaScript bundle included`);
  }
  
  // Check that CSS is loaded
  if (!content.includes('.css"') && !content.includes(".css'") && !content.includes('<style')) {
    errors.push('No CSS found');
  } else {
    passed.push('CSS styles included');
    log(colors.green, `   ✅ CSS styles included`);
  }
  
  return { 
    lang, 
    passed: errors.length === 0, 
    errors, 
    passedChecks: passed 
  };
}

async function main() {
  log(colors.bright + colors.blue, '\n🔍 CI Smoke Test: HTTP-based Language Validation');
  log(colors.bright + colors.blue, '================================================');
  log(colors.blue, `Base URL: ${BASE_URL}`);
  log(colors.yellow, '\nNote: This tests HTTP responses only. RTL/language');
  log(colors.yellow, 'attribute verification is done by Playwright tests.');
  
  // Wait for server to be ready
  const serverReady = await waitForServer(BASE_URL);
  if (!serverReady) {
    log(colors.red, '\n❌ FAILED: Server not available');
    log(colors.yellow, '\nDiagnostic Information:');
    log(colors.yellow, '  - Check if the preview server is running');
    log(colors.yellow, '  - Verify the port 4173 is not blocked');
    log(colors.yellow, '  - Ensure the build completed successfully');
    process.exit(1);
  }
  
  // Languages to test
  const languages = ['en', 'de', 'fa'];
  
  // Run tests
  const results = [];
  for (const lang of languages) {
    const result = await testLanguageRoute(lang);
    results.push(result);
  }
  
  // Summary
  log(colors.bright + colors.cyan, '\n================================================');
  log(colors.bright + colors.cyan, 'SMOKE TEST SUMMARY');
  log(colors.bright + colors.cyan, '================================================\n');
  
  let allPassed = true;
  for (const result of results) {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED';
    const color = result.passed ? colors.green : colors.red;
    log(color, `${result.lang.toUpperCase()}: ${status}`);
    
    if (!result.passed) {
      allPassed = false;
      for (const error of result.errors) {
        log(colors.red, `     - ${error}`);
      }
    }
  }
  
  if (allPassed) {
    log(colors.bright + colors.green, '\n✅ ALL SMOKE TESTS PASSED');
    log(colors.green, 'Server is serving all three language routes correctly.');
    log(colors.green, 'HTML responses are valid and include all necessary assets.');
    log(colors.yellow, '\nNote: RTL verification for Persian requires JavaScript');
    log(colors.yellow, 'execution and is tested by Playwright (e2e/visual-proof.spec.ts).\n');
    process.exit(0);
  } else {
    log(colors.bright + colors.red, '\n❌ SOME SMOKE TESTS FAILED');
    log(colors.red, 'See details above for specific failures.\n');
    process.exit(1);
  }
}

main().catch(error => {
  log(colors.red, `\n❌ Unexpected error: ${error.message}`);
  process.exit(1);
});

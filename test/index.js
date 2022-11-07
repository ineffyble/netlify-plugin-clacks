import test from 'ava'
import { fileURLToPath } from 'url'
import stripAnsi from 'strip-ansi'

import netlifyBuild from '@netlify/build'

const DEFAULT_CONFIG = fileURLToPath(
  new URL('./configs/default.toml', import.meta.url),
)

const OVERRIDE_CONFIG = fileURLToPath(
  new URL('./configs/override.toml', import.meta.url),
)

const pluginOutput = (logs) => {
  const cleanedLogs = logs.stdout.map(l => stripAnsi(l).trim().replace('\n', ''));
  const pluginHeaderLine = cleanedLogs.findIndex(l => l.endsWith('.: Clacks Header'));
  const pluginOutput = cleanedLogs[pluginHeaderLine + 1];
  return pluginOutput;
}

// Unit tests are using the AVA test runner: https://github.com/avajs/ava
// A local build is performed using the following command:
//   netlify-build --config ../netlify.toml

test('Netlify Build should not fail', async (t) => {
  const { success, logs } = await netlifyBuild({
    config: DEFAULT_CONFIG,
    buffer: true,
  })

  // Check that build succeeded
  t.true(success)
})

test('Plugin should set Terry Pratchett header by default', async (t) => {
  const { success, logs, netlifyConfig: resultingConfig } = await netlifyBuild({
    config: DEFAULT_CONFIG,
    buffer: true,
  })

  // Check that the header is set
  t.assert(resultingConfig.headers.find(h => h.for === '/*').values['X-Clacks-Overhead'] === 'GNU Terry Pratchett');
  
  // Check that the build logs show plugin message
  t.assert(pluginOutput(logs) === 'X-Clacks-Overhead: GNU Terry Pratchett');
})

test('Plugin should allow overriding header', async (t) => {
  const { success, logs, netlifyConfig: resultingConfig } = await netlifyBuild({
    config: OVERRIDE_CONFIG,
    buffer: true,
  })

  // Check that the custom value header is set
  t.assert(resultingConfig.headers.find(h => h.for === '/*').values['X-Clacks-Overhead'] === 'LLAP Leonard Nimoy');
  
  // Check that the build logs show customised plugin message
  t.assert(pluginOutput(logs) === 'X-Clacks-Overhead: LLAP Leonard Nimoy');
})

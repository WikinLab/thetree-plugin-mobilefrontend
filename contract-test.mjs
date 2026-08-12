#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
const contract = JSON.parse(fs.readFileSync(path.join(root, 'contracts', 'mobilefrontend-data-contract.json'), 'utf8'));
const plugin = require('./mobilefrontend.js');

assert.equal(contract.schema, 1);
assert.equal(contract.pluginName, 'thetree-plugin-mobilefrontend');
assert.equal(contract.installDirectory, 'plugins/thetree-plugin-mobilefrontend');
assert.equal(contract.transport, 'skinData-page-data');
assert.equal(contract.publicDataKey, 'thetreeMobileFrontend');
assert.equal(contract.dataSchema, 'thetree-mobilefrontend/v1');
assert.equal(contract.modeField, 'mode');
assert.equal(contract.desktopMode, 'desktop');
assert.equal(contract.mobileMode, 'mobile');
assert.equal(contract.composedConfigDataKey, 'thetreeComposedSkinConfig');
assert.equal(contract.composedConfigSchema, 'thetree-composed-skin-config/v1');
assert.equal(contract.composerRuntimeSchema, 'thetree-skin-composer-runtime/v1');
assert.equal('supportedSkinNames' in contract, false);
assert.equal('desktopVariant' in contract, false);
assert.equal('mobileVariant' in contract, false);
assert.equal('fallbackVariant' in contract, false);
assert.equal(plugin.type, 'skinData');
assert.equal(plugin.name, contract.pluginName);

for (const skin of ['vector', 'minerva', 'vector-2022', 'native-a', undefined]) {
  for (const isMobile of [false, true]) {
    const page = { data: { existing: true } };
    assert.deepEqual(plugin.format({ req: { skin, isMobile }, page }), {});
    assert.deepEqual(page.data, {
      existing: true,
      thetreeMobileFrontend: {
        schema: 'thetree-mobilefrontend/v1',
        mode: isMobile ? 'mobile' : 'desktop'
      }
    });
  }
}

const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'thetree-mobilefrontend-'));
const previousSkinsRoot = process.env.THETREE_FRONTEND_SKINS_ROOT;
const previousConfig = global.config;
try {
  const runtimeRoot = path.join(fixtureRoot, 'composed', '.skin-composer', 'generated');
  fs.mkdirSync(runtimeRoot, { recursive: true });
  fs.writeFileSync(path.join(runtimeRoot, 'runtime-contract.json'), `${JSON.stringify({
    schema: 'thetree-skin-composer-runtime/v1',
    configNamespaces: ['skin.vector', 'skin.minerva'],
    sharedConfigKeys: ['wiki.logo_url']
  })}\n`);
  process.env.THETREE_FRONTEND_SKINS_ROOT = fixtureRoot;
  global.config = {
    'skin.vector.logo_image': 'url(/vector.png)',
    'skin.minerva.logo_wordmark': '/minerva.svg',
    'skin.composed.composition.debug': true,
    'wiki.logo_url': '/wiki-logo.svg',
    'wiki.private_token': 'undeclared-shared-key',
    'server.secret': 'must-not-cross-the-bridge'
  };
  const page = { data: {} };
  plugin.format({ req: { skin: 'composed', isMobile: true }, page });
  assert.deepEqual(page.data.thetreeComposedSkinConfig, {
    schema: 'thetree-composed-skin-config/v1',
    configNamespaces: ['skin.minerva', 'skin.vector'],
    sharedConfigKeys: ['wiki.logo_url'],
    values: {
      'skin.vector.logo_image': 'url(/vector.png)',
      'skin.minerva.logo_wordmark': '/minerva.svg',
      'wiki.logo_url': '/wiki-logo.svg'
    }
  });
  assert.equal('server.secret' in page.data.thetreeComposedSkinConfig.values, false);
  assert.equal('skin.composed.composition.debug' in page.data.thetreeComposedSkinConfig.values, false);
  assert.equal('wiki.private_token' in page.data.thetreeComposedSkinConfig.values, false);
} finally {
  if (previousSkinsRoot === undefined) delete process.env.THETREE_FRONTEND_SKINS_ROOT;
  else process.env.THETREE_FRONTEND_SKINS_ROOT = previousSkinsRoot;
  global.config = previousConfig;
  fs.rmSync(fixtureRoot, { recursive: true, force: true });
}

assert.deepEqual(plugin.format({}), {});
assert.deepEqual(plugin.format({ req: { isMobile: true } }), {});

console.log('MobileFrontend backend plugin contract passed.');

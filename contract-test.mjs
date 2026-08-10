#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
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

assert.deepEqual(plugin.format({}), {});
assert.deepEqual(plugin.format({ req: { isMobile: true } }), {});

console.log('MobileFrontend backend plugin contract passed.');

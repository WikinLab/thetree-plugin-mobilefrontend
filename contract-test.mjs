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
assert.deepEqual(contract.supportedSkinNames, ['vector', 'minerva']);
assert.equal(plugin.type, 'skinData');
assert.equal(plugin.name, contract.pluginName);

for (const skin of contract.supportedSkinNames) {
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

const unsupportedPage = { data: {} };
assert.deepEqual(plugin.format({ req: { skin: 'liberty', isMobile: true }, page: unsupportedPage }), {});
assert.deepEqual(unsupportedPage.data, {});

console.log('MobileFrontend backend plugin contract passed.');

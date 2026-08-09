#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
const contract = JSON.parse(fs.readFileSync(path.join(root, 'contracts', 'device-variant-data-contract.json'), 'utf8'));
const plugin = require('./vector-device-variant.js');

assert.equal(contract.schema, 1);
assert.equal(contract.pluginName, 'thetree-plugin-vector');
assert.equal(contract.installDirectory, 'plugins/thetree-plugin-vector');
assert.equal(contract.transport, 'skinData-page-data');
assert.equal(plugin.type, 'skinData');
assert.equal(plugin.name, contract.pluginName);
const desktopPage = { data: { existing: true } };
assert.deepEqual(plugin.format({ req: { skin: 'vector', isMobile: false }, page: desktopPage }), {});
assert.deepEqual(desktopPage.data, {
  existing: true,
  thetreeVectorDevice: { schema: 'thetree-vector-device/v1', variant: 'vector' }
});
const mobilePage = { data: {} };
assert.deepEqual(plugin.format({ req: { skin: 'vector', isMobile: true }, page: mobilePage }), {});
assert.deepEqual(mobilePage.data, {
  thetreeVectorDevice: { schema: 'thetree-vector-device/v1', variant: 'minerva' }
});
const independentMinervaPage = { data: {} };
assert.deepEqual(plugin.format({ req: { skin: 'minerva', isMobile: true }, page: independentMinervaPage }), {});
assert.deepEqual(independentMinervaPage.data, {});

console.log('Vector device backend plugin contract passed.');

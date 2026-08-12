'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RUNTIME_SCHEMA = 'thetree-skin-composer-runtime/v1';
const PUBLIC_SCHEMA = 'thetree-composed-skin-config/v1';
const RUNTIME_CONTRACT_PATH = path.join('.skin-composer', 'generated', 'runtime-contract.json');
const NAMESPACE_PATTERN = /^skin\.[a-z0-9](?:[a-z0-9_-]*\.?)*$/i;
const SHARED_KEY_PATTERN = /^wiki\.[a-z0-9][a-z0-9_.-]*$/i;
const cache = new Map();

function isSafeSkinName(value) {
  return typeof value === 'string' && /^[a-z0-9][a-z0-9._-]*$/i.test(value);
}

function normalizeNamespaces(value) {
  if (!Array.isArray(value)) return null;
  const namespaces = [...new Set(value.map((item) => String(item).trim()))].sort();
  if (namespaces.some((namespace) => !NAMESPACE_PATTERN.test(namespace))) return null;
  return namespaces;
}

function normalizeSharedKeys(value) {
  if (!Array.isArray(value)) return null;
  const keys = [...new Set(value.map((item) => String(item).trim()))].sort();
  if (keys.some((key) => !SHARED_KEY_PATTERN.test(key))) return null;
  return keys;
}

function readRuntimeContract(skinsRoot, skinName) {
  if (!isSafeSkinName(skinName)) return null;
  const filename = path.join(skinsRoot, skinName, RUNTIME_CONTRACT_PATH);
  let stat;
  try {
    stat = fs.statSync(filename);
  } catch {
    cache.delete(filename);
    return null;
  }
  if (!stat.isFile()) return null;
  const cached = cache.get(filename);
  if (cached?.mtimeMs === stat.mtimeMs && cached?.size === stat.size) return cached.contract;
  try {
    const parsed = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const configNamespaces = parsed?.schema === RUNTIME_SCHEMA
      ? normalizeNamespaces(parsed.configNamespaces)
      : null;
    const sharedConfigKeys = parsed?.schema === RUNTIME_SCHEMA
      ? normalizeSharedKeys(parsed.sharedConfigKeys)
      : null;
    const contract = configNamespaces && sharedConfigKeys
      ? { schema: parsed.schema, configNamespaces, sharedConfigKeys }
      : null;
    cache.set(filename, { mtimeMs: stat.mtimeMs, size: stat.size, contract });
    return contract;
  } catch {
    cache.set(filename, { mtimeMs: stat.mtimeMs, size: stat.size, contract: null });
    return null;
  }
}

function selectDeclaredConfig(config, namespaces, sharedKeys) {
  const selected = {};
  for (const [key, value] of Object.entries(config || {})) {
    if (
      namespaces.some((namespace) => key.startsWith(`${namespace}.`))
      || sharedKeys.includes(key)
    ) selected[key] = value;
  }
  return selected;
}

function makeComposedConfigPayload({ skinName, config, skinsRoot }) {
  const contract = readRuntimeContract(skinsRoot, skinName);
  if (!contract) return null;
  return {
    schema: PUBLIC_SCHEMA,
    configNamespaces: contract.configNamespaces,
    sharedConfigKeys: contract.sharedConfigKeys,
    values: selectDeclaredConfig(config, contract.configNamespaces, contract.sharedConfigKeys)
  };
}

module.exports = {
  PUBLIC_SCHEMA,
  RUNTIME_CONTRACT_PATH,
  RUNTIME_SCHEMA,
  makeComposedConfigPayload,
  normalizeNamespaces,
  normalizeSharedKeys,
  selectDeclaredConfig
};

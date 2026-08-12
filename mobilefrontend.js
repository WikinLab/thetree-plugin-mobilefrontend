// thetree-plugin-mobilefrontend
'use strict';

const contract = require('./contracts/mobilefrontend-data-contract.json');
const path = require('node:path');
const { makeComposedConfigPayload } = require('./lib/composed-config-bridge.js');

module.exports = {
  name: contract.pluginName,
  type: 'skinData',
  format({ req, page } = {}) {
    if (!req || !page) return {};
    page.data ||= {};
    page.data[contract.publicDataKey] = {
      schema: contract.dataSchema,
      mode: req.isMobile ? contract.mobileMode : contract.desktopMode
    };
    const skinsRoot = process.env.THETREE_FRONTEND_SKINS_ROOT || path.resolve('frontend', 'skins');
    const composedConfig = makeComposedConfigPayload({
      skinName: req.skin,
      config: global.config,
      skinsRoot
    });
    if (composedConfig) page.data[contract.composedConfigDataKey] = composedConfig;
    return {};
  }
};

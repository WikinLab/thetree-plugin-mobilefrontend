// thetree-plugin-mobilefrontend
'use strict';

const contract = require('./contracts/mobilefrontend-data-contract.json');

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
    return {};
  }
};

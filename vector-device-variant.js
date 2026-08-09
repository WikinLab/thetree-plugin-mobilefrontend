// thetree-plugin-vector
'use strict';

const contract = require('./contracts/device-variant-data-contract.json');

module.exports = {
  name: 'thetree-plugin-vector',
  type: 'skinData',
  format({ req, page } = {}) {
    if (!req || req.skin !== contract.skinName || !page) return {};
    page.data ||= {};
    page.data[contract.publicDataKey] = {
      schema: contract.dataSchema,
      variant: req.isMobile ? contract.mobileVariant : contract.desktopVariant
    };
    return {};
  }
};

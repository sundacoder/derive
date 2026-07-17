"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');

var pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 = require('daml.js/ghc-stdlib-DA-Internal-Template-1.0.0');


exports.CancelRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Fulfill = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({notionalBucket: damlTypes.Text.decoder, assetClass: damlTypes.Text.decoder, maturityBucket: damlTypes.Text.decoder, counterpartyLeis: damlTypes.List(damlTypes.Text).decoder, tradeCount: damlTypes.Int.decoder, totalGrossNotional: damlTypes.Numeric(10).decoder, schemaVersion: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    notionalBucket: damlTypes.Text.encode(__typed__.notionalBucket),
    assetClass: damlTypes.Text.encode(__typed__.assetClass),
    maturityBucket: damlTypes.Text.encode(__typed__.maturityBucket),
    counterpartyLeis: damlTypes.List(damlTypes.Text).encode(__typed__.counterpartyLeis),
    tradeCount: damlTypes.Int.encode(__typed__.tradeCount),
    totalGrossNotional: damlTypes.Numeric(10).encode(__typed__.totalGrossNotional),
    schemaVersion: damlTypes.Text.encode(__typed__.schemaVersion),
  };
}
,
};



exports.RegulatoryDisclosureRequest = damlTypes.assembleTemplate(
{
  templateId: '#derive-templates:Templates.Disclosure:RegulatoryDisclosureRequest',
  templateIdWithPackageId: '4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457:Templates.Disclosure:RegulatoryDisclosureRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({requestId: damlTypes.Text.decoder, regulator: damlTypes.Party.decoder, platformOperator: damlTypes.Party.decoder, reportPeriodStart: damlTypes.Date.decoder, reportPeriodEnd: damlTypes.Date.decoder, requestedAt: damlTypes.Date.decoder, fulfilled: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    requestId: damlTypes.Text.encode(__typed__.requestId),
    regulator: damlTypes.Party.encode(__typed__.regulator),
    platformOperator: damlTypes.Party.encode(__typed__.platformOperator),
    reportPeriodStart: damlTypes.Date.encode(__typed__.reportPeriodStart),
    reportPeriodEnd: damlTypes.Date.encode(__typed__.reportPeriodEnd),
    requestedAt: damlTypes.Date.encode(__typed__.requestedAt),
    fulfilled: damlTypes.Bool.encode(__typed__.fulfilled),
  };
}
,
  Fulfill: {
    template: function () { return exports.RegulatoryDisclosureRequest; },
    choiceName: 'Fulfill',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Fulfill.decoder; }),
    argumentEncode: function (__typed__) { return exports.Fulfill.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RegulatoryDisclosure).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RegulatoryDisclosure).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.RegulatoryDisclosureRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  CancelRequest: {
    template: function () { return exports.RegulatoryDisclosureRequest; },
    choiceName: 'CancelRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CancelRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.CancelRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.RegulatoryDisclosureRequest, ['4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457', '#derive-templates']);



exports.GetDisclosure = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RegulatoryDisclosure = damlTypes.assembleTemplate(
{
  templateId: '#derive-templates:Templates.Disclosure:RegulatoryDisclosure',
  templateIdWithPackageId: '4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457:Templates.Disclosure:RegulatoryDisclosure',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({regulator: damlTypes.Party.decoder, reportId: damlTypes.Text.decoder, reportPeriodStart: damlTypes.Date.decoder, reportPeriodEnd: damlTypes.Date.decoder, notionalBucket: damlTypes.Text.decoder, assetClass: damlTypes.Text.decoder, maturityBucket: damlTypes.Text.decoder, counterpartyLeis: damlTypes.List(damlTypes.Text).decoder, tradeCount: damlTypes.Int.decoder, totalGrossNotional: damlTypes.Numeric(10).decoder, generatedAt: damlTypes.Date.decoder, schemaVersion: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    regulator: damlTypes.Party.encode(__typed__.regulator),
    reportId: damlTypes.Text.encode(__typed__.reportId),
    reportPeriodStart: damlTypes.Date.encode(__typed__.reportPeriodStart),
    reportPeriodEnd: damlTypes.Date.encode(__typed__.reportPeriodEnd),
    notionalBucket: damlTypes.Text.encode(__typed__.notionalBucket),
    assetClass: damlTypes.Text.encode(__typed__.assetClass),
    maturityBucket: damlTypes.Text.encode(__typed__.maturityBucket),
    counterpartyLeis: damlTypes.List(damlTypes.Text).encode(__typed__.counterpartyLeis),
    tradeCount: damlTypes.Int.encode(__typed__.tradeCount),
    totalGrossNotional: damlTypes.Numeric(10).encode(__typed__.totalGrossNotional),
    generatedAt: damlTypes.Date.encode(__typed__.generatedAt),
    schemaVersion: damlTypes.Text.encode(__typed__.schemaVersion),
  };
}
,
  GetDisclosure: {
    template: function () { return exports.RegulatoryDisclosure; },
    choiceName: 'GetDisclosure',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.GetDisclosure.decoder; }),
    argumentEncode: function (__typed__) { return exports.GetDisclosure.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.RegulatoryDisclosure.decoder; }),
    resultEncode: function (__typed__) { return exports.RegulatoryDisclosure.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.RegulatoryDisclosure; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.RegulatoryDisclosure, ['4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457', '#derive-templates']);


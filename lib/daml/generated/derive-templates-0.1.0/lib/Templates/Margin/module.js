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


exports.GetDemand = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Cancel = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Dispute = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Post = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.MarginCallDemand = damlTypes.assembleTemplate(
{
  templateId: '#derive-templates:Templates.Margin:MarginCallDemand',
  templateIdWithPackageId: '4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457:Templates.Margin:MarginCallDemand',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({callingDealer: damlTypes.Party.decoder, calledDealer: damlTypes.Party.decoder, tradeCid: damlTypes.Text.decoder, amountRequired: damlTypes.Numeric(10).decoder, valuationSnapshotCid: damlTypes.Text.decoder, currency: damlTypes.Text.decoder, dueDate: damlTypes.Date.decoder, posted: damlTypes.Bool.decoder, disputed: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    callingDealer: damlTypes.Party.encode(__typed__.callingDealer),
    calledDealer: damlTypes.Party.encode(__typed__.calledDealer),
    tradeCid: damlTypes.Text.encode(__typed__.tradeCid),
    amountRequired: damlTypes.Numeric(10).encode(__typed__.amountRequired),
    valuationSnapshotCid: damlTypes.Text.encode(__typed__.valuationSnapshotCid),
    currency: damlTypes.Text.encode(__typed__.currency),
    dueDate: damlTypes.Date.encode(__typed__.dueDate),
    posted: damlTypes.Bool.encode(__typed__.posted),
    disputed: damlTypes.Bool.encode(__typed__.disputed),
  };
}
,
  Post: {
    template: function () { return exports.MarginCallDemand; },
    choiceName: 'Post',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Post.decoder; }),
    argumentEncode: function (__typed__) { return exports.Post.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.MarginCallDemand).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.MarginCallDemand).encode(__typed__); },
  },
  Dispute: {
    template: function () { return exports.MarginCallDemand; },
    choiceName: 'Dispute',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Dispute.decoder; }),
    argumentEncode: function (__typed__) { return exports.Dispute.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.MarginCallDemand).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.MarginCallDemand).encode(__typed__); },
  },
  Cancel: {
    template: function () { return exports.MarginCallDemand; },
    choiceName: 'Cancel',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Cancel.decoder; }),
    argumentEncode: function (__typed__) { return exports.Cancel.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  GetDemand: {
    template: function () { return exports.MarginCallDemand; },
    choiceName: 'GetDemand',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.GetDemand.decoder; }),
    argumentEncode: function (__typed__) { return exports.GetDemand.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.MarginCallDemand.decoder; }),
    resultEncode: function (__typed__) { return exports.MarginCallDemand.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.MarginCallDemand; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.MarginCallDemand, ['4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457', '#derive-templates']);



exports.ValuationSnapshot = damlTypes.assembleTemplate(
{
  templateId: '#derive-templates:Templates.Margin:ValuationSnapshot',
  templateIdWithPackageId: '4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457:Templates.Margin:ValuationSnapshot',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({valuationAgent: damlTypes.Party.decoder, tradeDealerA: damlTypes.Party.decoder, tradeDealerB: damlTypes.Party.decoder, instrumentLabel: damlTypes.Text.decoder, mtmValue: damlTypes.Numeric(10).decoder, valuationDate: damlTypes.Date.decoder, referencePrice: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    valuationAgent: damlTypes.Party.encode(__typed__.valuationAgent),
    tradeDealerA: damlTypes.Party.encode(__typed__.tradeDealerA),
    tradeDealerB: damlTypes.Party.encode(__typed__.tradeDealerB),
    instrumentLabel: damlTypes.Text.encode(__typed__.instrumentLabel),
    mtmValue: damlTypes.Numeric(10).encode(__typed__.mtmValue),
    valuationDate: damlTypes.Date.encode(__typed__.valuationDate),
    referencePrice: damlTypes.Numeric(10).encode(__typed__.referencePrice),
  };
}
,
  Archive: {
    template: function () { return exports.ValuationSnapshot; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.ValuationSnapshot, ['4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457', '#derive-templates']);


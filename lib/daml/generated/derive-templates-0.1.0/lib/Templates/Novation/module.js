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

var pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4 = require('@daml.js/daml-prim-DA-Types-1.0.0');
var pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 = require('@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0');


exports.GetExecution = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.ConfirmNovation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.NovationExecution = damlTypes.assembleTemplate(
{
  templateId: '#derive-templates:Templates.Novation:NovationExecution',
  templateIdWithPackageId: '4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457:Templates.Novation:NovationExecution',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({executionId: damlTypes.Text.decoder, requestId: damlTypes.Text.decoder, outgoingDealer: damlTypes.Party.decoder, remainingDealer: damlTypes.Party.decoder, incomingDealer: damlTypes.Party.decoder, originalTradeCid: damlTypes.Text.decoder, newTradeCidRemainingIncoming: damlTypes.Text.decoder, newTradeCidOutgoingIncoming: damlTypes.Text.decoder, executed: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    executionId: damlTypes.Text.encode(__typed__.executionId),
    requestId: damlTypes.Text.encode(__typed__.requestId),
    outgoingDealer: damlTypes.Party.encode(__typed__.outgoingDealer),
    remainingDealer: damlTypes.Party.encode(__typed__.remainingDealer),
    incomingDealer: damlTypes.Party.encode(__typed__.incomingDealer),
    originalTradeCid: damlTypes.Text.encode(__typed__.originalTradeCid),
    newTradeCidRemainingIncoming: damlTypes.Text.encode(__typed__.newTradeCidRemainingIncoming),
    newTradeCidOutgoingIncoming: damlTypes.Text.encode(__typed__.newTradeCidOutgoingIncoming),
    executed: damlTypes.Bool.encode(__typed__.executed),
  };
}
,
  ConfirmNovation: {
    template: function () { return exports.NovationExecution; },
    choiceName: 'ConfirmNovation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ConfirmNovation.decoder; }),
    argumentEncode: function (__typed__) { return exports.ConfirmNovation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.NovationExecution).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.NovationExecution).encode(__typed__); },
  },
  GetExecution: {
    template: function () { return exports.NovationExecution; },
    choiceName: 'GetExecution',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.GetExecution.decoder; }),
    argumentEncode: function (__typed__) { return exports.GetExecution.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.NovationExecution.decoder; }),
    resultEncode: function (__typed__) { return exports.NovationExecution.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.NovationExecution; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.NovationExecution, ['4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457', '#derive-templates']);



exports.CompleteNovation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Reject = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.CountersignAsIncoming = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.CountersignAsRemaining = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.GetRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.NovationRequest = damlTypes.assembleTemplate(
{
  templateId: '#derive-templates:Templates.Novation:NovationRequest',
  templateIdWithPackageId: '4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457:Templates.Novation:NovationRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({requestId: damlTypes.Text.decoder, outgoingDealer: damlTypes.Party.decoder, remainingDealer: damlTypes.Party.decoder, incomingDealer: damlTypes.Party.decoder, originalTradeCid: damlTypes.Text.decoder, instrumentKey: damlTypes.Text.decoder, notional: damlTypes.Numeric(10).decoder, remainingDealerConsented: damlTypes.Bool.decoder, incomingDealerConsented: damlTypes.Bool.decoder, createdAt: damlTypes.Date.decoder, }); }),
  encode: function (__typed__) {
  return {
    requestId: damlTypes.Text.encode(__typed__.requestId),
    outgoingDealer: damlTypes.Party.encode(__typed__.outgoingDealer),
    remainingDealer: damlTypes.Party.encode(__typed__.remainingDealer),
    incomingDealer: damlTypes.Party.encode(__typed__.incomingDealer),
    originalTradeCid: damlTypes.Text.encode(__typed__.originalTradeCid),
    instrumentKey: damlTypes.Text.encode(__typed__.instrumentKey),
    notional: damlTypes.Numeric(10).encode(__typed__.notional),
    remainingDealerConsented: damlTypes.Bool.encode(__typed__.remainingDealerConsented),
    incomingDealerConsented: damlTypes.Bool.encode(__typed__.incomingDealerConsented),
    createdAt: damlTypes.Date.encode(__typed__.createdAt),
  };
}
,
  GetRequest: {
    template: function () { return exports.NovationRequest; },
    choiceName: 'GetRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.GetRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.GetRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.NovationRequest.decoder; }),
    resultEncode: function (__typed__) { return exports.NovationRequest.encode(__typed__); },
  },
  CountersignAsRemaining: {
    template: function () { return exports.NovationRequest; },
    choiceName: 'CountersignAsRemaining',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CountersignAsRemaining.decoder; }),
    argumentEncode: function (__typed__) { return exports.CountersignAsRemaining.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.NovationRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.NovationRequest).encode(__typed__); },
  },
  CountersignAsIncoming: {
    template: function () { return exports.NovationRequest; },
    choiceName: 'CountersignAsIncoming',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CountersignAsIncoming.decoder; }),
    argumentEncode: function (__typed__) { return exports.CountersignAsIncoming.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.NovationRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.NovationRequest).encode(__typed__); },
  },
  Reject: {
    template: function () { return exports.NovationRequest; },
    choiceName: 'Reject',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Reject.decoder; }),
    argumentEncode: function (__typed__) { return exports.Reject.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  CompleteNovation: {
    template: function () { return exports.NovationRequest; },
    choiceName: 'CompleteNovation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CompleteNovation.decoder; }),
    argumentEncode: function (__typed__) { return exports.CompleteNovation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, damlTypes.Text).decoder; }),
    resultEncode: function (__typed__) { return pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, damlTypes.Text).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.NovationRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.NovationRequest, ['4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457', '#derive-templates']);


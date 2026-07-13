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


exports.SetValuationAgent = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newValuationAgent: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    newValuationAgent: damlTypes.Party.encode(__typed__.newValuationAgent),
  };
}
,
};



exports.AcceptNovation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({incomingDealer: damlTypes.Party.decoder, outgoingDealer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    incomingDealer: damlTypes.Party.encode(__typed__.incomingDealer),
    outgoingDealer: damlTypes.Party.encode(__typed__.outgoingDealer),
  };
}
,
};



exports.GetTrade = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.DerivativeTrade = damlTypes.assembleTemplate(
{
  templateId: '#derive-templates:Templates.Trade:DerivativeTrade',
  templateIdWithPackageId: '4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457:Templates.Trade:DerivativeTrade',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({dealerA: damlTypes.Party.decoder, dealerB: damlTypes.Party.decoder, instrumentLabel: damlTypes.Text.decoder, notional: damlTypes.Numeric(10).decoder, fixedRate: damlTypes.Numeric(10).decoder, maturityDate: damlTypes.Date.decoder, effectiveDate: damlTypes.Date.decoder, valuationAgent: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Party).decoder), marginCallThreshold: damlTypes.Numeric(10).decoder, minimumTransferAmount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    dealerA: damlTypes.Party.encode(__typed__.dealerA),
    dealerB: damlTypes.Party.encode(__typed__.dealerB),
    instrumentLabel: damlTypes.Text.encode(__typed__.instrumentLabel),
    notional: damlTypes.Numeric(10).encode(__typed__.notional),
    fixedRate: damlTypes.Numeric(10).encode(__typed__.fixedRate),
    maturityDate: damlTypes.Date.encode(__typed__.maturityDate),
    effectiveDate: damlTypes.Date.encode(__typed__.effectiveDate),
    valuationAgent: damlTypes.Optional(damlTypes.Party).encode(__typed__.valuationAgent),
    marginCallThreshold: damlTypes.Numeric(10).encode(__typed__.marginCallThreshold),
    minimumTransferAmount: damlTypes.Numeric(10).encode(__typed__.minimumTransferAmount),
  };
}
,
  GetTrade: {
    template: function () { return exports.DerivativeTrade; },
    choiceName: 'GetTrade',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.GetTrade.decoder; }),
    argumentEncode: function (__typed__) { return exports.GetTrade.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.DerivativeTrade.decoder; }),
    resultEncode: function (__typed__) { return exports.DerivativeTrade.encode(__typed__); },
  },
  AcceptNovation: {
    template: function () { return exports.DerivativeTrade; },
    choiceName: 'AcceptNovation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcceptNovation.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcceptNovation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple3(damlTypes.ContractId(exports.DerivativeTrade), damlTypes.ContractId(exports.DerivativeTrade), damlTypes.ContractId(exports.DerivativeTrade)).decoder; }),
    resultEncode: function (__typed__) { return pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple3(damlTypes.ContractId(exports.DerivativeTrade), damlTypes.ContractId(exports.DerivativeTrade), damlTypes.ContractId(exports.DerivativeTrade)).encode(__typed__); },
  },
  SetValuationAgent: {
    template: function () { return exports.DerivativeTrade; },
    choiceName: 'SetValuationAgent',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SetValuationAgent.decoder; }),
    argumentEncode: function (__typed__) { return exports.SetValuationAgent.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.DerivativeTrade).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.DerivativeTrade).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.DerivativeTrade; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.DerivativeTrade, ['4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457', '#derive-templates']);



exports.Cancel = {
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



exports.Accept = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.TradeProposal = damlTypes.assembleTemplate(
{
  templateId: '#derive-templates:Templates.Trade:TradeProposal',
  templateIdWithPackageId: '4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457:Templates.Trade:TradeProposal',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({proposer: damlTypes.Party.decoder, acceptor: damlTypes.Party.decoder, instrumentLabel: damlTypes.Text.decoder, notional: damlTypes.Numeric(10).decoder, fixedRate: damlTypes.Numeric(10).decoder, maturityDate: damlTypes.Date.decoder, effectiveDate: damlTypes.Date.decoder, }); }),
  encode: function (__typed__) {
  return {
    proposer: damlTypes.Party.encode(__typed__.proposer),
    acceptor: damlTypes.Party.encode(__typed__.acceptor),
    instrumentLabel: damlTypes.Text.encode(__typed__.instrumentLabel),
    notional: damlTypes.Numeric(10).encode(__typed__.notional),
    fixedRate: damlTypes.Numeric(10).encode(__typed__.fixedRate),
    maturityDate: damlTypes.Date.encode(__typed__.maturityDate),
    effectiveDate: damlTypes.Date.encode(__typed__.effectiveDate),
  };
}
,
  Accept: {
    template: function () { return exports.TradeProposal; },
    choiceName: 'Accept',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Accept.decoder; }),
    argumentEncode: function (__typed__) { return exports.Accept.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.DerivativeTrade).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.DerivativeTrade).encode(__typed__); },
  },
  Reject: {
    template: function () { return exports.TradeProposal; },
    choiceName: 'Reject',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Reject.decoder; }),
    argumentEncode: function (__typed__) { return exports.Reject.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Cancel: {
    template: function () { return exports.TradeProposal; },
    choiceName: 'Cancel',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Cancel.decoder; }),
    argumentEncode: function (__typed__) { return exports.Cancel.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.TradeProposal; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TradeProposal, ['4ac3675a4bd13862324ddf2f7b8ceb39768f645b5851443ce9497f03a000e457', '#derive-templates']);


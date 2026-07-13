// Generated from Templates/Trade.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';

import * as pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4 from '@daml.js/daml-prim-DA-Types-1.0.0';
import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from '@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

export declare type SetValuationAgent = {
  newValuationAgent: damlTypes.Party;
};

export declare const SetValuationAgent:
  damlTypes.Serializable<SetValuationAgent> & {
  }
;


export declare type AcceptNovation = {
  incomingDealer: damlTypes.Party;
  outgoingDealer: damlTypes.Party;
};

export declare const AcceptNovation:
  damlTypes.Serializable<AcceptNovation> & {
  }
;


export declare type GetTrade = {
};

export declare const GetTrade:
  damlTypes.Serializable<GetTrade> & {
  }
;


export declare type DerivativeTrade = {
  dealerA: damlTypes.Party;
  dealerB: damlTypes.Party;
  instrumentLabel: string;
  notional: damlTypes.Numeric;
  fixedRate: damlTypes.Numeric;
  maturityDate: damlTypes.Date;
  effectiveDate: damlTypes.Date;
  valuationAgent: damlTypes.Optional<damlTypes.Party>;
  marginCallThreshold: damlTypes.Numeric;
  minimumTransferAmount: damlTypes.Numeric;
};

export declare interface DerivativeTradeInterface {
  GetTrade: damlTypes.Choice<DerivativeTrade, GetTrade, DerivativeTrade, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<DerivativeTrade, undefined>>;
  AcceptNovation: damlTypes.Choice<DerivativeTrade, AcceptNovation, pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple3<damlTypes.ContractId<DerivativeTrade>, damlTypes.ContractId<DerivativeTrade>, damlTypes.ContractId<DerivativeTrade>>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<DerivativeTrade, undefined>>;
  SetValuationAgent: damlTypes.Choice<DerivativeTrade, SetValuationAgent, damlTypes.ContractId<DerivativeTrade>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<DerivativeTrade, undefined>>;
  Archive: damlTypes.Choice<DerivativeTrade, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<DerivativeTrade, undefined>>;
}
export declare const DerivativeTrade:
  damlTypes.Template<DerivativeTrade, undefined, '#derive-templates:Templates.Trade:DerivativeTrade'> &
  damlTypes.ToInterface<DerivativeTrade, never> &
  DerivativeTradeInterface;

export declare namespace DerivativeTrade {
}



export declare type Cancel = {
};

export declare const Cancel:
  damlTypes.Serializable<Cancel> & {
  }
;


export declare type Reject = {
};

export declare const Reject:
  damlTypes.Serializable<Reject> & {
  }
;


export declare type Accept = {
};

export declare const Accept:
  damlTypes.Serializable<Accept> & {
  }
;


export declare type TradeProposal = {
  proposer: damlTypes.Party;
  acceptor: damlTypes.Party;
  instrumentLabel: string;
  notional: damlTypes.Numeric;
  fixedRate: damlTypes.Numeric;
  maturityDate: damlTypes.Date;
  effectiveDate: damlTypes.Date;
};

export declare interface TradeProposalInterface {
  Accept: damlTypes.Choice<TradeProposal, Accept, damlTypes.ContractId<DerivativeTrade>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TradeProposal, undefined>>;
  Reject: damlTypes.Choice<TradeProposal, Reject, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TradeProposal, undefined>>;
  Cancel: damlTypes.Choice<TradeProposal, Cancel, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TradeProposal, undefined>>;
  Archive: damlTypes.Choice<TradeProposal, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TradeProposal, undefined>>;
}
export declare const TradeProposal:
  damlTypes.Template<TradeProposal, undefined, '#derive-templates:Templates.Trade:TradeProposal'> &
  damlTypes.ToInterface<TradeProposal, never> &
  TradeProposalInterface;

export declare namespace TradeProposal {
}



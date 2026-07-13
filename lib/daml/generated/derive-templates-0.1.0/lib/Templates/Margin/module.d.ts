// Generated from Templates/Margin.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';

import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from '@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

export declare type GetDemand = {
};

export declare const GetDemand:
  damlTypes.Serializable<GetDemand> & {
  }
;


export declare type Cancel = {
};

export declare const Cancel:
  damlTypes.Serializable<Cancel> & {
  }
;


export declare type Dispute = {
};

export declare const Dispute:
  damlTypes.Serializable<Dispute> & {
  }
;


export declare type Post = {
};

export declare const Post:
  damlTypes.Serializable<Post> & {
  }
;


export declare type MarginCallDemand = {
  callingDealer: damlTypes.Party;
  calledDealer: damlTypes.Party;
  tradeCid: string;
  amountRequired: damlTypes.Numeric;
  valuationSnapshotCid: string;
  currency: string;
  dueDate: damlTypes.Date;
  posted: boolean;
  disputed: boolean;
};

export declare interface MarginCallDemandInterface {
  Post: damlTypes.Choice<MarginCallDemand, Post, damlTypes.ContractId<MarginCallDemand>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarginCallDemand, undefined>>;
  Dispute: damlTypes.Choice<MarginCallDemand, Dispute, damlTypes.ContractId<MarginCallDemand>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarginCallDemand, undefined>>;
  Cancel: damlTypes.Choice<MarginCallDemand, Cancel, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarginCallDemand, undefined>>;
  GetDemand: damlTypes.Choice<MarginCallDemand, GetDemand, MarginCallDemand, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarginCallDemand, undefined>>;
  Archive: damlTypes.Choice<MarginCallDemand, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarginCallDemand, undefined>>;
}
export declare const MarginCallDemand:
  damlTypes.Template<MarginCallDemand, undefined, '#derive-templates:Templates.Margin:MarginCallDemand'> &
  damlTypes.ToInterface<MarginCallDemand, never> &
  MarginCallDemandInterface;

export declare namespace MarginCallDemand {
}



export declare type ValuationSnapshot = {
  valuationAgent: damlTypes.Party;
  tradeDealerA: damlTypes.Party;
  tradeDealerB: damlTypes.Party;
  instrumentLabel: string;
  mtmValue: damlTypes.Numeric;
  valuationDate: damlTypes.Date;
  referencePrice: damlTypes.Numeric;
};

export declare interface ValuationSnapshotInterface {
  Archive: damlTypes.Choice<ValuationSnapshot, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ValuationSnapshot, undefined>>;
}
export declare const ValuationSnapshot:
  damlTypes.Template<ValuationSnapshot, undefined, '#derive-templates:Templates.Margin:ValuationSnapshot'> &
  damlTypes.ToInterface<ValuationSnapshot, never> &
  ValuationSnapshotInterface;

export declare namespace ValuationSnapshot {
}



// Generated from Templates/Novation.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';

import * as pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4 from 'daml.js/daml-prim-DA-Types-1.0.0';
import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from 'daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

export declare type GetExecution = {
};

export declare const GetExecution:
  damlTypes.Serializable<GetExecution> & {
  }
;


export declare type ConfirmNovation = {
};

export declare const ConfirmNovation:
  damlTypes.Serializable<ConfirmNovation> & {
  }
;


export declare type NovationExecution = {
  executionId: string;
  requestId: string;
  outgoingDealer: damlTypes.Party;
  remainingDealer: damlTypes.Party;
  incomingDealer: damlTypes.Party;
  originalTradeCid: string;
  newTradeCidRemainingIncoming: string;
  newTradeCidOutgoingIncoming: string;
  executed: boolean;
};

export declare interface NovationExecutionInterface {
  ConfirmNovation: damlTypes.Choice<NovationExecution, ConfirmNovation, damlTypes.ContractId<NovationExecution>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<NovationExecution, undefined>>;
  GetExecution: damlTypes.Choice<NovationExecution, GetExecution, NovationExecution, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<NovationExecution, undefined>>;
  Archive: damlTypes.Choice<NovationExecution, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<NovationExecution, undefined>>;
}
export declare const NovationExecution:
  damlTypes.Template<NovationExecution, undefined, '#derive-templates:Templates.Novation:NovationExecution'> &
  damlTypes.ToInterface<NovationExecution, never> &
  NovationExecutionInterface;

export declare namespace NovationExecution {
}



export declare type CompleteNovation = {
};

export declare const CompleteNovation:
  damlTypes.Serializable<CompleteNovation> & {
  }
;


export declare type Reject = {
};

export declare const Reject:
  damlTypes.Serializable<Reject> & {
  }
;


export declare type CountersignAsIncoming = {
};

export declare const CountersignAsIncoming:
  damlTypes.Serializable<CountersignAsIncoming> & {
  }
;


export declare type CountersignAsRemaining = {
};

export declare const CountersignAsRemaining:
  damlTypes.Serializable<CountersignAsRemaining> & {
  }
;


export declare type GetRequest = {
};

export declare const GetRequest:
  damlTypes.Serializable<GetRequest> & {
  }
;


export declare type NovationRequest = {
  requestId: string;
  outgoingDealer: damlTypes.Party;
  remainingDealer: damlTypes.Party;
  incomingDealer: damlTypes.Party;
  originalTradeCid: string;
  instrumentKey: string;
  notional: damlTypes.Numeric;
  remainingDealerConsented: boolean;
  incomingDealerConsented: boolean;
  createdAt: damlTypes.Date;
};

export declare interface NovationRequestInterface {
  GetRequest: damlTypes.Choice<NovationRequest, GetRequest, NovationRequest, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<NovationRequest, undefined>>;
  CountersignAsRemaining: damlTypes.Choice<NovationRequest, CountersignAsRemaining, damlTypes.ContractId<NovationRequest>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<NovationRequest, undefined>>;
  CountersignAsIncoming: damlTypes.Choice<NovationRequest, CountersignAsIncoming, damlTypes.ContractId<NovationRequest>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<NovationRequest, undefined>>;
  Reject: damlTypes.Choice<NovationRequest, Reject, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<NovationRequest, undefined>>;
  CompleteNovation: damlTypes.Choice<NovationRequest, CompleteNovation, pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2<string, string>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<NovationRequest, undefined>>;
  Archive: damlTypes.Choice<NovationRequest, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<NovationRequest, undefined>>;
}
export declare const NovationRequest:
  damlTypes.Template<NovationRequest, undefined, '#derive-templates:Templates.Novation:NovationRequest'> &
  damlTypes.ToInterface<NovationRequest, never> &
  NovationRequestInterface;

export declare namespace NovationRequest {
}



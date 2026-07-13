// Generated from Templates/Disclosure.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';

import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from '@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

export declare type CancelRequest = {
};

export declare const CancelRequest:
  damlTypes.Serializable<CancelRequest> & {
  }
;


export declare type Fulfill = {
  notionalBucket: string;
  assetClass: string;
  maturityBucket: string;
  counterpartyLeis: string[];
  tradeCount: damlTypes.Int;
  totalGrossNotional: damlTypes.Numeric;
  schemaVersion: string;
};

export declare const Fulfill:
  damlTypes.Serializable<Fulfill> & {
  }
;


export declare type RegulatoryDisclosureRequest = {
  requestId: string;
  regulator: damlTypes.Party;
  platformOperator: damlTypes.Party;
  reportPeriodStart: damlTypes.Date;
  reportPeriodEnd: damlTypes.Date;
  requestedAt: damlTypes.Date;
  fulfilled: boolean;
};

export declare interface RegulatoryDisclosureRequestInterface {
  Fulfill: damlTypes.Choice<RegulatoryDisclosureRequest, Fulfill, damlTypes.ContractId<RegulatoryDisclosure>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RegulatoryDisclosureRequest, undefined>>;
  Archive: damlTypes.Choice<RegulatoryDisclosureRequest, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RegulatoryDisclosureRequest, undefined>>;
  CancelRequest: damlTypes.Choice<RegulatoryDisclosureRequest, CancelRequest, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RegulatoryDisclosureRequest, undefined>>;
}
export declare const RegulatoryDisclosureRequest:
  damlTypes.Template<RegulatoryDisclosureRequest, undefined, '#derive-templates:Templates.Disclosure:RegulatoryDisclosureRequest'> &
  damlTypes.ToInterface<RegulatoryDisclosureRequest, never> &
  RegulatoryDisclosureRequestInterface;

export declare namespace RegulatoryDisclosureRequest {
}



export declare type GetDisclosure = {
};

export declare const GetDisclosure:
  damlTypes.Serializable<GetDisclosure> & {
  }
;


export declare type RegulatoryDisclosure = {
  regulator: damlTypes.Party;
  reportId: string;
  reportPeriodStart: damlTypes.Date;
  reportPeriodEnd: damlTypes.Date;
  notionalBucket: string;
  assetClass: string;
  maturityBucket: string;
  counterpartyLeis: string[];
  tradeCount: damlTypes.Int;
  totalGrossNotional: damlTypes.Numeric;
  generatedAt: damlTypes.Date;
  schemaVersion: string;
};

export declare interface RegulatoryDisclosureInterface {
  GetDisclosure: damlTypes.Choice<RegulatoryDisclosure, GetDisclosure, RegulatoryDisclosure, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RegulatoryDisclosure, undefined>>;
  Archive: damlTypes.Choice<RegulatoryDisclosure, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RegulatoryDisclosure, undefined>>;
}
export declare const RegulatoryDisclosure:
  damlTypes.Template<RegulatoryDisclosure, undefined, '#derive-templates:Templates.Disclosure:RegulatoryDisclosure'> &
  damlTypes.ToInterface<RegulatoryDisclosure, never> &
  RegulatoryDisclosureInterface;

export declare namespace RegulatoryDisclosure {
}



import {GaleParamsComplete, IrvingsParams} from './helpers';

export interface PreferenceBody {
  method: 'irvings' | 'gale';
  inputParams: GaleParamsComplete | IrvingsParams;
}

export type PreferenceMethod = 'gale' | 'irvings';

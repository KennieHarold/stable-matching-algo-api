import {GaleParamsComplete, IrvingsParams} from './helpers';

export interface PreferenceBody {
  method: 'irvings' | 'gale';
  inputParams: GaleParamsComplete | IrvingsParams;
}

export interface UserBody {
  name: string;
  preferenceId: string;
  preferences: string[];
}

export type PreferenceMethod = 'gale' | 'irvings';

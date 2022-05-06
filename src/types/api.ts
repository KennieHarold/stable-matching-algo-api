import {GaleParamsComplete, IrvingsParams} from './helpers';

export interface PreferenceBody {
  method: 'irvings' | 'gale';
  inputParams: GaleParamsComplete | IrvingsParams;
}

export interface UserBody {
  id: string;
  name: string;
  preferenceId: string;
  preferences: GaleParamsComplete | IrvingsParams;
}

export type PreferenceMethod = 'gale' | 'irvings';

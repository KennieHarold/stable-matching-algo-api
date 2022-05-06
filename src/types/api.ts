export interface PreferenceBody {
  method: 'irvings' | 'gale';
}

export interface UserBody {
  name: string;
  gender: 'male' | 'female';
  preferenceId: string;
  preferences: {
    gale: string[];
    irvings: string[];
  };
}

export type PreferenceMethod = 'gale' | 'irvings';

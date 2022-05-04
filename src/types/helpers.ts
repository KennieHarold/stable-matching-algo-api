// Irvings

export type SN = string | number;

export type IrvingsParams = string[][];

// Gale-Shapely

export type GalePreference = string[];

export type GaleTuplePreference = [string, GalePreference];

export type GaleParams = GaleTuplePreference[];

export type GaleParamsComplete = {
  males: GaleParams;
  females: GaleParams;
};

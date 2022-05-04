// Source: https://github.com/alextanhongpin/stable-marriage-problem/blob/master/javascript/stable-matching.js

import {GaleParams, GalePreference, GaleTuplePreference} from 'types/helpers';

const toObject = (arr: GaleParams) => {
  return arr.reduce((obj, [head, tail]) => {
    obj[head] = tail;
    return obj;
  }, {});
};

const takeFirst = (arr: GaleParams) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return arr.map(([head, _]) => head);
};

const createHashTable = (arr: GaleParams) => {
  return arr.reduce((obj, [head, tail]) => {
    if (!obj[head]) {
      obj[head] = {};
    }

    return tail.reduce((_obj, item, score) => {
      _obj[head][item] = score;
      return _obj;
    }, obj);
  }, {});
};

class GaleShapely {
  maleNames: GalePreference;
  maleChoices: GaleTuplePreference | Record<string, GalePreference>;
  scores: Record<string, Record<string, number>>;

  constructor(males: GaleParams, females: GaleParams) {
    this.maleNames = takeFirst(males);
    this.maleChoices = toObject(males);
    this.scores = createHashTable(females);
  }

  compareScore(male: string, female: string) {
    return (this.scores[male] && this.scores[male][female]) || Infinity;
  }

  engage(state: Record<string, string>, male: string, female: string) {
    state[male] = female;
    state[female] = male;
  }

  breakup(state: Record<string, string>, male: string) {
    state[male] = '';
  }

  currentPartner(state: Record<string, string>, person: string) {
    return state[person];
  }

  isSingle(state: Record<string, string>, partner: string) {
    return state[partner] === undefined;
  }

  getPreference(male: string) {
    return (this.maleChoices[male] && this.maleChoices[male][0]) || null;
  }

  updatePreferences(male: string) {
    const preferences = [...this.maleChoices[male]];
    this.maleChoices[male] = preferences.slice(1, preferences.length);
  }

  terminationCondition(state) {
    const currentMatches = this.maleNames.filter((name) => {
      return state[name];
    }).length;
    return currentMatches === this.maleNames.length;
  }

  match(initialState = {}) {
    const names = this.maleNames;
    const loop = (initialState = {}) => {
      return names.reduce((state, male) => {
        if (!this.isSingle(state, male)) {
          return state;
        }
        const female = this.getPreference(male);
        if (this.isSingle(state, female)) {
          this.engage(state, male, female);
        } else {
          const currMale = this.currentPartner(state, female);
          const score1 = this.compareScore(male, female);
          const score2 = this.compareScore(currMale, female);

          if (score1 < score2) {
            this.breakup(state, currMale);
            this.engage(state, male, female);
          }
        }
        this.updatePreferences(male);
        return state;
      }, initialState);
    };

    const state = loop(initialState);

    if (!this.terminationCondition(state)) {
      return {...state, ...this.match(state)};
    }

    return state;
  }
}

export default (male: GaleParams, females: GaleParams) => {
  return new GaleShapely(male, females);
};

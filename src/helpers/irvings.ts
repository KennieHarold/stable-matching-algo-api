// Source: https://github.com/gfornari/stable-roommates-problem/blob/master/stable-roommates-algorithm.js

import {IrvingsParams, SN} from 'types/helpers';

class Irvings {
  computeMatches = (preferences: IrvingsParams) => {
    const {prefs, accepts} = this.firstPhase(preferences);
    const _prefs = this.secondPhase(prefs, accepts);

    return this.thirdPhase(_prefs);
  };

  rejectSymmetrically = (
    i: SN,
    j: SN,
    prefs: IrvingsParams | Record<string, string>,
  ) => {
    const indexJ = prefs[i].indexOf(j);
    if (indexJ > -1) prefs[i].splice(indexJ, 1);
    const indexI = prefs[j].indexOf(i);
    if (indexI > -1) prefs[j].splice(indexI, 1);
  };

  acceptProposal = (
    i: SN,
    preferred: SN,
    proposals: IrvingsParams | Record<string, string>,
    accepts: IrvingsParams | Record<string, string>,
  ) => {
    proposals[i] = preferred;
    accepts[preferred] = i;
  };

  wouldBreakup = (
    preferred: SN,
    i: SN,
    accepts: IrvingsParams | Record<string, string>,
    prefs: IrvingsParams,
  ) => {
    const indexCurrentProposal = prefs[preferred].indexOf(accepts[preferred]);
    const indexNewProposal = prefs[preferred].indexOf(i);
    return indexNewProposal < indexCurrentProposal;
  };

  breakupFor = (
    preferred: SN,
    i: SN,
    proposals: IrvingsParams | Record<string, string>,
    accepts: IrvingsParams | Record<string, string>,
    prefs: IrvingsParams | Record<string, string>,
  ) => {
    proposals[i] = preferred;
    const oldAccept = accepts[preferred];
    accepts[preferred] = i;
    this.rejectSymmetrically(preferred, oldAccept, prefs);
    return oldAccept;
  };

  firstPhase = (prefs: IrvingsParams) => {
    const unmatched = [...Array(prefs.length).keys()];

    const proposals = {};
    const accepts = {};

    while (unmatched.length > 0) {
      const i = unmatched[0];
      const preferred = prefs[i][0];

      if (!accepts[preferred]) {
        // the preferred is free
        this.acceptProposal(i, preferred, proposals, accepts);
        unmatched.shift();
      } else if (this.wouldBreakup(preferred, i, accepts, prefs)) {
        // preferred is willing to breakup
        const preferredOldAccept = this.breakupFor(
          preferred,
          i,
          proposals,
          accepts,
          prefs,
        );
        unmatched[0] = preferredOldAccept;
      } else {
        this.rejectSymmetrically(i, preferred, prefs);
      }
    }

    return {prefs, accepts};
  };

  secondPhase = (
    prefs: IrvingsParams,
    accepts: IrvingsParams | Record<string, string>,
  ) => {
    for (let i = 0; i < prefs.length; i++) {
      const indexAccept = prefs[i].indexOf(accepts[i]);
      if (indexAccept > -1) {
        // deep copy, just to be sure
        const toRemove = JSON.parse(
          JSON.stringify(prefs[i].slice(indexAccept + 1)),
        );
        toRemove.forEach((r: string) => this.rejectSymmetrically(i, r, prefs));
      }
    }

    return prefs;
  };

  getRotation = (
    i: SN,
    prefs: IrvingsParams,
    secondChoices: string[],
    lastChoices: SN[] = [],
  ) => {
    if (
      lastChoices.slice(0, -1).indexOf(lastChoices[lastChoices.length - 1]) !==
      -1
    ) {
      // preference cycle
      return {secondChoices, lastChoices};
    }

    const second = prefs[i][1];

    // at a given point in the recursion, we find that the current i has no second
    // preference, hence there are no other rotations to remove, thus no stable matching exists.
    // NOTE: this is just an intuition without actual proof
    if (second === undefined) {
      return {secondChoices: null, lastChoices: null};
    }

    secondChoices.push(second);
    const secondLastIndex = prefs[second].length - 1;
    const secondLast = prefs[second][secondLastIndex];
    lastChoices.push(secondLast);

    return this.getRotation(secondLast, prefs, secondChoices, lastChoices);
  };

  removeRotation = (
    secondChoices: string[],
    lastChoices: string[],
    prefs: IrvingsParams,
  ) => {
    let i = lastChoices.indexOf(lastChoices[lastChoices.length - 1]);

    for (i++; i < lastChoices.length; i++) {
      this.rejectSymmetrically(secondChoices[i - 1], lastChoices[i], prefs);
    }
  };

  thirdPhase = (prefs: IrvingsParams) => {
    let i = 0;

    while (i < prefs.length) {
      if (prefs[i].length === 1) {
        i++;
      } else {
        const {secondChoices, lastChoices} = this.getRotation(
          i,
          prefs,
          [],
          [i],
        );

        // no stable matching exists
        if (secondChoices === null || lastChoices === null) {
          return null;
        }

        this.removeRotation(secondChoices, lastChoices, prefs);

        // if any list becomes empty, return null (no stable matching exists)
        if (prefs.some((p) => p.length === 0)) {
          return null;
        }

        i = 0;
      }
    }

    return prefs;
  };
}

export default () => new Irvings();

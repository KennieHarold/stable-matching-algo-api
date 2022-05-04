import GaleShapely from 'helpers/gale-shapely';
import Irvings from 'helpers/irvings';

import {Request, Response} from 'express';

import {PreferenceBody} from 'types/api';
import {GaleParams, IrvingsParams} from 'types/helpers';

export const getAllUsersPreference = (req: Request, res: Response) => {
  try {
    const body: PreferenceBody = req.body;

    if (body.method === 'gale') {
      const males: GaleParams = req.body.inputParams.males;
      const females: GaleParams = req.body.inputParams.females;

      const galeShapely = GaleShapely(males, females);
      const matches = galeShapely.match();

      return res.status(200).json({matches, message: 'Success match!'});
    } else if (body.method === 'irvings') {
      const inputs: IrvingsParams = req.body.inputParams;

      const irvings = Irvings();
      const matches = irvings.computeMatches(inputs);

      return res.status(200).json({matches, message: 'Success match!'});
    } else {
      throw 'Invalid preference method';
    }
  } catch (error) {
    return res
      .status(500)
      .json({matches: [], message: 'Server error!', error: error.message});
  }
};

import {v4 as uuidv4} from 'uuid';
import JSONdb from 'simple-json-db';

import {Request, Response} from 'express';
import {PreferenceBody, UserBody} from 'types/api';
import {GaleParams, IrvingsParams} from 'types/helpers';

import GaleShapely from 'helpers/gale-shapely';
import Irvings from 'helpers/irvings';

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

export const addUser = (req: Request, res: Response) => {
  try {
    const Users = new JSONdb('db/Users.json');
    const id = uuidv4();
    const body: UserBody = req.body;

    Users.set(id, {...body});

    return res.status(200).json({message: 'Success'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

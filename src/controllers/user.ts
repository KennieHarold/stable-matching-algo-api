import {v4 as uuidv4} from 'uuid';
import JSONdb from 'simple-json-db';

import {Request, Response} from 'express';
import {PreferenceBody, UserBody} from 'types/api';
import {GaleParams, IrvingsParams} from 'types/helpers';

import GaleShapely from 'helpers/gale-shapely';
import Irvings from 'helpers/irvings';
import {getParams} from 'helpers/parser';

export const getAllUsersPreference = (req: Request, res: Response) => {
  try {
    // Get all users preference
    const {galeParams, irvingsParams} = getParams();
    const body: PreferenceBody = req.body;

    if (body.method === 'gale') {
      const males: GaleParams = galeParams.males;
      const females: GaleParams = galeParams.females;

      const galeShapely = GaleShapely(males, females);
      const matches = galeShapely.match();

      return res.status(200).json({matches, message: 'Success match!'});
    } else if (body.method === 'irvings') {
      const inputs: IrvingsParams = irvingsParams;

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

    const UsersJSON = Users.JSON();
    const userKeys = Object.keys(UsersJSON);

    for (let i = 0; i < userKeys.length; i++) {
      if (UsersJSON[userKeys[i]].name === body.name) {
        return res.status(200).json({message: 'Name already exists!'});
      }
    }

    if (userKeys.length >= 10) {
      return res.status(400).json({error: 'Max users reached!'});
    }

    // Make sure male and females are equal
    let maleLength = 0;
    let femaleLength = 0;

    for (let i = 0; i < userKeys.length; i++) {
      if (UsersJSON[userKeys[i]].gender === 'male') {
        maleLength++;
      } else {
        femaleLength++;
      }
    }

    if (body.gender === 'male') {
      if (maleLength >= 5) {
        return res
          .status(400)
          .json({error: 'All male slots are already filled'});
      }
    } else {
      if (femaleLength >= 5) {
        return res
          .status(400)
          .json({error: 'All female slots are already filled'});
      }
    }

    // Add user
    let highPreferenceId = -1;

    Object.keys(UsersJSON).forEach((key) => {
      const preferenceId = parseInt(UsersJSON[key].preferenceId);
      highPreferenceId =
        preferenceId > highPreferenceId ? preferenceId : highPreferenceId;
    });

    Users.set(id, {
      ...body,
      preferenceId: (highPreferenceId + 1).toString(),
      preferences: {irvings: [], gale: []},
    });

    return res.status(200).json({message: 'Success!'});
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
};

export const addPreference = (req: Request, res: Response) => {
  try {
    const Users = new JSONdb('db/Users.json');
    const UsersJSON = Users.JSON();
    const userId = req.params.id;
    const dbLength = Object.keys(UsersJSON).length;
    const preferences = req.body.preferences;
    const usersPreferenceId = UsersJSON[userId].preferenceId;

    if (!preferences.gale || !preferences.irvings) {
      return res.status(400).json({error: 'Missing preferences'});
    }

    if (preferences.irvings.length !== dbLength - 1) {
      return res.status(400).json({error: 'Invalid irvings preferences'});
    }

    if (dbLength % 2 !== 0 || dbLength / 2 !== preferences.gale.length) {
      return res.status(400).json({error: 'Invalid gale preferences'});
    }

    if (
      preferences.irvings.includes(usersPreferenceId) ||
      preferences.gale.includes(usersPreferenceId)
    ) {
      return res.status(400).json({error: "Can't preference current user!"});
    }

    const usersKeys = Object.keys(UsersJSON);
    for (let i = 0; i < preferences.gale.length; i++) {
      for (let j = 0; j < usersKeys.length; j++) {
        if (preferences.gale[i] === UsersJSON[usersKeys[j]].preferenceId) {
          if (UsersJSON[userId].gender === UsersJSON[usersKeys[j]].gender) {
            return res.status(400).json({error: 'Cant preference same gender'});
          }
        }
      }
    }

    Users.set(userId, {
      ...UsersJSON[userId],
      preferences: {
        ...UsersJSON[userId].preferences,
        irvings: [...preferences.irvings],
        gale: [usersPreferenceId, [...preferences.gale]],
      },
    });

    return res.status(200).json({message: 'Success'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: error.message});
  }
};

export const getUsers = (req: Request, res: Response) => {
  try {
    const Users = new JSONdb('db/Users.json');
    const UsersJSON = Users.JSON();
    const data = [];

    Object.keys(UsersJSON).forEach((key) => {
      data.push({
        id: key,
        ...UsersJSON[key],
      });
    });
    return res.status(200).json({users: data});
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
};

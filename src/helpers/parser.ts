import JSONdb from 'simple-json-db';
import {GaleParams, IrvingsParams} from 'types/helpers';

export const getParams = () => {
  const Users = new JSONdb('db/Users.json');
  const UsersJSON = Users.JSON();

  const galeMale: GaleParams = [];
  const galeFemale: GaleParams = [];
  const irvings: IrvingsParams = [];

  Object.keys(UsersJSON).forEach((key, index) => {
    const preferences = UsersJSON[key].preferences;
    const preferenceId = UsersJSON[key].preferenceId;
    const gender = UsersJSON[key].gender;

    if (index.toString() === preferenceId) {
      if (gender === 'male') {
        galeMale.push([preferenceId, [...preferences.gale[1]]]);
      } else {
        galeFemale.push([preferenceId, [...preferences.gale[1]]]);
      }
      irvings.push([...preferences.irvings]);
    }
  });

  return {
    galeParams: {males: galeMale, females: galeFemale},
    irvingsParams: irvings,
  };
};

import { get, set, ref, query, equalTo, orderByChild, update, DataSnapshot,push, remove } from 'firebase/database';
import { db } from '../config/firebaseConfig';

export const createTeam = (name: string, handle: string, members: object, description: string) => {
    return push(
        ref(db, 'teams'),
        {
            name,
            owner: handle,
            members,
            description,
            createdOn: Date.now()
        },
    )
        .then(result => {

            return getTeamById(result.key);
        });
};

export const getTeamById = (id: string | null) => {
    return get(ref(db, `teams/${id}`))
        .then(result => {
            if (!result.exists()) {
                throw new Error(`Team with id ${id} does not exist!`);
            }
            const team = result.val();
            team.id = id;
            team.createdOn = new Date(team.createdOn);
            
            return team;
        });
};

export const getTeamByName = (name: string | null) => {
    return get(query(ref(db, 'teams'), orderByChild('name'), equalTo(name)))
};



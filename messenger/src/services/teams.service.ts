import { get, set, ref, query, equalTo, orderByChild, update, push, remove, onValue } from 'firebase/database';
import { db } from '../config/firebaseConfig';
import { deleteMemberFromChannel, getChannelById, channelMessage } from './channels.service'
import { ADMIN, FROM, REMOVED, REMOVE_PERSON } from "../common/constants";
import { addMessage } from "./messages";

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
      if (result.key === null) return;

      return getTeamById(result.key);
    })
    .catch(e => console.error(e))
};

export const getTeamById = (id: string) => {
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

export const getTeamByName = (name: string) => {
  return get(query(ref(db, 'teams'), orderByChild('name'), equalTo(name)))
}


export const updateTeamChannel = (idTeam: string, idChannel: string) => {
  return update(ref(db), { [`teams/${idTeam}/channels/${idChannel}`]: true })
}

export interface ChannelsListener { (channels: string[]): void }

export const getTeamChannelsLive = (id: string, listener: ChannelsListener) => {

  return onValue(ref(db, `teams/${id}/channels`), (snapshot) => {
    if (!snapshot.exists()) return [];
    const channels = Object.keys(snapshot.val());
    return listener(channels)
  })
}

export const deleteMemberFromTeam = (teamId: string, handle: string, firstName: string, lastName: string, displayName: string) => {
  getTeamById(teamId)
    .then((team) => {
      Object.keys(team.channels).map((channelId) => {
        getChannelById(channelId)
          .then((elChannel) => {
            console.error(elChannel)
            const members = Object.keys(elChannel.members)
            if (members.includes(handle)) {
              deleteMemberFromChannel(channelId, handle)
                .then(() => {
                  addMessage(firstName + ' ' + lastName + ' ' + REMOVED + displayName + FROM + elChannel.title, ADMIN, elChannel.id, true, REMOVE_PERSON)
                    .then(message => {
                      channelMessage(channelId, message.id);
                    })
                    .catch(error => console.error(error.message));
                })
            }
          })
      })
    }
    )

  remove(ref(db, `teams/${teamId}/members/${handle}`));
  remove(ref(db, `users/${handle}/myTeams/${teamId}`));
}

export const addMemberToTeam = (teamId: string, memberId: string) => {
  const updateTeamMembers: { [key: string]: boolean } = {};
  updateTeamMembers[`/teams/${teamId}/members/${memberId}`] = true;

  return update(ref(db), updateTeamMembers);
}

export const updateGeneralTeamChannel = (idTeam: string, idChannel: string) => {
  return update(ref(db), { [`teams/${idTeam}/generalChannel`]: idChannel })
}

export const updateTeamName = (idTeam: string, title: string) => {
  return update(ref(db),
    { [`teams/${idTeam}/name`]: title })
}

export const updateTeamDescription = (idTeam: string, description: string) => {
  return update(ref(db),
    { [`teams/${idTeam}/description`]: description })
}

export interface Listener { (data: string[]): void }

export const getTeamInfoLife = (listener: Listener) => {

  return onValue(ref(db, `teams/`), (snapshot) => {
    if (!snapshot.exists()) return [];
    const team = Object.keys(snapshot.val());
    return listener(team)
  })
}

export interface TitleListener { (title: string): void }

export const getTeamTitleLive = (teamId: string, listener: TitleListener) => {

  return onValue(ref(db, `teams/${teamId}/name`), (snapshot) => {
    if (!snapshot.exists()) return listener('');

    const title = snapshot.val();
    return listener(title);
  })
}

export interface MemberListener { (members: object): void }

export const getTeamMemberLive = (teamId: string, listener: TitleListener) => {

  return onValue(ref(db, `teams/${teamId}/members`), (snapshot) => {
    if (!snapshot.exists()) return listener('');

    const members = snapshot.val();
    return listener(members);
  })
}

export const getTeamPhotoLive = (teamId: string, listener: TitleListener) => {

  return onValue(ref(db, `teams/${teamId}/teamPhoto`), (snapshot) => {
    if (!snapshot.exists()) return listener('');

    const photo = snapshot.val();

    return listener(photo);
  })
}
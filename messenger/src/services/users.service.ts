import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebaseConfig';

export const getUserByHandle = (handle) => {

  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (handle, uid, email, firstName, lastName, phoneNumber) => {

  return set(ref(db, `users/${handle}`), {
    handle,
    uid,
    email,
    firstName,
    lastName,
    isBlocked: false,
    isAdmin: false,
    phoneNumber,
    likedPosts: {},
  })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const updateUserData = (handle, key, value) => {
  return update(ref(db), { [`users/${handle}/${key}`]: `${value}` });
}

export const userPost = (id, handle) => {
  const updateUserPosts = {};
  updateUserPosts[`/users/${handle}/myPosts/${id}`] = true;

  return update(ref(db), updateUserPosts);
}

export const userReply = (id, handle) => {
  const updateUserReply = {};
  updateUserReply[`/users/${handle}/myReplies/${id}`] = true;

  return update(ref(db), updateUserReply);
}

export const getAllUsers = () => {
  return get(ref(db, 'users'))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return [];
      }

      return Object.keys(snapshot.val())
    });
};

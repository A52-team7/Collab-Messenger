/*
  We'll add a 30-min expiry (exp) so rooms won't linger too long on your account.
  See other available options at https://docs.daily.co/reference#create-room
 */

// const isLocal =import.meta.env.VITE_ROOM_ENDPOINT && import.meta.env.VITE_ROOM_ENDPOINT === 'local';
const endpoint = 'https://api.daily.co/v1/rooms/';

export async function createRoom() {
  const exp = Math.round(Date.now() / 1000) + 60 * 60 * 24;
  const options = {
    properties: {
      exp,
    },
  };

  /*
    No need to send the headers with the request when using the proxy option:
    netlify.toml takes care of that for us.
  */
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_DAILY_API_KEY}`,
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(options),
    ...headers,
  });

  return response.json();
}

export async function deleteRoom(roomUrl: string) {
  const room: string[] = roomUrl.split('/');

    const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_DAILY_API_KEY}`,
    },
  };

  const response = await fetch(`${endpoint}${room[room.length - 1]}`, {
    method: 'DELETE',
    ...headers,
  });

  return response.json();
}
/*
  We'll add a 30-min expiry (exp) so rooms won't linger too long on your account.
  See other available options at https://docs.daily.co/reference#create-room
 */
async function createRoom() {
  const exp = Math.round(Date.now() / 1000) + 60 * 120;
  const options = {
    properties: {
      exp,
    },
  };

  // const isLocal =import.meta.env.VITE_ROOM_ENDPOINT && import.meta.env.VITE_ROOM_ENDPOINT === 'local';
  const endpoint = 'https://api.daily.co/v1/rooms/'

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

export default { createRoom };

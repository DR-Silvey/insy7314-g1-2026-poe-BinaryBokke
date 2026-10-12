function encode(value) {
  return btoa(JSON.stringify(value)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export default function createToken({ username = 'johndoe', role = 'GENERIC', expiresInSeconds = 3600 } = {}) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ username, role, exp })}.signature`;
}

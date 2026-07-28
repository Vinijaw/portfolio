// Troca o refresh token (guardado como env var) por um access token novo.
// Chamado a cada request das functions de /api — o access token do Spotify
// expira em 1h, então não vale a pena tentar cachear entre invocações.
async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error("Variáveis de ambiente do Spotify não configuradas.");
  }

  const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error(`Falha ao renovar access token do Spotify (${response.status}).`);
  }

  const data = await response.json();
  return data.access_token;
}

async function spotifyFetch(path) {
  const accessToken = await getAccessToken();
  return fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

module.exports = { spotifyFetch };

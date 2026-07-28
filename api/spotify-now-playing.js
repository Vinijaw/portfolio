const { spotifyFetch } = require("../lib/spotify");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");

  try {
    const spotifyRes = await spotifyFetch("/me/player/currently-playing");

    // 204 = nada tocando no momento
    if (spotifyRes.status === 204 || spotifyRes.status === 404) {
      return res.status(200).json({ isPlaying: false });
    }

    if (!spotifyRes.ok) {
      throw new Error(`Spotify respondeu ${spotifyRes.status}`);
    }

    const data = await spotifyRes.json();

    if (!data || !data.item || !data.is_playing) {
      return res.status(200).json({ isPlaying: false });
    }

    return res.status(200).json({
      isPlaying: true,
      title: data.item.name,
      artist: data.item.artists.map((artist) => artist.name).join(", "),
      art: data.item.album.images[data.item.album.images.length - 1]?.url ?? null,
      url: data.item.external_urls.spotify,
    });
  } catch (error) {
    return res.status(200).json({ isPlaying: false });
  }
};

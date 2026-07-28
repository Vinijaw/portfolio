const { spotifyFetch } = require("../lib/spotify");

const VALID_RANGES = new Set(["short_term", "long_term"]);

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");

  const range = VALID_RANGES.has(req.query.range) ? req.query.range : "short_term";

  try {
    const spotifyRes = await spotifyFetch(`/me/top/tracks?time_range=${range}&limit=3`);

    if (!spotifyRes.ok) {
      throw new Error(`Spotify respondeu ${spotifyRes.status}`);
    }

    const data = await spotifyRes.json();

    const tracks = (data.items ?? []).map((item) => ({
      title: item.name,
      artist: item.artists.map((artist) => artist.name).join(", "),
      art: item.album.images[item.album.images.length - 1]?.url ?? null,
      url: item.external_urls.spotify,
    }));

    return res.status(200).json({ tracks });
  } catch (error) {
    return res.status(200).json({ tracks: [] });
  }
};

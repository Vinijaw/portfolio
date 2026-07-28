// Script de uso ÚNICO, rodado localmente (node scripts/spotify-get-refresh-token.js).
// Não faz parte do site publicado. Gera o refresh token que vai para as env vars
// do Vercel (SPOTIFY_REFRESH_TOKEN).
//
// Antes de rodar:
//   1. Crie um app em https://developer.spotify.com/dashboard
//   2. Cadastre o Redirect URI: http://127.0.0.1:8888/callback
//   3. Rode assim, com o Client ID/Secret desse app:
//      SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-get-refresh-token.js

const http = require("http");

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPES = "user-top-read user-read-currently-playing";
const PORT = 8888;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error(
    "Defina SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET antes de rodar este script.\n" +
      "Exemplo: SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-get-refresh-token.js"
  );
  process.exit(1);
}

const authorizeUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
  });

console.log("\nAbra esta URL no navegador e autorize o app:\n");
console.log(authorizeUrl);
console.log(`\nAguardando o redirect em ${REDIRECT_URI} ...\n`);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Autorização falhou. Pode fechar esta aba e checar o terminal.");
    console.error("Autorização falhou:", error || "código ausente");
    server.close();
    process.exit(1);
    return;
  }

  try {
    const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await tokenRes.json();

    if (!tokenRes.ok) {
      throw new Error(data.error_description || `Spotify respondeu ${tokenRes.status}`);
    }

    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Autorizado! Pode fechar esta aba e voltar pro terminal.");

    console.log("Refresh token (cole em SPOTIFY_REFRESH_TOKEN no Vercel):\n");
    console.log(data.refresh_token);
    console.log("");
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Erro ao trocar o código por tokens. Confira o terminal.");
    console.error("Erro ao trocar o código por tokens:", err.message);
  } finally {
    server.close();
  }
});

server.listen(PORT);

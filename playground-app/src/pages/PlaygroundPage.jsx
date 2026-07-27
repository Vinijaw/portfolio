import { Link } from "react-router-dom";

/**
 * Stub da página dedicada /playground — destino do CTA da PlaygroundSection.
 * Aqui entraria a listagem completa dos experimentos (fora do escopo desta seção).
 */
export default function PlaygroundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-6 text-center text-onDark">
      <p className="tag tag--onDark">Playground</p>
      <h1 className="font-display text-3xl font-bold">Todos os experimentos</h1>
      <p className="max-w-[45ch] text-onDark-muted">
        Página dedicada com a listagem completa — a construir.
      </p>
      <Link to="/" className="btn btn--primary mt-2">
        Voltar
      </Link>
    </main>
  );
}

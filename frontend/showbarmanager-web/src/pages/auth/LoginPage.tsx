import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { AuthService } from "../../services/auth.service"
import { useAuthStore } from "../../store/auth.store"

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [email, setEmail] = useState("admin@demo.pt")
  const [password, setPassword] = useState("123456")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await AuthService.login({
        email,
        password,
      })

      setAuth(data)
      navigate("/dashboard")
    } catch {
      setError("E-mail ou senha inválidos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-2xl p-10 w-full max-w-[420px]"
      >
        <h1 className="text-3xl font-bold text-neon mb-2">
          Entrar
        </h1>

        <p className="text-muted mb-8">
          Acesse o ShowbarManager Enterprise.
        </p>

        <div className="space-y-4">
          <input
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
            placeholder="E-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-neon
              text-black
              font-semibold
              py-3
              rounded-full
              hover:shadow-neon
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Entrando..." : "Entrar no Sistema"}
          </button>
        </div>
      </form>
    </div>
  )
}
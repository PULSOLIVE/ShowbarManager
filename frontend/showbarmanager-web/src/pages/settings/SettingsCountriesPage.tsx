import {
  Edit,
  Flag,
  Globe2,
  Plus,
  Save,
  Trash2,
} from "lucide-react"

const countries = [
  {
    name: "Portugal",
    currency: "EUR",
    language: "pt-PT",
    tax: "IVA / SAF-T PT",
    fields: ["NIF/NIPC", "IBAN/NIB", "ATCUD", "QR Code Fiscal"],
  },
  {
    name: "Brasil",
    currency: "BRL",
    language: "pt-BR",
    tax: "NFS-e / RPS",
    fields: ["CPF/CNPJ", "PIX", "Boleto", "Inscrição Municipal"],
  },
]

export function SettingsCountriesPage() {
  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <Globe2 size={16} />
            Configurações
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Países e Fiscal
          </h2>

          <p className="text-muted mt-2">
            Regras fiscais, documentos obrigatórios, moedas, idiomas e validações por país.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-background border border-border px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:border-neon hover:text-neon transition text-sm">
            <Plus size={16} />
            Novo país
          </button>

          <button className="bg-neon text-black font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
            <Save size={16} />
            Salvar regras
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {countries.map((country) => (
          <div
            key={country.name}
            className="bg-card border border-border rounded-2xl p-5 hover:border-neon/70 transition"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center">
                  <Flag className="text-neon" size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">{country.name}</h3>
                  <p className="text-sm text-muted">{country.tax}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition">
                  <Edit size={15} />
                </button>

                <button className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <Field label="Moeda" value={country.currency} />
              <Field label="Idioma" value={country.language} />
            </div>

            <div className="flex flex-wrap gap-2">
              {country.fields.map((field) => (
                <span
                  key={field}
                  className="rounded-full bg-background border border-border px-4 py-2 text-sm text-muted"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background border border-border rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <strong className="text-neon">{value}</strong>
    </div>
  )
}
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
    description: "Regras fiscais portuguesas, faturação e validações locais.",
    fields: ["NIF/NIPC", "IBAN/NIB", "ATCUD", "QR Code Fiscal"],
  },
  {
    name: "Brasil",
    currency: "BRL",
    language: "pt-BR",
    tax: "NFS-e / RPS",
    description: "Documentos, meios de pagamento e regras fiscais brasileiras.",
    fields: ["CPF/CNPJ", "PIX", "Boleto", "Inscrição Municipal"],
  },
]

export function SettingsCountriesPage() {
  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <Globe2 size={16} />
              Configurações
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              Países e Fiscal
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              Regras fiscais, documentos obrigatórios, moedas, idiomas e validações por país.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm">
              <Plus size={15} />
              Novo país
            </button>

            <button className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
              <Save size={15} />
              Salvar regras
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {countries.map((country) => (
          <CountryCard key={country.name} country={country} />
        ))}
      </section>
    </div>
  )
}

function CountryCard({
  country,
}: {
  country: {
    name: string
    currency: string
    language: string
    tax: string
    description: string
    fields: string[]
  }
}) {
  return (
    <article className="surface-premium rounded-2xl p-4 hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
            <Flag className="text-primary" size={19} />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {country.name}
            </h3>

            <p className="text-sm text-muted truncate">
              {country.tax}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
            title="Editar"
          >
            <Edit size={14} />
          </button>

          <button
            className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-danger hover:text-danger transition"
            title="Excluir"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed mb-4">
        {country.description}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Field label="Moeda" value={country.currency} />
        <Field label="Idioma" value={country.language} />
      </div>

      <div className="flex flex-wrap gap-2">
        {country.fields.map((field) => (
          <span
            key={field}
            className="rounded-full bg-cardSoft border border-border px-3 py-1.5 text-xs text-muted"
          >
            {field}
          </span>
        ))}
      </div>
    </article>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cardSoft border border-border rounded-2xl p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted">
        {label}
      </p>

      <strong className="text-primary text-sm block mt-1">
        {value}
      </strong>
    </div>
  )
}
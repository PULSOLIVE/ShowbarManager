import { useEffect, useMemo, useState } from "react"
import type { ComponentType } from "react"
import { ChevronDown, Search } from "lucide-react"
import * as FlagIcons from "country-flag-icons/react/3x2"
import { defaultCountries, parseCountry } from "react-international-phone"
import { useTranslation } from "../../hooks/useTranslation"
import type { ParsedCountry } from "react-international-phone"

interface PhoneNumberInputProps {
  value: string
  onChange: (value: string) => void
  countryCode?: string | null
  dialCode?: string | null
  onCountryCodeChange?: (value: string | null) => void
  onDialCodeChange?: (value: string | null) => void
  placeholder?: string
}

type FlagComponent = ComponentType<{ className?: string; title?: string }>

const flags = FlagIcons as Record<string, FlagComponent | undefined>

const countryNameOverrides: Record<string, string> = {
  ao: "Angola",
  br: "Brasil",
  de: "Alemanha",
  es: "Espanha",
  fr: "França",
  gb: "Reino Unido",
  it: "Itália",
  mz: "Moçambique",
  pt: "Portugal",
  us: "Estados Unidos",
}

function getCountryName(country: ParsedCountry) {
  const override = countryNameOverrides[country.iso2]

  if (override) {
    return override
  }

  try {
    return new Intl.DisplayNames(["pt"], { type: "region" }).of(country.iso2.toUpperCase()) || country.name
  } catch {
    return country.name
  }
}

const countries = defaultCountries
  .map((country) => parseCountry(country))
  .sort((a, b) => getCountryName(a).localeCompare(getCountryName(b)))

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "")
}

function normalizeCountryCode(countryCode?: string | null) {
  return countryCode?.trim().toLowerCase() || ""
}

function normalizeDialCode(dialCode?: string | null) {
  return normalizeDigits(dialCode || "")
}

function findCountryByPhone(phone: string) {
  const digits = normalizeDigits(phone)

  return countries
    .filter((country) => digits.startsWith(country.dialCode))
    .sort((a, b) => b.dialCode.length - a.dialCode.length)[0]
}

function findCountryByMetadata(countryCode?: string | null, dialCode?: string | null) {
  const normalizedCountryCode = normalizeCountryCode(countryCode)
  const normalizedDialCode = normalizeDialCode(dialCode)

  if (normalizedCountryCode) {
    const countryByCode = countries.find((country) => country.iso2 === normalizedCountryCode)

    if (countryByCode) {
      return countryByCode
    }
  }

  if (normalizedDialCode) {
    return countries.find((country) => country.dialCode === normalizedDialCode)
  }

  return undefined
}

function getLocalNumber(phone: string, country: ParsedCountry) {
  const digits = normalizeDigits(phone)

  if (digits.startsWith(country.dialCode)) {
    return digits.slice(country.dialCode.length)
  }

  return digits
}

export function PhoneNumberInput({
  value,
  onChange,
  countryCode,
  dialCode,
  onCountryCodeChange,
  onDialCodeChange,
  placeholder = "+351 927 703 306",
}: PhoneNumberInputProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIso2, setSelectedIso2] = useState("pt")

  const selectedCountry =
    findCountryByMetadata(countryCode, dialCode) ||
    findCountryByPhone(value) ||
    countries.find((country) => country.iso2 === selectedIso2) ||
    countries[0]

  const localNumber = getLocalNumber(value, selectedCountry)

  useEffect(() => {
    setSelectedIso2(selectedCountry.iso2)
    onCountryCodeChange?.(selectedCountry.iso2.toUpperCase())
    onDialCodeChange?.(`+${selectedCountry.dialCode}`)
  }, [onCountryCodeChange, onDialCodeChange, selectedCountry.dialCode, selectedCountry.iso2])

  const filteredCountries = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return countries

    const digitsTerm = normalizeDigits(term)

    return countries.filter((country) => {
      return (
        getCountryName(country).toLowerCase().includes(term) ||
        country.iso2.toLowerCase().includes(term) ||
        (digitsTerm.length > 0 && country.dialCode.includes(digitsTerm))
      )
    })
  }, [search])

  function selectCountry(country: ParsedCountry) {
    setSelectedIso2(country.iso2)
    onCountryCodeChange?.(country.iso2.toUpperCase())
    onDialCodeChange?.(`+${country.dialCode}`)
    onChange(localNumber ? `+${country.dialCode}${localNumber}` : "")
    setSearch("")
    setOpen(false)
  }

  function handleNumberChange(nextValue: string) {
    const digits = normalizeDigits(nextValue)
    onCountryCodeChange?.(selectedCountry.iso2.toUpperCase())
    onDialCodeChange?.(`+${selectedCountry.dialCode}`)
    onChange(digits ? `+${selectedCountry.dialCode}${digits}` : "")
  }

  return (
    <div className="showbar-phone-select relative">
      <div className="field-input showbar-phone-select-field px-0 py-0 flex items-center focus-within:border-primary">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="showbar-phone-select-button h-[40px] px-3 flex items-center gap-2 border-r border-border text-sm text-text hover:text-primary transition"
        >
          <CountryFlag countryCode={selectedCountry.iso2} label={getCountryName(selectedCountry)} />
          <span className="font-semibold">+{selectedCountry.dialCode}</span>
          <ChevronDown size={14} className={open ? "rotate-180 transition" : "transition"} />
        </button>

        <input
          className="w-full bg-transparent px-3 py-2.5 outline-none text-sm"
          type="tel"
          inputMode="tel"
          placeholder={placeholder}
          value={localNumber}
          onChange={(event) => handleNumberChange(event.target.value)}
        />
      </div>

      {open && (
        <div className="showbar-phone-select-dropdown surface-premium absolute left-0 right-0 top-[48px] z-[70] rounded-2xl p-2 shadow-card">
          <div className="flex items-center gap-2 field-input px-3 py-0 h-[40px] mb-2">
            <Search size={15} className="text-muted shrink-0" />
            <input
              className="w-full bg-transparent outline-none text-sm"
              placeholder={t("users.searchCountryOrDialCode")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              autoFocus
            />
          </div>

          <div className="max-h-[220px] overflow-y-auto app-scrollbar pr-1">
            {filteredCountries.map((country) => (
              <button
                key={`${country.iso2}-${country.dialCode}`}
                type="button"
                onClick={() => selectCountry(country)}
                className={[
                  "w-full min-h-[38px] rounded-xl px-3 py-2 text-left text-sm flex items-center gap-3 transition",
                  country.iso2 === selectedCountry.iso2
                    ? "bg-primarySoft text-primary font-semibold"
                    : "text-text hover:bg-cardSoft",
                ].join(" ")}
              >
                <CountryFlag countryCode={country.iso2} label={getCountryName(country)} />
                <span className="flex-1 truncate">{getCountryName(country)}</span>
                <span className="text-muted">+{country.dialCode}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CountryFlag({ countryCode, label }: { countryCode: string; label: string }) {
  const code = countryCode.toUpperCase()
  const Flag = flags[code]

  if (!Flag) {
    return (
      <span
        className="inline-flex h-4 w-6 shrink-0 rounded-[4px] bg-primarySoft"
        aria-label={label}
        title={label}
      />
    )
  }

  return (
    <span className="inline-flex h-4 w-6 shrink-0 overflow-hidden rounded-[4px]" aria-label={label} title={label}>
      <Flag className="h-full w-full object-cover" title={label} />
    </span>
  )
}
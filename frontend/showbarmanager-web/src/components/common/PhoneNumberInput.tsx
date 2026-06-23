import { useMemo, useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import { defaultCountries, parseCountry } from "react-international-phone"
import type { ParsedCountry } from "react-international-phone"

interface PhoneNumberInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const countries = defaultCountries
  .map((country) => parseCountry(country))
  .sort((a, b) => a.name.localeCompare(b.name))

function getFlag(iso2: string) {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "")
}

function findCountryByPhone(phone: string) {
  const digits = normalizeDigits(phone)

  return countries
    .filter((country) => digits.startsWith(country.dialCode))
    .sort((a, b) => b.dialCode.length - a.dialCode.length)[0]
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
  placeholder = "+351 927 703 306",
}: PhoneNumberInputProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIso2, setSelectedIso2] = useState("pt")
  const selectedCountry = findCountryByPhone(value) || countries.find((country) => country.iso2 === selectedIso2) || countries[0]
  const localNumber = getLocalNumber(value, selectedCountry)

  const filteredCountries = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return countries

    const digitsTerm = normalizeDigits(term)

    return countries.filter((country) => {
      return (
        country.name.toLowerCase().includes(term) ||
        country.iso2.toLowerCase().includes(term) ||
        (digitsTerm.length > 0 && country.dialCode.includes(digitsTerm))
      )
    })
  }, [search])

  function selectCountry(country: ParsedCountry) {
    setSelectedIso2(country.iso2)
    onChange(localNumber ? `+${country.dialCode}${localNumber}` : "")
    setSearch("")
    setOpen(false)
  }

  function handleNumberChange(nextValue: string) {
    const digits = normalizeDigits(nextValue)
    onChange(digits ? `+${selectedCountry.dialCode}${digits}` : "")
  }

  return (
    <div className="showbar-phone-select relative">
      <div className="field-input showbar-phone-select-field px-0 py-0 flex items-center focus-within:border-primary">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="showbar-phone-select-button h-[40px] px-3 flex items-center gap-2 border-r border-border text-sm text-text hover:text-primary transition"
        >
          <span className="text-base leading-none">{getFlag(selectedCountry.iso2)}</span>
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
              placeholder="Buscar pais ou DDI"
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
                <span className="text-base w-6 text-center">{getFlag(country.iso2)}</span>
                <span className="flex-1 truncate">{country.name}</span>
                <span className="text-muted">+{country.dialCode}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
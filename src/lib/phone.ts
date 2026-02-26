export type Country = {
  name: string;
  iso2: string;
  callingCode: string; // digits only, no +
  trunkPrefix: string | null;
  examples?: Record<string, string>;
  notes?: string[];
};

export function stripFormatting(input: string): string {
  // Keep leading + (if present) and digits.
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/[^0-9]/g, '');
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

export function removeOptionalZeroMarker(input: string): string {
  // Remove the common “(0)” marker found in many European formats.
  return input.replace(/\(0\)/g, '');
}

export function findCountryByIso2(countries: Country[], iso2: string): Country | undefined {
  return countries.find((c) => c.iso2.toUpperCase() === iso2.toUpperCase());
}

export function findCountryByCallingCodePrefix(countries: Country[], digits: string): Country | undefined {
  // Longest-prefix match.
  const matches = countries
    .filter((c) => digits.startsWith(c.callingCode))
    .sort((a, b) => b.callingCode.length - a.callingCode.length);
  return matches[0];
}

export type NormalizeResult = {
  input: string;
  normalizedDigits: string; // digits only, no +
  e164: string | null; // +{cc}{nsn} when we can construct it
  nationalNumberDigits: string | null;
  warnings: string[];
};

export function normalizeNumberForDestination(opts: {
  raw: string;
  destination: Country;
  countries: Country[];
}): NormalizeResult {
  const warnings: string[] = [];

  const raw0 = removeOptionalZeroMarker(opts.raw);
  const stripped = stripFormatting(raw0);

  // If already international, keep as E.164-ish and try to identify country.
  if (stripped.startsWith('+')) {
    const digits = stripped.slice(1);
    const c = findCountryByCallingCodePrefix(opts.countries, digits);
    if (!c) {
      return {
        input: opts.raw,
        normalizedDigits: digits,
        e164: `+${digits}`,
        nationalNumberDigits: null,
        warnings: ['This looks like an international number (+...), but the country code was not recognized in the current dataset.'],
      };
    }

    const nsn = digits.slice(c.callingCode.length);
    return {
      input: opts.raw,
      normalizedDigits: digits,
      e164: `+${c.callingCode}${nsn}`,
      nationalNumberDigits: nsn,
      warnings,
    };
  }

  // Otherwise, treat as a national number for the destination.
  let national = stripped;
  if (!national) {
    return {
      input: opts.raw,
      normalizedDigits: '',
      e164: null,
      nationalNumberDigits: null,
      warnings: ['Enter a phone number.'],
    };
  }

  const trunk = opts.destination.trunkPrefix;
  if (trunk && national.startsWith(trunk)) {
    national = national.slice(trunk.length);
    warnings.push(`Dropped leading trunk prefix “${trunk}” for international dialing.`);
  } else if (trunk && /^(0)+/.test(national)) {
    warnings.push('This number starts with 0. Many countries require dropping the leading 0 when calling internationally.');
  }

  const e164 = `+${opts.destination.callingCode}${national}`;

  return {
    input: opts.raw,
    normalizedDigits: `${opts.destination.callingCode}${national}`,
    e164,
    nationalNumberDigits: national,
    warnings,
  };
}

export function buildDialStrings(opts: {
  originIso2: string;
  destinationIso2: string;
  rawNumber: string;
  countries: Country[];
  exitCodes: Record<string, string>;
}): {
  e164: string | null;
  legacy: string | null;
  warnings: string[];
} {
  const origin = findCountryByIso2(opts.countries, opts.originIso2);
  const dest = findCountryByIso2(opts.countries, opts.destinationIso2);
  if (!origin || !dest) {
    return { e164: null, legacy: null, warnings: ['Choose both an origin and destination country.'] };
  }

  const norm = normalizeNumberForDestination({ raw: opts.rawNumber, destination: dest, countries: opts.countries });
  const warnings = [...norm.warnings];

  const e164 = norm.e164;

  const exit = opts.exitCodes[origin.iso2];
  if (!exit) warnings.push(`No exit code (IDD prefix) configured for ${origin.name} yet.`);

  const legacy = exit && norm.nationalNumberDigits !== null
    ? `${exit} ${dest.callingCode} ${norm.nationalNumberDigits}`
    : null;

  return { e164, legacy, warnings };
}

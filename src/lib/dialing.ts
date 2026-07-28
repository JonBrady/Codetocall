import {
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
  type CountryCode,
  type PhoneNumber,
  type ValidatePhoneNumberLengthResult,
} from 'libphonenumber-js';

export const MAX_PHONE_INPUT_LENGTH = 30;

export type Country = {
  name: string;
  iso2: string;
  callingCode: string;
  trunkPrefix: string | null;
  examples?: Record<string, string>;
  notes?: string[];
};

export type NormalizedPhoneNumber = {
  e164: string | null;
  internationalDisplay: string | null;
  nationalDisplay: string | null;
  nationalNumberDigits: string | null;
  countryCallingCode: string | null;
  destinationIso2: string | null;
  destinationName: string | null;
  isInternationalInput: boolean;
  warnings: string[];
};

export type DialStrings = NormalizedPhoneNumber & {
  legacy: string | null;
};

export function sanitizePhoneInput(input: string): string {
  return (input || '')
    .replace(/[^0-9+()\s\-.]/g, '')
    .slice(0, MAX_PHONE_INPUT_LENGTH);
}

export function stripFormatting(input: string): string {
  const trimmed = (input || '').trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/[^0-9]/g, '');
  return hasPlus ? `+${digits}` : digits;
}

export function removeOptionalZeroMarker(input: string): string {
  return (input || '').replace(/\(0\)/g, '');
}

export function findCountryByIso2(
  countries: Country[],
  iso2: string,
): Country | undefined {
  return countries.find(
    (country) => country.iso2.toUpperCase() === iso2.toUpperCase(),
  );
}

function countryFromPhoneNumber(
  phone: PhoneNumber,
  countries: Country[],
  fallback: Country,
): Country {
  if (phone.country) {
    const exact = findCountryByIso2(countries, phone.country);
    if (exact) return exact;
  }

  const matches = countries.filter(
    (country) => country.callingCode === phone.countryCallingCode,
  );
  if (matches.length === 1) return matches[0];
  if (matches.some((country) => country.iso2 === fallback.iso2)) return fallback;
  return matches[0] ?? fallback;
}

function emptyResult(
  isInternationalInput: boolean,
  warning: string,
): NormalizedPhoneNumber {
  return {
    e164: null,
    internationalDisplay: null,
    nationalDisplay: null,
    nationalNumberDigits: null,
    countryCallingCode: null,
    destinationIso2: null,
    destinationName: null,
    isInternationalInput,
    warnings: [warning],
  };
}

function lengthWarning(
  issue: ValidatePhoneNumberLengthResult | undefined,
  countryName?: string,
): string | null {
  const target = countryName ? ` for ${countryName}` : '';

  switch (issue) {
    case 'TOO_SHORT':
      return `This number is too short${target}.`;
    case 'TOO_LONG':
      return `This number is too long${target}.`;
    case 'INVALID_LENGTH':
      return countryName
        ? `This number has a length that is not used in ${countryName}.`
        : 'This number has an invalid length.';
    case 'INVALID_COUNTRY':
      return 'This international calling code is not recognized.';
    case 'NOT_A_NUMBER':
      return 'Enter a phone number using digits.';
    default:
      return null;
  }
}

export function normalizeNumberForDestination(opts: {
  raw: string;
  destination: Country;
  countries: Country[];
}): NormalizedPhoneNumber {
  const input = stripFormatting(removeOptionalZeroMarker(opts.raw));
  const isInternationalInput = input.startsWith('+');

  if (!input || input === '+') {
    return emptyResult(isInternationalInput, 'Enter a phone number.');
  }

  const lengthIssue = validatePhoneNumberLength(
    input,
    opts.destination.iso2.toUpperCase() as CountryCode,
  );

  const parsed = isInternationalInput
    ? parsePhoneNumberFromString(input)
    : parsePhoneNumberFromString(
        input,
        opts.destination.iso2.toUpperCase() as CountryCode,
      );

  if (!parsed) {
    const specificWarning = lengthWarning(
      lengthIssue,
      isInternationalInput ? undefined : opts.destination.name,
    );
    return emptyResult(
      isInternationalInput,
      specificWarning ?? (isInternationalInput
        ? 'This is not a recognized international phone number.'
        : `This is not a recognized phone number for ${opts.destination.name}.`),
    );
  }

  const parsedDestination = countryFromPhoneNumber(
    parsed,
    opts.countries,
    opts.destination,
  );
  const warnings: string[] = [];

  if (!parsed.isPossible()) {
    warnings.push(
      lengthWarning(lengthIssue, parsedDestination.name)
        ?? `This number has an invalid length for ${parsedDestination.name}.`,
    );
  } else if (!parsed.isValid()) {
    warnings.push(`This number is not valid for ${parsedDestination.name}.`);
  }

  if (!isInternationalInput) {
    const entered = input.replace(/\D/g, '');
    if (
      entered.startsWith('0') &&
      !parsed.nationalNumber.startsWith('0') &&
      entered !== parsed.nationalNumber
    ) {
      warnings.push(
        'Removed the national dialing prefix for international dialing.',
      );
    }
  }

  if (!parsed.isPossible() || !parsed.isValid()) {
    return {
      ...emptyResult(isInternationalInput, warnings[0]),
      destinationIso2: parsedDestination.iso2,
      destinationName: parsedDestination.name,
      countryCallingCode: parsed.countryCallingCode,
      warnings,
    };
  }

  return {
    e164: parsed.number,
    internationalDisplay: parsed.formatInternational(),
    nationalDisplay: parsed.formatNational(),
    nationalNumberDigits: parsed.nationalNumber,
    countryCallingCode: parsed.countryCallingCode,
    destinationIso2: parsedDestination.iso2,
    destinationName: parsedDestination.name,
    isInternationalInput,
    warnings,
  };
}

export function buildDialStrings(opts: {
  originIso2: string;
  destinationIso2: string;
  rawNumber: string;
  countries: Country[];
  exitCodes: Record<string, string>;
}): DialStrings {
  const origin = findCountryByIso2(opts.countries, opts.originIso2);
  const destination = findCountryByIso2(
    opts.countries,
    opts.destinationIso2,
  );

  if (!origin || !destination) {
    return {
      ...emptyResult(
        false,
        'Choose both an origin and destination country.',
      ),
      legacy: null,
    };
  }

  const normalized = normalizeNumberForDestination({
    raw: opts.rawNumber,
    destination,
    countries: opts.countries,
  });
  const warnings = [...normalized.warnings];
  const exitCode = opts.exitCodes[origin.iso2];

  if (!exitCode && normalized.e164) {
    warnings.push(
      `No exit code (IDD prefix) is configured for ${origin.name} yet.`,
    );
  }

  const legacy =
    exitCode &&
    normalized.countryCallingCode &&
    normalized.nationalNumberDigits
      ? `${exitCode} ${normalized.countryCallingCode} ${normalized.nationalNumberDigits}`
      : null;

  return { ...normalized, legacy, warnings };
}

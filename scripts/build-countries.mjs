import fs from 'node:fs/promises';
import path from 'node:path';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json' with { type: 'json' };
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';

countries.registerLocale(enLocale);

const OUT = path.join(process.cwd(), 'src', 'data', 'countries.generated.json');
const CURATED = path.join(process.cwd(), 'src', 'data', 'countries.json');

const iso2s = getCountries();
const curatedRows = JSON.parse(await fs.readFile(CURATED, 'utf8'));
const curatedByIso2 = new Map(curatedRows.map((country) => [country.iso2, country]));

const rows = [];
for (const iso2 of iso2s) {
  const name = countries.getName(iso2, 'en') || iso2;
  let callingCode = null;
  try {
    callingCode = String(getCountryCallingCode(iso2));
  } catch {
    callingCode = null;
  }
  if (!callingCode) continue;

  const curated = curatedByIso2.get(iso2) ?? {};
  rows.push({
    name,
    iso2,
    callingCode,
    trunkPrefix: null,
    ...curated,
  });
}

rows.sort((a, b) => a.name.localeCompare(b.name));
await fs.writeFile(OUT, JSON.stringify(rows, null, 2) + '\n', 'utf8');
console.log(`[build-countries] wrote ${rows.length} rows -> ${OUT}`);

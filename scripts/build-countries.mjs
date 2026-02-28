import fs from 'node:fs/promises';
import path from 'node:path';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json' with { type: 'json' };
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';

countries.registerLocale(enLocale);

const OUT = path.join(process.cwd(), 'src', 'data', 'countries.generated.json');

const iso2s = getCountries();

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

  rows.push({
    name,
    iso2,
    callingCode,
    trunkPrefix: null,
  });
}

rows.sort((a, b) => a.name.localeCompare(b.name));
await fs.writeFile(OUT, JSON.stringify(rows, null, 2) + '\n', 'utf8');
console.log(`[build-countries] wrote ${rows.length} rows -> ${OUT}`);

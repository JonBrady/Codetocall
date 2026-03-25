import fs from 'node:fs/promises';
import path from 'node:path';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json' with { type: 'json' };
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import curatedCountries from '../src/data/countries.json' with { type: 'json' };

countries.registerLocale(enLocale);

const OUT = path.join(process.cwd(), 'src', 'data', 'countries.generated.json');

const curatedByIso2 = new Map(curatedCountries.map((c) => [String(c.iso2).toUpperCase(), c]));

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

  // Enrich with curated fields where we have higher-quality, hand-checked data.
  const curated = curatedByIso2.get(String(iso2).toUpperCase());

  const row = {
    name,
    iso2,
    callingCode,
    trunkPrefix: curated?.trunkPrefix ?? null,
    ...(curated?.examples ? { examples: curated.examples } : {}),
    ...(curated?.notes ? { notes: curated.notes } : {}),
  };

  rows.push(row);
}

rows.sort((a, b) => a.name.localeCompare(b.name));
await fs.writeFile(OUT, JSON.stringify(rows, null, 2) + '\n', 'utf8');
console.log(`[build-countries] wrote ${rows.length} rows -> ${OUT}`);

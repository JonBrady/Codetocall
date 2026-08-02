import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const curated = JSON.parse(
  readFileSync(new URL('../src/data/countries.json', import.meta.url), 'utf8'),
);
const generated = JSON.parse(
  readFileSync(new URL('../src/data/countries.generated.json', import.meta.url), 'utf8'),
);
const generatedByIso2 = new Map(generated.map((country) => [country.iso2, country]));

test('generated country data preserves every curated field', () => {
  for (const country of curated) {
    const generatedCountry = generatedByIso2.get(country.iso2);
    assert.ok(generatedCountry, `${country.iso2} should exist in generated data`);
    for (const [field, value] of Object.entries(country)) {
      assert.deepEqual(generatedCountry[field], value, `${country.iso2}.${field}`);
    }
  }
});
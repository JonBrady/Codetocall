import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildDialStrings,
  normalizeNumberForDestination,
} from '../src/lib/dialing.ts';

const countries = [
  { name: 'Australia', iso2: 'AU', callingCode: '61', trunkPrefix: '0' },
  { name: 'Canada', iso2: 'CA', callingCode: '1', trunkPrefix: '1' },
  { name: 'France', iso2: 'FR', callingCode: '33', trunkPrefix: '0' },
  { name: 'Germany', iso2: 'DE', callingCode: '49', trunkPrefix: '0' },
  { name: 'India', iso2: 'IN', callingCode: '91', trunkPrefix: '0' },
  { name: 'Italy', iso2: 'IT', callingCode: '39', trunkPrefix: '0' },
  { name: 'United Kingdom', iso2: 'GB', callingCode: '44', trunkPrefix: '0' },
  { name: 'United States', iso2: 'US', callingCode: '1', trunkPrefix: '1' },
];

const exitCodes = {
  AU: '0011',
  DE: '00',
  GB: '00',
  IN: '00',
  IT: '00',
  US: '011',
};

function build(originIso2, destinationIso2, rawNumber, codes = exitCodes) {
  return buildDialStrings({
    originIso2,
    destinationIso2,
    rawNumber,
    countries,
    exitCodes: codes,
  });
}

test('formats a UK national number when calling from the US', () => {
  const result = build('US', 'GB', '020 7123 4567');
  assert.equal(result.e164, '+442071234567');
  assert.equal(result.internationalDisplay, '+44 20 7123 4567');
  assert.equal(result.legacy, '011 44 2071234567');
  assert.match(result.warnings.join(' '), /Removed/);
});

test('formats a US national number when calling from the UK', () => {
  const result = build('GB', 'US', '(415) 555-2671');
  assert.equal(result.e164, '+14155552671');
  assert.equal(result.internationalDisplay, '+1 415 555 2671');
  assert.equal(result.legacy, '00 1 4155552671');
});

test('formats a German national number when calling from Australia', () => {
  const result = build('AU', 'DE', '030 901820');
  assert.equal(result.e164, '+4930901820');
  assert.equal(result.legacy, '0011 49 30901820');
});

test('preserves Italy significant leading zero', () => {
  const result = build('GB', 'IT', '06 6982');
  assert.equal(result.e164, '+39066982');
  assert.equal(result.legacy, '00 39 066982');
  assert.doesNotMatch(result.warnings.join(' '), /Removed/);
});

test('an international number overrides a stale destination selection', () => {
  const result = build('US', 'GB', '+33 1 42 68 53 00');
  assert.equal(result.e164, '+33142685300');
  assert.equal(result.destinationIso2, 'FR');
  assert.equal(result.legacy, '011 33 142685300');
});

test('accepts the common optional zero marker', () => {
  const result = normalizeNumberForDestination({
    raw: '+44 (0)20 7123 4567',
    destination: countries.find((country) => country.iso2 === 'GB'),
    countries,
  });
  assert.equal(result.e164, '+442071234567');
});

test('formats an Indian mobile number', () => {
  const result = build('GB', 'IN', '098765 43210');
  assert.equal(result.e164, '+919876543210');
  assert.equal(result.legacy, '00 91 9876543210');
});

test('does not make invalid input dialable', () => {
  const result = build('US', 'GB', '123');
  assert.equal(result.e164, null);
  assert.equal(result.legacy, null);
  assert.match(result.warnings.join(' '), /impossible length|not valid/);
});

test('does not guess an unconfigured exit code', () => {
  const result = build('CA', 'GB', '020 7123 4567');
  assert.equal(result.e164, '+442071234567');
  assert.equal(result.legacy, null);
  assert.match(result.warnings.join(' '), /No exit code/);
});

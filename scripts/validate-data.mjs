import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const countriesPath = await (async () => {
  const gen = path.join(root, 'src', 'data', 'countries.generated.json');
  const legacy = path.join(root, 'src', 'data', 'countries.json');
  try {
    await fs.access(gen);
    return gen;
  } catch {
    return legacy;
  }
})();
const exitCodesPath = path.join(root, 'src', 'data', 'exitCodes.json');

function die(msg) {
  console.error(`\n[validate-data] ${msg}`);
  process.exit(1);
}

const countries = JSON.parse(await fs.readFile(countriesPath, 'utf8'));
const exitCodes = JSON.parse(await fs.readFile(exitCodesPath, 'utf8'));

if (!Array.isArray(countries) || countries.length === 0) die('countries.json must be a non-empty array');

const iso2Set = new Set();
for (const c of countries) {
  if (!c.iso2 || typeof c.iso2 !== 'string') die(`country missing iso2: ${JSON.stringify(c)}`);
  const iso2 = c.iso2.toUpperCase();
  if (iso2 !== c.iso2) die(`iso2 must be uppercase: ${c.iso2}`);
  if (iso2Set.has(iso2)) die(`duplicate iso2: ${iso2}`);
  iso2Set.add(iso2);

  if (!c.name || typeof c.name !== 'string') die(`country ${iso2} missing name`);
  if (!c.callingCode || typeof c.callingCode !== 'string') die(`country ${iso2} missing callingCode`);
  if (!/^[0-9]+$/.test(c.callingCode)) die(`country ${iso2} callingCode must be digits only`);

  if (c.trunkPrefix !== null && c.trunkPrefix !== undefined) {
    if (typeof c.trunkPrefix !== 'string' || !/^[0-9]+$/.test(c.trunkPrefix)) {
      die(`country ${iso2} trunkPrefix must be digits only string or null`);
    }
  }
}

for (const [iso2, exit] of Object.entries(exitCodes)) {
  if (!iso2Set.has(iso2)) die(`exitCodes contains unknown iso2: ${iso2}`);
  if (typeof exit !== 'string' || !/^[0-9]+$/.test(exit)) die(`exitCodes ${iso2} must be digits only string`);
}

console.log(`[validate-data] OK (${countries.length} countries)`);

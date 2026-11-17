import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
export function validateEntries(entries) {
  if (!Array.isArray(entries) || entries.length > 500) throw Error('Use an array with at most 500 Sadhviji entries.');
  return entries.map((entry,index) => {
    if (!entry || typeof entry !== 'object' || Object.keys(entry).sort().join(',') !== 'address,name') throw Error(`Entry ${index+1}: use only name and address.`);
    if (typeof entry.name !== 'string' || !entry.name.trim() || entry.name.length > 160) throw Error(`Entry ${index+1}: Name is required, up to 160 characters.`);
    if (typeof entry.address !== 'string' || !entry.address.trim() || entry.address.length > 2000) throw Error(`Entry ${index+1}: Address is required, up to 2,000 characters.`);
    return {name:entry.name.trim(),address:entry.address.trim()};
  });
}
export function validateSuvichar(text) {
  if (text.length > 4000) throw Error('Suvichar must be at most 4,000 characters.');
  return text.trim();
}
export async function build(root = resolve(fileURLToPath(new URL('..',import.meta.url))), env = process.env) {
  const raw = await readFile(resolve(root,'data/sadhviji.json'),'utf8');
  if (Buffer.byteLength(raw) > 1000000) throw Error('Directory must be smaller than 1 MB.');
  const entries = validateEntries(JSON.parse(raw));
  const thought = validateSuvichar(await readFile(resolve(root,'data/suvichar.txt'),'utf8'));
  const repository = env.GITHUB_REPOSITORY || '';
  if (repository && !/^[\w.-]+\/[\w.-]+$/.test(repository)) throw Error('Invalid GitHub repository name.');
  await mkdir(resolve(root,'public/data'),{recursive:true});
  await writeFile(resolve(root,'public/data/sadhviji.json'),JSON.stringify(entries,null,2)+'\n');
  await writeFile(resolve(root,'public/data/suvichar.txt'),thought);
  const config = {repository,branch:env.GITHUB_REF_NAME || 'main'};
  await writeFile(resolve(root,'public/config.js'),'// Public repository links only. No credentials.\nwindow.SITE_CONFIG = '+JSON.stringify(config)+';\n');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {await build();console.log('Validated and prepared public/ for GitHub Pages.');}
  catch(error) {console.error(error.message);process.exitCode=1;}
}

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build,validateEntries,validateSuvichar} from '../scripts/build.mjs';
test('validates required location fields and supports multilingual content',()=>{
 assert.deepEqual(validateEntries([{name:' નામ ',address:' સરનામું\nAddress '}]),[{name:'નામ',address:'સરનામું\nAddress'}]);
 for(const entries of [null,[{}],[{name:'A',address:''}],[{name:'A',address:'B',extra:'C'}],[{name:42,address:'B'}],[{name:'A'.repeat(161),address:'B'}],[{name:'A',address:'B'.repeat(2001)}],Array(501).fill({name:'A',address:'B'})]) assert.throws(()=>validateEntries(entries));
});
test('Suvichar allows plain text, newlines, and empty content',()=>{
 assert.equal(validateSuvichar('  सुविचार\nવિચાર  '),'सुविचार\nવિચાર');
 assert.equal(validateSuvichar('   '),'');assert.throws(()=>validateSuvichar('A'.repeat(4001)));
});
test('build publishes validated data and correct repository links; invalid data leaves prior output intact',async(t)=>{
 const root=await mkdtemp(join(tmpdir(),'sadhviji-')); t.after(()=>rm(root,{recursive:true,force:true}));
 await mkdir(join(root,'data'));await mkdir(join(root,'public'));
 await writeFile(join(root,'data/sadhviji.json'),'[{"name":"A","address":"B"}]');
 await writeFile(join(root,'data/suvichar.txt'),'A kind thought.');
 await build(root,{GITHUB_REPOSITORY:'owner/directory',GITHUB_REF_NAME:'main'});
 assert.deepEqual(JSON.parse(await readFile(join(root,'public/data/sadhviji.json'),'utf8')),[{name:'A',address:'B'}]);
 assert.equal(await readFile(join(root,'public/data/suvichar.txt'),'utf8'),'A kind thought.');
 assert.match(await readFile(join(root,'public/config.js'),'utf8'),/"repository":"owner\/directory","branch":"main"/);
 await writeFile(join(root,'data/sadhviji.json'),'invalid JSON');await assert.rejects(build(root,{}));
 assert.deepEqual(JSON.parse(await readFile(join(root,'public/data/sadhviji.json'),'utf8')),[{name:'A',address:'B'}]);
});

const fs = require('fs');
const path = require('path');


function copyDir(src, dest) {
if (!fs.existsSync(src)) return;
fs.mkdirSync(dest, { recursive: true });
for (const entry of fs.readdirSync(src)) {
const s = path.join(src, entry);
const d = path.join(dest, entry);
const stat = fs.statSync(s);
if (stat.isDirectory()) copyDir(s, d);
else fs.copyFileSync(s, d);
}
}


const net = process.env.DFX_NETWORK || 'local';
const src = path.join('.dfx', net, 'canisters', 'finsense_backend');
const dst = path.join('src', 'declarations', 'finsense_backend');
copyDir(src, dst);
console.log(`[icp] Copied declarations ${src} -> ${dst}`);
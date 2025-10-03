const fs = require('fs');
const path = require('path');


const net = process.env.DFX_NETWORK || 'local';
const from = path.join('.dfx', net, 'canister_ids.json');
const to = path.join('src', 'canister_ids.json');
fs.mkdirSync('src', { recursive: true });
fs.copyFileSync(from, to);
console.log(`[icp] Copied ${from} -> ${to}`);
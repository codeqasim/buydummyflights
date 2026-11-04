// `npm run ship -- "message"`: RUN THE CHECKS, THEN COMMIT AND PUSH TO main. NEVER FORCE-PUSHES.
import { execFileSync } from 'node:child_process'
const msg = process.argv.slice(2).join(' ').trim()
if (!msg) { console.error('usage: npm run ship -- "commit message"'); process.exit(1) }
const sh = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' })
sh('npm', ['run', 'build:assets'])
sh('npm', ['run', 'check'])
sh('git', ['add', '-A'])
sh('git', ['commit', '-m', msg])
sh('git', ['push', 'origin', 'main'])

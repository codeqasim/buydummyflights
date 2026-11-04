// LOCAL DEV: BUILD ASSETS, THEN wrangler dev AS THE PREVIEW ENV ON :8788 (ALWAYS noindex).
import { spawn } from 'node:child_process'
const args = ['wrangler', 'dev', '--env', 'preview', '--port', '8788', '--ip', '127.0.0.1']
const child = spawn('npx', args, { stdio: 'inherit' })
child.on('exit', (code) => process.exit(code ?? 0))

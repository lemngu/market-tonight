import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import { mkdir, access, constants } from 'node:fs/promises'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const origin=process.env.AUTH_URL || process.env.RENDER_EXTERNAL_URL
if(!origin || new URL(origin).protocol!=='https:') throw new Error('Set AUTH_URL to the production HTTPS origin.')
for(const key of ['AUTH_SECRET','AUTH_GOOGLE_ID','AUTH_GOOGLE_SECRET','ADMIN_EMAIL','MARKET_DATA_DIRECTORY']) if(!process.env[key]) throw new Error('Missing production setting: '+key)
process.env.AUTH_URL=new URL(origin).origin
process.env.AUTH_TRUST_HOST='true'
process.env.HOSTNAME='0.0.0.0'
process.env.PORT ||= '3000'
if(!path.isAbsolute(process.env.MARKET_DATA_DIRECTORY)) throw new Error('MARKET_DATA_DIRECTORY must be an absolute persistent disk path.')
await mkdir(process.env.MARKET_DATA_DIRECTORY,{recursive:true})
await access(process.env.MARKET_DATA_DIRECTORY,constants.W_OK)
process.chdir(path.join(root,'.next/standalone'))
await import(pathToFileURL(path.join(process.cwd(),'server.js')).href)

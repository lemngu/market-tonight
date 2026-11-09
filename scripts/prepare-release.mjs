import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
const root=process.cwd(),source=path.resolve(root,'.pages-build/out'),target=path.resolve(root,'docs')
const build=spawnSync(process.execPath,['scripts/export-pages.mjs'],{stdio:'inherit',env:{...process.env,MARKET_ENABLE_STORE_FEED:'1',PAGES_BASE_PATH:'',PAGES_ORIGIN:'https://market-tonight.vercel.app'}})
if(build.status!==0)process.exit(build.status||1)
if(path.dirname(target)!==root||path.basename(target)!=='docs')throw Error('Unexpected output directory')
await fs.access(path.join(source,'index.html'))
await fs.mkdir(path.join(root,'backup'),{recursive:true})
try{await fs.cp(target,path.join(root,'backup','docs-'+Date.now()),{recursive:true})}catch(e){if(e.code!=='ENOENT')throw e}
await fs.rm(target,{recursive:true,force:true});await fs.cp(source,target,{recursive:true})
console.log('Release docs prepared. Nothing was committed, pushed, or deployed. Review git diff before publishing.')

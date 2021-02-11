const nodemon = require('nodemon')
const micromatch = require('micromatch')
const map = require('../package.json')['lint-staged']
const { spawn } = require('child_process')

/*
  script to allow automatic running of commands for changed files

  nodemon is used to monitor for changes to files with the specified extentions
  when a change is found, the lint-staged config in package.json is consulted
  and any appropriate scripts are run with the changed file path

  TODO:
    - this could be an installed module
    - nice interface - getopts
    - .monmap.js module for handling absolute path transformations eg for jest
    - ext list from map
    - typescript
    - tests
    - ignore list - from .gitignore
*/

const cache = new Map()
const cacheTime = 5000

async function exec (command, args) {
  console.log(`[monmap] -> executing "${command} ${args.join(' ')}"`)
  return new Promise((resolve, reject) => {
    const process = spawn(command, args)
      .on('close', resolve)
      .on('error', reject)
    process.stdout.on('data', data => { console.log(data.toString()) })
    process.stderr.on('data', data => { console.error(data.toString()) })
  })
}

async function handleFileChange (file) {
  const now = Date.now()
  const cachedAt = cache.get(file)
  if (!cachedAt || now - cachedAt > cacheTime) {
    cache.set(file, now)
    console.log(`[monmap] - "${file}"`)
    const filename = file.split('/').pop()
    const rules = Object.entries(map)
    while (rules.length > 0) {
      const [pattern, command] = rules.shift()
      if (micromatch.isMatch(filename, pattern)) {
        const parts = command.split(' ')
        await exec(parts.shift(), [...parts, file])
      }
    }
    console.log('[monmap] - done')
  }
}

nodemon({
  exec: ':',
  ext: 'md,json,js,ts,jsx,tsx'
}).on('restart', async files => {
  while (files.length > 0) {
    await handleFileChange(files.shift())
  }
})

console.log(`
=                   _   =
=   |V| _  _ |V| _ |_)  =
=   | |(_)| || |(_||    =
=                       =

ready to map:

${JSON.stringify(map, null, 2)}

watching for file changes...

`)

const exitHandler = code => {
  process.exit(0)
}

process.on('exit', exitHandler)
process.on('SIGINT', exitHandler)

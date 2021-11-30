const core = require("@actions/core")
const glob = require("glob")
const fs = require("fs")
const readline = require("readline")
const gh = require("@actions/github")

const src = core.getInput('path')
const string = core.getInput('string')

glob(src, async (error, res) => {
  if (error) {
    core.setFailed(err)
  } else {
    res.forEach(file => {
      getFirstLine(file).then((ln) => {
        if(ln != string) core.setFailed(`${gh.context.job} failed!: File ${file} does not contains the right copyright information!`)
      })
    })
  }
})

var getFirstLine = async (pathToFile) => {

  const readable = fs.createReadStream(pathToFile)
  const reader = readline.createInterface({ input: readable })

  const line = await new Promise((resolve) => {
    reader.on('line', (line) => {
      reader.close()
      resolve(line)
    })
  })

  readable.close()
  return line;

}
import { getInput, setFailed } from "@actions/core";
import glob from "glob"
import fs from 'fs'
import readline from 'readline'
import { context } from "@actions/github/lib/utils";

const src = getInput('path')
const string = getInput('string')

glob(src, async (error, res) => {
  if (error) {
    setFailed(err)
  } else {
    res.forEach(file => {
      getFirstLine(file).then((ln) => {
        if(ln != string) setFailed(`${context.job} failed!: File ${file} does not contains the right copyright information!`)
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
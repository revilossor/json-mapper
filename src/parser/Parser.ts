import { readFileSync } from 'fs'
import { resolve } from 'path'
import { generate, Parser as PEGParser } from 'pegjs'
import { AST, Mapping } from '../types'

export class Parser {
  private readonly peg: PEGParser

  public constructor () {
    const path = resolve(__dirname, './grammar.pegjs')
    const source = readFileSync(path).toString()

    this.peg = generate(source)
  }

  public parse (mapping: Mapping): AST {
    try {
      return this.peg.parse(mapping)
    } catch (e) {
      throw new Error(`ParseError: ${e.message as string}`)
    }
  }
}

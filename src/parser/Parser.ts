import grammar from './grammar'
import { generate, Parser as PEGParser } from 'pegjs'
import { AST, Mapping } from '../types'

export class Parser {
  private readonly peg: PEGParser

  public constructor () {
    this.peg = generate(grammar)
  }

  public parse (mapping: Mapping): AST {
    try {
      return this.peg.parse(mapping)
    } catch (e) {
      throw new Error(`ParseError: ${e.message as string}`)
    }
  }
}

import grammar from './grammar'
import { generate, Parser as PEGParser } from 'pegjs'
import { AST } from '../types'

export class Parser<A> {
  private readonly peg: PEGParser

  public constructor () {
    this.peg = generate(grammar)
  }

  public parse (input: A): AST {
    try {
      return this.peg.parse(
        JSON.stringify(input)
      )
    } catch (e) {
      throw new Error(`ParseError: ${e.message as string}`)
    }
  }
}

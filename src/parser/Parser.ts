import grammar from './grammar'
import { generate, Parser as PEGParser } from 'pegjs'

export class Parser<A, B> {
  private readonly peg: PEGParser

  public constructor () {
    this.peg = generate(grammar)
  }

  public parse (input: A): B {
    try {
      return this.peg.parse(
        JSON.stringify(input)
      )
    } catch (e) {
      throw new Error(`ParseError: ${e.message as string}`)
    }
  }
}

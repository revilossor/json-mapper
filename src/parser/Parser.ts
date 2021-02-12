import { default as grammar } from './grammar'
import { generate } from 'pegjs'

export class Parser {
  private readonly peg

  public constructor () {
    console.dir({ grammar })
    this.peg = generate(grammar)
  }
}

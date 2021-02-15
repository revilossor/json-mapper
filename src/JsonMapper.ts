import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Parser } from './parser'
import { Processor } from './processor'

const parser = new Parser()

export class JsonMapper<I, O> {
  private readonly processor: Processor<I, O>

  private constructor (mapping: string) {
    const parsed = parser.parse(mapping)
    this.processor = new Processor<I, O>(parsed.tree)
  }

  public map (input: I): O {
    return this.processor.process(input)
  }

  public static fromPath<I, O> (path: string): JsonMapper<I, O> {
    const mapping = readFileSync(resolve(path)).toString()
    return new JsonMapper(mapping)
  }

  // TODO from syntax
}

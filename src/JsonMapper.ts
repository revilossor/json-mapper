import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Parser } from './parser'
import { Processor } from './processor'
import { json } from './types'

const parser = new Parser()

export class JsonMapper<I, O> {
  private readonly processor: Processor<I, O>

  private constructor (mapping: string, private readonly global: json) {
    const parsed = parser.parse(mapping)
    this.processor = new Processor<I, O>(parsed.tree)
  }

  public map (input: I): O {
    return this.processor.process(input, this.global)
  }

  public static fromPath<I, O> (path: string, global: json = {}): JsonMapper<I, O> {
    const mapping = readFileSync(resolve(path)).toString()
    return JsonMapper.fromString<I, O>(mapping, global)
  }

  public static fromString<I, O> (mapping: string, global: json = {}): JsonMapper<I, O> {
    try {
      return new JsonMapper<I, O>(mapping, global)
    } catch (error) {
      const message: string = error.message
      throw new Error(`Error initialising JsonMapper: ${message}`)
    }
  }
}

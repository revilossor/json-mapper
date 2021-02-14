import { Processor } from '../../../src/processor'
import { ASTRule } from '../../../src/types'

describe('Given a Processor for a syntax tree', () => {
  interface Input {
    one?: string
    two?: string
    three?: string
    additional?: string
  }
  describe('When the mapping copies properies on the top level', () => {
    interface Output {
      one?: string
      two?: string
      three?: string
    }
    const tree: ASTRule[] = [
      { key: 'one', required: false },
      { key: 'two', required: false },
      { key: 'three', required: false }
    ]

    it('Then the result contains the expected properties', () => {
      const processor = new Processor<Input, Output>(tree)
      const input = {
        one: '1', two: '2', three: '3', additional: 'stuff'
      }
      expect(processor.process(input)).toEqual({
        one: input.one,
        two: input.two,
        three: input.three
      })
    })
  })
  describe('When the mapping copies top level properies to a nested property', () => {
    interface Output {
      one?: string
      additional?: {
        three?: string
        additional?: string
      }
    }
    const tree: ASTRule[] = [
      { key: 'one', required: false },
      {
        key: 'additional',
        required: false,
        tree: [
          { key: 'three', required: false },
          { key: 'additional', required: false }
        ]
      }
    ]

    it('Then the result contains the expected properties', () => {
      const processor = new Processor<Input, Output>(tree)
      const input = {
        one: '1', two: '2', three: '3', additional: 'stuff'
      }
      expect(processor.process(input)).toEqual({
        one: input.one,
        additional: {
          three: input.three,
          additional: input.additional
        }
      })
    })
  })
  describe('When the mapping copies a literal value to the top level', () => {
    interface Output {
      one?: string
      two?: string
      three?: string
    }
    const tree: ASTRule[] = [
      { key: 'one', required: false },
      { key: 'two', required: false, literal: 'the number two' },
      { key: 'three', required: false, literal: 'the number three' }
    ]

    it('Then the result contains the expected properties', () => {
      const processor = new Processor<Input, Output>(tree)
      const input = { one: '1' }
      expect(processor.process(input)).toEqual({
        one: input.one,
        two: 'the number two',
        three: 'the number three'
      })
    })
  })
  describe('When the mapping copies a literal value to a nested property', () => {
    interface Output {
      some?: {
        nested?: {
          value?: {
            one: string
          }
        }
      }
    }
    const tree: ASTRule[] = [
      {
        key: 'some',
        required: false,
        tree: [
          {
            key: 'nested',
            required: false,
            tree: [{
              key: 'value',
              required: false,
              tree: [{
                key: 'one',
                required: false
              }]
            }]
          }
        ]
      }
    ]

    it('Then the result contains the expected properties', () => {
      const processor = new Processor<Input, Output>(tree)
      const input = { one: '1' }
      expect(processor.process(input)).toEqual({
        some: { nested: { value: { one: input.one } } }
      })
    })
  })
  // TODO test literal overrides tree
  // TODO required
  // TODO query
  // TODO mapping on query
  // TODO root - parser too ( everything root cept in mapping on quuery )
})

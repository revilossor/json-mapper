import { Processor } from '../../../src/processor'
import { ASTRule } from '../../../src/types'

describe('Given a Processor for a syntax tree', () => {
  describe('When the mapping copies properies on the top level', () => {
    interface Input {
      one: string
      two: string
      three: string
      additional: string
    }
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
    interface Input {
      one: string
      two: string
      three: string
      additional: string
    }
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
})

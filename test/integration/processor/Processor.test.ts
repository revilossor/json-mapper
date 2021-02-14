import { Processor } from '../../../src/processor'
import { ASTRule } from '../../../src/types'

describe('Given a Processor for a syntax tree', () => {
  describe('When the mapping copies top level properies', () => {
    interface Input {
      one: string
      two: string
      three: string
      additional: string
    }
    interface Output {
      one: string
      two: string
      three: string
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
        one: '1',
        two: '2',
        three: '3'
      })
    })
  })
})

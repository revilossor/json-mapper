import { Processor } from '../../../src/processor'
import { ASTRule } from '../../../src/types'
import { value } from 'jsonpath'

jest.mock('jsonpath')

describe('Given a Processor for a syntax tree that contains a top level query', () => {
  interface Input { key: string }
  interface Output { key: string }

  const query = 'some query'

  const tree: ASTRule[] = [{ key: 'some key', required: false, query }]

  let processor: Processor<Input, Output>

  beforeAll(() => {
    processor = new Processor<Input, Output>(tree)
  })

  describe('When I process an input', () => {
    it('Then the query is made againnst the input', () => {
      const input = { key: 'the moon' }
      processor.process(input)
      expect(value).toHaveBeenCalledWith(
        input,
        query
      )
    })
  })
})

// TODO can have query rules on mappings..

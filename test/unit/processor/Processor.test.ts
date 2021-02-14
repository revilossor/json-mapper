import { depthFirstSearch } from '../../../src/lib'
import { Processor } from '../../../src/processor'
import { ASTRule } from '../../../src/types'

jest.mock('../../../src/lib')

describe('Given a Processor for a syntax tree', () => {
  interface Input { key: string }
  interface Output { key: string }
  const tree: ASTRule[] = [{ key: 'some syntax tree', required: false }]

  let processor: Processor<Input, Output>

  beforeAll(() => {
    processor = new Processor<Input, Output>(tree)
  })

  describe('When I process an input', () => {
    it('Then the syntax tree is traversed', () => {
      processor.process({ key: 'the moon' })
      expect(depthFirstSearch).toHaveBeenCalledWith(
        expect.any(Function),
        tree
      )
    })
  })
})

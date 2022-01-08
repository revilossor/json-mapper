import { Processor } from '../../../src/processor'
import { ASTRule } from '../../../src/types'
import { query, value } from 'jsonpath'

jest.mock('jsonpath')

const mockQuery = query as jest.Mock

describe('Given a Processor for a syntax tree', () => {
  interface Input { key: string }
  interface Output { key: string }

  const mappingQuery = 'some query'

  describe('When the tree contains a query', () => {
    describe('And there is no delisting', () => {
      // TODO other scopes
      it('When I process an input, then a jsonpath query is made against the input', () => {
        const tree: ASTRule[] = [{ key: 'some key', required: false, delist: false, query: mappingQuery, scope: 'root' }]
        const processor = new Processor<Input, Output>(tree)
        const input = { key: 'the moon' }
        processor.process(input)
        expect(query).toHaveBeenCalledWith(
          input,
          mappingQuery
        )
      })
    })
    describe('And the query is delisted', () => {
      it('When I process an input, then a jsonpath value is made against the input', () => {
        const tree: ASTRule[] = [{ key: 'some key', required: false, delist: true, query: mappingQuery, scope: 'root' }]
        const processor = new Processor<Input, Output>(tree)
        const input = { key: 'the moon' }
        processor.process(input)
        expect(value).toHaveBeenCalledWith(
          input,
          mappingQuery
        )
      })
    })
    describe('And a nested query is scoped to a parent query result', () => {
      it('Then the parent query is made against the input, and the nested query against the result', () => {
        const result = { some: 'query result' }
        mockQuery.mockReturnValueOnce(result)
        const nestedQuery = 'nestedQuery'
        const tree: ASTRule[] = [
          {
            key: 'some key',
            required: false,
            delist: false,
            query: mappingQuery,
            scope: 'root',
            tree: [{
              key: 'some nested key',
              required: false,
              delist: false,
              query: nestedQuery,
              scope: 'this'
            }]
          }
        ]
        const processor = new Processor<Input, Output>(tree)
        const input = { key: 'the moon' }
        processor.process(input)
        expect(query).toHaveBeenCalledWith(
          input,
          mappingQuery
        )
        expect(query).toHaveBeenCalledWith(
          result,
          nestedQuery
        )
      })
    })
  })
})

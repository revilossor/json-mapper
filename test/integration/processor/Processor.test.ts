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

    it('When some optional nested properties are missing, only those present are assigned', () => {
      const processor = new Processor<Input, Output>(tree)
      const input = {
        one: '1', two: '2', three: 'the number three'
      }
      expect(processor.process(input)).toEqual({
        one: input.one,
        additional: {
          three: input.three
        }
      })
    })

    it('When all optional nested properties are missing, an empty object is assigned', () => {
      const processor = new Processor<Input, Output>(tree)
      const input = {
        one: '1'
      }
      expect(processor.process(input)).toEqual({
        one: input.one,
        additional: {}
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
      { key: 'one', required: false, delist: false },
      { key: 'two', required: false, literal: 'the number two', delist: false },
      { key: 'three', required: false, literal: 'the number three', delist: false }
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
  describe('When the mapping contains multiple rules for the same key', () => {
    interface Output {
      one?: string
    }
    const tree: ASTRule[] = [
      { key: 'one', required: false, delist: false },
      { key: 'one', required: false, literal: 'the other one', delist: false }
    ]

    it('Then the result contains the last satisfied rule result for the key', () => {
      const processor = new Processor<Input, Output>(tree)
      const input = { one: '1' }
      expect(processor.process(input)).toEqual({
        one: 'the other one'
      })
    })
  })
  describe('When the mapping copies a literal value to a nested property', () => {
    interface Output {
      some?: {
        nested?: {
          value?: number
        }
      }
    }
    const tree: ASTRule[] = [
      {
        key: 'some',
        required: false,
        delist: false,
        tree: [
          {
            key: 'nested',
            required: false,
            delist: false,
            tree: [{
              key: 'value',
              required: false,
              delist: false,
              literal: 123
            }]
          }
        ]
      }
    ]

    it('Then the result contains the expected properties', () => {
      const processor = new Processor<Input, Output>(tree)
      const input = { one: '1' }
      expect(processor.process(input)).toEqual({
        some: { nested: { value: 123 } }
      })
    })
  })
  describe('When a mapping rule queries for a value', () => {
    describe('And the query has the delist flag', () => {
      interface Output {
        result?: string
      }
      const tree: ASTRule[] = [
        { key: 'result', required: false, query: '$.one', delist: true }
      ]

      it('Then the result contains the expected properties', () => {
        const processor = new Processor<Input, Output>(tree)
        const input = {
          one: '1', two: '2', three: '3', additional: 'stuff'
        }
        expect(processor.process(input)).toEqual({
          result: input.one
        })
      })
    })
    describe('And the query has bad syntax', () => {
      interface Output {
        result?: string
      }
      const tree: ASTRule[] = [
        { key: 'result', required: false, query: 'syntax error', delist: false }
      ]

      it('Then the process throws an error', () => {
        const processor = new Processor<Input, Output>(tree)
        const input = {
          one: '1', two: '2', three: '3', additional: 'stuff'
        }
        expect(() => processor.process(input)).toThrowError('syntax error')
      })
    })
    describe('And the query does not have the delist flag', () => {
      interface Output {
        result?: string
      }
      const tree: ASTRule[] = [
        { key: 'result', required: false, query: '$.*', delist: false }
      ]

      it('Then the result contains the list of results', () => {
        const processor = new Processor<Input, Output>(tree)
        const input = {
          one: '1', two: '2', three: '3', additional: 'stuff'
        }
        expect(processor.process(input)).toEqual({
          result: ['1', '2', '3', 'stuff']
        })
      })
    })
  })
  describe('When a mapping rule has a literal and a tree', () => {
    interface Output {
      one?: string
    }
    const tree: ASTRule[] = [
      {
        key: 'one',
        required: false,
        literal: 'override me',
        delist: false,
        tree: [
          {
            key: 'nested',
            required: false,
            delist: false,
            tree: [{
              key: 'value',
              required: false,
              delist: false,
              literal: 'blah'
            }]
          }
        ]
      }
    ]

    it('Then the tree overrides the literal', () => {
      const processor = new Processor<Input, Output>(tree)
      const input = { one: '1' }
      expect(processor.process(input)).toEqual({
        one: {
          nested: {
            value: 'blah'
          }
        }
      })
    })
  })
  describe('When a copy rule is required', () => {
    interface Output {
      one: string
    }
    const tree: ASTRule[] = [
      {
        key: 'one',
        required: true,
        delist: false
      }
    ]

    it('Then an error is thrown if the rule does not resolve a value', () => {
      const error = new Error('expected "$.one" to resolve a value')
      const processor = new Processor<Input, Output>(tree)
      expect(() => processor.process({ one: undefined })).toThrowError(error)
      expect(() => processor.process({ two: '2', three: '3' })).toThrowError(error)
    })
  })
  describe('When a copy rule is not required', () => {
    interface Output {
      one?: string
    }
    const tree: ASTRule[] = [
      {
        key: 'one',
        required: false,
        delist: false
      }
    ]

    it('Then the key is not assigned in the output if the property is not present in the input', () => {
      const processor = new Processor<Input, Output>(tree)
      expect(processor.process({ one: undefined })).toEqual({})
    })
  })
  describe('When a nested rule is required but the parent is not', () => {
    interface Output {
      nested?: {
        one: string
        two?: string
      }
    }
    const tree: ASTRule[] = [
      {
        key: 'nested',
        required: false,
        delist: false,
        tree: [{
          key: 'one',
          required: true,
          delist: false
        }, {
          key: 'two',
          required: false,
          delist: false
        }]
      }
    ]

    it('And all required properties are present, the resolved subtree is assigned', () => {
      const processor = new Processor<Input, Output>(tree)
      expect(processor.process({ one: 'one' })).toEqual({
        nested: {
          one: 'one'
        }
      })
    })
    it('And a required property is missing, nothing is assigned but no error is thrown', () => {
      const processor = new Processor<Input, Output>(tree)
      expect(processor.process({ two: 'two' })).toEqual({})
    })
  })
  describe('When a nested rule is required and the parent is also required', () => {
    interface Output {
      nested: {
        one: string
        two?: string
      }
    }
    const tree: ASTRule[] = [
      {
        key: 'nested',
        required: true,
        delist: false,
        tree: [{
          key: 'one',
          required: true,
          delist: false
        }, {
          key: 'two',
          required: false,
          delist: false
        }]
      }
    ]

    it('When all required properties are present, the resolved subtree is assigned', () => {
      const processor = new Processor<Input, Output>(tree)
      expect(processor.process({ one: 'one' })).toEqual({
        nested: {
          one: 'one'
        }
      })
    })
    it('When a required property is missing, an error is thrown', () => {
      const processor = new Processor<Input, Output>(tree)
      expect(() => processor.process({ two: 'two' })).toThrowError('expected "$.nested.one" to resolve a value')
    })
  })
  describe('When a deeply nested rule is required and all ancestors are required', () => {
    interface Output {
      deeply: {
        nested: {
          one: string
          two?: string
        }
      }
    }
    const tree: ASTRule[] = [
      {
        key: 'deeply',
        required: true,
        delist: false,
        tree: [{
          key: 'nested',
          delist: false,
          required: true,
          tree: [{
            key: 'one',
            required: true,
            delist: false
          }, {
            key: 'two',
            delist: false,
            required: false
          }]
        }]
      }
    ]

    it('When a required property is missing, an error is thrown', () => {
      const processor = new Processor<Input, Output>(tree)
      expect(() => processor.process({ two: 'two' })).toThrowError('expected "$.deeply.nested.one" to resolve a value')
    })
  })
  describe('When a deeply nested rule is required and its parent is too, but an ancestor is not', () => {
    interface Output {
      deeply: {
        nested?: {
          one: string
          two?: string
        }
      }
    }
    const tree: ASTRule[] = [
      {
        key: 'deeply',
        required: false,
        delist: false,
        tree: [{
          key: 'nested',
          required: true,
          delist: false,
          tree: [{
            key: 'one',
            delist: false,
            required: true
          }, {
            key: 'two',
            delist: false,
            required: false
          }]
        }]
      }
    ]

    it('When a required property is missing, no error is thrown and the ancestor is not assigned', () => {
      const processor = new Processor<Input, Output>(tree)
      expect(processor.process({ two: 'two' })).toEqual({})
    })
  })
  describe('When a query rule is required', () => {
    interface Output {
      one: string
    }
    const tree: ASTRule[] = [
      {
        key: 'one',
        query: '$.one',
        delist: true,
        required: true
      }
    ]

    it('Then an error is thrown if the rule does not resolve a value', () => {
      const error = new Error('expected "$.one" to resolve a value')
      const processor = new Processor<Input, Output>(tree)
      expect(() => processor.process({ one: undefined })).toThrowError(error)
      expect(() => processor.process({ two: '2', three: '3' })).toThrowError(error)
    })
  })
  describe('When a query rule is not required', () => {
    interface Output {
      one?: string
    }
    const tree: ASTRule[] = [
      {
        key: 'one',
        query: '$.one',
        delist: true,
        required: false
      }
    ]

    it('Then the key is not assigned in the output if the property is not present in the input', () => {
      const processor = new Processor<Input, Output>(tree)
      expect(processor.process({ one: undefined })).toEqual({})
    })
  })
  describe('When a query rule has the delist flag disabled', () => {
    interface Output {
      one: string
    }
    const tree: ASTRule[] = [
      {
        key: 'one',
        query: '$.one',
        required: true,
        delist: false
      }
    ]

    it('Then the rule will always resolve an array, so required is irrelavent', () => {
      const processor = new Processor<Input, Output>(tree)
      expect(() => processor.process({ one: undefined })).not.toThrow()
      expect(() => processor.process({ two: '2', three: '3' })).not.toThrow()
    })
  })
})

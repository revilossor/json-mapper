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

    it('When all optional nested properties are missing, nothing is assigned', () => {
      const processor = new Processor<Input, Output>(tree)
      const input = {
        one: '1'
      }
      expect(processor.process(input)).toEqual({
        one: input.one
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
          value?: number
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
              literal: 123 // TODO can the literals be numbers from the parser?
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
    describe('And the query returns a single result', () => {
      interface Output {
        result?: string
      }
      const tree: ASTRule[] = [
        { key: 'result', required: false, query: '$.one' }
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
    }) // TODO unit test query rule calls jp side effect
    describe('And the query has bad syntax', () => {
      interface Output {
        result?: string
      }
      const tree: ASTRule[] = [
        { key: 'result', required: false, query: 'syntax error' }
      ]

      it('Then the process throws an error', () => {
        const processor = new Processor<Input, Output>(tree)
        const input = {
          one: '1', two: '2', three: '3', additional: 'stuff'
        }
        expect(() => processor.process(input)).toThrowError('syntax error')
      })
    })
    // TODO no results, multiple results, what if the type is an array? required
  })
  describe('When a mapping rule has a literal and a tree', () => {
    interface Output {
      one?: string
    }
    const tree: ASTRule[] = [
      {
        key: 'one',
        required: false,
        literal: 'override',
        tree: [
          {
            key: 'nested',
            required: false,
            tree: [{
              key: 'value',
              required: false,
              literal: 'blah'
            }]
          }
        ]
      }
    ]

    it('Then the literal overrides the tree', () => {
      const processor = new Processor<Input, Output>(tree)
      const input = { one: '1' }
      expect(processor.process(input)).toEqual({
        one: 'override'
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
        required: true
      }
    ]

    it('Then an error is thrown if the rule does not resolve a value', () => {
      const error = new Error('expected "one" to resolve a value')
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
        required: false
      }
    ]

    it('Then the key is not assigned in the output if the property is not present in the input', () => {
      const processor = new Processor<Input, Output>(tree)
      expect(processor.process({ one: undefined })).toEqual({})
    })
  })
  describe('When a nesting rule is required', () => {
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
        tree: [{
          key: 'one',
          required: true
        }, {
          key: 'two',
          required: false
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
    it('If a required property is missing, nothing is assigned but no error is thrown', () => {
      const processor = new Processor<Input, Output>(tree)
      expect(processor.process({ two: 'two' })).toEqual({})
    })
  })

  // TODO mapping on query
  // TODO root - parser too ( everything root cept in mapping on quuery )
})

import { Parser, grammar } from '../../../src/parser'
import { generate as generateActual } from 'pegjs'
import { AST } from '../../../src/types'

const generate = generateActual as jest.Mock
const parse = jest.fn()

jest.mock('pegjs', () => ({
  generate: jest.fn()
}))

beforeAll(() => {
  generate.mockImplementation(() => ({ parse }))
})

describe('When I initialise a parser', () => {
  let parser: Parser

  beforeEach(() => {
    parser = new Parser()
  })

  it('Then the grammar is used to generate a parser', () => {
    expect(generate).toHaveBeenCalledWith(grammar)
  })

  describe('When I parse a mapping', () => {
    it('Then it is parsed by the generated parser and the result is returned', () => {
      const ast: AST = {
        rules: [
          { required: false }
        ]
      }
      parse.mockImplementationOnce(() => ast)
      const mapping = 'some mapping'
      const result = parser.parse(mapping)
      expect(parse).toHaveBeenCalledWith(mapping)
      expect(result).toEqual(ast)
    })
  })

  describe('When I parse something that is not valid', () => {
    it('Then an informative error is thrown', () => {
      const error = new Error('some parse error')
      parse.mockImplementationOnce(() => {
        throw error
      })
      expect(() => parser.parse('some mapping')).toThrow(`ParseError: ${error.message}`)
    })
  })
})

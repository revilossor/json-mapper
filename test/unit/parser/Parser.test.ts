import { Parser, grammar } from '../../../src/parser'
import { generate as generateActual } from 'pegjs'
import { AST } from '../../../src/types'

const generate = generateActual as jest.Mock
const parse = jest.fn()

jest.mock('pegjs', () => ({
  generate: jest.fn()
}))

interface Input {
  one: string
}

beforeAll(() => {
  generate.mockImplementation(() => ({ parse }))
})

describe('When I initialise a parser', () => {
  let parser: Parser<Input>

  beforeEach(() => {
    parser = new Parser()
  })

  it('Then the grammar is used to generate a parser', () => {
    expect(generate).toHaveBeenCalledWith(grammar)
  })

  describe('When I parse something', () => {
    it('Then the stringified input is parsed and the result returned', () => {
      const ast: AST = {
        rules: [
          { required: false }
        ]
      }
      parse.mockImplementationOnce(() => ast)
      const input = { one: '1' }
      const result = parser.parse(input)
      expect(parse).toHaveBeenCalledWith(JSON.stringify(input))
      expect(result).toEqual(ast)
    })
  })

  describe('When I parse something that is not valid', () => {
    it('Then an informative error is thrown', () => {
      const error = new Error('some parse error')
      parse.mockImplementationOnce(() => {
        throw error
      })
      expect(() => parser.parse({ one: '1' })).toThrow(`ParseError: ${error.message}`)
    })
  })
})

import { Parser, grammar } from '../../src/parser'
import { generate as generateActual } from 'pegjs'

const generate = generateActual as jest.Mock
const parse = jest.fn()

jest.mock('pegjs', () => ({
  generate: jest.fn()
}))

interface Input {
  one: string
}

interface Output {
  two: string
}

beforeAll(() => {
  generate.mockImplementation(() => ({ parse }))
})

describe('When I parse something', () => {
  let parser: Parser<Input, Output>

  beforeEach(() => {
    parser = new Parser()
  })

  it('Then the syntax is parsed with the parser grammar', () => {
    expect(generate).toHaveBeenCalledWith(grammar)
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

import { Parser, grammar } from '../../src/parser'
import { generate } from 'pegjs'

jest.mock('pegjs', () => ({
  generate: jest.fn()
}))

describe('When I parse something', () => {
  it('Then the syntax is parsed with the parser grammar', () => {
    new Parser() // eslint-disable-line no-new
    expect(generate).toHaveBeenCalledWith(grammar)
  })
})

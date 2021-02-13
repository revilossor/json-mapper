import { Parser } from '../../../src/parser'

let parser: Parser

beforeEach(() => {
  parser = new Parser()
})

describe('When I parse an empty mapping', () => {
  it('Then I get an empty object', () => {
    const mapping = ''

    expect(parser.parse(mapping)).toEqual({})
  })
})

// TODO trims name, ver, desc
describe('When I parse a mapping that just has a details line', () => {
  describe('And it is complete', () => {
    it('Then I get name, version and description in the result', () => {
      const mapping = 'test-mapping:0.0.0:a test mapping for integration tests'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0',
        description: 'a test mapping for integration tests'
      })
    })
  })
  describe('And it has no description', () => {
    it('Then I get name and version in the result', () => {
      const mapping = 'test-mapping:0.0.0'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0'
      })
    })
  })
  describe('And it has an empty description', () => {
    it('Then I get name and version in the result and description is an empty string', () => {
      const mapping = 'test-mapping:0.0.0:'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0',
        description: ''
      })
    })
  })
  describe('And it has no version or description', () => {
    it('Then I only get name in the result', () => {
      const mapping = 'test-mapping'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping'
      })
    })
  })
  describe('And it has an empty version and no description', () => {
    it('Then I get name in the result and version is an empty string', () => {
      const mapping = 'test-mapping:'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: ''
      })
    })
  })
  describe('And it is has whitespace (but not newlines) around delimeters', () => {
    it('Then the whitespace is trimmed', () => {
      const mapping = 'test-mapping : 0.0.0 : a test mapping for integration tests'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0',
        description: 'a test mapping for integration tests'
      })
    })
  })
})

describe('When I parse a mapping that is invalid, I get an informative error', () => {
  it('When the description line is weird', () => {
    expect(() => parser.parse('test-mapping::description'))
      .toThrowError('ParseError: Expected mapping details and rules but "t" found.')
    expect(() => parser.parse(':version'))
      .toThrowError('ParseError: Expected mapping details and rules but ":" found.')
    expect(() => parser.parse(':version:'))
      .toThrowError('ParseError: Expected mapping details and rules but ":" found.')
    expect(() => parser.parse('::'))
      .toThrowError('ParseError: Expected mapping details and rules but ":" found.')
    expect(() => parser.parse(':'))
      .toThrowError('ParseError: Expected mapping details and rules but ":" found.')
  })
})

import { Parser } from '../../../src/parser'

let parser: Parser

beforeEach(() => {
  parser = new Parser()
})

/**

TODO test this sort of thing

name:version:description
{
  key
  key:value
  key
}

that with required should be enough for MVP - then work on nested mapping

 */

describe('When I parse an empty mapping', () => {
  it('Then I get an empty tree', () => {
    expect(parser.parse('{}')).toEqual({ tree: [] })
    expect(parser.parse('\n{}')).toEqual({ tree: [] })
    expect(parser.parse('\n\n{\n\n}\n\n')).toEqual({ tree: [] })
    expect(parser.parse('name\n{}')).toEqual({ name: 'name', tree: [] })
    expect(parser.parse('\n\nname\n\n{\n\n}\n\n')).toEqual({ name: 'name', tree: [] })
    expect(parser.parse('name:version\n{}')).toEqual({ name: 'name', version: 'version', tree: [] })
    expect(parser.parse('name:version:description\n{}')).toEqual({ name: 'name', version: 'version', description: 'description', tree: [] })
  })
})

describe('When I parse a mapping with a details line', () => {
  describe('And it is complete', () => {
    it('Then I get name, version and description in the result', () => {
      const mapping = 'test-mapping:0.0.0:a test mapping for integration tests\t{}'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0',
        description: 'a test mapping for integration tests',
        tree: []
      })
    })
  })
  describe('And it has no description', () => {
    it('Then I get name and version in the result', () => {
      const mapping = 'test-mapping:0.0.0\t{}'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0',
        tree: []
      })
    })
  })
  describe('And it has an empty description', () => {
    it('Then I get name and version in the result and description is an empty string', () => {
      const mapping = 'test-mapping:0.0.0:\t{}'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0',
        description: '',
        tree: []
      })
    })
  })
  describe('And it has no version or description', () => {
    it('Then I only get name in the result', () => {
      const mapping = 'test-mapping\n{}'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        tree: []
      })
    })
  })
  describe('And it has an empty version and no description', () => {
    it('Then I get name in the result and version is an empty string', () => {
      const mapping = 'test-mapping:\n{}'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '',
        tree: []
      })
    })
  })
  describe('And it is has whitespace (but not newlines) around delimeters', () => {
    it('Then the whitespace is trimmed', () => {
      const mapping = 'test-mapping : 0.0.0 : a test mapping for integration tests\n{}'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0',
        description: 'a test mapping for integration tests',
        tree: []
      })
    })
  })
})

describe('When I parse a mapping that is invalid, I get an informative error', () => {
  it('When the description line is weird', () => {
    expect(() => parser.parse('test-mapping::description'))
      .toThrowError('ParseError: Expected mapping details and tree but "t" found.')
    expect(() => parser.parse(':version'))
      .toThrowError('ParseError: Expected mapping details and tree but ":" found.')
    expect(() => parser.parse(':version:'))
      .toThrowError('ParseError: Expected mapping details and tree but ":" found.')
    expect(() => parser.parse('::'))
      .toThrowError('ParseError: Expected mapping details and tree but ":" found.')
    expect(() => parser.parse(':'))
      .toThrowError('ParseError: Expected mapping details and tree but ":" found.')
  })
  it('When there is no mapping', () => {
    expect(() => parser.parse(''))
      .toThrowError('ParseError: Expected mapping details and tree but end of input found.')
    expect(() => parser.parse('name:version:description'))
      .toThrowError('ParseError: Expected mapping details and tree but "n" found.')
  })
})

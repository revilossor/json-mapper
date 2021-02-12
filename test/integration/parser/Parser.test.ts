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
  describe('And it has a name and a description, but no version', () => {
    it('Then I get name and description in the result, and no version', () => {
      const mapping = 'test-mapping::description'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        description: 'description'
      })
    })
  })

  // with invalid details - :blah:blah
})

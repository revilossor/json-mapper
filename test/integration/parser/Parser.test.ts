import { Parser } from '../../../src/parser'

describe('When I parse a mapping that just has a details line', () => {
  let parser: Parser

  beforeEach(() => {
    parser = new Parser()
  })

  describe('And it is complete', () => {
    it('Then I only get name, version and description in the result', () => {
      const mapping = 'test-mapping:0.0.0:a test mapping for integration tests'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0',
        description: 'a test mapping for integration tests'
      })
    })
  })
  describe('And it has no description', () => {
    it('Then I only get name and version in the result', () => {
      const mapping = 'test-mapping:0.0.0'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0'
      })
    })
  })
  describe('And it has an empty description', () => {
    it('Then I get name and version in the result, and description is an empty string', () => {
      const mapping = 'test-mapping:0.0.0:'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0',
        description: ''
      })
    })
  })
  describe('And it has no version', () => {
    it('Then I only get nam in the result', () => {
      const mapping = 'test-mapping'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping'
      })
    })
  })
  describe('And it has an empty version', () => {
    it('Then I get name in the result, and version is an empty string', () => {
      const mapping = 'test-mapping:'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: ''
      })
    })
  })
  describe('And it has a name, a description and no version', () => {
    it('Then I get name and description in the result, and no version', () => {
      const mapping = 'test-mapping::description'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        description: 'description'
      })
    })
  })
})

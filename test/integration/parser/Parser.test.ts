import { Parser } from '../../../src/parser'

describe('When I parse a mapping that just has a details line', () => {
  it('Then I only get name, version and description in the result', () => {
    const parser = new Parser()
    const mapping = 'test-mapping:0.0.0:a test mapping for integration tests'

    expect(parser.parse(mapping)).toEqual({
      name: 'test-mapping',
      version: '0.0.0',
      description: 'a test mapping for integration tests'
    })
  })
})

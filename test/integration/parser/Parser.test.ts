import { Parser } from '../../../src/parser'

let parser: Parser

beforeAll(() => {
  parser = new Parser()
})

describe('When I parse an empty mapping', () => {
  it('Then I get an empty tree', () => {
    expect(parser.parse('{}')).toEqual({ tree: [] })
    expect(parser.parse('\n{}')).toEqual({ tree: [] })
    expect(parser.parse('\n\n{\n\n}\n\n')).toEqual({ tree: [] })
    expect(parser.parse('name\n{}')).toEqual({ name: 'name', tree: [] })
    expect(parser.parse('\n\nname\n\n{\n\n}\n\n')).toEqual({ name: 'name', tree: [] })
    expect(parser.parse('name/version\n{}')).toEqual({ name: 'name', version: 'version', tree: [] })
    expect(parser.parse('name/version/description\n{}')).toEqual({ name: 'name', version: 'version', description: 'description', tree: [] })
  })
})

describe('When I parse a mapping with a details line', () => {
  describe('And it is complete', () => {
    it('Then I get name, version and description in the result', () => {
      const mapping = 'test-mapping/0.0.0/a test mapping for integration tests\t{}'

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
      const mapping = 'test-mapping/0.0.0\t{}'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0',
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
  describe('And it is has whitespace (but not newlines) around delimeters', () => {
    it('Then the whitespace is trimmed', () => {
      const mapping = 'test-mapping / 0.0.0 / a test mapping for integration tests\n{}'

      expect(parser.parse(mapping)).toEqual({
        name: 'test-mapping',
        version: '0.0.0',
        description: 'a test mapping for integration tests',
        tree: []
      })
    })
  })
})

describe('When I parse a mapping with a rule', () => {
  describe('And the rule maps a top level property', () => {
    it('Then the returned tree contains an element with the correct property key', () => {
      const expected = {
        tree: [{
          key: 'keyname',
          required: false
        }]
      }
      expect(parser.parse('{keyname}')).toEqual(expected)
      expect(parser.parse('\n\n{\n\n\t\tkeyname\n\t\n\t}\n')).toEqual(expected)
    })
  })
  describe('And the rule maps a queried property', () => {
    it('Then the returned tree contains the correct key and query', () => {
      const queries = [
        '$.store.book[*].author',
        '$..author',
        '$.store.*',
        '$.store..price',
        '$..book[2]',
        '$..book[(@.length-1)]',
        '$..book[-1:]',
        '$..book[0,1]',
        '$..book[:2]',
        '$..book[?(@.isbn)]',
        '$..book[?(@.price<10)]',
        '$..book[?(@.price==8.95)]',
        '$..book[?(@.price<30 && @.category=="fiction")]',
        '$..*'
      ]
      queries.forEach(query => {
        expect(parser.parse(`{
          mappedKeyName / ${query}
        }`)).toEqual({
          tree: [{
            key: 'mappedKeyName',
            query,
            delist: false,
            required: false,
            scope: 'root'
          }]
        })
      })
    })
  })
  describe('And the rule maps a literal string', () => {
    it('Then the returned tree contains the correct key and literal', () => {
      expect(parser.parse(`{
        keyInOutput/"literal string value"
      }`)).toEqual({
        tree: [{
          key: 'keyInOutput',
          literal: 'literal string value',
          required: false
        }]
      })
    })
  })
  describe('And the rule maps a literal number', () => {
    it('Then the returned tree contains the correct key and literal', () => {
      expect(parser.parse(`{
        keyInOutput/"3.14"
      }`)).toEqual({
        tree: [{
          key: 'keyInOutput',
          literal: 3.14,
          required: false
        }]
      })
    })
  })
  describe('And there are multiple rules', () => {
    it('Then the returned tree contains an element for each rule', () => {
      const expected = {
        tree: [
          {
            key: 'keyname',
            required: false
          },
          {
            key: 'anotherKeyname',
            query: 'somequery',
            required: false,
            delist: false,
            scope: 'root'
          },
          {
            key: 'third',
            required: false
          }
        ]
      }
      expect(parser.parse('{keyname\nanotherKeyname / somequery\nthird}')).toEqual(expected)
      expect(parser.parse('\n\n{\n\n\t\tkeyname\n\t\n\tanotherKeyname / somequery\n\t\nthird\t}\n')).toEqual(expected)
    })
  })
})

describe('When I parse a mapping with nested rules', () => {
  it('Then the returned tree contains correctly nested elements', () => {
    const mapping = `{
      type
      mime-type
      renditions {
        name
        age
        stuff {
          key/query
        }
      }
    }`
    expect(parser.parse(mapping)).toEqual({
      tree: [
        { key: 'type', required: false },
        { key: 'mime-type', required: false },
        {
          key: 'renditions',
          required: false,
          tree: [
            { key: 'name', required: false },
            { key: 'age', required: false },
            {
              key: 'stuff',
              required: false,
              tree: [{
                key: 'key',
                required: false,
                query: 'query',
                delist: false,
                scope: 'root'
              }]
            }
          ]
        }
      ]
    })
  })
})

describe('When I parse a mapping with a delisted query property', () => {
  it('Then the returned tree contains the correct key, query and delist flag', () => {
    expect(parser.parse(`{
      somekey / ^$..book
    }`)).toEqual({
      tree: [{
        key: 'somekey',
        query: '$..book',
        required: false,
        delist: true,
        scope: 'root'
      }]
    })
  })
})

describe('When I parse a mapping with a scoped query property', () => {
  it('Then the returned tree contains the correct scope', () => {
    expect(parser.parse(`{
      somekey / .$..book
    }`)).toEqual({
      tree: [{
        key: 'somekey',
        query: '$..book',
        required: false,
        delist: false,
        scope: 'this'
      }]
    })
    expect(parser.parse(`{
      somekey / ..$..book
    }`)).toEqual({
      tree: [{
        key: 'somekey',
        query: '$..book',
        required: false,
        delist: false,
        scope: 'global'
      }]
    })
    expect(parser.parse(`{
      somekey / ^ .$..book
    }`)).toEqual({
      tree: [{
        key: 'somekey',
        query: '$..book',
        required: false,
        delist: true,
        scope: 'this'
      }]
    })
    expect(parser.parse(`{
      somekey / ^ ..$..book
    }`)).toEqual({
      tree: [{
        key: 'somekey',
        query: '$..book',
        required: false,
        delist: true,
        scope: 'global'
      }]
    })
  })
})

describe('When I parse a mapping with a scope', () => {
  it('Then the returned tree contains the correct scope', () => {
    expect(parser.parse(`{
      somekey / .
    }`)).toEqual({
      tree: [{
        key: 'somekey',
        required: false,
        scope: 'this'
      }]
    })
    expect(parser.parse(`{
      somekey / ..
    }`)).toEqual({
      tree: [{
        key: 'somekey',
        required: false,
        scope: 'global'
      }]
    })
  })
})

describe('When I parse a mapping with required keys', () => {
  it('Then the returned tree contains required elements', () => {
    const mapping = `{
      type
      mime-type!
      renditions! {
        name!/query
        age ! /query
        something!/"literal"
      }
    }`
    expect(parser.parse(mapping)).toEqual({
      tree: [
        { key: 'type', required: false },
        { key: 'mime-type', required: true },
        {
          key: 'renditions',
          required: true,
          tree: [
            { key: 'name', query: 'query', required: true, delist: false, scope: 'root' },
            { key: 'age', query: 'query', required: true, delist: false, scope: 'root' },
            { key: 'something', literal: 'literal', required: true }
          ]
        }
      ]
    })
  })
})

describe('When I parse a mapping that is invalid, I get an error', () => {
  it('When the description line is weird', () => {
    expect(() => parser.parse('test-mapping::description')).toThrow()
    expect(() => parser.parse(':version')).toThrow()
    expect(() => parser.parse(':version:')).toThrow()
    expect(() => parser.parse('::')).toThrow()
    expect(() => parser.parse(':')).toThrow()
  })
  it('When there is no mapping', () => {
    expect(() => parser.parse('')).toThrow()
    expect(() => parser.parse('name:version:description')).toThrow()
  })
  it('When a mapping rule is weird', () => {
    expect(() => parser.parse('{/}')).toThrow()
    expect(() => parser.parse('{noquery/}')).toThrow()
    expect(() => parser.parse('{nested{noquery/}}')).toThrow()
  })
  it('When there are multiple mappings', () => {
    expect(() => parser.parse('{}{}')).toThrow()
    expect(() => parser.parse('{noquery{}{}}')).toThrow()
  })
  it('When there is a mapping without a key (other than the main one)', () => {
    expect(() => parser.parse('{{}}')).toThrow()
    expect(() => parser.parse('{noquery{{}}}')).toThrow()
  })
  it('When there is a scope mapping with a mapping', () => {
    expect(() => parser.parse('{key/.{}}')).toThrow()
    expect(() => parser.parse('{key/..{}}')).toThrow()
    expect(() => parser.parse('{key{nested/.{}}')).toThrow()
    expect(() => parser.parse('{key{nested/..{}}')).toThrow()
  })
  it('When there is a scope mapping with a delist operator', () => {
    expect(() => parser.parse('{key/^.}')).toThrow()
    expect(() => parser.parse('{key/^..}')).toThrow()
    expect(() => parser.parse('{key{nested/^.}')).toThrow()
    expect(() => parser.parse('{key{nested/^..}')).toThrow()
  })
})

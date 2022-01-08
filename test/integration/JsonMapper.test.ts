import { JsonMapper } from '../../src/JsonMapper'

describe('Given a mapper with copies', () => {
  const mapper = JsonMapper.fromPath('./test/integration/fixtures/copy.jsonmap')

  it('When all properties are present in the input, they are all copied to the output', () => {
    const input = {
      one: 'the number one',
      two: 'the number two',
      three: 'the number three'
    }
    expect(mapper.map(input)).toEqual({
      one: input.one,
      two: input.two,
      three: input.three
    })
  })

  it('When the input has properties not referenced in the mapping they dont appear in the output', () => {
    const input = {
      one: 'the number one',
      two: 'the number two',
      three: 'the number three',
      four: 'the number four',
      five: 'the number five',
      six: 'the number six'
    }
    expect(mapper.map(input)).toEqual({
      one: input.one,
      two: input.two,
      three: input.three
    })
  })

  it('When a property is missing in the input, it is not present in the output', () => {
    const input = {
      one: 'the number one',
      two: 'the number two'
    }
    expect(mapper.map(input)).toEqual({
      one: input.one,
      two: input.two
    })
  })

  it('Then scope is checked first, then the input, then the global object', () => {
    const copyMapper = JsonMapper.fromString(`{
      nested {
        key
      }
    }`, { key: 'global' })

    expect(copyMapper.map({
      nested: {
        key: 'scope'
      }
    })).toEqual({ nested: { key: 'scope' } })

    expect(copyMapper.map({
      key: 'input'
    })).toEqual({ nested: { key: 'input' } })

    expect(copyMapper.map({
      no: 'key'
    })).toEqual({ nested: { key: 'global' } })
  })
})

describe('Given a mapper with required copies', () => {
  const mapper = JsonMapper.fromPath('./test/integration/fixtures/required-copy.jsonmap')

  it('When all properties are present in the input, they are all copied to the output', () => {
    const input = {
      one: 'the number one'
    }
    expect(mapper.map(input)).toEqual({
      one: input.one
    })
  })

  it('When a required property is missing in the input, an error is thrown', () => {
    const input = {
      two: 'the number two',
      three: 'the number three'
    }
    expect(() => mapper.map(input)).toThrowError('expected "$.one" to resolve a value')
  })
})

describe('Given a mapper with nested copies', () => {
  const mapper = JsonMapper.fromPath('./test/integration/fixtures/nested-copy.jsonmap')

  it('Then the output structure mirrors that described in the mapping file', () => {
    const input = {
      one: 'the number one',
      two: 'the number two',
      three: 'the number three'
    }
    expect(mapper.map(input)).toEqual({
      one: input.one,
      nested: {
        two: input.two,
        three: input.three
      }
    })
  })

  it('Then missing nested optional properties are not added to the output', () => {
    const input = {
      one: 'the number one',
      three: 'the number three'
    }
    expect(mapper.map(input)).toEqual({
      one: input.one,
      nested: {
        three: input.three
      }
    })
  })

  it('Then if all properties for a nested object are missing and they are all optional, an empty object assigned', () => {
    const input = {
      one: 'the number one'
    }
    expect(mapper.map(input)).toEqual({
      one: input.one,
      nested: {}
    })
  })
})

describe('Given a mapper with required nested copies', () => {
  const mapper = JsonMapper.fromPath('./test/integration/fixtures/required-nested-copy.jsonmap')

  it('If all properties are optional and missing an empty object is assigned', () => {
    const input = {
      two: 'not a one'
    }
    expect(mapper.map(input)).toEqual({
      nested: {},
      anotherNested: { two: input.two }
    })
  })

  it('Then if there are missing required nested properties in a required property, an error is thrown', () => {
    const input = {
      one: 'its a one'
    }
    expect(() => mapper.map(input)).toThrowError('expected "$.anotherNested.two" to resolve a value')
  })
})

describe('Given a mapper with literals', () => {
  const mapper = JsonMapper.fromPath('./test/integration/fixtures/literal.jsonmap')

  it('Then the output object contains the literals, parsed as floats where possible', () => {
    const input = {
      one: 1
    }
    expect(mapper.map(input)).toEqual({
      one: input.one,
      two: 'two',
      pi: 3.14
    })
  })
})

describe('Given a mapper with queries', () => {
  const mapper = JsonMapper.fromPath('./test/integration/fixtures/query.jsonmap')

  it('When the query can be satisfied, its result is present in the output', () => {
    const input = {
      store: {
        book: [
          {
            category: 'reference',
            author: 'Nigel Rees',
            title: 'Sayings of the Century',
            price: 8.95
          }, {
            category: 'fiction',
            author: 'Evelyn Waugh',
            title: 'Sword of Honour',
            price: 12.99
          }, {
            category: 'fiction',
            author: 'Herman Melville',
            title: 'Moby Dick',
            isbn: '0-553-21311-3',
            price: 8.99
          }, {
            category: 'fiction',
            author: 'J. R. R. Tolkien',
            title: 'The Lord of the Rings',
            isbn: '0-395-19395-8',
            price: 22.99
          }
        ],
        bicycle: {
          color: 'red',
          price: 19.95
        }
      }
    }
    expect(mapper.map(input)).toEqual({
      all: [
        {
          store: {
            book: [
              {
                category: 'reference',
                author: 'Nigel Rees',
                title: 'Sayings of the Century',
                price: 8.95
              },
              {
                category: 'fiction',
                author: 'Evelyn Waugh',
                title: 'Sword of Honour',
                price: 12.99
              },
              {
                category: 'fiction',
                author: 'Herman Melville',
                title: 'Moby Dick',
                isbn: '0-553-21311-3',
                price: 8.99
              },
              {
                category: 'fiction',
                author: 'J. R. R. Tolkien',
                title: 'The Lord of the Rings',
                isbn: '0-395-19395-8',
                price: 22.99
              }
            ],
            bicycle: {
              color: 'red',
              price: 19.95
            }
          }
        }
      ],
      queries: {
        'The-authors-of-all-books–in-the-store': [
          'Nigel Rees',
          'Evelyn Waugh',
          'Herman Melville',
          'J. R. R. Tolkien'
        ],
        'All-authors': [
          'Nigel Rees',
          'Evelyn Waugh',
          'Herman Melville',
          'J. R. R. Tolkien'
        ],
        'All-things-in–store-which-are-some-books-and-a-red-bicycle': [
          [
            {
              category: 'reference',
              author: 'Nigel Rees',
              title: 'Sayings of the Century',
              price: 8.95
            },
            {
              category: 'fiction',
              author: 'Evelyn Waugh',
              title: 'Sword of Honour',
              price: 12.99
            },
            {
              category: 'fiction',
              author: 'Herman Melville',
              title: 'Moby Dick',
              isbn: '0-553-21311-3',
              price: 8.99
            },
            {
              category: 'fiction',
              author: 'J. R. R. Tolkien',
              title: 'The Lord of the Rings',
              isbn: '0-395-19395-8',
              price: 22.99
            }
          ],
          {
            color: 'red',
            price: 19.95
          }
        ],
        'The-price-of-everything-in-the-store': [
          8.95,
          12.99,
          8.99,
          22.99,
          19.95
        ],
        'The-third-book': [
          {
            category: 'fiction',
            author: 'Herman Melville',
            title: 'Moby Dick',
            isbn: '0-553-21311-3',
            price: 8.99
          }
        ],
        'The-last-book-via-script-subscript': [
          {
            category: 'fiction',
            author: 'J. R. R. Tolkien',
            title: 'The Lord of the Rings',
            isbn: '0-395-19395-8',
            price: 22.99
          }
        ],
        'The-last-book-via-slice': [
          {
            category: 'fiction',
            author: 'J. R. R. Tolkien',
            title: 'The Lord of the Rings',
            isbn: '0-395-19395-8',
            price: 22.99
          }
        ],
        'The-first-two-books-via-subscript-union': [
          {
            category: 'reference',
            author: 'Nigel Rees',
            title: 'Sayings of the Century',
            price: 8.95
          },
          {
            category: 'fiction',
            author: 'Evelyn Waugh',
            title: 'Sword of Honour',
            price: 12.99
          }
        ],
        'The-first-two-books-via-subscript-array-slice': [
          {
            category: 'reference',
            author: 'Nigel Rees',
            title: 'Sayings of the Century',
            price: 8.95
          },
          {
            category: 'fiction',
            author: 'Evelyn Waugh',
            title: 'Sword of Honour',
            price: 12.99
          }
        ],
        'Filter-all-books-with-isbn-number': [
          {
            category: 'fiction',
            author: 'Herman Melville',
            title: 'Moby Dick',
            isbn: '0-553-21311-3',
            price: 8.99
          },
          {
            category: 'fiction',
            author: 'J. R. R. Tolkien',
            title: 'The Lord of the Rings',
            isbn: '0-395-19395-8',
            price: 22.99
          }
        ],
        'Filter-all-books-cheaper-than-10': [
          {
            category: 'reference',
            author: 'Nigel Rees',
            title: 'Sayings of the Century',
            price: 8.95
          },
          {
            category: 'fiction',
            author: 'Herman Melville',
            title: 'Moby Dick',
            isbn: '0-553-21311-3',
            price: 8.99
          }
        ],
        'Filter-all-books-that-cost-8.95': [
          {
            category: 'reference',
            author: 'Nigel Rees',
            title: 'Sayings of the Century',
            price: 8.95
          }
        ],
        'Filter-all-fiction-books-cheaper-than-30': [
          {
            category: 'fiction',
            author: 'Evelyn Waugh',
            title: 'Sword of Honour',
            price: 12.99
          },
          {
            category: 'fiction',
            author: 'Herman Melville',
            title: 'Moby Dick',
            isbn: '0-553-21311-3',
            price: 8.99
          },
          {
            category: 'fiction',
            author: 'J. R. R. Tolkien',
            title: 'The Lord of the Rings',
            isbn: '0-395-19395-8',
            price: 22.99
          }
        ],
        'All-members-of-JSON-structure': [
          {
            book: [
              {
                category: 'reference',
                author: 'Nigel Rees',
                title: 'Sayings of the Century',
                price: 8.95
              },
              {
                category: 'fiction',
                author: 'Evelyn Waugh',
                title: 'Sword of Honour',
                price: 12.99
              },
              {
                category: 'fiction',
                author: 'Herman Melville',
                title: 'Moby Dick',
                isbn: '0-553-21311-3',
                price: 8.99
              },
              {
                category: 'fiction',
                author: 'J. R. R. Tolkien',
                title: 'The Lord of the Rings',
                isbn: '0-395-19395-8',
                price: 22.99
              }
            ],
            bicycle: {
              color: 'red',
              price: 19.95
            }
          },
          [
            {
              category: 'reference',
              author: 'Nigel Rees',
              title: 'Sayings of the Century',
              price: 8.95
            },
            {
              category: 'fiction',
              author: 'Evelyn Waugh',
              title: 'Sword of Honour',
              price: 12.99
            },
            {
              category: 'fiction',
              author: 'Herman Melville',
              title: 'Moby Dick',
              isbn: '0-553-21311-3',
              price: 8.99
            },
            {
              category: 'fiction',
              author: 'J. R. R. Tolkien',
              title: 'The Lord of the Rings',
              isbn: '0-395-19395-8',
              price: 22.99
            }
          ],
          {
            color: 'red',
            price: 19.95
          },
          {
            category: 'reference',
            author: 'Nigel Rees',
            title: 'Sayings of the Century',
            price: 8.95
          },
          {
            category: 'fiction',
            author: 'Evelyn Waugh',
            title: 'Sword of Honour',
            price: 12.99
          },
          {
            category: 'fiction',
            author: 'Herman Melville',
            title: 'Moby Dick',
            isbn: '0-553-21311-3',
            price: 8.99
          },
          {
            category: 'fiction',
            author: 'J. R. R. Tolkien',
            title: 'The Lord of the Rings',
            isbn: '0-395-19395-8',
            price: 22.99
          },
          'reference',
          'Nigel Rees',
          'Sayings of the Century',
          8.95,
          'fiction',
          'Evelyn Waugh',
          'Sword of Honour',
          12.99,
          'fiction',
          'Herman Melville',
          'Moby Dick',
          '0-553-21311-3',
          8.99,
          'fiction',
          'J. R. R. Tolkien',
          'The Lord of the Rings',
          '0-395-19395-8',
          22.99,
          'red',
          19.95
        ]
      }
    })
  })

  it('When a query can not be satisfied, the associated key is an empty array in the output', () => {
    const input = {}
    expect(mapper.map(input)).toEqual({
      all: [{}],
      queries: {
        'The-authors-of-all-books–in-the-store': [],
        'All-authors': [],
        'All-things-in–store-which-are-some-books-and-a-red-bicycle': [],
        'The-price-of-everything-in-the-store': [],
        'The-third-book': [],
        'The-last-book-via-script-subscript': [],
        'The-last-book-via-slice': [],
        'The-first-two-books-via-subscript-union': [],
        'The-first-two-books-via-subscript-array-slice': [],
        'Filter-all-books-with-isbn-number': [],
        'Filter-all-books-cheaper-than-10': [],
        'Filter-all-books-that-cost-8.95': [],
        'Filter-all-fiction-books-cheaper-than-30': [],
        'All-members-of-JSON-structure': []
      }
    })
  })
})

describe('Given a mapper with delisted queries', () => {
  const mapper = JsonMapper.fromPath('./test/integration/fixtures/query-delisted.jsonmap')

  it('When the query can be satisfied, its result is present in the output', () => {
    const input = {
      one: 1,
      nested: {
        two: 2
      },
      list: [{
        three: 3
      }]
    }
    expect(mapper.map(input)).toEqual({
      all: input,
      queries: {
        first: 1,
        second: 2,
        third: 3
      }
    })
  })

  it('When a query can not be satisfied, the associated key is not present in the output', () => {
    const input = {
      nested: {
        two: 2
      }
    }
    expect(mapper.map(input)).toEqual({
      all: input,
      queries: {
        second: 2
      }
    })
  })
})

describe('Given a mapper with scope', () => {
  const mapper = JsonMapper.fromPath('./test/integration/fixtures/scope.jsonmap')

  it('When the query can be satisfied, its result is present in the output', () => {
    const input = {
      key: 'root key',
      data: {
        key: 'data key',
        moredata: {
          key: 'moredata key'
        }
      }
    }
    expect(mapper.map(input)).toEqual({
      thisValue: input,
      globalValue: {},
      data: input.data,
      scoped: {
        thisValue: input.data,
        globalValue: {},
        fromRoot: 'root key',
        fromThis: 'data key',
        doublescoped: {
          fromThis: [
            input.data.moredata.key
          ],
          thisValue: input.data.moredata
        }
      }
    })
  })
})

describe('Given a mapper with a mapping on a list value', () => {
  it('Then the mapping is applied to each list element, and a list returned', () => {
    const input = {
      oldlist: [
        { value: 'first', ignored: true },
        { value: 'second', ignored: true },
        { value: 'third', ignored: true }
      ]
    }
    const mapper = JsonMapper.fromString(`
      {
        newlist / ^$.oldlist {
          queriedfromthis / ^.$.value
        }
      }
    `)
    expect(mapper.map(input)).toEqual({
      newlist: [
        { queriedfromthis: 'first' },
        { queriedfromthis: 'second' },
        { queriedfromthis: 'third' }
      ]
    })
  })
})

describe('Given a mapper with scope mapping rules', () => {
  it('Then the correct scopes are assigned', () => {
    const input = {
      nested: {
        value: 'some nested value'
      }
    }
    const global = {
      stardate: 'thursday'
    }
    const mapper = JsonMapper.fromString(`
      {
        scopes / ^$.nested {
          this / .
          global / ..
          root / ^$
        }
      }
    `, global)
    expect(mapper.map(input)).toEqual({
      scopes: {
        this: input.nested,
        global,
        root: input
      }
    })
  })
})

describe('Given a mapper with a mapping with a copy rule', () => {
  it('Then the copy looks up through scopes to find a value', () => {
    const mapper = JsonMapper.fromString(`
      {
        scoped / ^$.nested {
          one
        }
      }
    `)
    const input = {
      one: 'the number one',
      nested: {
        value: 'some nested value'
      }
    }
    expect(mapper.map(input)).toEqual({
      scoped: {
        one: input.one
      }
    })
    const otherInput = {
      one: 'the number one',
      nested: {
        one: 'more specific number one',
        value: 'some nested value'
      }
    }
    expect(mapper.map(otherInput)).toEqual({
      scoped: {
        one: otherInput.nested.one
      }
    })
  })
})

describe('Given a mapper with a mapping on a copy', () => {
  it('Then rule scope for the nested rules is the result of the copy', () => {
    const mapper = JsonMapper.fromString(`
      {
        copied {
          copiedValue / .
        }
      }
    `)
    const input = {
      copied: {
        nested: 'value'
      }
    }
    expect(mapper.map(input)).toEqual({
      copied: {
        copiedValue: {
          nested: 'value'
        }
      }
    })
  })

  it('Then copied arrays are mapped correctly', () => {
    const mapper = JsonMapper.fromString(`
      {
        copied {
          result / .
        }
      }
    `)
    const input = {
      copied: [
        '1',
        '2',
        3
      ]
    }
    expect(mapper.map(input)).toEqual({
      copied: [
        { result: '1' },
        { result: '2' },
        { result: 3 }
      ]
    })
  })
})

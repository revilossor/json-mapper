import { JsonMapper } from '../../src/JsonMapper'

// TODO integration test all features

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
    expect(() => mapper.map(input)).toThrowError('expected "one" to resolve all required values')
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
})

// TODO required nested copies, in required properties

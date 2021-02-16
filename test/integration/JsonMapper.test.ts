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
    expect(() => mapper.map(input)).toThrowError('expected "one" to resolve a value')
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

  it('Then if all properties for a nested object are missing and they are all optional, nothing is assigned', () => {
    const input = {
      one: 'the number one'
    }
    expect(mapper.map(input)).toEqual({
      one: input.one
    })
  })
})

describe('Given a mapper with required nested copies', () => {
  const mapper = JsonMapper.fromPath('./test/integration/fixtures/required-nested-copy.jsonmap')

  it('Then missing nested properties in a required property cause an error to be thrown', () => {
    const input = {
      two: 'not a one'
    }
    expect(() => mapper.map(input)).toThrowError('expected "nested" to resolve all required values')
  })

  it('Then if there are missing required nested properties in an optional property, then the property is not added to the output', () => {
    const input = {
      one: 'its a one'
    }
    expect(mapper.map(input)).toEqual({
      nested: {
        one: input.one
      }
    })
  })
})

import { JsonMapper } from '../../src/JsonMapper'

describe('Given a mapper for simple top level copies', () => {
  const mapper = JsonMapper.fromPath('./test/integration/fixtures/test-mapping-one.jsonmap')

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

  it('When an optional property is missing in the input, it is not present in the output', () => {
    const input = {
      one: 'the number one',
      two: 'the number two'
    }
    expect(mapper.map(input)).toEqual({
      one: input.one,
      two: input.two
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

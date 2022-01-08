import { JsonMapper } from '../../src/JsonMapper'
import { readFileSync as readFileSyncActual } from 'fs'
import { resolve as resolveActual } from 'path'
import { Parser } from '../../src/parser'
import { Processor } from '../../src/processor'

const process = jest.fn()

jest.mock('fs')
jest.mock('path')
jest.mock('../../src/parser')
jest.mock('../../src/processor', () => {
  return {
    Processor: jest.fn().mockImplementation(() => {
      return { process }
    })
  }
})

const readFileSync = readFileSyncActual as jest.Mock
const resolve = resolveActual as jest.Mock
const parse = Parser.prototype.parse as jest.Mock

const path = './some-path'
const resolved = '/some/resolved/path'
const mapping = 'some mapping'
const parsed = {
  tree: ['some AST']
}
const processed = {
  processed: 'output'
}

resolve.mockReturnValue(resolved)
readFileSync.mockReturnValue(mapping)
parse.mockReturnValue(parsed)
process.mockReturnValue(processed)

describe('When I get a JsonMapper instance from a file path', () => {
  beforeEach(() => {
    JsonMapper.fromPath(path)
  })

  it('Then the mapping is loaded from the supplied path', () => {
    expect(resolve).toHaveBeenCalledWith(path)
    expect(readFileSync).toHaveBeenCalledWith(resolved)
  })

  it('And the loaded mapping is parsed', () => {
    expect(parse).toHaveBeenCalledWith(mapping)
  })

  it('And a Processor is instantiated with parsed syntax tree', () => {
    expect(Processor).toHaveBeenCalledWith(parsed.tree)
  })
})

describe('When I get a JsonMapper instance from a string', () => {
  const mapping = '{ one }'

  beforeEach(() => {
    JsonMapper.fromString(mapping)
  })

  it('Then the passed string is parsed as a mapping', () => {
    expect(parse).toHaveBeenCalledWith(mapping)
  })

  it('And a Processor is instantiated with parsed syntax tree', () => {
    expect(Processor).toHaveBeenCalledWith(parsed.tree)
  })
})

describe('When I get a JsonMapper instance and the mapping syntax does not parse', () => {
  const mapping = '{ one }'

  const error = new Error('some parse error')

  beforeEach(() => {
    parse.mockImplementationOnce(() => { throw error })
  })

  it('Then the parse error is rethrown', () => {
    expect(() => { JsonMapper.fromString(mapping) }).toThrow(`Error initialising JsonMapper: ${error.message}`)
  })
})

describe('Given a JsonMapper instance with no globals', () => {
  interface Thing {
    some: string
  }

  let mapper: JsonMapper<Thing, Thing>

  beforeEach(() => {
    mapper = JsonMapper.fromPath(path)
  })

  describe('When I map an input object', () => {
    it('Then the processor processes the input and the output is returned, with empty globals', () => {
      const input = { some: 'input' }
      const result = mapper.map(input)
      expect(process).toHaveBeenCalledWith(input, {})
      expect(result).toEqual(processed)
    })
  })
})

describe('Given a JsonMapper instance with globals passed', () => {
  interface Thing {
    some: string
  }

  let mapper: JsonMapper<Thing, Thing>

  const globals = {
    stardate: 'thursday'
  }

  beforeEach(() => {
    mapper = JsonMapper.fromPath(path, globals)
  })

  describe('When I map an input object', () => {
    it('Then the processor processes the input and the globals', () => {
      const input = { some: 'input' }
      mapper.map(input)
      expect(process).toHaveBeenCalledWith(input, globals)
    })
  })
})

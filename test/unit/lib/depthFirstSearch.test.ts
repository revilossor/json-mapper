import depthFirstSearch from '../../../src/lib/depthFirstSearch'

describe('When I search a flat array', () => {
  const array = [
    1, 2, 3
  ]
  it('Then the passed function is invoked once for each array element', () => {
    const func = jest.fn()
    depthFirstSearch(func, array)
    array.forEach(element => expect(func).toHaveBeenCalledWith(element))
    expect(func).toHaveBeenCalledTimes(array.length)
  })
})

describe('When I search a nested array', () => {
  const array = [
    1,
    [2, 3, 4],
    5,
    [
      6,
      [7, 8],
      [
        9,
        [10, [11]]
      ]
    ]
  ]
  it('Then the passed function is invoked once for each leaf element', () => {
    const func = jest.fn()
    depthFirstSearch(func, array)
    for (let i = 1; i <= 11; ++i) {
      expect(func).toHaveBeenCalledWith(i)
    }
    expect(func).toHaveBeenCalledTimes(11)
  })
})

import depthFirstSearch from '../../../src/lib/depthFirstSearch'

describe('When I search a flat array', () => {
  const array = [
    1, 2, 3
  ]
  it('Then the passed function is invoked once for each array element, with the path and the source', () => {
    const func = jest.fn()
    depthFirstSearch(func, array)
    array.forEach((element, index) => expect(func).toHaveBeenCalledWith(element, [index], array))
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
  it('Then the passed function is invoked once for each leaf element, with the path and the source', () => {
    const func = jest.fn()
    depthFirstSearch(func, array)
    expect(func).toHaveBeenCalledWith(1, [0], array)
    expect(func).toHaveBeenCalledWith(2, [1, 0], array)
    expect(func).toHaveBeenCalledWith(3, [1, 1], array)
    expect(func).toHaveBeenCalledWith(4, [1, 2], array)
    expect(func).toHaveBeenCalledWith(5, [2], array)
    expect(func).toHaveBeenCalledWith(6, [3, 0], array)
    expect(func).toHaveBeenCalledWith(7, [3, 1, 0], array)
    expect(func).toHaveBeenCalledWith(8, [3, 1, 1], array)
    expect(func).toHaveBeenCalledWith(9, [3, 2, 0], array)
    expect(func).toHaveBeenCalledWith(10, [3, 2, 1, 0], array)
    expect(func).toHaveBeenCalledWith(11, [3, 2, 1, 1, 0], array)
  })
})

export default function depthFirstSearch (
  callback: (element: any, path?: number[], source?: any[]) => void,
  source: any[],
  current = source,
  path: number[] = []
): void {
  if (!Array.isArray(current)) {
    return callback(current, path, source)
  }
  current.forEach((element, index) => {
    depthFirstSearch(callback, source, element, [...path, index])
  })
}

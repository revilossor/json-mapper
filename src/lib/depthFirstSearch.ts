export default function depthFirstSearch (
  callback: (element: any) => void,
  source: any[],
  current = source
): void {
  if (!Array.isArray(current)) {
    return callback(current)
  }
  current.forEach(element => {
    depthFirstSearch(callback, source, element)
  })
}

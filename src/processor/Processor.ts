import { ASTRule } from '../types'
import { depthFirstSearch } from '../lib'

interface json { [index: string]: any }

export class Processor<I extends json, O extends json> {
  // TODO validate the tree for required fields in output O...?
  public constructor (private readonly tree: ASTRule[]) {}

  private apply (input: I, {
    key
    // required,
    // query,
    // tree,
    // literal
  }: ASTRule): json {
    // console.dir({ input, key })
    return {
      [key]: input[key]
    }
  }

  public process (input: I): O {
    let output = {}

    depthFirstSearch(
      (element: ASTRule, path: number[], source: any[]) => {
        // console.dir({ element, path, source })
        output = { ...output, ...this.apply(input, element) }
      },
      this.tree
    )
    
    return output as unknown as O
  }
}

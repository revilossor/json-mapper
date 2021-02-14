import { ASTRule } from '../types'
import { depthFirstSearch } from '../lib'

interface json { [index: string]: any }

export class Processor<I extends json, O extends json> {
  // TODO validate the tree for required fields in output O...?
  public constructor (private readonly root: ASTRule[]) {}

  private apply (input: I | any, {
    key,
    tree,
    literal
    // required,
    // query,
  }: ASTRule): json {
    // console.dir({ input, key })

    let value

    if (literal !== undefined) {
      value = literal
    } else if (tree !== undefined) {
      value = this.traverse(input, tree)
    } else {
      value = input[key]
    }

    return {
      [key]: value
    }
  }

  private traverse (input: any, tree: ASTRule[]): json {
    let output = {}

    depthFirstSearch(
      (element: ASTRule) => {
        // console.dir({ element, path, source })
        output = { ...output, ...this.apply(input, element) }
      },
      tree
    )

    return output
  }

  public process (input: I): O {
    return this.traverse(input, this.root) as unknown as O
  }
}

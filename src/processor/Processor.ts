import { ASTRule } from '../types'

interface json { [index: string]: any }

export class Processor<I extends json, O extends json> {
  // TODO validate the tree for required fields in output O...?
  public constructor (private readonly tree: ASTRule[]) {
    console.dir({ tree })
  }

  public process (input: I): O {
    console.dir({ input })
    // TODO dfs tree, assigning keys to obj as you go
    return {
      one: '1',
      two: '2',
      three: '3'
    } as unknown as O
  }
}

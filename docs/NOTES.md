# NOTES

## TODO

- lowering / uppering
- some syntax for boolean logic...
  - rule can be 'key: expression'
  - expression is boolean, operators:
    - ==
    - !=
    - ()
    - ||
    - &&
  - expression operands are key, literal, query, scope
  - can [jsonata](https://docs.jsonata.org/overview) help with this? potentially replace jsonpath?
- export cli interface for global install ( getopts )
- webapp REPL like the pegjs online thing
- make parser errors better
  - rewrite parser
  - include compiled parser
- make errors from jsonpath have the path

### Ideas

- can the mappings be validated usefully?
  - we can say if the mapping would generate all required keys in output
  - we can also look at input structure to say if all the required keys in mapping are present
  - we can inspect types in input match mapped things in output
  - given looking recursively up for keys, into unstructured global object, we can say what keys are required in the global object
  - queries make this complicated - whats the use case where just doing the mapping isnt sufficient?
- can mappings be added together to compose new mappings, like vector addition?
  - f(mapping-one, A) -> B, f(mapping-two, B) -> C
  - composed = mapping-one + mapping-two
  - f(composed, A) -> C
- can we unmap?
  - f(mapping-one, A) -> B
  - ^f(mapping-one, B) -> A

### For ninjs

- cant easily do
  - renditions - need object keys as title field
  - object boolean stuff - no boolean logic

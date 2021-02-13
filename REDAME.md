# Json Mapper

Maps one json structure to another, according to a declared specification

- the first line of a mapping is the details **name : version : description**
- optional properties indicated with a **?** preceeding the rule
- queries are in [jsonpath](https://www.npmjs.com/package/jsonpath) syntax
- selectors are used to pick properties to map and optionally rename
- if a query returns multiple items, the selector is applied to each and a list returned
- rules are delimeted with newlines

jsonmapper(mapping, input): output

use recursive mapping to describe the shape of the output object

```text
name : version : description
{
  ?key:jsonpath{mapping}
}
```

- can validate mapping - key for everything in output type
- should ba a mappinng / key hierarchy that matches the object / key hierarchy
- can know if optional or required is missing and handle accordingly

## example rules

```text
<key>:<query>{selector, ...}
?<key>:<query>{selector, ...}
<key>:<query>{key:selector, ...}
<key>:<query>{?selector, ...}
<key>:<query>{?key:selector, ...}
<key>:{selector}
{selector}
<key>:<query>
```

# Json Mapper

Maps one json structure to another, according to a declared specification

- optional properties indicated with a **?** preceeding the rule
- queries are in [jsonpath](https://www.npmjs.com/package/jsonpath) syntax
- selectors are used to pick properties to map and optionally rename
- if a query returns multiple items, the selector is applied to each and a list returned
- rules are delimeted with newlines
- the first line of a mapping is the optional **<name>:<version>:<description>**

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

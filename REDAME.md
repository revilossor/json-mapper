# Json Mapper

Maps one json structure to another, according to a declared specification

Syntax a superset of [jsonpath](https://www.npmjs.com/package/jsonpath) with

```
<key>:<query>{selector, ...}
?<key>:<query>{selector, ...}
<key>:{selector, ...}
{selector, ...}
<key>:<query>
<key>:<query>{selector, ...}
```

declare a mapping file with a series of newline delimeted rules that define the structure of the output, and how to retrieve the correct value from the input.

query, in jsonpath, always returns an array.
if array length is 1, pop it ( it might be an array value which also has length 1, or any )
selector acts on every item in array and returns array
popping phase happens at end. Bit like toString on an array.

can just specify a selector as a rule to pick keys from input object

higher line numbers override other rules for the same key at same level

selector, in micromatch, needs to allow optional and renaming

selector - all things matched by selector are required
?selector - all things matched by selector are optional
key:selector - rename the first matched property as key
?key:selector - rename the first matched property as optional key

each selector in a list has equal precedence, so negations of previous selections arent possible, but a negation of a list could be


# TODO

 - parse from file

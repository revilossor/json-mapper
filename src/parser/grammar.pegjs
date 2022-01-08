Mapping "mapping details and tree" = _ details:MappingDetails* _ tree:MappingTree _ {
  return {
    ...details.pop(),
    tree
  }
}

MappingDetails "mapping details" = _ head:Char+ _ tail:( _ '/' _ Char+)* '/'* {
  const name = head.join('').trim()
  const [ version, description ] = tail
  return {
    ...(name ? { name }: {}),
    ...(version ? { version: version.pop().join('').trim() }: {}),
    ...(description ? { description: description.pop().join('').trim() }: {})
  }
}

MappingTree "a mapping tree" = '{' _ head:MappingRule* tail:(EOL MappingRule)* _ '}' {
  return [ ...head, ...tail ]
}

MappingRule "a mapping rule" = _ rule:LiteralMappingRule _ tree:MappingTree? {
  if(tree && (!!rule.scope && !rule.query)) {
	  error('Detected a rule with an illegal MappingTree')
  }
  return {
    ...rule,
	  ...(tree ? { tree }: {})
  }
}

LiteralMappingRule "a mapping rule with a key and a literal" = key:Key _ '/' _ '"' _ literal:Char+ _ '"' {
  const joined = literal.join('').trim()
  const parsed = parseFloat(joined, 10)
  return {
    ...key,
    literal: Number.isNaN(parsed) ? joined : parsed
  }
} / QueryMappingRule

QueryMappingRule "a mapping rule with a key, delist, scope and a query" = key:Key _ '/' _ delist:'^'? _ scope:ScopeMapping? query:QueryChar+ {
  return {
    ...key,
    query: query.join('').trim(),
    delist: !!delist,
    ...(scope ? { scope } : { scope: 'root' })
  }
} / ScopeMappingRule

ScopeMappingRule "a mapping rule with a key and a scope" = key:Key _ '/' _ scope:ScopeMapping {
  return {
    ...key,
    scope
  }
} / KeyMappingRule

KeyMappingRule "a mapping rule with a key" = key:Key {
  return {
    ...key
  }
}

Key "a property key" = chars:Char+ _ required:'!'? {
  return {
    key: chars.join('').trim(),
  	required: !!required
  }
}

ScopeMapping "a scope mapping rule with a key" = dots:'.'+ {
  return dots.length === 1
    ? 'this'
    : 'global'
}

EOL = [\r\n]
Char = [^"!/{}\r\n]
QueryChar = [^!/{}\r\n^]
_  = [ \t\r\n]*
__ = [ \t\r\n]+

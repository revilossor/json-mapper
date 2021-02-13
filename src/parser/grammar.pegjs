Mapping "mapping details and tree" = _ details:MappingDetails* _ tree:MappingTree _ {
  return {
    ...details.pop(),
    tree
  }
}

MappingDetails "mapping details" = NVDMappingDetails

NVDMappingDetails "full mapping details" = name:Char+ ':' version:Char+ ':' description:Char* {
  return {
    name: name.join('').trim(),
    version: version.join('').trim(),
    description: description.join('').trim()
  }
} / NVMappingDetails

NVMappingDetails "mapping details with no description" = name:Char+ ':' version:Char* {
  return {
    name: name.join('').trim(),
    version: version.join('').trim()
  }
} / NMappingDetails

NMappingDetails "mapping details with just a name" = name:Char+ {
  return {
    name: name.join('').trim()
  }
}

MappingTree "a mapping tree" = '{' _ rules:MappingRule* _ '}' {
  return rules
}

MappingRule "a mapping rule" = _ rule:QueryMappingRule _ {
  return rule
}

QueryMappingRule "a mapping rule with a key and a query" = key:Char+ ':' query:Char+ EOL {
  return {
    key: key.join('').trim(),
    query: query.join('').trim()
  }
} / KeyMappingRule

KeyMappingRule "a mapping rule with a key" = key:Char+ EOL {
  return {
    key: key.join('').trim()
  }
}

EOL = [\r\n]
Char = [^:{}\r\n]
_  = [ \t\r\n]*
__ = [ \t\r\n]+

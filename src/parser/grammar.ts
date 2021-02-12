export default `
Mapping "a mapping" = details:MappingDetails* {
  return {
    ...details.pop()
  }
}

MappingDetails "mapping details" = NVDMappingDetails

NVDMappingDetails "full mapping details" = name:[^:]+ ':' version:[^:]+ ':' description:[^:]* {
  return {
    name: name.join(''),
    version: version.join(''),
    description: description.join('')
  }
} / NDMappingDetails

NDMappingDetails "mapping details with no version" = name:[^:]+ '::' description:[^:]* {
  return {
    name: name.join(''),
    description: description.join('')
  }
} / NVMappingDetails

NVMappingDetails "mapping details with no description" = name:[^:]+ ':' version:[^:]* {
  return {
    name: name.join(''),
    version: version.join('')
  }
} / VDMappingDetails

VDMappingDetails "mapping details with no name" = ':' version:[^:]* ':' description:[^:]* {
  return {
    version: version.join(''),
    description: description.join('')
  }
} / NMappingDetails

NMappingDetails "mapping details with just a name" = name:[^:]+ {
  return {
    name: name.join('')
  }
} / VMappingDetails

VMappingDetails "mapping details with just a version" = ':' version:[^:]+ {
  return {
    version: version.join('')
  }
}
`

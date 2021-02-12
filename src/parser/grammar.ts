export default `
Mapping = details:MappingDetails* {
  return {
    ...details.pop()
  }
}

MappingDetails = NVDMappingDetails

NVDMappingDetails = name:[^:]+ ':' version:[^:]+ ':' description:[^:]* {
  return {
    name: name.join(''),
    version: version.join(''),
    description: description.join('')
  }
} / NDMappingDetails

NDMappingDetails = name:[^:]+ '::' description:[^:]* {
  return {
    name: name.join(''),
    description: description.join('')
  }
} / NVMappingDetails

NVMappingDetails = name:[^:]+ ':' version:[^:]* {
  return {
    name: name.join(''),
    version: version.join('')
  }
} / NMappingDetails

NMappingDetails = name:[^:]+ {
  return {
    name: name.join('')
  }
}
`

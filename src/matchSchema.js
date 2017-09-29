const fs = require('fs')
const {train, validate} = require('validate-by-example')
const toFileName = require('./toFileName')

function matchSchema (endpoint, content) {
  const filename = './__schemas__/' + toFileName(endpoint.name)

  if (process.env.TRAIN || (process.env.TRAIN_MISSING && !fs.existsSync(filename))) {
    const schema = train(content)

    // Validate that the schema works
    const result = validate(schema, content)
    if (!result.valid) {
      console.log('Failed training schema for ' + endpoint.name)
      // console.log(result.errors)
      return {}
    }

    fs.writeFileSync(filename, JSON.stringify(schema, null, 2), 'utf-8')
    return {schemaValid: true}
  }

  if (!fs.existsSync(filename)) {
    return {}
  }

  const schema = JSON.parse(fs.readFileSync(filename, 'utf-8'))
  const result = validate(schema, content)

  if (result.valid) {
    return {schemaValid: true}
  }

  return {
    schemaValid: false,
    schemaChanges: formatErrors(result.errors)
  }
}

function formatErrors (errors) {
  return errors.map(error => `'${error.field}' ${error.message}`).join('\n')
}

module.exports = matchSchema

import pino from 'pino'
import * as SwaggerParser from '@apidevtools/swagger-parser'
import { globSync } from 'glob'

const validateApiSpec = async (): Promise<void> => {
  const logger = pino()

  const apiSpecFiles = globSync('./connected_benefit_private_opnapi3.0.yaml')

  try {
    for (const file of apiSpecFiles) {
      await SwaggerParser.validate(file)
    }
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
  logger.info('Successfully validated api_specs yaml files.')
}

validateApiSpec()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as yaml from 'js-yaml'
import { Logger } from 'nestjs-pino'
import { writeFileSync } from 'fs'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false })
  //use pino as app logger
  const logger = app.get(Logger)
  app.useLogger(logger)
  app.setGlobalPrefix('/v1')

  const options = new DocumentBuilder()
    .setTitle('Connected Benefit Consent Capture API')
    .setDescription('The Connected Benefit Consent Capture  API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  const path = 'openapi.yaml'
  const data = yaml.dump(document, { noRefs: true })

  logger.log('Successfully validated OpenAPI spec.')
  writeFileSync(path, data)
  logger.log(`Successfully wrote '${path}'.`)
  logger.log(
    'GENERATE_OPENAPI_YAML environment variable present; refusing to start application.',
  )
  process.exit(0)
}
bootstrap()

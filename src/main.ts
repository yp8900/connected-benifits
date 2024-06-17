import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { writeFileSync } from 'fs'
import { ConfigService } from '@nestjs/config'
import { Logger } from 'nestjs-pino'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false })
  //use pino as app logger
  app.enableCors({
    /**
     * If `true`, the value will reflect the request origin. Setting to
     * `false` will disable CORS altogether. Otherwise, use the value
     * provided by the environment.
     *
     * @see https://github.com/expressjs/cors#configuration-options
     */
    origin: (origin, callback) => {
      callback(null, true)
    },
    credentials: true,
  })
  const logger = app.get(Logger)
  app.useLogger(logger)
  app.setGlobalPrefix('/v1')

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT', 3000)
  const nodeEnv = configService.get('NODE_ENV')

  const config = new DocumentBuilder()
    .setTitle('Connected Benefit Consent Capture API')
    .setDescription('The Connected Benefit Consent Capture  API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  writeFileSync('./openapi.json', JSON.stringify(document))
  SwaggerModule.setup('api', app, document)

  await app.listen(port)

  logger.log(`Application is running in '${nodeEnv}' mode on port ${port}`)
}
bootstrap()

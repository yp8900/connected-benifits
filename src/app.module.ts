import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module'
import { UserConsentModule } from './user-consent/user.consent.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get('MONGODB_URL')
        // const mongoDbInMemory =
        //   configService.get('MONGO_DB_SERVER_IN_MEMORY') === 'true'
        // if (mongoDbInMemory) {
        //   const mongo = await MongoMemoryServer.create()
        //   mongoUri = await mongo.getUri()
        // }
        return {
          uri: mongoUri,
        }
      },
    }),
    HealthModule,
    UserConsentModule,
  ],
})
export class AppModule {}

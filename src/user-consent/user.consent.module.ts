import { Module, OnModuleInit } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { UserConsentController } from './user.consent.controller'
import { UserConsentService } from './services/user.consent.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserConsent, UserConsentSchema } from './schemas/user.consent.schema'
import { DataPresetService } from './services/data.preset.service'
import { ConfigService } from '@nestjs/config'
import { DataHubService } from './services/data.hub.service'
import { TokenService } from './services/token.service'
import { DataHubController } from './data-hub.controller'
import { UiContentService } from './services/ui.content.service'
import { UiContent, UiContentSchema } from './schemas/ui.content.schema'
import { UiAemContentService } from './services/ui.aem.content.service'
import {
  UiAemContent,
  UiAemContentSchema,
} from './schemas/ui.aem.content.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserConsent.name, schema: UserConsentSchema },
      { name: UiContent.name, schema: UiContentSchema },
      { name: UiAemContent.name, schema: UiAemContentSchema },
    ]),
    HttpModule,
  ],
  controllers: [UserConsentController, DataHubController],
  providers: [
    UserConsentService,
    DataPresetService,
    DataHubService,
    TokenService,
    UiContentService,
    UiAemContentService,
  ],
})
export class UserConsentModule implements OnModuleInit {
  constructor(
    private readonly dataPresetService: DataPresetService,
    private configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const preLoadEnabled = this.configService.get('PRELOAD_ENABLED') === 'true'
    if (preLoadEnabled) {
      this.dataPresetService.preloadData()
    }
  }
}

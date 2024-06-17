import { Test, TestingModule } from '@nestjs/testing'
import { UserConsentModule } from './user.consent.module'
import { DataPresetService } from './services/data.preset.service'
import { ConfigService } from '@nestjs/config'

describe('UserConsentModule', () => {
  let module: UserConsentModule
  let dataPresetService: DataPresetService
  let configService: ConfigService

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        UserConsentModule,
        {
          provide: DataPresetService,
          useValue: {
            preloadData: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('true'),
          },
        },
      ],
    }).compile()

    module = testingModule.get<UserConsentModule>(UserConsentModule)
    dataPresetService = testingModule.get<DataPresetService>(DataPresetService)
    configService = testingModule.get<ConfigService>(ConfigService)
  })

  it('should preload data if PRELOAD_ENABLED is true', async () => {
    await module.onModuleInit()
    expect(configService.get).toHaveBeenCalledWith('PRELOAD_ENABLED')
    expect(dataPresetService.preloadData).toBeCalled()
  })
})

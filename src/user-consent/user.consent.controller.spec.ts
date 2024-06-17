import { Test, TestingModule } from '@nestjs/testing'
import { Connection, Model, connect } from 'mongoose'
import { UserConsentController } from './user.consent.controller'
import { UserConsentService } from './services/user.consent.service'
import { DataPresetService } from './services/data.preset.service'
import { MongoMemoryServer } from 'mongodb-memory-server'
import {
  UserConsent,
  UserConsentDocument,
  UserConsentSchema,
} from './schemas/user.consent.schema'
import { getModelToken } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as data from './data/data-preset.json'
import { DataHubService } from './services/data.hub.service'
import { TokenService } from './services/token.service'
import { HttpService, HttpModule } from '@nestjs/axios'
import { of } from 'rxjs'
import { UiContentService } from './services/ui.content.service'
import {
  UiContent,
  UiContentDocument,
  UiContentSchema,
} from './schemas/ui.content.schema'
import { UiAemContentService } from './services/ui.aem.content.service'
import {
  UiAemContent,
  UiAemContentDocument,
  UiAemContentSchema,
} from './schemas/ui.aem.content.schema'

describe('userConsentController', () => {
  let controller: UserConsentController
  let mongod: MongoMemoryServer
  let mongoConnection: Connection
  let userConsentModel: Model<UserConsentDocument>
  let uiContentModel: Model<UiContentDocument>
  let uiAemContentModel: Model<UiAemContentDocument>
  let dataPresetService: DataPresetService
  let uiContentService: UiContentService

  beforeEach(async () => {
    if (mongoConnection) {
      await mongoConnection.close()
      await mongod.stop()
    }

    mongod = await MongoMemoryServer.create()
    const uri = await mongod.getUri()
    mongoConnection = (await connect(uri)).connection

    userConsentModel = mongoConnection.model<UserConsentDocument>(
      UserConsent.name,
      UserConsentSchema,
    )

    uiContentModel = mongoConnection.model<UiContentDocument>(
      UiContent.name,
      UiContentSchema,
    )

    uiAemContentModel = mongoConnection.model<UiAemContentDocument>(
      UiAemContent.name,
      UiAemContentSchema,
    )

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), HttpModule],
      controllers: [UserConsentController],
      providers: [
        UserConsentService,
        DataPresetService,
        {
          provide: getModelToken(UserConsent.name),
          useValue: userConsentModel,
        },
        {
          provide: getModelToken(UiContent.name),
          useValue: uiContentModel,
        },
        {
          provide: getModelToken(UiAemContent.name),
          useValue: uiAemContentModel,
        },
        ConfigService,
        DataHubService,
        TokenService,
        UiContentService,
        UiAemContentService,
      ],
    })
      .overrideProvider(HttpService)
      .useValue({
        get: jest
          .fn()
          .mockReturnValue(of({ data: 'mocked data', status: 200 })),
        post: jest
          .fn()
          .mockReturnValue(of({ data: 'mocked data', status: 200 })),
        put: jest
          .fn()
          .mockReturnValue(of({ data: 'mocked data', status: 200 })),
        delete: jest
          .fn()
          .mockReturnValue(of({ data: 'mocked data', status: 200 })),
        // Add other methods as needed
      })
      .compile()

    controller = module.get<UserConsentController>(UserConsentController)

    dataPresetService = module.get<DataPresetService>(DataPresetService)
    uiContentService = module.get<UiContentService>(UiContentService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(async () => {
    await mongoConnection.close()
    await mongod.stop()
  })

  it('should be defined', () => {
    expect(dataPresetService).toBeDefined()
  })

  it('findByHashId should return correct result', async () => {
    await dataPresetService.preloadData()
    const getuserConsentDto = await controller.findByHashId(
      'ddd8d01feb087bdd6af0b349158d7eeec53be9674beea7a38f009e8fd689ca5a56c31acd2c\
0ed1867bd1fed548a03a1cbe446d82bb6722282e26f8edb107cd38',
    )
    expect(getuserConsentDto).not.toBe(null)
    expect(getuserConsentDto.userDetails).not.toBe(null)
    expect(getuserConsentDto.adultDependents).not.toBe(null)
    expect(getuserConsentDto.userDetails.email).toBe('john.smith@email.com')
    expect(getuserConsentDto.userDetails.phone).toBe('823-978-2341')
    expect(getuserConsentDto.userDetails.firstName).toBe('John')
    expect(getuserConsentDto.userDetails.lastName).toBe('Smith')
    expect(getuserConsentDto.userDetails.zip).toBe('27413')

    expect(getuserConsentDto.consentLegalVersion).toBe('20240226-2A')
    expect(getuserConsentDto.consentRequestedAt).toBe(
      '2024-03-28T14:36:59.213-05:00',
    )
    expect(getuserConsentDto.consentReceivedAt).toBe(null)

    expect(getuserConsentDto.adultDependents.length).toBe(2)
    expect(getuserConsentDto.adultDependents[0].firstName).toBe('Brown')
    expect(getuserConsentDto.adultDependents[0].lastName).toBe('Smith')
    expect(getuserConsentDto.adultDependents[0].adultDependentEmail).toBe(
      undefined,
    )

    expect(getuserConsentDto.adultDependents[1].firstName).toBe('Morgan')
    expect(getuserConsentDto.adultDependents[1].lastName).toBe('Smith')
    expect(getuserConsentDto.adultDependents[1].adultDependentEmail).toBe(
      undefined,
    )
  })

  it('findByHashId should return null if the record is not found', async () => {
    await dataPresetService.preloadData()
    const getuserConsentDto = await controller.findByHashId(
      'ddd8d01feb087bdd6af0cs158d7eeec53be9674beea7a38f009e8fd689ca5a56c31acd2c\
0ed1867bd1fed548a03a1cbe446d82bb6722282e26f8edb107cd38',
    )
    expect(getuserConsentDto).toBe(null)
  })

  it('should update by hashId', async () => {
    await dataPresetService.preloadData()
    const hashId =
      'ddd8d01feb087bdd6af0b349158d7eeec53be9674beea7a38f009e8fd689ca5a56c31acd2c\
0ed1867bd1fed548a03a1cbe446d82bb6722282e26f8edb107cd38'

    await controller.consentByHashId(hashId)

    const getuserConsentDto = await controller.findByHashId(
      'ddd8d01feb087bdd6af0b349158d7eeec53be9674beea7a38f009e8fd689ca5a56c31acd2c\
0ed1867bd1fed548a03a1cbe446d82bb6722282e26f8edb107cd38',
    )
    expect(getuserConsentDto).not.toBe(null)
    expect(getuserConsentDto.userDetails).not.toBe(null)
    expect(getuserConsentDto.adultDependents).not.toBe(null)
    expect(getuserConsentDto.userDetails.email).toBe('john.smith@email.com')
    expect(getuserConsentDto.userDetails.phone).toBe('823-978-2341')
    expect(getuserConsentDto.userDetails.firstName).toBe('John')
    expect(getuserConsentDto.userDetails.lastName).toBe('Smith')
    expect(getuserConsentDto.userDetails.zip).toBe('27413')

    expect(getuserConsentDto.consentLegalVersion).toBe('20240226-2A')
    expect(getuserConsentDto.consentRequestedAt).toBe(
      '2024-03-28T14:36:59.213-05:00',
    )
    expect(getuserConsentDto.consentReceivedAt).not.toBe(null)

    expect(getuserConsentDto.adultDependents.length).toBe(2)
    expect(getuserConsentDto.adultDependents[0].firstName).toBe('Brown')
    expect(getuserConsentDto.adultDependents[0].lastName).toBe('Smith')
    expect(getuserConsentDto.adultDependents[0].adultDependentEmail).toBe(
      undefined,
    )

    expect(getuserConsentDto.adultDependents[1].firstName).toBe('Morgan')
    expect(getuserConsentDto.adultDependents[1].lastName).toBe('Smith')
    expect(getuserConsentDto.adultDependents[1].adultDependentEmail).toBe(
      undefined,
    )
  })

  it('should not update by hashId, if not found', async () => {
    await dataPresetService.preloadData()
    const hashId =
      'ddd8d01feb087bdd6afdd349158d7eeec53be9674beea7a38f009e8fd689ca5a56c31acd2c\
0ed1867bd1fed548a03a1cbe446d82bb6722282e26f8edb107cd38'

    await controller.consentByHashId(hashId)

    const getuserConsentDto = await controller.findByHashId(
      'ddd8d01feb087bdd6af0b349158d7eeec53be9674beea7a38f009e8fd689ca5a56c31acd2c\
0ed1867bd1fed548a03a1cbe446d82bb6722282e26f8edb107cd38',
    )
    expect(getuserConsentDto).not.toBe(null)
    expect(getuserConsentDto.userDetails).not.toBe(null)
    expect(getuserConsentDto.adultDependents).not.toBe(null)
    expect(getuserConsentDto.userDetails.email).toBe('john.smith@email.com')
    expect(getuserConsentDto.userDetails.phone).toBe('823-978-2341')
    expect(getuserConsentDto.userDetails.firstName).toBe('John')
    expect(getuserConsentDto.userDetails.lastName).toBe('Smith')
    expect(getuserConsentDto.userDetails.zip).toBe('27413')

    expect(getuserConsentDto.consentLegalVersion).toBe('20240226-2A')
    expect(getuserConsentDto.consentRequestedAt).toBe(
      '2024-03-28T14:36:59.213-05:00',
    )
    expect(getuserConsentDto.consentReceivedAt).toBe(null)

    expect(getuserConsentDto.adultDependents.length).toBe(2)
    expect(getuserConsentDto.adultDependents[0].firstName).toBe('Brown')
    expect(getuserConsentDto.adultDependents[0].lastName).toBe('Smith')
    expect(getuserConsentDto.adultDependents[0].adultDependentEmail).toBe(
      undefined,
    )

    expect(getuserConsentDto.adultDependents[1].firstName).toBe('Morgan')
    expect(getuserConsentDto.adultDependents[1].lastName).toBe('Smith')
    expect(getuserConsentDto.adultDependents[1].adultDependentEmail).toBe(
      undefined,
    )
  })

  it('should revoke consent by hashId', async () => {
    await dataPresetService.preloadData()
    const hashId =
      '74db7116b6cd2adabed4b4f7a6e5a2ce808d08dde9ba46c265d3671f54ff795752062af1b19da\
0ad6aec9cefe499735c344300f0e8623c71d47c8250aabc195c'

    const getuserConsentDto = await controller.findByHashId(
      '74db7116b6cd2adabed4b4f7a6e5a2ce808d08dde9ba46c265d3671f54ff795752062af1b19da\
0ad6aec9cefe499735c344300f0e8623c71d47c8250aabc195c',
    )
    expect(getuserConsentDto).not.toBe(null)
    expect(getuserConsentDto.consentReceivedAt).not.toBe(null)
    await controller.revokeConsentByHashId(hashId)

    const updateduserConsentDto = await controller.findByHashId(hashId)
    expect(updateduserConsentDto).not.toBe(null)
    expect(updateduserConsentDto.consentReceivedAt).toBe(null)
  })

  it('should create employee consent by hashId', async () => {
    const record = data[1]
    await controller.createuserConsent(record)
    const hashId =
      'ddd8d01feb087bdd6af0b349158d7eeec53be9674beea7a38f009e8fd689ca5a56c31acd2c\
0ed1867bd1fed548a03a1cbe446d82bb6722282e26f8edb107cd38'

    const getuserConsentDto = await controller.findByHashId(
      'ddd8d01feb087bdd6af0b349158d7eeec53be9674beea7a38f009e8fd689ca5a56c31acd2c\
0ed1867bd1fed548a03a1cbe446d82bb6722282e26f8edb107cd38',
    )
    expect(getuserConsentDto).not.toBe(null)
    expect(getuserConsentDto).not.toBe(null)
    expect(getuserConsentDto.userDetails).not.toBe(null)
    expect(getuserConsentDto.adultDependents).not.toBe(null)
    expect(getuserConsentDto.userDetails.email).toBe('john.smith@email.com')
    expect(getuserConsentDto.userDetails.phone).toBe('823-978-2341')
    expect(getuserConsentDto.userDetails.firstName).toBe('John')
    expect(getuserConsentDto.userDetails.lastName).toBe('Smith')
    expect(getuserConsentDto.userDetails.zip).toBe('27413')

    expect(getuserConsentDto.consentLegalVersion).toBe('20240226-2A')
    expect(getuserConsentDto.consentRequestedAt).toBe(
      '2024-03-28T14:36:59.213-05:00',
    )

    expect(getuserConsentDto.adultDependents.length).toBe(2)
    expect(getuserConsentDto.adultDependents[0].firstName).toBe('Brown')
    expect(getuserConsentDto.adultDependents[0].lastName).toBe('Smith')
    expect(getuserConsentDto.adultDependents[0].adultDependentEmail).toBe(
      undefined,
    )

    expect(getuserConsentDto.adultDependents[1].firstName).toBe('Morgan')
    expect(getuserConsentDto.adultDependents[1].lastName).toBe('Smith')
    expect(getuserConsentDto.adultDependents[1].adultDependentEmail).toBe(
      undefined,
    )
    await controller.revokeConsentByHashId(hashId)

    const updateduserConsentDto = await controller.findByHashId(hashId)
    expect(updateduserConsentDto).not.toBe(null)
    expect(updateduserConsentDto.consentReceivedAt).toBe(null)
  })

  it('should create employee consent by hashId', async () => {
    const record = data[1]
    await controller.createuserConsent(record)
    const hashId =
      'ddd8d01feb087bdd6af0b349158d7eeec53be9674beea7a38f009e8fd689ca5a56c31acd2c\
0ed1867bd1fed548a03a1cbe446d82bb6722282e26f8edb107cd38'

    const getuserConsentDto = await controller.findByHashId(
      'ddd8d01feb087bdd6af0b349158d7eeec53be9674beea7a38f009e8fd689ca5a56c31acd2c\
0ed1867bd1fed548a03a1cbe446d82bb6722282e26f8edb107cd38',
    )
    expect(getuserConsentDto).not.toBe(null)
    expect(getuserConsentDto).not.toBe(null)
    expect(getuserConsentDto.userDetails).not.toBe(null)
    expect(getuserConsentDto.adultDependents).not.toBe(null)
    expect(getuserConsentDto.userDetails.email).toBe('john.smith@email.com')
    expect(getuserConsentDto.userDetails.phone).toBe('823-978-2341')
    expect(getuserConsentDto.userDetails.firstName).toBe('John')
    expect(getuserConsentDto.userDetails.lastName).toBe('Smith')
    expect(getuserConsentDto.userDetails.zip).toBe('27413')

    expect(getuserConsentDto.consentLegalVersion).toBe('20240226-2A')
    expect(getuserConsentDto.consentRequestedAt).toBe(
      '2024-03-28T14:36:59.213-05:00',
    )

    expect(getuserConsentDto.adultDependents.length).toBe(2)
    expect(getuserConsentDto.adultDependents[0].firstName).toBe('Brown')
    expect(getuserConsentDto.adultDependents[0].lastName).toBe('Smith')
    expect(getuserConsentDto.adultDependents[0].adultDependentEmail).toBe(
      undefined,
    )

    expect(getuserConsentDto.adultDependents[1].firstName).toBe('Morgan')
    expect(getuserConsentDto.adultDependents[1].lastName).toBe('Smith')
    expect(getuserConsentDto.adultDependents[1].adultDependentEmail).toBe(
      undefined,
    )
    await controller.revokeConsentByHashId(hashId)

    const updateduserConsentDto = await controller.findByHashId(hashId)
    expect(updateduserConsentDto).not.toBe(null)
    expect(updateduserConsentDto.consentReceivedAt).toBe(null)
  })

  it('should patch adult dependent email by hashId', async () => {
    await dataPresetService.preloadData()
    const hashId =
      '74db7116b6cd2adad3d4b4f7a6e5a2ce808d08dde9ba46c265d3671f54ff795752062af1b19da\
0ad6aec9cefe499735c344300f0e8623c71d47c8250aabc195c'
    await controller.patchUserConsent(hashId, {
      adultDependents: [
        {
          firstName: 'Mary',
          lastName: 'Smith',
          adultDependentEmail: 'mary.smith@email.com',
        },
        {
          firstName: 'Jack',
          lastName: 'Smith',
          adultDependentEmail: 'jack.smith@email.com',
        },
      ],
    })

    const getuserConsentDto = await controller.findByHashId(
      '74db7116b6cd2adad3d4b4f7a6e5a2ce808d08dde9ba46c265d3671f54ff795752062af1b19da\
0ad6aec9cefe499735c344300f0e8623c71d47c8250aabc195c',
    )
    expect(getuserConsentDto).not.toBe(null)
    expect(getuserConsentDto.userDetails).not.toBe(null)
    expect(getuserConsentDto.adultDependents).not.toBe(null)
    expect(getuserConsentDto.userDetails.email).toBe('jsmith@email.com')
    expect(getuserConsentDto.userDetails.phone).toBe('823-908-2341')
    expect(getuserConsentDto.userDetails.firstName).toBe('John')
    expect(getuserConsentDto.userDetails.lastName).toBe('Smith')
    expect(getuserConsentDto.userDetails.zip).toBe('27713')

    expect(getuserConsentDto.consentLegalVersion).toBe('20241220-1C')
    expect(getuserConsentDto.consentRequestedAt).toBe(
      '2025-01-28T14:36:59.213-05:00',
    )
    expect(getuserConsentDto.consentReceivedAt).not.toBe(null)

    expect(getuserConsentDto.adultDependents.length).toBe(2)
    expect(getuserConsentDto.adultDependents[0].firstName).toBe('Mary')
    expect(getuserConsentDto.adultDependents[0].lastName).toBe('Smith')
    expect(getuserConsentDto.adultDependents[0].adultDependentEmail).toBe(
      'mary.smith@email.com',
    )

    expect(getuserConsentDto.adultDependents[1].firstName).toBe('Jack')
    expect(getuserConsentDto.adultDependents[1].lastName).toBe('Smith')
    expect(getuserConsentDto.adultDependents[1].adultDependentEmail).toBe(
      'jack.smith@email.com',
    )
  })

  it('should get the ui content correctly', async () => {
    await uiContentService.preloadData()
    const getUiContentDto = await controller.findUiContent(
      'cb-ui-static-page-content',
      'cb-ui',
    )

    expect(getUiContentDto).not.toBe(null)
    expect(getUiContentDto.business).toBe('cb-ui')
    expect(getUiContentDto.name).toBe('cb-ui-static-page-content')
    expect(getUiContentDto.data).not.toBe(null)
  })

  it('should get the ui content with null value if not imported', async () => {
    const getUiContentDto = await controller.findUiContent(
      'cb-ui-static-page-content',
      'cb-ui',
    )

    expect(getUiContentDto).toBe(null)
  })

  it('should get the ui aem content fqa correctly', async () => {
    await dataPresetService.preloadData()
    const getUiAemContentDto = await controller.findUiAemContent(
      'cb-ui-aem-faq-content',
      'cb-aem-faq',
    )

    expect(getUiAemContentDto).not.toBe(null)
    expect(getUiAemContentDto.business).toBe('cb-aem-faq')
    expect(getUiAemContentDto.name).toBe('cb-ui-aem-faq-content')
    expect(getUiAemContentDto.data).not.toBe(null)
  })

  it('should get the ui aem content fqa with null if not imported', async () => {
    const getUiAemContentDto = await controller.findUiAemContent(
      'cb-ui-aem-faq-content2',
      'cb-aem-faq',
    )

    expect(getUiAemContentDto).toBe(null)
  })
})

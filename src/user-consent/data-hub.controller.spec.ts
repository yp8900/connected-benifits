import { Test, TestingModule } from '@nestjs/testing'
import { DataHubController } from './data-hub.controller'
import { DataHubConsentDto } from './dto/DataHubConsentDto'
import { DataHubUserConsentResDto } from './dto/DataHubUserConsentResDto'
import { DataHubUserConsentDto } from './dto/DataHubUserConsentDto'
import { DataHubConsentResDto } from './dto/DataHubConsentResDto'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, connect } from 'mongoose'

describe('DataHubController', () => {
  let controller: DataHubController
  let mongod: MongoMemoryServer
  let mongoConnection: Connection

  beforeEach(async () => {
    if (mongoConnection) {
      await mongoConnection.close()
      await mongod.stop()
    }

    mongod = await MongoMemoryServer.create()
    const uri = await mongod.getUri()
    mongoConnection = (await connect(uri)).connection

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataHubController],
    }).compile()

    controller = module.get<DataHubController>(DataHubController)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(async () => {
    await mongoConnection.close()
    await mongod.stop()
  })

  describe('patchUserConsent', () => {
    it('should return the patched user consent', async () => {
      const userConsentDto: DataHubUserConsentDto = {
        employeeIdentifier: '',
        adultDependents: [],
      }
      const result: DataHubUserConsentResDto =
        await controller.patchUserConsent(userConsentDto)
      expect(result.dataHubUserConsentDto).toEqual(userConsentDto)
    })
  })

  describe('patchConsent', () => {
    it('should return the patched consent', async () => {
      const consentDto: DataHubConsentDto = {
        userIdentifier: '',
        employeeIdentifier: '',
        consentLegalVersion: '',
        consentRequestedAt: '',
        consentReceivedAt: '',
      }
      const result: DataHubConsentResDto =
        await controller.PatchConsent(consentDto)
      expect(result.dataHubConsentDto).toEqual(consentDto)
    })
  })
})

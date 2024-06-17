import { Test, TestingModule } from '@nestjs/testing'
import { HttpService } from '@nestjs/axios'
import { of } from 'rxjs'
import { DataHubService } from './data.hub.service'
import { TokenService } from './token.service'
import { ConfigService } from '@nestjs/config'
import { DataHubConsentDto } from '../dto/DataHubConsentDto'
import { DataHubUserConsentDto } from '../dto/DataHubUserConsentDto'

describe('DataHubService', () => {
  let service: DataHubService
  let httpService: HttpService
  let tokenService: TokenService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataHubService,
        {
          provide: HttpService,
          useValue: {
            put: jest.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: TokenService,
          useValue: {
            getAccessToken: jest.fn().mockReturnValue('mocked-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked-url'),
          },
        },
      ],
    }).compile()

    service = module.get<DataHubService>(DataHubService)
    httpService = module.get<HttpService>(HttpService)
    tokenService = module.get<TokenService>(TokenService)
  })

  it('should return the headers with the access token', async () => {
    // Mock the getAccessToken method of the TokenService
    const mockAccessToken: Promise<string> =
      Promise.resolve('mock-access-token')
    jest.spyOn(tokenService, 'getAccessToken').mockReturnValue(mockAccessToken)

    // Call the buildHeaders method
    const headers = await service.buildHeaders()

    // Assert the expected headers
    expect(headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mockAccessToken}`,
    })
  })

  it('should patch user consent', async () => {
    const dto: DataHubUserConsentDto = {
      employeeIdentifier: '',
      adultDependents: [],
    }
    await service.patchUserConsent(dto)
    expect(httpService.put).toHaveBeenCalledWith(
      'mocked-url/data-hub/user-consent',
      dto,
      expect.anything(),
    )
  })

  it('should patch consent', async () => {
    const dto: DataHubConsentDto = {
      userIdentifier: '',
      employeeIdentifier: '',
      consentLegalVersion: '',
      consentRequestedAt: '',
      consentReceivedAt: '',
    }
    await service.patchConsent(dto)
    expect(httpService.put).toHaveBeenCalledWith(
      'mocked-url/consent',
      dto,
      expect.anything(),
    )
  })
})

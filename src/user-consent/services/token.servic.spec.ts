import { Test, TestingModule } from '@nestjs/testing'
import { HttpService } from '@nestjs/axios'
import { TokenService } from './token.service'
import { of } from 'rxjs'
import {
  APIM_GPM_CLIENT_ID,
  APIM_GPM_CLIENT_SECRET,
  APIM_GPM_TOKEN_ENDPOINT,
} from './../../utils/constant'

describe('TokenService', () => {
  let service: TokenService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: HttpService,
          useValue: {
            post: jest
              .fn()
              .mockReturnValue(of({ data: { access_token: 'new-token' } })),
          },
        },
      ],
    }).compile()

    service = module.get<TokenService>(TokenService)
    httpService = module.get<HttpService>(HttpService)
  })

  it('should get a new token if current token is null', async () => {
    service['token'] = null
    expect(await service.getAccessToken()).toBe('new-token')
    expect(httpService.post).toHaveBeenCalledWith(APIM_GPM_TOKEN_ENDPOINT, {
      client_id: APIM_GPM_CLIENT_ID,
      client_secret: APIM_GPM_CLIENT_SECRET,
      grant_type: 'client_credentials',
    })
  })

  it('should get a new token if current token is expired', async () => {
    service['token'] = 'expired-token'
    service['tokenRetriveAt'] = new Date(Date.now() - 700000).toISOString() // Set the token retrieve time to more than 10 minutes ago
    expect(await service.getAccessToken()).toBe('new-token')
    expect(httpService.post).toHaveBeenCalledWith(APIM_GPM_TOKEN_ENDPOINT, {
      client_id: APIM_GPM_CLIENT_ID,
      client_secret: APIM_GPM_CLIENT_SECRET,
      grant_type: 'client_credentials',
    })
  })
})

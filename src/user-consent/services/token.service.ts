import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import {
  APIM_GPM_CLIENT_ID,
  APIM_GPM_CLIENT_SECRET,
  APIM_GPM_TOKEN_ENDPOINT,
} from '../../utils/constant'

@Injectable()
export class TokenService {
  constructor(private httpService: HttpService) {}

  private token: string = 'mock-token'
  private tokenRetriveAt: string = new Date().toISOString()

  async getAccessToken(): Promise<string> {
    if (
      !this.token ||
      Date.now() - new Date(this.tokenRetriveAt).getTime() > 600000
    ) {
      this.token = await this.getToken()
      this.tokenRetriveAt = new Date().toISOString()
    }
    return this.token
  }

  async getToken(): Promise<string> {
    const clientId = APIM_GPM_CLIENT_ID
    const clientSecret = APIM_GPM_CLIENT_SECRET
    const tokenEndpoint = APIM_GPM_TOKEN_ENDPOINT

    const body = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }

    const { data } = await lastValueFrom(
      this.httpService.post(tokenEndpoint, body),
    )
    return data.access_token
  }
}

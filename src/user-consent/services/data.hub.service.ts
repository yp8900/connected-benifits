import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { DataHubConsentDto } from '../dto/DataHubConsentDto'
import { DataHubUserConsentDto } from '../dto/DataHubUserConsentDto'
import { TokenService } from './token.service'
import { lastValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class DataHubService {
  constructor(
    private httpService: HttpService,
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {}

  buildHeaders = async (): Promise<object> => {
    const token = this.tokenService.getAccessToken()
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
    return headers
  }

  async patchUserConsent(
    dataHubUserConsentDto: DataHubUserConsentDto,
  ): Promise<void> {
    const putUrl =
      this.configService.get('DATA_HUB_BASE_URL') + '/data-hub/user-consent'
    const headers = await this.buildHeaders()

    await lastValueFrom(
      this.httpService.put(putUrl, dataHubUserConsentDto, {
        headers,
        timeout: 5000,
      }),
    )
  }

  async patchConsent(dataHubConsentDto: DataHubConsentDto): Promise<void> {
    const putUrl = this.configService.get('DATA_HUB_BASE_URL') + '/consent'
    const headers = await this.buildHeaders()

    await lastValueFrom(
      this.httpService.put(putUrl, dataHubConsentDto, {
        headers,
        timeout: 5000,
      }),
    )
  }
}

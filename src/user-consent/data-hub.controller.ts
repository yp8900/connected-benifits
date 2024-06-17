import { Body, Controller, Put } from '@nestjs/common'
import { DataHubConsentDto } from './dto/DataHubConsentDto'
import { DataHubUserConsentResDto } from './dto/DataHubUserConsentResDto'
import { DataHubUserConsentDto } from './dto/DataHubUserConsentDto'
import { DataHubConsentResDto } from './dto/DataHubConsentResDto'

@Controller('api/data-hub')
export class DataHubController {
  @Put('user-consent')
  async patchUserConsent(
    @Body() dataHubUserConsentDto: DataHubUserConsentDto,
  ): Promise<DataHubUserConsentResDto> {
    return { dataHubUserConsentDto }
  }

  @Put('consent')
  async PatchConsent(
    @Body() dataHubConsentDto: DataHubConsentDto,
  ): Promise<DataHubConsentResDto> {
    return {
      dataHubConsentDto,
    }
  }
}

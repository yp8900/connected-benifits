import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { UserConsentService } from './services/user.consent.service'
import { GetuserConsentDto } from './dto/GetUserContentDto'
import { CreateUserConsentDto } from './dto/CreateUserConsentDto'
import { PatchUserConsentDto } from './dto/PatchUserConsentDto'
import { UiContentService } from './services/ui.content.service'
import { GetUiContentDto } from './dto/GetUiCongentDto'
import { UiAemContentService } from './services/ui.aem.content.service'
import { GetUiAemContentDto } from './dto/GetUiAemContentDto'

@Controller('api/user-consent')
export class UserConsentController {
  constructor(
    private readonly userConsentService: UserConsentService,
    private readonly uiContentService: UiContentService,
    private readonly uiAemContentService: UiAemContentService,
  ) {}

  @Get('consent/:hashId')
  async findByHashId(
    @Param('hashId') hashId: string,
  ): Promise<GetuserConsentDto> {
    return this.userConsentService.findByHashId(hashId)
  }

  @Put('consent/:hashId/consent')
  async consentByHashId(@Param('hashId') hashId: string): Promise<void> {
    return this.userConsentService.consentByHashId(hashId)
  }

  @Put('consent/:hashId/revoke')
  async revokeConsentByHashId(@Param('hashId') hashId: string): Promise<void> {
    return this.userConsentService.revokeConsentByHashId(hashId)
  }

  @Post()
  async createuserConsent(
    @Body() createuserConsentDto: CreateUserConsentDto,
  ): Promise<void> {
    return this.userConsentService.newUserConsent(createuserConsentDto)
  }

  @Patch('consent/:hashId')
  async patchUserConsent(
    @Param('hashId') hashId: string,
    @Body() patchUserConsentDto: PatchUserConsentDto,
  ): Promise<void> {
    return this.userConsentService.patchUserConsent(hashId, patchUserConsentDto)
  }

  @Get('ui-content/')
  async findUiContent(
    @Query('name') name: string,
    @Query('business') business: string,
  ): Promise<GetUiContentDto> {
    return this.uiContentService.findUiContent(name, business)
  }

  @Get('ui-aem-content/')
  async findUiAemContent(
    @Query('name') name: string,
    @Query('business') business: string,
  ): Promise<GetUiAemContentDto> {
    return this.uiAemContentService.findAemUiContent(name, business)
  }
}

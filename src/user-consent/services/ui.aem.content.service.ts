import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  UiAemContent,
  UiAemContentDocument,
} from '../schemas/ui.aem.content.schema'
import { GetUiAemContentDto } from '../dto/GetUiAemContentDto'

@Injectable()
export class UiAemContentService {
  constructor(
    @InjectModel(UiAemContent.name)
    private uiAemContentModel: Model<UiAemContentDocument>,
  ) {}

  async findAemUiContent(
    name: string,
    business: string,
  ): Promise<GetUiAemContentDto> {
    const uiAemContent = await this.uiAemContentModel
      .findOne(
        { name: name, business: business },
        {
          _id: 0,
        },
      )
      .exec()

    if (!uiAemContent) {
      return null
    }

    const getUiAemContentDto: GetUiAemContentDto = {
      name: uiAemContent.name,
      business: uiAemContent.business,
      data: uiAemContent.data,
    }

    return getUiAemContentDto
  }
}

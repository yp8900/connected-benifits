import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as data from '../data/ui-content.json'
import { UiContent, UiContentDocument } from '../schemas/ui.content.schema'
import { GetUiContentDto } from '../dto/GetUiCongentDto'

@Injectable()
export class UiContentService {
  constructor(
    @InjectModel(UiContent.name)
    private uiContentModel: Model<UiContentDocument>,
  ) {}

  async preloadData(): Promise<void> {
    for (const uiContentItem of data) {
      await this.uiContentModel
        .findOneAndUpdate(
          {
            name: uiContentItem.name,
            business: uiContentItem.business,
          },
          uiContentItem,
          { upsert: true },
        )
        .exec()
    }
  }

  async findUiContent(
    name: string,
    business: string,
  ): Promise<GetUiContentDto> {
    const uiContent = await this.uiContentModel
      .findOne(
        { name: name, business: business },
        {
          _id: 0,
        },
      )
      .exec()

    if (!uiContent) {
      return null
    }

    const getUiContentDto: GetUiContentDto = {
      name: uiContent.name,
      business: uiContent.business,
      data: uiContent.data,
    }

    return getUiContentDto
  }
}

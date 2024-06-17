// demo-data.service.ts
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as data from '../data/data-preset.json'
import * as legalData from '../data/aem-content-consent-legal.json'
import * as faqData from '../data/aem-content-fqa.json'
import {
  UserConsent,
  UserConsentDocument,
} from '../schemas/user.consent.schema'
import {
  UiAemContent,
  UiAemContentDocument,
} from '../schemas/ui.aem.content.schema'

@Injectable()
export class DataPresetService {
  constructor(
    @InjectModel(UserConsent.name)
    private userConsentModel: Model<UserConsentDocument>,
    @InjectModel(UiAemContent.name)
    private uiAemContentModel: Model<UiAemContentDocument>,
  ) {}

  async preloadData(): Promise<void> {
    for (const userConsent of data) {
      await this.userConsentModel.findOneAndUpdate(
        {
          userIdentifier: userConsent.userIdentifier,
          employeeIdentifier: userConsent.employeeIdentifier,
        },
        userConsent,
        { upsert: true },
      )
    }

    for (const legalContent of legalData) {
      await this.uiAemContentModel.findOneAndUpdate(
        {
          name: legalContent.name,
          business: legalContent.business,
        },
        legalContent,
        { upsert: true },
      )
    }

    for (const faqContent of faqData) {
      await this.uiAemContentModel.findOneAndUpdate(
        {
          name: faqContent.name,
          business: faqContent.business,
        },
        faqContent,
        { upsert: true },
      )
    }
  }
}

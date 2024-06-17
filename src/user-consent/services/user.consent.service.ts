import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { GetuserConsentDto } from '../dto/GetUserContentDto'
import { UserConsent } from '../schemas/user.consent.schema'
import { CreateUserConsentDto } from '../dto/CreateUserConsentDto'
import { PatchUserConsentDto } from '../dto/PatchUserConsentDto'
import { DataHubService } from './data.hub.service'

@Injectable()
export class UserConsentService {
  constructor(
    @InjectModel(UserConsent.name)
    private readonly userConsentModel: Model<UserConsent>,
    private readonly dataHubService: DataHubService,
  ) {}

  async findByHashId(hashId: string): Promise<GetuserConsentDto> {
    const userConsent = await this.userConsentModel
      .findOne(
        { 'consents.hashedId': hashId },
        {
          _id: 0,
          'adultDependents._id': 0,
          'userDetails._id': 0,
        },
      )
      .exec()

    if (!userConsent) {
      return null
    }

    const consents = userConsent.consents.find(
      (consent) => consent.hashedId === hashId,
    )

    const getuserConsentDto: GetuserConsentDto = {
      userDetails: userConsent.userDetails,
      adultDependents: userConsent.adultDependents,
      consentLegalVersion: consents?.consentLegalVersion,
      consentRequestedAt: consents?.consentRequestedAt,
      consentReceivedAt: consents?.consentReceivedAt || null,
    }

    return getuserConsentDto
  }

  async consentByHashId(hashId: string): Promise<void> {
    const userConsent = await this.userConsentModel
      .findOne({ 'consents.hashedId': hashId })
      .exec()

    if (userConsent) {
      userConsent.consents.forEach((consents) => {
        if (consents.hashedId === hashId) {
          consents.consentReceivedAt = new Date().toISOString()
        }
      })

      await userConsent.save()
    }
  }

  async revokeConsentByHashId(hashId: string): Promise<void> {
    const userConsent = await this.userConsentModel
      .findOne({ 'consents.hashedId': hashId })
      .exec()

    if (userConsent) {
      userConsent.consents.forEach((consents) => {
        if (consents.hashedId === hashId) {
          consents.consentReceivedAt = null
        }
      })

      await userConsent.save()
    }
  }

  async newUserConsent(
    createuserConsentDto: CreateUserConsentDto,
  ): Promise<void> {
    const newuserConsentObj: UserConsent = {
      userIdentifier: createuserConsentDto.userIdentifier,
      employeeIdentifier: createuserConsentDto.employeeIdentifier,
      userDetails: createuserConsentDto.userDetails,
      adultDependents: createuserConsentDto.adultDependents,
      consents: createuserConsentDto.consents,
    }
    const existinguserConsent = await this.userConsentModel
      .findOne({
        userIdentifier: newuserConsentObj.userIdentifier,
        employeeIdentifier: newuserConsentObj.employeeIdentifier,
      })
      .exec()
    if (!existinguserConsent) {
      const newuserConsent = new this.userConsentModel(newuserConsentObj)
      await newuserConsent.save()
    }
  }

  async patchUserConsent(
    hashId: string,
    patchUserConsentDto: PatchUserConsentDto,
  ): Promise<void> {
    const userConsent = await this.userConsentModel
      .findOne({ 'consents.hashedId': hashId })
      .exec()
    if (userConsent && userConsent.adultDependents) {
      this.dataHubService.patchUserConsent({
        employeeIdentifier: userConsent.employeeIdentifier,
        adultDependents: patchUserConsentDto.adultDependents,
      })
      const adultDependentsByEmail = new Map(
        patchUserConsentDto.adultDependents.map((ad) => [
          ad.firstName + ad.lastName,
          ad,
        ]),
      )

      for (const userConsentAdultDependent of userConsent.adultDependents) {
        const matchingAdultDependent = adultDependentsByEmail.get(
          userConsentAdultDependent.firstName +
            userConsentAdultDependent.lastName,
        )
        if (matchingAdultDependent) {
          userConsentAdultDependent.adultDependentEmail =
            matchingAdultDependent.adultDependentEmail
        }
      }
      await this.userConsentModel.updateOne(
        { 'consents.hashedId': hashId },
        { $set: { adultDependents: userConsent.adultDependents } },
      )
    }
  }
}

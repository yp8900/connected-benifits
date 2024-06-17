import { Optional } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserConsentDocument = UserConsent & Document

@Schema()
class UserDetails {
  @Prop()
  firstName: string

  @Prop()
  lastName: string

  @Prop()
  phone: string

  @Prop()
  email: string

  @Prop()
  zip: string
}

@Schema()
class AdultDependent {
  @Prop()
  firstName: string

  @Prop()
  lastName: string

  @Prop()
  @Optional()
  adultDependentEmail?: string
}

@Schema()
class Consent {
  @Prop()
  hashedId: string

  @Prop()
  consentLegalVersion: string

  @Prop()
  consentRequestedAt: string

  @Prop()
  consentReceivedAt: string
}

@Schema({ collection: 'cb_user_consent' })
export class UserConsent {
  @Prop()
  userIdentifier: string

  @Prop()
  employeeIdentifier: string

  @Prop()
  userDetails: UserDetails

  @Prop([AdultDependent])
  adultDependents: AdultDependent[]

  @Prop([Consent])
  consents: Consent[]
}

export const UserConsentSchema = SchemaFactory.createForClass(UserConsent)

import { UserDetails, AdultDependentDto, Consent } from './GetUserContentDto'

export interface CreateUserConsentDto {
  userIdentifier: string
  employeeIdentifier: string
  userDetails: UserDetails
  adultDependents: AdultDependentDto[]
  consents: Consent[]
}

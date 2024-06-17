export interface UserDetails {
  firstName: string
  lastName: string
  phone: string
  email: string
  zip: string
}

export interface AdultDependentDto {
  firstName: string
  lastName: string
  adultDependentEmail?: string
}

export interface Consent {
  hashedId: string
  consentLegalVersion: string
  consentRequestedAt: string
  consentReceivedAt: string
}

export interface GetuserConsentDto {
  userDetails: UserDetails
  adultDependents: AdultDependentDto[]
  consentLegalVersion: string
  consentRequestedAt: string
  consentReceivedAt: string
}

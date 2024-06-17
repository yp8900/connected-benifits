import { AdultDependentDto } from './GetUserContentDto'

export interface DataHubUserConsentDto {
  employeeIdentifier: string
  adultDependents: AdultDependentDto[]
}

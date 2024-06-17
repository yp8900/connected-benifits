import { Test, TestingModule } from '@nestjs/testing'
import { HealthController } from './health.controller'
import { HealthModule } from './health.module'

describe('HealthModule', () => {
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile()
  })

  it('should be defined', () => {
    const controller = module.get<HealthController>(HealthController)
    expect(controller).toBeDefined()
  })
})

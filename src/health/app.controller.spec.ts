import { Test, TestingModule } from '@nestjs/testing'
import { HealthController } from './health.controller'

describe('HealthController', () => {
  let healthController: HealthController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [],
    }).compile()

    healthController = app.get<HealthController>(HealthController)
  })

  describe('root', () => {
    it('should return object with message ok', () => {
      expect(healthController.getHealthCheck()).not.toBe(null)
      expect(healthController.getHealthCheck().message).not.toBe(null)
    })
  })
})

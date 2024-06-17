import { Controller, Get } from '@nestjs/common'

export interface HealthCheckResponse {
  uptime: number
  message: string
  timestamp: number
}
@Controller('health')
export class HealthController {
  @Get('/check')
  getHealthCheck(): HealthCheckResponse {
    return {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    }
  }
}

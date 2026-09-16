import { Controller, Get } from '@nestjs/common';
@Controller('health')
export class HealthController {
  @Get('live') live(): { status: string } {
    return { status: 'ok' };
  }
  @Get('ready') ready(): { status: string; scope: string; database: string } {
    return { status: 'ok', scope: 'application', database: 'not_checked' };
  }
}

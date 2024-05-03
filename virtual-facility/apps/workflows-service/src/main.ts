import { NestFactory } from '@nestjs/core';
import { WorkflowsServiceModule } from './workflows-service.module';

async function bootstrap() {
  console.log('Starting Workflows Service');
  const app = await NestFactory.create(WorkflowsServiceModule);
  await app.listen(3001);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Thêm cấu hình CORS ở đây
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Thay đổi địa chỉ origin theo nguồn gốc của bạn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  };
  app.enableCors(corsOptions);

  await app.listen(3001);
}
bootstrap();


import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security headers - allow all origins for desktop app
  app.enableCors({
    origin: true, // Allow all origins for desktop app
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Get port from command line args or environment
  const args = process.argv.slice(2);
  const portArg = args.find(arg => arg === '--port');
  const portIndex = args.indexOf('--port');
  const port = portIndex !== -1 && portIndex + 1 < args.length
    ? parseInt(args[portIndex + 1], 10)
    : process.env.PORT || 3001;
    
  await app.listen(port, '0.0.0.0');
  console.log(`Prompt Jet Server running on http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();

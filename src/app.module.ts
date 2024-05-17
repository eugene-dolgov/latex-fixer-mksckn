import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatexFixerService } from './latex-fixer-service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, LatexFixerService],
})
export class AppModule {}

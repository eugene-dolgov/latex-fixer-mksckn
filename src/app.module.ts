import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatexFormattingService } from './latex-formatting.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, LatexFormattingService],
})
export class AppModule {}

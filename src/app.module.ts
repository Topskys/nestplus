import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { database } from './config';
import { ContentModule } from './modules/content/content.module';
import { CoreModule } from './modules/core/core.module';

@Module({
  imports: [CoreModule.forRoot(database()), ContentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

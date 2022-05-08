import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetsRepository } from './tweets.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TweetsRepository]), AuthModule],
  providers: [TweetsService],
  controllers: [TweetsController]
})
export class TweetsModule {}

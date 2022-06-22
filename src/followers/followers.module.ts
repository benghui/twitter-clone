import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowersRepository } from './followers.repository';
import { AuthModule } from '../auth/auth.module';
import { UsersRepository } from 'src/auth/users.repository';

@Module({
	imports: [TypeOrmModule.forFeature([FollowersRepository, UsersRepository]), AuthModule],
	providers: [FollowersService],
	controllers: [FollowersController]
})
export class FollowersModule { }

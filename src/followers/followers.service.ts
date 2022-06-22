import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from 'src/auth/users.repository';
import { Follower } from './follower.entity';
import { User } from '../auth/user.entity';
import { FollowersRepository } from './followers.repository';

@Injectable()
export class FollowersService {
	constructor(
		@InjectRepository(FollowersRepository)
		private followersRepository: FollowersRepository,

		@InjectRepository(UsersRepository)
		private usersRepository: UsersRepository
	) { }

	async addFollowUser(addUserToFollow: string, user: User): Promise<Follower> {
		const followingUser = await this.usersRepository.findOne({ where: { username: addUserToFollow } })

		if (!followingUser) {
			throw new NotFoundException(`User with username "${addUserToFollow}" not found`);
		}

		return this.followersRepository.addFollowUser(followingUser, user);
	}
}

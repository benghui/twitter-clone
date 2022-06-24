import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from 'src/auth/users.repository';
import { Follower } from './follower.entity';
import { User } from '../auth/user.entity';
import { FollowersRepository } from './followers.repository';
import { getConnection } from 'typeorm';

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

	async removeFollowUser(deleteUserToFollow: string, user: User): Promise<void> {
		const followingUser = await this.usersRepository.findOne({ where: { username: deleteUserToFollow } })

		if (!followingUser) {
			throw new NotFoundException(`User with username "${deleteUserToFollow}" not found`);
		}

		await getConnection()
			.createQueryBuilder()
			.delete()
			.from(Follower)
			.where("followers_id = :id", { id: user.id })
			.andWhere("following_id = :fid", { fid: followingUser.id })
			.execute()
	}
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { GetTweetsFilterDto } from './dto/get-tweets-filter.dto';
import { Tweet } from './tweet.entity';
import { TweetsRepository } from './tweets.repository';

@Injectable()
export class TweetsService {
	constructor(
		@InjectRepository(TweetsRepository)
		private tweetsRepository: TweetsRepository,
	) { }

	getTweets(filterDto: GetTweetsFilterDto): Promise<Tweet[]> {
		return this.tweetsRepository.getTweets(filterDto);
	}

	async getTweetById(id: string, user: User): Promise<Tweet> {
		const found = await this.tweetsRepository.findOne({ where: { id, user } });

		if(!found) {
			throw new NotFoundException(`Tweet with ID "${id}" not found`);
		}

		return found;
	}

	createTweet(createTweetDto: CreateTweetDto, user: User): Promise<Tweet> {
		return this.tweetsRepository.createTweet(createTweetDto, user);
	}

	async deleteTweet(id: string, user: User): Promise<void> {
		const result = await this.tweetsRepository.delete({ id, user });

		if (result.affected === 0) {
			throw new NotFoundException(`Tweet with ID "${id}" not found`);
		}
	}
}

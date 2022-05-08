import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { Tweet } from './tweet.entity';
import { TweetsRepository } from './tweets.repository';

@Injectable()
export class TweetsService {
	constructor(
		@InjectRepository(TweetsRepository)
		private tweetsReposiitory: TweetsRepository,
	) { }

	createTweet(createTweetDto: CreateTweetDto, user: User): Promise<Tweet> {
		return this.tweetsReposiitory.createTweet(createTweetDto, user);
	}
}

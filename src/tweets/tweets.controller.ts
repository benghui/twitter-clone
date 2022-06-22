import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { GetTweetsFilterDto } from './dto/get-tweets-filter.dto';
import { Tweet } from './tweet.entity';
import { TweetsService } from './tweets.service';

@Controller('tweets')
@UseGuards(AuthGuard())
export class TweetsController {
	constructor(private tweetsService: TweetsService) { }

	@Get()
	getTweets(@Query() filterDto: GetTweetsFilterDto): Promise<Tweet[]> {
		return this.tweetsService.getTweets(filterDto);
	}

	@Get('/:id')
	getTweetById(@Param('id') id: string, @GetUser() user: User): Promise<Tweet> {
		return this.tweetsService.getTweetById(id, user);
	}

	@Post()
	createTweet(
		@Body() createTweetDto: CreateTweetDto,
		@GetUser() user: User
	): Promise<Tweet> {
		return this.tweetsService.createTweet(createTweetDto, user);
	}

	@Delete('/:id')
	deleteTweet(@Param('id') id: string, @GetUser() user: User): Promise<void> {
		return this.tweetsService.deleteTweet(id, user);
	}
}

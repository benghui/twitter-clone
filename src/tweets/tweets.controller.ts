import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { Tweet } from './tweet.entity';
import { TweetsService } from './tweets.service';

@Controller('tweets')
@UseGuards(AuthGuard())
export class TweetsController {
	constructor(private tweetsService: TweetsService) { }

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

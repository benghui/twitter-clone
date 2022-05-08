import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTweetDto } from "./dto/create-tweet.dto";
import { Tweet } from "./tweet.entity";

@EntityRepository(Tweet)
export class TweetsRepository extends Repository<Tweet> {
	async createTweet(createTweetDto: CreateTweetDto, user: User): Promise<Tweet> {
		const { tweet_body } = createTweetDto;

		const tweet = this.create({
			user,
			tweet_body,
		});

		await this.save(tweet);

		return tweet;
	}
}

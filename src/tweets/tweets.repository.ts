import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { GetTweetsFilterDto } from './dto/get-tweets-filter.dto';
import { Tweet } from './tweet.entity';

@EntityRepository(Tweet)
export class TweetsRepository extends Repository<Tweet> {
  private logger = new Logger('TweetRepository', { timestamp: true });

  async getTweets(filterDto: GetTweetsFilterDto): Promise<Tweet[]> {
    const { search } = filterDto;

    const query = this.createQueryBuilder('tweet');

    if (search) {
      query.andWhere('(LOWER(tweet.tweet_body) LIKE LOWER(:search))', {
        search: `%${search}%`,
      });
    }

    try {
      const tweets = await query.getMany();
      return tweets;
    } catch (error) {
      this.logger.error(
        `Failed to get tweets. Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTweet(
    createTweetDto: CreateTweetDto,
    user: User,
  ): Promise<Tweet> {
    const { tweet_body } = createTweetDto;

    const tweet = this.create({
      user,
      tweet_body,
    });

    await this.save(tweet);

    return tweet;
  }
}

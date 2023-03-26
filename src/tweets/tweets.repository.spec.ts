import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TweetsRepository } from './tweets.repository';
import { GetTweetsFilterDto } from './dto/get-tweets-filter.dto';
import { Tweet } from './tweet.entity';
import { User } from '../auth/user.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';

describe('TweetsRepository', () => {
  let tweetsRepository: TweetsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TweetsRepository],
    }).compile();

    tweetsRepository = module.get<TweetsRepository>(TweetsRepository);
  });

  describe('getTweets', () => {
    it('should return an array of tweets', async () => {
      const result = [new Tweet(), new Tweet()];
      const filterDto: GetTweetsFilterDto = { search: 'test' };
      const queryBuilder = {
        andWhere: jest.fn(),
        getMany: jest.fn().mockReturnValue(result),
      };
      jest
        .spyOn(tweetsRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);

      const tweets = await tweetsRepository.getTweets(filterDto);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        '(LOWER(tweet.tweet_body) LIKE LOWER(:search))',
        { search: `%${filterDto.search}%` },
      );
      expect(tweets).toEqual(result);
    });

    it('should throw an error when getMany fails', async () => {
      const filterDto: GetTweetsFilterDto = { search: 'test' };
      const queryBuilder = {
        andWhere: jest.fn(),
        getMany: jest.fn().mockRejectedValue(new Error()),
      };
      jest
        .spyOn(tweetsRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);

      await expect(tweetsRepository.getTweets(filterDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('createTweet', () => {
    const mockUser = new User();
    mockUser.id = '1';
    mockUser.username = 'testuser';
    mockUser.password = 'testpassword';

    const mockCreateTweetDto: CreateTweetDto = {
      tweet_body: 'test tweet',
    };

    it('should create a new tweet', async () => {
      const result = new Tweet();
      result.id = '1';
      result.tweet_body = 'test tweet';
      result.user = mockUser;

      jest.spyOn(tweetsRepository, 'create').mockReturnValue(result);
      jest.spyOn(tweetsRepository, 'save').mockResolvedValue(null);

      const tweet = await tweetsRepository.createTweet(
        mockCreateTweetDto,
        mockUser,
      );

      expect(tweetsRepository.create).toHaveBeenCalledWith({
        tweet_body: 'test tweet',
        user: mockUser,
      });

      expect(tweetsRepository.save).toHaveBeenCalledWith(result);
      expect(tweet).toEqual(result);
    });
  });
});

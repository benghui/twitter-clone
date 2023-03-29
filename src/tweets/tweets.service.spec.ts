import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../auth/user.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { GetTweetsFilterDto } from './dto/get-tweets-filter.dto';
import { Tweet } from './tweet.entity';
import { TweetsRepository } from './tweets.repository';
import { TweetsService } from './tweets.service';

describe('TweetsService', () => {
  let tweetsService: TweetsService,
    tweetsRepository: TweetsRepository,
    mockUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TweetsService, TweetsRepository],
    }).compile();

    tweetsService = module.get<TweetsService>(TweetsService);
    tweetsRepository = module.get<TweetsRepository>(TweetsRepository);

    mockUser = { id: '1', username: 'mockuser' } as any;
  });

  describe('getTweets', () => {
    it('should return an array of tweets', async () => {
      const filterDto: GetTweetsFilterDto = {
        search: 'mocksearch',
      };
      const tweets: Tweet[] = [
        {
          id: '1',
          tweet_body: 'tweet1',
          user: mockUser,
          createdDate: new Date(),
        },
        {
          id: '2',
          tweet_body: 'tweet2',
          user: mockUser,
          createdDate: new Date(),
        },
      ] as any;
      jest.spyOn(tweetsRepository, 'getTweets').mockResolvedValueOnce(tweets);

      const result = await tweetsService.getTweets(filterDto);

      expect(tweetsRepository.getTweets).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(tweets);
    });
  });

  describe('getTweetById', () => {
    const mockTweet: Tweet = {
      id: '1',
      tweet_body: 'mocktweet',
      user: mockUser,
      createdDate: new Date(),
    };

    it('should return a tweet', async () => {
      jest.spyOn(tweetsRepository, 'findOne').mockResolvedValue(mockTweet);

      const result = await tweetsService.getTweetById(mockTweet.id, mockUser);

      expect(result).toEqual(mockTweet);
    });

    it('should throw a NotFoundException if the tweet is not found', async () => {
      const id = 'invalid_id';
      jest.spyOn(tweetsRepository, 'findOne').mockResolvedValue(null);

      expect(tweetsService.getTweetById(id, mockUser)).rejects.toThrowError(
        new NotFoundException(`Tweet with ID "${id}" not found`),
      );
    });
  });

  describe('createTweet', () => {
    const createTweetDto: CreateTweetDto = {
      tweet_body: 'mockTweet',
    };

    it('should create a tweet and return it', async () => {
      const createdTweet: Tweet = {
        id: '1',
        ...createTweetDto,
        user: mockUser,
        createdDate: new Date(),
      };

      jest
        .spyOn(tweetsRepository, 'createTweet')
        .mockResolvedValue(createdTweet);

      const result = await tweetsService.createTweet(createTweetDto, mockUser);

      expect(tweetsRepository.createTweet).toHaveBeenCalledWith(
        createTweetDto,
        mockUser,
      );
      expect(result).toEqual(createdTweet);
    });
  });

  describe('deleteTweet', () => {
    const id = '1';

    it('should delete a tweet', async () => {
      jest
        .spyOn(tweetsRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await tweetsService.deleteTweet(id, mockUser);

      expect(tweetsRepository.delete).toHaveBeenCalledWith({
        id,
        user: mockUser,
      });
    });

    it('should throw a NotFoundException if tweet is not found', async () => {
      jest
        .spyOn(tweetsRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(
        tweetsService.deleteTweet(id, mockUser),
      ).rejects.toThrowError(
        new NotFoundException(`Tweet with ID "${id}" not found`),
      );
    });
  });
});

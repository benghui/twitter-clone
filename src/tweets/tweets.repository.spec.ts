import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TweetsRepository } from './tweets.repository';
import { GetTweetsFilterDto } from './dto/get-tweets-filter.dto';
import { Tweet } from './tweet.entity';

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
});

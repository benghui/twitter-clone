import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersRepository],
    }).compile();

    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
  });

  describe('createUser', () => {
    it('should create a new user with a hashed password', async () => {
      // Arrange
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      const mockValues = {
        username: 'testuser',
        password: 'mockHashedPassword',
        id: 'mockUUID',
        createdDate: null,
        updatedDate: null,
        followers: [],
        following: [],
      };

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce('mockSalt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('mockHashedPassword');
      jest.spyOn(usersRepository, 'create').mockReturnValueOnce(mockValues);
      jest.spyOn(usersRepository, 'save').mockResolvedValueOnce(mockValues);

      // Act
      await usersRepository.createUser(authCredentialsDto);

      // Assert
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(
        authCredentialsDto.password,
        'mockSalt',
      );

      expect(usersRepository.create).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'mockHashedPassword',
      });

      expect(usersRepository.save).toHaveBeenCalledWith(mockValues);
    });
  });
});

import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository,
    mockValues,
    authCredentialsDto: AuthCredentialsDto;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersRepository],
    }).compile();

    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);

    mockValues = {
      username: 'testuser',
      password: 'mockHashedPassword',
      id: 'mockUUID',
      createdDate: null,
      updatedDate: null,
      followers: [],
      following: [],
    };

    authCredentialsDto = {
      username: 'testuser',
      password: 'testpassword',
    };
  });

  describe('createUser', () => {
    it('should create a new user with a hashed password', async () => {
      // Arrange
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

    it('should throw a ConflictException if the username already exists', async () => {
      // Arrange
      jest.spyOn(usersRepository, 'create').mockReturnValueOnce(mockValues);
      jest.spyOn(usersRepository, 'save').mockRejectedValueOnce({
        code: '23505',
      });

      // Act and Assert
      await expect(
        usersRepository.createUser(authCredentialsDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      // Arrange
      jest.spyOn(usersRepository, 'create').mockReturnValueOnce(mockValues);
      jest.spyOn(usersRepository, 'save').mockRejectedValueOnce({});

      // Act and Assert
      await expect(
        usersRepository.createUser(authCredentialsDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});

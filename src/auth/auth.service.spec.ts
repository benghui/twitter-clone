import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService,
    usersRepository: UsersRepository,
    jwtService: JwtService,
    authCredentialsDto: AuthCredentialsDto,
    mockUser;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            createUser: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockAccessToken'),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);

    authCredentialsDto = {
      username: 'testuser',
      password: 'testpassword',
    };

    mockUser = {
      username: 'testuser',
      password: 'mockHashedPassword',
      id: 'mockUUID',
      createdDate: null,
      updatedDate: null,
      followers: [],
      following: [],
    };
  });

  describe('signUp', () => {
    it('should call createUser method with the correct arguments', async () => {
      // Act
      await authService.signUp(authCredentialsDto);

      // Assert
      expect(usersRepository.createUser).toHaveBeenCalledWith(
        authCredentialsDto,
      );
    });
  });

  describe('signIn', () => {
    it('should return an access token if the username and password are correct', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      // Act
      const result = await authService.signIn(authCredentialsDto);

      // Assert
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        username: authCredentialsDto.username,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        authCredentialsDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: authCredentialsDto.username,
      });
      expect(result.accessToken).toEqual('mockAccessToken');
    });

    it('should throw an UnauthorizedException if the username or password is incorrect', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      // Act and Assert
      await expect(authService.signIn(authCredentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException if user not found', async () => {
      usersRepository.findOne = jest.fn().mockResolvedValue(null);

      // Act and Assert
      await expect(authService.signIn(authCredentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

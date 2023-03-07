import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

describe('AuthService', () => {
  let authService: AuthService, usersRepository: UsersRepository;

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
            sign: jest.fn().mockResolvedValue('mockAccessToken'),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
  });

  describe('signUp', () => {
    it('should call createUser method with the correct arguments', async () => {
      // Arrange
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      // Act
      await authService.signUp(authCredentialsDto);

      // Assert
      expect(usersRepository.createUser).toHaveBeenCalledWith(
        authCredentialsDto,
      );
    });
  });
});

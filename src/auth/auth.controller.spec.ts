import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from './users.repository';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        {
          provide: UsersRepository,
          useValue: {
            createUser: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should call the authService signUp method with the correct arguments', async () => {
      const mockAuthCredentialsDto: AuthCredentialsDto = {
        username: 'testuser',
        password: 'testpassword',
      };
      const signUpSpy = jest
        .spyOn(authService, 'signUp')
        .mockResolvedValue(null);

      await authController.signUp(mockAuthCredentialsDto);

      expect(signUpSpy).toHaveBeenCalledWith(mockAuthCredentialsDto);
    });
  });

  describe('signIn', () => {
    it('should return an access token', async () => {
      const mockAuthCredentialsDto: AuthCredentialsDto = {
        username: 'testuser',
        password: 'testpassword',
      };
      const mockAccessToken = 'mockAccessToken';
      jest
        .spyOn(authService, 'signIn')
        .mockResolvedValue({ accessToken: mockAccessToken });

      const result = await authController.signIn(mockAuthCredentialsDto);

      expect(result.accessToken).toEqual(mockAccessToken);
    });
  });
});

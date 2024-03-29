import { JwtErrorCode } from '@auth/constants/error-code.constant';
import { LoginToken, LoginUser, RefreshTokenJwt } from '@auth/models';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';
@Injectable()
export class AuthRepository {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  public findUserByEmailAndPassword(user: LoginUser): Promise<User> {
    return this.prismaService.user.findFirst({
      where: {
        AND: {
          userEmail: user.userEmail,
          password: user.userPassword,
        },
      },
    });
  }

  public validateAccessToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  public async createToken(user: User): Promise<LoginToken> {
    const { id } = user;

    const refreshToken = this.createRefreshToken({ user_id: id });
    const accessToken = this.createAccessToken({ user_id: id });

    const jwt: RefreshTokenJwt = this.jwtService.decode(refreshToken, {
      json: true,
    }) as RefreshTokenJwt;
    const expirationDate = jwt.exp * 1000;

    await this.prismaService.refreshToken.upsert({
      create: {
        token: refreshToken,
        userId: id,
        tokenExpirationDate: new Date(expirationDate),
      },
      update: {
        token: refreshToken,
        tokenExpirationDate: new Date(expirationDate),
      },
      where: {
        userId: id,
      },
    });
    return <LoginToken>{
      accessToken,
      refreshToken,
      expirationDate,
    };
  }

  public refreshAccessToken(refreshToken: string) {
    try {
      const jwt = this.jwtService.verify<RefreshTokenJwt>(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
      if (jwt) {
        const { user_id } = jwt;
        const accessToken = this.createAccessToken({ user_id });
        return { accessToken, expirationDate: Number(jwt.exp * 1000) };
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException({
          code: JwtErrorCode.TokenExpired,
          error,
        });
      } else if (error instanceof JsonWebTokenError) {
        throw new BadRequestException({
          code: JwtErrorCode.TokenInvalid,
          error,
        });
      } else if (error instanceof NotBeforeError) {
        throw new BadRequestException({
          code: JwtErrorCode.NotBefore,
          error,
        });
      }
    }
  }

  public createAccessToken(payload) {
    return this.jwtService.sign(payload, {
      subject: 'access-token',
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
  }

  public createRefreshToken(payload) {
    return this.jwtService.sign(payload, {
      subject: 'refresh-token',
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
  }

  public getCurrentUser(userId: string) {
    return this.prismaService.user.findFirst({
      where: {
        AND: {
          id: userId,
        },
      },
      include: {
        token: true,
      },
    });
  }
}

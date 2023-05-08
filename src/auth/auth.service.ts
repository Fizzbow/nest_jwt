import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Tokens } from './type/token.type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  signinLocal() {}
  logout() {}
  refreshToken() {}
  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    const user = await this.prisma.user
      .create({
        data: {
          email: dto.email,
          hash,
        },
      })
      .catch((err) => {
        if (err.constructor.name === 'PrismaClientKnownRequestError') {
          if (err.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw err;
      });
    console.log({ user });
    const tokens = await this.getTokens(user.id, user.email);
    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    // const hash = await
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtpayload = {
      sub: userId,
      email: email,
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtpayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtpayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategies, RtStrategies } from './strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AtStrategies, RtStrategies],
})
export class AuthModule {}

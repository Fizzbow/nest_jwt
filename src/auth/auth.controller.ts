import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './type/token.type';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // @Public()
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
    console.log({ dto });
    return this.authService.signupLocal(dto);
  }

  @Post('/local/signin')
  signinLocal() {
    this.authService.signinLocal();
  }

  @Post('/logout')
  logout() {
    this.authService.logout();
  }

  @Post('refresh')
  refreshToken() {
    this.authService.refreshToken();
  }
}

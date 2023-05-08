import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-strategy';
export class AtStrategies extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrkey: 'at-token',
    });
  }
  validate(payload: any) {
    return payload;
    // req.user = payload;
  }
}

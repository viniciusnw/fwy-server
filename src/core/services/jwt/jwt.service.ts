import { Inject, Service } from 'typedi';
import { ENV_NAMES } from 'core/constants'
import { decode, sign, verify } from 'jsonwebtoken';
import { Token } from 'resolvers/General/types/token.object-type'

@Service()
export class JwtService {

  constructor(
    @Inject(ENV_NAMES.JWT) protected JWT,
  ) { }

  public decode(token: string): Token {
    try {
      const splitToken = token.replace('Bearer ', '');
      return decode(splitToken) as Token;
    } catch (err) {
      console.info('Invalid JWT token (verify): ', err.message);
    }
    return undefined;
  }

  public verify(token: string): Token {
    try {
      const splitToken = token.replace('Bearer ', '');
      const response = verify(splitToken, this.JWT.SECRET_NEW, { ignoreExpiration: false });
      return response as Token;
    } catch (err) {
      console.info('Invalid JWT token (verify): ', err.message);
      return undefined
    }
  }

  public renew(token: string) {
    if (token) {
      const decoded = this.verify(token);
      if (decoded) return this.sign(decoded)
    }
    return undefined;
  }

  public sign(payload: any, addBearer: boolean = true): string {
    let signedToken = sign({ ...payload }, this.JWT.SECRET_NEW, { expiresIn: this.JWT.EXPIRATION_TIME });
    if (addBearer) signedToken = 'Bearer ' + signedToken;
    return signedToken;
  }
}

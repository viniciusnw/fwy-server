import { Inject, Service } from 'typedi';
import { ENV_NAMES } from 'core/constants';
import { HttpServiceBuilder } from '../http.config';

@Service()
export class PayPalApiBuilder extends HttpServiceBuilder {

  constructor(
    @Inject(ENV_NAMES.REST_API) private REST_API,
  ) {
    super(
      REST_API.URL,
      { 'Content-Type': 'application/json' },
      30000,
    );
  }

  // clone(): PayPal {
  //   return new PayPal(
  //     this.REST_API.URL,
  //   );
  // }
}

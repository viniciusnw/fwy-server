import { Inject, Service } from 'typedi';
import { ENV_NAMES } from 'core/constants';
import { HttpServiceBuilder } from '../http.config';

@Service()
export class PayPalApiBuilder extends HttpServiceBuilder {

  constructor(
    @Inject(ENV_NAMES.PAY_PAL) private PAY_PAL,
  ) {
    super(
      PAY_PAL.URL,
      { 'Content-Type': 'application/json' },
      30000,
    );
  }

  // clone(): PayPalApiBuilder {
  //   return new PayPalApiBuilder(
  //     this.PAY_PAL.URL,
  //   );
  // }
}

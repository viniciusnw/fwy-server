import { get } from 'lodash';
import { Container } from 'typedi';

import { CacheExpirationService, CacheFirstStrategy } from 'core/services';

export function Cached() {
  return function (targetClass: any, method: string, methodDescriptor: any) {
    const originalMethod = methodDescriptor.value;
    const metadataKey = `cached_${method}`;
    let strategy: CacheFirstStrategy;
    let expirationService: CacheExpirationService;

    return {
      value: async function () {
        strategy = strategy || Container.get(CacheFirstStrategy);
        expirationService = expirationService || Container.get(CacheExpirationService);

        const index = targetClass[metadataKey];
        const key = `${targetClass.constructor.name} - ${method} - ${JSON.stringify(get(arguments, index))}`;

        return strategy.execute(key, expirationService.getExpirationInSeconds(), { originalFn: originalMethod, fnContext: this, fnArgs: arguments });
      },
    };
  };
}

export function CacheKey() {
  return (targetClass: any, method: string, index: number) => {
    let metadataKey = `cached_${method}`;
    targetClass[metadataKey] = index;
  };
}

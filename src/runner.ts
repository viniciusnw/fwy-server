import 'reflect-metadata';
declare var __dirname;
declare var process;

import { useContainer } from 'routing-controllers';
import { useContainer as useTypeContainer } from 'typeorm';
import { useContainer as useClassValidatorContainer } from 'class-validator';
import { Container } from 'typedi';
import { RunnerType } from './core/types';

useClassValidatorContainer(Container);
useTypeContainer(Container);
useContainer(Container);

export const Runner = {
  exec: async function(runPath: string, param: string, runforever: boolean): Promise<any> {
    try {
      let Runnable = require(runPath).default;
      let runnable: RunnerType = new Runnable();
      await runnable.configure();
      let job = await runnable.run(param);
      if (runforever) {
        console.info(`Loaded and running '${runPath}'...`);
        return job;
      } else {
        console.info(`Finished running '${runPath}'`);
        process.exit(0);
      }
    } catch (err) {
      console.error(`Error running '${runPath}': ${err}`);
      console.log(err);
      process.exit(1);
    }
  },
};



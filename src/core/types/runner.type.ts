export interface ConfigureType {
  configure(): Promise<any>;
}

export interface RunnerType extends ConfigureType {
  run(param: string): any;
}

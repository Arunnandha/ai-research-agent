export type SourceResult = {
  source: string;
  content: string;
};

export abstract class BaseSource {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract fetch(query: string): Promise<SourceResult[]>;
}

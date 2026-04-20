import { BaseSource, type SourceResult } from "./baseSource.js";

export class WebSource extends BaseSource {
  constructor() {
    super("web");
  }

  async fetch(query: string): Promise<SourceResult[]> {
    return [
      {
        source: "web",
        content: `Placeholder web result for query: ${query}`,
      },
    ];
  }
}

export type ResearchState = {
  query: string;
  findings: string[];
};

export class ResearchAgent {
  private readonly sourceClient: {
    fetch: (query: string) => Promise<Array<{ source: string; content: string }>>;
  };

  constructor(sourceClient: {
    fetch: (query: string) => Promise<Array<{ source: string; content: string }>>;
  }) {
    this.sourceClient = sourceClient;
  }

  async run(state: ResearchState): Promise<ResearchState> {
    const results = await this.sourceClient.fetch(state.query);
    return {
      ...state,
      findings: results.map((result) => result.content),
    };
  }
}

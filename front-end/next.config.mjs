/** @type {import("next").NextConfig} */
const nextConfig = {
  // Keep LangChain packages as server-side external to avoid bundling issues
  serverExternalPackages: [
    "@langchain/langgraph",
    "@langchain/openai",
    "langchain",
    "openai",
    "rss-parser",
  ],
};

export default nextConfig;

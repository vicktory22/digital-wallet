import { MockAgent, MockPool, setGlobalDispatcher } from "undici";

export function getMockClient(url: string): MockPool {
  const mockAgent = new MockAgent();
  mockAgent.disableNetConnect();
  setGlobalDispatcher(mockAgent);

  return mockAgent.get(url);
}

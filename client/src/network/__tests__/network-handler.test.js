import NetworkHandler from '../network-handler';

describe('NetworkHandler', () => {
  let networkHandler;

  beforeEach(() => {
    networkHandler = new NetworkHandler();
  });

  test('should initialize with correct default values', () => {
    expect(networkHandler.isConnected).toBeFalsy();
  });

  test('should handle connection', () => {
    networkHandler.connect();
    expect(networkHandler.isConnected).toBeTruthy();
  });

  test('should handle disconnection', () => {
    networkHandler.connect();
    networkHandler.disconnect();
    expect(networkHandler.isConnected).toBeFalsy();
  });

  test('should send messages correctly', () => {
    const mockMessage = { type: 'TEST', data: { value: 'test' }};
    networkHandler.connect();
    expect(() => networkHandler.send(mockMessage)).not.toThrow();
  });
});

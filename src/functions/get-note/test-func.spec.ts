import { handler } from "./handler";

describe("Test func", () => {
  it("should return 200 status code", async () => {
    const response = await handler({} as any, {} as any);

    expect(response.statusCode).toEqual(200);
  });
});

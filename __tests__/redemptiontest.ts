import { app } from "../src/server";
import { prismaMock } from "../prisma/singleton";
import request from "supertest";

/**
 * Tests for redeem
 */
describe("redeemGift", () => {
  it("should redeem a gift if not already redeemed", async () => {
    prismaMock.staff.findUnique.mockResolvedValue({
      id: 1,
      staff_pass_id: "123",
      team_name: "team1",
    });
    prismaMock.redemption.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .post("/redeem")
      .query({ staff_pass_id: "123" });

    expect(res.status).toBe(200);
    expect(prismaMock.redemption.create).toHaveBeenCalledWith({
      data: {
        team_name: "team1",
        redeemed_by: "123",
        redeemed_at: expect.any(Date),
      },
    });
  });

  it("should return 400 if gift already redeemed", async () => {
    prismaMock.staff.findUnique.mockResolvedValue({
      id: 1,
      staff_pass_id: "123",
      team_name: "team1",
    });
    prismaMock.redemption.findFirst.mockResolvedValue({
      team_name: "team1",
      id: 1,
      redeemed_at: new Date(),
      redeemed_by: "123",
    });

    const res = await request(app)
      .post("/redeem")
      .query({ staff_pass_id: "123" });

    expect(res.status).toBe(400);
    expect(res.text).toBe("Gift has already been redeemed");
  });

  it("should return 400 if no user found", async () => {
    prismaMock.staff.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/redeem")
      .query({ staff_pass_id: "123" });

    expect(res.status).toBe(400);
    expect(res.text).toBe("No User Found");
  });
});

import { app } from "../src/server";
import { prismaMock } from "../prisma/singleton";
import request from "supertest";
import fs from "fs";

jest.mock("fs");

/**
 * Tests for getStaff
 */
describe("getStaff", () => {
  it("should retrieve staff object from databasae", async () => {
    prismaMock.staff.findUnique.mockResolvedValue({
      id: 1,
      staff_pass_id: "123",
      team_name: "team1",
    });
    prismaMock.redemption.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .get("/staff")
      .query({ staff_pass_id: "123" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      staff_pass_id: "123",
      team_name: "team1",
    });
  });

  it("should return 400 if staff_pass_id does not exist", async () => {
    prismaMock.staff.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .get("/staff")
      .query({ staff_pass_id: "123" });

    expect(res.status).toBe(400);
    expect(res.text).toBe("No User Found");
  });
});

/**
 * Tests for init
 */
describe("initStaff", () => {
  it("should initialize staff db from csv file", async () => {
    const mockReadFileSync = fs.readFileSync as jest.MockedFunction<
      typeof fs.readFileSync
    >;
    mockReadFileSync.mockReturnValue(
      "staff_pass_id,team_name,created_at\n1,team1,2022-01-01\n2,team2,2022-01-02"
    );

    const res = await request(app)
      .post("/staff/init")
      .query({ file_name: "staff.csv" });

    expect(res.status).toBe(200);
    expect(res.text).toBe("Successfully Initialized DB");
    expect(prismaMock.staff.create).toHaveBeenCalledWith({
      data: {
        staff_pass_id: "1",
        team_name: "team1",
      },
    });
    expect(prismaMock.staff.create).toHaveBeenCalledWith({
      data: {
        staff_pass_id: "2",
        team_name: "team2",
      },
    });
  });
});

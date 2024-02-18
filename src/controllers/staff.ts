import { Response, Request } from "express";
import * as path from "path";
import * as fs from "fs";
import { parse } from "csv-parse";
import prisma from "../../prisma/client";

/**
 * Get User Details
 * @route GET /staff
 */
export const getStaff = async (req: Request, res: Response): Promise<void> => {
  const staff = await prisma.staff.findUnique({
    where: {
      staff_pass_id: req.query?.staff_pass_id?.toString(),
    },
  });
  if (!staff) {
    res.status(400).send("No User Found");
    return;
  }
  res.json(staff);
};

/**
 * Initialize staff db
 * @route POST /staff/init
 */
export const initStaff = async (req: Request, res: Response): Promise<void> => {
  type Staff = {
    staff_pass_id: string;
    team_name: string;
    created_at: Date;
  };
  const fileName = req.query.file_name;
  const filepath = path.resolve(`./${fileName}`);
  const fileData = fs.readFileSync(filepath, { encoding: "utf-8" });
  let csvResult: Staff[] = [];
  const parser = parse(fileData, {
    delimiter: ",",
    columns: ["staff_pass_id", "team_name", "created_at"],
    from_line: 2,
  });
  parser.on("readable", () => {
    let record;
    while ((record = parser.read()) !== null) {
      csvResult.push(record);
    }
  });
  parser.on("end", async () => {
    let data = csvResult.map((staff: Staff) => {
      console.log(`Adding Staff ${staff.staff_pass_id} to database`);
      return prisma.staff.create({
        data: {
          staff_pass_id: staff.staff_pass_id,
          team_name: staff.team_name,
        },
      });
    });
    await Promise.all(data);
    res.status(200).send("Successfully Initialized DB");
  });
};

import { Response, Request } from "express";
import { prisma } from "../server";

/**
 * Redeem Gift
 * @route POST/redeem
 */
export const redeemGift = async (
  req: Request,
  res: Response
): Promise<void> => {
  const staff = await prisma.staff.findFirst({
    where: {
      staff_pass_id: req.query.staff_pass_id,
    },
  });
  if (!staff) {
    res.status(400).send("No User Found");
    return;
  }
  const hasBeenRedeemed = await prisma.redemption.findFirst({
    where: {
      team_name: staff?.team_name,
    },
  });
  if (!hasBeenRedeemed) {
    const newRedemption = await prisma.redemption.create({
      data: {
        team_name: staff.team_name,
        redeemed_by: staff.staff_pass_id,
        redeemed_at: new Date(),
      },
    });
    res.json(newRedemption);
  } else {
    res.status(400).send("Gift has already been redeemed");
  }
};

/**
 * Check if team has redeemed gift before
 * @route GET/redemptionstat
 */
export const checkTeamRedemption = async (
  req: Request,
  res: Response
): Promise<void> => {
  const staff = await prisma.staff.findUnique({
    where: {
      staff_pass_id: req.query.staff_pass_id,
    },
  });
  if (!staff) {
    res.status(400).send("No User Found");
    return;
  }
  const hasBeenRedeemed = await prisma.redemption.findFirst({
    where: {
      team_name: staff.team_name,
    },
  });

  res.json({ can_redeem: !hasBeenRedeemed });
};

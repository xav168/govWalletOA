-- CreateTable
CREATE TABLE "Staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "staff_pass_id" TEXT NOT NULL,
    "team_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Redemption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "redeemed_at" DATETIME NOT NULL,
    "team_name" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    CONSTRAINT "Redemption_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("staff_pass_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_staff_pass_id_key" ON "Staff"("staff_pass_id");

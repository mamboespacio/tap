-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vendor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT 'Av. Siempre Viva 742',
    "openingHours" TEXT NOT NULL DEFAULT '10:00',
    "closingHours" TEXT NOT NULL DEFAULT '18:00'
);
INSERT INTO "new_Vendor" ("id", "name") SELECT "id", "name" FROM "Vendor";
DROP TABLE "Vendor";
ALTER TABLE "new_Vendor" RENAME TO "Vendor";
CREATE UNIQUE INDEX "Vendor_name_key" ON "Vendor"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

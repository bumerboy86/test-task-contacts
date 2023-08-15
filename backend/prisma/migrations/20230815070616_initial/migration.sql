/*
  Warnings:

  - A unique constraint covering the columns `[contactNumber]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contact_contactNumber_key" ON "Contact"("contactNumber");

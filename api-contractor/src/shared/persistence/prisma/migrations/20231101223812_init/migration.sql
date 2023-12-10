-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('AVAILABLE', 'CHECKED_OUT', 'IN_REPAIR');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('EARTH_MOVING', 'MATERIAL_HANDLING', 'MISCELLANEUS');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "widthCm" INTEGER NOT NULL,
    "heightCm" INTEGER NOT NULL,
    "weightKg" INTEGER NOT NULL,
    "bucketCapacityKg" INTEGER,
    "liftingCapacityKg" INTEGER,
    "reachMt" INTEGER,
    "powerCapacityW" INTEGER,
    "type" "EquipmentType" NOT NULL,
    "status" "EquipmentStatus" NOT NULL,
    "currentJobId" TEXT,
    "lastLocation" TEXT,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" "ReservationStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "reservedAt" TIMESTAMP(3) NOT NULL,
    "reservationStart" TIMESTAMP(3) NOT NULL,
    "reservationEnd" TIMESTAMP(3) NOT NULL,
    "equipmentId" TEXT NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

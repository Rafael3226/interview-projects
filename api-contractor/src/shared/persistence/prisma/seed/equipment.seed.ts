import { EquipmentStatus, EquipmentType, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  //Create a power generator
  await prisma.equipment.create({
    data: {
      id: '11c8e8dc-3695-4059-b1bb-5c2f6dc1f470',
      name: 'Power Gnerator One',
      serialNumber: '123456789',
      year: 2021,
      manufacturer: 'Electrify Inc',
      widthCm: 300,
      heightCm: 50,
      weightKg: 50,
      status: EquipmentStatus.AVAILABLE,
      type: EquipmentType.MISCELLANEUS,
      powerCapacityW: 1000,
      lastLocation: 'NY',
    },
  });

  //Create a crane
  await prisma.equipment.create({
    data: {
      id: '29088a45-e259-42dc-a5ba-7421929098aa',
      name: 'Very big Crane',
      serialNumber: '123456789',
      year: 2015,
      manufacturer: 'Very high Inc',
      widthCm: 300,
      heightCm: 50,
      weightKg: 50,
      status: EquipmentStatus.AVAILABLE,
      type: EquipmentType.MATERIAL_HANDLING,
      liftingCapacityKg: 1000,
      lastLocation: 'NY',
      reachMt: 50,
    },
  });

  //Create a crane
  await prisma.equipment.create({
    data: {
      id: 'b97888e7-6b0e-4f87-8bea-bf68bb819f21',
      name: 'Excavator one',
      serialNumber: '123456789',
      year: 2010,
      manufacturer: 'EXCAVATOR Inc',
      widthCm: 300,
      heightCm: 50,
      weightKg: 50,
      status: EquipmentStatus.AVAILABLE,
      type: EquipmentType.EARTH_MOVING,
      lastLocation: 'SF',
      bucketCapacityKg: 100,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    console.log('Database seed could not be completed. Probably the data already exists');
    await prisma.$disconnect();
    process.exit(0);
  });

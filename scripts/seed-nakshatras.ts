import prisma from "../src/config/prisma.js";

const nakshatras = [
  "Ashwini",
  "Bharani",
  "Karthika",
  "Rohini",
  "Makayiram",
  "Thiruvathira",
  "Punartham",
  "Pooyam",
  "Ayilyam",
  "Makam",
  "Pooram",
  "Uthram",
  "Atham",
  "Chithira",
  "Chothi",
  "Vishakham",
  "Anizham",
  "Thrikketta",
  "Moolam",
  "Pooradam",
  "Uthradam",
  "Thiruvonam",
  "Avittam",
  "Chathayam",
  "Pooruruttathi",
  "Uthrattathi",
  "Revathi",
];

async function seedNakshatras() {
  for (const name of nakshatras) {
    await prisma.nakshatra.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Nakshatras seeded successfully");
}

seedNakshatras()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

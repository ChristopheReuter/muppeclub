import { PrismaClient, Role, ServiceType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

async function createOwner() {
  const email = "owner.demo@example.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: { email, name: "Demo Owner", passwordHash, role: Role.OWNER }
  });
  await prisma.ownerProfile.create({
    data: { userId: user.id, address: "1 Demo Street", lat: 52.52, lng: 13.405 }
  });
  await prisma.dog.create({
    data: { ownerProfileId: (await prisma.ownerProfile.findUnique({ where: { userId: user.id } }))!.id, name: "Buddy", breed: "Labrador", weightKg: 28.5, photoUrl: "https://picsum.photos/seed/dog1/400/300" }
  });
  return user;
}

type ProSeed = {
  name: string;
  email: string;
  bio: string;
  services: ServiceType[];
};

const PROS: ProSeed[] = [
  { name: "Alice Walker", email: "pro.alice@example.com", bio: "Loves long walks and happy dogs.", services: [ServiceType.DOG_WALKING, ServiceType.DAYCARE] },
  { name: "Bob Trainer", email: "pro.bob@example.com", bio: "Positive reinforcement expert.", services: [ServiceType.DOG_TRAINING] },
  { name: "Clara Physio", email: "pro.clara@example.com", bio: "Certified canine physiotherapist.", services: [ServiceType.PHYSIOTHERAPY] },
  { name: "Dr. Vet", email: "pro.vet@example.com", bio: "Gentle vet with 10y of experience.", services: [ServiceType.VET] },
  { name: "Pension Park", email: "pro.pension@example.com", bio: "Cozy stays for your best friend.", services: [ServiceType.DOG_PENSION, ServiceType.DAYCARE] },
];

function listingTemplates(service: ServiceType) {
  switch (service) {
    case ServiceType.DOG_WALKING:
      return [
        { title: "30-min city walk", description: "Leash walks in your neighborhood.", basePriceCents: 1500, durationMin: 30 },
        { title: "60-min adventure walk", description: "Longer walk in parks.", basePriceCents: 2500, durationMin: 60 },
      ];
    case ServiceType.DOG_TRAINING:
      return [
        { title: "Puppy basics", description: "Foundations for puppies.", basePriceCents: 5000, durationMin: 60 },
        { title: "Obedience session", description: "Focus on manners and recall.", basePriceCents: 6000, durationMin: 75 },
      ];
    case ServiceType.PHYSIOTHERAPY:
      return [
        { title: "Assessment", description: "Initial assessment and plan.", basePriceCents: 7000, durationMin: 60 },
        { title: "Therapy session", description: "Targeted physio treatment.", basePriceCents: 6500, durationMin: 50 },
      ];
    case ServiceType.VET:
      return [
        { title: "Consultation", description: "General check-up.", basePriceCents: 8000, durationMin: 30 },
        { title: "Vaccination", description: "Core vaccines.", basePriceCents: 4000, durationMin: 20 },
      ];
    case ServiceType.DAYCARE:
      return [
        { title: "Half-day daycare", description: "Social playtime.", basePriceCents: 3000, durationMin: 240 },
        { title: "Full-day daycare", description: "A full day of care.", basePriceCents: 5000, durationMin: 480 },
      ];
    case ServiceType.DOG_PENSION:
      return [
        { title: "Overnight stay", description: "Comfortable boarding.", basePriceCents: 8000, durationMin: 720 },
        { title: "Weekend stay", description: "Friday to Sunday.", basePriceCents: 20000, durationMin: 2880 },
      ];
  }
}

async function createPro(p: ProSeed) {
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: p.email },
    update: { name: p.name },
    create: { email: p.email, name: p.name, passwordHash, role: Role.PROFESSIONAL },
  });
  const pro = await prisma.proProfile.upsert({
    where: { userId: user.id },
    update: { bio: p.bio, location: "Berlin", lat: 52.52, lng: 13.405 },
    create: { userId: user.id, bio: p.bio, location: "Berlin", lat: 52.52, lng: 13.405 },
  });
  for (const service of p.services) {
    await prisma.proService.upsert({
      where: { proId_service: { proId: pro.id, service } },
      update: {},
      create: { proId: pro.id, service },
    });
    const templates = listingTemplates(service);
    for (const t of templates) {
      await prisma.listing.create({
        data: { proId: pro.id, service, title: t.title, description: t.description, basePriceCents: t.basePriceCents, durationMin: t.durationMin, location: "Berlin" },
      });
    }
  }
}

async function main() {
  await createOwner();
  for (const p of PROS) {
    await createPro(p);
  }
}

main().then(() => prisma.$disconnect()).catch((e) => {
  console.error(e);
  return prisma.$disconnect().finally(() => process.exit(1));
});



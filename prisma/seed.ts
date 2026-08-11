import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const sections = [
  {
    key: "hero",
    titleEn: "Bona Nauli Perkasa",
    titleId: "Bona Nauli Perkasa",
    bodyEn:
      "We cultivate and produce premium palm sugar fruit and palm sugar, rooted in Indonesian agriculture and built for international markets.",
    bodyId:
      "Kami membudidayakan dan memproduksi buah aren serta gula aren berkualitas, berakar dari pertanian Indonesia dan siap menjangkau pasar internasional.",
  },
  {
    key: "about",
    titleEn: "Who We Are",
    titleId: "Tentang Kami",
    bodyEn:
      "Bona Nauli Perkasa is an agriculture company dedicated to sustainable palm sugar production. From farm to export, we bring value and quality to every batch we produce.",
    bodyId:
      "Bona Nauli Perkasa adalah perusahaan agrikultur yang berdedikasi pada produksi gula aren berkelanjutan. Dari kebun hingga ekspor, kami menghadirkan nilai dan kualitas di setiap produk kami.",
  },
  {
    key: "team",
    titleEn: "Our Team",
    titleId: "Tim Kami",
    bodyEn:
      "The people behind Bona Nauli Perkasa, working from farm to export to bring palm sugar to the world.",
    bodyId:
      "Orang-orang di balik Bona Nauli Perkasa, bekerja dari kebun hingga ekspor untuk membawa gula aren ke dunia.",
  },
  {
    key: "products",
    titleEn: "Our Products",
    titleId: "Produk Kami",
    bodyEn:
      "Our core products are fresh palm sugar fruit (aren) and processed palm sugar, crafted with care for both local and global customers.",
    bodyId:
      "Produk utama kami adalah buah aren segar dan gula aren olahan, dibuat dengan cermat untuk pelanggan lokal maupun global.",
  },
  {
    key: "cta",
    titleEn: "Reaching International Markets",
    titleId: "Menjangkau Pasar Internasional",
    bodyEn:
      "We are committed to bringing the value of Indonesian palm sugar to customers around the world. Partner with us.",
    bodyId:
      "Kami berkomitmen membawa nilai gula aren Indonesia kepada pelanggan di seluruh dunia. Mari bermitra dengan kami.",
  },
  {
    key: "profileSummary",
    titleEn: "Company Profile",
    titleId: "Profil Perusahaan",
    bodyEn:
      "Bona Nauli Perkasa is an Indonesian agriculture company built around one crop: the palm sugar tree. From sustainably sourced palm sugar fruit to naturally processed palm sugar, we work closely with local growers to deliver consistent quality, ready for both domestic and international markets.",
    bodyId:
      "Bona Nauli Perkasa adalah perusahaan agrikultur Indonesia yang berfokus pada satu komoditas: pohon aren. Dari buah aren yang bersumber berkelanjutan hingga gula aren olahan alami, kami bekerja sama erat dengan petani lokal untuk menghadirkan kualitas yang konsisten, siap untuk pasar domestik maupun internasional.",
  },
  {
    key: "visi",
    titleEn: "Vision",
    titleId: "Visi",
    bodyEn:
      "To become a leading Indonesian palm sugar producer recognized internationally for quality, sustainability, and the value we bring to local farming communities.",
    bodyId:
      "Menjadi produsen gula aren Indonesia terkemuka yang diakui secara internasional atas kualitas, keberlanjutan, dan nilai yang kami hadirkan bagi komunitas petani lokal.",
  },
  {
    key: "misi",
    titleEn: "Mission",
    titleId: "Misi",
    bodyEn:
      "Deliver consistently high-quality palm sugar fruit and palm sugar\nBuild long-term, fair partnerships with local farmers\nExpand access to international markets\nOperate with sustainable and responsible farming practices",
    bodyId:
      "Menghadirkan buah aren dan gula aren berkualitas tinggi secara konsisten\nMembangun kemitraan jangka panjang yang adil dengan petani lokal\nMemperluas akses ke pasar internasional\nBeroperasi dengan praktik pertanian yang berkelanjutan dan bertanggung jawab",
  },
  {
    key: "corporateCulture",
    titleEn: "Corporate Culture",
    titleId: "Budaya Perusahaan",
    bodyEn:
      "Integrity in every partnership and transaction\nSustainability in how we farm and produce\nCollaboration with the communities we grow alongside\nContinuous improvement in quality and process",
    bodyId:
      "Integritas dalam setiap kemitraan dan transaksi\nKeberlanjutan dalam cara kami bertani dan berproduksi\nKolaborasi dengan komunitas tempat kami tumbuh bersama\nPerbaikan berkelanjutan dalam kualitas dan proses",
  },
  {
    key: "halal",
    titleEn: "Halal Certificate",
    titleId: "Sertifikat Halal",
    bodyEn: "",
    bodyId: "",
  },
  {
    key: "bpom",
    titleEn: "BPOM Certificate",
    titleId: "Sertifikat BPOM",
    bodyEn: "",
    bodyId: "",
  },
];

const products = [
  {
    nameEn: "Palm Sugar Fruit (Aren)",
    nameId: "Buah Aren",
    detailEn: "Freshly harvested palm fruit, sourced sustainably from local growers.",
    detailId: "Buah aren segar yang dipanen secara berkelanjutan dari petani lokal.",
    order: 0,
  },
  {
    nameEn: "Palm Sugar",
    nameId: "Gula Aren",
    detailEn: "Naturally processed palm sugar with rich flavor, ready for export.",
    detailId: "Gula aren olahan alami dengan cita rasa khas, siap untuk ekspor.",
    order: 1,
  },
];

async function main() {
  for (const section of sections) {
    await prisma.pageSection.upsert({
      where: { key: section.key },
      update: {},
      create: section,
    });
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({ data: products });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "hifzilirsyad@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "change-me-now";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  console.log("Seed complete. Admin login:", adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

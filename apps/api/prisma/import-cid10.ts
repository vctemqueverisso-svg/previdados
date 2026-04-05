import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatCidCode(raw: string) {
  if (raw.length <= 3) {
    return raw;
  }

  return `${raw.slice(0, 3)}.${raw.slice(3)}`;
}

async function main() {
  const filePath = join(__dirname, "data", "CID-10-SUBCATEGORIAS.CSV");
  const fileContents = readFileSync(filePath, "utf8");
  const lines = fileContents.split(/\r?\n/).filter(Boolean);
  const rows = lines.slice(1);

  const cidRows: { code: string; description: string }[] = [];
  const diseaseMap = new Map<string, { name: string; normalizedName: string }>();

  for (const line of rows) {
    const columns = line.split(";");
    const rawCode = columns[0]?.trim();
    const description = columns[4]?.trim();

    if (!rawCode || !description) {
      continue;
    }

    const code = formatCidCode(rawCode);
    cidRows.push({ code, description });

    const normalizedName = normalizeText(description);
    if (!diseaseMap.has(normalizedName)) {
      diseaseMap.set(normalizedName, {
        name: description,
        normalizedName
      });
    }
  }

  const diseaseRows = [...diseaseMap.values()];

  await prisma.cid.createMany({
    data: cidRows,
    skipDuplicates: true
  });

  await prisma.disease.createMany({
    data: diseaseRows,
    skipDuplicates: true
  });

  console.log(`CIDs importadas: ${cidRows.length}`);
  console.log(`Doencas oficiais importadas: ${diseaseRows.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

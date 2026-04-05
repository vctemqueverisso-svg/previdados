import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import { BenefitType, CaseStatus, ChannelType, Gender, OutcomeStatus, UserRole } from "../src/common/enums";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash("admin123");

  const admin = await prisma.user.upsert({
    where: { email: "admin@jcprevdados.local" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@jcprevdados.local",
      passwordHash,
      role: UserRole.ADMIN
    }
  });

  const [lombalgia, depressao] = await Promise.all([
    prisma.disease.upsert({
      where: { name: "Lombalgia" },
      update: {},
      create: { name: "Lombalgia", normalizedName: "lombalgia" }
    }),
    prisma.disease.upsert({
      where: { name: "Depressao" },
      update: {},
      create: { name: "Depressao", normalizedName: "depressao" }
    })
  ]);

  const [m545, f320] = await Promise.all([
    prisma.cid.upsert({
      where: { code: "M54.5" },
      update: {},
      create: { code: "M54.5", description: "Dor lombar baixa" }
    }),
    prisma.cid.upsert({
      where: { code: "F32.0" },
      update: {},
      create: { code: "F32.0", description: "Episodio depressivo leve" }
    })
  ]);

  const categories = [
    ["Documentos pessoais", "DOC_PESSOAL", false, false],
    ["Laudo medico particular", "LAUDO_PARTICULAR", true, false],
    ["Exame", "EXAME", true, false],
    ["Atestado", "ATESTADO", true, false],
    ["Pericia administrativa", "PERICIA_ADMIN", true, true],
    ["Pericia judicial", "PERICIA_JUD", true, true],
    ["Parecer social", "PARECER_SOCIAL", false, true],
    ["Decisao administrativa", "DECISAO_ADMIN", false, true],
    ["Sentenca", "SENTENCA", false, true],
    ["Acordao", "ACORDAO", false, true],
    ["Peticao inicial", "PETICAO_INICIAL", false, true],
    ["Recurso", "RECURSO", false, true],
    ["Outros", "OUTROS", false, false]
  ] as const;

  for (const [name, code, isMedical, isProcedural] of categories) {
    await prisma.documentCategory.upsert({
      where: { code },
      update: {},
      create: { name, code, isMedical, isProcedural }
    });
  }

  const existingExpert = await prisma.expert.findFirst({
    where: {
      fullName: "Dr. Carlos Almeida",
      registryNumber: "CRM 12345"
    }
  });

  const expert =
    existingExpert ??
    (await prisma.expert.create({
      data: {
        fullName: "Dr. Carlos Almeida",
        specialty: "Ortopedia",
        registryNumber: "CRM 12345",
        city: "Sao Paulo",
        state: "SP",
        internalNotes: "Perito frequentemente rigoroso em incapacidade parcial."
      }
    }));

  const client = await prisma.client.upsert({
    where: { cpf: "12345678900" },
    update: {},
    create: {
      fullName: "Maria Aparecida Souza",
      cpf: "12345678900",
      birthDate: new Date("1972-06-18"),
      gender: Gender.FEMININO,
      phone: "(11) 99999-0000",
      email: "maria@example.com",
      zipCode: "04567-000",
      street: "Rua das Acacias",
      addressNumber: "145",
      neighborhood: "Vila Mariana",
      complement: "Apto 32",
      city: "Sao Paulo",
      state: "SP",
      notes: "Cliente com historico laboral em servicos gerais.",
      createdByUserId: admin.id
    }
  });

  const legalCase = await prisma.case.upsert({
    where: { internalCode: "CASO-0001" },
    update: {},
    create: {
      internalCode: "CASO-0001",
      clientId: client.id,
      caseNumber: "5001234-00.2025.4.03.6100",
      channelType: ChannelType.JUDICIAL,
      benefitType: BenefitType.AUXILIO_DOENCA,
      protocolDate: new Date("2025-01-05"),
      derDate: new Date("2024-12-20"),
      expertExamDate: new Date("2025-03-10"),
      decisionDate: new Date("2025-04-01"),
      mainDiseaseId: lombalgia.id,
      mainCidId: m545.id,
      profession: "Auxiliar de limpeza",
      educationLevel: "Ensino fundamental",
      ageAtFiling: 52,
      familyIncome: 1200,
      familyGroupDescription: "Cliente, esposo desempregado e neto.",
      expertId: expert.id,
      courtAgencyName: "3a Vara Federal Previdenciaria",
      courtDivision: "Sao Paulo",
      city: "Sao Paulo",
      state: "SP",
      urgentReliefRequested: true,
      currentStatus: CaseStatus.AGUARDANDO_DECISAO,
      strategySummary: "Foco em incapacidade total para atividade habitual.",
      createdByUserId: admin.id,
      result: {
        create: {
          administrativeResult: OutcomeStatus.INDEFERIDO,
          judicialResult: OutcomeStatus.PARCIALMENTE_PROCEDENTE,
          finalOutcome: OutcomeStatus.PARCIALMENTE_PROCEDENTE,
          outcomeReason: "Reconhecimento parcial da incapacidade temporaria.",
          decisionSummary: "Sentenca concedeu beneficio por 6 meses.",
          successFlag: true
        }
      }
    }
  });

  const existingProtocol = await prisma.proceduralEvent.findFirst({
    where: {
      caseId: legalCase.id,
      eventType: "PROTOCOLO"
    }
  });

  if (!existingProtocol) {
    await prisma.proceduralEvent.createMany({
      data: [
        {
          caseId: legalCase.id,
          eventType: "PROTOCOLO",
          eventDate: new Date("2025-01-05"),
          description: "Distribuicao da acao judicial.",
          createdByUserId: admin.id
        },
        {
          caseId: legalCase.id,
          eventType: "PERICIA_JUDICIAL",
          eventDate: new Date("2025-03-10"),
          description: "Pericia realizada com ortopedista.",
          createdByUserId: admin.id
        }
      ]
    });
  }

  const existingNote = await prisma.internalNote.findFirst({
    where: { caseId: legalCase.id }
  });

  if (!existingNote) {
    await prisma.internalNote.create({
      data: {
        caseId: legalCase.id,
        strengthOfMedicalEvidence: "FORTE",
        mainObstacle: "Historico contributivo irregular.",
        mainThesis: "Incapacidade total e temporaria para atividade habitual.",
        secondaryThesis: "Conversao futura em aposentadoria por incapacidade, se houver agravamento.",
        hearingExamNotes: "Ressaltar limitacoes para ortostatismo prolongado.",
        estimatedRisk: "MEDIO",
        reasonForDenial: "Pericia administrativa minimizou limitacoes.",
        decisionCentralGround: "Capacidade residual parcial.",
        privateNote: "Preparar comparativo entre laudos particulares e judicial.",
        createdByUserId: admin.id
      }
    });
  }

  await prisma.case.upsert({
    where: { internalCode: "CASO-0002" },
    update: {},
    create: {
      internalCode: "CASO-0002",
      clientId: client.id,
      caseNumber: "NB 999.999.999-9",
      channelType: ChannelType.ADMINISTRATIVO,
      benefitType: BenefitType.BPC_LOAS,
      protocolDate: new Date("2025-02-10"),
      derDate: new Date("2025-02-10"),
      mainDiseaseId: depressao.id,
      mainCidId: f320.id,
      profession: "Diarista",
      educationLevel: "Ensino medio",
      ageAtFiling: 53,
      familyIncome: 700,
      familyGroupDescription: "Cliente e filha desempregada.",
      courtAgencyName: "Agencia INSS Centro",
      city: "Sao Paulo",
      state: "SP",
      currentStatus: CaseStatus.EM_ANALISE,
      createdByUserId: admin.id,
      result: {
        create: {
          administrativeResult: OutcomeStatus.PENDENTE,
          finalOutcome: OutcomeStatus.PENDENTE
        }
      }
    }
  });
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

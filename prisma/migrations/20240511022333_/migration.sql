-- CreateTable
CREATE TABLE "ProjectTable" (
    "id" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "projectManagement" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ProjectTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectParticipant" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ProjectParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTable_id_key" ON "ProjectTable"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectParticipant_id_key" ON "ProjectParticipant"("id");

-- AddForeignKey
ALTER TABLE "ProjectTable" ADD CONSTRAINT "ProjectTable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectParticipant" ADD CONSTRAINT "ProjectParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectParticipant" ADD CONSTRAINT "ProjectParticipant_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

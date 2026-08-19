-- CreateTable
CREATE TABLE "CalendarIntegration" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "CalendarIntegration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CalendarIntegration" ADD CONSTRAINT "CalendarIntegration_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

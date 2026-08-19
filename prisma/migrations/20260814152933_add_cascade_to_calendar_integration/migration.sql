-- DropForeignKey
ALTER TABLE "CalendarIntegration" DROP CONSTRAINT "CalendarIntegration_appointmentId_fkey";

-- AddForeignKey
ALTER TABLE "CalendarIntegration" ADD CONSTRAINT "CalendarIntegration_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

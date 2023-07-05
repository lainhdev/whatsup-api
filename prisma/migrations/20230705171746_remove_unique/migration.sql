-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_lastOfConversationId_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "lastOfConversationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_lastOfConversationId_fkey" FOREIGN KEY ("lastOfConversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

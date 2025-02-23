-- DropForeignKey
ALTER TABLE `businesscard` DROP FOREIGN KEY `BusinessCard_userId_fkey`;

-- DropIndex
DROP INDEX `BusinessCard_userId_key` ON `businesscard`;

-- AddForeignKey
ALTER TABLE `BusinessCard` ADD CONSTRAINT `BusinessCard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

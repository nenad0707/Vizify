-- AlterTable
ALTER TABLE `businesscard` ADD COLUMN `backgroundColor` VARCHAR(191) NULL,
    ADD COLUMN `company` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `isFavorite` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `logo` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL;

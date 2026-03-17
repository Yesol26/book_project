-- AlterTable
ALTER TABLE `clubs` ADD COLUMN `capacity` INTEGER NOT NULL DEFAULT 20,
    ADD COLUMN `meetingDay` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `club_records` (
    `id` VARCHAR(191) NOT NULL,
    `clubId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `club_records` ADD CONSTRAINT `club_records_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `clubs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `club_records` ADD CONSTRAINT `club_records_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

DROP TABLE `apikey`;--> statement-breakpoint
DROP TABLE `invitation`;--> statement-breakpoint
DROP TABLE `member`;--> statement-breakpoint
DROP TABLE `organization`;--> statement-breakpoint
DROP INDEX `user_username_unique`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `username`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `display_username`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `role`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `banned`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `ban_reason`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `ban_expires`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `is_anonymous`;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `active_organization_id`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `impersonated_by`;--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);
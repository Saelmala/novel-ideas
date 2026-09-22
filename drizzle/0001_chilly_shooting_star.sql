CREATE TABLE `reading_challenge` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`year` integer NOT NULL,
	`target` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reading_challenge_user_year` ON `reading_challenge` (`user_id`,`year`);--> statement-breakpoint
ALTER TABLE `shelf_entry` ADD `read_at` text;
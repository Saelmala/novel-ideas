CREATE TABLE `shelf_entry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`work_key` text NOT NULL,
	`status` text NOT NULL,
	`title` text NOT NULL,
	`authors` text NOT NULL,
	`cover_id` integer,
	`first_publish_year` integer,
	`added_at` text DEFAULT current_timestamp NOT NULL,
	`updated_at` text DEFAULT current_timestamp NOT NULL,
	`edition_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shelf_entry_user_work` ON `shelf_entry` (`user_id`,`work_key`);
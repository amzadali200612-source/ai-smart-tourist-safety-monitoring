CREATE TABLE `area_safety_scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`area_name` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`safety_score` real NOT NULL,
	`crime_rate` real NOT NULL,
	`crowd_density` text NOT NULL,
	`recent_incidents` integer NOT NULL,
	`last_updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`message` text NOT NULL,
	`sender` text NOT NULL,
	`timestamp` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `danger_zones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`radius` real NOT NULL,
	`risk_level` text NOT NULL,
	`crime_rate` real NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `incident_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`incident_type` text NOT NULL,
	`description` text NOT NULL,
	`threat_level` text NOT NULL,
	`photo_url` text,
	`video_url` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`accuracy` real,
	`timestamp` text NOT NULL,
	`address` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `safety_resources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`address` text NOT NULL,
	`phone` text NOT NULL,
	`available_24_7` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sos_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`message` text,
	`notified_contacts` text,
	`created_at` text NOT NULL,
	`resolved_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`phone` text,
	`role` text DEFAULT 'tourist' NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`location_tracking_enabled` integer DEFAULT true NOT NULL,
	`emergency_contact_name` text,
	`emergency_contact_phone` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);

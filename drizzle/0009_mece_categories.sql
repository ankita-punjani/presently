ALTER TABLE "gift_ideas" ADD COLUMN "custom_category" text;--> statement-breakpoint
INSERT INTO "categories" ("name", "emoji") VALUES
	('Sports & outdoors', '🏃'),
	('Travel', '🧳'),
	('Pets', '🐾'),
	('Kids & baby', '🧸'),
	('Other', '✨')
ON CONFLICT ("name") DO NOTHING;

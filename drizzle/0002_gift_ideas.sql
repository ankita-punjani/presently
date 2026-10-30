CREATE TABLE "categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"emoji" text NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "gift_ideas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gift_ideas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"person_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"title" text NOT NULL,
	"price" numeric(10, 2),
	"link" text,
	"image_url" text,
	"store" text,
	"status" text DEFAULT 'idea' NOT NULL,
	"occasion" text DEFAULT 'birthday' NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"bought_on" date,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gift_ideas" ADD CONSTRAINT "gift_ideas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_ideas" ADD CONSTRAINT "gift_ideas_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_ideas" ADD CONSTRAINT "gift_ideas_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
INSERT INTO "categories" ("name", "emoji") VALUES
	('Clothes & accessories', '👗'),
	('Skincare & beauty', '🧴'),
	('Gaming & tech', '🎮'),
	('Home & cozy', '🕯️'),
	('Food & drink', '🍫'),
	('Books & hobbies', '📚'),
	('Experiences', '🎟️');

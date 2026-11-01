CREATE TABLE "stars" (
	"user_id" text NOT NULL,
	"gift_idea_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stars_user_id_gift_idea_id_pk" PRIMARY KEY("user_id","gift_idea_id")
);
--> statement-breakpoint
ALTER TABLE "stars" ADD CONSTRAINT "stars_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stars" ADD CONSTRAINT "stars_gift_idea_id_gift_ideas_id_fk" FOREIGN KEY ("gift_idea_id") REFERENCES "public"."gift_ideas"("id") ON DELETE cascade ON UPDATE no action;
CREATE TABLE "budgets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "budgets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
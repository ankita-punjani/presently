CREATE TABLE "product_cache" (
	"query" text PRIMARY KEY NOT NULL,
	"results" jsonb NOT NULL,
	"fetched_at" timestamp DEFAULT now() NOT NULL
);

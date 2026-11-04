UPDATE "categories" SET "name" = 'Clothing', "emoji" = '👕' WHERE "name" = 'Clothes & accessories';
--> statement-breakpoint
INSERT INTO "categories" ("name", "emoji") VALUES ('Shoes', '👟'), ('Accessories', '💍') ON CONFLICT ("name") DO NOTHING;
--> statement-breakpoint
UPDATE "gift_ideas" SET "category_id" = (SELECT "id" FROM "categories" WHERE "name" = 'Shoes')
WHERE "category_id" = (SELECT "id" FROM "categories" WHERE "name" = 'Clothing')
  AND "title" ~* '(sneaker|shoe|nike|adidas|jordan|onitsuka|new balance|converse|crocs|boot|slipper|laces|loafer|heels)';
--> statement-breakpoint
UPDATE "gift_ideas" SET "category_id" = (SELECT "id" FROM "categories" WHERE "name" = 'Accessories')
WHERE "category_id" = (SELECT "id" FROM "categories" WHERE "name" = 'Clothing')
  AND "title" ~* '(necklace|earring|bracelet|bangle|watch|wallet|belt|bag|tote|scarf|hat\M|beanie|gloves|sunglasses|cufflink|pocket square|hair clip|scrunchie|jewel|weekender|case)';

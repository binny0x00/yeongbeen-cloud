ALTER TABLE "document" ADD COLUMN "source_checksum" text;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "source_imported_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "source_key" text;--> statement-breakpoint
CREATE UNIQUE INDEX "document_source_key_unique" ON "document" USING btree ("source_key");
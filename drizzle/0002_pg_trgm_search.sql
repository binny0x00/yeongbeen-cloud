CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS document_localization_search_trgm_idx
  ON document_localization USING gin (search_text gin_trgm_ops);

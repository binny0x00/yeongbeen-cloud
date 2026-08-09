CREATE TABLE "ai_usage" (
	"action" text NOT NULL,
	"actor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"document_id" text NOT NULL,
	"error_code" text,
	"estimated_cost_micro_usd" integer,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"locale" text NOT NULL,
	"model" text NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"prompt_version" text NOT NULL,
	"provider_request_id" text,
	"status" text NOT NULL,
	"total_tokens" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_usage_actor_created_idx" ON "ai_usage" USING btree ("actor_id","created_at");--> statement-breakpoint
CREATE INDEX "ai_usage_document_created_idx" ON "ai_usage" USING btree ("document_id","created_at");
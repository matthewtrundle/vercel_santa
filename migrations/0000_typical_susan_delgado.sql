CREATE TYPE "public"."age_group" AS ENUM('toddler', 'preschool', 'early_school', 'tween', 'teen', 'adult');--> statement-breakpoint
CREATE TYPE "public"."agent_status" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."budget_tier" AS ENUM('budget', 'moderate', 'premium');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('created', 'photo_uploaded', 'profile_submitted', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "agent_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"agent_name" varchar(50) NOT NULL,
	"status" "agent_status" DEFAULT 'pending' NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"error" text,
	"duration_ms" integer,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gift_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"age_groups" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"price_range" "budget_tier" NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"image_url" text,
	"affiliate_url" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kid_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"age" integer NOT NULL,
	"interests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"budget_tier" "budget_tier" DEFAULT 'moderate' NOT NULL,
	"special_notes" text,
	"age_group" "age_group",
	"primary_interests" jsonb DEFAULT '[]'::jsonb,
	"secondary_interests" jsonb DEFAULT '[]'::jsonb,
	"personality_traits" jsonb DEFAULT '[]'::jsonb,
	"gift_categories" jsonb DEFAULT '[]'::jsonb,
	"avoid_categories" jsonb DEFAULT '[]'::jsonb,
	"image_analysis" jsonb,
	"profile_confidence" numeric(3, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"gift_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"reasoning" text,
	"matched_interests" jsonb DEFAULT '[]'::jsonb,
	"rank" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "santa_list_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"list_id" uuid NOT NULL,
	"gift_id" uuid NOT NULL,
	"recommendation_id" uuid,
	"notes" text,
	"priority" integer DEFAULT 0,
	"is_purchased" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "santa_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"share_slug" varchar(50),
	"santa_note" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "santa_lists_share_slug_unique" UNIQUE("share_slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "session_status" DEFAULT 'created' NOT NULL,
	"photo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "agent_runs" ADD CONSTRAINT "agent_runs_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kid_profiles" ADD CONSTRAINT "kid_profiles_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_gift_id_gift_inventory_id_fk" FOREIGN KEY ("gift_id") REFERENCES "public"."gift_inventory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "santa_list_items" ADD CONSTRAINT "santa_list_items_list_id_santa_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."santa_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "santa_list_items" ADD CONSTRAINT "santa_list_items_gift_id_gift_inventory_id_fk" FOREIGN KEY ("gift_id") REFERENCES "public"."gift_inventory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "santa_list_items" ADD CONSTRAINT "santa_list_items_recommendation_id_recommendations_id_fk" FOREIGN KEY ("recommendation_id") REFERENCES "public"."recommendations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "santa_lists" ADD CONSTRAINT "santa_lists_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
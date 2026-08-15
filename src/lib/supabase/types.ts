/**
 * Placeholder Database types. Replace by running:
 *
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
 *
 * Or with a linked local project:
 *
 *   npx supabase gen types typescript --local > src/lib/supabase/types.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

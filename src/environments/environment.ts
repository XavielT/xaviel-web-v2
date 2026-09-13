// Supabase connection settings for the x-core project.
//
// The URL and the anon key are public-safe and stay committed, exactly as they
// do in Music Hub: the anon key identifies the project, it does not authorise
// anything. RLS is what protects the data (ADR-04). Never paste the
// service_role key here — it would ship to every visitor in the main bundle.
//
// There is one x-core project and no separate dev instance, so there is no
// `environment.development.ts` and no `fileReplacements` entry: `npm start` and
// `npm run build` talk to the same database. Music Hub carries two files whose
// contents are identical for the same reason; one file is the honest version.
//
// Admin identity deliberately does NOT live here. It is a database concern —
// see ADR-04 and supabase/migrations/.
export const environment = {
  production: true,

  supabaseUrl: 'https://nakgrkcqyuycadeuenuw.supabase.co',

  // anon public key.
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ha2dya2NxeXV5Y2FkZXVlbnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjE1NjUsImV4cCI6MjEwNDAzNzU2NX0.83aqu6TlnXDs4eg-waT0FQlycvFc6hQinwgg42SSCwE',

  // The Postgres schema holding Tu Combustible RD's tables (ADR-03). Reached
  // per-query with `supabase.appSchema()` rather than being the client default,
  // because auth and `public.profiles` still live in `public`.
  //
  // NOT YET CREATED OR EXPOSED — see supabase/migrations/README.md.
  appSchema: 'tucombustible',
};

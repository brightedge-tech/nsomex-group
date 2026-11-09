# Security baseline

Security is a release requirement, not a final polish task. These controls are implementation targets and do not represent a certification.

## Secrets and configuration
- Commit only `.env.example` with variable names and safe placeholders.
- Keep `.env.local`, private keys, access tokens, database passwords, and Supabase service-role/secret keys out of Git.
- Public browser configuration may include only the Supabase project URL and publishable key.
- Use Vercel encrypted environment variables for deployment secrets.
- Rotate any credential that may have been exposed.

## Identity and authorization
- Require authenticated sessions for admin routes and mutations.
- Enforce role and scope checks on the server for every privileged operation.
- Do not trust client-provided role, user ID, division ID, or storage path.
- Use least-privilege roles and MFA for privileged administrators where supported.
- Revoke access promptly when staff roles change.

## Database
- Enable RLS on all tables exposed through Supabase APIs.
- Policies must explicitly cover SELECT, INSERT, UPDATE, and DELETE as applicable.
- Avoid broad policies such as unconditional `USING (true)` for private/admin data.
- Keep service-role operations server-only and minimal.
- Review migrations for destructive operations and data-locking risks.

## Storage and uploads
- Draft media must be private.
- Validate extension, declared MIME type, file signature/content, size, and user authorization.
- Generate storage object paths on the server; do not accept arbitrary paths from clients.
- Prevent executable or active content from being served as trusted HTML.
- Use signed URLs for private previews with short expirations.
- Restrict public access to media that has been approved and published.
- Record uploader, timestamps, association, and relevant changes.
- Consider malware scanning and image/video processing before production upload workflows are enabled.

## Web application
- Validate all input on the server with shared schemas.
- Encode output and avoid unsafe HTML injection.
- Use secure cookies and HTTPS.
- Apply CSRF protections where relevant to mutation mechanisms.
- Rate-limit public enquiry endpoints and add spam controls.
- Do not expose stack traces, secrets, or internal database errors to visitors.
- Set appropriate security headers and a restrictive Content Security Policy after inventorying required assets.

## Operations
- Maintain separate development and production Supabase projects.
- Back up production data and test restoration before launch.
- Keep dependencies patched and review security advisories.
- Record privileged content and permission changes in audit logs.
- Establish an incident response and credential-rotation procedure.
- Perform security and authorization testing before launch.

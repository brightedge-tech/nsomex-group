import Link from "next/link";
export default function AdminAccessPendingPage() {
  return <main className="cms-pending"><section className="cms-pending-card">
    <p className="cms-eyebrow">NSOMEX GROUP / ADMINISTRATION</p>
    <h1>Administrator access is not ready</h1>
    <p>Your account may be signed in, but the CMS administrator profile and active role have not been provisioned yet. The CMS database migrations must be applied to the development project and the first administrator must be added using the secure bootstrap procedure.</p>
    <p>No self-registration is available in this system.</p>
    <Link href="/admin/login">Return to sign in</Link>
  </section></main>;
}

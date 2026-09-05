import Link from "next/link";
import { Container } from "@/components/ui/container";

const company = {
  name: "TerraForce Equipment Group",
  businessType: "Manufacturer",
  country: "China",
  address: "Shenzhen, Guangdong",
  website: "https://terraforce.example",
  about: "Specialist in industrial equipment, advanced material handling systems, and turnkey manufacturing solutions for global trade clients.",
  yearsInBusiness: "14 years",
  products: ["Industrial motors", "Material handling", "Power systems", "Packaging equipment"],
  factory: "30,000 sq ft manufacturing facility with quality control lab",
  certifications: ["ISO 9001", "CE Marking", "Export Quality Control"],
  contact: "supply@terraforce.example",
};

export default function SupplierCompanyPage() {
  return (
    <main className="py-12">
      <Container>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Supplier profile</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">{company.name}</h1>
            </div>
            <Link href="/supplier/profile" className="inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Edit Company Profile</Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white">TF</div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{company.name}</p>
                  <p className="text-sm text-slate-500">{company.businessType}</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-700">Country:</span> {company.country}</p>
                <p><span className="font-semibold text-slate-700">Address:</span> {company.address}</p>
                <p><span className="font-semibold text-slate-700">Website:</span> {company.website}</p>
                <p><span className="font-semibold text-slate-700">Years in business:</span> {company.yearsInBusiness}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">About company</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{company.about}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Main products</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {company.products.map((product) => <li key={product}>• {product}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Factory info</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">{company.factory}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Certifications</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {company.certifications.map((certificate) => <li key={certificate}>• {certificate}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p><span className="font-semibold text-slate-700">Contact:</span> {company.contact}</p>
          </div>
        </div>
      </Container>
    </main>
  );
}

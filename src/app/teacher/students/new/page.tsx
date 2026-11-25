"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Form = {
  fullName: string;
  cnic: string;
  gender: string;
  className: string;
  section: string;
  rollNumber: string;
  fatherName: string;
  fatherCNIC: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherCNIC: string;
  motherOccupation: string;
  motherPhone: string;
  emergencyContact: string;
  homeAddress: string;
};

const initialForm: Form = {
  fullName: "",
  cnic: "",
  gender: "",
  className: "",
  section: "",
  rollNumber: "",
  fatherName: "",
  fatherCNIC: "",
  fatherOccupation: "",
  fatherPhone: "",
  motherName: "",
  motherCNIC: "",
  motherOccupation: "",
  motherPhone: "",
  emergencyContact: "",
  homeAddress: "",
};

export default function TeacherNewStudentPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<string[]>([]);
  const [form, setForm] = useState<Form>(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    fetch("/api/teachers/me/classes")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Unable to load assigned classes");
        setClasses(result.assignedClasses);
        const first = result.assignedClasses[0]?.split("-") ?? [];
        setForm((current) => ({
          ...current,
          className: first[0] ?? "",
          section: first.slice(1).join("-"),
        }));
      })
      .catch((cause: Error) => setError(cause.message || "Unable to connect to the server"))
      .finally(() => setLoadingClasses(false));
  }, []);

  function update(key: keyof Form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function chooseClass(value: string) {
    const parts = value.split("-");
    setForm((current) => ({
      ...current,
      className: parts[0] ?? "",
      section: parts.slice(1).join("-"),
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Unable to submit student");
        return;
      }
      setMessage("Student request submitted for administrator approval.");
      window.setTimeout(() => router.push("/teacher/students"), 900);
    } catch {
      setError("Unable to connect to the server");
    } finally {
      setSaving(false);
    }
  }

  const field = "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3";

  return (
    <main className="app-page bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/teacher/students" className="text-sm font-medium text-blue-600">← My students</Link>
        <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Add student request</h1>
        <p className="mt-2 text-slate-500">Only classes assigned to you by Admin can be selected.</p>
        <form onSubmit={submit} className="mt-8 space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-semibold">Student information</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium sm:col-span-2">
                Full name *
                <input required value={form.fullName} onChange={(event) => update("fullName", event.target.value)} className={field} />
              </label>
              <label className="text-sm font-medium">
                Student CNIC *
                <input required value={form.cnic} onChange={(event) => update("cnic", event.target.value)} placeholder="42101-1234567-1" className={field} />
              </label>
              <label className="text-sm font-medium">
                Gender *
                <select required value={form.gender} onChange={(event) => update("gender", event.target.value)} className={field}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="text-sm font-medium">
                Class and section *
                <select required value={`${form.className}-${form.section}`} onChange={(event) => chooseClass(event.target.value)} className={field}>
                  <option value="">{loadingClasses ? "Loading classes…" : "Select assigned class"}</option>
                  {classes.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">
                Roll number *
                <input required value={form.rollNumber} onChange={(event) => update("rollNumber", event.target.value)} className={field} />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-semibold">Parent and guardian information</h2>
            <p className="mt-1 text-sm text-slate-500">
              Father name and CNIC are required. Other family and emergency details are optional.
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Father name *
                <input required value={form.fatherName} onChange={(event) => update("fatherName", event.target.value)} className={field} />
              </label>
              <label className="text-sm font-medium">
                Father CNIC *
                <input required value={form.fatherCNIC} onChange={(event) => update("fatherCNIC", event.target.value)} placeholder="42101-1234567-1" className={field} />
              </label>
              <label className="text-sm font-medium">
                Father occupation
                <input value={form.fatherOccupation} onChange={(event) => update("fatherOccupation", event.target.value)} placeholder="Business, teacher, driver…" className={field} />
              </label>
              <label className="text-sm font-medium">
                Father phone
                <input value={form.fatherPhone} onChange={(event) => update("fatherPhone", event.target.value)} placeholder="03001234567" className={field} />
              </label>
              <label className="text-sm font-medium">
                Mother name
                <input value={form.motherName} onChange={(event) => update("motherName", event.target.value)} className={field} />
              </label>
              <label className="text-sm font-medium">
                Mother CNIC
                <input value={form.motherCNIC} onChange={(event) => update("motherCNIC", event.target.value)} placeholder="42101-1234567-1" className={field} />
              </label>
              <label className="text-sm font-medium">
                Mother occupation
                <input value={form.motherOccupation} onChange={(event) => update("motherOccupation", event.target.value)} className={field} />
              </label>
              <label className="text-sm font-medium">
                Mother phone
                <input value={form.motherPhone} onChange={(event) => update("motherPhone", event.target.value)} placeholder="03001234567" className={field} />
              </label>
              <label className="text-sm font-medium">
                Emergency contact
                <input value={form.emergencyContact} onChange={(event) => update("emergencyContact", event.target.value)} placeholder="03001234567" className={field} />
              </label>
              <label className="text-sm font-medium sm:col-span-2">
                Home address
                <textarea value={form.homeAddress} onChange={(event) => update("homeAddress", event.target.value)} className={`${field} min-h-24`} />
              </label>
            </div>
          </section>

          {error ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          {message ? <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}
          <button disabled={saving || loadingClasses || !classes.length} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60">
            {saving ? "Submitting…" : loadingClasses ? "Loading classes…" : classes.length ? "Submit request" : "No assigned classes"}
          </button>
        </form>
      </div>
    </main>
  );
}

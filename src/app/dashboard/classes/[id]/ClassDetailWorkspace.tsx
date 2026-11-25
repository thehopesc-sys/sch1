"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TimetableEditor from "@/components/TimetableEditor";

type ClassRosterStudent = {
  id: string;
  name: string;
  studentId: string;
  cnic: string;
  rollNumber: string;
  voucherNo: string;
  gender: string;
  fatherName: string;
  fatherCNIC: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherCNIC: string;
  motherOccupation: string;
  motherPhone: string;
  homeAddress: string;
  emergencyContact: string;
  accountStatus: "active" | "pending";
  createdAt: string;
};

type ClassDetailWorkspaceProps = {
  className: string;
  academicYear: string;
  students: ClassRosterStudent[];
};

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function phoneHref(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export default function ClassDetailWorkspace({
  className,
  academicYear,
  students,
}: ClassDetailWorkspaceProps) {
  const [tab, setTab] = useState<"students" | "timetable">("students");
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("roll");

  const visibleStudents = useMemo(() => {
    const tokens = search.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return students
      .filter((student) => !gender || student.gender === gender)
      .filter((student) => !status || student.accountStatus === status)
      .filter((student) => {
        const searchable = [
          student.name,
          student.studentId,
          student.cnic,
          student.rollNumber,
          student.voucherNo,
          student.gender,
          student.fatherName,
          student.fatherCNIC,
          student.fatherOccupation,
          student.fatherPhone,
          student.motherName,
          student.motherCNIC,
          student.motherOccupation,
          student.motherPhone,
          student.homeAddress,
          student.emergencyContact,
          student.accountStatus,
        ].join(" ").toLocaleLowerCase();
        return tokens.every((token) => searchable.includes(token));
      })
      .sort((first, second) => {
        if (sortBy === "name") return collator.compare(first.name, second.name);
        if (sortBy === "newest") return second.createdAt.localeCompare(first.createdAt);
        return collator.compare(first.rollNumber, second.rollNumber);
      });
  }, [gender, search, sortBy, status, students]);

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div role="tablist" aria-label="Class workspace" className="flex border-b border-slate-200 bg-slate-50 p-2">
        <button
          id="class-students-tab"
          type="button"
          role="tab"
          aria-selected={tab === "students"}
          aria-controls="class-students-panel"
          onClick={() => setTab("students")}
          className={`min-h-11 rounded-xl px-4 text-sm font-semibold transition ${tab === "students" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}
        >
          Students <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs">{students.length}</span>
        </button>
        <button
          id="class-timetable-tab"
          type="button"
          role="tab"
          aria-selected={tab === "timetable"}
          aria-controls="class-timetable-panel"
          onClick={() => setTab("timetable")}
          className={`min-h-11 rounded-xl px-4 text-sm font-semibold transition ${tab === "timetable" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}
        >
          Timetable
        </button>
      </div>

      {tab === "students" ? (
        <div id="class-students-panel" role="tabpanel" aria-labelledby="class-students-tab" className="p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Students in {className}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {visibleStudents.length} of {students.length} students · search names, IDs, parent details, or phone numbers.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[28rem]">
              <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
                Search students
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name, student ID, CNIC, roll, parent, or phone"
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Gender
                <select
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">All genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Account status
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Active and pending</option>
                  <option value="active">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
                Sort by
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="roll">Roll number</option>
                  <option value="name">Name A–Z</option>
                  <option value="newest">Recently added</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            {visibleStudents.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="font-semibold text-slate-700">No students match these filters</p>
                <p className="mt-1 text-sm text-slate-500">Try another search or clear a filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 sm:px-5">Student</th>
                      <th className="px-4 py-3 sm:px-5">Roll number</th>
                      <th className="px-4 py-3 sm:px-5">Parent contact</th>
                      <th className="px-4 py-3 sm:px-5">Gender</th>
                      <th className="px-4 py-3 sm:px-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleStudents.map((student) => {
                      const contacts = [
                        { name: student.fatherName || "Father", phone: student.fatherPhone },
                        { name: student.motherName || "Mother", phone: student.motherPhone },
                        { name: "Emergency", phone: student.emergencyContact },
                      ].filter((contact) => contact.phone);
                      return (
                        <tr key={student.id} className="transition hover:bg-blue-50/50">
                          <td className="px-4 py-3.5 sm:px-5">
                            <div className="flex items-center gap-3">
                              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                                {initials(student.name)}
                              </span>
                              <div className="min-w-0">
                                <Link href={`/dashboard/students/${student.id}`} className="font-semibold text-slate-900 hover:text-blue-700 hover:underline">
                                  {student.name}
                                </Link>
                                <p className="mt-0.5 text-xs text-slate-500">{student.studentId || student.cnic || "No student ID"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-700 sm:px-5">{student.rollNumber || "—"}</td>
                          <td className="px-4 py-3.5 sm:px-5">
                            {contacts.length ? (
                              <div className="space-y-1">
                                {contacts.map((contact, index) => (
                                  <a key={`${contact.name}-${index}`} href={`tel:${phoneHref(contact.phone)}`} className="block text-xs text-slate-600 hover:text-blue-700 hover:underline">
                                    <span className="font-medium">{contact.name}:</span> {contact.phone}
                                  </a>
                                ))}
                              </div>
                            ) : <span className="text-xs text-slate-400">No phone listed</span>}
                          </td>
                          <td className="px-4 py-3.5 capitalize text-slate-600 sm:px-5">{student.gender || "—"}</td>
                          <td className="px-4 py-3.5 sm:px-5">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${student.accountStatus === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                              {student.accountStatus === "active" ? "Approved" : "Pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div id="class-timetable-panel" role="tabpanel" aria-labelledby="class-timetable-tab" className="p-4 sm:p-6">
          <h2 className="text-xl font-bold text-slate-900">Timetable · {className}</h2>
          <p className="mt-1 text-sm text-slate-500">Academic year {academicYear}.</p>
          <TimetableEditor scope="class" target={className} academicYear={academicYear} />
        </div>
      )}
    </section>
  );
}

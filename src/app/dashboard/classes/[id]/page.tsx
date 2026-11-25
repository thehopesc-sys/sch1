import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ClassSection, Student } from "@/Models";
import BackLink from "@/components/BackLink";
import ClassActions from "@/components/ClassActions";
import ClassDetailWorkspace from "./ClassDetailWorkspace";

export const dynamic = "force-dynamic";

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session.authenticated || session.user?.role !== "admin") redirect("/dashboard");
  const { id } = await params;
  await connectToDatabase();
  const classSection = await ClassSection.findById(id).lean();
  if (!classSection || !classSection.isActive) notFound();
  const className = `${classSection.className}-${classSection.sectionName}`;
  const students = await Student.find({
    class: classSection.className,
    section: classSection.sectionName,
    accountStatus: { $in: ["active", "pending"] },
  })
    .select("fullName studentId cnic rollNumber voucherNo gender fatherName fatherCNIC fatherOccupation fatherPhone motherName motherCNIC motherOccupation motherPhone homeAddress emergencyContact accountStatus createdAt")
    .sort({ rollNumber: 1, _id: 1 })
    .lean();
  const roster = students.map((student) => ({
    id: String(student._id),
    name: student.fullName,
    studentId: student.studentId ?? "",
    cnic: student.cnic ?? "",
    rollNumber: student.rollNumber ?? "",
    voucherNo: student.voucherNo ?? "",
    gender: student.gender ?? "",
    fatherName: student.fatherName ?? "",
    fatherCNIC: student.fatherCNIC ?? "",
    fatherOccupation: student.fatherOccupation ?? "",
    fatherPhone: student.fatherPhone ?? "",
    motherName: student.motherName ?? "",
    motherCNIC: student.motherCNIC ?? "",
    motherOccupation: student.motherOccupation ?? "",
    motherPhone: student.motherPhone ?? "",
    homeAddress: student.homeAddress ?? "",
    emergencyContact: student.emergencyContact ?? "",
    accountStatus: student.accountStatus === "active" ? "active" as const : "pending" as const,
    createdAt: student.createdAt instanceof Date ? student.createdAt.toISOString() : "",
  }));
  return (
    <main className="app-page bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-6xl">
        <BackLink />
        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Class management</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{className}</h1>
            <p className="mt-2 text-slate-500">Students and timetable for academic year {classSection.academicYear}.</p>
          </div>
          <ClassActions id={String(classSection._id)} label={className} />
        </div>
        <ClassDetailWorkspace className={className} academicYear={classSection.academicYear} students={roster} />
      </div>
    </main>
  );
}

import { NextResponse } from "next/server";

import { getPortalSession, userRest } from "../../../lib/portalSupabase";

type Project = {
  id: string;
  client_id: string;
  name: string;
  slug: string;
  status: string;
  tier: string | null;
  quoted_total: number | null;
  started_at: string | null;
  launched_at: string | null;
  created_at: string;
};

type Client = {
  id: string;
  user_id: string;
  business_name: string;
  contact_name: string;
  phone: string | null;
};

type FileRow = {
  id: string;
  project_id: string;
  uploaded_by: string;
  filename: string;
  size: number;
  kind: "deliverable" | "asset" | "doc";
  created_at: string;
};

type TimeEntry = {
  id: string;
  project_id: string;
  date: string;
  phase: string;
  description: string;
  hours: number;
};

type Invoice = {
  id: string;
  project_id: string;
  amount: number;
  status: string;
  due_at: string | null;
  paid_at: string | null;
};

export async function GET() {
  const session = await getPortalSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const [projects, clients, fileRows, timeEntries, invoices] = await Promise.all([
      userRest<Project[]>(
        "projects?select=id,client_id,name,slug,status,tier,quoted_total,started_at,launched_at,created_at&order=created_at.desc",
        session.accessToken,
      ),
      userRest<Client[]>(
        "clients?select=id,user_id,business_name,contact_name,phone&order=business_name.asc",
        session.accessToken,
      ),
      userRest<FileRow[]>(
        "files?select=id,project_id,uploaded_by,filename,size,kind,created_at&order=created_at.desc",
        session.accessToken,
      ),
      userRest<TimeEntry[]>(
        "time_entries?select=id,project_id,date,phase,description,hours&order=date.desc,created_at.desc",
        session.accessToken,
      ),
      userRest<Invoice[]>(
        "invoices?select=id,project_id,amount,status,due_at,paid_at&order=created_at.desc",
        session.accessToken,
      ),
    ]);

    return NextResponse.json({
      user: session.profile,
      projects,
      clients,
      files: fileRows,
      timeEntries,
      invoices,
    });
  } catch (error) {
    console.error("Portal dashboard load failed", error);
    return NextResponse.json(
      { error: "The portal data could not be loaded." },
      { status: 500 },
    );
  }
}

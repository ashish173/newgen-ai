import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const role = (session as any)?.user?.role as string | undefined;

  const leadsCount = await prisma.lead.count();
  const quotesCount = await prisma.quotation.count();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Leads</div>
          <div className="text-2xl font-bold">{leadsCount}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Quotations</div>
          <div className="text-2xl font-bold">{quotesCount}</div>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="font-medium">Role</div>
        <div className="text-gray-700">{role || 'Guest'}</div>
      </div>
    </div>
  );
}

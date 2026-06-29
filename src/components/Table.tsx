export default function Table({ headers, rows }: { headers: string[]; rows: (string | number | JSX.Element)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 border-b bg-gray-50">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2 border-b">{c as any}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

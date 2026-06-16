import { useState, useEffect } from "react";
import ApplicationTable from "../components/ApplicationTable";
import { fetchApplications } from "../api";
import { Loader2 } from "lucide-react";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchApplications({ page, search })
      .then((res) => {
        setApplications(res.data.data);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and manage your job applications.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      ) : (
        <ApplicationTable
          data={applications}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          search={search}
          onSearchChange={handleSearch}
          onUpdate={() =>
            fetchApplications({ page, search }).then((res) => {
              setApplications(res.data.data);
              setTotalPages(res.data.totalPages);
            })
          }
        />
      )}
    </div>
  );
}

export default Applications;

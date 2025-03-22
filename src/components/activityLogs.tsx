import React, { useEffect, useState } from "react";
import { fetchActivityLogs } from "../services/vendorService";

interface ActivityLog {
  id: number;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
}

const ActivityLogComponent: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLogs = async () => {
      const data = await fetchActivityLogs();
      setLogs(data);
      setLoading(false);
    };

    getLogs();
  }, []);

  if (loading) return <p>Loading activity logs...</p>;

  return (
    <div className="container mt-3">
      <h5>📜 Activity Logs</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-sm">
          <thead className="table-light">
            <tr>
              <th>Action</th>
              <th>Performed By</th>
              <th>Details</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No activity logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.action}</td>
                  <td>{log.performedBy}</td>
                  <td>{log.details}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogComponent;

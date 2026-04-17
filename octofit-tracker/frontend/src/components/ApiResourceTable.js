import { useCallback, useEffect, useMemo, useState } from 'react';

function pickIdentifier(record, fallbackIndex) {
  return (
    record?.id ??
    record?._id ??
    record?.uuid ??
    record?.pk ??
    `row-${fallbackIndex + 1}`
  );
}

function pickPrimary(record) {
  const preferredKeys = [
    'name',
    'title',
    'username',
    'full_name',
    'team_name',
    'workout_name',
    'activity_name',
  ];

  for (const key of preferredKeys) {
    const value = record?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value);
    }
  }

  const firstScalarEntry = Object.entries(record || {}).find(([, value]) =>
    ['string', 'number', 'boolean'].includes(typeof value)
  );

  return firstScalarEntry ? String(firstScalarEntry[1]) : 'N/A';
}

function pickSecondary(record) {
  const preferredKeys = ['email', 'status', 'type', 'score', 'date', 'created_at'];

  for (const key of preferredKeys) {
    const value = record?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value);
    }
  }

  const entries = Object.entries(record || {})
    .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
    .slice(0, 3)
    .map(([key, value]) => `${key}: ${value}`);

  return entries.length > 0 ? entries.join(' | ') : 'No summary available';
}

function ApiResourceTable({ title, resourcePath }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);

const endpoint = useMemo(() => {
  const baseUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`;
  return `${baseUrl}/${resourcePath}/`;
}, [resourcePath]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      console.log(`[${title}] REST endpoint:`, endpoint);

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const payload = await response.json();
      console.log(`[${title}] Fetched raw payload:`, payload);

      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
        ? payload.results
        : [];

      console.log(`[${title}] Normalized data:`, normalized);
      setItems(normalized);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, title]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return items;
    }

    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(query));
  }, [items, search]);

  const displayedItems = filteredItems.slice(0, rowsPerPage);

  return (
    <section className="resource-section">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-4 pb-0">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 className="h4 mb-0 text-primary-emphasis">{title}</h2>
            <a className="link-primary" href={endpoint} target="_blank" rel="noreferrer">
              Open API endpoint
            </a>
          </div>

          <form className="row g-2 align-items-end" onSubmit={(event) => event.preventDefault()}>
            <div className="col-12 col-md-6">
              <label className="form-label mb-1" htmlFor={`${resourcePath}-search`}>
                Search records
              </label>
              <input
                id={`${resourcePath}-search`}
                type="text"
                className="form-control"
                placeholder="Search across all fields"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label mb-1" htmlFor={`${resourcePath}-rows`}>
                Rows to show
              </label>
              <select
                id={`${resourcePath}-rows`}
                className="form-select"
                value={rowsPerPage}
                onChange={(event) => setRowsPerPage(Number(event.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="col-6 col-md-3 d-flex gap-2">
              <button type="button" className="btn btn-primary w-100" onClick={fetchData}>
                Refresh
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => setSearch('')}
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="card-body pt-3">
          <p className="small text-secondary mb-3">
            Showing {displayedItems.length} of {filteredItems.length} records.
          </p>

          {loading && <div className="alert alert-info mb-0">Loading data...</div>}
          {!loading && error && <div className="alert alert-danger mb-0">{error}</div>}

          {!loading && !error && filteredItems.length === 0 && (
            <div className="alert alert-warning mb-0">No records found.</div>
          )}

          {!loading && !error && filteredItems.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle resource-table mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{ width: '80px' }}>
                      #
                    </th>
                    <th scope="col" style={{ width: '180px' }}>
                      Identifier
                    </th>
                    <th scope="col">Primary</th>
                    <th scope="col">Secondary</th>
                    <th scope="col" style={{ width: '140px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedItems.map((item, index) => (
                    <tr key={pickIdentifier(item, index)}>
                      <td>{index + 1}</td>
                      <td className="text-nowrap">{pickIdentifier(item, index)}</td>
                      <td>{pickPrimary(item)}</td>
                      <td>{pickSecondary(item)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedItem(item)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-scrollable" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">{title} record details</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedItem(null)}
                  />
                </div>
                <div className="modal-body">
                  <pre className="mb-0 modal-json">{JSON.stringify(selectedItem, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedItem(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setSelectedItem(null)} />
        </>
      )}
    </section>
  );
}

export default ApiResourceTable;
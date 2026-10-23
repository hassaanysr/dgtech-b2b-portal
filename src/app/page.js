"use client";
import { useState, useEffect } from "react";

export default function DGTechPortal() {
  const [machines, setMachines] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    inquiryDetails: "",
  });
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    fetch(`/api/catalog?category=${category}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setMachines(res.data);
      });
  }, [category]);

  const filteredMachines = machines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.specs.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("Submitting RFQ to CRM Pipeline...");
    const res = await fetch("/api/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        machineModel: selectedMachine || "General Inquiry",
      }),
    });
    const data = await res.json();
    if (data.success) {
      setStatusMsg("✅ RFQ Submitted! Logged securely via Node.js API.");
      setFormData({ companyName: "", contactEmail: "", inquiryDetails: "" });
    } else {
      setStatusMsg(`❌ Error: ${data.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <header className="max-w-6xl mx-auto border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
            MERN + Next.js Enterprise Architecture
          </span>
          <h1 className="text-3xl font-bold mt-2 text-white">
            DG Tech Machinery — B2B Digital Catalog & RFQ Engine
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Industrial Machinery Specifications & Automated CRM Lead Capture Portal
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Dynamic Machinery Catalog */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search machinery model or technical specs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm"
            >
              <option value="All">All Industrial Sectors</option>
              <option value="Metal Fabrication">Metal Fabrication</option>
              <option value="Plastics & Packaging">Plastics & Packaging</option>
              <option value="Textile Machinery">Textile Machinery</option>
              <option value="Printing & Packaging">Printing & Packaging</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredMachines.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-blue-400 font-medium">
                      {item.category} • {item.brand}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-1">
                      {item.name}
                    </h3>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded">
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-3 bg-slate-950 p-3 rounded border border-slate-800/80 font-mono">
                  {item.specs} | {item.power}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedMachine(item.name)}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition"
                  >
                    Select for B2B Quote →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: CRM Lead Capture Micro-Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit sticky top-6">
          <h2 className="text-xl font-semibold text-white mb-1">
            Request B2B Quotation (RFQ)
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Direct REST API integration with sanitized payload validation.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Selected Machinery Model
              </label>
              <input
                type="text"
                value={selectedMachine || "Click 'Select' on any machine"}
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-blue-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Company / Factory Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                placeholder="e.g., Lahore Packages Pvt Ltd"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Corporate Email *
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                placeholder="procurement@company.pk"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Production Capacity & Technical Requirements *
              </label>
              <textarea
                rows="3"
                required
                value={formData.inquiryDetails}
                onChange={(e) =>
                  setFormData({ ...formData, inquiryDetails: e.target.value })
                }
                placeholder="Specify voltage, required output/hour, or delivery timeline..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-sm transition"
            >
              Submit Official RFQ
            </button>

            {statusMsg && (
              <p className="text-xs text-center mt-3 p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
                {statusMsg}
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
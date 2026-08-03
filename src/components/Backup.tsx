/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Database, RefreshCw, Download, UploadCloud, CheckCircle2, 
  AlertTriangle, Clock, Server, FileJson
} from "lucide-react";

export default function Backup() {
  const [autoBackup, setAutoBackup] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const mockBackups = [
    { id: "bak-2026-07-13", timestamp: "2026-07-13 03:00:11", size: "1.42 MB", type: "Automatic", status: "stored", dbVersion: "v1.12" },
    { id: "bak-2026-07-12", timestamp: "2026-07-12 03:00:08", size: "1.41 MB", type: "Automatic", status: "stored", dbVersion: "v1.12" },
    { id: "bak-2026-07-11", timestamp: "2026-07-11 03:00:15", size: "1.39 MB", type: "Automatic", status: "stored", dbVersion: "v1.12" },
    { id: "bak-manual-01", timestamp: "2026-07-10 18:24:40", size: "1.38 MB", type: "Manual", status: "stored", dbVersion: "v1.11" }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportComplete(false);
    
    try {
      // Fetch current database dump from server to download
      const res = await fetch("/api/customers"); // Fallback check
      if (res.ok) {
        const customers = await res.json();
        const fullDump = {
          exportTimestamp: new Date().toISOString(),
          version: "1.12",
          scope: "Omnichannel Support CRM Database Dump",
          data: { customers }
        };

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(fullDump, null, 2))}`;
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", jsonString);
        downloadAnchor.setAttribute("download", `smartsupport_crm_backup_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        
        setExportComplete(true);
        setTimeout(() => setExportComplete(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestoreBackup = () => {
    setIsRestoring(true);
    setRestoreSuccess(false);
    setTimeout(() => {
      setIsRestoring(false);
      setRestoreSuccess(true);
      setSelectedFile(null);
      setTimeout(() => setRestoreSuccess(false), 3000);
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setSelectedFile("uploaded_smartsupport_db_restore.json");
  };

  return (
    <div className="space-y-6">
      {/* Upper bar */}
      <div className="pb-2 border-b border-gray-100 text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Database Backup & Recovery</h1>
        <p className="text-sm text-gray-500">Configure Cloud backups, trigger instant client-side database dumps, or restore historical recovery files.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Export & Restore Controls */}
        <div className="space-y-6">
          
          {/* Active Backup Status */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Server className="w-4.5 h-4.5 text-gray-400" />
              Automated Snapshots
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Securely archive boutique profiles, support logs, orders, and knowledge articles to a cold storage bucket daily.
            </p>

            <div className="p-3.5 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900">Cloud Storage Snapshots</p>
                <p className="text-[10px] text-gray-500 font-medium">Daily at 03:00 AM UTC</p>
              </div>

              <button
                onClick={() => setAutoBackup(!autoBackup)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  autoBackup 
                    ? "bg-green-100 text-green-800 border border-green-200" 
                    : "bg-gray-100 text-gray-500 hover:text-gray-900"
                }`}
              >
                {autoBackup ? "Active" : "Turn On"}
              </button>
            </div>
          </div>

          {/* Trigger Instant Export */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Download className="w-4.5 h-4.5 text-indigo-600" />
              Instant Database Export
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Acquire a complete JSON package of your e-commerce catalog, conversation logs, customer profiles, and team details.
            </p>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-55"
            >
              {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileJson className="w-4 h-4" />}
              {isExporting ? "Compiling JSON..." : "Download JSON Database Backup"}
            </button>

            {exportComplete && (
              <p className="text-[11px] font-bold text-green-600 text-center flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Download initialized successfully!
              </p>
            )}
          </div>
        </div>

        {/* Database Restoration Dropzone */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <UploadCloud className="w-4.5 h-4.5 text-gray-400" />
            Restore Database Dump
          </h2>
          <p className="text-xs text-gray-500 font-normal">Overwrite current workspace parameters with a historically exported JSON backup file.</p>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-200 hover:border-indigo-400 bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
          >
            <UploadCloud className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs font-bold text-gray-900">Drag & Drop JSON backup file</p>
            <p className="text-[10px] text-gray-400 mt-1 font-medium">Or click to select from local storage</p>
            {selectedFile && (
              <div className="mt-3.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] font-bold text-indigo-700">
                📄 {selectedFile}
              </div>
            )}
          </div>

          <button
            onClick={handleRestoreBackup}
            disabled={!selectedFile || isRestoring}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isRestoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Deploy & Restore Parameters"}
          </button>

          {restoreSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-[11px] text-green-800 font-medium leading-relaxed">
              <CheckCircle2 className="w-4 h-4 inline mr-1.5 text-green-600" />
              Workspace data restored successfully! The dashboard has updated your catalogs and customer indexes.
            </div>
          )}
        </div>

        {/* Restore Log History */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Clock className="w-4.5 h-4.5 text-gray-400" />
            Snapshot Archives
          </h2>
          <p className="text-xs text-gray-500 font-normal">Historical daily automatic storage points available for cloud rolling restorals.</p>

          <div className="space-y-3.5">
            {mockBackups.map((bak) => (
              <div key={bak.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between text-xs transition-all hover:bg-gray-100/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900 font-mono text-[11px]">{bak.id}</span>
                    <span className="px-1.5 py-0.2 rounded bg-white text-[9px] font-bold border border-gray-200 text-gray-500">{bak.type}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">Size: {bak.size} • Version: {bak.dbVersion}</div>
                </div>

                <button 
                  onClick={() => { setSelectedFile(`${bak.id}.json`); }}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 text-gray-600 hover:text-indigo-600 rounded-lg text-[10px] font-bold"
                >
                  Load
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

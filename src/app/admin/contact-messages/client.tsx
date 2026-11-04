"use client";

import { useState } from "react";
import type { ContactMessage } from "@/types";
import React from "react";
import { DeleteButton } from "../delete-button";

interface Props {
  messages: ContactMessage[];
  onUpdateStatusAction: (formData: FormData) => Promise<void>;
  onDeleteAction: (formData: FormData) => Promise<void>;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusBadge(status: ContactMessage["status"]) {
  switch (status) {
    case "unread":
      return <span className="text-amber-400 font-bold">Unread</span>;
    case "read":
      return <span className="text-emerald-400 font-bold">Read</span>;
    case "archived":
      return <span className="text-[#a1a1aa] font-bold">Archived</span>;
    default:
      return <span className="text-[#a1a1aa] font-bold">{status}</span>;
  }
}

export default function ContactMessagesClientManager({ messages, onUpdateStatusAction, onDeleteAction }: Props) {
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-[#a1a1aa]">Total Messages: {messages.length}</span>
      </div>

      <div className="bg-[#151515] border border-[#2a2a2a] overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#2a2a2a] bg-[#0f0f0f] font-mono text-xs text-[#a1a1aa]">
            <tr>
              <th className="p-4">From</th>
              <th className="p-4">Email</th>
              <th className="p-4">Preview</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#a1a1aa] font-mono text-xs">
                  Belum ada pesan masuk.
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <React.Fragment key={msg.id}>
                  <tr
                    className={`hover:bg-[#1a1a1a] transition-colors ${msg.status === "unread" ? "bg-[#1a1a2e]" : ""}`}
                    onClick={() => setExpandedMessage(expandedMessage === msg.id ? null : msg.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="p-4 font-bold text-[#f5f5f7]">{msg.name}</td>
                    <td className="p-4 font-mono text-xs text-[#22d3ee]">{msg.email}</td>
                    <td className="p-4 font-mono text-xs max-w-xs truncate text-[#a1a1aa]">{msg.message.slice(0, 60)}...</td>
                    <td className="p-4 font-mono text-xs">{getStatusBadge(msg.status)}</td>
                    <td className="p-4 font-mono text-xs">{formatDate(msg.created_at)}</td>
                    <td className="p-4 text-right space-x-2">
                      <form action={onUpdateStatusAction} className="inline">
                        <input type="hidden" name="id" value={msg.id} />
                        <select
                          name="status"
                          defaultValue={msg.status}
                          onChange={(e) => e.target.closest("form")?.requestSubmit()}
                          className="bg-[#0f0f0f] border border-[#2a2a2a] text-[#f5f5f7] p-1 text-xs font-mono focus:outline-none focus:border-[#22d3ee]"
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="archived">Archived</option>
                        </select>
                      </form>
                      <form action={onDeleteAction} className="inline">
                        <input type="hidden" name="id" value={msg.id} />
                        <DeleteButton confirmMessage="Yakin ingin menghapus pesan ini?" className="bg-red-950/50 text-red-300 px-3 py-1 text-xs font-mono hover:bg-red-900">Delete</DeleteButton>
                      </form>
                    </td>
                  </tr>
                  {expandedMessage === msg.id && (
                    <tr className="bg-[#1a1a1a]">
                      <td colSpan={6} className="p-6 border-t border-[#2a2a2a]">
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-4 font-mono text-xs">
                            <div>
                              <span className="text-[#a1a1aa]">Name:</span>
                              <span className="text-[#f5f5f7] ml-2">{msg.name}</span>
                            </div>
                            <div>
                              <span className="text-[#a1a1aa]">Email:</span>
                              <span className="text-[#f5f5f7] ml-2">{msg.email}</span>
                            </div>
                            <div>
                              <span className="text-[#a1a1aa]">Date:</span>
                              <span className="text-[#f5f5f7] ml-2">{formatDate(msg.created_at)}</span>
                            </div>
                            <div>
                              <span className="text-[#a1a1aa]">Status:</span>
                              <span className="text-[#f5f5f7] ml-2">{getStatusBadge(msg.status)}</span>
                            </div>
                            {msg.ip_address && (
                              <div>
                                <span className="text-[#a1a1aa]">IP:</span>
                                <span className="text-[#f5f5f7] ml-2">{msg.ip_address}</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-[#a1a1aa] font-mono text-xs">Message:</span>
                            <p className="text-[#f5f5f7] mt-2 p-4 bg-[#0f0f0f] border border-[#2a2a2a] whitespace-pre-wrap text-sm">{msg.message}</p>
                          </div>
                          {msg.user_agent && (
                            <details className="text-xs text-[#a1a1aa]">
                              <summary className="cursor-pointer font-mono">User Agent</summary>
                              <pre className="mt-2 p-2 bg-[#0f0f0f] border border-[#2a2a2a] overflow-x-auto max-h-32">{msg.user_agent}</pre>
                            </details>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
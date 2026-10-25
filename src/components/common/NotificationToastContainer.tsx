/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationToastContainer: React.FC = () => {
  const { notifications, dismissNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((item) => {
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;
        let borderClass = 'border-blue-200 bg-white';

        if (item.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
          borderClass = 'border-emerald-200 bg-emerald-50/90';
        } else if (item.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
          borderClass = 'border-amber-200 bg-amber-50/90';
        } else if (item.type === 'alert') {
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          borderClass = 'border-rose-200 bg-rose-50/90';
        }

        return (
          <div
            key={item.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all flex items-start gap-3 text-slate-800 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold font-heading">{item.title}</h5>
                <span className="text-[10px] text-slate-400">{item.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">{item.message}</p>
            </div>
            <button
              onClick={() => dismissNotification(item.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

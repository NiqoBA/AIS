"use client";

import { createContext, useContext } from "react";

const DashboardViewerContext = createContext<{ displayName: string }>({
  displayName: "",
});

export function DashboardViewerProvider({
  displayName,
  children,
}: {
  displayName: string;
  children: React.ReactNode;
}) {
  return (
    <DashboardViewerContext.Provider value={{ displayName }}>
      {children}
    </DashboardViewerContext.Provider>
  );
}

export function useDashboardViewer() {
  return useContext(DashboardViewerContext);
}

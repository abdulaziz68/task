import React from 'react';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <h1 style={{ color: 'white', fontSize: 24 }}>Engineering PM Mobile</h1>
        <p style={{ color: '#94a3b8' }}>نظام إدارة المشاريع الهندسية</p>
      </div>
    </>
  );
}

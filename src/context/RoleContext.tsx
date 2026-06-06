/**
 * Aetherion Healthcare - Role-Aware Frontend Integration
 * ======================================================
 * Example React implementation of role-based UI
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

// ============================================
// TYPES
// ============================================
interface PermissionData {
  permissions: string[];
  features: string[];
  can_execute_actions: Array<{
    module: string;
    action: string;
    permission: string;
    allowed: boolean;
  }>;
  dashboard_config: {
    layout: string;
    widgets: Array<{
      id: string;
      title: string;
      type: string;
      permission: string | null;
      route: string;
    }>;
  };
  is_full_access: boolean;
}

interface RoleContextType extends PermissionData {
  canExecute: (module: string, action: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasFeature: (feature: string) => boolean;
  hasAnyFeature: (features: string[]) => boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// ROLE CONTEXT
// ============================================
const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children, token }: { children: React.ReactNode; token: string }) {
  const [permissionData, setPermissionData] = useState<PermissionData>({
    permissions: [],
    features: [],
    can_execute_actions: [],
    dashboard_config: { layout: 'default', widgets: [] },
    is_full_access: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load permissions on mount
  useEffect(() => {
    loadPermissions();
  }, [token]);

  const loadPermissions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load permissions');
      }

      const { data } = await response.json();
      setPermissionData({
        permissions: data.permissions || [],
        features: data.features || [],
        can_execute_actions: data.can_execute_actions || [],
        dashboard_config: data.dashboard_config || { layout: 'default', widgets: [] },
        is_full_access: data.is_full_access || false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Permission checking methods
  const canExecute = (module: string, action: string): boolean => {
    return permissionData.can_execute_actions.some(
      (a) => a.module === module && a.action === action && a.allowed
    );
  };

  const hasPermission = (permission: string): boolean => {
    if (permissionData.is_full_access) return true;
    return permissionData.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (permissionData.is_full_access) return true;
    return permissions.some((p) => permissionData.permissions.includes(p));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (permissionData.is_full_access) return true;
    return permissions.every((p) => permissionData.permissions.includes(p));
  };

  const hasFeature = (feature: string): boolean => {
    return permissionData.features.includes(feature);
  };

  const hasAnyFeature = (features: string[]): boolean => {
    return features.some((f) => permissionData.features.includes(f));
  };

  const value: RoleContextType = {
    ...permissionData,
    canExecute,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasFeature,
    hasAnyFeature,
    isLoading,
    error,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

// ============================================
// HOOK
// ============================================
export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

// ============================================
// ACTION HOOK
// ============================================
export function useAction() {
  const { canExecute } = useRole();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function execute<T = any>(module: string, action: string, data?: any): Promise<T> {
    if (!canExecute(module, action)) {
      throw new Error(`Permission denied: ${module}.${action}`);
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/v1/actions/${module}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Action failed');
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return { execute, isLoading, error };
}

// ============================================
// EXAMPLE COMPONENT: BOOK APPOINTMENT
// ============================================
export function BookAppointmentButton({ doctorId, date, time }: { doctorId: string; date: string; time: string }) {
  const { hasPermission } = useRole();
  const { execute, isLoading } = useAction();
  const [message, setMessage] = useState('');

  // Check if user can book appointments
  const canBook = hasPermission('appointment.book');

  const handleBook = async () => {
    try {
      await execute('appointment', 'book', { doctor_id: doctorId, date, time });
      setMessage('Appointment booked successfully!');
    } catch (err) {
      setMessage('Failed to book appointment');
    }
  };

  if (!canBook) {
    return null; // Don't render if user doesn't have permission
  }

  return (
    <div>
      <button onClick={handleBook} disabled={isLoading}>
        {isLoading ? 'Booking...' : 'Book Appointment'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

// ============================================
// EXAMPLE COMPONENT: PERMISSION-AWARE NAVIGATION
// ============================================
export function Navigation() {
  const { features, hasFeature } = useRole();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/' },
    { id: 'patient_list', label: 'Patients', path: '/patients' },
    { id: 'write_prescription', label: 'Write Prescription', path: '/prescriptions/new' },
    { id: 'bed_management', label: 'Bed Management', path: '/beds' },
    { id: 'audit_logs', label: 'Audit Logs', path: '/audit-logs' },
  ];

  return (
    <nav>
      <ul>
        {navItems
          .filter((item) => hasFeature(item.id))
          .map((item) => (
            <li key={item.id}>
              <a href={item.path}>{item.label}</a>
            </li>
          ))}
      </ul>
    </nav>
  );
}

// ============================================
// EXAMPLE COMPONENT: DASHBOARD (AUTO-GENERATED)
// ============================================
export function Dashboard() {
  const { dashboard_config, hasPermission, isLoading } = useRole();

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  // Filter widgets based on permissions
  const visibleWidgets = dashboard_config.widgets.filter((widget) =>
    !widget.permission || hasPermission(widget.permission)
  );

  return (
    <div className="dashboard">
      <h1>{dashboard_config.layout === 'doctor' ? 'Doctor Dashboard' : 'Dashboard'}</h1>
      <div className="widgets">
        {visibleWidgets.map((widget) => (
          <div key={widget.id} className={`widget ${widget.type}`}>
            <h3>{widget.title}</h3>
            <WidgetContent widget={widget} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WidgetContent({ widget }: { widget: any }) {
  const { execute } = useAction();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load widget content based on widget type
    loadWidgetContent();
  }, [widget.id]);

  const loadWidgetContent = async () => {
    setLoading(true);
    try {
      // Map widget to action
      const actionMap: Record<string, { module: string; action: string }> = {
        appointments_today: { module: 'appointment', action: 'list' },
        patient_list: { module: 'patient', action: 'list' },
        bed_status: { module: 'hospital', action: 'view' },
      };

      const action = actionMap[widget.id];
      if (action) {
        const result = await execute(action.module, action.action, { today: true });
        setData(result);
      }
    } catch (err) {
      console.error('Failed to load widget content:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  // Render based on widget type
  switch (widget.type) {
    case 'list':
      return (
        <ul>
          {data.items?.slice(0, 5).map((item: any) => (
            <li key={item.id}>{item.name || item.title}</li>
          ))}
        </ul>
      );
    case 'stats':
      return (
        <div className="stats">
          <div className="stat-item">
            <span className="label">Total:</span>
            <span className="value">{data.total || 0}</span>
          </div>
          {Object.entries(data).map(([key, value]) => {
            if (typeof value === 'number') {
              return (
                <div key={key} className="stat-item">
                  <span className="label">{key}:</span>
                  <span className="value">{value}</span>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    default:
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }
}

// ============================================
// EXAMPLE USAGE
// ============================================
export function App() {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <LoginPage />;
  }

  return (
    <RoleProvider token={token}>
      <div className="app">
        <Navigation />
        <Dashboard />
        <BookAppointmentButton doctorId="uuid" date="2024-01-15" time="10:00" />
      </div>
    </RoleProvider>
  );
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: 'doctor' }),
    });

    const { data } = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    window.location.reload();
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </form>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================
interface PermissionGuardProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  const { hasPermission } = useRole();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface FeatureGuardProps {
  feature: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function FeatureGuard({ feature, fallback = null, children }: FeatureGuardProps) {
  const { hasFeature } = useRole();

  if (!hasFeature(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// ============================================
// EXAMPLE: PERMISSION GUARD USAGE
// ============================================
export function PatientList() {
  const { execute } = useAction();
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    execute('patient', 'list').then(setPatients);
  }, []);

  return (
    <div>
      <h1>Patient List</h1>
      <PermissionGuard permission="doctor.view_patients" fallback={<p>Access denied</p>}>
        <ul>
          {patients.map((patient) => (
            <li key={patient.id}>{patient.name}</li>
          ))}
        </ul>
      </PermissionGuard>
    </div>
  );
}

// ============================================
// EXPORTS
// ============================================
export default {
  RoleProvider,
  useRole,
  useAction,
  BookAppointmentButton,
  Navigation,
  Dashboard,
  PermissionGuard,
  FeatureGuard,
};
import { useBreadcrumbs } from '../../../context/navigation-context';

export function Dashboard() {
  useBreadcrumbs('Dashboard', 2);
  return (
    <div>
      <h1>This is the Admin Dashboard</h1>
    </div>
  )
}
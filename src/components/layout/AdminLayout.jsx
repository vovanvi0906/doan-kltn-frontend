import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Breadcrumb />
        <main style={{ padding: '20px', flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside style={{ width: '240px', background: '#1e293b', color: '#fff', padding: '20px' }}>
      <h2>Admin Panel</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>Dashboard</li>
          <li style={{ margin: '10px 0' }}>Users</li>
          <li style={{ margin: '10px 0' }}>Workers</li>
        </ul>
      </nav>
    </aside>
  );
}

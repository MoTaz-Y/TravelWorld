import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Check if user is logged in and has required role
  if (!user) {
    return <Navigate to='/login' />;
  }

  // Check if user has dashboard access
  const allowedRoles = ['admin', 'manager', 'guide'];
  if (!allowedRoles.includes(user.role)) {
    return (
      <Container className='dashboard-error'>
        <Row>
          <Col>
            <div className='error-message'>
              <h2>🚫 Access Denied</h2>
              <p>You don't have permission to access the dashboard.</p>
              <p>
                Your current role: <strong>{user.role}</strong>
              </p>
              <p>Required roles: {allowedRoles.join(', ')}</p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'مدير النظام';
      case 'manager':
        return 'مدير الأعمال';
      case 'guide':
        return 'مرشد سياحي';
      default:
        return role;
    }
  };
  const getDashboardFeatures = (role) => {
    switch (role) {
      case 'admin':
        return [
          'إدارة جميع الرحلات',
          'إدارة المستخدمين',
          'عرض الإحصائيات',
          'إدارة الحجوزات',
          'إدارة المراجعات',
        ];
      case 'manager':
        return [
          'إدارة الرحلات',
          'عرض الإحصائيات',
          'إدارة الحجوزات',
          'إدارة المراجعات',
        ];
      case 'guide':
        return ['عرض الرحلات المسندة', 'إدارة الحجوزات', 'عرض المراجعات'];
      default:
        return [];
    }
  };
  return (
    <Container className='dashboard-container'>
      <Row>
        <Col>
          <div className='dashboard-header'>
            <h1>🏝️ لوحة تحكم TravelWorld</h1>
            <div className='user-info'>
              <h3>مرحباً {user.userName}</h3>
              <p className={`role-badge role-${user.role}`}>
                {getRoleDisplayName(user.role)}
              </p>
            </div>
          </div>

          <div className='dashboard-content'>
            <div className='dashboard-card'>
              <h4>🔧 الصلاحيات المتاحة</h4>
              <ul className='features-list'>
                {getDashboardFeatures(user.role).map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
            </div>

            <div className='dashboard-actions'>
              {user.role === 'admin' && (
                <div className='action-card'>
                  <h5>📊 إدارة النظام</h5>
                  <p>إدارة شاملة لجميع جوانب النظام</p>
                  <button className='btn btn-primary'>الذهاب للإدارة</button>
                </div>
              )}

              {(user.role === 'admin' || user.role === 'manager') && (
                <div className='action-card'>
                  <h5>🏖️ إدارة الرحلات</h5>
                  <p>إضافة وتعديل وحذف الرحلات</p>
                  <button className='btn btn-success'>إدارة الرحلات</button>
                </div>
              )}
              <div className='action-card'>
                <h5>📈 الإحصائيات</h5>
                <p>عرض إحصائيات النظام والأداء</p>
                <button className='btn btn-info'>عرض الإحصائيات</button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

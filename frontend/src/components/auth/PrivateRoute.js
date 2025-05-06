import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login page with the intended destination
        return <Navigate to="/login" state={{ from: location.pathname }} />;
    }

    return children;
};

export default PrivateRoute;
import React from 'react'
import {
    Redirect,
    Route,
    Routes,
    useLocation,
    Navigate,
} from 'react-router-dom'
import SignUpPage from '../pages/Auth/signup'
import LoginPage from '../pages/Auth/login'
import ForgetPassword from '../pages/Auth/recover'
import Reset from '../pages/Auth/reset_password'
import LandingPage from '../pages/LandingPage'
import Dashboard from '../pages/Dashboard'
import MyClasses from '../pages/DashboardPages/MyClasses'
import Profile from '../pages/DashboardPages/Profile'
import ClassPage from '../pages/DashboardPages/Class'
import Assignments from '../pages/DashboardPages/Assignments'
import Meet from '../pages/DashboardPages/Meeting'
import NotFound from '../pages/NotFound'
import PublicForum from '../pages/DashboardPages/PublicForum/'
import UpcomingClasses from '../pages/DashboardPages/UpcomingClasses/'
import Submissions from '../pages/DashboardPages/Class/Internal/submissions'
import ClassAssignments from '../pages/DashboardPages/Class/Internal/assignments'
import Attendance from '../pages/DashboardPages/Class/Internal/attendance'
import Requests from '../pages/DashboardPages/Class/Internal/requests'
import Students from '../pages/DashboardPages/Class/Internal/students'
import Classes from '../pages/DashboardPages/Class/Internal/classes'
import { useSelector } from 'react-redux'
function Page(props) {
    const user = useSelector((state) => state.auth.user)
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
                path="/auth/signup"
                element={
                    user === null ? (
                        <SignUpPage {...props} />
                    ) : (
                        <Navigate replace to="/dashboard" />
                    )
                }
            />
            <Route
                path="/auth/login"
                element={
                    user === null ? (
                        <LoginPage {...props} />
                    ) : (
                        <Navigate replace to="/dashboard" />
                    )
                }
            />
            <Route path="/auth/forget_password" element={<ForgetPassword />} />
            <Route path="/auth/recovery/:id" element={<Reset />} />
            <Route
                path="/dashboard/*"
                element={
                    user ? (
                        <Dashboard>
                            <Routes>
                                <Route path="/" element={<MyClasses />}></Route>
                                {user.role === 'teacher' && (
                                    <Route
                                        path="/class/:id/requests"
                                        element={<Requests />}></Route>
                                )}
                                {user.role === 'teacher' && (
                                    <Route
                                        path="/class/:id/students"
                                        element={<Students />}></Route>
                                )}
                                {user.role === 'teacher' && (
                                    <Route
                                        path="/class/:id/upcoming_classes"
                                        element={<Classes />}></Route>
                                )}
                                {user.role === 'teacher' && (
                                    <Route
                                        path="class/:class_id/assignments/:topic/:id"
                                        element={<Submissions />}></Route>
                                )}
                                {user.role === 'teacher' && (
                                    <Route
                                        path="/class/:id/assignments"
                                        element={<ClassAssignments />}></Route>
                                )}

                                <Route
                                    path="/class/:class_id/upcoming_classes/attendance/:schedule_id"
                                    element={<Attendance />}
                                />
                                <Route
                                    path="/meet/:class_id/:id"
                                    element={<Meet />}></Route>
                                <Route
                                    path="/class/:id"
                                    element={<ClassPage />}></Route>
                                <Route
                                    path="/upcoming_classes/"
                                    element={<UpcomingClasses />}></Route>
                                <Route
                                    path="/profile"
                                    element={<Profile />}></Route>

                                <Route
                                    path="/assignments"
                                    element={<Assignments />}></Route>

                                <Route path="/meet" element={<Meet />}></Route>
                                <Route
                                    path="/public_forum"
                                    element={<PublicForum />}></Route>
                                <Route
                                    path="*"
                                    element={
                                        <Navigate replace to="/404"></Navigate>
                                    }
                                />
                            </Routes>
                        </Dashboard>
                    ) : (
                        <Navigate replace to="/auth/login" />
                    )
                }
            />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate replace to="/404"></Navigate>} />
        </Routes>
    )
}

export default Page

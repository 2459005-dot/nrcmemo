import React from 'react'
import { useNavigate, NavLink, Link } from 'react-router-dom'
import "./style/Header.scss"

const Header = ({
    isAuthed,
    user,
    onLogout,
    theme,
    onToggleTheme
}) => {

    const navigate = useNavigate()

    const handleLogout = async () => {
        if (!window.confirm('정말 로그아웃 하시겠어요?')) return

        try {
            await onLogout()
        } catch (error) {

        }
    }

    // 로고 클릭 시 역할에 따라 path 달라짐
    const getLogoPath = () => {
        if (!isAuthed) {
            return "/";
        }

        if (user?.role === 'admin') {
            return "/admin/dashboard";
        }

        return "/user/dashboard";
    }

    const logoPath = getLogoPath(); // 경로 계산

    return (
        <header className='site-header'>
            <div className="inner">
                <h1 className='logo'>
                    <Link to={logoPath}>
                        🏃EVERRUN
                    </Link>
                </h1>
                {/* 1. (추가) 테마 토글 버튼 */}
                <div className="auth-area">
                    {isAuthed && (
                        <div>
                            <span className='welcome'>
                                {user?.displayName || user?.email || "user"}
                            </span>
                            <button className='btn logout' onClick={handleLogout}>로그아웃</button>
                            <button onClick={onToggleTheme} className="btn theme-toggle">
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
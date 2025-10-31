import './App.scss'
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AuthPanel from './components/AuthPanel'
import Landing from './pages/Landing'
import Header from './components/Header'
import ProtectRoute from './components/ProtectRoute'
import UserDashboard from './pages/user/userDashboard'
import AdminDashboard from './pages/admin/adminDashboard'
import {
  fetchMe as apiFetchMe,
  logout as apiLogout,
  saveAuthToStorage,
  clearAuthStorage
} from "./api/client"
import { PostProvider } from "./context/PostProvider"

// 1. (수정) getInitialTheme 함수 단순화
// localStorage에 저장된 값이 없으면 무조건 'light'로 시작
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme ? savedTheme : 'light';
};

function App() {

  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  const location = useLocation()
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [me, setMe] = useState(null)
  const isAuthed = !!token
  const hideOn = new Set(['/', '/admin/login'])
  const showHeader = isAuthed && !hideOn.has(location.pathname)

  // 2. (수정) 테마 상태 및 토글 함수 (console.log 추가)
  const [theme, setTheme] = useState(getInitialTheme());

  const toggleTheme = () => {
    // 3. (디버깅) 버튼 클릭 시 이 로그가 보여야 합니다.
    console.log('[App.jsx] toggleTheme 함수 실행됨');
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // 4. (디버깅) 새로운 테마 값이 보여야 합니다.
      console.log('[App.jsx] 새 테마로 변경:', newTheme);
      return newTheme;
    });
  };

  // 5. (수정) 테마 적용 useEffect (console.log 추가)
  useEffect(() => {
    // 6. (디버깅) 페이지 로드 시, 그리고 테마 변경 시 이 로그가 보여야 합니다.
    console.log(`[App.jsx] useEffect 실행: <html>에 data-theme="${theme}" 설정`);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]); // [theme] 의존성 배열이 중요합니다!

  const handleAuthed = async ({ user, token }) => {
    try {
      setUser(user)
      setToken(token ?? null)
      saveAuthToStorage({ user, token })
      handleFetchMe()
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = async () => {
    try {
      await apiLogout()
    } catch (error) {

    } finally {
      setUser(null)
      setToken(null)
      setMe(null)
      clearAuthStorage()
    }
  }

  const handleFetchMe = async () => {
    try {
      const { user } = await apiFetchMe()
      setMe(user)

    } catch (error) {
      setMe({ error: '내 정보 조회 실패' })
      console.error(error)
    }
  }

  useEffect(() => {
    if (isAuthed) handleFetchMe()
  }, [isAuthed])

  return (
    <PostProvider>
      <div className='page'>
        {showHeader && <Header
          isAuthed={isAuthed}
          user={user}
          theme={theme}
          onLogout={handleLogout}
          onToggleTheme={toggleTheme}
        />}

        <Routes>
          <Route
            path='/'
            element={<Landing theme={theme} onToggleTheme={toggleTheme} />} />
          {/* 로그인 회원가입 */}
          <Route
            path='/admin/login'
            element={<AuthPanel
              isAuthed={isAuthed}
              user={user}
              me={me}
              onFetchMe={handleFetchMe}
              onLogout={handleLogout}
              onAuthed={handleAuthed}
              requiredRole="admin"
            />}
          />
          {/* 사용자 보호구역 */}
          <Route
            path='/user'
            element={
              <ProtectRoute
                user={user}
                isAuthed={isAuthed}
                redirect='/'
              />}>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path='dashboard' element={<UserDashboard />} />
          </Route>
          {/* 관리자 보호구역 */}
          <Route
            path='/admin'
            element={
              <ProtectRoute
                isAuthed={isAuthed}
                user={user}
                requiredRole="admin"
              />
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path='dashboard' element={<AdminDashboard />} />
          </Route>
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </PostProvider>
  )
}

export default App

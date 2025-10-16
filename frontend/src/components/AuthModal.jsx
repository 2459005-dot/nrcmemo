import React, { useEffect, useState } from 'react'
import './styles/AuthModal.scss'
import api from '../api/client'

const AuthModal = ({
  open,
  onClose,
  onAuthed
}) => {

  const [mode, setMode] = useState('register')

  const [attemptInfo, setAttemptInfo] = useState({
    attempts: null,
    remaining: null,
    locked: false
  })

  const [form, setForm] = useState({
    email: '',
    password: '',
    displayName: ''
  })

  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!open) {
      setMode('register');
      setForm({
        email: '',
        password: '',
        displayName: ''
      })
      setLoading(false)
      setErr('')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, loading, onClose])

  if (!open) return null

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()

    if (loading) return

    setErr('')
    setLoading(true)

    try {
      const payload = mode == 'register' ? {
        email: form.email.trim(),
        password: form.password.trim(),
        displayName: form.displayName.trim()
      } : {
        email: form.email.trim(),
        password: form.password.trim(),
      }

      const url = mode == 'register' ? '/api/auth/register' : '/api/auth/login'

      const { data } = await api.post(url, payload)

      setAttemptInfo({
        attempts: null,
        remaining: null,
        locked: false
      })

      setErr('')

      onAuthed?.(data)
      onClose?.()

    } catch (error) {
      const d = error?.response?.data || {}

      const msg = error?.response?.data?.message || (mode === 'register' ? '회원가입 실패' : '로그인 실패')

      setAttemptInfo({
        attempts: typeof d.loginAttempts === 'number' ? d.loginAttempts : null,
        remaining: typeof d.remainingAttempts === 'number' ? d.remainingAttempts : null,
        locked: !!d.locked
      })

      setErr(msg)

      console.log('auth fail', error?.response?.status, error?.response?.data)

    } finally {
      setLoading(false)
    }
  }

  const handleBackDropClick = () => {
    if (!loading) onClose?.()
  }

  return (
    <div className='am-backdrop' onClick={handleBackDropClick}>
      <div className="am-panel" onClick={(e) => e.stopPropagation()}>

        <div className="am-tabs">
          <button
            type='button'
            className={mode === 'login' ? 'on' : ''}
            onClick={() => setMode('login')}>
            로그인
          </button>

          <button
            type='button'
            className={mode === 'register' ? 'on' : ''}
            onClick={() => setMode('register')}>
            회원가입
          </button>
        </div>

        <form className='am-form' onSubmit={submit}>
          {mode === 'register' && (
            <input
              type="text"
              name='displayName'
              value={form.displayName}
              onChange={handleChange}
              placeholder='닉네임' />
          )}

          <input
            type="email"
            name='email'
            value={form.email}
            onChange={handleChange}
            placeholder='이메일'
            required />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder='비밀번호'
            required />

          {err && (
            <div className={`am-msg ${attemptInfo.locked ? 'warn' : 'error'}`}>
              {err}
            </div>
          )}

          {attemptInfo.locked ? (
            <div className="am-msg warn">
              유효성 검증 실패
            </div>
          ) : attemptInfo.attempts != null ? (
            <div className='am-subtle'>
              로그인 실패 횟수 : {attemptInfo.attempts} / 5

              {typeof attemptInfo.remaining === 'number' && `(남은 시도 : ${attemptInfo.remaining})`}
            </div>
          ) : null}

          <button
            type='submit'
            disabled={loading || attemptInfo.locked}
            className="btn primary">
            {loading ? '처리중...' : (mode === 'register' ? '가입하기' : '로그인')}
          </button>
        </form>

        <button
          type='button'
          onClick={onClose}
          className='am-close'
          aria-label='닫기'>
          X
        </button>
      </div>
    </div>
  )
}

export default AuthModal

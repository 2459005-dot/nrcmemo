import React from 'react'
import { patch } from '../../../../backend/routes/authroutes'

const AdminPostFilter = ({ value, onChange }) => {

    const set = (patch) => onChange({ ...value, ...patch })
    return (
        <div>
            <input
                type="text"
                value={value.user}
                onChange={(e) => set({
                    user: e.target.value, page: 1
                })}
                placeholder='userId 선택' />
            <select
                value={value.status}
                onChange={(e) => set({
                    status: e.target.value, page: 1
                })}>
                <option value="">전체</option>
                <option value="pending">대기</option>
                <option value="approved">승인</option>
                <option value="rejected">거절</option>
                <option value="hidden">숨김</option>
            </select>
        </div>
    )
}

export default AdminPostFilter
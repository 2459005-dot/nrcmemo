import api from "./client";

export const fetchAdminStats = async () => {
    const { data } = await api.get('/api/admin/stats')

    return data
}

export const fetchAdminPosts = async () => {
    const { page = 1, size = 20, status, q } = params

    const { data } = await api.get('/api/admin/posts', {
        params: { page, size, status, q }
    })

    return Array.isArray(data) ? data : []
}

export const fetchAdminUsers = async () => {
    const { page = 1, size = 20, status, q } = params

    const { data } = await api.get('/api/admin/users', {
        params: { page, size, status, q }
    })

    return {
        items: Array.isArray(data?.users) ? data.users : [],
        total: data?.total ?? 0,
        page: data?.page ?? page,
        size: data?.size ?? size,
        totalPages: data?.totalPages ?? 1,
    }
}

export const patchAdminPost = async (id, patch) => {
    const { data } = await api.patch(`/api/admin/posts/${id}`, patch)

    return data
}

export const patchAdminUser = async (id, patch) => {
    const { data } = await api.patch(`/api/admin/users${id}`, patch)

    return data
}
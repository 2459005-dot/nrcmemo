import React, { useEffect, useMemo, useState } from "react";
import { fetchAdminPosts, patchAdminPost } from "../../api/adminApi";
import AdminPostList from "../../components/admin/AdminPostsList";
import AdminFilter from "../../components/admin/AdminFilter";

const AdminPosts = () => {
  const [list, setList] = useState([]);
  const [query, setQuery] = useState({
    page: 1,
    size: 10,
    status: "",
    q: "",
    user: "",
  });

  useEffect(() => {
    (async () => {
      const items = await fetchAdminPosts(query);
      setList(items);
    })();
  }, [query]);

  const handleApprove = async (id) => {
    try {
      const updated = await patchAdminPost(id, { status: 'approved' })

      setList((prev) => prev.map((it) => (it._id === id ? updated : it)))

    } catch (error) {
      console.error('승인 처리 실패', error)
    }
  }

  const handleReject = async (id) => {
    try {
      const updated = await patchAdminPost(id, { status: 'rejected' })

      setList((prev) => prev.map((it) => (it._id === id ? updated : it)))

    } catch (error) {
      console.error('승인 처리 실패', error)
    }
  }

  return (
    <div>
      <AdminFilter />
      <AdminPostList
        items={list}
        onApprove={handleApprove}
        onReject={handleReject} />
    </div>
  );
};

export default AdminPosts;

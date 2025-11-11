import { toKeyArray } from "../util/toKeyArray";
import api from "./client";

export const uploadToS3 = async (file, opts = {}) => {
  const {
    data: { url, key },
  } = await api.post("/api/upload/presign", {
    filename: file.name,
    contentType: file.type,
    // replaceKey,
  });

  const putRes = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!putRes.ok) throw new Error("S3 업로드 실패");

  return key;
};

export const createPost = async ({ title, content, fileKeys }) => {
  const { data } = await api.post("/api/posts", {
    title,
    content,
    fileUrl: fileKeys,
  });
  return data;
};

export const fetchMyPosts = async (search) => { // 1. (search) 인자 받기
  let url = "/api/posts/my"; // 2. 기본 URL

  // 3. search 값이 존재하면 (null이나 ""가 아니면) URL에 쿼리 스트링 추가
  if (search) {
    url += `?search=${search}`; // (예: /api/posts/my?search=검색어)
  }

  // 4. 동적으로 만들어진 url 변수로 API 요청
  const { data } = await api.get(url);
  return Array.isArray(data) ? data : [];
};

export const fetchAllPosts = async () => {
  const { data } = await api.get("/api/posts");
  return Array.isArray(data) ? data : [];
};

export const fetchPostById = async (id) => {
  const { data } = await api.get(`/api/posts/${id}`);
  return data;
};

export const updatedPost = async (id, patch) => {
  const { data } = await api.put(`/api/posts/${id}`, patch);
  return data;
};

export const deletePost = async (id) => {
  const { data } = await api.delete(`/api/posts/${id}`)
  return data
}

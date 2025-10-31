import React, { useMemo, useState } from "react";
import './style/UserPostItem.scss'
import { toPublicUrl } from "../../util/toPublicUrl";
import { formatYMD } from "../../util/formatYMD";
import { usePosts } from "../../hooks/usePosts";
import UploadForm from "./UploadForm";

const UserPostItem = ({ item = {} }) => {

  const { remove } = usePosts();
  const [uploadOpen, setUploadOpen] = useState(false);
  const defaultImage = "/images/default-image.jpg";

  const files = useMemo(() => {
    let rawUrls = [];
    if (Array.isArray(item.fileUrl)) {
      if (item.fileUrl.length > 0) {
        rawUrls = item.fileUrl;
      }
    } else if (item?.fileUrl) {
      rawUrls = [item.fileUrl];
    }
    const processedUrls = rawUrls.map(toPublicUrl).filter(Boolean);

    // 처리된 이미지가 있으면 그걸 사용하고, 없으면 defaultImage를 사용합니다. (원본 로직 반영)
    return processedUrls.length > 0 ? processedUrls : [defaultImage];
  }, [item.fileUrl]);

  const title = item?.title ?? "제목없음";
  const content = item?.content ?? "";
  const number = item?.number;
  const updatedAt = item?.updatedAt || item?.createdAt;
  const when = formatYMD(updatedAt);

  return (
    <div className="inner post-card">
      {/* 추천 코드의 깔끔한 헤더 구조를 사용하되, 원본의 변수를 사용합니다. */}
      <div className="file-card-head">
        <div className="left">
          {/* 원본 코드처럼 number가 있을 때만 No.를 표시합니다. */}
          {number && <span>No. {number}</span>}
          <h3>{title}</h3>
        </div>
        <div className="file-card-meta">
          {/* formatYMD로 포맷된 'when' 변수를 사용합니다. */}
          <time className="file-card-time">{when}</time>
        </div>
      </div>

      <div className="file-card-details">
        {files?.length > 0 && (
          <div className="file-card-image">
            {files.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`file-${idx}`}
                className="file-card-image" />
            ))}
          </div>
        )}
        {/* content 변수를 사용하고, P 태그를 렌더링합니다. */}
        {content && (
          <p className="file-card-content">{content}</p>
        )}
      </div>
      {/* 추천 코드의 수정/삭제 버튼 및 UploadForm 로직을 추가합니다. */}
      <div className="file-atctions">
        <button className="btn secondary" onClick={() => setUploadOpen(true)}>
          수정하기
        </button>
        <button className="btn danger" onClick={() => remove(item._id)}>
          삭제하기
        </button>
      </div>
      {/* uploadOpen이 true일 때 UploadForm을 렌더링합니다. */}
      {uploadOpen && <UploadForm onClose={() => setUploadOpen(false)} initial={item} />}
    </div>
  );
};

export default UserPostItem;

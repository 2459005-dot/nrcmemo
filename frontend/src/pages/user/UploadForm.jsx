import React from 'react'
import "./style/UploadForm.scss"

const UploadForm = () => {
    return (
        <section className='am-backdrop'>
            <form className='am-panel Upload-form'>
                <header>
                    <h2>파일 업로드</h2>
                    <p className='sub'>이미지와 간단한 메모를 함께 업로드하세요.</p>
                </header>
            </form>

        </section>
    )
}

export default UploadForm
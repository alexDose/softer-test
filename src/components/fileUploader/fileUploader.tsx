import React, {ChangeEvent} from 'react';
import axios, {AxiosError} from 'axios';
import './fileUploader.css'

interface Props {
    accessToken: string;
}

const maxFiles = 100;

const FileUploader = ({accessToken}: Props) => {

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const selectedFiles = Array.from(files);
        if (selectedFiles.length > maxFiles) {
            alert(`Максимальное количество файлов - ${maxFiles}`);
            return;
        }
        for (const file of selectedFiles) {
            try {
                const response = await axios.get('https://cloud-api.yandex.net/v1/disk/resources/upload', {
                    headers: {
                        Authorization: `OAuth ${accessToken}`,
                    },
                    params: {
                        path: file.name,
                        overwrite: 'true'
                    }
                });
                const uploadUrl = response.data.href;
                await axios.put(uploadUrl, file, {
                    headers: {
                        'Content-Type': file.type,
                    },
                });
                alert(`Файл ${file.name} успешно загружен на Яндекс.Диск`);
            } catch (err) {
                const error = err as AxiosError
                console.error(`Ошибка при загрузке файла ${file.name}: ${error.message}`);
            }
        }
    };

    return (
        <div className="container">
            <label htmlFor="file-input" className="inputLabel">
                <span className="icon">
                <svg width="16" height="16" role="none" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M1 13v2h14v-2H1z M2 7h3v5h6V6.969L14 7L8 1L2 7z"></path>
                </svg>
            </span>
                Загрузить
            </label>
            <input
                type="file"
                id="file-input"
                multiple
                onChange={handleFileUpload}
                className="fileInput"
            />
        </div>
    );
};

export default FileUploader;

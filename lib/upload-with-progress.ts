/**
 * FormData POST with XMLHttpRequest so upload progress can be tracked.
 * Do not set Content-Type — the browser sets multipart boundaries.
 */
export function uploadFormDataWithProgress(
  url: string,
  formData: FormData,
  headers: { Authorization?: string },
  onProgress: (percent: number) => void,
  /** 클라이언트에서 multipart 전송이 끝난 뒤, 서버 응답 전 (압축·S3 등) 구간 */
  onAwaitingServerResponse?: () => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url)
    if (headers.Authorization) {
      xhr.setRequestHeader("Authorization", headers.Authorization)
    }

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && e.total > 0) {
        const pct = Math.min(100, Math.round((e.loaded / e.total) * 100))
        onProgress(pct)
      }
    })

    xhr.upload.addEventListener("load", () => {
      onAwaitingServerResponse?.()
    })

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText ?? "")
      } else {
        let msg = `HTTP ${xhr.status}`
        try {
          const j = JSON.parse(xhr.responseText)
          msg = j.message || j.error || msg
        } catch {
          if (xhr.responseText) {
            msg = xhr.responseText.slice(0, 240)
          }
        }
        reject(new Error(msg))
      }
    }

    xhr.onerror = () => reject(new Error("네트워크 오류가 발생했습니다."))
    xhr.send(formData)
  })
}

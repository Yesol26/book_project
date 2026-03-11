/**
 * 알라딘 이미지 URL을 더 나은 품질 버전으로 변환합니다.
 *
 * 알라딘 API 기본 URL은 'coversum' 디렉터리의 저화질 썸네일입니다.
 * coversum → cover 로 변경하면 원본 디렉터리의 더 큰 이미지를 사용할 수 있습니다.
 */
export function getHighQualityCover(url: string): string {
    if (!url) return '';
    return url.replace('coversum', 'cover');
}

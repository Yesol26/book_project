import { useState, useEffect } from 'react';

/**
 * 빠른 사용자 입력 시 과도한 API 호출을 방지하는 Debounce 커스텀 훅
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

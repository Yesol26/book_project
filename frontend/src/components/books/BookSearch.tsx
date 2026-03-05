'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookSearch } from '../../hooks/queries/useBooks';
import { useDebounce } from '../../hooks/useDebounce';
import BookList from './BookList';

const searchSchema = z.object({
    query: z.string().min(1, '최소 1글자 이상 입력해주세요.').or(z.literal('')),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export default function BookSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialQuery = searchParams.get('q') || '';
    const initialPage = parseInt(searchParams.get('page') || '1', 10);

    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const [page, setPage] = useState(initialPage);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const { register, watch, formState: { errors } } = useForm<SearchFormValues>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            query: initialQuery,
        },
        mode: 'onChange',
    });

    const queryValue = watch('query');

    useEffect(() => {
        // 유효성 검사를 통과했을 때만 searchTerm 업데이트
        if (!errors.query) {
            setSearchTerm(queryValue || '');
            // 사용자가 폼에서 새로운 검색어를 타이핑하여 값이 달라지면 페이지를 1로 리셋
            if (queryValue !== initialQuery && queryValue !== debouncedSearchTerm) {
                setPage(1);
            }
        }
    }, [queryValue, errors.query]);

    // URL 동기화 로직
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        let urlChanged = false;

        if (debouncedSearchTerm.trim().length > 0) {
            if (params.get('q') !== debouncedSearchTerm) {
                params.set('q', debouncedSearchTerm);
                urlChanged = true;
            }
            if (params.get('page') !== page.toString()) {
                params.set('page', page.toString());
                urlChanged = true;
            }
        } else {
            // 검색어가 비워진 경우 파라미터 전부 제거
            if (params.has('q')) {
                params.delete('q');
                params.delete('page');
                urlChanged = true;
            }
        }

        if (urlChanged) {
            // scroll: false로 스크롤 상단 이동 방지
            router.replace(`?${params.toString()}`, { scroll: false });
        }
    }, [debouncedSearchTerm, page, router, searchParams]);

    // 브라우저 뒤로가기 등으로 URL 파라미터가 변경된 경우 form 및 state 동기화
    useEffect(() => {
        const currentQ = searchParams.get('q') || '';
        const currentPage = parseInt(searchParams.get('page') || '1', 10);

        if (currentQ !== debouncedSearchTerm && currentQ !== searchTerm) {
            setSearchTerm(currentQ);
            // useForm의 상태는 onChange로 이미 제어중이므로 입력단에 직접 반영은 별도 고려할 수 있으나, 
            // 이 로직은 기본적으로 initialValue로서 처리되게 두어도 무방합니다.
        }

        if (currentPage !== page) {
            setPage(currentPage);
        }
    }, [searchParams]);

    const { data, isLoading, error } = useBookSearch(debouncedSearchTerm, page);

    const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

    return (
        <div className="w-full max-w-7xl mx-auto py-8">
            <div className="mb-8">
                <div className="relative max-w-2xl mx-auto">
                    <input
                        type="text"
                        {...register('query')}
                        placeholder="도서명, 저자, 출판사 등 검색"
                        className={`w-full px-5 py-4 border ${errors.query ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-full shadow-sm focus:ring-2 outline-none transition-all text-base`}
                    />
                    {isLoading && (
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    )}
                    {errors.query && (
                        <p className="absolute -bottom-6 left-5 text-sm text-red-500">
                            {errors.query.message}
                        </p>
                    )}
                </div>
            </div>

            {error ? (
                <div className="text-center text-red-500 py-10">검색 중 서버 오류가 발생했습니다.</div>
            ) : debouncedSearchTerm && debouncedSearchTerm.trim().length > 0 ? (
                <BookList
                    books={data?.books || []}
                    isLoading={isLoading}
                    page={page}
                    totalPages={totalPages}
                    total={data?.total}
                    onPageChange={setPage}
                />
            ) : (
                <div className="text-center text-gray-400 mt-20 mb-20 text-lg">
                    궁금한 도서를 검색해보세요 📚
                </div>
            )}
        </div>
    );
}

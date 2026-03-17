import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubApi } from '@/lib/api/clubs';

export const clubKeys = {
    all: ['clubs'] as const,
    list: () => [...clubKeys.all, 'list'] as const,
    detail: (id: string) => [...clubKeys.all, 'detail', id] as const,
    records: (id: string) => [...clubKeys.all, 'records', id] as const,
};

// 모임 목록 조회 훅
export const useClubs = () => {
    return useQuery({
        queryKey: clubKeys.list(),
        queryFn: () => clubApi.getClubs(),
    });
};

// 모임 상세 정보 조회 훅
export const useClub = (id: string) => {
    return useQuery({
        queryKey: clubKeys.detail(id),
        queryFn: () => clubApi.getClub(id),
        enabled: !!id,
    });
};

// 모임 생성 훅
export const useCreateClub = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clubApi.createClub,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clubKeys.list() });
        },
    });
};

// 모임 가입 훅
export const useJoinClub = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => clubApi.joinClub(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: clubKeys.list() });
            queryClient.invalidateQueries({ queryKey: clubKeys.detail(id) });
        },
    });
};

// 모임 탈퇴 훅
export const useLeaveClub = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => clubApi.leaveClub(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: clubKeys.list() });
            queryClient.invalidateQueries({ queryKey: clubKeys.detail(id) });
        },
    });
};

// 모임 기록 목록 조회 훅
export const useClubRecords = (clubId: string) => {
    return useQuery({
        queryKey: clubKeys.records(clubId),
        queryFn: () => clubApi.getRecords(clubId),
        enabled: !!clubId,
    });
};

// 모임 기록 생성 훅
export const useCreateClubRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ clubId, data }: { clubId: string; data: { title: string; content: string; isNotice?: boolean } }) =>
            clubApi.createRecord(clubId, data),
        onSuccess: (_, { clubId }) => {
            queryClient.invalidateQueries({ queryKey: clubKeys.records(clubId) });
        },
    });
};

// 모임 기록 삭제 훅
export const useDeleteClubRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ clubId, recordId }: { clubId: string; recordId: string; }) =>
            clubApi.deleteRecord(clubId, recordId),
        onSuccess: (_, { clubId }) => {
            queryClient.invalidateQueries({ queryKey: clubKeys.records(clubId) });
        },
    });
};

// 모임 삭제 훅
export const useDeleteClub = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clubApi.deleteClub,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clubKeys.list() });
        },
    });
};

// 책 완독/미완독 훅
export const useUpdateClubBookStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ clubId, bookId, status }: { clubId: string; bookId: string; status: 'COMPLETED' | 'EXPIRED' }) =>
            clubApi.updateClubBookStatus(clubId, bookId, status),
        onSuccess: (_, { clubId }) => {
            queryClient.invalidateQueries({ queryKey: clubKeys.detail(clubId) });
        },
    });
};

// 책 변경/추가 훅
export const useAddClubBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ clubId, book }: { clubId: string; book: any; }) =>
            clubApi.addClubBook(clubId, book),
        onSuccess: (_, { clubId }) => {
            queryClient.invalidateQueries({ queryKey: clubKeys.detail(clubId) });
        },
    });
};

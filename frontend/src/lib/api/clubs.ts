import { apiClient } from './client';

export const clubApi = {
    // 모임 생성
    createClub: async (data: {
        name: string;
        description: string;
        capacity: number;
        meetingDay?: string;
        meetingDayOfWeek?: number[];
        meetingTime?: string;
        bookChangeDay?: number;
        coverImage?: string;
        book?: any; // 이달의 책 데이터 (선택)
    }) => {
        const response = await apiClient.post('/clubs', data);
        return response.data;
    },

    // 모임 목록 조회
    getClubs: async () => {
        const response = await apiClient.get('/clubs');
        return response.data;
    },

    // 모임 상세 조회
    getClub: async (id: string) => {
        const response = await apiClient.get(`/clubs/${id}`);
        return response.data;
    },

    // 모임 참여(가입)
    joinClub: async (id: string) => {
        const response = await apiClient.post(`/clubs/${id}/join`);
        return response.data;
    },

    // 모임 탈퇴
    leaveClub: async (id: string) => {
        const response = await apiClient.post(`/clubs/${id}/leave`);
        return response.data;
    },

    // 모임 기록 생성
    createRecord: async (clubId: string, data: { title: string; content: string; isNotice?: boolean }) => {
        const response = await apiClient.post(`/clubs/${clubId}/records`, data);
        return response.data;
    },

    // 모임 기록 목록 조회
    getRecords: async (clubId: string) => {
        const response = await apiClient.get(`/clubs/${clubId}/records`);
        return response.data;
    },

    // 특정 모임 기록 삭제
    deleteRecord: async (clubId: string, recordId: string) => {
        const response = await apiClient.delete(`/clubs/${clubId}/records/${recordId}`);
        return response.data;
    },

    // 모임 삭제
    deleteClub: async (id: string) => {
        const response = await apiClient.delete(`/clubs/${id}`);
        return response.data;
    },

    // 책 완독/미완독 처리
    updateClubBookStatus: async (clubId: string, bookId: string, status: 'COMPLETED' | 'EXPIRED') => {
        const response = await apiClient.patch(`/clubs/${clubId}/books/${bookId}/status`, { status });
        return response.data;
    },

    // 책 추가/변경
    addClubBook: async (clubId: string, book: any) => {
        const response = await apiClient.post(`/clubs/${clubId}/books`, { book });
        return response.data;
    }
};

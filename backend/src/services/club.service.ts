// 독서 모임 관련 비즈니스 로직
export const clubService = {
    // 모임 생성
    createClub: async (data: any) => {
        // TODO: Prisma로 모임 생성
    },

    // 모임 목록 조회
    getClubs: async () => {
        // TODO: Prisma로 모임 목록 조회
    },

    // 모임 상세 조회
    getClubById: async (id: string) => {
        // TODO: Prisma로 모임 상세 조회
    },

    // 모임 참여
    joinClub: async (clubId: string, userId: string) => {
        // TODO: ClubMember 생성
    },

    // 모임 탈퇴
    leaveClub: async (clubId: string, userId: string) => {
        // TODO: ClubMember 삭제
    },
};

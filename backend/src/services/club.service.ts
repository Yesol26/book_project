import prisma from '../utils/prisma';
import { ClubMemberRole, ClubBookType } from '@prisma/client';

const CLUB_COLORS = [
    '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B',
    '#EF4444', '#0EA5E9', '#EC4899', '#6366F1'
];
export const clubService = {
    // 모임 생성
    createClub: async (data: {
        name: string;
        description: string;
        capacity: number;
        meetingDay?: string;
        meetingDayOfWeek?: number[];
        meetingTime?: string;
        bookChangeDay?: number;
        creatorId: string;
        coverImage?: string;
        book?: { // 이달의 책으로 등록할 도서 정보
            isbn: string;
            title: string;
            author: string;
            publisher: string;
            publishDate: string;
            description?: string;
            coverImage?: string;
            category?: string;
        };
    }) => {
        // 모임 기본 정보 및 모임장(OWNER) 멤버 등록을 하나의 트랜잭션으로 처리
        const club = await prisma.club.create({
            data: {
                name: data.name,
                description: data.description,
                capacity: data.capacity,
                meetingDay: data.meetingDay,
                meetingDayOfWeek: data.meetingDayOfWeek ? data.meetingDayOfWeek.join(',') : null,
                meetingTime: data.meetingTime,
                color: CLUB_COLORS[(await prisma.club.count()) % CLUB_COLORS.length],
                bookChangeDay: data.bookChangeDay || 1,
                creatorId: data.creatorId,
                coverImage: data.coverImage,
                members: {
                    create: {
                        userId: data.creatorId,
                        role: ClubMemberRole.OWNER,
                    }
                }
            },
            include: {
                members: true,
            }
        });

        // 이달의 책(book) 정보가 있다면 도서 upsert 후 ClubBook 연결
        if (data.book) {
            const bookRecord = await prisma.book.upsert({
                where: { isbn: data.book.isbn },
                update: {}, // 이미 존재하면 업데이트 안함
                create: {
                    isbn: data.book.isbn,
                    title: data.book.title,
                    author: data.book.author,
                    publisher: data.book.publisher,
                    publishDate: data.book.publishDate,
                    description: data.book.description || '',
                    coverImage: data.book.coverImage || '',
                    category: data.book.category || '',
                }
            });

            // Calculate endDate based on bookChangeDay
            const today = new Date();
            const changeDay = data.bookChangeDay || 1;
            let targetMonth = today.getMonth();
            if (today.getDate() >= changeDay) {
                targetMonth += 1;
            }
            const endOfMonthDate = new Date(today.getFullYear(), targetMonth, changeDay);

            await prisma.clubBook.create({
                data: {
                    clubId: club.id,
                    bookId: bookRecord.id,
                    type: ClubBookType.MONTHLY,
                    startDate: today,
                    endDate: endOfMonthDate,
                }
            });
        }

        return club;
    },

    // 모임 목록 조회
    getClubs: async () => {
        return prisma.club.findMany({
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true, profileImage: true } }
                    }
                },
                books: {
                    where: { type: ClubBookType.MONTHLY },
                    orderBy: { startDate: 'desc' },
                    take: 1,
                    include: { book: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    // 모임 상세 조회
    getClubById: async (id: string) => {
        return prisma.club.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true, profileImage: true } }
                    }
                },
                books: {
                    include: { book: true },
                    orderBy: { startDate: 'desc' }
                },
                schedules: true,
            }
        });
    },

    // 모임 참여 (정원 체크 포함)
    joinClub: async (clubId: string, userId: string) => {
        const club = await prisma.club.findUnique({
            where: { id: clubId },
            include: {
                _count: { select: { members: true } }
            }
        });

        if (!club) {
            throw new Error('모임을 찾을 수 없습니다.');
        }

        if (club._count.members >= club.capacity) {
            throw new Error('정원 초과');
        }

        const existingMember = await prisma.clubMember.findUnique({
            where: { userId_clubId: { userId, clubId } }
        });

        if (existingMember) {
            throw new Error('이미 가입된 모임입니다.');
        }

        return prisma.clubMember.create({
            data: {
                userId,
                clubId,
                role: ClubMemberRole.MEMBER,
            }
        });
    },

    // 모임 탈퇴
    leaveClub: async (clubId: string, userId: string) => {
        const member = await prisma.clubMember.findUnique({
            where: { userId_clubId: { userId, clubId } }
        });

        if (!member) {
            throw new Error('가입되지 않은 모임입니다.');
        }

        if (member.role === ClubMemberRole.OWNER) {
            throw new Error('모임장은 탈퇴할 수 없습니다.'); // TODO: 모임장 양도 로직 필요 시 추가
        }

        return prisma.clubMember.delete({
            where: { userId_clubId: { userId, clubId } }
        });
    },

    // 모임 기록 생성
    createRecord: async (clubId: string, authorId: string, data: { title: string; content: string }) => {
        // 멤버 확인
        const member = await prisma.clubMember.findUnique({
            where: { userId_clubId: { userId: authorId, clubId } }
        });

        if (!member) {
            throw new Error('Unauthorized');
        }

        return prisma.clubRecord.create({
            data: {
                title: data.title,
                content: data.content,
                clubId,
                authorId,
            }
        });
    },

    // 모임 기록 목록 조회
    getRecordsByClubId: async (clubId: string) => {
        return prisma.clubRecord.findMany({
            where: { clubId },
            include: {
                author: { select: { id: true, name: true, profileImage: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    // 특정 모임 기록 상세 조회
    getRecordById: async (recordId: string) => {
        return prisma.clubRecord.findUnique({
            where: { id: recordId },
            include: {
                author: { select: { id: true, name: true, profileImage: true } }
            }
        });
    },

    // 모임 기록 삭제
    deleteRecord: async (recordId: string, userId: string) => {
        const record = await prisma.clubRecord.findUnique({
            where: { id: recordId }
        });

        if (!record) throw new Error('Not found');

        const member = await prisma.clubMember.findUnique({
            where: { userId_clubId: { userId, clubId: record.clubId } }
        });

        if (!member) throw new Error('Unauthorized');
        if (record.authorId !== userId && member.role !== ClubMemberRole.OWNER) {
            throw new Error('Unauthorized');
        }

        return prisma.clubRecord.delete({ where: { id: recordId } });
    },

    // 모임 삭제
    deleteClub: async (clubId: string, userId: string) => {
        const member = await prisma.clubMember.findUnique({
            where: { userId_clubId: { userId, clubId } }
        });

        if (!member || member.role !== ClubMemberRole.OWNER) {
            throw new Error('모임장만 모임을 삭제할 수 있습니다.');
        }

        // Cascade 에 의해 관련된 데이터 모두 삭제됨
        return prisma.club.delete({
            where: { id: clubId }
        });
    },

    // 책 완독/미완독 처리
    updateClubBookStatus: async (clubId: string, bookId: string, userId: string, status: 'COMPLETED' | 'EXPIRED') => {
        const member = await prisma.clubMember.findUnique({
            where: { userId_clubId: { userId, clubId } }
        });

        if (!member || member.role !== ClubMemberRole.OWNER) {
            throw new Error('모임장만 완료 처리할 수 있습니다.');
        }

        const clubBook = await prisma.clubBook.findFirst({
            where: { clubId, id: bookId, status: 'READING' }
        });

        if (!clubBook) {
            throw new Error('현재 읽고 있는 책이 아니거나 찾을 수 없습니다.');
        }

        return prisma.clubBook.update({
            where: { id: bookId },
            data: {
                status,
                isCompleted: status === 'COMPLETED',
                completedAt: new Date(),
            }
        });
    },

    // 새로운 책 등록
    addClubBook: async (clubId: string, userId: string, bookData: any) => {
        const club = await prisma.club.findUnique({
            where: { id: clubId },
            include: {
                books: { where: { status: 'READING' } },
                members: { where: { userId } }
            }
        });

        if (!club) throw new Error('모임을 찾을 수 없습니다.');
        const member = club.members[0];

        if (!member || member.role !== ClubMemberRole.OWNER) {
            throw new Error('모임장만 책을 추가할 수 있습니다.');
        }

        if (club.books.length >= 3) {
            throw new Error('현재 진행 중인 책은 최대 3권까지만 지정할 수 있습니다.');
        }

        // Upsert Book
        const bookRecord = await prisma.book.upsert({
            where: { isbn: bookData.isbn },
            update: {}, // 이미 존재하면 업데이트 안함
            create: {
                isbn: bookData.isbn,
                title: bookData.title,
                author: bookData.author,
                publisher: bookData.publisher,
                publishDate: bookData.publishDate,
                description: bookData.description || '',
                coverImage: bookData.coverImage || '',
                category: bookData.category || '',
            }
        });

        const today = new Date();
        const changeDay = club.bookChangeDay || 1;
        let targetMonth = today.getMonth();
        if (today.getDate() >= changeDay) {
            targetMonth += 1;
        }
        const endOfMonthDate = new Date(today.getFullYear(), targetMonth, changeDay);

        return prisma.clubBook.create({
            data: {
                clubId,
                bookId: bookRecord.id,
                type: ClubBookType.MONTHLY,
                startDate: today,
                endDate: endOfMonthDate,
                status: 'READING',
                isCompleted: false
            }
        });
    }
};

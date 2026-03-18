import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { clubService } from '../services/club.service';
import prisma from '../utils/prisma';

export const clubController = {
    // 모임 생성
    createClub: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ message: '인증이 필요합니다.' });
                return;
            }

            const { name, description, capacity, meetingDay, meetingDayOfWeek, meetingTime, bookChangeDay, coverImage, book } = req.body;

            // 필수값 확인
            if (!name || !description || !capacity) {
                res.status(400).json({ message: '모임 이름, 설명, 인원은 필수입니다.' });
                return;
            }

            const club = await clubService.createClub({
                name,
                description,
                capacity: parseInt(capacity),
                meetingDay,
                meetingDayOfWeek: Array.isArray(meetingDayOfWeek) ? meetingDayOfWeek.map(Number) : undefined,
                meetingTime,
                bookChangeDay: bookChangeDay ? parseInt(bookChangeDay) : undefined,
                creatorId: userId,
                coverImage,
                book
            });

            res.status(201).json(club);
        } catch (error: any) {
            res.status(500).json({ message: error.message || '서버 오류가 발생했습니다.' });
        }
    },

    // 모임 목록 조회
    getClubs: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const clubs = await clubService.getClubs();
            res.status(200).json(clubs);
        } catch (error: any) {
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    },

    // 모임 상세 조회
    getClub: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const club = await clubService.getClubById(id);
            if (!club) {
                res.status(404).json({ message: '모임을 찾을 수 없습니다.' });
                return;
            }
            res.status(200).json(club);
        } catch (error: any) {
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    },

    // 모임 참여
    joinClub: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            const id = req.params.id as string;
            if (!userId) {
                res.status(401).json({ message: '인증이 필요합니다.' });
                return;
            }

            await clubService.joinClub(id, userId);
            res.status(200).json({ message: '모임에 성공적으로 가입했습니다.' });
        } catch (error: any) {
            if (error.message === '정원 초과') {
                res.status(400).json({ message: '이 모임은 정원이 가득 찼습니다.' });
                return;
            }
            if (error.message === '이미 가입된 모임입니다.' || error.message === '모임을 찾을 수 없습니다.') {
                res.status(400).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    },

    // 모임 탈퇴
    leaveClub: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            const id = req.params.id as string;
            if (!userId) {
                res.status(401).json({ message: '인증이 필요합니다.' });
                return;
            }

            await clubService.leaveClub(id, userId);
            res.status(200).json({ message: '모임을 탈퇴했습니다.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // 모임 기록 생성
    createRecord: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            const clubId = req.params.id as string;
            const { title, content } = req.body;

            if (!userId) {
                res.status(401).json({ message: '인증이 필요합니다.' });
                return;
            }

            if (!title || !content) {
                res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
                return;
            }

            // [공지] 태그가 있으면 OWNER 권한 검증
            if (title.includes('[공지]') || req.body.isNotice) {
                const member = await prisma.clubMember.findUnique({
                    where: { userId_clubId: { userId, clubId } }
                });
                if (!member || member.role !== 'OWNER') {
                    res.status(403).json({ message: '공지사항은 모임장만 작성할 수 있습니다.' });
                    return;
                }
            }

            const record = await clubService.createRecord(clubId, userId, { title, content });
            res.status(201).json(record);
        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                res.status(403).json({ message: '모임 멤버만 기록을 작성할 수 있습니다.' });
                return;
            }
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    },

    // 모임 기록 목록 조회
    getRecords: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            const clubId = req.params.id as string;

            if (!userId) {
                res.status(401).json({ message: '인증이 필요합니다.' });
                return;
            }

            // 모임 멤버인지 확인
            const member = await prisma.clubMember.findUnique({
                where: { userId_clubId: { userId, clubId } }
            });

            if (!member) {
                res.status(403).json({ message: '모임 멤버만 조회할 수 있습니다.' });
                return;
            }

            const records = await clubService.getRecordsByClubId(clubId);
            res.status(200).json(records);
        } catch (error: any) {
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    },

    // 모임 기록 삭제
    deleteRecord: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            const clubId = req.params.id as string;
            const recordId = req.params.recordId as string;

            if (!userId) {
                res.status(401).json({ message: '인증이 필요합니다.' });
                return;
            }

            await clubService.deleteRecord(recordId, userId);
            res.status(200).json({ message: '기록이 삭제되었습니다.' });
        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                res.status(403).json({ message: '삭제 권한이 없습니다.' });
                return;
            }
            if (error.message === 'Not found') {
                res.status(404).json({ message: '기록을 찾을 수 없습니다.' });
                return;
            }
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    },

    // 모임 삭제
    deleteClub: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            const clubId = req.params.id as string;

            if (!userId) {
                res.status(401).json({ message: '인증이 필요합니다.' });
                return;
            }

            await clubService.deleteClub(clubId, userId);
            res.status(200).json({ message: '모임이 삭제되었습니다.' });
        } catch (error: any) {
            res.status(403).json({ message: error.message });
        }
    },

    // 책 상태 변경 (완독/미완독)
    updateClubBookStatus: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            const clubId = req.params.id as string;
            const bookId = req.params.bookId as string;
            const { status } = req.body;

            if (!userId) {
                res.status(401).json({ message: '인증이 필요합니다.' });
                return;
            }

            if (status !== 'COMPLETED' && status !== 'EXPIRED') {
                res.status(400).json({ message: '잘못된 상태 값입니다.' });
                return;
            }

            const updatedBook = await clubService.updateClubBookStatus(clubId, bookId, userId, status);
            res.status(200).json(updatedBook);
        } catch (error: any) {
            res.status(403).json({ message: error.message });
        }
    },

    // 책 변경/추가
    addClubBook: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            const clubId = req.params.id as string;
            const { book } = req.body;

            if (!userId) {
                res.status(401).json({ message: '인증이 필요합니다.' });
                return;
            }

            if (!book) {
                res.status(400).json({ message: '책 데이터가 필요합니다.' });
                return;
            }

            const newBook = await clubService.addClubBook(clubId, userId, book);
            res.status(201).json(newBook);
        } catch (error: any) {
            res.status(403).json({ message: error.message });
        }
    }
};

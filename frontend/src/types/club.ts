import { Book } from './book';
import { User } from './auth';

export interface Club {
    id: string;
    name: string;
    description: string;
    coverImage?: string;
    creatorId: string;
    members: ClubMember[];
    currentBook?: ClubBook;
    createdAt: Date;
}

export interface ClubMember {
    id: string;
    userId: string;
    clubId: string;
    user: User;
    role: 'OWNER' | 'MEMBER';
    joinedAt: Date;
}

export interface ClubBook {
    id: string;
    clubId: string;
    book: Book;
    type: 'MONTHLY' | 'WEEKLY';
    startDate: Date;
    endDate: Date;
}

export interface ClubPost {
    id: string;
    clubId: string;
    authorId: string;
    author: User;
    title: string;
    content: string;
    comments: ClubComment[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ClubComment {
    id: string;
    postId: string;
    authorId: string;
    author: User;
    content: string;
    createdAt: Date;
}

export interface ClubSchedule {
    id: string;
    clubId: string;
    title: string;
    description?: string;
    scheduledAt: Date;
    createdAt: Date;
}

export interface ChatMessage {
    id: string;
    clubId: string;
    userId: string;
    user: User;
    message: string;
    createdAt: Date;
}

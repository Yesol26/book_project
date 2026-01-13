import { Book } from './book';

export enum ReadingStatus {
    READING = 'READING',
    COMPLETED = 'COMPLETED',
    WISHLIST = 'WISHLIST',
}

export interface Reading {
    id: string;
    userId: string;
    book: Book;
    status: ReadingStatus;
    startDate?: Date;
    endDate?: Date;
    currentPage?: number;
    rating?: number;
    review?: string;
    notes?: ReadingNote[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ReadingNote {
    id: string;
    readingId: string;
    content: string;
    page?: number;
    createdAt: Date;
}

export interface ReadingStats {
    totalBooks: number;
    booksThisMonth: number;
    booksThisYear: number;
    totalPages: number;
    averageRating: number;
    monthlyData: MonthlyReading[];
}

export interface MonthlyReading {
    month: string;
    count: number;
    pages: number;
}

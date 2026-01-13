export interface Book {
    id: string;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    publishDate: string;
    description?: string;
    coverImage?: string;
    category?: string;
    pages?: number;
}

export interface BookSearchParams {
    query?: string;
    category?: string;
    page?: number;
    limit?: number;
}

export interface BookRanking {
    rank: number;
    book: Book;
    sales?: number;
}

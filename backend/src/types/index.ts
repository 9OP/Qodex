// Data Transfert Objects

export interface Question {
    id: string;
    author: { id: string; name: string };
    qodex: { id: string; name: string };
    title: string;
    question: string;
    tags: string[];
    date: string;
    score: number;
    answers_count: number;
    selected_answer_id: string;
}

export interface Qodex {
    id: string;
    name: string;
    description: string;
    questions_count: number;
}

export interface Answer {
    id: string;
    author: { id: string; name: string };
    answer: string;
    date: string;
    score: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    is_admin: boolean;
    favorite_questions: string[];
}

export interface Stats {
    questions_count: number;
    answers_count: number;
    qodexes_count: number;
    users_count: number;
    my_questions_count: number;
    my_answers_count: number;
}

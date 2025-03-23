export interface User {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    department: string;
    userTag: string;
    position: string;
    birthday: string;
}
export interface UserWithNextBirthday extends User {
    nextBirthday: Date;
}
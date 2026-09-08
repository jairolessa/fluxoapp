import { string } from "yup";

type MockUser = {
    id: string,
    fullName: string,
    email: string,
    password: string,
    preferredName?: string;
};

let users: MockUser[] = [];

export const mockAuthStore = {

    register(fullName: string, email: string, password: string): MockUser {
        const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());

        if(exists) {
            throw new Error('Email já cadastrado!');
        }

        const newUser: MockUser = { id: String(Date.now()), fullName, email, password };
        users.push(newUser);
        return newUser;
    },

    login(email: string, password: string): MockUser {
        const user = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if(!user){
            throw new Error('E-mail ou senha inválidos!');
        }

        return user;
    },

    setPreferredName(userId: string, preferredName: string): void {
        const user = users.find((u) => u.id === userId);
        if(user) user.preferredName = preferredName;
    },

    listUsers(): MockUser[] {
        return users;
    },
};
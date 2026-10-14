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
        const normalizedEmail = email.trim().toLowerCase();
        const exists = users.some((user) => user.email.toLowerCase() === normalizedEmail);

        if(exists) {
            throw new Error('Email já cadastrado!');
        }

        const newUser: MockUser = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, fullName: fullName.trim(), email: normalizedEmail, password };
        users.push(newUser);
        return newUser;
    },

    login(email: string, password: string): MockUser {
        const user = users.find(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
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

};

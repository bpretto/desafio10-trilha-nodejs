import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    })

    it("Should be able to authenticate user", async () => {
        const user = {
            name: "sample name",
            email: "sample@email.com",
            password: "password"
        }

        await createUserUseCase.execute(user)

        const authenticateUser = await authenticateUserUseCase.execute(user);

        expect(authenticateUser).toHaveProperty("token")
    })

    it("Should not be able to authenticate user with wrong email", async () => {
        expect(async () => {
            const user = {
                name: "sample name",
                email: "sample@email.com",
                password: "password"
            }

            const wrongUser = {
                name: "sample name",
                email: "wrong@email.com",
                password: "password"
            }

            await createUserUseCase.execute(user)

            const authenticateUser = await authenticateUserUseCase.execute(wrongUser);
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })

    it("Should not be able to authenticate user with wrong password", async () => {
        expect(async () => {
            const user = {
                name: "sample name",
                email: "sample@email.com",
                password: "password"
            }

            const wrongUser = {
                name: "sample name",
                email: "sample@email.com",
                password: "wrongpassword"
            }

            await createUserUseCase.execute(user)

            const authenticateUser = await authenticateUserUseCase.execute(wrongUser);
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })
})


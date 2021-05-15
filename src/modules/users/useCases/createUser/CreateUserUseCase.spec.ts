import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })

    it("Should be able to create a user", async () => {
        const user = await createUserUseCase.execute({
            name: "sample name",
            email: "sample@email.com",
            password: "password"
        })

        expect(user).toHaveProperty("id")
    })

    it("Should not be able to create a user with already used email", async () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: "sample name",
                email: "sample@email.com",
                password: "password"
            })

            await createUserUseCase.execute({
                name: "sample name",
                email: "sample@email.com",
                password: "password"
            })
        }).rejects.toBeInstanceOf(AppError)
    })
})
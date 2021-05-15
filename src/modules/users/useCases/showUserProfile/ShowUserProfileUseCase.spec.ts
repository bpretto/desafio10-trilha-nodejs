import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {


    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    })

    it("Should be able to show user profile", async () => {
        const user = {
            name: "sample name",
            email: "sample@email.com",
            password: "password"
        }

        await createUserUseCase.execute(user)

        const authenticateUser = await authenticateUserUseCase.execute(user);

        const userProfile = await showUserProfileUseCase.execute(authenticateUser.user.id as string)

        expect(userProfile).toHaveProperty("id")
        expect(userProfile).toHaveProperty("name")
        expect(userProfile).toHaveProperty("email")
        expect(userProfile).toHaveProperty("password")

    })

    it("Should not be able to show user profile of non-existing user", async () => {
        expect(async () => {
            const user = {
                name: "sample name",
                email: "sample@email.com",
                password: "password"
            }

            await createUserUseCase.execute(user)

            const authenticateUser = await authenticateUserUseCase.execute(user);

            const userProfile = await showUserProfileUseCase.execute("fakeid")
        }).rejects.toBeInstanceOf(ShowUserProfileError)
    })
})
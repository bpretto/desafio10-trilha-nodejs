import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase
let getBalanceUseCase: GetBalanceUseCase
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository


describe("Get Balance", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    })
        ;
    it("Should be able to get balance", async () => {
        const user = {
            name: "sample name",
            email: "sample@email.com",
            password: "password"
        };

        await createUserUseCase.execute(user);

        const authenticatedUser = await authenticateUserUseCase.execute(user);

        const user_id = authenticatedUser.user.id as string;

        const userBalance = await getBalanceUseCase.execute({ user_id });

        await createStatementUseCase.execute({
            user_id,
            type: 'deposit' as any,
            amount: 100,
            description: "sample description"
        });

        const userBalance2 = await getBalanceUseCase.execute({ user_id });

        expect(userBalance.balance).toBe(0)
        expect(userBalance2.balance).toBe(100)
    });

    it("Should not be able to get balance of unexisting user", async () => {
        expect(async () => {
            const user_id = "wrongid"

            await getBalanceUseCase.execute({ user_id });
        }).rejects.toBeInstanceOf(GetBalanceError)
    });
});
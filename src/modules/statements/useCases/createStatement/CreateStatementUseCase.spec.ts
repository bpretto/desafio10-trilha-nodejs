import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository


describe("Get Balance", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    });

    it("Should be able to create deposit statement", async () => {
        const user = {
            name: "sample name",
            email: "sample@email.com",
            password: "password"
        };

        await createUserUseCase.execute(user);

        const authenticatedUser = await authenticateUserUseCase.execute(user);

        const user_id = authenticatedUser.user.id as string;

        const statementOperation = {
            user_id,
            type: 'deposit' as any,
            amount: 100,
            description: "sample description"
        };

        const statement = await createStatementUseCase.execute(statementOperation);

        expect(statement).toHaveProperty("id")
    });

    it("Should be able to create withdraw statement", async () => {
        const user = {
            name: "sample name",
            email: "sample@email.com",
            password: "password"
        };

        await createUserUseCase.execute(user);

        const authenticatedUser = await authenticateUserUseCase.execute(user);

        const user_id = authenticatedUser.user.id as string;

        const depositOperation = {
            user_id,
            type: 'deposit' as any,
            amount: 100,
            description: "sample description"
        };

        const withdrawOperation = {
            user_id,
            type: 'withdraw' as any,
            amount: 100,
            description: "sample description"
        };

        await createStatementUseCase.execute(depositOperation);

        const statement = await createStatementUseCase.execute(withdrawOperation);

        expect(statement).toHaveProperty('id');
    });

    it("Should not be able to create statement with unexisting user", async () => {
        expect(async () => {
            await createStatementUseCase.execute({
                user_id: "wrongid",
                type: 'deposit' as any,
                amount: 100,
                description: "sample description"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    });

    it("Should not be able to create withdraw statement from insufficiently funded account", async () => {
        expect(async () => {
            const user = {
                name: "sample name",
                email: "sample@email.com",
                password: "password"
            };

            await createUserUseCase.execute(user);

            const authenticatedUser = await authenticateUserUseCase.execute(user);

            const user_id = authenticatedUser.user.id as string;

            const statementOperation = {
                user_id,
                type: 'withdraw' as any,
                amount: 100,
                description: "sample description"
            };

            await createStatementUseCase.execute(statementOperation);
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});
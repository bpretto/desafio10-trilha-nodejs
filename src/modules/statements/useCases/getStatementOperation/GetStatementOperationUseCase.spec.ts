import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";


let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    });

    it("Should be able to get statement operation", async () => {
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
        const statement_id = statement.id as string;


        const getStatementOperation = await getStatementOperationUseCase.execute({ statement_id, user_id });

        expect(getStatementOperation).toHaveProperty("id");
    });

    it("Should not be able to get unexisting statement operation", async () => {
        expect(async () => {
            const user = {
                name: "sample name",
                email: "sample@email.com",
                password: "password"
            };

            await createUserUseCase.execute(user);

            const authenticatedUser = await authenticateUserUseCase.execute(user);

            const user_id = authenticatedUser.user.id as string;

            const statement_id = "id";

            await getStatementOperationUseCase.execute({ statement_id, user_id });

        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });
});
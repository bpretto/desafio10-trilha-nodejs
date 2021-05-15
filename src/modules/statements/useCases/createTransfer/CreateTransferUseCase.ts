import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";


interface IRequest {
    sender_id: string
    receiver_id: string;
    amount: number;
    description: string;
}

@injectable()
class CreateTransferUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("StatementsRepository")
        private statementsRepository: IStatementsRepository
    ) { }

    async execute({ sender_id, receiver_id, amount, description }: IRequest) {
        const sender = this.usersRepository.findById(sender_id);
        const receiver = this.usersRepository.findById(receiver_id);

        if (!sender) {
            throw new CreateTransferError.UserNotFound();
        }

        const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

        if (balance < amount) {
            throw new CreateTransferError.InsufficientFunds()
        }

        enum OperationType {
            TRANSFER = 'transfer'
        }

        await this.statementsRepository.create({
            user_id: sender_id,
            amount,
            description,
            type: OperationType.TRANSFER
        });

        const amountNegative = -amount

        const receiveTransfer = await this.statementsRepository.create({
            user_id: receiver_id,
            amount: amountNegative,
            description,
            type: OperationType.TRANSFER
        })

        return receiveTransfer;
    }
}

export { CreateTransferUseCase }

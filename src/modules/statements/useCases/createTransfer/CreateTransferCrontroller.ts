import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";


class CreateTransferController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { user_id: receiver_id } = request.params;
        const { id: sender_id } = request.user
        const { amount, description } = request.body;

        const createTransferUseCase = container.resolve(CreateTransferUseCase);

        const transfer = createTransferUseCase.execute({ receiver_id, sender_id, amount, description })

        return response.status(201).json(transfer);
    }
}

export { CreateTransferController }

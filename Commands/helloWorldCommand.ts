import {
    IHttp,
    IMessageBuilder,
    IModify,
    IModifyCreator,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { ButtonStyle } from "@rocket.chat/apps-engine/definition/uikit";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export class HelloWorldCommand implements ISlashCommand {
    public command = "hello";
    public i18nDescription = "";
    public providesPreview = false;
    public i18nParamsExample = "";

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        //greet builder
        const greetBuilder = modify
            .getCreator()
            .startMessage()
            .setRoom(context.getRoom())
            .setText(`Hey _${context.getSender().username}_ !`);

        //closing greet builder
        await modify.getCreator().finish(greetBuilder);

        const builder = modify
            .getCreator()
            .startMessage()
            .setRoom(context.getRoom());

        const block = modify.getCreator().getBlockBuilder();

        block.addActionsBlock({
            blockId: "subreddits",
            elements: [
                block.newButtonElement({
                    actionId: "memes",
                    text: block.newPlainTextObject("dank"),
                    value: "programmerhumor",
                    style: ButtonStyle.PRIMARY,
                }),
            ],
        });
        block.addActionsBlock({
            blockId: "subreddits",
            elements: [
                block.newButtonElement({
                    //contect interaction captured
                    actionId: "open_popup",
                    text: block.newPlainTextObject("popUp"),
                    style: ButtonStyle.PRIMARY,
                }),
            ],
        });
        builder.setBlocks(block);
        await modify.getCreator().finish(builder);
    }
}

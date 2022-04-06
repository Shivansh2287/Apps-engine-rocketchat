import {
    IAppAccessors,
    IConfigurationExtend,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import {
    ButtonStyle,
    IUIKitResponse,
    TextObjectType,
    UIKitBlockInteractionContext,
    UIKitLivechatBlockInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { HelloWorldCommand } from "./Commands/helloWorldCommand";
import { IUIKitModalViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";
import { boilerplateModal } from "./modal/Boilerplate";
import { MemeAsImageAttachment } from "./memeAsimage";
import { UIActionButtonContext } from "@rocket.chat/apps-engine/definition/ui";
``;
export class HelloWorldApp extends App {
    private readonly appLogger: ILogger;
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ) {
        const data = context.getInteractionData();

        const triggerId = data.triggerId;
        const { actionId } = data;

        switch (actionId) {
            case "open_popup": {
                try {
                    const { room } = context.getInteractionData();

                    const modal = await boilerplateModal({
                        read,
                        modify,
                        user: context.getInteractionData().user,
                    });
                    await modify
                        .getUiController()
                        .openModalView(
                            modal,
                            { triggerId },
                            context.getInteractionData().user
                        );
                    return {
                        success: true,
                    };
                } catch (err) {
                    console.error(err);
                    return {
                        success: false,
                    };
                }
            }
            case "memes": {
                try {
                    const memeResponse = await http.get(
                        `https://meme-api.herokuapp.com/gimme/${data.value}/1`
                    );

                    const { room } = context.getInteractionData();

                    const memeSender = await modify
                        .getCreator()
                        .startMessage()
                        .setText(`*${memeResponse.data.memes[0].title}*`)
                        .addAttachment(
                            new MemeAsImageAttachment(
                                memeResponse.data.memes[0].url
                            )
                        );

                    if (room) {
                        memeSender.setRoom(room);
                    }

                    await modify.getCreator().finish(memeSender);

                    return {
                        success: true,
                    };
                } catch (err) {
                    console.error(err);
                    return {
                        success: false,
                    };
                }
            }
        }

        return {
            success: false,
        };
    }

    public async extendConfiguration(
        configuration: IConfigurationExtend
    ): Promise<void> {
        const helloWorldCommand: HelloWorldCommand = new HelloWorldCommand();
        await configuration.slashCommands.provideSlashCommand(
            helloWorldCommand
        );
    }
}

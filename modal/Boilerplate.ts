import { IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { TextObjectType } from "@rocket.chat/apps-engine/definition/uikit/blocks";
import { IUIKitModalViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { BoilerplateEnum } from "./enum";
import { getUIData } from "./persistancs";
import { ButtonStyle } from "@rocket.chat/apps-engine/definition/uikit";

export async function boilerplateModal({
    modify,
    read,
    user,
}: {
    modify: IModify;
    read: IRead;
    user: IUser;
}): Promise<IUIKitModalViewParam> {
    const block = modify.getCreator().getBlockBuilder();
    block.addSectionBlock({
        text: block.newMarkdownTextObject("POP UP"),
    });
    block.addActionsBlock({
        blockId: "popup",
        elements: [
            block.newStaticSelectElement({
                actionId: "popup",
                placeholder: block.newPlainTextObject("Select a option"),
                options: [
                    {
                        text: { type: TextObjectType.PLAINTEXT, text: "Yes" },
                        value: "Yes",
                    },
                    {
                        text: { type: TextObjectType.PLAINTEXT, text: "No" },
                        value: "No",
                    },
                ],
                initialValue: "No",
            }),
        ],
    });
    return {
        id: "demo",
        title: {
            type: TextObjectType.PLAINTEXT,
            text: "select options",
        },
        submit: block.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Submit",
            },
        }),
        close: block.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Close",
            },
        }),
        blocks: block.getBlocks(),
    };
}

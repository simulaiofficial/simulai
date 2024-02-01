from api.model import BlockText, BlockType, Details, BlockHeading, BlockDivider, BlockQuote, BlockOptions, BlockRadio, \
    BlockInputTextAnswer, BlockInputEmailAnswer, BlockInputNumberAnswer, OptionItem, Page, BlockCondition, \
    ActionSelectedType, IsOperatorSelectedType


def get_sample_page():
    # Sample instances of each block type
    block_text0 = BlockText(id='text0', type=BlockType.Text, details=Details(value='Give me value'),
                            isHidden=False)
    block_input_number0 = BlockInputNumberAnswer(id='0', type=BlockType.InputNumberAnswer, details=Details(),
                                                 isHidden=False, isRequired=True, setName=True, name='Number Input Block',
                                                 minRequired=False, min=None, maxRequired=True, max=100)
    block_condition0 = BlockCondition(
        id='con0',
        type=BlockType.Condition,
        details=Details(),
        isHidden=False,
        whenBlockSelectedId='0',  # Assuming the condition depends on the BlockOptions with id '5'
        isOperatorSelectedId=IsOperatorSelectedType.Greater,
        # This is a hypothetical operator ID, replace with actual if different
        isOperatorValue='6',  # The value to compare against, in this case, it could be a selection from BlockOptions
        actionSelectedId=ActionSelectedType.Jump,  # This is a hypothetical action ID, replace with actual if different
        actionBlockSelectedId='text5'  # The id of the block to show/hide, in this case, BlockInputTextAnswer with id '7'
    )
    block_text = BlockText(id='1', type=BlockType.Text, details=Details(
        value='*Hi* my name is **simulai**. Well, actually I am a bot, which you can build by yourself, using our service https://www.simulai.co to build your **conversational form**'),
                           isHidden=False)
    block_heading = BlockHeading(id='2', type=BlockType.H1,
                                 details=Details(value='So I am a kind of "**Conversation Form**"'), isHidden=False)
    block_divider = BlockDivider(id='3', type=BlockType.Divider, details=Details(), isHidden=False)
    block_quote = BlockQuote(id='4', type=BlockType.Quote, details=Details(
        value='"**Conversational Form**" is a type of a web form which is used to chat with users to gather some data from them'),
                             isHidden=False)
    block_text1 = BlockText(id='text1', type=BlockType.Text, details=Details(
        value='Do you think that by conversation like that with a bot people may have easier time to share info about themselves?'),
                            isHidden=False)
    block_radio = BlockRadio(id='6', type=BlockType.Radio, details=Details(), isHidden=False, isRequired=False,
                             setName=True, name='Radio Block',
                             items=[OptionItem(label='Yes', isChecked=False), OptionItem(label='No', isChecked=True)])
    block_text2 = BlockText(id='text2', type=BlockType.Text,
                            details=Details(value='What type of form you used in the past?'), isHidden=False)
    block_options = BlockOptions(id='5', type=BlockType.Options, details=Details(), isHidden=False, isRequired=True,
                                 setName=False, name='Options Block', items=[OptionItem(label='Web Form', isChecked=False),
                                                                             OptionItem(label='Conversational Form',
                                                                                        isChecked=True)])
    block_condition = BlockCondition(
        id='10',
        type=BlockType.Condition,
        details=Details(),
        isHidden=False,
        whenBlockSelectedId='5',  # Assuming the condition depends on the BlockOptions with id '5'
        isOperatorSelectedId=IsOperatorSelectedType.Selected,
        # This is a hypothetical operator ID, replace with actual if different
        isOperatorValue='Conversational Form',
        # The value to compare against, in this case, it could be a selection from BlockOptions
        actionSelectedId=ActionSelectedType.Jump,  # This is a hypothetical action ID, replace with actual if different
        actionBlockSelectedId='text5'  # The id of the block to show/hide, in this case, BlockInputTextAnswer with id '7'
    )
    block_text3 = BlockText(id='text3', type=BlockType.Text, details=Details(value='Btw. what is your name?'),
                            isHidden=False)
    block_input_text = BlockInputTextAnswer(id='7', type=BlockType.InputTextAnswer, details=Details(), isHidden=False,
                                            isRequired=True, setName=True, name='Text Input Block', minRequired=True, min=2,
                                            maxRequired=False, max=None)
    block_text4 = BlockText(id='text4', type=BlockType.Text, details=Details(value='and your email?'), isHidden=False)
    block_input_email = BlockInputEmailAnswer(id='8', type=BlockType.InputEmailAnswer, details=Details(), isHidden=False,
                                              isRequired=False, setName=False, name='Email Input Block', isCompany=True)
    block_text5 = BlockText(id='text5', type=BlockType.Text,
                            details=Details(value='could you share also your phone number?'), isHidden=False)
    block_input_number = BlockInputNumberAnswer(id='9', type=BlockType.InputNumberAnswer, details=Details(), isHidden=False,
                                                isRequired=True, setName=False, name=None, minRequired=False,
                                                min=None, maxRequired=True, max=100)
    block_text_finish = BlockText(id='10', type=BlockType.Text, details=Details(value='That\'s all, thanks!'),
                                  isHidden=False)

    # Creating the sample page with all block types
    sample_page = Page(
        name="🤖 simulai",
        isChat=False,
        isPreview=False,
        blocks=[
            block_text0, block_input_number0, block_condition0,
            block_text, block_heading, block_divider, block_quote, block_text1,
            block_radio, block_text2, block_options, block_condition, block_text3, block_input_text, block_text4,
            block_input_email, block_text5, block_input_number, block_text_finish
        ],
        saveUrl='http://127.0.0.1:5678/save?dst=http%3A//127.0.0.1%3A5678/dst'
    )

    return sample_page
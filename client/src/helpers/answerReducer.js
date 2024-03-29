// enums
import * as answers from '../constants/Answers';

const reducerHelper = {
  /**
   * * Reducer Helper
   * The Reducer is initalized in the QuestionEditor component.
   * The dispatch method is passed down to the component that recieves the user input.
   * Then dispatch is called with one of the following action types.
   * Each function either adds, removes or changes a value of the answer object.
   * The answer object only contains one type of answer option. All other keys will be omitted.
   * i.e. addButton() returns only left and right button arrays.
   */

  setDefaultState: (action) => {
    let options = [];
    if (action.payload.answerType === answers.TYPE.SingleChoiceButton) {
      options = { left: [], right: [] };
    }
    return {
      type: action.payload.answerType,
      options
    };
  },
  addButton: (state, action) => {
    const newButton = { id: action.payload.id, title: action.payload.title };
    if (action.payload.position === 'left') {
      const buttonsLeft = state.options.left.concat(newButton);
      return {
        type: answers.TYPE.SingleChoiceButton,
        options: { left: buttonsLeft, right: state.options.right }
      };
    }
    const buttonsRight = state.options.right.concat(newButton);
    return {
      type: answers.TYPE.SingleChoiceButton,
      options: { left: state.options.left, right: buttonsRight }
    };
  },
  removeButton: (state, action) => {
    if (action.payload.position === 'left') {
      const buttonsLeft = state.options.left.filter((button) => button.id !== action.payload.id);
      return {
        ...state,
        options: { left: buttonsLeft, right: state.options.right }
      };
    }
    const buttonsRight = state.options.right.filter((button) => button.id !== action.payload.id);
    return {
      ...state,
      options: { left: state.options.left, right: buttonsRight }
    };
  },
  changeButtonTitle: (state, action) => {
    if (action.payload.position === 'left') {
      const newState = state.options.left.map((el) =>
        el.id === action.payload.id ? { ...el, title: action.payload.title } : el
      );
      return {
        ...state,
        options: { left: newState, right: state.options.right }
      };
    }
    const newState = state.options.right.map((el) =>
      el.id === action.payload.id ? { ...el, title: action.payload.title } : el
    );
    return {
      ...state,
      options: { left: state.options.left, right: newState }
    };
  },
  changeButtonColor: (state, action) => {
    if (action.payload.position === 'left') {
      const newState = state.options.left.map((el) =>
        el.id === action.payload.id ? { ...el, color: action.payload.color } : el
      );
      return {
        ...state,
        options: { left: newState, right: state.options.right }
      };
    }
    const newState = state.options.right.map((el) =>
      el.id === action.payload.id ? { ...el, color: action.payload.color } : el
    );
    return {
      ...state,
      options: { left: state.options.left, right: newState }
    };
  },
  setSkippedQuestions: (state, action) => {
    if (action.payload.position === 'left') {
      const newState = state.options.left.map((el) =>
        el.id === action.payload.id ? { ...el, skip: action.payload.skip } : el
      );
      return {
        ...state,
        options: { left: newState, right: state.options.right }
      };
    }
    const newState = state.options.right.map((el) =>
      el.id === action.payload.id ? { ...el, skip: action.payload.skip } : el
    );
    return {
      ...state,
      options: { left: state.options.left, right: newState }
    };
  },
  setMultipleChoice: (state, action) => {
    if (action.payload.isMultipleChoice) {
      return {
        type: answers.TYPE.MultipleChoiceButton,
        options: state.options,
        isMultipleChoice: action.payload.isMultipleChoice
      };
    }
    return {
      type: answers.TYPE.SingleChoiceButton,
      options: state.options,
      isMultipleChoice: action.payload.isMultipleChoice
    };
  },
  addCard: (state, action) => {
    const newCard = {
      id: action.payload.id,
      title: '',
      imageURL: ''
    };
    const cards = state.options.concat(newCard);
    return {
      type: answers.TYPE.Card,
      options: cards
    };
  },
  changeCardIndex: (state, action) => {
    const newState = state.options.map((el) =>
      el.id === action.payload.id ? { ...el, index: action.payload.index } : el
    );
    return {
      type: answers.TYPE.Card,
      options: newState
    };
  },
  removeCard: (state, action) => {
    const cards = state.options.filter((card) => card.id !== action.payload.id);
    return {
      type: answers.TYPE.Card,
      options: cards
    };
  },
  changeCardTitle: (state, action) => {
    const newState = state.options.map((el) =>
      el.id === action.payload.id ? { ...el, title: action.payload.title } : el
    );
    return {
      type: answers.TYPE.Card,
      options: newState
    };
  },
  changeCardImage: (state, action) => {
    const newState = state.options.map((el) => {
      return el.id === action.payload.id
        ? { ...el, imageURL: action.payload.imageURL, imageData: action.payload.imageData }
        : el;
    });
    return {
      type: answers.TYPE.Card,
      options: newState
    };
  },
  removeCardImage: (state, action) => {
    const newState = state.options.map((el) => {
      return el.id === action.payload.id ? { ...el, imageURL: '', imageData: undefined } : el;
    });
    return {
      type: answers.TYPE.Card,
      options: newState
    };
  },
  addTextInput: (state, action) => {
    const newTextInput = {
      id: action.payload.id,
      title: 'Title',
      hasNumberInput: false
    };
    const textInputs = state.options.concat(newTextInput);
    return {
      type: answers.TYPE.TextInput,
      options: textInputs
    };
  },
  removeTextInput: (state, action) => {
    const textInputs = state.options.filter((textInput) => textInput.id !== action.payload.id);
    return {
      type: answers.TYPE.TextInput,
      options: textInputs
    };
  },
  changeTextInputTitle: (state, action) => {
    const newState = state.options.map((el) =>
      el.id === action.payload.id ? { ...el, title: action.payload.title } : el
    );
    return {
      type: answers.TYPE.TextInput,
      options: newState
    };
  },
  addNumberInput: (state, action) => {
    const newState = state.options.map((el) =>
      el.id === action.payload.id
        ? { ...el, hasNumberInput: true, numberInputTitle: action.payload.numberInputTitle }
        : el
    );
    return {
      type: answers.TYPE.TextInput,
      options: newState
    };
  },
  removeNumberInput: (state, action) => {
    const newState = state.options.map((el) =>
      el.id === action.payload.id ? { ...el, hasNumberInput: false } : el
    );
    return {
      type: answers.TYPE.TextInput,
      options: newState
    };
  },
  changeNumberInputTitle: (state, action) => {
    const newState = state.options.map((el) =>
      el.id === action.payload.id
        ? { ...el, numberInputTitle: action.payload.numberInputTitle }
        : el
    );
    return {
      type: answers.TYPE.TextInput,
      options: newState
    };
  },
  addImage: (state, action) => {
    const newState = state.options.concat({
      id: action.payload.id,
      imageURL: action.payload.imageURL,
      imageData: action.payload.imageData
    });
    return {
      type: 'images',
      options: newState
    };
  },
  removeImage: (state, action) => {
    const newState = state.options.filter((el) => {
      return el.id !== action.payload.id;
    });
    return {
      type: 'images',
      options: newState
    };
  },
  moveImages: (state, action) => {
    const newState = action.payload.movedImages.map((option) => {
      if (option.imageData) {
        return { id: option.id, imageURL: option.src, imageData: option.imageData };
      }
      return { id: option.id, imageURL: option.src };
    });
    return {
      type: 'images',
      options: newState
    };
  }
};

const answerReducer = (state, action) => {
  switch (action.type) {
    case 'setDefaultState':
      return reducerHelper.setDefaultState(action);
    case 'addButton':
      return reducerHelper.addButton(state, action);
    case 'removeButton':
      return reducerHelper.removeButton(state, action);
    case 'changeButtonTitle':
      return reducerHelper.changeButtonTitle(state, action);
    case 'setSkippedQuestions':
      return reducerHelper.setSkippedQuestions(state, action);
    case 'changeButtonColor':
      return reducerHelper.changeButtonColor(state, action);
    case 'setMultipleChoice':
      return reducerHelper.setMultipleChoice(state, action);
    case 'addCard':
      return reducerHelper.addCard(state, action);
    case 'changeCardIndex':
      return reducerHelper.changeCardIndex(state, action);
    case 'removeCard':
      return reducerHelper.removeCard(state, action);
    case 'changeCardTitle':
      return reducerHelper.changeCardTitle(state, action);
    case 'changeCardImage':
      return reducerHelper.changeCardImage(state, action);
    case 'removeCardImage':
      return reducerHelper.removeCardImage(state, action);
    case 'addTextInput':
      return reducerHelper.addTextInput(state, action);
    case 'removeTextInput':
      return reducerHelper.removeTextInput(state, action);
    case 'changeTextInputTitle':
      return reducerHelper.changeTextInputTitle(state, action);
    case 'addNumberInput':
      return reducerHelper.addNumberInput(state, action);
    case 'removeNumberInput':
      return reducerHelper.removeNumberInput(state, action);
    case 'changeNumberInputTitle':
      return reducerHelper.changeNumberInputTitle(state, action);
    case 'addImage':
      return reducerHelper.addImage(state, action);
    case 'removeImage':
      return reducerHelper.removeImage(state, action);
    case 'moveImages':
      return reducerHelper.moveImages(state, action);
    default:
      return state;
  }
};

export default answerReducer;

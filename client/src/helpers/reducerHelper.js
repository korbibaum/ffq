import AnswerType from './answer-type';

const reducerHelper = {
  /**
   * * Reducer Helper
   * These functions are called in the QuestionEditor reducer function.
   * Each function either adds, removes or changes a value of the answer object.
   * The answer object only contains one type of answer option. All other keys will be returned empty.
   * i.e. addButton() returns only frequencyOptions.
   * The other keys for amountOptions and userInputOptions are empty.
   */

  addButton: (state, action) => {
    const newButton = { id: action.payload.id, title: action.payload.title };
    if (action.payload.position === 'left') {
      const buttonsLeft = state.frequencyOptions.left.concat(newButton);
      return {
        type: AnswerType.Frequency,
        frequencyOptions: { left: buttonsLeft, right: state.frequencyOptions.right },
        amountOptions: [],
        userInputOptions: {}
      };
    }
    const buttonsRight = state.frequencyOptions.right.concat(newButton);
    return {
      type: AnswerType.Frequency,
      frequencyOptions: { left: state.frequencyOptions.left, right: buttonsRight },
      amountOptions: [],
      userInputOptions: {}
    };
  },

  removeButton: (state, action) => {
    if (action.payload.position === 'left') {
      const buttonsLeft = state.frequencyOptions.left.filter(
        (button) => button.id !== action.payload.id
      );
      return {
        type: AnswerType.Frequency,
        frequencyOptions: { left: buttonsLeft, right: state.frequencyOptions.right },
        amountOptions: [],
        userInputOptions: {}
      };
    }
    const buttonsRight = state.frequencyOptions.right.filter(
      (button) => button.id !== action.payload.id
    );
    return {
      type: AnswerType.Frequency,
      frequencyOptions: { left: state.frequencyOptions.left, right: buttonsRight },
      amountOptions: [],
      userInputOptions: {}
    };
  },

  changeButtonTitle: (state, action) => {
    if (action.payload.position === 'left') {
      const newState = state.frequencyOptions.left.map((el) =>
        el.id === action.payload.id ? { ...el, title: action.payload.title } : el
      );
      return {
        type: AnswerType.Frequency,
        frequencyOptions: { left: newState, right: state.frequencyOptions.right },
        amountOptions: [],
        userInputOptions: {}
      };
    }
    const newState = state.frequencyOptions.right.map((el) =>
      el.id === action.payload.id ? { ...el, title: action.payload.title } : el
    );
    return {
      type: AnswerType.Frequency,
      frequencyOptions: { left: state.frequencyOptions.left, right: newState },
      amountOptions: [],
      userInputOptions: {}
    };
  },

  addCard: (state, action) => {
    const newCard = {
      id: action.payload.id,
      title: '',
      imageURL: ''
    };
    const cards = state.amountOptions.concat(newCard);
    return {
      type: AnswerType.Amount,
      frequencyOptions: { left: [], right: [] },
      amountOptions: cards,
      userInputOptions: {}
    };
  },
  removeCard: (state, action) => {
    const cards = state.amountOptions.filter((card) => card.id !== action.payload.id);
    return {
      type: AnswerType.Amount,
      frequencyOptions: { left: [], right: [] },
      amountOptions: cards,
      userInputOptions: {}
    };
  },
  changeCardTitle: (state, action) => {
    const newState = state.amountOptions.map((el) =>
      el.id === action.payload.id ? { ...el, title: action.payload.title } : el
    );
    return {
      type: AnswerType.Amount,
      frequencyOptions: { left: [], right: [] },
      amountOptions: newState,
      userInputOptions: {}
    };
  },
  changeCardImage: (state, action) => {
    console.log(action);
    const newState = state.amountOptions.map((el) => {
      return el.id === action.payload.id
        ? { ...el, imageURL: URL.createObjectURL(action.payload.image) }
        : el;
    });
    console.log('newState', newState);
    return {
      type: AnswerType.Amount,
      frequencyOptions: { left: [], right: [] },
      amountOptions: newState,
      userInputOptions: {}
    };
  }
};

export default reducerHelper;

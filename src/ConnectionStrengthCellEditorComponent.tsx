import * as React from "react";
import {ICellEditorParams} from "ag-grid-community";
import autobind from "autobind-decorator";

const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_F2 = 113;

interface LocalState {
  highlightAllOnFocus: boolean;
  startValue?: number;
  value: string;
}

/**
 * copied and modified from ag-grid example NumericCellEditor https://www.ag-grid.com/javascript-grid-cell-editor/#cell-editing-example
 */
export class ConnectionStrengthCellEditorComponent extends React.Component<ICellEditorParams, LocalState> {
  private readonly inputRef: React.RefObject<HTMLInputElement>;
  private readonly cancelBeforeStart: boolean;

  constructor(props: ICellEditorParams) {
    super(props);

    this.cancelBeforeStart = this.props.charPress && !this.isCharNumeric(this.props.charPress);
    this.inputRef = React.createRef();
    this.state = this.createInitialState(props);
  }

  createInitialState(props): LocalState {
    let startValue;
    let highlightAllOnFocus = true;

    if (props.keyPress === KEY_BACKSPACE || props.keyPress === KEY_DELETE) {
      // if backspace or delete pressed, we clear the cell
      startValue = '';
    } else if (props.charPress) {
      // if a letter was pressed, we start with the letter
      startValue = props.charPress;
      highlightAllOnFocus = false;
    } else {
      // otherwise we start with the current value
      startValue = props.value;
      if (props.keyPress === KEY_F2) {
        highlightAllOnFocus = false;
      }
    }

    return {
      value: startValue,
      highlightAllOnFocus
    }
  }

  componentDidMount() {
    this.inputRef.current.addEventListener('keydown', this.onKeyDown);

  }

  componentWillUnmount() {
    this.inputRef.current.removeEventListener('keydown', this.onKeyDown);
  }

  afterGuiAttached() {
    // get ref from React component
    const eInput = this.inputRef.current;
    eInput.focus();
    if (this.state.highlightAllOnFocus) {
      eInput.select();

      this.setState({
        highlightAllOnFocus: false
      })
    } else {
      // when we started editing, we want the carot at the end, not the start.
      // this comes into play in two scenarios: a) when user hits F2 and b)
      // when user hits a printable character, then on IE (and only IE) the carot
      // was placed after the first character, thus 'apply' would end up as 'pplea'
      const length = eInput.value ? eInput.value.length : 0;
      if (length > 0) {
        eInput.setSelectionRange(length, length);
      }
    }
  }

  getValue(): number | undefined {
    let value: any = this.state.value;
    if(typeof value === "string"){
      value = parseFloat(this.state.value.replace(",", "."));
    }
    return isNaN(value) ? undefined : value;
  }

  isCancelBeforeStart(): boolean {
    return this.cancelBeforeStart;
  }

  @autobind onKeyDown(event): void {
    if (this.isLeftOrRight(event) || this.isDeleteOrBackspace(event)) {
      event.stopPropagation();
      return;
    }

    if (!this.isKeyPressedNumeric(event)) {
      if (event.preventDefault) event.preventDefault();
    }
  }

  isLeftOrRight(event): boolean {
    return [37, 39].indexOf(event.keyCode) > -1;
  }

  @autobind handleChange(event): void {
    this.setState({value: event.target.value});
  }

  getCharCodeFromEvent(event): number {
    event = event || window.event;
    return (typeof event.which === "undefined") ? event.keyCode : event.which;
  }

  isCharNumeric(charStr: string): boolean {
    return /[0-9-.,]/.test(charStr);
  }

  isKeyPressedNumeric(event): boolean {
    const charCode = this.getCharCodeFromEvent(event);
    const charStr = event.key ? event.key : String.fromCharCode(charCode);
    return this.isCharNumeric(charStr);
  }

  render(): JSX.Element {
    return (
        <input ref={this.inputRef}
               value={this.state.value}
               onChange={this.handleChange}
               style={{width: "100%"}}
        />
    );
  }

  isDeleteOrBackspace(event): boolean {
    return [KEY_DELETE, KEY_BACKSPACE].indexOf(event.keyCode) > -1;
  }
}